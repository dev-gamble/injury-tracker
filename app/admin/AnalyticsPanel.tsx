'use client'

import type { AnalyticsPayload } from './analyticsActions'
import { VisitsChart } from './VisitsChart'
import { flagFor } from '@/lib/analytics/countries'

const DAY_MS = 86_400_000

type Props = {
  payload: AnalyticsPayload | null
  errorMessage: string | null
}

export function AnalyticsPanel({ payload, errorMessage }: Props) {
  if (errorMessage || !payload) {
    return (
      <section className="admin-card admin-card-wide" aria-labelledby="analytics-card-title">
        <div className="admin-card-head">
          <div className="admin-form-id">
            <span>Telemetry · Visits</span>
            <span className="admin-form-id-right">— —</span>
          </div>
          <div className="admin-card-head-row">
            <div>
              <h1 id="analytics-card-title" className="admin-card-title">Analytics</h1>
              <p className="admin-card-subtitle">Visitor and geo intelligence.</p>
            </div>
          </div>
        </div>
        <div className="admin-empty">
          <div className="admin-empty-glyph">!</div>
          <h2 className="admin-empty-title">Unable to load telemetry</h2>
          <p className="admin-empty-body">{errorMessage ?? 'No analytics data available.'}</p>
        </div>
      </section>
    )
  }

  return <AnalyticsBody payload={payload} />
}

function AnalyticsBody({ payload }: { payload: AnalyticsPayload }) {
  const { summary, series, countries, paths, topIps, recent, windowDays } = payload

  if (summary.windowCount === 0 && summary.totalCount === 0) {
    return (
      <section className="admin-card admin-card-wide" aria-labelledby="analytics-card-title">
        <div className="admin-card-head">
          <div className="admin-form-id">
            <span>Telemetry · Visits</span>
            <span className="admin-form-id-right">0 records</span>
          </div>
          <div className="admin-card-head-row">
            <div>
              <h1 id="analytics-card-title" className="admin-card-title">Analytics</h1>
              <p className="admin-card-subtitle">Visitor and geo intelligence — last {windowDays} days.</p>
            </div>
          </div>
        </div>
        <div className="admin-empty">
          <div className="admin-empty-glyph">— ◯ —</div>
          <h2 className="admin-empty-title">No visits yet</h2>
          <p className="admin-empty-body">
            As soon as someone loads a page, an event lands here. The tracker is mounted in the root layout, so it lights up automatically.
          </p>
        </div>
      </section>
    )
  }

  const peak = series.reduce((m, b) => (b.visits > m ? b.visits : m), 0)
  const totalInWindow = series.reduce((s, b) => s + b.visits, 0)
  const avgPerDay = totalInWindow / Math.max(1, windowDays)
  const deltaPct = summary.prev24h === 0
    ? (summary.last24h > 0 ? 100 : 0)
    : ((summary.last24h - summary.prev24h) / summary.prev24h) * 100

  const chartSeries = series.map((b) => ({
    start: b.bucketStart,
    end: b.bucketStart + DAY_MS,
    visits: b.visits,
    uniques: b.uniques,
  }))

  return (
    <section className="admin-card admin-card-wide vt-card" aria-labelledby="analytics-card-title">
      <div className="admin-card-head">
        <div className="admin-form-id">
          <span>Telemetry · Visits</span>
          <span className="admin-form-id-right">
            {summary.windowCount.toLocaleString()} window · {summary.totalCount.toLocaleString()} all-time
          </span>
        </div>
        <div className="admin-card-head-row">
          <div>
            <h1 id="analytics-card-title" className="admin-card-title">Analytics</h1>
            <p className="admin-card-subtitle">
              Visitor signal across the last {windowDays} days. Aggregated server-side; geo enriched via header passthrough or ip-api.com fallback.
            </p>
          </div>
        </div>
      </div>

      {/* Stats tiles */}
      <div className="admin-stats vt-stats" role="group" aria-label="Visitor summary">
        <div className="admin-stat">
          <span className="admin-stat-label">Visits · {windowDays}D</span>
          <span className="admin-stat-val">{summary.windowCount.toLocaleString()}</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-label">Unique IPs</span>
          <span className="admin-stat-val is-good">{summary.uniqueIps.toLocaleString()}</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-label">Last 24H</span>
          <span className="admin-stat-val">
            {summary.last24h.toLocaleString()}
            <span className={`vt-delta ${deltaPct >= 0 ? 'is-up' : 'is-down'}`}>
              {deltaPct >= 0 ? '▲' : '▼'} {Math.abs(deltaPct).toFixed(0)}%
            </span>
          </span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-label">Top Origin</span>
          <span className="admin-stat-val vt-stat-country">
            {summary.topCountryCode ? (
              <>
                <span className="vt-stat-flag" aria-hidden="true">{flagFor(summary.topCountryCode)}</span>
                <span>{summary.topCountryCode}</span>
              </>
            ) : (
              <span className="vt-stat-empty">—</span>
            )}
          </span>
        </div>
      </div>

      {/* Time-series chart */}
      <div className="vt-section">
        <div className="vt-section-head">
          <div className="vt-section-eyebrow">Daily Volume · {windowDays}D</div>
          <div className="vt-section-meta">
            <span className="vt-meta-key">Peak</span>
            <span className="vt-meta-val">{peak.toLocaleString()}</span>
            <span className="vt-meta-divider" />
            <span className="vt-meta-key">Avg</span>
            <span className="vt-meta-val">{Math.round(avgPerDay).toLocaleString()}/day</span>
          </div>
        </div>
        <VisitsChart series={chartSeries} />
      </div>

      {/* Country + Path breakdown grid */}
      <div className="vt-grid">
        <div className="vt-block">
          <div className="vt-block-head">
            <span className="vt-block-eyebrow">Geo Distribution</span>
            <span className="vt-block-count">{countries.length} {countries.length === 1 ? 'country' : 'countries'}</span>
          </div>
          <ul className="vt-bars" role="list">
            {countries.slice(0, 8).map((c) => {
              const pct = (c.count / Math.max(1, summary.windowCount)) * 100
              return (
                <li className="vt-bar-row" key={c.code}>
                  <div className="vt-bar-label">
                    <span className="vt-bar-flag" aria-hidden="true">{flagFor(c.code)}</span>
                    <span className="vt-bar-name">{c.name}</span>
                  </div>
                  <div className="vt-bar-track">
                    <div className="vt-bar-fill" style={{ width: `${Math.max(2, pct)}%` }} />
                  </div>
                  <div className="vt-bar-count">
                    <span className="vt-bar-pct">{pct.toFixed(1)}%</span>
                    <span className="vt-bar-num">{c.count.toLocaleString()}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="vt-block">
          <div className="vt-block-head">
            <span className="vt-block-eyebrow">Top Paths</span>
            <span className="vt-block-count">{paths.length} {paths.length === 1 ? 'route' : 'routes'}</span>
          </div>
          <ul className="vt-bars" role="list">
            {paths.slice(0, 8).map((p) => {
              const pct = (p.count / Math.max(1, summary.windowCount)) * 100
              return (
                <li className="vt-bar-row" key={p.path}>
                  <div className="vt-bar-label vt-bar-label-mono">
                    <span className="vt-bar-name vt-bar-name-mono" title={p.path}>{p.path}</span>
                  </div>
                  <div className="vt-bar-track">
                    <div className="vt-bar-fill vt-bar-fill-amber" style={{ width: `${Math.max(2, pct)}%` }} />
                  </div>
                  <div className="vt-bar-count">
                    <span className="vt-bar-pct">{pct.toFixed(1)}%</span>
                    <span className="vt-bar-num">{p.count.toLocaleString()}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Top IPs */}
      <div className="vt-section">
        <div className="vt-section-head">
          <div className="vt-section-eyebrow">Top IPs</div>
          <div className="vt-section-meta">
            <span className="vt-meta-key">Showing</span>
            <span className="vt-meta-val">{Math.min(10, topIps.length)} of {topIps.length.toLocaleString()}</span>
          </div>
        </div>
        <div className="vt-table-wrap">
          <table className="vt-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Origin</th>
                <th className="vt-th-num">Visits</th>
                <th>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {topIps.slice(0, 10).map((ip) => (
                <tr key={ip.ip}>
                  <td>
                    <span className="vt-cell-ip">{ip.ip}</span>
                  </td>
                  <td>
                    <span className="vt-cell-origin">
                      <span className="vt-cell-origin-flag" aria-hidden="true">
                        {ip.countryCode ? flagFor(ip.countryCode) : '◯'}
                      </span>
                      <span className="vt-cell-origin-text">
                        {ip.city ? `${ip.city}, ` : ''}
                        {ip.countryCode ?? 'Unknown'}
                      </span>
                    </span>
                  </td>
                  <td className="vt-th-num">
                    <span className="vt-cell-num">{ip.count.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="vt-cell-time">{relativeTime(ip.lastSeen)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live activity feed */}
      <div className="vt-section vt-section-feed">
        <div className="vt-section-head">
          <div className="vt-section-eyebrow">
            <span className="vt-pulse" aria-hidden="true" />
            Recent Activity
          </div>
          <div className="vt-section-meta">
            <span className="vt-meta-key">Latest</span>
            <span className="vt-meta-val">{recent.length} events</span>
          </div>
        </div>
        <ul className="vt-feed" role="list">
          {recent.map((r) => (
            <li className="vt-feed-row" key={r.id}>
              <span className="vt-feed-time">{shortTime(r.created_at)}</span>
              <span className="vt-feed-flag" aria-hidden="true">
                {r.country_code ? flagFor(r.country_code) : '◯'}
              </span>
              <span className="vt-feed-loc">
                {r.city ? `${r.city}, ` : ''}
                {r.country_code ?? '—'}
              </span>
              <span className="vt-feed-ip">{r.ip_address}</span>
              <span className="vt-feed-path" title={r.path}>{r.path}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function shortTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}
