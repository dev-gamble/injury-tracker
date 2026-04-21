'use client'

import { KeysTable, type KeyRow } from './KeysTable'

type Props = {
  rows: KeyRow[]
  errorMessage: string | null
  onIssue: () => void
}

export function RegistryPanel({ rows, errorMessage, onIssue }: Props) {
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
          <button type="button" onClick={onIssue} className="admin-card-head-cta">
            <span>+ New Key</span>
          </button>
        </div>
      </div>

      {!errorMessage && rows.length > 0 && (
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

      {errorMessage ? (
        <div className="admin-empty">
          <div className="admin-empty-glyph">!</div>
          <h2 className="admin-empty-title">Unable to load registry</h2>
          <p className="admin-empty-body">{errorMessage}</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-glyph">— ○ —</div>
          <h2 className="admin-empty-title">No keys issued yet</h2>
          <p className="admin-empty-body">
            The registry is empty. Issue a first credential to get started; partners, demos, and comps all start here.
          </p>
          <button type="button" onClick={onIssue} className="admin-empty-cta">
            Issue first key →
          </button>
        </div>
      ) : (
        <KeysTable rows={rows} />
      )}
    </section>
  )
}
