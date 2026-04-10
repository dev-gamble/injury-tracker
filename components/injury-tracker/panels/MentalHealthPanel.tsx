"use client"

import { useState, useCallback } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { MH_DOMAINS, MH_IMPAIRMENT_LEVELS, MH_IMPAIRMENT_LABELS, VA_MENTAL, MH_EXAMPLES, calculateMHRating } from '../data/mhData'
import { CondInfoFields } from './CondInfoFields'
import type { MHCondition, MHDomainState, CondInfo } from '../types'

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

  const rateClass = `mh-rate-${cond.effectiveRating}`

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

          {/* Calculated rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(10,35,87,.04)', borderRadius: 6 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--fh)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Calculated Rating</div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--fm)', color: 'var(--navy)' }}>{cond.calculatedRating}%</div>
            </div>
          </div>

          {/* Manual override */}
          <div className="mh-override">
            <label>
              <input
                type="checkbox"
                checked={overrideActive}
                onChange={(e) => toggleOverride(e.target.checked)}
              />
              {' '}Manual Override
            </label>
            {overrideActive && (
              <select value={cond.manualOverride ?? 0} onChange={(e) => setOverride(e.target.value)}>
                {OVERRIDE_VALUES.map((v) => (
                  <option key={v} value={v}>{v}%</option>
                ))}
              </select>
            )}
          </div>
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
  const setPinPlaceMode = useInjuryStore((s) => s.setPinPlaceMode)

  const [search, setSearch] = useState('')

  const selected = new Set(mentalConditions.map((c) => c.condition))

  const filtered = VA_MENTAL.filter((name) => {
    if (!search) return true
    const ex = MH_EXAMPLES[name] ?? ''
    return name.toLowerCase().includes(search.toLowerCase()) || ex.toLowerCase().includes(search.toLowerCase())
  })

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
        date: '', location: '', event: '', description: '',
        medicalCare: '', clinicName: '', witnesses: '', stillBeingSeen: false,
      }
      addMHCondition(newCond)
    }
  }, [mentalConditions, addMHCondition, removeMHCondition])

  const highest = mentalConditions.reduce<MHCondition | null>(
    (best, c) => (!best || c.effectiveRating > best.effectiveRating) ? c : best, null
  )
  const highestRating = highest?.effectiveRating ?? 0

  const placeMentalPin = useCallback(() => {
    const label = highest?.condition ?? 'Mental Health'
    setActivePanel(null)
    setPinPlaceMode({ key: 'mental', label, fromPanel: true })
    document.body.classList.add('pin-placing')
    document.querySelectorAll('.body-wrap').forEach((el) => el.classList.add('pin-place-mode'))
  }, [highest, setActivePanel, setPinPlaceMode])

  return (
    <div className="mental-panel" id="mental-health-panel">
      <div className="mh-header">
        <span className="mh-title">Mental Health Evaluation</span>
        <button className="mh-back" onClick={() => setActivePanel(null)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7" />
          </svg>
          {' '}Back to Map
        </button>
      </div>

      <div className="mh-body">
        <div className="mh-info">
          <strong>VA Single Rating Rule:</strong> The VA rates all mental health conditions under one combined rating
          using the General Rating Formula for Mental Disorders. If you have multiple conditions, the{' '}
          <strong>highest evaluated rating</strong> will be used as your single mental health disability rating.
        </div>

        {/* Search */}
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

        {/* Condition checklist */}
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

        {/* Evaluation cards */}
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

        {/* Action buttons */}
        <div className="mh-done-wrap">
          {mentalConditions.length > 0 && (
            <>
              <button className="mh-done-btn" onClick={placeMentalPin}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z" />
                </svg>
                {' '}Place Pin on Map
              </button>
              <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 6 }}>
                Click to return to the map and place a pin for this condition.
              </div>
            </>
          )}
          <button className="mh-back-btn" onClick={() => setActivePanel(null)} style={{ marginTop: 8 }}>
            Back to Map (no pin)
          </button>
        </div>
      </div>
    </div>
  )
}
