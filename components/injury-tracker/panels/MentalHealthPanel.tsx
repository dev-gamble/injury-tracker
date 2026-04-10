"use client"

import { useState, useCallback, useMemo } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { MH_DOMAINS, MH_IMPAIRMENT_LEVELS, MH_IMPAIRMENT_LABELS, VA_MENTAL, MH_EXAMPLES, calculateMHRating } from '../data/mhData'
import { CondInfoFields } from './CondInfoFields'
import { PanelShell, PanelActions, CalcRatingRow, ManualOverrideControl, usePinPlacement } from './PanelShared'
import type { MHCondition, MHDomainState } from '../types'

const OVERRIDE_VALUES = [0, 10, 30, 50, 70, 100]

function MHEvalCard({
  cond,
  isHighest,
  isMultiple,
  onUpdate,
  onRemove,
}: {
  cond: MHCondition
  isHighest: boolean
  isMultiple: boolean
  onUpdate: (patch: Partial<MHCondition>) => void
  onRemove: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const overrideActive = cond.manualOverride !== null
  const rateClass = `mh-rate-${cond.effectiveRating}`

  const updateDomain = useCallback((domainId: string, level: string) => {
    const newDomains = {
      ...cond.domains,
      [domainId]: {
        level,
        frequency: level === 'none' ? 'less25' : (cond.domains[domainId]?.frequency ?? 'less25'),
      } as MHDomainState,
    }
    const calc = calculateMHRating(newDomains)
    onUpdate({
      domains: newDomains,
      calculatedRating: calc,
      effectiveRating: overrideActive ? (cond.manualOverride ?? calc) : calc,
    })
  }, [cond.domains, cond.manualOverride, overrideActive, onUpdate])

  const updateFrequency = useCallback((domainId: string, freq: string) => {
    const newDomains = {
      ...cond.domains,
      [domainId]: { ...cond.domains[domainId], frequency: freq } as MHDomainState,
    }
    const calc = calculateMHRating(newDomains)
    onUpdate({
      domains: newDomains,
      calculatedRating: calc,
      effectiveRating: overrideActive ? (cond.manualOverride ?? calc) : calc,
    })
  }, [cond.domains, cond.manualOverride, overrideActive, onUpdate])

  const setOverride = useCallback((value: string) => {
    if (value === '') {
      onUpdate({ manualOverride: null, effectiveRating: cond.calculatedRating })
    } else {
      const v = parseInt(value)
      onUpdate({ manualOverride: v, effectiveRating: v })
    }
  }, [cond.calculatedRating, onUpdate])

  const toggleOverride = useCallback((checked: boolean) => {
    if (checked) {
      onUpdate({ manualOverride: cond.calculatedRating, effectiveRating: cond.calculatedRating })
    } else {
      onUpdate({ manualOverride: null, effectiveRating: cond.calculatedRating })
    }
  }, [cond.calculatedRating, onUpdate])

  return (
    <div className={`mh-eval-card${isHighest && isMultiple ? ' mh-highest' : ''}`}>
      <div className="mh-eval-header" onClick={() => setCollapsed(!collapsed)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span className="mh-eval-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {cond.condition}
          </span>
          {isHighest && isMultiple && <span className="mh-highest-tag">Highest Rating</span>}
          {overrideActive && <span className="mh-override-tag">Manual</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`mh-eval-rating ${rateClass}`}>{cond.effectiveRating}%</span>
          <button className="mh-remove" onClick={(e) => { e.stopPropagation(); onRemove() }} title="Remove">&times;</button>
        </div>
      </div>

      {!collapsed && (
        <div className="mh-eval-body">
          <CondInfoFields cond={cond} onChange={(patch) => onUpdate(patch as Partial<MHCondition>)} />

          {MH_DOMAINS.map((domain) => {
            const dv = cond.domains[domain.id] ?? { level: 'none', frequency: 'less25' }
            return (
              <div key={domain.id} className="mh-domain">
                <div className="mh-domain-header">
                  <div className="mh-domain-label">{domain.label}</div>
                  <div className="mh-domain-desc">{domain.description}</div>
                </div>
                <div className="mh-levels">
                  {MH_IMPAIRMENT_LEVELS.map((lv) => (
                    <button
                      key={lv}
                      className={`mh-level-btn${dv.level === lv ? ` active-${lv}` : ''}`}
                      onClick={() => updateDomain(domain.id, lv)}
                    >
                      {MH_IMPAIRMENT_LABELS[lv]}
                    </button>
                  ))}
                </div>
                {dv.level !== 'none' && (
                  <div className="mh-freq">
                    <span className="mh-freq-label">How often?</span>
                    <button
                      className={`mh-freq-btn${dv.frequency === 'less25' ? ' active' : ''}`}
                      onClick={() => updateFrequency(domain.id, 'less25')}
                    >
                      Less than 25% of time
                    </button>
                    <button
                      className={`mh-freq-btn${dv.frequency === '25plus' ? ' active' : ''}`}
                      onClick={() => updateFrequency(domain.id, '25plus')}
                    >
                      25% or more
                    </button>
                  </div>
                )}
                <div className="mh-example">{domain.examples[dv.level] ?? ''}</div>
              </div>
            )
          })}

          <CalcRatingRow value={cond.calculatedRating} />
          <ManualOverrideControl
            active={overrideActive}
            value={cond.manualOverride}
            overrideValues={OVERRIDE_VALUES}
            onToggle={toggleOverride}
            onChange={setOverride}
          />
        </div>
      )}
    </div>
  )
}

export function MentalHealthPanel() {
  const mentalConditions = useInjuryStore((s) => s.mentalConditions)
  const addMHCondition = useInjuryStore((s) => s.addMHCondition)
  const updateMHCondition = useInjuryStore((s) => s.updateMHCondition)
  const removeMHCondition = useInjuryStore((s) => s.removeMHCondition)
  const setActivePanel = useInjuryStore((s) => s.setActivePanel)

  const [search, setSearch] = useState('')

  const selected = useMemo(() => new Set(mentalConditions.map((c) => c.condition)), [mentalConditions])
  const filtered = useMemo(
    () => VA_MENTAL.filter((name) => {
      if (!search) return true
      const ex = MH_EXAMPLES[name] ?? ''
      return name.toLowerCase().includes(search.toLowerCase()) || ex.toLowerCase().includes(search.toLowerCase())
    }),
    [search]
  )

  const highest = useMemo(
    () => mentalConditions.reduce<MHCondition | null>(
      (best, c) => (!best || c.effectiveRating > best.effectiveRating) ? c : best, null
    ),
    [mentalConditions]
  )
  const highestRating = highest?.effectiveRating ?? 0

  const toggleCondition = useCallback((name: string) => {
    const existing = mentalConditions.find((c) => c.condition === name)
    if (existing) {
      removeMHCondition(existing.id)
    } else {
      const domains: Record<string, MHDomainState> = {}
      MH_DOMAINS.forEach((d) => { domains[d.id] = { level: 'none', frequency: 'less25' } })
      const newCond: MHCondition = {
        id: Date.now(),
        condition: name,
        domains,
        calculatedRating: 0,
        manualOverride: null,
        effectiveRating: 0,
        extremity: 'none',
        date: '', location: '', event: '', description: '',
        medicalCare: '', clinicName: '', witnesses: '', stillBeingSeen: false,
      }
      addMHCondition(newCond)
    }
  }, [mentalConditions, addMHCondition, removeMHCondition])

  const pinLabel = highest?.condition ?? 'Mental Health'
  const placePin = usePinPlacement('mental', pinLabel)
  const handleBack = useCallback(() => setActivePanel(null), [setActivePanel])

  return (
    <PanelShell id="mental-health-panel" title="Mental Health Evaluation" onBack={handleBack}>
      <div className="mh-info">
        <strong>VA Single Rating Rule:</strong> The VA rates all mental health conditions under one combined rating
        using the General Rating Formula for Mental Disorders. If you have multiple conditions, the{' '}
        <strong>highest evaluated rating</strong> will be used as your single mental health disability rating.
      </div>

      <div className="mh-search">
        <svg className="mh-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search conditions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mh-cond-list">
        {filtered.length === 0 ? (
          <div style={{ padding: 14, color: 'var(--muted)', fontSize: 12, textAlign: 'center' }}>
            No conditions match your search.
          </div>
        ) : (
          filtered.map((name) => {
            const checked = selected.has(name)
            const cond = mentalConditions.find((c) => c.condition === name)
            const ex = MH_EXAMPLES[name]
            return (
              <div
                key={name}
                className={`mh-cond-item${checked ? ' selected' : ''}`}
                onClick={() => toggleCondition(name)}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  onClick={(e) => { e.stopPropagation(); toggleCondition(name) }}
                />
                <span className="mh-cond-label">
                  {name}
                  {ex && <span className="mh-cond-examples">e.g. {ex}</span>}
                </span>
                {cond && (
                  <span className={`mh-cond-badge mh-rate-${cond.effectiveRating}`}>
                    {cond.effectiveRating}%
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>

      {mentalConditions.length > 0 && (
        <>
          <div className="mh-section-title">
            Evaluations ({mentalConditions.length} condition{mentalConditions.length > 1 ? 's' : ''})
          </div>
          {mentalConditions.map((cond) => (
            <MHEvalCard
              key={cond.id}
              cond={cond}
              isHighest={highest?.id === cond.id}
              isMultiple={mentalConditions.length > 1}
              onUpdate={(patch) => updateMHCondition(cond.id, patch)}
              onRemove={() => removeMHCondition(cond.id)}
            />
          ))}

          {/* Mental health uses a single combined rating, not a per-condition band */}
          <div className="mh-combined">
            <div className="mh-combined-label">Your Mental Health Rating</div>
            <div className="mh-combined-value">{highestRating}%</div>
            <div className="mh-combined-note">
              {mentalConditions.length > 1
                ? `Highest of ${mentalConditions.length} evaluated conditions (VA single-rating rule)`
                : 'Based on your evaluation above'}
            </div>
          </div>
        </>
      )}

      {mentalConditions.length === 0 && (
        <div className="mh-empty">
          <div style={{ fontSize: 28, marginBottom: 8 }}>⚙</div>
          <strong>Select conditions above to begin evaluation</strong><br />
          Check one or more conditions, then rate how each affects you across 5 functional domains.<br />
          The VA uses these domains to determine your mental health disability rating.
        </div>
      )}

      <PanelActions
        hasConditions={mentalConditions.length > 0}
        onPlacePin={placePin}
        onBack={handleBack}
      />
    </PanelShell>
  )
}
