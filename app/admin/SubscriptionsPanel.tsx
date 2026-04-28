'use client'

import { useMemo, useState } from 'react'
import type { SubscriptionRow } from './actions'
import { RevenueChart } from './RevenueChart'
import { SubscriptionsTable } from './SubscriptionsTable'
import { normalizedRevenue } from './subscriptionMath'

type Props = {
  rows: SubscriptionRow[]
  errorMessage: string | null
}

// Three-state taxonomy used across the admin UI:
//   * canceled  → terminal, no access (covers Stripe canceled / unpaid /
//                 incomplete_expired / incomplete / paused)
//   * canceling → still entitled to access until the period ends, but a
//                 cancellation is scheduled (cancel_at set or
//                 cancel_at_period_end=true). Covers both flexible + legacy
//                 billing modes.
//   * active    → currently entitled with no cancellation scheduled. Trialing
//                 subs and past_due subs (Stripe still retries) are folded in
//                 here since both have working access.
export type SubscriptionClass = 'active' | 'canceling' | 'canceled'

function classifyRow(r: SubscriptionRow): SubscriptionClass {
  const terminal = ['canceled', 'incomplete_expired', 'unpaid', 'incomplete', 'paused']
  if (terminal.includes(r.status)) return 'canceled'
  const scheduledToEnd = r.cancel_at !== null || r.cancel_at_period_end === true
  if (scheduledToEnd) return 'canceling'
  return 'active'
}

export type RevenuePeriod = 'day' | 'week' | 'month'

const PERIOD_OPTS: { value: RevenuePeriod; label: string; abbr: string; bucketDays: number; buckets: number }[] = [
  { value: 'day',   label: 'Daily',   abbr: '24H',  bucketDays: 1,  buckets: 30 },
  { value: 'week',  label: 'Weekly',  abbr: '7D',   bucketDays: 7,  buckets: 12 },
  { value: 'month', label: 'Monthly', abbr: '30D',  bucketDays: 30, buckets: 12 },
]

const DAY_MS = 86_400_000

// Generate a time series of "MRR realized in this bucket" by walking each
// active/canceling sub forward in time and summing the per-day rate over the
// bucket's intersection with [created_at, end_of_active_window]. This is the
// "billed-revenue-pacing" view that finance teams actually want — not the
// spike-on-creation view that a naive count would produce.
function buildRevenueSeries(
  rows: SubscriptionRow[],
  period: RevenuePeriod,
): { buckets: { start: number; end: number; cents: number }[]; total: number } {
  const opt = PERIOD_OPTS.find((p) => p.value === period)!
  const now = Date.now()
  const bucketMs = opt.bucketDays * DAY_MS

  // Anchor the rightmost bucket to "now" and step backwards.
  const buckets: { start: number; end: number; cents: number }[] = []
  for (let i = opt.buckets - 1; i >= 0; i--) {
    const end = now - i * bucketMs
    const start = end - bucketMs
    buckets.push({ start, end, cents: 0 })
  }

  for (const r of rows) {
    const cls = classifyRow(r)
    if (cls === 'canceled') continue
    const { perDay } = normalizedRevenue(r)
    if (perDay <= 0) continue

    const startTs = new Date(r.created_at).getTime()
    // End: cancellation timestamp if scheduled, otherwise "now" (still active).
    const endTs =
      cls === 'canceling'
        ? new Date(r.cancel_at ?? r.current_period_end ?? now).getTime()
        : now

    for (const b of buckets) {
      const overlapStart = Math.max(startTs, b.start)
      const overlapEnd = Math.min(endTs, b.end)
      if (overlapEnd <= overlapStart) continue
      const overlapDays = (overlapEnd - overlapStart) / DAY_MS
      b.cents += perDay * overlapDays
    }
  }

  const total = buckets.reduce((s, b) => s + b.cents, 0)
  return { buckets, total }
}

export function SubscriptionsPanel({ rows, errorMessage }: Props) {
  const [period, setPeriod] = useState<RevenuePeriod>('month')

  const stats = useMemo(() => {
    const counts = { active: 0, canceling: 0, canceled: 0 }
    let mrrCents = 0
    let arrCents = 0
    for (const r of rows) {
      const cls = classifyRow(r)
      counts[cls]++
      // Recognized recurring revenue: anything currently entitled (active or
      // canceling — both still pay through the end of the period). Canceled
      // subs contribute nothing.
      if (cls !== 'canceled') {
        const n = normalizedRevenue(r)
        mrrCents += n.perMonth
        arrCents += n.perYear
      }
    }
    return { counts, mrrCents, arrCents }
  }, [rows])

  const series = useMemo(() => buildRevenueSeries(rows, period), [rows, period])

  const periodOpt = PERIOD_OPTS.find((p) => p.value === period)!

  if (errorMessage) {
    return (
      <section className="admin-card admin-card-wide" aria-labelledby="subs-card-title">
        <div className="admin-card-head">
          <div className="admin-form-id">
            <span>Stripe Ledger</span>
            <span className="admin-form-id-right">— —</span>
          </div>
          <div className="admin-card-head-row">
            <div>
              <h1 id="subs-card-title" className="admin-card-title">Subscriptions</h1>
              <p className="admin-card-subtitle">Real-time mirror of stripe_user_subscriptions.</p>
            </div>
          </div>
        </div>
        <div className="admin-empty">
          <div className="admin-empty-glyph">!</div>
          <h2 className="admin-empty-title">Unable to load ledger</h2>
          <p className="admin-empty-body">{errorMessage}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-card admin-card-wide subs-card" aria-labelledby="subs-card-title">
      <div className="admin-card-head">
        <div className="admin-form-id">
          <span>Stripe Ledger</span>
          <span className="admin-form-id-right">{rows.length} record{rows.length === 1 ? '' : 's'}</span>
        </div>
        <div className="admin-card-head-row">
          <div>
            <h1 id="subs-card-title" className="admin-card-title">Subscriptions</h1>
          </div>
        </div>
      </div>

      {rows.length > 0 && (
        <>
          {/* Status tiles — same chrome as the registry's stats bar. */}
          <div className="admin-stats subs-stats-3" role="group" aria-label="Subscription summary">
            <div className="admin-stat">
              <span className="admin-stat-label">Active</span>
              <span className="admin-stat-val is-good">{stats.counts.active}</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-label">Canceling</span>
              <span className="admin-stat-val subs-stat-cancel">{stats.counts.canceling}</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-label">Canceled</span>
              <span className="admin-stat-val">{stats.counts.canceled}</span>
            </div>
          </div>

          {/* Revenue dashboard — chart + period toggle + MRR/ARR snapshot. */}
          <div className="subs-revenue">
            <div className="subs-revenue-head">
              <div className="subs-revenue-eyebrow">
                <span>Revenue Pace · {periodOpt.label}</span>
              </div>
              <div className="subs-period-toggle" role="radiogroup" aria-label="Revenue period">
                {PERIOD_OPTS.map((opt) => {
                  const active = period === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPeriod(opt.value)}
                      className={`subs-period-btn${active ? ' is-active' : ''}`}
                    >
                      <span className="subs-period-abbr">{opt.abbr}</span>
                      <span className="subs-period-label">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="subs-revenue-grid">
              <div className="subs-revenue-figure">
                <div className="subs-revenue-figure-label">MRR</div>
                <div className="subs-revenue-figure-val">
                  <span className="subs-revenue-currency">$</span>
                  {formatMoney(stats.mrrCents)}
                </div>
                <div className="subs-revenue-figure-meta">
                  Monthly · {stats.counts.active + stats.counts.canceling} entitled
                </div>
              </div>
              <div className="subs-revenue-figure">
                <div className="subs-revenue-figure-label">ARR</div>
                <div className="subs-revenue-figure-val subs-revenue-figure-val-muted">
                  <span className="subs-revenue-currency">$</span>
                  {formatMoney(stats.arrCents)}
                </div>
                <div className="subs-revenue-figure-meta">
                  Annualized run rate
                </div>
              </div>
              <div className="subs-revenue-figure">
                <div className="subs-revenue-figure-label">{periodOpt.label} Total</div>
                <div className="subs-revenue-figure-val subs-revenue-figure-val-accent">
                  <span className="subs-revenue-currency">$</span>
                  {formatMoney(series.total)}
                </div>
                <div className="subs-revenue-figure-meta">
                  Across last {periodOpt.buckets} {periodOpt.value === 'day' ? 'days' : periodOpt.value === 'week' ? 'weeks' : 'months'}
                </div>
              </div>
            </div>

            <RevenueChart series={series.buckets} period={period} />
          </div>
        </>
      )}

      {rows.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-glyph">— $ —</div>
          <h2 className="admin-empty-title">No subscriptions yet</h2>
          <p className="admin-empty-body">
            The ledger is empty. As soon as a user completes Stripe checkout, the webhook will mirror their
            subscription into this table and it will appear here.
          </p>
        </div>
      ) : (
        <SubscriptionsTable rows={rows} />
      )}
    </section>
  )
}

function formatMoney(cents: number): string {
  const dollars = cents / 100
  // No decimals for clean dashboard read; Intl handles separators correctly.
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(dollars))
}
