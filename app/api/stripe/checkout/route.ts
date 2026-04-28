import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe/server'
import { getServerEnv } from '@/lib/env'
import { getPublicOrigin } from '@/lib/http/public-origin'
import { errorToFields, logger, safeFlush } from '@/lib/logging'
import { attachRequestIdHeader, getOrCreateRequestId } from '@/lib/logging/request-id'

export const runtime = 'nodejs'

// Creates a Stripe Checkout Session for the configured subscription price and
// returns its URL. The browser is expected to navigate to that URL — Stripe
// handles the payment UI on its hosted page.
//
// We reuse a stripe_customer_id when one already exists for this user (from a
// prior subscription, even if it's canceled). Otherwise Stripe creates the
// customer at checkout time and the webhook persists the new id.
export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const log = logger('stripe.checkout').with({ requestId })

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return attachRequestIdHeader(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        requestId,
      )
    }

    const env = getServerEnv()
    const stripe = getStripe()
    // Public-facing origin — required because Stripe redirects the user's
    // browser back here, and request.nextUrl.origin returns the internal
    // proxy address (e.g. 127.0.0.1:8080) on DO App Platform.
    const origin = getPublicOrigin(request)

    // Block direct re-checkout if the caller already has an active or trialing
    // subscription, or any active license key. The /subscribe page bounces
    // these users away too, but POSTs to this route bypass that page guard.
    const { data: hasAccess, error: accessErr } = await supabase.rpc('current_user_has_access')
    if (accessErr) {
      log.warn('checkout.access_check_failed', { userId: user.id, error: errorToFields(accessErr) })
    } else if (hasAccess === true) {
      // For active subscribers, surface the portal URL so the client can
      // redirect there instead of stacking another sub. License-key holders
      // get a generic conflict response (no portal).
      const adminClient = createAdminClient()
      const { data: row } = await adminClient
        .from('stripe_user_subscriptions')
        .select('stripe_customer_id, status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (row?.stripe_customer_id) {
        log.info('checkout.already_subscribed', { userId: user.id })
        return attachRequestIdHeader(
          NextResponse.json(
            { error: 'You already have an active subscription.', code: 'already_subscribed' },
            { status: 409 },
          ),
          requestId,
        )
      }
      log.info('checkout.already_has_access', { userId: user.id })
      return attachRequestIdHeader(
        NextResponse.json(
          { error: 'Your account already has access.', code: 'already_has_access' },
          { status: 409 },
        ),
        requestId,
      )
    }

    const admin = createAdminClient()
    const { data: existing } = await admin
      .from('stripe_user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    // Resolve a Stripe customer for this user before creating the session.
    // Reusing a single customer per user is one half of the race fix; the
    // other half is the idempotency keys below.
    //
    // Lookup order:
    //   1. DB (fast path, works for any user whose webhook has fired once)
    //   2. customers.list({email}) — strongly consistent unlike customers.search
    //   3. customers.create with idempotencyKey=customer-<uid>, so two parallel
    //      requests collapse to a single customer instead of minting two.
    let customerId = existing?.stripe_customer_id ?? null
    if (!customerId && user.email) {
      const list = await stripe.customers.list({ email: user.email, limit: 10 })
      const matched = list.data.find((c) => c.metadata?.supabase_user_id === user.id)
        ?? list.data.find((c) => !c.metadata?.supabase_user_id)
      if (matched) customerId = matched.id
    }
    if (!customerId) {
      const created = await stripe.customers.create(
        {
          email: user.email ?? undefined,
          metadata: { supabase_user_id: user.id },
        },
        { idempotencyKey: `customer-${user.id}` },
      )
      customerId = created.id
    }

    // Stripe-authoritative duplicate guard. Even if our DB hasn't been
    // updated by a webhook yet, this catches an active/trialing sub directly
    // and prevents a user from completing checkout twice in parallel tabs.
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 5,
    })
    const activeSub = subs.data.find(
      (s) => s.status === 'active' || s.status === 'trialing',
    )
    if (activeSub) {
      log.info('checkout.stripe_active_sub_found', {
        userId: user.id,
        subscriptionId: activeSub.id,
      })
      return attachRequestIdHeader(
        NextResponse.json(
          { error: 'You already have an active subscription.', code: 'already_subscribed' },
          { status: 409 },
        ),
        requestId,
      )
    }

    // Reuse an already-open Checkout Session if one exists for this customer
    // — closes the cross-hour-bucket window where the idempotency key alone
    // would let a user create two distinct sessions and pay both. Stripe
    // sessions stay 'open' until paid, expired (24h), or canceled.
    const openSessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: 'open',
      limit: 5,
    })
    const openMatching = openSessions.data.find(
      (s) => s.mode === 'subscription' && !!s.url,
    )
    if (openMatching?.url) {
      log.info('checkout.reused_open_session', {
        userId: user.id,
        sessionId: openMatching.id,
      })
      return attachRequestIdHeader(
        NextResponse.json({ url: openMatching.url }),
        requestId,
      )
    }

    // Idempotency key bucketed per (user, price, hour). Belt-and-suspenders
    // alongside the open-session reuse above: two truly simultaneous POSTs
    // (within the same hour, before either has registered an open session)
    // collapse to a single Checkout Session URL.
    const hourBucket = Math.floor(Date.now() / 3_600_000)
    const sessionIdempotencyKey = `checkout-${user.id}-${env.STRIPE_PRICE_ID}-${hourBucket}`

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'subscription',
        line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
        customer: customerId,
        // Carried into the resulting subscription so the webhook can resolve
        // back to a Supabase user even if email changes later.
        client_reference_id: user.id,
        subscription_data: {
          metadata: { supabase_user_id: user.id },
        },
        success_url: `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/subscribe`,
        allow_promotion_codes: true,
      },
      { idempotencyKey: sessionIdempotencyKey },
    )

    if (!session.url) {
      log.error('checkout.no_url', { userId: user.id, sessionId: session.id })
      return attachRequestIdHeader(
        NextResponse.json({ error: 'Stripe did not return a checkout URL' }, { status: 502 }),
        requestId,
      )
    }

    log.info('checkout.created', { userId: user.id, sessionId: session.id })
    return attachRequestIdHeader(
      NextResponse.json({ url: session.url }),
      requestId,
    )
  } catch (error) {
    log.error('checkout.failed', { error: errorToFields(error) })
    return attachRequestIdHeader(
      NextResponse.json({ error: 'Failed to start checkout' }, { status: 500 }),
      requestId,
    )
  } finally {
    await safeFlush(log)
  }
}
