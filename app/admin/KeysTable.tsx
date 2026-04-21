'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

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

type Tier = KeyRow['tier']
type Status = KeyRow['status']
type ExpiresFilter = 'any' | 'expires-7d' | 'expires-30d' | 'has-expiry' | 'never' | 'expired'
type IssuedFilter = 'any' | '24h' | '7d' | '30d' | '90d'
type FilterColumn = 'tier' | 'status' | 'expires' | 'issued'

const TIER_OPTS: { value: Tier; label: string }[] = [
  { value: 'demo',    label: 'Demo' },
  { value: 'free',    label: 'Free' },
  { value: 'full',    label: 'Full' },
  { value: 'partner', label: 'Partner' },
]

const STATUS_OPTS: { value: Status; label: string }[] = [
  { value: 'active',  label: 'Active' },
  { value: 'revoked', label: 'Revoked' },
  { value: 'expired', label: 'Expired' },
]

const EXPIRES_OPTS: { value: ExpiresFilter; label: string }[] = [
  { value: 'any',         label: 'Any' },
  { value: 'expires-7d',  label: 'Within 7 days' },
  { value: 'expires-30d', label: 'Within 30 days' },
  { value: 'has-expiry',  label: 'Has expiry' },
  { value: 'never',       label: 'Never expires' },
  { value: 'expired',     label: 'Already expired' },
]

const ISSUED_OPTS: { value: IssuedFilter; label: string }[] = [
  { value: 'any', label: 'Any time' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d',  label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

const DAY_MS = 86_400_000

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

function matchesExpires(row: KeyRow, filter: ExpiresFilter): boolean {
  if (filter === 'any') return true
  if (filter === 'never') return row.expires_at === null
  if (row.expires_at === null) return false
  const ts = new Date(row.expires_at).getTime()
  const now = Date.now()
  if (filter === 'has-expiry') return true
  if (filter === 'expired') return ts <= now
  if (filter === 'expires-7d') return ts > now && ts - now <= 7 * DAY_MS
  if (filter === 'expires-30d') return ts > now && ts - now <= 30 * DAY_MS
  return true
}

function matchesIssued(row: KeyRow, filter: IssuedFilter): boolean {
  if (filter === 'any') return true
  const ts = new Date(row.created_at).getTime()
  const delta = Date.now() - ts
  if (filter === '24h') return delta <= DAY_MS
  if (filter === '7d')  return delta <= 7 * DAY_MS
  if (filter === '30d') return delta <= 30 * DAY_MS
  if (filter === '90d') return delta <= 90 * DAY_MS
  return true
}

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

export function KeysTable({ rows }: { rows: KeyRow[] }) {
  const [tierFilter, setTierFilter] = useState<Set<Tier>>(new Set())
  const [statusFilter, setStatusFilter] = useState<Set<Status>>(new Set())
  const [expiresFilter, setExpiresFilter] = useState<ExpiresFilter>('any')
  const [issuedFilter, setIssuedFilter] = useState<IssuedFilter>('any')
  const [openCol, setOpenCol] = useState<FilterColumn | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openCol) return
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenCol(null)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenCol(null)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [openCol])

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (tierFilter.size > 0 && !tierFilter.has(row.tier)) return false
      if (statusFilter.size > 0 && !statusFilter.has(row.status)) return false
      if (!matchesExpires(row, expiresFilter)) return false
      if (!matchesIssued(row, issuedFilter)) return false
      return true
    })
  }, [rows, tierFilter, statusFilter, expiresFilter, issuedFilter])

  const hasFilters =
    tierFilter.size > 0 ||
    statusFilter.size > 0 ||
    expiresFilter !== 'any' ||
    issuedFilter !== 'any'

  function clearAll() {
    setTierFilter(new Set())
    setStatusFilter(new Set())
    setExpiresFilter('any')
    setIssuedFilter('any')
    setOpenCol(null)
  }

  function toggleOpen(col: FilterColumn) {
    setOpenCol((curr) => (curr === col ? null : col))
  }

  return (
    <div className="admin-table-wrap" ref={rootRef}>
      {hasFilters && (
        <div className="admin-table-filter-bar">
          <span className="admin-table-filter-count">
            Showing <strong>{filtered.length}</strong> of {rows.length}
          </span>
          <button type="button" onClick={clearAll} className="admin-table-filter-clear">
            Clear filters
          </button>
        </div>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Prefix</th>
            <FilterHeader
              label="Tier"
              active={tierFilter.size > 0}
              open={openCol === 'tier'}
              onToggle={() => toggleOpen('tier')}
            >
              <div className="admin-filter-title">Filter by tier</div>
              <div className="admin-filter-list">
                {TIER_OPTS.map((o) => {
                  const checked = tierFilter.has(o.value)
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setTierFilter(toggleInSet(tierFilter, o.value))}
                      className={`admin-filter-check${checked ? ' is-checked' : ''}`}
                      role="checkbox"
                      aria-checked={checked}
                    >
                      <span className="admin-filter-box" aria-hidden="true">{checked ? '✓' : ''}</span>
                      <span className={`admin-pill admin-pill-tier-${o.value}`}>{o.value}</span>
                    </button>
                  )
                })}
              </div>
              {tierFilter.size > 0 && (
                <button type="button" onClick={() => setTierFilter(new Set())} className="admin-filter-clear">
                  Clear selection
                </button>
              )}
            </FilterHeader>
            <FilterHeader
              label="Status"
              active={statusFilter.size > 0}
              open={openCol === 'status'}
              onToggle={() => toggleOpen('status')}
            >
              <div className="admin-filter-title">Filter by status</div>
              <div className="admin-filter-list">
                {STATUS_OPTS.map((o) => {
                  const checked = statusFilter.has(o.value)
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setStatusFilter(toggleInSet(statusFilter, o.value))}
                      className={`admin-filter-check${checked ? ' is-checked' : ''}`}
                      role="checkbox"
                      aria-checked={checked}
                    >
                      <span className="admin-filter-box" aria-hidden="true">{checked ? '✓' : ''}</span>
                      <span className={`admin-pill admin-pill-status-${o.value}`}>{o.value}</span>
                    </button>
                  )
                })}
              </div>
              {statusFilter.size > 0 && (
                <button type="button" onClick={() => setStatusFilter(new Set())} className="admin-filter-clear">
                  Clear selection
                </button>
              )}
            </FilterHeader>
            <th>Uses</th>
            <FilterHeader
              label="Expires"
              active={expiresFilter !== 'any'}
              open={openCol === 'expires'}
              onToggle={() => toggleOpen('expires')}
            >
              <div className="admin-filter-title">Filter by expiry</div>
              <div className="admin-filter-list">
                {EXPIRES_OPTS.map((o) => {
                  const checked = expiresFilter === o.value
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => { setExpiresFilter(o.value); setOpenCol(null) }}
                      className={`admin-filter-radio${checked ? ' is-checked' : ''}`}
                      role="radio"
                      aria-checked={checked}
                    >
                      <span className="admin-filter-radio-dot" aria-hidden="true" />
                      <span>{o.label}</span>
                    </button>
                  )
                })}
              </div>
            </FilterHeader>
            <FilterHeader
              label="Issued"
              active={issuedFilter !== 'any'}
              open={openCol === 'issued'}
              onToggle={() => toggleOpen('issued')}
            >
              <div className="admin-filter-title">Filter by issue date</div>
              <div className="admin-filter-list">
                {ISSUED_OPTS.map((o) => {
                  const checked = issuedFilter === o.value
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => { setIssuedFilter(o.value); setOpenCol(null) }}
                      className={`admin-filter-radio${checked ? ' is-checked' : ''}`}
                      role="radio"
                      aria-checked={checked}
                    >
                      <span className="admin-filter-radio-dot" aria-hidden="true" />
                      <span>{o.label}</span>
                    </button>
                  )
                })}
              </div>
            </FilterHeader>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="admin-no-match-cell">
                <div className="admin-no-match">
                  <span className="admin-no-match-glyph">— ∅ —</span>
                  <span>No records match the current filters.</span>
                  <button type="button" onClick={clearAll} className="admin-no-match-btn">
                    Clear filters
                  </button>
                </div>
              </td>
            </tr>
          ) : (
            filtered.map((row) => {
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
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

function FilterHeader({
  label,
  active,
  open,
  onToggle,
  children,
}: {
  label: string
  active: boolean
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState<'down' | 'up'>('down')

  useLayoutEffect(() => {
    if (!open) return
    const btn = btnRef.current
    const pop = popRef.current
    if (!btn) return
    const btnRect = btn.getBoundingClientRect()
    // Prefer the popover's measured height, else fall back to a safe estimate.
    const popHeight = pop?.offsetHeight ?? 300
    const spaceBelow = window.innerHeight - btnRect.bottom
    const spaceAbove = btnRect.top
    if (spaceBelow < popHeight + 16 && spaceAbove > spaceBelow) {
      setDirection('up')
    } else {
      setDirection('down')
    }
  }, [open])

  return (
    <th className="admin-th-filter">
      <button
        ref={btnRef}
        type="button"
        onClick={onToggle}
        className={`admin-th-btn${active ? ' is-active' : ''}${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{label}</span>
        {active && <span className="admin-th-dot" aria-hidden="true" />}
        <span className="admin-th-caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <div
          ref={popRef}
          className={`admin-filter-pop${direction === 'up' ? ' is-up' : ''}`}
          role="dialog"
          aria-label={`${label} filter`}
        >
          {children}
        </div>
      )}
    </th>
  )
}
