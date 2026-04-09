'use client'

import { useState } from 'react'
import { useTracker } from '../../../hooks/useTrackerStore'
import { InjuryFormModal } from '../modals/InjuryFormModal'
import { gapStatus } from '../../../lib/va/rating'
import type { Injury } from '../../../lib/va/types'

export function TimelineTab() {
  const { state, dispatch } = useTracker()
  const { injuries, mentalHealthConditions, headConditions, bpConditions } = state
  const [editingInjury, setEditingInjury] = useState<Injury | null>(null)

  // Group physical injuries by year
  const byYear: Record<string, Injury[]> = {}
  for (const inj of injuries) {
    const yr = inj.date ? inj.date.slice(0, 4) : 'Undated'
    if (!byYear[yr]) byYear[yr] = []
    byYear[yr].push(inj)
  }
  const sortedYears = Object.keys(byYear).sort((a, b) => b.localeCompare(a))

  // All conditions across all panels for the full timeline view
  const allMH = mentalHealthConditions
  const allHead = headConditions
  const allBP = Object.values(bpConditions).flat()

  const SREV_COLORS: Record<string, string> = {
    mild: 'var(--mild)',
    moderate: 'var(--moderate)',
    severe: 'var(--severe)',
    custom: 'var(--custom)',
  }

  return (
    <div className="content">
      <div className="tab-instructions">
        <strong>Timeline View</strong> — All injuries and conditions grouped by year of service.
        Edit any entry to add or update details. Gap warnings help identify documentation issues.
      </div>

      <div className="tl-bar">
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          {injuries.length} physical {injuries.length === 1 ? 'injury' : 'injuries'} ·{' '}
          {allMH.length + allHead.length + allBP.length} evaluated conditions
        </div>
      </div>

      {injuries.length === 0 && (
        <div className="empty">
          📋 No injuries logged yet.<br />
          Go to the <strong>Map</strong> tab to add injuries.
        </div>
      )}

      {sortedYears.map(year => (
        <div key={year}>
          <div className="yr-lbl">{year}</div>
          {byYear[year].map(inj => {
            const gs = gapStatus(inj)
            const color = SREV_COLORS[inj.severity] ?? 'var(--border2)'
            return (
              <div key={inj.id} className={`ic ${inj.severity}`}>
                <div style={{ flex: 1 }}>
                  <div className="ic-title">
                    {inj.label}
                    <span className={`stag`} style={{ background: color + '20', color, border: `1px solid ${color}40` }}>
                      {inj.severity.toUpperCase()}
                    </span>
                    {gs.status !== 'complete' && (
                      <span style={{ fontSize: 10, color: 'var(--moderate)', fontWeight: 700, fontFamily: 'var(--fh)', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 3, padding: '1px 6px', textTransform: 'uppercase', letterSpacing: '.3px' }}>
                        ⚠ {gs.gaps.length} gap{gs.gaps.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {inj.installation && (
                    <div className="ic-meta">{inj.installation}{inj.date ? ` · ${inj.date}` : ''}</div>
                  )}
                  {inj.event && <div className="ic-desc">{inj.event}</div>}
                  {inj.medicalCare === 'yes' && inj.clinicName && (
                    <div className="ic-med">Medical care: {inj.clinicName}</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button className="edit-btn" onClick={() => setEditingInjury(inj)} title="Edit">✏️</button>
                  <button className="del" onClick={() => dispatch({ type: 'DELETE_INJURY', id: inj.id })} title="Delete">×</button>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {editingInjury && (
        <InjuryFormModal
          injury={editingInjury}
          initialPin={null}
          onClose={() => setEditingInjury(null)}
        />
      )}
    </div>
  )
}
