'use client'

import { useTracker } from '../../../hooks/useTrackerStore'
import { getRatingBreakdown, detectRatingWarnings } from '../../../lib/va/rating'

export function RatingTab() {
  const { state } = useTracker()
  const result = getRatingBreakdown(state)
  const warnings = detectRatingWarnings(result.items, state.bpConditions)

  const EXTREMITY_LABELS: Record<string, string> = {
    LU: 'Left Upper', RU: 'Right Upper', LL: 'Left Lower', RL: 'Right Lower',
  }

  return (
    <div className="content">
      <div className="rc-info">
        The VA combines disability ratings using the &quot;whole person&quot; method &mdash; each condition is
        rated as a percentage of the remaining healthy person. A 30% rating means you&apos;re 70% &quot;whole&quot;,
        then the next condition rates that 70%, and so on. The final result is rounded to the
        nearest 10%.{result.bilateral && ' A bilateral factor bonus has been applied.'}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="rc-warnings">
          {warnings.map((w, i) => (
            <div key={i} className={`rc-warning ${w.type === 'duplicate' ? 'rc-warn-dup' : 'rc-warn-pyr'}`}>
              <div className="rc-warning-header">
                {w.type === 'duplicate' ? '⚠ Possible Duplicate' : '⚠ Pyramiding Risk'}
              </div>
              <div className="rc-warning-cond">{w.condition}</div>
              <div className="rc-warning-msg">{w.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Big result */}
      <div className="rc-results">
        <div className="rc-results-header">Combined VA Rating</div>
        <div className="rc-results-big">{result.rounded}%</div>
        <div className="rc-results-exact">
          Exact: {result.combined.toFixed(1)}% → rounded to nearest 10%
        </div>
        {result.bilateral && (
          <div className="rc-results-bil">
            ★ Bilateral Factor Applied (+{result.bilateralFactor.toFixed(1)}% bonus)
          </div>
        )}
      </div>

      {/* Step-by-step breakdown */}
      {result.steps.length > 0 && (
        <div className="rc-steps-wrap">
          <div className="rc-steps-title">Step-by-step Calculation</div>
          {result.steps.map((step, i) => (
            <div key={i} className="rc-step">
              <div className="rc-step-label">Step {i + 1}</div>
              <div className="rc-step-detail">
                <span className="rc-step-plus">{i === 0 ? '' : '+'}</span>
                <span className="rc-step-name">{step.name}</span>
                <span className="rc-step-pct">{step.rating}%</span>
              </div>
              {step.add != null && (
                <div className="rc-step-math" style={{ marginLeft: 22 }}>
                  {step.add.toFixed(2)}% of remaining {(100 - (step.running - step.add)).toFixed(1)}%
                </div>
              )}
              <div className="rc-step-running">→ Running total: {step.running.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      )}

      {/* Individual ratings */}
      {result.items.length > 0 && (
        <div>
          <div className="rc-section-title">All Rated Conditions</div>
          {result.items.map((item, i) => {
            const ratingColor = item.rating >= 70 ? 'var(--red)' : item.rating >= 30 ? 'var(--moderate)' : 'var(--mild)'
            return (
              <div
                key={item.id ?? i}
                className={`rc-card${item.type === 'mental' ? '' : ''}`}
                style={item.type === 'secondary' ? { marginLeft: 24, borderLeft: '3px solid var(--border2)' } : undefined}
              >
                <div className="rc-card-header">
                  <div className="rc-num" style={{ background: ratingColor }}>{i + 1}</div>
                  <div className="rc-name">{item.name}</div>
                  {item.extremity && item.extremity !== 'none' && (
                    <span className="rc-ext-tag">{EXTREMITY_LABELS[item.extremity] ?? item.extremity}</span>
                  )}
                  {item.type === 'mental' && (
                    <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--fh)', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 3, padding: '1px 6px' }}>
                      MH
                    </span>
                  )}
                  {item.type === 'secondary' && (
                    <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--fh)', color: 'var(--muted)', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 3, padding: '1px 6px' }}>
                      Secondary
                    </span>
                  )}
                  <span
                    className="cr-rating-badge"
                    style={{ marginLeft: 'auto', background: ratingColor + '20', color: ratingColor, border: `1px solid ${ratingColor}40` }}
                  >
                    {item.rating}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {result.items.length === 0 && (
        <div className="empty">
          📊 No rated conditions yet.<br />
          Add injuries on the <strong>Map</strong> tab, then evaluate conditions using the sidebar panels.
        </div>
      )}
    </div>
  )
}
