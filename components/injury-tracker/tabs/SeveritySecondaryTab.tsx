'use client'

import { useState } from 'react'
import { useTracker } from '../../../hooks/useTrackerStore'
import { gapStatus } from '../../../lib/va/rating'
import { getGroupForKey } from '../../../lib/va/conditions'
import { getSecondariesForGroup } from '../../../lib/va/secondary-map'

export function SeveritySecondaryTab() {
  const { state, dispatch } = useTracker()
  const { injuries } = state
  const [customInputs, setCustomInputs] = useState<Record<number, string>>({})

  function addSecondary(injId: number, name: string) {
    const inj = injuries.find(i => i.id === injId)
    if (!inj || !name || inj.secondaries.includes(name)) return
    dispatch({ type: 'UPDATE_INJURY', id: injId, updates: { secondaries: [...inj.secondaries, name] } })
  }

  function removeSecondary(injId: number, name: string) {
    const inj = injuries.find(i => i.id === injId)
    if (!inj) return
    dispatch({ type: 'UPDATE_INJURY', id: injId, updates: { secondaries: inj.secondaries.filter(s => s !== name) } })
  }

  function updateSecondaryRating(injId: number, secName: string, rating: number) {
    const inj = injuries.find(i => i.id === injId)
    if (!inj) return
    const ratings = { ...(inj.secondaryRatings ?? {}), [secName]: rating }
    dispatch({ type: 'UPDATE_INJURY', id: injId, updates: { secondaryRatings: ratings } })
  }

  function addCustom(injId: number) {
    const name = (customInputs[injId] ?? '').trim()
    if (!name) return
    addSecondary(injId, name)
    setCustomInputs(prev => ({ ...prev, [injId]: '' }))
  }

  const SREV_COLORS: Record<string, string> = {
    mild: 'var(--mild)', moderate: 'var(--moderate)',
    severe: 'var(--severe)', custom: 'var(--custom)',
  }

  return (
    <div className="content">
      <div className="tab-instructions">
        <strong>Secondaries &amp; Rating Estimates</strong> — Add secondary conditions that stem from your primary
        injuries, and enter your estimated or actual VA ratings. Secondary conditions count toward your combined rating.
      </div>

      {injuries.length === 0 && (
        <div className="empty">
          📋 No injuries logged yet. Add injuries on the <strong>Map</strong> tab first.
        </div>
      )}

      {injuries.map(inj => {
        const gs = gapStatus(inj)
        const color = SREV_COLORS[inj.severity] ?? 'var(--border2)'
        const groupKey = getGroupForKey(inj.key || '')
        const suggestions = groupKey ? getSecondariesForGroup(groupKey) : []
        const unusedSuggestions = suggestions.filter(s => !inj.secondaries.includes(s)).slice(0, 8)

        return (
          <div key={inj.id} className="rc-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="rc-card-header">
              <div className="rc-num" style={{ background: color }}>{inj.id % 100}</div>
              <div className="rc-name">{inj.label}</div>
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--fh)', background: color + '15', color, border: `1px solid ${color}40`, borderRadius: 3, padding: '1px 6px', textTransform: 'uppercase' }}>
                {inj.severity}
              </span>
              {gs.status !== 'complete' && (
                <span style={{ fontSize: 10, color: 'var(--moderate)', fontWeight: 700, fontFamily: 'var(--fh)', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 3, padding: '1px 6px' }}>
                  ⚠ {gs.gaps.length} gap{gs.gaps.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="rc-controls">
              <div className="rc-field">
                <label>Assign Rating</label>
                <select
                  value={inj._assignedRating ?? ''}
                  onChange={e => dispatch({ type: 'UPDATE_INJURY', id: inj.id, updates: { _assignedRating: parseInt(e.target.value, 10) || 0 } })}
                >
                  <option value="">Not rated</option>
                  {[0,10,20,30,40,50,60,70,80,90,100].map(r => (
                    <option key={r} value={r}>{r}%</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Secondary conditions */}
            {inj.secondaries.length > 0 && (
              <div className="rc-secs">
                {inj.secondaries.map(sec => (
                  <div key={sec} className="rc-sec-item">
                    <div className="rc-sec-header">
                      <span className="rc-sec-dot">↳</span>
                      <span className="rc-sec-name">{sec}</span>
                    </div>
                    <div className="rc-pct-box">
                      <input
                        type="number"
                        className="rc-pct-input"
                        min={0} max={100} step={10}
                        value={(inj.secondaryRatings ?? {})[sec] ?? ''}
                        onChange={e => updateSecondaryRating(inj.id, sec, parseInt(e.target.value, 10) || 0)}
                        placeholder="0"
                      />
                      <span className="rc-pct-sign">%</span>
                      <button
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 15, padding: '0 2px', transition: 'color .12s' }}
                        onClick={() => removeSecondary(inj.id, sec)}
                        title="Remove secondary"
                      >×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {unusedSuggestions.length > 0 && (
              <div className="cr-suggest" style={{ marginTop: 10 }}>
                <div className="cr-suggest-title">
                  Common secondary conditions for this type of injury — click to add:
                </div>
                <div className="cr-suggest-chips">
                  {unusedSuggestions.map(s => (
                    <button key={s} className="cr-suggest-chip" onClick={() => addSecondary(inj.id, s)}>
                      <span className="cr-suggest-plus">+</span>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom secondary input */}
            <div className="cr-custom-row" style={{ marginTop: 8 }}>
              <input
                type="text"
                className="cr-custom-input"
                placeholder="Type a custom secondary condition..."
                value={customInputs[inj.id] ?? ''}
                onChange={e => setCustomInputs(prev => ({ ...prev, [inj.id]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') addCustom(inj.id) }}
              />
              <button className="cr-custom-btn" onClick={() => addCustom(inj.id)}>Add</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
