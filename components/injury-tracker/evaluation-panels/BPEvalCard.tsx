'use client'

import { useState } from 'react'
import type { BPCondition } from '../../../lib/va/types'
import type { BPRegistryEntry } from '../../../lib/va/registry'
import { useTracker } from '../../../hooks/useTrackerStore'
import { DomainRatingRow } from './DomainRatingRow'
import { ConditionInfoForm } from './ConditionInfoForm'

interface BPEvalCardProps {
  condition: BPCondition
  regionId: string
  entry: BPRegistryEntry
}

export function BPEvalCard({ condition, regionId, entry }: BPEvalCardProps) {
  const { dispatch } = useTracker()
  const [expanded, setExpanded] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [overrideInput, setOverrideInput] = useState('')
  const [editingOverride, setEditingOverride] = useState(false)

  function updateDomain(domainId: string, value: number) {
    const newDomains = { ...condition.domains, [domainId]: value }
    const calculatedRating = entry.calcRating(newDomains)
    const effectiveRating = condition.manualOverride !== null ? condition.manualOverride : calculatedRating
    dispatch({
      type: 'UPDATE_BP_CONDITION',
      stateKey: regionId,
      id: condition.id,
      updates: { domains: newDomains, calculatedRating, effectiveRating },
    })
  }

  function applyOverride() {
    const val = parseInt(overrideInput, 10)
    if (isNaN(val) || val < 0 || val > 100) return
    dispatch({
      type: 'UPDATE_BP_CONDITION',
      stateKey: regionId,
      id: condition.id,
      updates: { manualOverride: val, effectiveRating: val },
    })
    setEditingOverride(false)
  }

  function clearOverride() {
    dispatch({
      type: 'UPDATE_BP_CONDITION',
      stateKey: regionId,
      id: condition.id,
      updates: { manualOverride: null, effectiveRating: condition.calculatedRating },
    })
    setEditingOverride(false)
  }

  function updateInfo(updates: Partial<BPCondition>) {
    dispatch({
      type: 'UPDATE_BP_CONDITION',
      stateKey: regionId,
      id: condition.id,
      updates,
    })
  }

  function removeCondition() {
    dispatch({ type: 'REMOVE_BP_CONDITION', stateKey: regionId, id: condition.id })
  }

  const profile = entry.getProfile(condition.condition)
  const ratingColor = condition.effectiveRating >= 70 ? 'var(--red)' :
    condition.effectiveRating >= 30 ? 'var(--moderate)' : 'var(--mild)'

  return (
    <div className="cr-primary" style={{ marginBottom: 8 }}>
      <div className="cr-primary-head">
        <div className="cr-primary-info">
          <div className="cr-dot" style={{ background: ratingColor }} />
          <div>
            <div className="cr-primary-name">{condition.condition}</div>
            {condition.sideLabel && (
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{condition.sideLabel}</div>
            )}
          </div>
          {condition.bilateralLinked && (
            <span className="bilateral-badge">Bilateral</span>
          )}
        </div>
        <div className="cr-primary-actions">
          <span
            className="cr-rating-badge"
            style={{ background: ratingColor + '20', color: ratingColor, border: `1px solid ${ratingColor}40` }}
          >
            {condition.effectiveRating}%
            {condition.manualOverride !== null && ' ✏️'}
          </span>
          <button className="cr-toggle cr-toggle-sm" onClick={() => setExpanded(e => !e)}>
            {expanded ? 'Hide' : 'Evaluate'}
          </button>
          <button className="cr-del-btn" onClick={removeCondition} title="Remove condition">×</button>
        </div>
      </div>

      {expanded && (
        <div className="cr-sev-panel">
          {entry.note && <div className="cr-profile-note">{entry.note}</div>}

          {profile?.domains.map(domain => (
            <DomainRatingRow
              key={domain.id}
              domain={domain}
              value={condition.domains[domain.id] ?? 0}
              onChange={v => updateDomain(domain.id, v)}
            />
          ))}

          <div className="cr-calc-rating">
            Calculated: <strong>{condition.calculatedRating}%</strong>
            {condition.manualOverride !== null && (
              <span style={{ marginLeft: 8, color: 'var(--muted)', fontSize: 11 }}>
                (override: {condition.manualOverride}%)
              </span>
            )}
          </div>

          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="sev-edit-btn" onClick={() => { setEditingOverride(o => !o); setOverrideInput(String(condition.effectiveRating)) }}>
              Manual Override
            </button>
            {condition.manualOverride !== null && (
              <button className="sev-edit-btn" onClick={clearOverride} style={{ color: 'var(--red)' }}>
                Clear Override
              </button>
            )}
            <button className="sev-edit-btn" onClick={() => setShowInfo(i => !i)}>
              {showInfo ? 'Hide' : 'Add'} Incident Info
            </button>
          </div>

          {editingOverride && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
              <input
                type="number"
                min={0}
                max={100}
                value={overrideInput}
                onChange={e => setOverrideInput(e.target.value)}
                style={{ width: 70, padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13 }}
                placeholder="%"
              />
              <button className="btn-p" style={{ flex: 'none', padding: '6px 14px', fontSize: 12 }} onClick={applyOverride}>
                Set
              </button>
            </div>
          )}

          {showInfo && (
            <div style={{ marginTop: 10 }}>
              <ConditionInfoForm
                values={{
                  date: condition.date,
                  installation: condition.installation,
                  event: condition.event,
                  description: condition.description,
                  medicalCare: condition.medicalCare,
                  clinicName: condition.clinicName,
                  witnesses: condition.witnesses,
                  stillBeingSeen: condition.stillBeingSeen,
                }}
                onChange={updateInfo}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
