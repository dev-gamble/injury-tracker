import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe/server'
import { getServerEnv } from '@/lib/env'
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
    const origin = request.nextUrl.origin

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

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
      // Reuse the existing customer when we know one; otherwise let Stripe
      // create it from the email and we'll capture the id in the webhook.
      ...(existing?.stripe_customer_id
        ? { customer: existing.stripe_customer_id }
        : { customer_email: user.email ?? undefined }),
      // Carried into the resulting customer/subscription so the webhook can
      // resolve back to a Supabase user even if email changes later.
      client_reference_id: user.id,
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
      success_url: `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subscribe`,
      allow_promotion_codes: true,
    })

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
