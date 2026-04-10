"use client"

import { useMemo } from 'react'
import { AlertTriangle, Scale } from 'lucide-react'
import { useInjuryStore } from '../store/useInjuryStore'
import { getPanelKeys, BP_META } from '../data/bpMeta'
import { MH_DOMAINS, MH_IMPAIRMENT_LABELS } from '../data/mhData'
import { HEAD_PROFILES } from '../data/headData'
import { getBPProfile } from '../data/bpProfiles'
import { getSuggestedRating, getExtremity, BP_REGIONS } from '../utils/rating'
import type { BPRegion, MHDomainState, Injury, SpecialClaimsState, HeadCondition, BPCondition, MHCondition } from '../types'

// ── PYRAMIDING RISKS ──────────────────────────────────────────────────────────

const PYRAMIDING_RISKS: [string, string, string][] = [
  ['Knee osteoarthritis', 'Chondromalacia patella', "Both are cartilage problems in the knee. The VA usually treats these as the same condition and won't rate both."],
  ['Knee osteoarthritis', 'Patellofemoral syndrome', 'Kneecap pain (patellofemoral) and arthritis cause similar symptoms. The VA may consider these the same disability.'],
  ['Rotator cuff tear / tendinopathy', 'Shoulder impingement', 'Shoulder impingement is often caused by a rotator cuff problem. The VA may see these as the same issue.'],
  ['Lumbar strain / sprain', 'Degenerative disc disease (lumbar)', "Both are rated based on how far you can bend your back. The VA uses the same rating criteria for both, so rating them separately is not allowed."],
  ['Lumbar disc herniation', 'Intervertebral disc syndrome (IVDS)', 'A herniated disc is a type of disc syndrome (IVDS). These are usually the same condition described two ways.'],
  ['Degenerative disc disease (lumbar)', 'Intervertebral disc syndrome (IVDS)', 'Degenerative disc disease and disc syndrome (IVDS) often describe the same problem. The VA rates the spine under one formula.'],
  ['Cervical strain / sprain', 'Cervical disc disease (DDD)', "Both are rated on how far you can move your neck. Rating both separately is not allowed because they use the same criteria."],
  ['Hip osteoarthritis', 'Hip impingement (FAI)', 'Hip impingement often leads to arthritis over time. The VA may treat these as the same disability.'],
  ['Plantar fasciitis', 'Heel spurs', 'Heel spurs and heel/arch pain (plantar fasciitis) usually go together. The VA often considers them the same condition.'],
  ['Flat feet (pes planus)', 'Plantar fasciitis', 'Flat feet and heel/arch pain cause similar foot problems. The VA may rate these together instead of separately.'],
  ['Lateral epicondylitis (tennis elbow)', 'Elbow arthritis', 'If both are causing the same elbow pain and stiffness, the VA may consider this the same disability.'],
]

const MST_MH_NAMES = new Set([
  'ptsd', 'major depressive disorder', 'generalized anxiety disorder',
  'panic disorder', 'adjustment disorder', 'insomnia / sleep disturbance',
  'substance use disorder', 'eating disorder', 'somatic symptom disorder',
  'other condition related to mst',
])

// Rough check for MH condition names (used to divert secondaries to MH display)
function looksLikeMH(name: string): boolean {
  const l = name.toLowerCase()
  return l.includes('ptsd') || l.includes('depression') || l.includes('anxiety') ||
    l.includes('disorder') || l.includes('insomnia') || l.includes('adjustment') ||
    l.includes('bipolar') || l.includes('panic') || l.includes('trauma')
}

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface RatingItem {
  id: string
  name: string
  rating: number
  extremity: string
  type: string
  suggested: number | null
  parentId?: string | number
  injId?: number
  secIndex?: number
  isMSTPrivate?: boolean
}

interface MHSecondaryDisplay {
  name: string
  rating: number
  parentName: string
}

interface CalcStep {
  name: string
  rating: number
  add?: number
  running: number
}

interface CalcResult {
  combined: number
  rounded: number
  bilateral: boolean
  bilateralFactor: number
  steps: CalcStep[]
}

interface RatingWarning {
  type: 'duplicate' | 'pyramiding'
  title: string
  condition: string
  message: string
}

// ── COMBINED RATING MATH (38 CFR 4.25) ───────────────────────────────────────

function combineVARatings(ratings: number[]): number {
  if (!ratings.length) return 0
  if (ratings.length === 1) return ratings[0]
  const sorted = [...ratings].sort((a, b) => b - a)
  let combined = sorted[0]
  for (let i = 1; i < sorted.length; i++) {
    combined = combined + (sorted[i] / 100) * (100 - combined)
  }
  return combined
}

// ── BUILD RATING ITEMS ────────────────────────────────────────────────────────

function buildRatingItems(
  injuries: Injury[],
  headConditions: HeadCondition[],
  bpConditions: Record<BPRegion, BPCondition[]>,
  mentalConditions: MHCondition[],
  specialClaims: SpecialClaimsState,
  overrides: Record<string, number>,
): { ratingItems: RatingItem[]; mhSecondaryDisplay: MHSecondaryDisplay[]; highestMHId: string | null } {
  const ratingItems: RatingItem[] = []
  const mhSecondaryDisplay: MHSecondaryDisplay[] = []
  const mhSecPool: { rating: number; name: string; id: string; suggested: number | null }[] = []
  const panelKeys = getPanelKeys()

  function pushSecondaries(
    parentId: string,
    ref: { secondaries?: string[]; secondaryRatings?: Record<string, number>; secondaryExtremities?: Record<string, string>; condition?: string },
  ) {
    const secs = ref.secondaries ?? []
    const secRatings = ref.secondaryRatings ?? {}
    const secExtremities = ref.secondaryExtremities ?? {}
    secs.forEach((sec, si) => {
      if (looksLikeMH(sec)) {
        const suggested = getSuggestedRating(sec)
        const rating = secRatings[sec] ?? (suggested ?? 0)
        mhSecondaryDisplay.push({ name: sec, rating, parentName: ref.condition ?? '' })
        if (rating > 0) mhSecPool.push({ rating, name: sec, id: `mhsec-${parentId}-${si}`, suggested })
        return
      }
      const suggested = getSuggestedRating(sec)
      const secId = `es-${parentId}-${si}`
      ratingItems.push({
        id: secId,
        name: sec,
        rating: overrides[secId] ?? secRatings[sec] ?? (suggested ?? 10),
        extremity: secExtremities[sec] ?? 'none',
        type: 'secondary',
        suggested,
        parentId,
      })
    })
  }

  // Primary injuries (exclude panel-managed pin keys)
  const sorted = [...injuries]
    .filter((i) => !panelKeys.has(i.key))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id)

  sorted.forEach((inj) => {
    const ext = getExtremity(inj.key)
    const suggested = getSuggestedRating(inj.label)
    const itemId = `p-${inj.id}`
    ratingItems.push({
      id: itemId,
      injId: inj.id,
      name: inj.label,
      rating: overrides[itemId] ?? (suggested !== null ? suggested : 10),
      extremity: ext,
      type: 'primary',
      suggested,
    })
    if (inj.secondaries?.length) {
      inj.secondaries.forEach((sec, si) => {
        if (looksLikeMH(sec)) {
          const suggested = getSuggestedRating(sec)
          const secRating = (inj.secondaryRatings?.[sec] ?? suggested) ?? 0
          mhSecondaryDisplay.push({ name: sec, rating: secRating, parentName: inj.label })
          if (secRating > 0) mhSecPool.push({ rating: secRating, name: sec, id: `mhsec-p-${inj.id}-${si}`, suggested })
          return
        }
        const secSuggested = getSuggestedRating(sec)
        const secId = `s-${inj.id}-${si}`
        ratingItems.push({
          id: secId,
          injId: inj.id,
          secIndex: si,
          name: sec,
          rating: overrides[secId] ?? (secSuggested ?? 10),
          extremity: 'none',
          type: 'secondary',
          suggested: secSuggested,
          parentId: inj.id,
        })
      })
    }
  })

  // Head & Face conditions
  headConditions.forEach((cond) => {
    const itemId = `hd-${cond.id}`
    const rating = overrides[itemId] ?? cond.effectiveRating
    if (rating > 0) {
      ratingItems.push({
        id: itemId,
        name: cond.condition,
        rating,
        extremity: cond.extremity ?? 'none',
        type: 'head',
        suggested: cond.calculatedRating,
      })
    }
    pushSecondaries(itemId, cond)
  })

  // Body part conditions
  BP_REGIONS.forEach((regionId) => {
    ;(bpConditions[regionId] ?? []).forEach((cond) => {
      const itemId = `bp-${cond.id}`
      const rating = overrides[itemId] ?? cond.effectiveRating
      if (rating > 0) {
        ratingItems.push({
          id: itemId,
          name: cond.condition,
          rating,
          extremity: cond.extremity ?? 'none',
          type: regionId,
          suggested: cond.calculatedRating,
        })
      }
      pushSecondaries(itemId, cond)
    })
  })

  // Mental health — VA single rating rule (highest wins)
  const mhPool: { rating: number; name: string; id: string; suggested: number | null; isMSTPrivate?: boolean }[] = []
  mentalConditions.forEach((cond) => {
    const itemId = `mh-${cond.id}`
    mhPool.push({ rating: overrides[itemId] ?? cond.effectiveRating, name: cond.condition, id: itemId, suggested: cond.calculatedRating })
  })
  const mstData = specialClaims.mstData
  mstData.conditions.forEach((cond, i) => {
    if (MST_MH_NAMES.has(cond.name.toLowerCase())) {
      const displayName = mstData.privacyShield ? 'Private Condition (MST)' : cond.name
      mhPool.push({ rating: cond.rating, name: displayName, id: `mst-mh-${i}`, suggested: null, isMSTPrivate: mstData.privacyShield })
    }
  })

  mhSecPool.forEach((item) => mhPool.push(item))

  let highestMHId: string | null = null
  if (mhPool.length) {
    const highest = mhPool.reduce((best, item) => item.rating > best.rating ? item : best, mhPool[0])
    highestMHId = highest.id
    if (highest.rating > 0) {
      ratingItems.push({
        id: highest.id,
        name: `Mental Health (${highest.name})`,
        rating: highest.rating,
        extremity: 'none',
        type: 'mental',
        suggested: highest.suggested,
        isMSTPrivate: highest.isMSTPrivate,
      })
    }
    mentalConditions.forEach((cond) => pushSecondaries(`mh-${cond.id}`, cond))
    mstData.conditions.forEach((cond, i) => {
      if (MST_MH_NAMES.has(cond.name.toLowerCase()) && cond.secondaries?.length) {
        cond.secondaries.forEach((sec, j) => {
          if (sec.rating > 0) {
            ratingItems.push({
              id: `mst-mh-${i}-sec-${j}`,
              name: mstData.privacyShield ? 'Private Secondary' : `${sec.name} (secondary to ${cond.name})`,
              rating: sec.rating,
              extremity: 'none',
              type: 'secondary',
              suggested: null,
              isMSTPrivate: mstData.privacyShield,
            })
          }
        })
      }
    })
  }

  // MST non-mental-health physical conditions
  mstData.conditions.forEach((cond, i) => {
    if (!MST_MH_NAMES.has(cond.name.toLowerCase())) {
      if (cond.rating > 0) {
        ratingItems.push({
          id: `mst-${i}`,
          name: mstData.privacyShield ? 'Private Condition' : cond.name,
          rating: cond.rating,
          extremity: 'none',
          type: 'mst',
          suggested: null,
          isMSTPrivate: mstData.privacyShield,
        })
      }
      cond.secondaries?.forEach((sec, j) => {
        if (sec.rating > 0) {
          ratingItems.push({
            id: `mst-${i}-sec-${j}`,
            name: mstData.privacyShield ? 'Private Secondary' : `${sec.name} (secondary to ${cond.name})`,
            rating: sec.rating,
            extremity: 'none',
            type: 'mst',
            suggested: null,
            isMSTPrivate: mstData.privacyShield,
          })
        }
      })
    }
  })

  return { ratingItems, mhSecondaryDisplay, highestMHId }
}

// ── CALCULATE COMBINED RATING (38 CFR 4.25 + 4.26) ───────────────────────────

function calculateVARating(ratingItems: RatingItem[]): CalcResult {
  const items = ratingItems.filter((r) => r.rating > 0)
  if (!items.length) return { combined: 0, rounded: 0, bilateral: false, bilateralFactor: 0, steps: [] }

  const upperLeft = items.filter((d) => d.extremity === 'LU')
  const upperRight = items.filter((d) => d.extremity === 'RU')
  const lowerLeft = items.filter((d) => d.extremity === 'LL')
  const lowerRight = items.filter((d) => d.extremity === 'RL')
  const nonBilateral = items.filter((d) => d.extremity === 'none')

  const hasUpperBil = upperLeft.length > 0 && upperRight.length > 0
  const hasLowerBil = lowerLeft.length > 0 && lowerRight.length > 0

  const bilateralEntries: { rating: number; name: string }[] = []
  const nonBilateralEntries: { rating: number; name: string }[] = nonBilateral.map((d) => ({ rating: d.rating, name: d.name }))
  let bilateralFactorTotal = 0

  if (hasUpperBil) {
    const ur = [...upperLeft, ...upperRight]
    const c = combineVARatings(ur.map((d) => d.rating))
    const bf = c * 0.10
    bilateralEntries.push({ rating: Math.round(c + bf), name: `Upper Bilateral (${ur.map((d) => d.name).join(' + ')})` })
    bilateralFactorTotal += bf
  } else {
    ;[...upperLeft, ...upperRight].forEach((d) => nonBilateralEntries.push({ rating: d.rating, name: d.name }))
  }

  if (hasLowerBil) {
    const lr = [...lowerLeft, ...lowerRight]
    const c = combineVARatings(lr.map((d) => d.rating))
    const bf = c * 0.10
    bilateralEntries.push({ rating: Math.round(c + bf), name: `Lower Bilateral (${lr.map((d) => d.name).join(' + ')})` })
    bilateralFactorTotal += bf
  } else {
    ;[...lowerLeft, ...lowerRight].forEach((d) => nonBilateralEntries.push({ rating: d.rating, name: d.name }))
  }

  const allEntries = [...bilateralEntries, ...nonBilateralEntries].sort((a, b) => b.rating - a.rating)
  if (!allEntries.length) return { combined: 0, rounded: 0, bilateral: false, bilateralFactor: 0, steps: [] }

  let combined = allEntries[0].rating
  const steps: CalcStep[] = [{ name: allEntries[0].name, rating: allEntries[0].rating, running: combined }]
  for (let i = 1; i < allEntries.length; i++) {
    const add = (allEntries[i].rating / 100) * (100 - combined)
    combined += add
    steps.push({ name: allEntries[i].name, rating: allEntries[i].rating, add, running: combined })
  }

  const whole = Math.round(combined)
  const final10 = Math.round(whole / 10) * 10

  return { combined, rounded: final10, bilateral: hasUpperBil || hasLowerBil, bilateralFactor: bilateralFactorTotal, steps }
}

// ── WARNINGS ──────────────────────────────────────────────────────────────────

function detectWarnings(ratingItems: RatingItem[]): RatingWarning[] {
  const warnings: RatingWarning[] = []
  const allConds: { name: string; extremity: string }[] = []

  ratingItems.filter((r) => r.rating > 0).forEach((item) => {
    allConds.push({ name: item.name, extremity: item.extremity })
  })

  const seen: Record<string, number> = {}
  allConds.forEach((c) => {
    const key = `${c.name.toLowerCase()}|${c.extremity}`
    seen[key] = (seen[key] ?? 0) + 1
  })
  Object.entries(seen).forEach(([key, count]) => {
    if (count > 1) {
      const name = key.split('|')[0]
      warnings.push({
        type: 'duplicate',
        title: 'Possible Duplicate',
        condition: name,
        message: `"${name}" appears to be rated ${count} times on the same side. The VA will not rate the same condition twice.`,
      })
    }
  })

  const warnKeys = new Set<string>()
  PYRAMIDING_RISKS.forEach(([condA, condB, reason]) => {
    const aLower = condA.toLowerCase()
    const bLower = condB.toLowerCase()
    allConds.forEach((c1) => {
      if (c1.name.toLowerCase() !== aLower) return
      allConds.forEach((c2) => {
        if (c2.name.toLowerCase() !== bLower) return
        if (c1.extremity === c2.extremity) {
          const warnKey = [aLower, bLower, c1.extremity].sort().join('|')
          if (!warnKeys.has(warnKey)) {
            warnKeys.add(warnKey)
            warnings.push({ type: 'pyramiding', title: 'Possible Pyramiding (38 CFR 4.14)', condition: `${condA} + ${condB}`, message: reason })
          }
        }
      })
    })
  })

  return warnings
}

// ── SEVERITY COLORS ───────────────────────────────────────────────────────────

const SEVERITY_BG: Record<string, string> = {
  mild: '#6dbd6d', moderate: '#e0a020', severe: '#e04040', custom: '#6060c0',
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export function RatingTab() {
  const activeTab = useInjuryStore((s) => s.ui.activeTab)
  const injuries = useInjuryStore((s) => s.injuries)
  const mentalConditions = useInjuryStore((s) => s.mentalConditions)
  const headConditions = useInjuryStore((s) => s.headConditions)
  const bpConditions = useInjuryStore((s) => s.bpConditions)
  const specialClaims = useInjuryStore((s) => s.specialClaims)

  const ratingOverrides = useInjuryStore((s) => s.ratingOverrides)
  const setRatingOverride = useInjuryStore((s) => s.setRatingOverride)

  const { ratingItems, mhSecondaryDisplay, highestMHId } = useMemo(
    () => buildRatingItems(injuries, headConditions, bpConditions, mentalConditions, specialClaims, ratingOverrides),
    [injuries, headConditions, bpConditions, mentalConditions, specialClaims, ratingOverrides],
  )

  const result = useMemo(() => calculateVARating(ratingItems), [ratingItems])
  const warnings = useMemo(() => detectWarnings(ratingItems), [ratingItems])

  // Sorted injury list for numbering (same logic as MapTab)
  const panelKeys = getPanelKeys()
  const sortedInjuries = useMemo(
    () => [...injuries].filter((i) => !panelKeys.has(i.key)).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id
    ),
    [injuries], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const primaries = ratingItems.filter((r) => r.type === 'primary')
  const secondaries = ratingItems.filter((r) => r.type === 'secondary')
  const hdItems = ratingItems.filter((r) => r.type === 'head')
  const mhItems = ratingItems.filter((r) => r.type === 'mental')
  const mstItems = ratingItems.filter((r) => r.type === 'mst')
  const activeBPRegions = BP_REGIONS.filter((r) => (bpConditions[r] ?? []).length > 0)
  const mstPrivate = specialClaims.mstData.privacyShield
  const mstMHDisplay = specialClaims.mstData.conditions.map((c, i) => ({ ...c, index: i })).filter((c) => MST_MH_NAMES.has(c.name.toLowerCase()))

  const isEmpty = !primaries.length && !headConditions.length && !mentalConditions.length && !activeBPRegions.length && !mstItems.length

  function renderSecondaries(parentId: string | number) {
    const secs = secondaries.filter((s) => s.parentId === parentId)
    if (!secs.length) return null
    return (
      <div className="rc-secs">
        {secs.map((sec) => (
          <div key={sec.id} className="rc-sec-item">
            <div className="rc-sec-header">
              <span className="rc-sec-dot">&#8627;</span>
              <span className="rc-sec-name">{sec.name}</span>
              {sec.extremity !== 'none' && <span className="rc-ext-tag">{sec.extremity}</span>}
              {sec.suggested !== null && sec.suggested !== undefined && (
                <span className="rc-suggest">Suggested: {sec.suggested}%</span>
              )}
              <span className="rc-pct-box">
                <input
                  type="number" min={0} max={100} step={10} value={sec.rating}
                  onChange={(e) => setRatingOverride(sec.id, parseInt(e.target.value) || 0)}
                  className="rc-pct-input"
                />
                <span className="rc-pct-sign">%</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div id="tab-rating" className={`content${activeTab !== 'rating' ? ' hidden' : ''}`}>
      <div className="tl-bar">
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--fh)', textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--navy)' }}>
          VA Rating Calculator
        </div>
      </div>
      <div className="tab-instructions">
        Your estimated combined VA disability rating based on all conditions you&apos;ve entered. The VA
        uses <strong>&ldquo;VA Math&rdquo;</strong> — each rating is applied to the remaining healthy
        percentage, not simply added together. Conditions affecting both sides of your body (left and
        right knee, for example) get a 10% bilateral bonus. This is an estimate only — your actual
        rating may differ.
      </div>

      <div>
        {isEmpty ? (
          <div className="empty">
            No injuries logged yet.<br />Add injuries from the Body Map tab to calculate your combined VA rating.
          </div>
        ) : (
          <>
            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="rc-warnings">
                {warnings.map((w, i) => (
                  <div key={i} className={`rc-warning ${w.type === 'duplicate' ? 'rc-warn-dup' : 'rc-warn-pyr'}`}>
                    <div className="rc-warning-header">{w.type === 'duplicate' ? <AlertTriangle size={14} strokeWidth={2.5} /> : <Scale size={14} strokeWidth={2.5} />} {w.title}</div>
                    <div className="rc-warning-cond">{w.condition}</div>
                    <div className="rc-warning-msg">{w.message}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="rc-info">
              <strong>How VA combined ratings work</strong>: Ratings are not added together. Each rating is applied to the remaining &ldquo;whole person&rdquo; percentage.
              {' '}Example: 50% + 30% = 50 + (30% &times; 50 remaining) = 65%, rounded to 70%.
              {' '}Bilateral factor (10%) is auto-applied when paired extremities are both rated.
            </div>

            {/* Primary conditions */}
            {primaries.length > 0 && (
              <>
                <div className="rc-section-title">Primary Conditions</div>
                {primaries.map((item) => {
                  const injIdx = sortedInjuries.findIndex((i) => i.id === item.injId)
                  const num = injIdx >= 0 ? injIdx + 1 : '?'
                  const inj = injuries.find((i) => i.id === item.injId)
                  const bgColor = inj ? (SEVERITY_BG[inj.severity] ?? SEVERITY_BG.custom) : SEVERITY_BG.custom
                  return (
                    <div key={item.id} className="rc-card">
                      <div className="rc-card-header">
                        <span className="rc-num" style={{ background: bgColor }}>{num}</span>
                        <span className="rc-name">{item.name}</span>
                        {item.extremity !== 'none' && <span className="rc-ext-tag">{item.extremity}</span>}
                        {item.suggested !== null && item.suggested !== undefined && (
                          <span className="rc-suggest" title="Common VA rating for this condition">Suggested: {item.suggested}%</span>
                        )}
                        <span className="rc-pct-box">
                          <input
                            type="number" min={0} max={100} step={10} value={item.rating}
                            onChange={(e) => setRatingOverride(item.id, parseInt(e.target.value) || 0)}
                            className="rc-pct-input"
                          />
                          <span className="rc-pct-sign">%</span>
                        </span>
                      </div>
                      {renderSecondaries(item.injId!)}
                    </div>
                  )
                })}
              </>
            )}

            {/* Head & Face */}
            {headConditions.length > 0 && (
              <>
                <div className="rc-section-title" style={{ marginTop: 20 }}>Head &amp; Face Conditions</div>
                <div className="rc-info" style={{ marginBottom: 10, fontSize: 11 }}>Each head/face condition is rated independently under its own diagnostic code.</div>
                {headConditions.map((cond) => {
                  const profile = HEAD_PROFILES[cond.profile] ?? HEAD_PROFILES.generic
                  const profileLabel = profile.label.split('(')[0].trim()
                  const domainSummary = profile.domains.map((d) => {
                    const v = cond.domains[d.id]
                    if (!v) return null
                    const lv = d.levels.find((l) => l.value === v)
                    return lv ? `${d.label.split(':').pop()?.trim()}: ${v}%` : null
                  }).filter(Boolean).join(', ') || 'Not evaluated'
                  const inRating = hdItems.some((r) => r.id === `hd-${cond.id}`)
                  const itemId = `hd-${cond.id}`
                  const displayRating = ratingOverrides[itemId] ?? cond.effectiveRating
                  return (
                    <div key={cond.id} className="rc-card" style={{ borderLeft: `3px solid ${inRating ? 'var(--navy)' : 'var(--border)'}` }}>
                      <div className="rc-card-header">
                        <span className="rc-num" style={{ background: 'var(--navy)' }}>&#129504;</span>
                        <span className="rc-name">{cond.condition}</span>
                        <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--fh)', color: 'var(--muted)', background: 'var(--bg)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 3 }}>{profileLabel}</span>
                        {cond.manualOverride !== null && <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--fh)', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.5px' }}>Manual</span>}
                        <span className="rc-pct-box">
                          <input
                            type="number" min={0} max={100} step={10} value={displayRating}
                            onChange={(e) => setRatingOverride(itemId, parseInt(e.target.value) || 0)}
                            className="rc-pct-input"
                          />
                          <span className="rc-pct-sign">%</span>
                        </span>
                      </div>
                      <div style={{ padding: '8px 16px 12px', fontSize: 12, color: 'var(--muted)' }}>
                        <div>{domainSummary}</div>
                        <div style={{ marginTop: 4, fontWeight: 700, fontFamily: 'var(--fm)', color: 'var(--navy)' }}>
                          {displayRating}%{cond.manualOverride !== null ? ' (override)' : ''}
                          {cond.calculatedRating !== displayRating && (
                            <span style={{ color: 'var(--muted)', fontWeight: 400 }}> (calculated: {cond.calculatedRating}%)</span>
                          )}
                        </div>
                      </div>
                      {renderSecondaries(`hd-${cond.id}`)}
                    </div>
                  )
                })}
              </>
            )}

            {/* Body part sections */}
            {activeBPRegions.map((regionId) => {
              const meta = BP_META[regionId]
              const conds = bpConditions[regionId] ?? []
              const bpItems = ratingItems.filter((r) => r.type === regionId)
              return (
                <div key={regionId}>
                  <div className="rc-section-title" style={{ marginTop: 20 }}>{meta.title}</div>
                  {conds.map((cond) => {
                    const profile = getBPProfile(regionId, cond.condition)
                    const profileLabel = profile.label.split('(')[0].trim()
                    const domainSummary = profile.domains.map((d) => {
                      const v = cond.domains[d.id]
                      if (!v) return null
                      return `${d.label.split(':').pop()?.trim()}: ${v}%`
                    }).filter(Boolean).join(', ') || 'Not evaluated'
                    const inRating = bpItems.some((r) => r.id === `bp-${cond.id}`)
                    const itemId = `bp-${cond.id}`
                    const displayRating = ratingOverrides[itemId] ?? cond.effectiveRating
                    return (
                      <div key={cond.id} className="rc-card" style={{ borderLeft: `3px solid ${inRating ? 'var(--navy)' : 'var(--border)'}` }}>
                        <div className="rc-card-header">
                          <span className="rc-num" style={{ background: 'var(--navy)' }}>&#9881;</span>
                          <span className="rc-name">{cond.condition}{cond.sideLabel ? ` (${cond.sideLabel})` : ''}</span>
                          {cond.extremity && cond.extremity !== 'none' && <span className="rc-ext-tag">{cond.extremity}</span>}
                          <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--fh)', color: 'var(--muted)', background: 'var(--bg)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 3 }}>{profileLabel}</span>
                          {cond.manualOverride !== null && <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--fh)', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.5px' }}>Manual</span>}
                          <span className="rc-pct-box">
                            <input
                              type="number" min={0} max={100} step={10} value={displayRating}
                              onChange={(e) => setRatingOverride(itemId, parseInt(e.target.value) || 0)}
                              className="rc-pct-input"
                            />
                            <span className="rc-pct-sign">%</span>
                          </span>
                        </div>
                        <div style={{ padding: '8px 16px 12px', fontSize: 12, color: 'var(--muted)' }}>
                          <div>{domainSummary}</div>
                          <div style={{ marginTop: 4, fontWeight: 700, fontFamily: 'var(--fm)', color: 'var(--navy)' }}>
                            {displayRating}%{cond.manualOverride !== null ? ' (override)' : ''}
                            {cond.calculatedRating !== displayRating && (
                              <span style={{ color: 'var(--muted)', fontWeight: 400 }}> (calculated: {cond.calculatedRating}%)</span>
                            )}
                          </div>
                        </div>
                        {renderSecondaries(`bp-${cond.id}`)}
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {/* Mental Health */}
            {(mentalConditions.length > 0 || mhSecondaryDisplay.length > 0 || mstMHDisplay.length > 0) && (
              <>
                <div className="rc-section-title" style={{ marginTop: 20 }}>Mental Health (VA Single Rating)</div>
                <div className="rc-info" style={{ marginBottom: 10, fontSize: 11 }}>
                  The VA rates all mental health conditions under one combined rating. The highest evaluated rating ({mhItems.length ? `${mhItems[0].rating}%` : '0%'}) is used.
                  {' '}Mental health secondaries are absorbed into this single rating and not double-counted.
                  {mstMHDisplay.length > 0 && <>{' '}<strong>MST-caused mental health conditions</strong> are included in this pool per VA rules.</>}
                </div>
                {mentalConditions.map((cond) => {
                  const isHighest = highestMHId === `mh-${cond.id}`
                  const itemId = `mh-${cond.id}`
                  const displayRating = ratingOverrides[itemId] ?? cond.effectiveRating
                  const domainSummary = MH_DOMAINS.map((d) => {
                    const st = cond.domains[d.id] as MHDomainState | undefined
                    if (!st || st.level === 'none') return null
                    return `${d.label.split(' ')[0]}: ${MH_IMPAIRMENT_LABELS[st.level]}`
                  }).filter(Boolean).join(', ') || 'Not evaluated'
                  return (
                    <div key={cond.id} className="rc-card" style={{ borderLeft: `3px solid ${isHighest ? 'var(--red)' : 'var(--border)'}` }}>
                      <div className="rc-card-header">
                        <span className="rc-num" style={{ background: 'var(--navy)' }}>&#9881;</span>
                        <span className="rc-name">{cond.condition}</span>
                        {isHighest && <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--fh)', color: 'var(--red)', background: '#fef2f2', border: '1px solid #fecaca', padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.5px' }}>Active Rating</span>}
                        {cond.manualOverride !== null && <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--fh)', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.5px' }}>Manual</span>}
                        <span className="rc-pct-box">
                          <input
                            type="number" min={0} max={100} step={10} value={displayRating}
                            onChange={(e) => setRatingOverride(itemId, parseInt(e.target.value) || 0)}
                            className="rc-pct-input"
                          />
                          <span className="rc-pct-sign">%</span>
                        </span>
                      </div>
                      <div style={{ padding: '8px 16px 12px', fontSize: 12, color: 'var(--muted)' }}>
                        <div>{domainSummary}</div>
                        <div style={{ marginTop: 4, fontWeight: 700, fontFamily: 'var(--fm)', color: 'var(--navy)' }}>
                          {displayRating}%{cond.manualOverride !== null ? ' (override)' : ''}
                          {cond.calculatedRating !== displayRating && (
                            <span style={{ color: 'var(--muted)', fontWeight: 400 }}> (calculated: {cond.calculatedRating}%)</span>
                          )}
                        </div>
                      </div>
                      {renderSecondaries(`mh-${cond.id}`)}
                    </div>
                  )
                })}

                {mstMHDisplay.length > 0 && (
                  <>
                    <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, fontFamily: 'var(--fh)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', padding: '0 4px' }}>MST-Caused Mental Health Conditions</div>
                    {mstMHDisplay.map((mstCond) => {
                      const isHighest = highestMHId === `mst-mh-${mstCond.index}`
                      const displayName = mstPrivate ? 'Private Condition (MST)' : mstCond.name
                      return (
                        <div key={mstCond.index} className="rc-card" style={{ borderLeft: `3px solid ${isHighest ? 'var(--red)' : (mstPrivate ? '#6b7280' : 'var(--border)')}` }}>
                          <div className="rc-card-header">
                            <span className="rc-num" style={{ background: mstPrivate ? '#6b7280' : 'var(--navy)' }}>{mstPrivate ? '&#128274;' : '&#9878;'}</span>
                            <span className="rc-name">{displayName}</span>
                            {isHighest && <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--fh)', color: 'var(--red)', background: '#fef2f2', border: '1px solid #fecaca', padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.5px' }}>Active Rating</span>}
                            <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--fh)', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.5px' }}>MST</span>
                            <span className="rc-pct-box"><span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--fm)', color: 'var(--navy)' }}>{mstCond.rating}%</span></span>
                          </div>
                          <div style={{ padding: '4px 16px 8px', fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>Included in single MH rating per VA rules. Managed in Special Claims &gt; MST.</div>
                        </div>
                      )
                    })}
                  </>
                )}

                {mhSecondaryDisplay.length > 0 && (
                  <>
                    <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, fontFamily: 'var(--fh)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', padding: '0 4px' }}>Mental Health Secondaries</div>
                    {mhSecondaryDisplay.map((sec, i) => (
                      <div key={i} className="rc-card" style={{ borderLeft: '3px solid var(--border)' }}>
                        <div className="rc-card-header">
                          <span className="rc-sec-dot">&#8627;</span>
                          <span className="rc-name">{sec.name}</span>
                          <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--fh)', color: 'var(--muted)', background: 'var(--bg)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 3 }}>Secondary to {sec.parentName}</span>
                          <span className="rc-pct-box"><span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--fm)', color: 'var(--navy)' }}>{sec.rating}%</span></span>
                        </div>
                        <div style={{ padding: '4px 16px 8px', fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>Absorbed into single MH rating per VA rules — not double-counted in combined calculation.</div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {/* MST Physical Conditions */}
            {mstItems.length > 0 && (
              <>
                <div className="rc-section-title" style={{ marginTop: 20 }}>
                  {mstPrivate ? '&#128274; MST Physical Conditions' : 'MST-Related Physical Conditions'}
                </div>
                <div className="rc-info" style={{ marginBottom: 10, fontSize: 11 }}>
                  {mstPrivate
                    ? 'Privacy Shield is ON. Details are hidden. Go to Special Claims to manage.'
                    : 'Physical conditions caused by MST. These are rated separately (not under the mental health single rating).'}
                </div>
                {mstItems.map((item) => (
                  <div key={item.id} className="rc-card" style={{ borderLeft: `3px solid ${mstPrivate ? '#6b7280' : 'var(--navy)'}` }}>
                    <div className="rc-card-header">
                      <span className="rc-num" style={{ background: mstPrivate ? '#6b7280' : 'var(--navy)' }}>{mstPrivate ? '&#128274;' : '&#9878;'}</span>
                      <span className="rc-name">{item.name}</span>
                      <span className="rc-pct-box"><span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--fm)', color: 'var(--navy)' }}>{item.rating}%</span></span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Vocational */}
            {specialClaims.vocSecondaries.length > 0 && (
              <>
                <div className="rc-section-title" style={{ marginTop: 20 }}>Vocational Implications</div>
                <div className="rc-card" style={{ borderLeft: '3px solid #b45309' }}>
                  <div style={{ padding: '10px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {specialClaims.vocSecondaries.map((s, i) => (
                      <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}>{s}</span>
                    ))}
                  </div>
                  {specialClaims.vocNotes && (
                    <div style={{ padding: '4px 16px 10px', fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>{specialClaims.vocNotes}</div>
                  )}
                </div>
              </>
            )}

            {/* Results */}
            <div className="rc-results">
              <div className="rc-results-header">Combined VA Disability Rating</div>
              <div className="rc-results-big">{result.rounded}%</div>
              <div className="rc-results-exact">Exact: {result.combined.toFixed(2)}%</div>
              {result.bilateral && (
                <div className="rc-results-bil">
                  <strong>Bilateral factor applied (+{result.bilateralFactor.toFixed(2)}%)</strong><br />
                  <span style={{ fontSize: 10 }}>Conditions affecting both paired extremities receive a 10% bonus on their combined value before merging with other ratings.</span>
                </div>
              )}
            </div>

            {/* Step-by-step breakdown */}
            {result.steps.length > 0 && (
              <div className="rc-steps-wrap">
                <div className="rc-steps-title">Step-by-Step Calculation</div>
                {result.steps.map((step, i) =>
                  i === 0 ? (
                    <div key={i} className="rc-step">
                      <div className="rc-step-label">Start with highest</div>
                      <div className="rc-step-detail">
                        <span className="rc-step-name">{step.name}</span>
                        <span className="rc-step-pct">{step.rating}%</span>
                      </div>
                      <div className="rc-step-running">= {step.running.toFixed(2)}%</div>
                    </div>
                  ) : (
                    <div key={i} className="rc-step">
                      <div className="rc-step-detail">
                        <span className="rc-step-plus">+</span>
                        <span className="rc-step-name">{step.name}</span>
                        <span className="rc-step-pct">{step.rating}%</span>
                        <span className="rc-step-math">of {(100 - (step.running - step.add!)).toFixed(1)} remaining = +{step.add!.toFixed(2)}</span>
                      </div>
                      <div className="rc-step-running">= {step.running.toFixed(2)}%</div>
                    </div>
                  )
                )}
                <div className="rc-step rc-step-final">
                  <div className="rc-step-detail">
                    <span className="rc-step-name">Exact combined</span>
                    <span className="rc-step-pct">{result.combined.toFixed(2)}%</span>
                  </div>
                  <div className="rc-step-detail" style={{ marginTop: 2 }}>
                    <span className="rc-step-name">Rounded to nearest 10</span>
                    <span className="rc-step-pct" style={{ fontSize: 16, color: 'var(--navy)' }}>{result.rounded}%</span>
                  </div>
                </div>
                {result.bilateral && (
                  <div style={{ fontSize: 11, color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 6, padding: '8px 12px', marginTop: 4 }}>
                    <strong>Bilateral factor: +{result.bilateralFactor.toFixed(2)}%</strong><br />
                    <span style={{ fontSize: 10, color: '#6b21a8' }}>The same condition on both sides of paired extremities (arms or legs) receives a 10% bonus per 38 CFR 4.26.</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
