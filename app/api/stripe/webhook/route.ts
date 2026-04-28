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
const HANDLED_EVENTS = new Set<Stripe.Event['type']>([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

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
  const fromSub = sub.metadata?.supabase_user_id
  if (fromSub) return fromSub

  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
  const customer = await stripe.customers.retrieve(customerId)
  if (customer.deleted) return null
  return customer.metadata?.supabase_user_id ?? null
}

async function upsertSubscription(sub: Stripe.Subscription) {
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

  const admin = createAdminClient()
  const { error } = await admin
    .from('stripe_user_subscriptions')
    .upsert(
      {
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
      },
      { onConflict: 'stripe_subscription_id' },
    )

  if (error) {
    throw new Error(`Upsert failed: ${error.message}`)
  }
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
  await upsertSubscription(sub)
}
