'use client'

import { useState } from 'react'
import { useTracker } from '../../../hooks/useTrackerStore'
import { BP_REGISTRY } from '../../../lib/va/registry'
import { VA_AREA_CONDITIONS } from '../../../lib/va/conditions'
import { BPEvalCard } from './BPEvalCard'
import { nextId } from '../../../hooks/useTrackerStore'
import type { BPCondition } from '../../../lib/va/types'

interface BPPanelProps {
  regionId: string
  onClose: () => void
}


export function BPPanel({ regionId, onClose }: BPPanelProps) {
  const { state, dispatch } = useTracker()
  const entry = BP_REGISTRY[regionId]

  const sideKeys = entry ? Object.keys(entry.sideKeys) : []

  // UI state — must be before early return
  const [activeSideKey, setActiveSideKey] = useState(sideKeys[0] ?? '')
  const [selectedCondition, setSelectedCondition] = useState('')
  const [bpSearch, setSearch] = useState(state.bpSearch)

  if (!entry) return null

  const conditions = state.bpConditions[regionId] ?? []
  const allConditions = VA_AREA_CONDITIONS[regionId] ?? []

  const sideLabel = entry.sideKeys[activeSideKey] ?? ''
  const extremity = entry.extremityMap[activeSideKey] ?? 'none'

  const filteredConditions = bpSearch
    ? allConditions.filter(c => c.toLowerCase().includes(bpSearch.toLowerCase()))
    : allConditions

  const sideConditions = conditions.filter(c => c.extremity === extremity || extremity === 'none')

  function addCondition() {
    if (!selectedCondition) return
    const profileKey = entry.getProfileKey(selectedCondition)
    const profile = entry.getProfile(selectedCondition)
    const domains: Record<string, number> = {}
    profile?.domains.forEach(d => { domains[d.id] = 0 })

    const newCond: BPCondition = {
      id: nextId(),
      condition: selectedCondition,
      profile: profileKey,
      domains,
      calculatedRating: 0,
      effectiveRating: 0,
      manualOverride: null,
      extremity,
      sideLabel,
      bilateralLinked: false,
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
    dispatch({ type: 'ADD_BP_CONDITION', stateKey: regionId, condition: newCond })
    setSelectedCondition('')
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, borderTop: '3px solid var(--navy)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="ftitle">{entry.title}</div>
          {entry.note && <div className="cr-eval-note" style={{ marginTop: 4 }}>{entry.note}</div>}
        </div>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>

      {/* Side tabs */}
      {sideKeys.length > 1 && (
        <div className="bp-side-tabs">
          {sideKeys.map(key => (
            <button
              key={key}
              className={`bp-side-tab${activeSideKey === key ? ' active' : ''}`}
              onClick={() => setActiveSideKey(key)}
            >
              {entry.sideKeys[key]}
            </button>
          ))}
        </div>
      )}

      {/* Add condition */}
      <div style={{ marginBottom: 14 }}>
        <div className="cr-add-row">
          <span className="cr-add-lbl">Condition</span>
          <input
            type="text"
            className="cond-info-input"
            placeholder="Search conditions..."
            value={bpSearch}
            onChange={e => setSearch(e.target.value)}
            style={{ marginRight: 6 }}
          />
        </div>
        <div className="cr-add-row">
          <span className="cr-add-lbl">Select</span>
          <select
            className="cr-add-select-wide"
            value={selectedCondition}
            onChange={e => setSelectedCondition(e.target.value)}
          >
            <option value="">— choose a condition —</option>
            {filteredConditions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
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

      {/* Condition cards */}
      {conditions.length === 0 ? (
        <div className="empty" style={{ padding: '24px 0' }}>No conditions added yet for this region.</div>
      ) : (
        <div>
          {conditions.map(cond => (
            <BPEvalCard key={cond.id} condition={cond} regionId={regionId} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
