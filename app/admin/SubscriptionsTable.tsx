'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { SubscriptionRow } from './actions'

type StatusClass = 'active' | 'canceling' | 'canceled'
type FilterColumn = 'status' | 'started'
type StartedFilter = 'any' | '24h' | '7d' | '30d' | '90d'

const DAY_MS = 86_400_000

// Three-state taxonomy (mirrors classifyRow in SubscriptionsPanel):
//   canceled  — terminal, no access
//   canceling — entitled until current_period_end, but cancellation scheduled
//   active    — entitled with no cancellation scheduled
function classify(r: SubscriptionRow): StatusClass {
  const terminal = ['canceled', 'incomplete_expired', 'unpaid', 'incomplete', 'paused']
  if (terminal.includes(r.status)) return 'canceled'
  const scheduledToEnd = r.cancel_at !== null || r.cancel_at_period_end === true
  if (scheduledToEnd) return 'canceling'
  return 'active'
}

const STATUS_OPTS: { value: StatusClass; label: string }[] = [
  { value: 'active',    label: 'Active' },
  { value: 'canceling', label: 'Canceling' },
  { value: 'canceled',  label: 'Canceled' },
]

const STARTED_OPTS: { value: StartedFilter; label: string }[] = [
  { value: 'any', label: 'Any time' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d',  label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

function formatDate(iso: string | null): { label: string; never: boolean } {
  if (!iso) return { label: '—', never: true }
  try {
    const d = new Date(iso)
    return {
      label: `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)} UTC`,
      never: false,
    }
  } catch {
    return { label: iso, never: false }
  }
}

function formatPrice(r: SubscriptionRow): string {
  if (!r.unit_amount || !r.recurring_interval) return '—'
  const amount = (r.unit_amount / 100).toLocaleString('en-US', {
    minimumFractionDigits: r.unit_amount % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  const sym = (r.currency ?? 'usd').toLowerCase() === 'usd' ? '$' : ''
  const cur = !sym ? ` ${(r.currency ?? '').toUpperCase()}` : ''
  const count = r.recurring_interval_count ?? 1
  const intervalLabel = count === 1 ? r.recurring_interval : `${count} ${r.recurring_interval}s`
  return `${sym}${amount}${cur} / ${intervalLabel}`
}

function formatRenewsOrEnds(r: SubscriptionRow): { label: string; tone: 'normal' | 'warn' | 'mute' } {
  const cls = classify(r)
  if (cls === 'canceled') {
    if (r.canceled_at) {
      const d = new Date(r.canceled_at)
      return { label: `Ended ${d.toISOString().slice(0, 10)}`, tone: 'mute' }
    }
    return { label: 'Ended', tone: 'mute' }
  }
  if (cls === 'canceling') {
    const ts = r.cancel_at ?? r.current_period_end
    if (ts) {
      const d = new Date(ts)
      return { label: `Ends ${d.toISOString().slice(0, 10)}`, tone: 'warn' }
    }
    return { label: 'Ending', tone: 'warn' }
  }
  if (r.current_period_end) {
    const d = new Date(r.current_period_end)
    return { label: `Renews ${d.toISOString().slice(0, 10)}`, tone: 'normal' }
  }
  return { label: '—', tone: 'mute' }
}

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

function matchesStarted(r: SubscriptionRow, f: StartedFilter): boolean {
  if (f === 'any') return true
  const delta = Date.now() - new Date(r.created_at).getTime()
  if (f === '24h') return delta <= DAY_MS
  if (f === '7d')  return delta <= 7 * DAY_MS
  if (f === '30d') return delta <= 30 * DAY_MS
  if (f === '90d') return delta <= 90 * DAY_MS
  return true
}

export function SubscriptionsTable({ rows }: { rows: SubscriptionRow[] }) {
  const [statusFilter, setStatusFilter] = useState<Set<StatusClass>>(new Set())
  const [startedFilter, setStartedFilter] = useState<StartedFilter>('any')
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
    return rows.filter((r) => {
      if (statusFilter.size > 0 && !statusFilter.has(classify(r))) return false
      if (!matchesStarted(r, startedFilter)) return false
      return true
    })
  }, [rows, statusFilter, startedFilter])

  const hasFilters = statusFilter.size > 0 || startedFilter !== 'any'

  function clearAll() {
    setStatusFilter(new Set())
    setStartedFilter('any')
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
      <table className="admin-table subs-table">
        <thead>
          <tr>
            <th>Customer</th>
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
                      <span className={`admin-pill subs-pill-${o.value}`}>{o.label}</span>
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
            <th>Price</th>
            <th>Renews / Ends</th>
            <FilterHeader
              label="Started"
              active={startedFilter !== 'any'}
              open={openCol === 'started'}
              onToggle={() => toggleOpen('started')}
            >
              <div className="admin-filter-title">Filter by start date</div>
              <div className="admin-filter-list">
                {STARTED_OPTS.map((o) => {
                  const checked = startedFilter === o.value
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => { setStartedFilter(o.value); setOpenCol(null) }}
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
            <th className="admin-th-actions" aria-label="Actions"><span className="admin-th-actions-label">·</span></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} className="admin-no-match-cell">
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
              const cls = classify(row)
              const renewLabel = formatRenewsOrEnds(row)
              const started = formatDate(row.created_at)
              const stripeUrl = `https://dashboard.stripe.com/${row.stripe_subscription_id.startsWith('sub_test') ? 'test/' : ''}subscriptions/${row.stripe_subscription_id}`
              return (
                <tr key={row.id}>
                  <td>
                    <div className="subs-cell-customer">
                      <span className="subs-cell-email">{row.email ?? '—'}</span>
                      <span className="subs-cell-subid">{row.stripe_subscription_id}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-pill subs-pill-${cls}`}>{cls}</span>
                  </td>
                  <td>
                    <span className="subs-cell-price">{formatPrice(row)}</span>
                  </td>
                  <td>
                    <span className={`admin-cell-date subs-cell-renews subs-cell-renews-${renewLabel.tone}`}>
                      {renewLabel.label}
                    </span>
                  </td>
                  <td>
                    <span className="admin-cell-date">{started.label}</span>
                  </td>
                  <td className="admin-cell-actions">
                    <a
                      href={stripeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="subs-stripe-link"
                      aria-label="Open in Stripe dashboard"
                      title="Open in Stripe"
                    >
                      <span aria-hidden="true">↗</span>
                    </a>
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
    const popHeight = pop?.offsetHeight ?? 300
    const spaceBelow = window.innerHeight - btnRect.bottom
    const spaceAbove = btnRect.top
    setDirection(spaceBelow < popHeight + 16 && spaceAbove > spaceBelow ? 'up' : 'down')
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
