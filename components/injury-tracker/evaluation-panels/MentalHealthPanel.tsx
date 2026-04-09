'use client'

import { useState } from 'react'
import { useTracker } from '../../../hooks/useTrackerStore'
import { VA_MENTAL, MH_DOMAINS, calculateMHRating } from '../../../lib/va/mental-health'
import { nextId } from '../../../hooks/useTrackerStore'
import { MHDomainRow } from './DomainRatingRow'
import { ConditionInfoForm } from './ConditionInfoForm'
import type { MentalHealthCondition, MHImpairmentLevel, MHFrequency } from '../../../lib/va/types'

interface MentalHealthPanelProps {
  onClose: () => void
}

const DEFAULT_DOMAINS = () =>
  Object.fromEntries(
    MH_DOMAINS.map(d => [d.id, { level: 'none' as MHImpairmentLevel, frequency: 'less25' as MHFrequency }])
  )

export function MentalHealthPanel({ onClose }: MentalHealthPanelProps) {
  const { state, dispatch } = useTracker()
  const { mentalHealthConditions } = state

  const [selectedCondition, setSelectedCondition] = useState('')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showInfoId, setShowInfoId] = useState<number | null>(null)
  const [overrideEdit, setOverrideEdit] = useState<number | null>(null)
  const [overrideInput, setOverrideInput] = useState('')

  const filtered = search
    ? VA_MENTAL.filter(c => c.toLowerCase().includes(search.toLowerCase()))
    : VA_MENTAL

  function addCondition() {
    if (!selectedCondition) return
    const newCond: MentalHealthCondition = {
      id: nextId(),
      condition: selectedCondition,
      domains: DEFAULT_DOMAINS(),
      calculatedRating: 0,
      effectiveRating: 0,
      manualOverride: null,
      pin: null,
      date: '',
      installation: '',
      event: '',
      description: '',
      medicalCare: '',
      clinicName: '',
      witnesses: '',
      stillBeingSeen: false,
    }
    dispatch({ type: 'ADD_MH_CONDITION', condition: newCond })
    setSelectedCondition('')
  }

  function updateDomain(id: number, domainId: string, level: MHImpairmentLevel, frequency: MHFrequency) {
    const cond = mentalHealthConditions.find(c => c.id === id)
    if (!cond) return
    const newDomains = { ...cond.domains, [domainId]: { level, frequency } }
    const calculatedRating = calculateMHRating(newDomains)
    const effectiveRating = cond.manualOverride !== null ? cond.manualOverride : calculatedRating
    dispatch({ type: 'UPDATE_MH_CONDITION', id, updates: { domains: newDomains, calculatedRating, effectiveRating } })
  }

  function applyOverride(id: number) {
    const val = parseInt(overrideInput, 10)
    if (isNaN(val) || val < 0 || val > 100) return
    dispatch({ type: 'UPDATE_MH_CONDITION', id, updates: { manualOverride: val, effectiveRating: val } })
    setOverrideEdit(null)
  }

  function clearOverride(cond: MentalHealthCondition) {
    dispatch({ type: 'UPDATE_MH_CONDITION', id: cond.id, updates: { manualOverride: null, effectiveRating: cond.calculatedRating } })
    setOverrideEdit(null)
  }

  function updateInfo(id: number, updates: Partial<MentalHealthCondition>) {
    dispatch({ type: 'UPDATE_MH_CONDITION', id, updates })
  }

  const ratingColor = (r: number) =>
    r >= 70 ? 'var(--red)' : r >= 30 ? 'var(--moderate)' : 'var(--mild)'

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, borderTop: '3px solid var(--navy)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="ftitle">Mental Health Evaluation</div>
          <div className="cr-eval-note" style={{ marginTop: 4 }}>
            The VA rates all mental health diagnoses together — the highest single rating applies.
            Rate each condition independently; only the highest counts.
          </div>
        </div>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>

      {/* Add condition */}
      <div style={{ marginBottom: 14 }}>
        <div className="cr-add-row">
          <span className="cr-add-lbl">Search</span>
          <input
            type="text"
            className="cond-info-input"
            placeholder="Filter conditions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="cr-add-row">
          <span className="cr-add-lbl">Condition</span>
          <select className="cr-add-select-wide" value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)}>
            <option value="">— select a diagnosis —</option>
            {filtered.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            className="btn-p"
            style={{ flex: 'none', padding: '8px 16px', fontSize: 12, marginLeft: 8 }}
            onClick={addCondition}
            disabled={!selectedCondition}
          >
            Add
          </button>
        </div>
      </div>

      {mentalHealthConditions.length === 0 ? (
        <div className="empty" style={{ padding: '24px 0' }}>No mental health conditions added yet.</div>
      ) : (
        mentalHealthConditions.map(cond => {
          const isExpanded = expandedId === cond.id
          const showInfo = showInfoId === cond.id
          const color = ratingColor(cond.effectiveRating)

          return (
            <div key={cond.id} className="cr-primary" style={{ marginBottom: 8 }}>
              <div className="cr-primary-head">
                <div className="cr-primary-info">
                  <div className="cr-dot" style={{ background: color }} />
                  <div className="cr-primary-name">{cond.condition}</div>
                </div>
                <div className="cr-primary-actions">
                  <span
                    className="cr-rating-badge"
                    style={{ background: color + '20', color, border: `1px solid ${color}40` }}
                  >
                    {cond.effectiveRating}%{cond.manualOverride !== null && ' ✏️'}
                  </span>
                  <button className="cr-toggle cr-toggle-sm" onClick={() => setExpandedId(isExpanded ? null : cond.id)}>
                    {isExpanded ? 'Hide' : 'Rate'}
                  </button>
                  <button className="cr-del-btn" onClick={() => dispatch({ type: 'REMOVE_MH_CONDITION', id: cond.id })}>×</button>
                </div>
              </div>

              {isExpanded && (
                <div className="cr-sev-panel">
                  {MH_DOMAINS.map(domain => {
                    const ds = cond.domains[domain.id] ?? { level: 'none', frequency: 'less25' }
                    return (
                      <MHDomainRow
                        key={domain.id}
                        domain={{ id: domain.id, label: domain.label, description: domain.description, isMH: true }}
                        level={ds.level}
                        frequency={ds.frequency}
                        onLevelChange={level => updateDomain(cond.id, domain.id, level, ds.frequency)}
                        onFreqChange={freq => updateDomain(cond.id, domain.id, ds.level, freq)}
                      />
                    )
                  })}

                  <div className="cr-calc-rating">
                    Calculated: <strong>{cond.calculatedRating}%</strong>
                    {cond.manualOverride !== null && (
                      <span style={{ marginLeft: 8, color: 'var(--muted)', fontSize: 11 }}>(override: {cond.manualOverride}%)</span>
                    )}
                  </div>

                  <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="sev-edit-btn" onClick={() => { setOverrideEdit(cond.id); setOverrideInput(String(cond.effectiveRating)) }}>
                      Manual Override
                    </button>
                    {cond.manualOverride !== null && (
                      <button className="sev-edit-btn" style={{ color: 'var(--red)' }} onClick={() => clearOverride(cond)}>
                        Clear Override
                      </button>
                    )}
                    <button className="sev-edit-btn" onClick={() => setShowInfoId(showInfo ? null : cond.id)}>
                      {showInfo ? 'Hide' : 'Add'} Incident Info
                    </button>
                  </div>

                  {overrideEdit === cond.id && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                      <input
                        type="number" min={0} max={100}
                        value={overrideInput}
                        onChange={e => setOverrideInput(e.target.value)}
                        style={{ width: 70, padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13 }}
                        placeholder="%"
                      />
                      <button className="btn-p" style={{ flex: 'none', padding: '6px 14px', fontSize: 12 }} onClick={() => applyOverride(cond.id)}>
                        Set
                      </button>
                    </div>
                  )}

                  {showInfo && (
                    <div style={{ marginTop: 10 }}>
                      <ConditionInfoForm
                        values={{ date: cond.date, installation: cond.installation, event: cond.event, description: cond.description, medicalCare: cond.medicalCare, clinicName: cond.clinicName, witnesses: cond.witnesses, stillBeingSeen: cond.stillBeingSeen }}
                        onChange={updates => updateInfo(cond.id, updates as Partial<MentalHealthCondition>)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
