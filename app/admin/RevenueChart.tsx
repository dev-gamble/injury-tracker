'use client'

import { useState } from 'react'
import type { RevenuePeriod } from './SubscriptionsPanel'

type Bucket = { start: number; end: number; cents: number }

type Props = {
  series: Bucket[]
  period: RevenuePeriod
}

// SVG-rendered area chart. We size to the full container width via viewBox +
// preserveAspectRatio, so the chart scales cleanly on any viewport. Keeping
// it dependency-free keeps the bundle tight and the aesthetic in our hands.
const CHART_W = 720
const CHART_H = 180
const PAD_T = 18
const PAD_B = 28
const PAD_L = 12
const PAD_R = 12
const PLOT_W = CHART_W - PAD_L - PAD_R
const PLOT_H = CHART_H - PAD_T - PAD_B

function formatTick(ts: number, period: RevenuePeriod): string {
  const d = new Date(ts)
  if (period === 'day') {
    return `${d.getMonth() + 1}/${d.getDate()}`
  }
  if (period === 'week') {
    return `${d.getMonth() + 1}/${d.getDate()}`
  }
  // monthly
  return d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

function formatMoneyShort(cents: number): string {
  const dollars = cents / 100
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`
  if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(1)}k`
  return `$${dollars.toFixed(0)}`
}

export function RevenueChart({ series, period }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const max = Math.max(1, ...series.map((b) => b.cents))
  const n = series.length

  // Each bucket gets one X position; we also draw a phantom point at index n
  // so the area sweeps the full width of the chart.
  const stepX = n > 1 ? PLOT_W / (n - 1) : PLOT_W
  const points = series.map((b, i) => {
    const x = PAD_L + i * stepX
    const y = PAD_T + (PLOT_H - (b.cents / max) * PLOT_H)
    return { x, y, b, i }
  })

  // Smooth path using Catmull-Rom-ish via cubic Béziers. For a small N the
  // path stays sharp without looking jagged; for N=30 (daily) it stays
  // visually airy.
  const linePath = buildSmoothPath(points.map((p) => ({ x: p.x, y: p.y })))
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x},${PAD_T + PLOT_H} L ${points[0].x},${PAD_T + PLOT_H} Z`
      : ''

  // Tick selection — show the start, midpoint, and end labels for monthly,
  // ~5 evenly spaced ticks for weekly/daily. Keeps the axis legible.
  const tickIdxs: number[] = []
  if (n > 0) {
    const tickCount = period === 'day' ? 5 : period === 'week' ? 6 : Math.min(n, 7)
    if (n <= tickCount) {
      for (let i = 0; i < n; i++) tickIdxs.push(i)
    } else {
      for (let k = 0; k < tickCount; k++) {
        tickIdxs.push(Math.round((k * (n - 1)) / (tickCount - 1)))
      }
    }
  }

  const hovered = hoverIdx !== null ? points[hoverIdx] : null

  return (
    <div className="subs-chart" role="img" aria-label={`${period} revenue chart`}>
      <svg
        className="subs-chart-svg"
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="subs-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--red)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--red)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="subs-line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="var(--navy)" />
            <stop offset="60%" stopColor="var(--navy2)" />
            <stop offset="100%" stopColor="var(--red)" />
          </linearGradient>
        </defs>

        {/* Faint horizontal grid — 4 evenly spaced rules. */}
        {[0.25, 0.5, 0.75].map((t) => {
          const y = PAD_T + PLOT_H * t
          return (
            <line
              key={t}
              x1={PAD_L}
              x2={PAD_L + PLOT_W}
              y1={y}
              y2={y}
              className="subs-chart-grid"
              strokeDasharray="2 4"
            />
          )
        })}
        {/* Bottom rule — sits on the X axis, slightly more solid than the grid. */}
        <line
          x1={PAD_L}
          x2={PAD_L + PLOT_W}
          y1={PAD_T + PLOT_H}
          y2={PAD_T + PLOT_H}
          className="subs-chart-axis"
        />

        {/* Area fill underneath the line. */}
        {areaPath && (
          <path d={areaPath} fill="url(#subs-area-grad)" stroke="none" />
        )}
        {/* Stroke. */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#subs-line-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="subs-chart-line"
          />
        )}

        {/* Markers — one per bucket, dimmed by default and brightened on hover. */}
        {points.map((p) => {
          const active = hoverIdx === p.i
          return (
            <g key={p.i}>
              {/* Wider invisible hit target so hover is forgiving. */}
              <rect
                x={p.x - stepX / 2}
                y={PAD_T}
                width={stepX}
                height={PLOT_H}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(p.i)}
                onMouseLeave={() => setHoverIdx(null)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={active ? 4.5 : 2.5}
                className={`subs-chart-dot${active ? ' is-active' : ''}`}
              />
              {active && (
                <line
                  x1={p.x}
                  x2={p.x}
                  y1={PAD_T}
                  y2={PAD_T + PLOT_H}
                  className="subs-chart-cursor"
                />
              )}
            </g>
          )
        })}

        {/* X-axis tick labels. */}
        {tickIdxs.map((i) => {
          const p = points[i]
          if (!p) return null
          return (
            <text
              key={`tick-${i}`}
              x={p.x}
              y={CHART_H - 8}
              className="subs-chart-tick"
              textAnchor="middle"
            >
              {formatTick(p.b.start + (p.b.end - p.b.start) / 2, period)}
            </text>
          )
        })}
      </svg>

      {/* Tooltip — rendered as DOM so it doesn't get clipped by SVG bounds. */}
      {hovered && (
        <div
          className="subs-chart-tip"
          style={{
            left: `${(hovered.x / CHART_W) * 100}%`,
            top: `${(hovered.y / CHART_H) * 100}%`,
          }}
          role="tooltip"
        >
          <div className="subs-chart-tip-period">
            {formatRange(hovered.b.start, hovered.b.end, period)}
          </div>
          <div className="subs-chart-tip-amount">{formatMoneyShort(hovered.b.cents)}</div>
        </div>
      )}
    </div>
  )
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`
  const d: string[] = [`M ${points[0].x},${points[0].y}`]
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1]
    const p1 = points[i]
    // Tension 0.18 — subtle curvature; keeps the trend honest.
    const cx1 = p0.x + (p1.x - p0.x) * 0.5
    const cy1 = p0.y
    const cx2 = p0.x + (p1.x - p0.x) * 0.5
    const cy2 = p1.y
    d.push(`C ${cx1},${cy1} ${cx2},${cy2} ${p1.x},${p1.y}`)
  }
  return d.join(' ')
}

function formatRange(start: number, end: number, period: RevenuePeriod): string {
  const s = new Date(start)
  const e = new Date(end - 1) // end is exclusive; show inclusive label
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (period === 'day') return fmt(s)
  return `${fmt(s)} – ${fmt(e)}`
}
