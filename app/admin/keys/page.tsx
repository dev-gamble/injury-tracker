import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { KeysTable, type KeyRow } from './KeysTable'

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

export default async function AdminKeysRegistryPage() {
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

  const totalActive = rows.filter((r) => r.status === 'active').length
  const totalExpired = rows.filter((r) => r.status === 'expired').length
  const totalRevoked = rows.filter((r) => r.status === 'revoked').length
  const totalRedemptions = rows.reduce((sum, r) => sum + r.current_uses, 0)

  return (
    <section className="admin-card admin-card-wide" aria-labelledby="admin-card-title">
      <div className="admin-card-head">
        <div className="admin-form-id">
          <span>Registry · License Credentials</span>
          <span className="admin-form-id-right">{rows.length} record{rows.length === 1 ? '' : 's'}</span>
        </div>
        <div className="admin-card-head-row">
          <div>
            <h1 id="admin-card-title" className="admin-card-title">Key Registry</h1>
            <p className="admin-card-subtitle">
              Issued license keys. Hashes are stored; raw keys are never retrievable after creation. Showing the most recent 200 records.
            </p>
          </div>
          <Link href="/admin/keys/issue" className="admin-card-head-cta">
            <span>+ New Key</span>
          </Link>
        </div>
      </div>

      {!error && rows.length > 0 && (
        <div className="admin-stats" role="group" aria-label="Registry summary">
          <div className="admin-stat">
            <span className="admin-stat-label">Active</span>
            <span className="admin-stat-val is-good">{totalActive}</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-label">Expired</span>
            <span className="admin-stat-val">{totalExpired}</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-label">Revoked</span>
            <span className="admin-stat-val is-warn">{totalRevoked}</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-label">Redemptions</span>
            <span className="admin-stat-val">{totalRedemptions}</span>
          </div>
        </div>
      )}

      {error ? (
        <div className="admin-empty">
          <div className="admin-empty-glyph">!</div>
          <h2 className="admin-empty-title">Unable to load registry</h2>
          <p className="admin-empty-body">{error.message}</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-glyph">— ○ —</div>
          <h2 className="admin-empty-title">No keys issued yet</h2>
          <p className="admin-empty-body">
            The registry is empty. Issue a first credential to get started; partners, demos, and comps all start here.
          </p>
          <Link href="/admin/keys/issue" className="admin-empty-cta">
            Issue first key →
          </Link>
        </div>
      ) : (
        <KeysTable rows={rows} />
      )}
    </section>
  )
}
