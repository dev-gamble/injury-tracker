export type KeyRow = {
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

function formatDate(iso: string | null): { label: string; never: boolean } {
  if (!iso) return { label: 'Never', never: true }
  try {
    const d = new Date(iso)
    const date = d.toISOString().slice(0, 10)
    const time = d.toISOString().slice(11, 16)
    return { label: `${date} ${time}`, never: false }
  } catch {
    return { label: iso, never: false }
  }
}

export function KeysTable({ rows }: { rows: KeyRow[] }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Prefix</th>
            <th>Tier</th>
            <th>Status</th>
            <th>Uses</th>
            <th>Expires</th>
            <th>Issued</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const expires = formatDate(row.expires_at)
            const issued = formatDate(row.created_at)
            const exhausted = row.current_uses >= row.max_uses
            return (
              <tr key={row.id}>
                <td>
                  <span className="admin-cell-prefix">{row.key_prefix}</span>
                </td>
                <td>
                  <span className={`admin-pill admin-pill-tier-${row.tier}`}>{row.tier}</span>
                </td>
                <td>
                  <span className={`admin-pill admin-pill-status-${row.status}`}>{row.status}</span>
                </td>
                <td>
                  <span className={`admin-cell-uses${exhausted ? ' is-exhausted' : ''}`}>
                    <strong>{row.current_uses}</strong> / {row.max_uses}
                  </span>
                </td>
                <td>
                  <span className={`admin-cell-date${expires.never ? ' is-never' : ''}`}>
                    {expires.label}
                  </span>
                </td>
                <td>
                  <span className="admin-cell-date">{issued.label}</span>
                </td>
                <td>
                  <div className={`admin-cell-notes${row.notes ? '' : ' is-empty'}`}>
                    {row.notes || '—'}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
