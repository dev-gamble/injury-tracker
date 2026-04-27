import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe/server'
import { errorToFields, logger, safeFlush } from '@/lib/logging'
import { attachRequestIdHeader, getOrCreateRequestId } from '@/lib/logging/request-id'

export const runtime = 'nodejs'

// Returns a Customer Portal URL so a subscriber can manage their plan, update
// payment method, or cancel. Only works once we've recorded a customer id for
// this user — i.e. after a successful checkout.
export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const log = logger('stripe.portal').with({ requestId })

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return attachRequestIdHeader(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        requestId,
      )
    }

    const admin = createAdminClient()
    const { data: row } = await admin
      .from('stripe_user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!row?.stripe_customer_id) {
      return attachRequestIdHeader(
        NextResponse.json({ error: 'No Stripe customer on file' }, { status: 404 }),
        requestId,
      )
    }

    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: row.stripe_customer_id,
      return_url: `${request.nextUrl.origin}/`,
    })

    log.info('portal.created', { userId: user.id })
    return attachRequestIdHeader(
      NextResponse.json({ url: session.url }),
      requestId,
    )
  } catch (error) {
    log.error('portal.failed', { error: errorToFields(error) })
    return attachRequestIdHeader(
      NextResponse.json({ error: 'Failed to open portal' }, { status: 500 }),
      requestId,
    )
  } finally {
    await safeFlush(log)
  }
}
