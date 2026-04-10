"use client"

import { useState, useCallback } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { MH_DOMAINS, MH_IMPAIRMENT_LEVELS, MH_IMPAIRMENT_LABELS, VA_MENTAL, calculateMHRating } from '../data/mhData'
import { HEAD_PROFILES, VA_HEAD, getHeadProfile, calculateHeadRating } from '../data/headData'
import { PHYSICAL_PROFILE, getBPProfile, calculateBPRating } from '../data/bpProfiles'
import { VA_AREA_CONDITIONS } from '../data/conditions'
import { getPanelKeys } from '../data/bpMeta'
import type { BPRegion, Injury, MHCondition, MHDomainState, HeadCondition, BPCondition } from '../types'

// ── GROUP MAPPING ──────────────────────────────────────────────────────────────

const KEY_TO_GROUP: Record<string, string> = {
  head: 'head', headFace: 'head', leftEar: 'head', rightEar: 'head',
  leftEye: 'head', rightEye: 'head', nose: 'head', jaw: 'head',
  neck: 'neck',
  leftShoulder: 'shoulder', rightShoulder: 'shoulder',
  upperBack: 'back', spine: 'back', lowerBack: 'back',
  chest: 'chest', leftLung: 'chest', rightLung: 'chest',
  abdomen: 'abdomen', pelvis: 'abdomen', glutes: 'abdomen',
  leftHip: 'hip', rightHip: 'hip',
  leftElbow: 'elbow', rightElbow: 'elbow',
  leftForearm: 'wrist_hand', rightForearm: 'wrist_hand',
  leftWrist: 'wrist_hand', rightWrist: 'wrist_hand',
  leftHand: 'wrist_hand', rightHand: 'wrist_hand',
  leftKnee: 'knee', rightKnee: 'knee',
  leftThigh: 'leg', rightThigh: 'leg',
  leftShin: 'leg', rightShin: 'leg',
  leftHamstring: 'leg', rightHamstring: 'leg',
  leftCalf: 'leg', rightCalf: 'leg',
  leftAnkle: 'ankle_foot', rightAnkle: 'ankle_foot',
  leftFoot: 'ankle_foot', rightFoot: 'ankle_foot',
  mental: 'mental',
  systemic: 'systemic',
}

const GROUP_LABELS: Record<string, string> = {
  head: 'Head & Face', mental: 'Mental Health', neck: 'Neck',
  shoulder: 'Shoulder', back: 'Back & Spine', chest: 'Chest / Lungs',
  abdomen: 'Abdomen / Pelvis', hip: 'Hip', elbow: 'Elbow / Forearm',
  wrist_hand: 'Wrist / Hand', knee: 'Knee', leg: 'Thigh / Shin / Calf',
  ankle_foot: 'Ankle / Foot', systemic: 'Other / Systemic', other: 'Other',
}

const GROUP_ORDER = [
  'head', 'mental', 'neck', 'shoulder', 'back', 'chest', 'abdomen',
  'hip', 'elbow', 'wrist_hand', 'knee', 'leg', 'ankle_foot', 'systemic', 'other',
]

// ── SECONDARY SUGGESTIONS ─────────────────────────────────────────────────────

const MENTAL_SECONDARIES = [
  'Depression due to chronic pain', 'Anxiety', 'PTSD (related to injury)',
  'Insomnia / Sleep disturbance', 'Adjustment disorder', 'Somatic symptom disorder',
]

const COMMON_SECONDARIES: Record<string, Array<{ name: string; dc: string }>> = {
  // Knee
  'Knee osteoarthritis': [
    { name: 'Hip osteoarthritis', dc: 'DC 5252' },
    { name: 'Lumbar strain / sprain', dc: 'DC 5237' },
    { name: 'Plantar fasciitis', dc: 'DC 5276' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  'ACL tear / reconstruction': [
    { name: 'Knee osteoarthritis', dc: 'DC 5003' },
    { name: 'Hip osteoarthritis', dc: 'DC 5252' },
    { name: 'Lumbar strain / sprain', dc: 'DC 5237' },
  ],
  'Meniscus tear': [
    { name: 'Knee osteoarthritis', dc: 'DC 5003' },
    { name: 'Hip osteoarthritis', dc: 'DC 5252' },
    { name: 'Lumbar strain / sprain', dc: 'DC 5237' },
  ],
  // Back
  'Lumbar strain / sprain': [
    { name: 'Lumbar radiculopathy / sciatica', dc: 'DC 8520' },
    { name: 'Peripheral neuropathy', dc: 'DC 8520' },
    { name: 'Hip osteoarthritis', dc: 'DC 5252' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  'Lumbar disc herniation': [
    { name: 'Lumbar radiculopathy / sciatica', dc: 'DC 8520' },
    { name: 'Peripheral neuropathy', dc: 'DC 8520' },
    { name: 'Erectile dysfunction', dc: 'DC 7522' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  'Lumbar radiculopathy / sciatica': [
    { name: 'Peripheral neuropathy', dc: 'DC 8520' },
    { name: 'Hip osteoarthritis', dc: 'DC 5252' },
    { name: 'Erectile dysfunction', dc: 'DC 7522' },
  ],
  // Shoulder
  'Rotator cuff tear / tendinopathy': [
    { name: 'Shoulder arthritis', dc: 'DC 5003' },
    { name: 'Cervical strain / sprain', dc: 'DC 5237' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  'Shoulder impingement': [
    { name: 'Rotator cuff tear / tendinopathy', dc: 'DC 5201' },
    { name: 'Shoulder arthritis', dc: 'DC 5003' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  // Neck
  'Cervical strain / sprain': [
    { name: 'Cervical radiculopathy', dc: 'DC 8510' },
    { name: 'Migraine headaches', dc: 'DC 8100' },
    { name: 'Shoulder impingement', dc: 'DC 5201' },
    { name: 'Peripheral neuropathy', dc: 'DC 8515' },
  ],
  'Cervical radiculopathy': [
    { name: 'Carpal tunnel syndrome', dc: 'DC 8515' },
    { name: 'Migraine headaches', dc: 'DC 8100' },
    { name: 'Shoulder impingement', dc: 'DC 5201' },
  ],
  // Ankle/Foot
  'Ankle sprain (chronic)': [
    { name: 'Knee osteoarthritis', dc: 'DC 5003' },
    { name: 'Plantar fasciitis', dc: 'DC 5276' },
    { name: 'Hip osteoarthritis', dc: 'DC 5252' },
  ],
  'Plantar fasciitis': [
    { name: 'Knee osteoarthritis', dc: 'DC 5003' },
    { name: 'Hip osteoarthritis', dc: 'DC 5252' },
    { name: 'Lumbar strain / sprain', dc: 'DC 5237' },
    { name: 'Achilles tendinitis / rupture', dc: 'DC 5024' },
  ],
  // Hip
  'Hip osteoarthritis': [
    { name: 'Lumbar strain / sprain', dc: 'DC 5237' },
    { name: 'Knee osteoarthritis', dc: 'DC 5003' },
    { name: 'Lumbar radiculopathy / sciatica', dc: 'DC 8520' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  // Mental Health
  'Posttraumatic stress disorder': [
    { name: 'Major depressive disorder', dc: 'DC 9434' },
    { name: 'Generalized anxiety disorder', dc: 'DC 9400' },
    { name: 'Sleep apnea', dc: 'DC 6847' },
    { name: 'Hypertension', dc: 'DC 7101' },
    { name: 'Erectile dysfunction', dc: 'DC 7522' },
  ],
  'Major depressive disorder': [
    { name: 'Generalized anxiety disorder', dc: 'DC 9400' },
    { name: 'Sleep apnea', dc: 'DC 6847' },
    { name: 'Migraine headaches', dc: 'DC 8100' },
    { name: 'GERD / acid reflux', dc: 'DC 7346' },
  ],
  'Generalized anxiety disorder': [
    { name: 'Major depressive disorder', dc: 'DC 9434' },
    { name: 'Sleep apnea', dc: 'DC 6847' },
    { name: 'Migraine headaches', dc: 'DC 8100' },
  ],
  // Systemic
  'Sleep apnea': [
    { name: 'Hypertension', dc: 'DC 7101' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
    { name: 'GERD / acid reflux', dc: 'DC 7346' },
    { name: 'Erectile dysfunction', dc: 'DC 7522' },
  ],
  'Diabetes mellitus': [
    { name: 'Peripheral neuropathy', dc: 'DC 8520' },
    { name: 'Erectile dysfunction', dc: 'DC 7522' },
    { name: 'Hypertension', dc: 'DC 7101' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  'Hypertension': [
    { name: 'Major depressive disorder', dc: 'DC 9434' },
    { name: 'Erectile dysfunction', dc: 'DC 7522' },
    { name: 'Migraine headaches', dc: 'DC 8100' },
  ],
}

const CATEGORY_SECONDARIES: Record<string, Array<{ name: string; dc: string }>> = {
  knee: [
    { name: 'Hip osteoarthritis', dc: 'DC 5003' },
    { name: 'Lumbar strain / sprain', dc: 'DC 5237' },
    { name: 'Plantar fasciitis', dc: 'DC 5276' },
    { name: 'Peripheral neuropathy', dc: 'DC 8520' },
  ],
  back: [
    { name: 'Lumbar radiculopathy / sciatica', dc: 'DC 8520' },
    { name: 'Peripheral neuropathy', dc: 'DC 8520' },
    { name: 'Erectile dysfunction', dc: 'DC 7522' },
    { name: 'Hip osteoarthritis', dc: 'DC 5252' },
  ],
  shoulder: [
    { name: 'Cervical strain / sprain', dc: 'DC 5237' },
    { name: 'Peripheral neuropathy', dc: 'DC 8510' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  neck: [
    { name: 'Cervical radiculopathy', dc: 'DC 8510' },
    { name: 'Migraine headaches', dc: 'DC 8100' },
    { name: 'Shoulder impingement', dc: 'DC 5201' },
  ],
  hip: [
    { name: 'Lumbar strain / sprain', dc: 'DC 5237' },
    { name: 'Knee osteoarthritis', dc: 'DC 5003' },
    { name: 'Peripheral neuropathy', dc: 'DC 8520' },
  ],
  ankle_foot: [
    { name: 'Knee osteoarthritis', dc: 'DC 5003' },
    { name: 'Hip osteoarthritis', dc: 'DC 5252' },
    { name: 'Plantar fasciitis', dc: 'DC 5276' },
  ],
  elbow: [
    { name: 'Carpal tunnel syndrome', dc: 'DC 8515' },
    { name: 'Shoulder impingement', dc: 'DC 5201' },
    { name: 'Cervical strain / sprain', dc: 'DC 5237' },
  ],
  wrist_hand: [
    { name: 'Cervical strain / sprain', dc: 'DC 5237' },
    { name: 'Carpal tunnel syndrome', dc: 'DC 8515' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  leg: [
    { name: 'Knee osteoarthritis', dc: 'DC 5003' },
    { name: 'Plantar fasciitis', dc: 'DC 5276' },
    { name: 'Lumbar strain / sprain', dc: 'DC 5237' },
  ],
  chest: [
    { name: 'Sleep apnea', dc: 'DC 6847' },
    { name: 'GERD / acid reflux', dc: 'DC 7346' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  abdomen: [
    { name: 'GERD / acid reflux', dc: 'DC 7346' },
    { name: 'Irritable bowel syndrome (IBS)', dc: 'DC 7319' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  head: [
    { name: 'Migraine headaches', dc: 'DC 8100' },
    { name: 'Tinnitus, recurrent', dc: 'DC 6260' },
    { name: 'Major depressive disorder', dc: 'DC 9434' },
  ],
  mental: [
    { name: 'Sleep apnea', dc: 'DC 6847' },
    { name: 'Migraine headaches', dc: 'DC 8100' },
    { name: 'GERD / acid reflux', dc: 'DC 7346' },
    { name: 'Hypertension', dc: 'DC 7101' },
    { name: 'Erectile dysfunction', dc: 'DC 7522' },
  ],
  systemic: [
    { name: 'Major depressive disorder', dc: 'DC 9434' },
    { name: 'Peripheral neuropathy', dc: 'DC 8520' },
    { name: 'Chronic fatigue syndrome', dc: 'DC 6354' },
  ],
}

function getSecSuggestions(conditionName: string, group: string) {
  return COMMON_SECONDARIES[conditionName] || CATEGORY_SECONDARIES[group] || []
}

// ── TYPES ──────────────────────────────────────────────────────────────────────

interface Claim {
  id: string
  type: 'inj' | 'mh' | 'hd' | 'bp'
  bpRegion?: BPRegion
  label: string
  date: string
  group: string
  rating: number
  rawId: number
}

type SecDomains = Record<string, number | { level: string; frequency: string }>

interface SecAddState {
  area: string
  side: string
  pendingSec: string | null
  pendingDomains: SecDomains
}

// ── HELPERS ────────────────────────────────────────────────────────────────────

const MH_SET = new Set([...VA_MENTAL, ...MENTAL_SECONDARIES].map(n => n.toLowerCase()))

function isConditionMH(name: string): boolean {
  return MH_SET.has(name.toLowerCase())
}

function calcPhysRating(evalDomains: Record<string, number>): number {
  return Object.values(evalDomains).reduce((max, v) => Math.max(max, v), 0)
}

function initSecDomains(name: string): SecDomains {
  if (isConditionMH(name)) {
    return Object.fromEntries(MH_DOMAINS.map(d => [d.id, { level: 'none', frequency: 'less25' }]))
  }
  return Object.fromEntries(PHYSICAL_PROFILE.domains.map(d => [d.id, 0]))
}

function calcSecRating(name: string, domains: SecDomains): number {
  if (isConditionMH(name)) return calculateMHRating(domains as Record<string, { level: string; frequency: string }>)
  return calcPhysRating(domains as Record<string, number>)
}

function getSevStyle(rating: number): { dot: string; badge: string; border: string } {
  if (rating >= 70) return { dot: '#dc2626', badge: '#fef2f2', border: '#fca5a5' }
  if (rating >= 30) return { dot: '#d97706', badge: '#fffbeb', border: '#fde68a' }
  if (rating > 0)   return { dot: '#16a34a', badge: '#f0fdf4', border: '#bbf7d0' }
  return { dot: '#6366f1', badge: '#eef2ff', border: '#c7d2fe' }
}

// ── DOMAIN CARD COMPONENTS ────────────────────────────────────────────────────

function PhysDomainCard({ domain, value, onChange }: {
  domain: { id: string; label: string; description: string; levels: Array<{ value: number; label: string; description: string }> }
  value: number
  onChange: (v: number) => void
}) {
  const selectedLevel = domain.levels.find(lv => lv.value === value)
  return (
    <div className="cr-domain">
      <div className="cr-domain-head">
        <div className="cr-domain-label">{domain.label}</div>
        <div className="cr-domain-desc">{domain.description}</div>
      </div>
      <div className="cr-hd-levels">
        {domain.levels.map(lv => (
          <button
            key={lv.value}
            className={`cr-hd-btn${value === lv.value ? ' cr-hd-active' : ''}`}
            title={lv.description}
            onClick={() => onChange(lv.value)}
          >
            <span className="cr-hd-val">{lv.value}%</span>
            <span className="cr-hd-lbl">{lv.label}</span>
          </button>
        ))}
      </div>
      {selectedLevel && selectedLevel.description && value > 0 && (
        <div className="cr-example">{selectedLevel.description}</div>
      )}
    </div>
  )
}

function MHDomainCard({ domain, domainState, onChange, onFreqChange }: {
  domain: typeof MH_DOMAINS[number]
  domainState: { level: string; frequency: string }
  onChange: (level: string) => void
  onFreqChange: (freq: string) => void
}) {
  const currentLevel = domainState.level || 'none'
  const currentFreq = domainState.frequency || 'less25'
  const exampleText = domain.examples[currentLevel as keyof typeof domain.examples] || ''
  return (
    <div className="cr-domain">
      <div className="cr-domain-head">
        <div className="cr-domain-label">{domain.label}</div>
        <div className="cr-domain-desc">{domain.description}</div>
      </div>
      <div className="cr-levels">
        {MH_IMPAIRMENT_LEVELS.map(lv => (
          <button
            key={lv}
            className={`cr-lv-btn${currentLevel === lv ? ` cr-lv-active-${lv}` : ''}`}
            onClick={() => onChange(lv)}
          >
            {MH_IMPAIRMENT_LABELS[lv]}
          </button>
        ))}
      </div>
      {currentLevel !== 'none' && (
        <div className="cr-freq">
          <span className="cr-freq-label">How often?</span>
          <button
            className={`cr-freq-btn${currentFreq === 'less25' ? ' cr-freq-active' : ''}`}
            onClick={() => onFreqChange('less25')}
          >Less than 25%</button>
          <button
            className={`cr-freq-btn${currentFreq === '25plus' ? ' cr-freq-active' : ''}`}
            onClick={() => onFreqChange('25plus')}
          >25% or more</button>
        </div>
      )}
      {exampleText && <div className="cr-example">{exampleText}</div>}
    </div>
  )
}

// ── INLINE EVAL (primary condition rating) ─────────────────────────────────────

function InlineEval({ claim, injuries, mentalConditions, headConditions, bpConditions, onUpdateInj, onUpdateMH, onUpdateHD, onUpdateBP }: {
  claim: Claim
  injuries: Injury[]
  mentalConditions: MHCondition[]
  headConditions: HeadCondition[]
  bpConditions: Record<BPRegion, BPCondition[]>
  onUpdateInj: (id: number, patch: Partial<Injury>) => void
  onUpdateMH: (id: number, patch: Partial<MHCondition>) => void
  onUpdateHD: (id: number, patch: Partial<HeadCondition>) => void
  onUpdateBP: (region: BPRegion, id: number, patch: Partial<BPCondition>) => void
}) {
  if (claim.type === 'mh') {
    const cond = mentalConditions.find(c => c.id === claim.rawId)
    if (!cond) return null
    return (
      <div className="cr-eval">
        <div className="cr-eval-note">Rate each functional domain (VA 8787 criteria):</div>
        {MH_DOMAINS.map(domain => {
          const ds = cond.domains[domain.id] || { level: 'none', frequency: 'less25' }
          return (
            <MHDomainCard
              key={domain.id}
              domain={domain}
              domainState={ds}
              onChange={(level) => {
                const newDomains = { ...cond.domains, [domain.id]: { level: level as MHDomainState['level'], frequency: level === 'none' ? 'less25' as const : ds.frequency } }
                const calc = calculateMHRating(newDomains)
                onUpdateMH(cond.id, { domains: newDomains, calculatedRating: calc, effectiveRating: cond.manualOverride ?? calc })
              }}
              onFreqChange={(frequency) => {
                const newDomains = { ...cond.domains, [domain.id]: { ...ds, frequency: frequency as MHDomainState['frequency'] } }
                const calc = calculateMHRating(newDomains)
                onUpdateMH(cond.id, { domains: newDomains, calculatedRating: calc, effectiveRating: cond.manualOverride ?? calc })
              }}
            />
          )
        })}
        <div className="cr-calc-rating">Calculated: <strong>{cond.calculatedRating}%</strong></div>
      </div>
    )
  }

  if (claim.type === 'hd') {
    const cond = headConditions.find(c => c.id === claim.rawId)
    if (!cond) return null
    const profile = getHeadProfile(cond.condition)
    return (
      <div className="cr-eval">
        <div className="cr-eval-note">Rate using {profile.label} criteria:</div>
        {profile.note && <div className="cr-profile-note">{profile.note}</div>}
        {profile.domains.map(domain => (
          <PhysDomainCard
            key={domain.id}
            domain={domain}
            value={cond.domains[domain.id] || 0}
            onChange={(value) => {
              const newDomains = { ...cond.domains, [domain.id]: value }
              const calc = calculateHeadRating(newDomains)
              onUpdateHD(cond.id, { domains: newDomains, calculatedRating: calc, effectiveRating: cond.manualOverride ?? calc })
            }}
          />
        ))}
        <div className="cr-calc-rating">Calculated: <strong>{cond.calculatedRating}%</strong></div>
      </div>
    )
  }

  if (claim.type === 'bp' && claim.bpRegion) {
    const region = claim.bpRegion
    const cond = bpConditions[region].find(c => c.id === claim.rawId)
    if (!cond) return null
    const profile = getBPProfile(region, cond.condition)
    return (
      <div className="cr-eval">
        <div className="cr-eval-note">Rate using {profile.label} criteria:</div>
        {profile.note && <div className="cr-profile-note">{profile.note}</div>}
        {profile.domains.map(domain => (
          <PhysDomainCard
            key={domain.id}
            domain={domain}
            value={cond.domains[domain.id] || 0}
            onChange={(value) => {
              const newDomains = { ...cond.domains, [domain.id]: value }
              const calc = calculateBPRating(newDomains)
              onUpdateBP(region, cond.id, { domains: newDomains, calculatedRating: calc, effectiveRating: cond.manualOverride ?? calc })
            }}
          />
        ))}
        <div className="cr-calc-rating">Calculated: <strong>{cond.calculatedRating}%</strong></div>
      </div>
    )
  }

  // Physical injury
  const inj = injuries.find(i => i.id === claim.rawId)
  if (!inj) return null
  const evalDomains = inj.evalDomains ?? Object.fromEntries(PHYSICAL_PROFILE.domains.map(d => [d.id, 0]))
  return (
    <div className="cr-eval">
      <div className="cr-eval-note">Rate each area based on your condition:</div>
      {PHYSICAL_PROFILE.domains.map(domain => (
        <PhysDomainCard
          key={domain.id}
          domain={domain}
          value={evalDomains[domain.id] || 0}
          onChange={(value) => {
            const newDomains = { ...evalDomains, [domain.id]: value }
            const rating = calcPhysRating(newDomains)
            const severity = rating >= 70 ? 'severe' : rating >= 30 ? 'moderate' : rating > 0 ? 'mild' : 'custom'
            onUpdateInj(inj.id, { evalDomains: newDomains, rating, severity })
          }}
        />
      ))}
      <div className="cr-calc-rating">Calculated: <strong>{inj.rating ?? 0}%</strong></div>
    </div>
  )
}

// ── SECONDARY EVAL PANEL ──────────────────────────────────────────────────────

function SecondaryEvalPanel({ secName, evalData, onChange }: {
  secName: string
  evalData: { domains: SecDomains; rating: number }
  onChange: (domains: SecDomains, rating: number) => void
}) {
  const isMH = isConditionMH(secName)
  if (isMH) {
    const mhDomains = evalData.domains as Record<string, { level: string; frequency: string }>
    return (
      <div className="cr-eval cr-eval-sub">
        <div className="cr-eval-note">Rate each functional domain (VA mental health criteria):</div>
        {MH_DOMAINS.map(domain => {
          const ds = mhDomains[domain.id] || { level: 'none', frequency: 'less25' }
          return (
            <MHDomainCard
              key={domain.id}
              domain={domain}
              domainState={ds}
              onChange={(level) => {
                const newDomains = { ...mhDomains, [domain.id]: { ...ds, level, frequency: level === 'none' ? 'less25' : ds.frequency } }
                const rating = calculateMHRating(newDomains)
                onChange(newDomains, rating)
              }}
              onFreqChange={(frequency) => {
                const newDomains = { ...mhDomains, [domain.id]: { ...ds, frequency } }
                const rating = calculateMHRating(newDomains)
                onChange(newDomains, rating)
              }}
            />
          )
        })}
        <div className="cr-calc-rating">Calculated: <strong>{evalData.rating}%</strong></div>
      </div>
    )
  }

  const physDomains = evalData.domains as Record<string, number>
  return (
    <div className="cr-eval cr-eval-sub">
      <div className="cr-eval-note">Rate secondary condition severity:</div>
      {PHYSICAL_PROFILE.domains.map(domain => (
        <PhysDomainCard
          key={domain.id}
          domain={domain}
          value={physDomains[domain.id] || 0}
          onChange={(value) => {
            const newDomains = { ...physDomains, [domain.id]: value }
            const rating = calcPhysRating(newDomains)
            onChange(newDomains, rating)
          }}
        />
      ))}
      <div className="cr-calc-rating">Calculated: <strong>{evalData.rating}%</strong></div>
    </div>
  )
}

// ── ADD SECONDARY SECTION ─────────────────────────────────────────────────────

function AddSecondarySection({ claimId, claimLabel, group, secondaries, addState, onStateChange, onSubmit, onCancel }: {
  claimId: string
  claimLabel: string
  group: string
  secondaries: string[]
  addState: SecAddState
  onStateChange: (patch: Partial<SecAddState>) => void
  onSubmit: (name: string, domains: SecDomains, rating: number) => void
  onCancel: () => void
}) {
  const { area, side, pendingSec, pendingDomains } = addState
  const [customInput, setCustomInput] = useState('')

  const suggestions = getSecSuggestions(claimLabel, group).filter(s => !secondaries.includes(s.name))

  // Get condition list for selected body area
  let condList: string[] = []
  if (area === 'mental') condList = [...VA_MENTAL, ...MENTAL_SECONDARIES]
  else if (area === 'head') condList = VA_HEAD
  else condList = (VA_AREA_CONDITIONS as Record<string, string[]>)[area] || []
  const availableConds = condList.filter(n => !secondaries.includes(n))

  // If a pending secondary is being rated, show its questionnaire
  if (pendingSec) {
    const isMH = isConditionMH(pendingSec)
    const pendingRating = calcSecRating(pendingSec, pendingDomains)
    const mhDomains = pendingDomains as Record<string, { level: string; frequency: string }>
    const physDomains = pendingDomains as Record<string, number>

    return (
      <div className="cr-add-sec">
        <div className="cr-pending-sec">
          <div className="cr-pending-head">
            <span className="cr-pending-name">{pendingSec}</span>
            <span className="cr-rating-badge" style={{ background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' }}>{pendingRating}%</span>
          </div>
          <div className="cr-eval cr-eval-sub">
            {isMH ? (
              <>
                <div className="cr-eval-note">Rate each functional domain (VA mental health criteria):</div>
                {MH_DOMAINS.map(domain => {
                  const ds = mhDomains[domain.id] || { level: 'none', frequency: 'less25' }
                  return (
                    <MHDomainCard
                      key={domain.id}
                      domain={domain}
                      domainState={ds}
                      onChange={(level) => {
                        const newDomains = { ...mhDomains, [domain.id]: { ...ds, level, frequency: level === 'none' ? 'less25' : ds.frequency } }
                        onStateChange({ pendingDomains: newDomains })
                      }}
                      onFreqChange={(frequency) => {
                        onStateChange({ pendingDomains: { ...mhDomains, [domain.id]: { ...ds, frequency } } })
                      }}
                    />
                  )
                })}
              </>
            ) : (
              <>
                <div className="cr-eval-note">Rate secondary condition severity:</div>
                {PHYSICAL_PROFILE.domains.map(domain => (
                  <PhysDomainCard
                    key={domain.id}
                    domain={domain}
                    value={physDomains[domain.id] || 0}
                    onChange={(value) => {
                      onStateChange({ pendingDomains: { ...physDomains, [domain.id]: value } })
                    }}
                  />
                ))}
              </>
            )}
            <div className="cr-calc-rating">Calculated: <strong>{pendingRating}%</strong></div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button className="cr-custom-btn" onClick={() => onSubmit(pendingSec, pendingDomains, pendingRating)}>Add Secondary</button>
            <button className="cr-toggle" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  const handleStartPending = (name: string) => {
    onStateChange({ pendingSec: name, pendingDomains: initSecDomains(name) })
  }

  return (
    <div className="cr-add-sec">
      {suggestions.length > 0 && (
        <div className="cr-suggest">
          <div className="cr-suggest-title">
            Veterans commonly also claim with <strong>{claimLabel}</strong>:
          </div>
          <div className="cr-suggest-chips">
            {suggestions.map(s => (
              <button
                key={s.name}
                className="cr-suggest-chip"
                title={s.dc}
                onClick={() => handleStartPending(s.name)}
              >
                <span className="cr-suggest-plus">+</span> {s.name}
                <span className="cr-suggest-dc">{s.dc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="cr-add-row" style={{ marginTop: 6 }}>
        <label className="cr-add-lbl">Body Part</label>
        <select
          className="cr-add-select-wide"
          value={area}
          onChange={e => onStateChange({ area: e.target.value, side: '', pendingSec: null })}
        >
          <option value="">— Select body part —</option>
          <option value="mental">Mental Health</option>
          <option value="head">Head &amp; Face</option>
          <option value="neck">Neck</option>
          <option value="shoulder">Shoulder</option>
          <option value="back">Back &amp; Spine</option>
          <option value="chest">Chest / Lungs</option>
          <option value="abdomen">Abdomen</option>
          <option value="hip">Hip</option>
          <option value="elbow">Elbow / Forearm</option>
          <option value="wrist_hand">Wrist / Hand</option>
          <option value="knee">Knee</option>
          <option value="leg">Leg</option>
          <option value="ankle_foot">Ankle / Foot</option>
          <option value="systemic">Other / Systemic</option>
        </select>
      </div>

      {area && availableConds.length > 0 && (
        <div className="cr-add-row">
          <label className="cr-add-lbl">Condition</label>
          <select
            className="cr-add-select-wide"
            value=""
            onChange={e => { if (e.target.value) handleStartPending(e.target.value) }}
          >
            <option value="">— Select condition —</option>
            {availableConds.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="cr-custom-row">
        <input
          type="text"
          className="cr-custom-input"
          placeholder="Custom secondary..."
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && customInput.trim()) {
              handleStartPending(customInput.trim())
              setCustomInput('')
            }
          }}
        />
        <button
          className="cr-custom-btn"
          onClick={() => {
            if (customInput.trim()) {
              handleStartPending(customInput.trim())
              setCustomInput('')
            }
          }}
        >Add</button>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function SecondaryTab() {
  const activeTab = useInjuryStore(s => s.ui.activeTab)
  const injuries = useInjuryStore(s => s.injuries)
  const mentalConditions = useInjuryStore(s => s.mentalConditions)
  const headConditions = useInjuryStore(s => s.headConditions)
  const bpConditions = useInjuryStore(s => s.bpConditions)
  const updateInjury = useInjuryStore(s => s.updateInjury)
  const updateMHCondition = useInjuryStore(s => s.updateMHCondition)
  const updateHeadCondition = useInjuryStore(s => s.updateHeadCondition)
  const updateBPCondition = useInjuryStore(s => s.updateBPCondition)
  const removeInjury = useInjuryStore(s => s.removeInjury)
  const removeMHCondition = useInjuryStore(s => s.removeMHCondition)
  const removeHeadCondition = useInjuryStore(s => s.removeHeadCondition)
  const removeBPCondition = useInjuryStore(s => s.removeBPCondition)

  // Local UI state
  const [openPrimary, setOpenPrimary] = useState<Set<string>>(new Set())
  const [openSec, setOpenSec] = useState<Set<string>>(new Set())
  const [groupCollapsed, setGroupCollapsed] = useState<Set<string>>(new Set())
  const [secAddState, setSecAddState] = useState<Record<string, SecAddState>>({})

  // Build unified claim list
  const panelKeys = getPanelKeys()
  const claims: Claim[] = []

  const sortedInjuries = [...injuries]
    .filter(i => !panelKeys.has(i.key))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id)
  sortedInjuries.forEach(i => claims.push({
    id: `inj-${i.id}`, type: 'inj',
    label: i.label, date: i.date || '',
    group: KEY_TO_GROUP[i.key] || 'other',
    rating: i.rating ?? 0, rawId: i.id,
  }))
  mentalConditions.forEach(c => claims.push({
    id: `mh-${c.id}`, type: 'mh',
    label: c.condition, date: '', group: 'mental',
    rating: c.effectiveRating, rawId: c.id,
  }))
  headConditions.forEach(c => claims.push({
    id: `hd-${c.id}`, type: 'hd',
    label: c.condition, date: '', group: 'head',
    rating: c.effectiveRating, rawId: c.id,
  }))
  Object.entries(bpConditions).forEach(([region, conds]) => {
    conds.forEach(c => claims.push({
      id: `bp-${c.id}`, type: 'bp', bpRegion: region as BPRegion,
      label: c.condition, date: '', group: region,
      rating: c.effectiveRating, rawId: c.id,
    }))
  })

  // Group and sort
  const grouped: Record<string, Claim[]> = {}
  claims.forEach(c => {
    if (!grouped[c.group]) grouped[c.group] = []
    grouped[c.group].push(c)
  })
  const sortedGroups = Object.keys(grouped).sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a), bi = GROUP_ORDER.indexOf(b)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  // Helpers to get ref from claim
  function getInjury(rawId: number) { return injuries.find(i => i.id === rawId) }
  function getMH(rawId: number) { return mentalConditions.find(c => c.id === rawId) }
  function getHD(rawId: number) { return headConditions.find(c => c.id === rawId) }
  function getBP(region: BPRegion, rawId: number) { return bpConditions[region]?.find(c => c.id === rawId) }

  function getSecondaries(claim: Claim): string[] {
    if (claim.type === 'inj') return getInjury(claim.rawId)?.secondaries || []
    if (claim.type === 'mh') return getMH(claim.rawId)?.secondaries || []
    if (claim.type === 'hd') return getHD(claim.rawId)?.secondaries || []
    if (claim.type === 'bp' && claim.bpRegion) return getBP(claim.bpRegion, claim.rawId)?.secondaries || []
    return []
  }

  function getSecRatings(claim: Claim): Record<string, number> {
    if (claim.type === 'inj') return getInjury(claim.rawId)?.secondaryRatings || {}
    if (claim.type === 'mh') return getMH(claim.rawId)?.secondaryRatings || {}
    if (claim.type === 'hd') return getHD(claim.rawId)?.secondaryRatings || {}
    if (claim.type === 'bp' && claim.bpRegion) return getBP(claim.bpRegion, claim.rawId)?.secondaryRatings || {}
    return {}
  }

  function getSecEvals(claim: Claim): Record<string, { domains: SecDomains; rating: number }> {
    if (claim.type === 'inj') return getInjury(claim.rawId)?.secondaryEvals || {}
    if (claim.type === 'mh') return getMH(claim.rawId)?.secondaryEvals || {}
    if (claim.type === 'hd') return getHD(claim.rawId)?.secondaryEvals || {}
    if (claim.type === 'bp' && claim.bpRegion) return getBP(claim.bpRegion, claim.rawId)?.secondaryEvals || {}
    return {}
  }

  const patchClaim = useCallback((claim: Claim, patch: { secondaries?: string[]; secondaryRatings?: Record<string, number>; secondaryEvals?: Record<string, { domains: SecDomains; rating: number }> }) => {
    if (claim.type === 'inj') updateInjury(claim.rawId, patch)
    else if (claim.type === 'mh') updateMHCondition(claim.rawId, patch)
    else if (claim.type === 'hd') updateHeadCondition(claim.rawId, patch)
    else if (claim.type === 'bp' && claim.bpRegion) updateBPCondition(claim.bpRegion, claim.rawId, patch)
  }, [updateInjury, updateMHCondition, updateHeadCondition, updateBPCondition])

  const handleDeleteClaim = useCallback((claim: Claim) => {
    const confirmed = window.confirm(`Delete "${claim.label}"?`)
    if (!confirmed) return
    if (claim.type === 'inj') removeInjury(claim.rawId)
    else if (claim.type === 'mh') removeMHCondition(claim.rawId)
    else if (claim.type === 'hd') removeHeadCondition(claim.rawId)
    else if (claim.type === 'bp' && claim.bpRegion) removeBPCondition(claim.bpRegion, claim.rawId)
  }, [removeInjury, removeMHCondition, removeHeadCondition, removeBPCondition])

  const handleAddSecondary = useCallback((claim: Claim, name: string, domains: SecDomains, rating: number) => {
    const secs = getSecondaries(claim)
    if (secs.includes(name)) return
    patchClaim(claim, {
      secondaries: [...secs, name],
      secondaryRatings: { ...getSecRatings(claim), [name]: rating },
      secondaryEvals: { ...getSecEvals(claim), [name]: { domains, rating } },
    })
    setSecAddState(prev => ({ ...prev, [claim.id]: { area: '', side: '', pendingSec: null, pendingDomains: {} } }))
  }, [patchClaim, getSecondaries, getSecRatings, getSecEvals])

  const handleRemoveSecondary = useCallback((claim: Claim, secIdx: number) => {
    const secs = [...getSecondaries(claim)]
    const removed = secs.splice(secIdx, 1)[0]
    const newRatings = { ...getSecRatings(claim) }
    const newEvals = { ...getSecEvals(claim) }
    if (removed) { delete newRatings[removed]; delete newEvals[removed] }
    patchClaim(claim, { secondaries: secs, secondaryRatings: newRatings, secondaryEvals: newEvals })
  }, [patchClaim, getSecondaries, getSecRatings, getSecEvals])

  const togglePrimary = useCallback((id: string) => {
    setOpenPrimary(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }, [])

  const toggleSec = useCallback((id: string) => {
    setOpenSec(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }, [])

  const totalSecCount = claims.reduce((n, c) => n + getSecondaries(c).length, 0)

  return (
    <div id="tab-secondary" className={`content${activeTab !== 'secondary' ? ' hidden' : ''}`}>
      <div className="tl-bar">
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--fh)', textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--navy)' }}>
          Claim Map — Severity &amp; Secondary
        </div>
      </div>
      <div className="tab-instructions">
        Rate how bad each condition is and add any secondary issues it has caused. Click{' '}
        <strong>&ldquo;Rate&rdquo;</strong> to answer questions about your condition. Under each claim,
        use <strong>&ldquo;Add Secondary&rdquo;</strong> to list problems caused by that condition.
        Secondary conditions can increase your overall rating.
      </div>

      {claims.length === 0 ? (
        <div className="empty">
          No claims yet.<br />Add injuries from the Primary Map tab, or evaluate conditions from the Quick Select sidebar.
        </div>
      ) : (
        <div className="cr-tree">
          {sortedGroups.map(groupKey => {
            const groupClaims = grouped[groupKey]
            const groupLabel = GROUP_LABELS[groupKey] || groupKey.replace(/_/g, ' / ')
            const isCollapsed = groupCollapsed.has(groupKey)
            const claimCount = groupClaims.length
            const secCount = groupClaims.reduce((n, cl) => n + getSecondaries(cl).length, 0)

            return (
              <div key={groupKey} className="cr-body-group">
                <div
                  className="cr-group-head"
                  onClick={() => setGroupCollapsed(prev => {
                    const next = new Set(prev)
                    if (next.has(groupKey)) next.delete(groupKey); else next.add(groupKey)
                    return next
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="cr-group-arrow">{isCollapsed ? '▶' : '▼'}</span>
                    <span className="cr-group-title">{groupLabel}</span>
                    <span className="cr-group-count">
                      {claimCount} condition{claimCount !== 1 ? 's' : ''}
                      {secCount > 0 ? ` · ${secCount} secondary` : ''}
                    </span>
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="cr-group-body">
                    {groupClaims.map(claim => {
                      const secs = getSecondaries(claim)
                      const secRatings = getSecRatings(claim)
                      const secEvals = getSecEvals(claim)
                      const { dot, badge, border } = getSevStyle(claim.rating)
                      const isPrimaryOpen = openPrimary.has(claim.id)
                      const addState = secAddState[claim.id] || { area: '', side: '', pendingSec: null, pendingDomains: {} }

                      return (
                        <div key={claim.id} className="cr-primary">
                          {/* Primary condition header */}
                          <div className="cr-primary-head">
                            <div className="cr-primary-info">
                              <span className="cr-dot" style={{ background: dot }} />
                              <div className="cr-primary-name">{claim.label}</div>
                              {claim.date && <span className="cr-date">{claim.date}</span>}
                            </div>
                            <div className="cr-primary-actions">
                              <span
                                className="cr-rating-badge"
                                style={{ background: badge, color: dot, border: `1px solid ${border}` }}
                              >
                                {claim.rating}%
                              </span>
                              <button
                                className={`cr-toggle${isPrimaryOpen ? ' cr-toggle-open' : ''}`}
                                onClick={() => togglePrimary(claim.id)}
                              >
                                {isPrimaryOpen ? '▲ Close' : '▼ Rate'}
                              </button>
                              <button
                                className="cr-del-btn"
                                title="Delete condition"
                                onClick={() => handleDeleteClaim(claim)}
                              >&times;</button>
                            </div>
                          </div>

                          {/* Inline severity evaluation */}
                          {isPrimaryOpen && (
                            <div className="cr-sev-panel">
                              <InlineEval
                                claim={claim}
                                injuries={injuries}
                                mentalConditions={mentalConditions}
                                headConditions={headConditions}
                                bpConditions={bpConditions}
                                onUpdateInj={updateInjury}
                                onUpdateMH={updateMHCondition}
                                onUpdateHD={updateHeadCondition}
                                onUpdateBP={updateBPCondition}
                              />
                            </div>
                          )}

                          {/* Secondary conditions */}
                          {secs.length > 0 && (
                            <div className="cr-secondaries">
                              {secs.map((secName, si) => {
                                const secRating = secRatings[secName] || 0
                                const { dot: sd, badge: sb, border: sbd } = getSevStyle(secRating)
                                const secKey = `${claim.id}-sec-${si}`
                                const isSecOpen = openSec.has(secKey)
                                const evalEntry = secEvals[secName] || { domains: initSecDomains(secName), rating: 0 }

                                return (
                                  <div key={si} className="cr-secondary">
                                    <div className="cr-sec-head">
                                      <div className="cr-sec-info">
                                        <span className="cr-sec-line" />
                                        <span className="cr-sec-dot" style={{ background: sd }} />
                                        <span className="cr-sec-name">{secName}</span>
                                      </div>
                                      <div className="cr-sec-actions">
                                        <span
                                          className="cr-rating-badge cr-rating-sm"
                                          style={{ background: sb, color: sd, border: `1px solid ${sbd}` }}
                                        >
                                          {secRating}%
                                        </span>
                                        <button
                                          className={`cr-toggle cr-toggle-sm${isSecOpen ? ' cr-toggle-open' : ''}`}
                                          onClick={() => toggleSec(secKey)}
                                        >
                                          {isSecOpen ? '▲' : '▼ Rate'}
                                        </button>
                                        <button
                                          className="cr-sec-rm"
                                          onClick={() => handleRemoveSecondary(claim, si)}
                                        >&times;</button>
                                      </div>
                                    </div>
                                    {isSecOpen && (
                                      <SecondaryEvalPanel
                                        secName={secName}
                                        evalData={evalEntry}
                                        onChange={(domains, rating) => {
                                          patchClaim(claim, {
                                            secondaryEvals: { ...secEvals, [secName]: { domains, rating } },
                                            secondaryRatings: { ...secRatings, [secName]: rating },
                                          })
                                        }}
                                      />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {/* Add secondary */}
                          <AddSecondarySection
                            claimId={claim.id}
                            claimLabel={claim.label}
                            group={claim.group}
                            secondaries={secs}
                            addState={addState}
                            onStateChange={(patch) => setSecAddState(prev => ({
                              ...prev,
                              [claim.id]: { ...(prev[claim.id] || { area: '', side: '', pendingSec: null, pendingDomains: {} }), ...patch },
                            }))}
                            onSubmit={(name, domains, rating) => handleAddSecondary(claim, name, domains, rating)}
                            onCancel={() => setSecAddState(prev => ({
                              ...prev,
                              [claim.id]: { area: '', side: '', pendingSec: null, pendingDomains: {} },
                            }))}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
