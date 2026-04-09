import type { Injury, MentalHealthCondition, HeadCondition, BPCondition, MSTData, TrackerState } from './types'
import { BP_REGISTRY } from './registry'
import { VA_MENTAL, MENTAL_SECONDARIES } from './mental-health'

// ── EVIDENCE GAP DETECTION ────────────────────────────────────────────────

interface GapField {
  key: keyof Injury
  label: string
  check?: (val: unknown) => boolean
  condition?: (inj: Injury) => boolean
}

const GAP_FIELDS: GapField[] = [
  { key: 'description', label: 'Description / Notes' },
  { key: 'event',       label: 'Service Event' },
  { key: 'medicalCare', label: 'Medical Evidence', check: v => v === 'yes' },
  { key: 'installation', label: 'Installation / Location' },
  { key: 'clinicName',  label: 'Clinic Name', condition: i => i.medicalCare === 'yes' },
]

export function getGaps(inj: Injury): string[] {
  const missing: string[] = []
  GAP_FIELDS.forEach(f => {
    if (f.condition && !f.condition(inj)) return
    const val = inj[f.key] as string | undefined
    const present = f.check ? f.check(val) : !!(val && val.trim && val.trim() !== '')
    if (!present) missing.push(f.label)
  })
  return missing
}

export function gapStatus(inj: Injury) {
  const gaps = getGaps(inj)
  if (gaps.length === 0) {
    return { status: 'complete' as const, color: 'var(--mild)', bg: '#f0fdf4', border: '#bbf7d0', label: 'Complete', gaps }
  }
  return { status: 'incomplete' as const, color: 'var(--moderate)', bg: '#fffbeb', border: '#fde68a', label: `Needs Evidence (${gaps.length})`, gaps }
}

// ── SUGGESTED RATINGS ─────────────────────────────────────────────────────

const SUGGESTED_RATINGS: Record<string, number> = {
  'tinnitus': 10, 'tinnitus, recurrent': 10,
  'limited rom - knee': 10, 'limited rom - ankle': 10,
  'limited rom - shoulder': 20, 'limited rom - hip': 10,
  'limited rom - elbow': 10, 'limited rom - wrist': 10,
  'limited rom - cervical spine': 20, 'limited rom - thoracolumbar spine': 20,
  'degenerative joint disease - knee': 10, 'degenerative joint disease - hip': 10,
  'degenerative joint disease - ankle': 10,
  'degenerative disc disease (cervical)': 20, 'degenerative disc disease (lumbar)': 20,
  'plantar fasciitis': 10, 'flatfoot (pes planus)': 10,
  'rotator cuff tendinopathy': 20, 'frozen shoulder (adhesive capsulitis)': 20,
  'carpal tunnel syndrome': 10, 'meniscal tear': 10,
  'patellar tendinitis': 10, 'shin splints (mtss)': 10,
  'costochondritis': 10, 'ankle instability': 10,
  'hip labral tear': 10, 'shoulder instability': 20,
  'cubital tunnel syndrome': 10, 'tennis elbow (lateral epicondylitis)': 10,
  "baker's cyst": 0, 'instability / giving way': 10,
  'trigger finger': 10, "de quervain's tenosynovitis": 10,
  'abnormal gait': 0, 'leg length discrepancy': 0,
  'cervical radiculopathy': 20, 'lumbar radiculopathy': 20,
  'sciatica': 20, 'ivds - cervical': 20, 'ivds - lumbar': 20,
  'migraine headaches': 30, 'migraine': 30,
  'tbi residuals': 40, 'residuals of traumatic brain injury (tbi)': 40,
  'tmj disorder': 10, 'vertigo / dizziness': 10,
  'cognitive disorder': 30, 'vision impairment': 10,
  'anxiety': 30, 'generalized anxiety disorder': 30,
  'depression due to chronic pain': 30, 'major depressive disorder': 50,
  'ptsd': 50, 'ptsd (related to injury)': 50, 'posttraumatic stress disorder': 50,
  'insomnia': 0, 'insomnia / sleep disturbance': 0, 'adjustment disorder': 30,
  'tbi': 40, 'depression': 30,
  'chronic adjustment disorder': 30, 'somatic symptom disorder': 30,
  'bipolar disorder': 50, 'panic disorder and/or agoraphobia': 30,
  'persistent depressive disorder (dysthymia)': 30,
  'obsessive compulsive disorder': 30,
  'sleep apnea syndromes (obstructive, central, mixed)': 50,
  'asthma, bronchial': 30, 'chronic obstructive pulmonary disease': 30,
  'hypertensive vascular disease (hypertension and isolated systolic hypertension)': 10,
  'gerd': 10, 'gastroesophageal reflux disease': 10,
  'ibs': 10, 'irritable bowel syndrome': 10,
  'erectile dysfunction': 0, 'bladder dysfunction': 20,
  'scarring': 10,
  'hearing impairment (hearing loss)': 10,
  'peripheral neuropathy (lower)': 10, 'peripheral neuropathy (upper)': 10,
  'upper extremity numbness / tingling': 10, 'lower extremity numbness / tingling': 10,
  'chronic fatigue': 10, 'grip strength loss': 10,
  'nerve damage (upper extremity)': 20, 'sciatic nerve involvement': 20,
  'muscle atrophy': 10,
}

export function getSuggestedRating(conditionName: string): number | null {
  if (!conditionName) return null
  const key = conditionName.toLowerCase().trim()
  if (key in SUGGESTED_RATINGS) return SUGGESTED_RATINGS[key]
  for (const [k, v] of Object.entries(SUGGESTED_RATINGS)) {
    if (key.includes(k) || k.includes(key)) return v
  }
  return null
}

// ── EXTREMITY MAPPING ─────────────────────────────────────────────────────

const KEY_TO_EXTREMITY: Record<string, string> = {
  leftShoulder: 'LU', rightShoulder: 'RU',
  leftElbow: 'LU', rightElbow: 'RU',
  leftForearm: 'LU', rightForearm: 'RU',
  leftWrist: 'LU', rightWrist: 'RU',
  leftHand: 'LU', rightHand: 'RU',
  leftHip: 'LL', rightHip: 'RL',
  leftThigh: 'LL', rightThigh: 'RL',
  leftKnee: 'LL', rightKnee: 'RL',
  leftShin: 'LL', rightShin: 'RL',
  leftHamstring: 'LL', rightHamstring: 'RL',
  leftCalf: 'LL', rightCalf: 'RL',
  leftAnkle: 'LL', rightAnkle: 'RL',
  leftFoot: 'LL', rightFoot: 'RL',
}

export function getExtremity(pinKey: string): string {
  return KEY_TO_EXTREMITY[pinKey] ?? 'none'
}

// ── COMBINED RATING MATH (38 CFR 4.25) ───────────────────────────────────

export function combineVARatings(ratings: number[]): number {
  if (!ratings.length) return 0
  if (ratings.length === 1) return ratings[0]
  const sorted = [...ratings].sort((a, b) => b - a)
  let combined = sorted[0]
  for (let i = 1; i < sorted.length; i++) {
    combined = combined + (sorted[i] / 100) * (100 - combined)
  }
  return combined
}

// ── PYRAMIDING RISKS ──────────────────────────────────────────────────────

type PyramidingRisk = [string, string, string]

const PYRAMIDING_RISKS: PyramidingRisk[] = [
  ['Knee osteoarthritis', 'Chondromalacia patella', "Both are cartilage problems in the knee. The VA usually treats these as the same condition and won't rate both."],
  ['Knee osteoarthritis', 'Patellofemoral syndrome', 'Kneecap pain (patellofemoral) and arthritis cause similar symptoms. The VA may consider these the same disability.'],
  ['Rotator cuff tear / tendinopathy', 'Shoulder impingement', 'Shoulder impingement is often caused by a rotator cuff problem. The VA may see these as the same issue.'],
  ['Lumbar strain / sprain', 'Degenerative disc disease (lumbar)', 'Both are rated based on how far you can bend your back. The VA uses the same rating criteria for both, so rating them separately is not allowed.'],
  ['Lumbar disc herniation', 'Intervertebral disc syndrome (IVDS)', 'A herniated disc is a type of disc syndrome (IVDS). These are usually the same condition described two ways.'],
  ['Degenerative disc disease (lumbar)', 'Intervertebral disc syndrome (IVDS)', 'Degenerative disc disease and disc syndrome (IVDS) often describe the same problem. The VA rates the spine under one formula.'],
  ['Cervical strain / sprain', 'Cervical disc disease (DDD)', 'Both are rated on how far you can move your neck. Rating both separately is not allowed because they use the same criteria.'],
  ['Hip osteoarthritis', 'Hip impingement (FAI)', 'Hip impingement often leads to arthritis over time. The VA may treat these as the same disability.'],
  ['Plantar fasciitis', 'Heel spurs', 'Heel spurs and heel/arch pain (plantar fasciitis) usually go together. The VA often considers them the same condition.'],
  ['Flat feet (pes planus)', 'Plantar fasciitis', 'Flat feet and heel/arch pain cause similar foot problems. The VA may rate these together instead of separately.'],
  ['Lateral epicondylitis (tennis elbow)', 'Elbow arthritis', 'If both are causing the same elbow pain and stiffness, the VA may consider this the same disability.'],
]

// ── RATING ITEM TYPE ──────────────────────────────────────────────────────

export interface RatingItem {
  id: string
  name: string
  rating: number
  extremity: string
  type: 'primary' | 'secondary' | 'head' | 'mental' | 'mst' | string
  suggested: number | null
  injId?: number
  secIndex?: number
  parentId?: number | string
  isMSTPrivate?: boolean
  _realName?: string
  _evalRef?: BPCondition | MentalHealthCondition | HeadCondition
  _secName?: string
}

// ── BUILD RATING ITEMS ────────────────────────────────────────────────────

/** Keys managed by evaluation panels (not shown in primary injury list) */
export function getPanelKeys(bpRegistry: typeof BP_REGISTRY): Set<string> {
  const keys = new Set<string>()
  // Mental health and head are always panel-managed
  keys.add('mental')
  keys.add('head')
  keys.add('headFace')
  keys.add('leftEar'); keys.add('rightEar')
  keys.add('leftEye'); keys.add('rightEye')
  keys.add('nose'); keys.add('jaw')
  Object.values(bpRegistry).forEach(cfg => {
    Object.keys(cfg.sideKeys).forEach(k => keys.add(k))
    keys.add(cfg.id)
  })
  return keys
}

export function buildRatingItems(state: TrackerState): { items: RatingItem[]; mhSecondaryDisplay: { name: string; rating: number; parentName: string }[] } {
  const ratingItems: RatingItem[] = []
  const mhSecondaryDisplay: { name: string; rating: number; parentName: string }[] = []

  const mhNames = new Set(VA_MENTAL.map(n => n.toLowerCase()))
  const mhSecondaryNames = new Set(MENTAL_SECONDARIES.map(n => n.toLowerCase()))
  const panelKeys = getPanelKeys(BP_REGISTRY)

  // Sorted physical injuries (excluding panel-managed)
  const sorted = [...state.injuries]
    .filter(i => !panelKeys.has(i.key))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id)

  sorted.forEach(inj => {
    const ext = getExtremity(inj.key)
    const suggested = getSuggestedRating(inj.label)
    ratingItems.push({
      id: 'p-' + inj.id,
      injId: inj.id,
      name: inj.label,
      rating: inj._assignedRating !== undefined ? inj._assignedRating : (suggested !== null ? suggested : 10),
      extremity: ext,
      type: 'primary',
      suggested,
    })

    ;(inj.secondaries ?? []).forEach((sec, si) => {
      const secLower = sec.toLowerCase()
      if (mhNames.has(secLower) || mhSecondaryNames.has(secLower)) {
        const secSuggested = getSuggestedRating(sec)
        const evalRating = secSuggested !== null ? secSuggested : 0
        mhSecondaryDisplay.push({ name: sec, rating: evalRating, parentName: inj.label })
        return
      }
      const secSuggested = getSuggestedRating(sec)
      ratingItems.push({
        id: `s-${inj.id}-${si}`,
        injId: inj.id,
        secIndex: si,
        name: sec,
        rating: secSuggested !== null ? secSuggested : 10,
        extremity: 'none',
        type: 'secondary',
        parentId: inj.id,
        suggested: secSuggested,
      })
    })
  })

  function pushSecondaries(parentId: string, ref: { secondaries?: string[]; secondaryRatings?: Record<string, number>; condition?: string }) {
    const secs = ref.secondaries ?? []
    const secRatings = ref.secondaryRatings ?? {}
    secs.forEach((sec, si) => {
      const secLower = sec.toLowerCase()
      if (mhNames.has(secLower) || mhSecondaryNames.has(secLower)) {
        const secSuggested = getSuggestedRating(sec)
        const rating = secRatings[sec] ?? (secSuggested !== null ? secSuggested : 0)
        mhSecondaryDisplay.push({ name: sec, rating, parentName: ref.condition ?? '' })
        return
      }
      const secSuggested = getSuggestedRating(sec)
      const rating = secRatings[sec] ?? (secSuggested !== null ? secSuggested : 10)
      ratingItems.push({
        id: `es-${parentId}-${si}`,
        name: sec,
        rating,
        extremity: 'none',
        type: 'secondary',
        parentId,
        suggested: secSuggested,
      })
    })
  }

  // Head conditions
  state.headConditions.forEach(cond => {
    if (cond.effectiveRating > 0) {
      ratingItems.push({
        id: 'hd-' + cond.id,
        name: cond.condition,
        rating: cond.effectiveRating,
        extremity: cond.extremity ?? 'none',
        type: 'head',
        suggested: cond.calculatedRating,
      })
    }
    pushSecondaries('hd-' + cond.id, cond)
  })

  // BP panel conditions
  Object.values(BP_REGISTRY).forEach(cfg => {
    const bpConds: BPCondition[] = state.bpConditions[cfg.stateKey] ?? []
    bpConds.forEach(cond => {
      if (cond.effectiveRating > 0) {
        ratingItems.push({
          id: 'bp-' + cond.id,
          name: cond.condition,
          rating: cond.effectiveRating,
          extremity: cond.extremity ?? 'none',
          type: cfg.id,
          suggested: cond.calculatedRating,
        })
      }
      pushSecondaries('bp-' + cond.id, cond)
    })
  })

  // Mental health — single highest rating (VA rule: all MH diagnoses = one rating)
  const MST_MH_NAMES = new Set([
    'ptsd', 'major depressive disorder', 'generalized anxiety disorder',
    'panic disorder', 'adjustment disorder', 'insomnia / sleep disturbance',
    'substance use disorder', 'eating disorder', 'somatic symptom disorder',
    'other condition related to mst',
  ])

  const mhPool: { rating: number; name: string; source: 'mh' | 'mst'; ref?: MentalHealthCondition; index?: number; isMSTPrivate?: boolean; suggested?: number }[] = []

  state.mentalHealthConditions.forEach(c => {
    mhPool.push({ rating: c.effectiveRating, name: c.condition, source: 'mh', ref: c, suggested: c.calculatedRating })
  })

  if (state.mstData?.conditions?.length) {
    state.mstData.conditions.forEach((cond, i) => {
      if (MST_MH_NAMES.has(cond.name.toLowerCase())) {
        const displayName = state.mstData.privacyShield ? 'Private Condition (MST)' : cond.name
        mhPool.push({ rating: cond.rating, name: displayName, source: 'mst', index: i, isMSTPrivate: state.mstData.privacyShield })
      }
    })
  }

  if (mhPool.length) {
    const highest = mhPool.reduce((best, item) => item.rating > best.rating ? item : best, mhPool[0])
    if (highest.rating > 0) {
      ratingItems.push({
        id: highest.source === 'mh' ? 'mh-' + highest.ref!.id : 'mst-mh-' + highest.index,
        name: 'Mental Health (' + highest.name + ')',
        rating: highest.rating,
        extremity: 'none',
        type: 'mental',
        suggested: highest.suggested ?? null,
        isMSTPrivate: highest.isMSTPrivate ?? false,
      })
    }
    state.mentalHealthConditions.forEach(c => pushSecondaries('mh-' + c.id, c))
  }

  // MST non-MH physical conditions
  if (state.mstData?.conditions?.length) {
    state.mstData.conditions.forEach((cond, i) => {
      if (!MST_MH_NAMES.has(cond.name.toLowerCase())) {
        if (cond.rating > 0) {
          ratingItems.push({
            id: 'mst-' + i,
            name: state.mstData.privacyShield ? 'Private Condition' : cond.name,
            _realName: cond.name,
            rating: cond.rating,
            extremity: 'none',
            type: 'mst',
            suggested: null,
            isMSTPrivate: state.mstData.privacyShield,
          })
        }
      }
    })
  }

  return { items: ratingItems, mhSecondaryDisplay }
}

// ── RATING RESULT ─────────────────────────────────────────────────────────

export interface VARatingResult {
  combined: number
  rounded: number
  items: RatingItem[]
  breakdown: string
  bilateral: boolean
  bilateralFactor: number
  steps: { name: string; rating: number; add?: number; running: number }[]
}

export function calculateVARating(ratingItems: RatingItem[]): VARatingResult {
  const items = ratingItems.filter(r => r.rating > 0)
  if (!items.length) return { combined: 0, rounded: 0, items: [], breakdown: '', bilateral: false, bilateralFactor: 0, steps: [] }

  const upperLeft  = items.filter(d => d.extremity === 'LU')
  const upperRight = items.filter(d => d.extremity === 'RU')
  const lowerLeft  = items.filter(d => d.extremity === 'LL')
  const lowerRight = items.filter(d => d.extremity === 'RL')
  const nonBilateral = items.filter(d => d.extremity === 'none')

  const hasUpperBil = upperLeft.length > 0 && upperRight.length > 0
  const hasLowerBil = lowerLeft.length > 0 && lowerRight.length > 0

  const bilateralEntries: { rating: number; name: string }[] = []
  const nonBilateralEntries: { rating: number; name: string }[] = nonBilateral.map(d => ({ rating: d.rating, name: d.name }))
  let bilateralFactorTotal = 0
  let log = 'STEP-BY-STEP VA COMBINED RATING\n' + '='.repeat(44) + '\n\n'

  log += 'RATED CONDITIONS:\n' + '-'.repeat(44) + '\n'
  items.forEach((d, i) => {
    const tag = d.extremity !== 'none' ? ` [${d.extremity}]` : ''
    const typeTag = d.type === 'secondary' ? ' (Secondary)' : ''
    log += `  ${i + 1}. ${d.rating}% — ${d.name}${tag}${typeTag}\n`
  })
  log += '\n'

  if (hasUpperBil) {
    const ur = [...upperLeft, ...upperRight]
    const c = combineVARatings(ur.map(d => d.rating))
    const bf = c * 0.10
    const wb = c + bf
    log += 'UPPER BILATERAL (38 CFR 4.26):\n' + '-'.repeat(44) + '\n'
    ur.forEach(d => { log += `  ${d.rating}% — ${d.name} [${d.extremity}]\n` })
    log += `  Combined: ${c.toFixed(2)}%\n  Bilateral factor (10%): +${bf.toFixed(2)}%\n  With factor: ${wb.toFixed(2)}% → ${Math.round(wb)}%\n\n`
    bilateralEntries.push({ rating: Math.round(wb), name: 'Upper Bilateral (' + ur.map(d => d.name).join(' + ') + ')' })
    bilateralFactorTotal += bf
  } else {
    ;[...upperLeft, ...upperRight].forEach(d => nonBilateralEntries.push({ rating: d.rating, name: d.name }))
  }

  if (hasLowerBil) {
    const lr = [...lowerLeft, ...lowerRight]
    const c = combineVARatings(lr.map(d => d.rating))
    const bf = c * 0.10
    const wb = c + bf
    log += 'LOWER BILATERAL (38 CFR 4.26):\n' + '-'.repeat(44) + '\n'
    lr.forEach(d => { log += `  ${d.rating}% — ${d.name} [${d.extremity}]\n` })
    log += `  Combined: ${c.toFixed(2)}%\n  Bilateral factor (10%): +${bf.toFixed(2)}%\n  With factor: ${wb.toFixed(2)}% → ${Math.round(wb)}%\n\n`
    bilateralEntries.push({ rating: Math.round(wb), name: 'Lower Bilateral (' + lr.map(d => d.name).join(' + ') + ')' })
    bilateralFactorTotal += bf
  } else {
    ;[...lowerLeft, ...lowerRight].forEach(d => nonBilateralEntries.push({ rating: d.rating, name: d.name }))
  }

  const allEntries = [...bilateralEntries, ...nonBilateralEntries].sort((a, b) => b.rating - a.rating)

  log += 'COMBINED RATINGS (38 CFR 4.25):\n' + '-'.repeat(44) + '\n'
  log += `Sorted: ${allEntries.map(e => e.rating + '% ' + e.name).join(', ')}\n\n`

  if (!allEntries.length) {
    return { combined: 0, rounded: 0, items, breakdown: log, bilateral: false, bilateralFactor: 0, steps: [] }
  }

  let combined = allEntries[0].rating
  const steps: { name: string; rating: number; add?: number; running: number }[] = [{ name: allEntries[0].name, rating: allEntries[0].rating, running: combined }]
  log += `Start with highest: ${allEntries[0].rating}% (${allEntries[0].name})\n`

  for (let i = 1; i < allEntries.length; i++) {
    const rem = 100 - combined
    const add = (allEntries[i].rating / 100) * rem
    combined += add
    steps.push({ name: allEntries[i].name, rating: allEntries[i].rating, add, running: combined })
    log += `  + ${allEntries[i].rating}% (${allEntries[i].name}) of ${rem.toFixed(2)} remaining = ${add.toFixed(2)}\n`
    log += `  = ${combined.toFixed(2)}%\n`
  }

  const whole = Math.round(combined)
  const final10 = Math.round(whole / 10) * 10
  log += '\n' + '-'.repeat(44) + '\n'
  log += `Exact: ${combined.toFixed(2)}%\nRounded to whole: ${whole}%\nFinal (nearest 10): ${final10}%\n`
  if (bilateralFactorTotal > 0) log += `Bilateral factor contributed: ${bilateralFactorTotal.toFixed(2)}%\n`

  return { combined, rounded: final10, items, breakdown: log, bilateral: hasUpperBil || hasLowerBil, bilateralFactor: bilateralFactorTotal, steps }
}

export function getRatingBreakdown(state: TrackerState): VARatingResult {
  const { items } = buildRatingItems(state)
  return calculateVARating(items)
}

// ── PYRAMIDING WARNINGS ───────────────────────────────────────────────────

interface RatingWarning {
  type: 'duplicate' | 'pyramiding'
  title: string
  condition: string
  message: string
}

export function detectRatingWarnings(ratingItems: RatingItem[], bpConditions: Record<string, BPCondition[]>): RatingWarning[] {
  const warnings: RatingWarning[] = []
  const allConds: { name: string; extremity: string; source: string }[] = []

  Object.entries(bpConditions).forEach(([, conds]) => {
    conds.forEach(c => {
      if (c.effectiveRating > 0) allConds.push({ name: c.condition, extremity: c.extremity ?? 'none', source: 'bp' })
    })
  })
  ratingItems.forEach(item => {
    if (item.rating > 0) allConds.push({ name: item.name, extremity: item.extremity ?? 'none', source: 'injury' })
  })

  const seen: Record<string, typeof allConds> = {}
  allConds.forEach(c => {
    const key = c.name.toLowerCase() + '|' + c.extremity
    if (!seen[key]) seen[key] = []
    seen[key].push(c)
  })
  Object.entries(seen).forEach(([, items]) => {
    if (items.length > 1) {
      warnings.push({ type: 'duplicate', title: 'Possible Duplicate', condition: items[0].name, message: `"${items[0].name}" appears to be rated ${items.length} times on the same side. The VA will not rate the same condition twice.` })
    }
  })

  const warnKeys = new Set<string>()
  PYRAMIDING_RISKS.forEach(([condA, condB, reason]) => {
    const aLower = condA.toLowerCase()
    const bLower = condB.toLowerCase()
    allConds.forEach(c1 => {
      if (c1.name.toLowerCase() !== aLower) return
      allConds.forEach(c2 => {
        if (c2.name.toLowerCase() !== bLower) return
        if (c1.extremity === c2.extremity) {
          const warnKey = [aLower, bLower, c1.extremity].sort().join('|')
          if (!warnKeys.has(warnKey)) {
            warnKeys.add(warnKey)
            warnings.push({ type: 'pyramiding', title: 'Possible Pyramiding (38 CFR 4.14)', condition: condA + ' + ' + condB, message: reason })
          }
        }
      })
    })
  })

  return warnings
}
