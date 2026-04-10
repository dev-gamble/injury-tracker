"use client"

import { useState, useCallback, useMemo } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { VA_HEAD, HEAD_PROFILES, getHeadProfileKey, calculateHeadRating } from '../data/headData'
import { CondInfoFields } from './CondInfoFields'
import { PanelShell, RatingsSummaryBand, PanelActions, CalcRatingRow, ManualOverrideControl, usePinPlacement } from './PanelShared'
import type { HeadCondition } from '../types'

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
  const profileShortLabel = profile.label.split('(')[0].trim()

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

export function HeadPanel() {
  const headConditions = useInjuryStore((s) => s.headConditions)
  const addHeadCondition = useInjuryStore((s) => s.addHeadCondition)
  const updateHeadCondition = useInjuryStore((s) => s.updateHeadCondition)
  const removeHeadCondition = useInjuryStore((s) => s.removeHeadCondition)
  const setActivePanel = useInjuryStore((s) => s.setActivePanel)

  const [search, setSearch] = useState('')

  const selected = useMemo(() => new Set(headConditions.map((c) => c.condition)), [headConditions])
  const filtered = useMemo(
    () => VA_HEAD.filter((name) => !search || name.toLowerCase().includes(search.toLowerCase())),
    [search]
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

  const pinLabel = headConditions[0]?.condition ?? 'Head & Face'
  const placePin = usePinPlacement('headFace', pinLabel)
  const handleBack = useCallback(() => setActivePanel(null), [setActivePanel])

  const ratingsItems = useMemo(
    () => headConditions.map((c) => ({ id: c.id, label: c.condition, rating: c.effectiveRating })),
    [headConditions]
  )

  return (
    <PanelShell id="head-panel" title="Head & Face Evaluation" onBack={handleBack}>
      <div className="mh-info">
        <strong>Each condition rated separately:</strong> Unlike mental health, physical head/face conditions
        are each rated independently under their own diagnostic code. Each rating contributes separately
        to your combined VA disability rating.
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
          <RatingsSummaryBand title="Head & Face Ratings" items={ratingsItems} />
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

      <PanelActions
        hasConditions={headConditions.length > 0}
        onPlacePin={placePin}
        onBack={handleBack}
      />
    </PanelShell>
  )
}
