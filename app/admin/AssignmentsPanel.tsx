'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import type { KeyRow } from './KeysTable'
import {
  listAssignmentUsers,
  assignKeyToUser,
  unassignKey,
  type AssignmentUser,
} from './actions'

type Props = {
  keys: KeyRow[]
}

function formatDate(iso: string | null) {
  if (!iso) return 'No expiry'
  return new Date(iso).toISOString().slice(0, 10)
}

export function AssignmentsPanel({ keys }: Props) {
  const [users, setUsers] = useState<AssignmentUser[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [pendingKeyId, setPendingKeyId] = useState('')
  const [isPending, startTransition] = useTransition()

  async function reload() {
    const res = await listAssignmentUsers()
    if (res.ok) {
      setUsers(res.users)
      setLoadError(null)
    } else {
      setLoadError(res.error)
    }
    setLoading(false)
  }

  useEffect(() => {
    reload()
  }, [])

  const filtered = useMemo(() => {
    if (!query) return users
    const q = query.toLowerCase()
    return users.filter(
      (u) => (u.email ?? '').toLowerCase().includes(q) || u.id.toLowerCase().includes(q),
    )
  }, [users, query])

  const selected = users.find((u) => u.id === selectedId) ?? null
  const assignedKeyIds = new Set(selected?.assignments.map((a) => a.license_key_id) ?? [])

  const eligibleKeys = useMemo(
    () =>
      keys.filter(
        (k) =>
          k.status === 'active' && k.current_uses < k.max_uses && !assignedKeyIds.has(k.id),
      ),
    [keys, assignedKeyIds],
  )

  function handleUnassign(userLicenseKeyId: string) {
    startTransition(async () => {
      setActionError(null)
      const res = await unassignKey(userLicenseKeyId)
      if (!res.ok) {
        setActionError(res.error)
        return
      }
      await reload()
    })
  }

  function handleAssign() {
    if (!selected || !pendingKeyId) return
    startTransition(async () => {
      setActionError(null)
      const res = await assignKeyToUser(selected.id, pendingKeyId)
      if (!res.ok) {
        setActionError(res.error)
        return
      }
      setPendingKeyId('')
      await reload()
    })
  }

  return (
    <section className="admin-card admin-card-wide" aria-labelledby="admin-assignments-title">
      <div className="admin-card-head">
        <div className="admin-form-id">
          <span>Form AX-003 · Seat Assignments</span>
          <span className="admin-form-id-right">Restricted</span>
        </div>
        <h1 id="admin-assignments-title" className="admin-card-title">Manual Assignments</h1>
        <p className="admin-card-subtitle">
          Attach or detach license keys on behalf of a user. Use when someone has lost their key,
          needs a different group, or should be switched between seats. Unassigning frees a seat on
          the original key immediately.
        </p>
      </div>

      <div className="admin-card-body">
        {loading ? (
          <p className="admin-assign-loading">Loading users…</p>
        ) : loadError ? (
          <p className="admin-error" role="alert">{loadError}</p>
        ) : (
          <>
            <div className="admin-field">
              <label htmlFor="assign-user-search" className="admin-label">Find user</label>
              <input
                id="assign-user-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by email or account ID"
                className="admin-input admin-input-mono"
                autoComplete="off"
              />
            </div>

            <div className="admin-user-list" role="listbox" aria-label="Users">
              {filtered.length === 0 ? (
                <p className="admin-user-empty">
                  {query ? `No users match “${query}”` : 'No users yet.'}
                </p>
              ) : (
                filtered.slice(0, 50).map((u) => {
                  const isActive = selectedId === u.id
                  const count = u.assignments.length
                  return (
                    <button
                      key={u.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        setSelectedId(u.id)
                        setActionError(null)
                        setPendingKeyId('')
                      }}
                      className={`admin-user-row${isActive ? ' is-selected' : ''}`}
                    >
                      <span className="admin-user-email">{u.email ?? '(no email)'}</span>
                      <span
                        className={`admin-user-meta${count === 0 ? ' is-empty' : ''}`}
                      >
                        {count === 0 ? 'no keys' : `${count} key${count === 1 ? '' : 's'}`}
                      </span>
                    </button>
                  )
                })
              )}
              {filtered.length > 50 && (
                <p className="admin-user-overflow">
                  Showing first 50 of {filtered.length}. Refine your search to narrow the list.
                </p>
              )}
            </div>

            {selected && (
              <div className="admin-assign-detail">
                <div className="admin-assign-user">
                  <span className="admin-assign-user-label">Selected</span>
                  <span className="admin-assign-user-email">{selected.email ?? '(no email)'}</span>
                  <span className="admin-assign-user-id">{selected.id}</span>
                </div>

                <div className="admin-assign-section">
                  <div className="admin-assign-section-head">
                    <span>Current assignments</span>
                    <span className="admin-assign-count">{selected.assignments.length}</span>
                  </div>
                  {selected.assignments.length === 0 ? (
                    <p className="admin-assign-empty">
                      No keys assigned. Select one below to grant access.
                    </p>
                  ) : (
                    <ul className="admin-assign-list">
                      {selected.assignments.map((a) => (
                        <li key={a.id} className="admin-assign-item">
                          <div className="admin-assign-item-body">
                            <div className="admin-assign-item-main">
                              <span
                                className="admin-pill admin-pill-group"
                                style={{ ['--g' as never]: a.key.group_color } as React.CSSProperties}
                              >
                                {a.key.group_name}
                              </span>
                              <span className="admin-assign-prefix">{a.key.key_prefix}</span>
                              <span className={`admin-pill admin-pill-status-${a.key.status}`}>
                                {a.key.status}
                              </span>
                            </div>
                            <div className="admin-assign-item-meta">
                              {formatDate(a.key.expires_at) === 'No expiry'
                                ? 'No expiry'
                                : `Expires ${formatDate(a.key.expires_at)}`}
                              {' · '}
                              {a.key.current_uses}/{a.key.max_uses} uses
                              {' · '}
                              Redeemed {formatDate(a.redeemed_at)}
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleUnassign(a.id)}
                            className="admin-btn-ghost admin-assign-unassign"
                          >
                            Unassign
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="admin-assign-section">
                  <div className="admin-assign-section-head">
                    <span>Assign additional key</span>
                    <span className="admin-assign-count">{eligibleKeys.length} available</span>
                  </div>
                  {eligibleKeys.length === 0 ? (
                    <p className="admin-assign-empty">
                      No eligible keys — all active keys are either at capacity or already held by this user.
                    </p>
                  ) : (
                    <div className="admin-assign-form">
                      <select
                        value={pendingKeyId}
                        onChange={(e) => setPendingKeyId(e.target.value)}
                        className="admin-input admin-input-mono admin-assign-select"
                        aria-label="Select a key to assign"
                      >
                        <option value="">Select a key…</option>
                        {eligibleKeys.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.key_prefix} · {k.group_name.toUpperCase()} · {k.current_uses}/{k.max_uses}
                            {' · '}
                            {k.expires_at ? formatDate(k.expires_at) : 'no expiry'}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAssign}
                        disabled={isPending || !pendingKeyId}
                        className="admin-submit admin-assign-submit"
                      >
                        <span>{isPending ? 'Assigning…' : 'Assign key'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {actionError && (
                  <p className="admin-error" role="alert">{actionError}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
