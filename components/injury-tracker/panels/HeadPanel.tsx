"use client"

import { useState, useCallback } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { VA_HEAD, HEAD_PROFILES, getHeadProfileKey, calculateHeadRating } from '../data/headData'
import { CondInfoFields } from './CondInfoFields'
import type { HeadCondition, CondInfo } from '../types'

const OVERRIDE_VALUES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

function HDEvalCard({
  cond,
  onUpdate,
  onRemove,
}: {
  cond: HeadCondition
  onUpdate: (patch: Partial<HeadCondition>) => void
  onRemove: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const profile = HEAD_PROFILES[cond.profile] ?? HEAD_PROFILES.generic
  const overrideActive = cond.manualOverride !== null

  const updateDomain = useCallback((domainId: string, value: number) => {
    const newDomains = { ...cond.domains, [domainId]: value }
    const calc = calculateHeadRating(newDomains)
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
  const profileShortLabel = profile.label.split('(')[0].trim()

  return (
    <div className="mh-eval-card">
      <div className="mh-eval-header" onClick={() => setCollapsed(!collapsed)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span className="mh-eval-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {cond.condition}
          </span>
          <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--fh)', color: 'var(--muted)', background: 'var(--bg)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 3 }}>
            {profileShortLabel}
          </span>
          {overrideActive && <span className="mh-override-tag">Manual</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`mh-eval-rating ${rateClass}`}>{cond.effectiveRating}%</span>
          <button className="mh-remove" onClick={(e) => { e.stopPropagation(); onRemove() }} title="Remove">&times;</button>
        </div>
      </div>

      {!collapsed && (
        <div className="mh-eval-body">
          <CondInfoFields cond={cond} onChange={(patch) => onUpdate(patch as Partial<HeadCondition>)} />

          {profile.note && (
            <div style={{ padding: '8px 12px', marginBottom: 10, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, fontSize: 11, color: '#92400e' }}>
              {profile.note}
            </div>
          )}

          {profile.domains.map((domain) => {
            const currentValue = cond.domains[domain.id] ?? 0
            const selectedLevel = domain.levels.find((lv) => lv.value === currentValue)

            return (
              <div key={domain.id} className="mh-domain">
                <div className="mh-domain-header">
                  <div className="mh-domain-label">{domain.label}</div>
                  <div className="mh-domain-desc">{domain.description}</div>
                </div>

                <div className="hd-levels">
                  {domain.levels.map((lv, idx) => (
                    <button
                      key={`${lv.value}-${idx}`}
                      className={`hd-level-btn${currentValue === lv.value ? ' hd-active' : ''}`}
                      onClick={() => updateDomain(domain.id, lv.value)}
                      title={lv.description}
                    >
                      <span className="hd-level-val">{lv.value}%</span>
                      <span className="hd-level-label">{lv.label}</span>
                    </button>
                  ))}
                </div>

                {selectedLevel && selectedLevel.description && currentValue > 0 && (
                  <div className="mh-example">{selectedLevel.description}</div>
                )}
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

export function HeadPanel() {
  const headConditions = useInjuryStore((s) => s.headConditions)
  const addHeadCondition = useInjuryStore((s) => s.addHeadCondition)
  const updateHeadCondition = useInjuryStore((s) => s.updateHeadCondition)
  const removeHeadCondition = useInjuryStore((s) => s.removeHeadCondition)
  const setActivePanel = useInjuryStore((s) => s.setActivePanel)
  const setPinPlaceMode = useInjuryStore((s) => s.setPinPlaceMode)

  const [search, setSearch] = useState('')

  const selected = new Set(headConditions.map((c) => c.condition))

  const filtered = VA_HEAD.filter((name) =>
    !search || name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleCondition = useCallback((name: string) => {
    const existing = headConditions.find((c) => c.condition === name)
    if (existing) {
      removeHeadCondition(existing.id)
    } else {
      const profileKey = getHeadProfileKey(name)
      const profile = HEAD_PROFILES[profileKey]
      const domains: Record<string, number> = {}
      profile.domains.forEach((d) => { domains[d.id] = 0 })
      const newCond: HeadCondition = {
        id: Date.now(),
        condition: name,
        profile: profileKey,
        domains,
        calculatedRating: 0,
        manualOverride: null,
        effectiveRating: 0,
        extremity: 'none',
        date: '', location: '', event: '', description: '',
        medicalCare: '', clinicName: '', witnesses: '', stillBeingSeen: false,
      }
      addHeadCondition(newCond)
    }
  }, [headConditions, addHeadCondition, removeHeadCondition])

  const placeHeadPin = useCallback(() => {
    const label = headConditions[0]?.condition ?? 'Head & Face'
    setActivePanel(null)
    setPinPlaceMode({ key: 'headFace', label, fromPanel: true })
    document.body.classList.add('pin-placing')
    document.querySelectorAll('.body-wrap').forEach((el) => el.classList.add('pin-place-mode'))
  }, [headConditions, setActivePanel, setPinPlaceMode])

  return (
    <div className="mental-panel" id="head-panel">
      <div className="mh-header">
        <span className="mh-title">Head & Face Evaluation</span>
        <button className="mh-back" onClick={() => setActivePanel(null)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7" />
          </svg>
          {' '}Back to Map
        </button>
      </div>

      <div className="mh-body">
        <div className="mh-info">
          <strong>Each condition rated separately:</strong> Unlike mental health, physical head/face conditions
          are each rated independently under their own diagnostic code. Each rating contributes separately
          to your combined VA disability rating.
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
              const cond = headConditions.find((c) => c.condition === name)
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
                  <span className="mh-cond-label">{name}</span>
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
        {headConditions.length > 0 && (
          <>
            <div className="mh-section-title">
              Evaluations ({headConditions.length} condition{headConditions.length > 1 ? 's' : ''})
            </div>
            {headConditions.map((cond) => (
              <HDEvalCard
                key={cond.id}
                cond={cond}
                onUpdate={(patch) => updateHeadCondition(cond.id, patch)}
                onRemove={() => removeHeadCondition(cond.id)}
              />
            ))}

            {/* Summary — all ratings */}
            <div className="mh-combined" style={{ background: 'linear-gradient(135deg,#0a2357 0%,#1d4ed8 100%)' }}>
              <div className="mh-combined-label" style={{ color: '#fff' }}>Head & Face Ratings</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                {headConditions.map((c) => (
                  <div key={c.id} style={{ background: 'rgba(255,255,255,.15)', borderRadius: 6, padding: '6px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.9)', whiteSpace: 'nowrap', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.condition}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--fm)', color: '#fff' }}>
                      {c.effectiveRating}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="mh-combined-note" style={{ marginTop: 8, color: 'rgba(255,255,255,.85)' }}>
                Each condition contributes separately to your combined VA rating
              </div>
            </div>
          </>
        )}

        {headConditions.length === 0 && (
          <div className="mh-empty">
            <div style={{ fontSize: 28, marginBottom: 8 }}>&#129504;</div>
            <strong>Select conditions above to begin evaluation</strong><br />
            Check one or more conditions, then rate each using VA diagnostic criteria.<br />
            Head & face conditions include TBI, migraines, hearing, vision, TMJ, and more.
          </div>
        )}

        {/* Action buttons */}
        <div className="mh-done-wrap">
          {headConditions.length > 0 && (
            <>
              <button className="mh-done-btn" onClick={placeHeadPin}>
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
