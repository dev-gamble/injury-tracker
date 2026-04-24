import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth/admin'
import { redirect } from 'next/navigation'
import { AdminConsole } from './AdminConsole'
import type { KeyRow } from './KeysTable'

export const dynamic = 'force-dynamic'

type RawRow = {
  id: string
  key_prefix: string
  tier: 'demo' | 'free' | 'full' | 'partner'
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
  const { data, error } = await admin
    .from('license_keys')
    .select('id, key_prefix, tier, status, max_uses, current_uses, expires_at, notes, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  const rows: KeyRow[] = (data ?? []).map((r: RawRow) => {
    const expired = r.expires_at !== null && new Date(r.expires_at).getTime() <= Date.now()
    const effectiveStatus: KeyRow['status'] =
      r.status === 'active' && expired ? 'expired' : r.status
    return { ...r, status: effectiveStatus }
  })

  return <AdminConsole rows={rows} errorMessage={error?.message ?? null} />
}
