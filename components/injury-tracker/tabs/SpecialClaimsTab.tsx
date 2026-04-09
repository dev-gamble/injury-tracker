'use client'

import { useState } from 'react'
import { useTracker } from '../../../hooks/useTrackerStore'
import {
  SMC_LEVELS,
  PRESUMPTIVE_CLAIMS,
  MST_CONDITIONS,
  MST_EVIDENCE_TYPES,
  VOCATIONAL_CONDITIONS,
} from '../../../lib/va/special-claims'

export function SpecialClaimsTab() {
  const { state, dispatch } = useTracker()
  const { smcSelections, presumptiveData, mstData, vocSecondaries, vocNotes } = state

  const [activeSection, setActiveSection] = useState<'voc' | 'smc' | 'presumptive' | 'mst'>('voc')

  function toggleSMC(id: string) {
    if (smcSelections.includes(id)) {
      dispatch({ type: 'REMOVE_SMC_SELECTION', id })
    } else {
      dispatch({ type: 'ADD_SMC_SELECTION', id })
    }
  }

  function toggleVoc(condition: string) {
    if (vocSecondaries.includes(condition)) {
      dispatch({ type: 'REMOVE_VOC_SECONDARY', condition })
    } else {
      dispatch({ type: 'ADD_VOC_SECONDARY', condition })
    }
  }

  function setPresumptiveField(claimId: string, fieldId: string, value: string) {
    const existing = presumptiveData[claimId] ?? {}
    dispatch({ type: 'SET_PRESUMPTIVE_DATA', claimId, data: { ...existing, [fieldId]: value } })
  }

  function toggleMSTCondition(name: string) {
    const existing = mstData.conditions.find(c => c.name === name)
    if (existing) {
      dispatch({ type: 'UPDATE_MST_DATA', updates: { conditions: mstData.conditions.filter(c => c.name !== name) } })
    } else {
      dispatch({ type: 'UPDATE_MST_DATA', updates: { conditions: [...mstData.conditions, { name, rating: 0, secondaries: [] }] } })
    }
  }

  function toggleMSTEvidence(id: string) {
    const ev = { ...mstData.evidence, [id]: !mstData.evidence[id] }
    dispatch({ type: 'UPDATE_MST_DATA', updates: { evidence: ev } })
  }

  const sections = [
    { id: 'voc', label: 'Vocational' },
    { id: 'smc', label: 'SMC' },
    { id: 'presumptive', label: 'Presumptive' },
    { id: 'mst', label: 'MST' },
  ] as const

  return (
    <div className="content">
      <div className="tab-instructions">
        <strong>Special Claims</strong> — Vocational Rehabilitation, Special Monthly Compensation,
        Presumptive conditions, and Military Sexual Trauma claims.
      </div>

      {/* Section nav */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {sections.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            style={{
              padding: '8px 18px',
              border: `2px solid ${activeSection === sec.id ? 'var(--navy)' : 'var(--border)'}`,
              borderRadius: 6,
              background: activeSection === sec.id ? 'var(--navy)' : 'var(--surface)',
              color: activeSection === sec.id ? '#fff' : 'var(--text)',
              fontFamily: 'var(--fh)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '.5px',
              transition: 'all .15s',
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* ── Vocational ── */}
      {activeSection === 'voc' && (
        <div>
          <div className="rc-section-title">Vocational Impact</div>
          <div className="tab-instructions">
            Select the vocational limitations caused by your service-connected conditions.
            These support a claim for Total Disability Individual Unemployability (TDIU/IU).
          </div>
          <div className="cr-voc-chips" style={{ marginBottom: 16 }}>
            {VOCATIONAL_CONDITIONS.map(cond => {
              const selected = vocSecondaries.includes(cond)
              return (
                <button
                  key={cond}
                  onClick={() => toggleVoc(cond)}
                  className="sc-chip"
                  style={selected ? { background: 'var(--navy)', color: '#fff' } : undefined}
                >
                  {selected && <span style={{ fontWeight: 800, marginRight: 3 }}>✓</span>}
                  {cond}
                </button>
              )
            })}
          </div>
          <div className="field">
            <label>Vocational Impact Notes</label>
            <textarea
              rows={4}
              value={vocNotes}
              onChange={e => dispatch({ type: 'SET_VOC_NOTES', notes: e.target.value })}
              placeholder="Describe how your conditions affect your ability to work, maintain employment, or perform your prior occupation or MOS..."
            />
          </div>
        </div>
      )}

      {/* ── SMC ── */}
      {activeSection === 'smc' && (
        <div>
          <div className="rc-section-title">Special Monthly Compensation</div>
          <div className="tab-instructions">
            SMC is extra monthly compensation for veterans with severe disabilities.
            Check any that may apply to your situation.
          </div>
          {SMC_LEVELS.map(level => {
            const selected = smcSelections.includes(level.id)
            return (
              <div
                key={level.id}
                className="rc-card"
                style={{
                  borderLeft: selected ? '4px solid var(--navy)' : '4px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
                onClick={() => toggleSMC(level.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 20, height: 20, border: `2px solid ${selected ? 'var(--navy)' : 'var(--border)'}`,
                    borderRadius: 4, background: selected ? 'var(--navy)' : 'var(--surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 2, transition: 'all .12s',
                  }}>
                    {selected && <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--fh)', fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>
                      {level.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                      {level.description}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Presumptive ── */}
      {activeSection === 'presumptive' && (
        <div>
          <div className="rc-section-title">Presumptive Conditions</div>
          <div className="tab-instructions">
            These conditions are automatically service-connected if you meet the exposure criteria.
            Fill in the relevant details for each that applies.
          </div>
          {PRESUMPTIVE_CLAIMS.map(claim => {
            const claimData = presumptiveData[claim.id] ?? {}
            const hasData = Object.values(claimData).some(Boolean)
            return (
              <details key={claim.id} className="rc-card" style={{ borderLeft: hasData ? '4px solid var(--mild)' : '4px solid var(--border)' }}>
                <summary style={{ cursor: 'pointer', fontFamily: 'var(--fh)', fontSize: 14, fontWeight: 700, color: 'var(--navy)', padding: '2px 0' }}>
                  {claim.label}
                  {hasData && <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--mild)', fontWeight: 700 }}>✓ Filled</span>}
                </summary>
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
                  {claim.description}
                </div>
                {claim.fields.map(field => (
                  <div key={field.id} className="cond-info-row">
                    <span className="cond-info-lbl">{field.label}</span>
                    <input
                      type="text"
                      className="cond-info-input"
                      placeholder={field.placeholder}
                      value={(claimData[field.id] as string) ?? ''}
                      onChange={e => setPresumptiveField(claim.id, field.id, e.target.value)}
                    />
                  </div>
                ))}
              </details>
            )
          })}
        </div>
      )}

      {/* ── MST ── */}
      {activeSection === 'mst' && (
        <div>
          <div className="rc-section-title">Military Sexual Trauma (MST)</div>
          {mstData.privacyShield && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#0369a1' }}>
              🔒 Privacy mode is on. This section will be excluded from exported reports unless you explicitly include it.
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={mstData.privacyShield}
                onChange={e => dispatch({ type: 'UPDATE_MST_DATA', updates: { privacyShield: e.target.checked } })}
              />
              Privacy shield (exclude from exports)
            </label>
          </div>

          <div className="rc-section-title" style={{ fontSize: 12 }}>Related Conditions</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {MST_CONDITIONS.map(c => {
              const selected = mstData.conditions.some(e => e.name === c)
              return (
                <button
                  key={c}
                  onClick={() => toggleMSTCondition(c)}
                  className="sc-chip"
                  style={selected ? { background: 'var(--navy)', color: '#fff' } : undefined}
                >
                  {selected && <span style={{ fontWeight: 800, marginRight: 3 }}>✓</span>}
                  {c}
                </button>
              )
            })}
          </div>

          <div className="rc-section-title" style={{ fontSize: 12 }}>Supporting Evidence Available</div>
          {MST_EVIDENCE_TYPES.map(ev => (
            <label key={ev.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={!!mstData.evidence[ev.id]}
                onChange={() => toggleMSTEvidence(ev.id)}
                style={{ marginTop: 2 }}
              />
              {ev.label}
            </label>
          ))}

          <div className="field" style={{ marginTop: 14 }}>
            <label>MST Notes (private)</label>
            <textarea
              rows={4}
              value={mstData.notes}
              onChange={e => dispatch({ type: 'UPDATE_MST_DATA', updates: { notes: e.target.value } })}
              placeholder="Your private notes related to MST claim preparation..."
            />
          </div>
        </div>
      )}
    </div>
  )
}
