import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth/admin'
import { redirect } from 'next/navigation'
import { AdminConsole } from './AdminConsole'
import type { KeyRow } from './KeysTable'
import type { SubscriptionRow } from './actions'

export const dynamic = 'force-dynamic'

type RawRow = {
  id: string
  key_prefix: string
  group_name: string
  group_color: string
  status: 'active' | 'revoked' | 'expired'
  max_uses: number
  current_uses: number
  expires_at: string | null
  notes: string | null
  created_at: string
}

export default async function AdminPage() {
  // Defense in depth: the layout and middleware already gate admin, but the
  // page itself reaches for the service-role client — re-verify locally so a
  // future refactor (nested route without the layout, layout check regressed)
  // can't silently hand a non-admin the service role.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) redirect('/')

  const admin = createAdminClient()

  const [keysResult, subsResult, usersResult] = await Promise.all([
    admin
      .from('license_keys')
      .select('id, key_prefix, group_name, group_color, status, max_uses, current_uses, expires_at, notes, created_at')
      .order('created_at', { ascending: false })
      .limit(200),
    admin
      .from('stripe_user_subscriptions')
      .select(
        'id, user_id, stripe_customer_id, stripe_subscription_id, stripe_price_id, status, current_period_end, cancel_at_period_end, cancel_at, canceled_at, unit_amount, currency, recurring_interval, recurring_interval_count, livemode, discount_amount_off, discount_percent_off, discount_promotion_code, discount_duration, discount_duration_in_months, discount_end, created_at, updated_at',
      )
      .order('created_at', { ascending: false })
      .limit(500),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ])

  const rows: KeyRow[] = (keysResult.data ?? []).map((r: RawRow) => {
    const expired = r.expires_at !== null && new Date(r.expires_at).getTime() <= Date.now()
    const effectiveStatus: KeyRow['status'] =
      r.status === 'active' && expired ? 'expired' : r.status
    return { ...r, status: effectiveStatus }
  })

  const emailById = new Map<string, string | null>()
  if (!usersResult.error) {
    for (const u of usersResult.data.users) emailById.set(u.id, u.email ?? null)
  }
  const subscriptions: SubscriptionRow[] = (subsResult.data ?? []).map((r) => ({
    id: r.id,
    user_id: r.user_id,
    email: emailById.get(r.user_id) ?? null,
    stripe_customer_id: r.stripe_customer_id,
    stripe_subscription_id: r.stripe_subscription_id,
    stripe_price_id: r.stripe_price_id,
    status: r.status,
    current_period_end: r.current_period_end,
    cancel_at_period_end: r.cancel_at_period_end,
    cancel_at: r.cancel_at,
    canceled_at: r.canceled_at,
    unit_amount: r.unit_amount,
    currency: r.currency,
    recurring_interval: r.recurring_interval,
    recurring_interval_count: r.recurring_interval_count,
    livemode: r.livemode,
    discount_amount_off: r.discount_amount_off,
    discount_percent_off: r.discount_percent_off ? Number(r.discount_percent_off) : null,
    discount_promotion_code: r.discount_promotion_code,
    discount_duration: r.discount_duration,
    discount_duration_in_months: r.discount_duration_in_months,
    discount_end: r.discount_end,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }))

  return (
    <AdminConsole
      rows={rows}
      errorMessage={keysResult.error?.message ?? null}
      subscriptions={subscriptions}
      subsErrorMessage={subsResult.error?.message ?? null}
    />
  )
}
