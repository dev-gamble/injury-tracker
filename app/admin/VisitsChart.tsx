'use client'

import { useState } from 'react'

type Bucket = { start: number; end: number; visits: number; uniques: number }

type Props = {
  series: Bucket[]
}

// SVG-rendered combo chart: bar layer for total visits, line layer for unique
// IPs, sharing one Y-axis (uniques are always ≤ visits, so the line lives
// inside the bars). Sized to the container via viewBox + preserveAspectRatio.
const CHART_W = 720
const CHART_H = 200
const PAD_T = 22
const PAD_B = 30
const PAD_L = 14
const PAD_R = 14
const PLOT_W = CHART_W - PAD_L - PAD_R
const PLOT_H = CHART_H - PAD_T - PAD_B

function formatTick(ts: number): string {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return `${n}`
}

export function VisitsChart({ series }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const max = Math.max(1, ...series.map((b) => b.visits))
  const n = series.length

  const stepX = n > 0 ? PLOT_W / n : PLOT_W
  const barWidth = Math.max(2, stepX - 4)

  const points = series.map((b, i) => {
    const cx = PAD_L + i * stepX + stepX / 2
    const y = PAD_T + (PLOT_H - (b.uniques / max) * PLOT_H)
    return { cx, y, b, i }
  })

  const linePath = buildSmoothPath(points.map((p) => ({ x: p.cx, y: p.y })))

  const tickIdxs: number[] = []
  if (n > 0) {
    const tickCount = Math.min(n, 7)
    for (let k = 0; k < tickCount; k++) {
      tickIdxs.push(Math.round((k * (n - 1)) / Math.max(1, tickCount - 1)))
    }
  }

  const hovered = hoverIdx !== null ? points[hoverIdx] : null

  return (
    <div className="vt-chart" role="img" aria-label="Daily visit volume">
      <svg
        className="vt-chart-svg"
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vt-bar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="var(--navy2)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--navy)" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="vt-line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="var(--red)" />
            <stop offset="100%" stopColor="var(--amber)" />
          </linearGradient>
          <pattern id="vt-bar-grain" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 6 L6 0" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
          </pattern>
        </defs>

        {/* Grid */}
        {[0.25, 0.5, 0.75].map((t) => {
          const y = PAD_T + PLOT_H * t
          return (
            <line
              key={t}
              x1={PAD_L} x2={PAD_L + PLOT_W}
              y1={y} y2={y}
              className="vt-chart-grid"
              strokeDasharray="2 5"
            />
          )
        })}
        <line
          x1={PAD_L} x2={PAD_L + PLOT_W}
          y1={PAD_T + PLOT_H} y2={PAD_T + PLOT_H}
          className="vt-chart-axis"
        />

        {/* Bars */}
        {points.map((p) => {
          const barHeight = (p.b.visits / max) * PLOT_H
          const x = p.cx - barWidth / 2
          const y = PAD_T + (PLOT_H - barHeight)
          const active = hoverIdx === p.i
          return (
            <g key={`bar-${p.i}`}>
              <rect
                x={x} y={y}
                width={barWidth} height={Math.max(0, barHeight)}
                fill="url(#vt-bar-grad)"
                className={`vt-chart-bar${active ? ' is-active' : ''}`}
              />
              <rect
                x={x} y={y}
                width={barWidth} height={Math.max(0, barHeight)}
                fill="url(#vt-bar-grain)"
              />
              {/* Hit target. */}
              <rect
                x={p.cx - stepX / 2} y={PAD_T}
                width={stepX} height={PLOT_H}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(p.i)}
                onMouseLeave={() => setHoverIdx(null)}
              />
            </g>
          )
        })}

        {/* Line + dots for uniques */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#vt-line-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="vt-chart-line"
          />
        )}
        {points.map((p) => {
          const active = hoverIdx === p.i
          return (
            <circle
              key={`dot-${p.i}`}
              cx={p.cx} cy={p.y}
              r={active ? 4 : 2}
              className={`vt-chart-dot${active ? ' is-active' : ''}`}
            />
          )
        })}

        {/* Cursor */}
        {hovered && (
          <line
            x1={hovered.cx} x2={hovered.cx}
            y1={PAD_T} y2={PAD_T + PLOT_H}
            className="vt-chart-cursor"
          />
        )}

        {/* Ticks */}
        {tickIdxs.map((i) => {
          const p = points[i]
          if (!p) return null
          return (
            <text
              key={`tick-${i}`}
              x={p.cx} y={CHART_H - 10}
              className="vt-chart-tick"
              textAnchor="middle"
            >
              {formatTick(p.b.start + (p.b.end - p.b.start) / 2)}
            </text>
          )
        })}
      </svg>

      {hovered && (
        <div
          className="vt-chart-tip"
          style={{
            left: `${(hovered.cx / CHART_W) * 100}%`,
            top: `${(hovered.y / CHART_H) * 100}%`,
          }}
          role="tooltip"
        >
          <div className="vt-chart-tip-period">{formatRange(hovered.b.start, hovered.b.end)}</div>
          <div className="vt-chart-tip-row">
            <span className="vt-chart-tip-key">Visits</span>
            <span className="vt-chart-tip-val">{formatNum(hovered.b.visits)}</span>
          </div>
          <div className="vt-chart-tip-row vt-chart-tip-row-accent">
            <span className="vt-chart-tip-key">Unique IPs</span>
            <span className="vt-chart-tip-val">{formatNum(hovered.b.uniques)}</span>
          </div>
        </div>
      )}

      <div className="vt-chart-legend" aria-hidden="true">
        <span className="vt-chart-legend-item">
          <span className="vt-chart-legend-bar" /> Visits
        </span>
        <span className="vt-chart-legend-item">
          <span className="vt-chart-legend-line" /> Unique IPs
        </span>
      </div>
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
    const cx1 = p0.x + (p1.x - p0.x) * 0.5
    const cy1 = p0.y
    const cx2 = p0.x + (p1.x - p0.x) * 0.5
    const cy2 = p1.y
    d.push(`C ${cx1},${cy1} ${cx2},${cy2} ${p1.x},${p1.y}`)
  }
  return d.join(' ')
}

function formatRange(start: number, end: number): string {
  const d = new Date(start + (end - start) / 2)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
