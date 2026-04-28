import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe/server'
import { getServerEnv } from '@/lib/env'
import { errorToFields, logger, safeFlush } from '@/lib/logging'

export const runtime = 'nodejs'
// Webhook signature verification requires the exact raw body Stripe sent;
// disabling Next's body parsing and reading request.text() preserves it.
export const dynamic = 'force-dynamic'

// Subscription lifecycle events we mirror into stripe_user_subscriptions.
// checkout.session.completed is included to seed the row immediately when a
// new sub is created — customer.subscription.created arrives in parallel but
// this short-circuits the wait.
//
// customer.discount.* events also re-trigger the upsert: at the moment a
// subscription with a promo code is created, Stripe fires
// customer.subscription.created and customer.discount.created in parallel,
// and the discount may not yet be attached when we retrieve the sub. There's
// no follow-up subscription.updated for the discount landing, so we listen
// for the discount events directly and re-sync the linked subscription.
const HANDLED_EVENTS = new Set<Stripe.Event['type']>([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.discount.created',
  'customer.discount.updated',
  'customer.discount.deleted',
])

type DiscountSnapshot = {
  amountOff: number | null
  percentOff: number | null
  promotionCode: string | null
  duration: string | null
  durationInMonths: number | null
  end: number | null
}

type UpsertSubscriptionOptions = {
  checkoutDiscount?: DiscountSnapshot | null
  clearDiscount?: boolean
}

export async function POST(request: NextRequest) {
  const log = logger('stripe.webhook')

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    log.warn('webhook.missing_signature')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const env = getServerEnv()
  const stripe = getStripe()
  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    log.warn('webhook.signature_invalid', { error: errorToFields(error) })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    log.debug('webhook.ignored', { type: event.type, id: event.id })
    await safeFlush(log)
    return NextResponse.json({ received: true })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object, stripe)
    } else if (
      event.type === 'customer.discount.created' ||
      event.type === 'customer.discount.updated' ||
      event.type === 'customer.discount.deleted'
    ) {
      // Discount events carry a Discount object whose `subscription` field
      // links back to the affected sub. We re-retrieve the sub and run the
      // upsert path so the row picks up the (now attached) discount data.
      const discount = event.data.object as Stripe.Discount | Stripe.DeletedDiscount
      if (discount.subscription) {
        const sub = await stripe.subscriptions.retrieve(discount.subscription)
        await upsertSubscription(sub, { clearDiscount: event.type === 'customer.discount.deleted' })
      } else {
        log.debug('webhook.discount_no_subscription', { type: event.type, id: event.id })
      }
    } else {
      // The three customer.subscription.* events all carry a Subscription as
      // the payload — one upsert path covers create/update/delete.
      await upsertSubscription(event.data.object as Stripe.Subscription)
    }
    log.info('webhook.handled', { type: event.type, id: event.id })
  } catch (error) {
    log.error('webhook.handler_failed', { type: event.type, id: event.id, error: errorToFields(error) })
    // Return 500 so Stripe retries. Don't throw — we still want the response.
    await safeFlush(log)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  await safeFlush(log)
  return NextResponse.json({ received: true })
}

// Resolve the supabase user id for a Stripe subscription. Subscriptions
// created via our checkout carry it in metadata; for ones created via the
// dashboard or imports we fall back to the customer's metadata.
async function resolveUserId(
  sub: Stripe.Subscription,
  stripe: Stripe,
): Promise<string | null> {
  const admin = createAdminClient()
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
  const customer = await stripe.customers.retrieve(customerId)
  const candidates = [
    sub.metadata?.supabase_user_id,
    customer.deleted ? null : customer.metadata?.supabase_user_id,
  ]

  for (const candidate of candidates) {
    if (candidate && await authUserExists(admin, candidate)) {
      return candidate
    }
  }

  if (!customer.deleted && customer.email) {
    return await findAuthUserIdByEmail(admin, customer.email)
  }

  return null
}

type SupabaseAdminClient = ReturnType<typeof createAdminClient>

async function authUserExists(admin: SupabaseAdminClient, userId: string): Promise<boolean> {
  const { data, error } = await admin.auth.admin.getUserById(userId)
  return !error && Boolean(data.user)
}

async function findAuthUserIdByEmail(
  admin: SupabaseAdminClient,
  email: string,
): Promise<string | null> {
  const target = email.toLowerCase()

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) return null

    const user = data.users.find((u) => u.email?.toLowerCase() === target)
    if (user) return user.id
    if (data.users.length < 200) break
  }

  return null
}

async function upsertSubscription(
  sub: Stripe.Subscription,
  options: UpsertSubscriptionOptions = {},
) {
  const stripe = getStripe()
  const userId = await resolveUserId(sub, stripe)
  if (!userId) {
    throw new Error(`Cannot resolve supabase user_id for subscription ${sub.id}`)
  }

  const item = sub.items.data[0]
  const price = item?.price
  const periodEnd = item?.current_period_end ?? null
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  // Unix-seconds → ISO string. In flexible billing mode `cancel_at` is the
  // authoritative scheduled-cancellation timestamp; in legacy mode it's null
  // and `cancel_at_period_end=true` implies the same thing at period end.
  const toIso = (unix: number | null | undefined) =>
    unix ? new Date(unix * 1000).toISOString() : null

  const discount = await getSubscriptionDiscountSnapshot(stripe, sub.id)
    ?? options.checkoutDiscount
    ?? null

  const admin = createAdminClient()
  const payload: Record<string, unknown> = {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    stripe_price_id: price?.id ?? '',
    status: sub.status,
    current_period_end: toIso(periodEnd),
    cancel_at_period_end: sub.cancel_at_period_end,
    cancel_at: toIso(sub.cancel_at),
    canceled_at: toIso(sub.canceled_at),
    unit_amount: price?.unit_amount ?? null,
    currency: price?.currency ?? null,
    recurring_interval: price?.recurring?.interval ?? null,
    recurring_interval_count: price?.recurring?.interval_count ?? null,
  }

  if (discount || options.clearDiscount) {
    payload.discount_amount_off = discount?.amountOff ?? null
    payload.discount_percent_off = discount?.percentOff ?? null
    payload.discount_promotion_code = discount?.promotionCode ?? null
    payload.discount_duration = discount?.duration ?? null
    payload.discount_duration_in_months = discount?.durationInMonths ?? null
    payload.discount_end = toIso(discount?.end)
  }

  const { error } = await admin
    .from('stripe_user_subscriptions')
    .upsert(
      payload,
      { onConflict: 'stripe_subscription_id' },
    )

  if (error) {
    throw new Error(`Upsert failed: ${error.message}`)
  }
}

// Subscription-level discounts cover recurring/ongoing coupons. For newer
// Stripe API versions the Coupon lives under `discount.source.coupon`.
async function getSubscriptionDiscountSnapshot(
  stripe: Stripe,
  subscriptionId: string,
): Promise<DiscountSnapshot | null> {
  const expanded = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['discounts', 'discounts.source.coupon', 'discounts.promotion_code'],
  })
  const first = expanded.discounts?.[0]
  if (!first || typeof first === 'string') return null

  const coupon = first.source?.coupon
  if (!coupon || typeof coupon === 'string') return null

  return {
    amountOff: coupon.amount_off ?? null,
    percentOff: coupon.percent_off ?? null,
    promotionCode:
      first.promotion_code && typeof first.promotion_code !== 'string'
        ? first.promotion_code.code
        : null,
    duration: coupon.duration ?? null,
    durationInMonths: coupon.duration_in_months ?? null,
    end: first.end ?? null,
  }
}

// `allow_promotion_codes` can produce a Checkout-only discount for one-time
// coupons. Those do reduce the initial subscription invoice, but the resulting
// Subscription can legitimately have an empty `discounts` array afterwards.
async function getCheckoutDiscountSnapshot(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  sub: Stripe.Subscription,
): Promise<DiscountSnapshot | null> {
  const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['discounts.coupon', 'discounts.promotion_code.promotion.coupon'],
  })
  const first = expandedSession.discounts?.[0]
  if (!first) return null

  const promotionCode =
    first.promotion_code && typeof first.promotion_code !== 'string'
      ? first.promotion_code
      : null
  const couponRef =
    first.coupon
      ?? (promotionCode?.promotion.type === 'coupon' ? promotionCode.promotion.coupon : null)
  if (!couponRef || typeof couponRef === 'string') return null

  return {
    amountOff: couponRef.amount_off ?? null,
    percentOff: couponRef.percent_off ?? null,
    promotionCode: promotionCode?.code ?? null,
    duration: couponRef.duration ?? null,
    durationInMonths: couponRef.duration_in_months ?? null,
    end: checkoutDiscountEnd(couponRef, sub),
  }
}

function checkoutDiscountEnd(coupon: Stripe.Coupon, sub: Stripe.Subscription): number | null {
  if (coupon.duration === 'forever') return null
  if (coupon.duration === 'repeating' && coupon.duration_in_months) {
    const start = new Date(sub.created * 1000)
    start.setUTCMonth(start.getUTCMonth() + coupon.duration_in_months)
    return Math.floor(start.getTime() / 1000)
  }

  const item = sub.items.data[0]
  return item?.current_period_end ?? null
}

// On checkout completion we may have a customer but no subscription object
// yet (depending on event ordering). Retrieve the subscription explicitly so
// the row is seeded right away rather than waiting on customer.subscription.*.
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
) {
  if (session.mode !== 'subscription' || !session.subscription) return
  const subscriptionId =
    typeof session.subscription === 'string' ? session.subscription : session.subscription.id

  const sub = await stripe.subscriptions.retrieve(subscriptionId)
  // Stripe's checkout doesn't always copy client_reference_id into the
  // subscription's metadata, so backfill it here for resolveUserId().
  if (!sub.metadata?.supabase_user_id && session.client_reference_id) {
    sub.metadata = { ...(sub.metadata ?? {}), supabase_user_id: session.client_reference_id }
  }
  const checkoutDiscount = await getCheckoutDiscountSnapshot(stripe, session, sub)
  await upsertSubscription(sub, { checkoutDiscount })
}
