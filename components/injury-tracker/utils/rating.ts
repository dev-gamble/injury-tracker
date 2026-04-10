// ── PURE RATING CALCULATION UTILITIES ─────────────────────────────────────────

// ── SUGGESTED RATINGS ──────────────────────────────────────────────────────────
const SUGGESTED_RATINGS: Record<string, number> = {
  // Musculoskeletal
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

  // Spine
  'cervical radiculopathy': 20, 'lumbar radiculopathy': 20,
  'sciatica': 20, 'ivds - cervical': 20, 'ivds - lumbar': 20,

  // Head / Neurological
  'migraine headaches': 30, 'migraine': 30,
  'tbi residuals': 40, 'residuals of traumatic brain injury (tbi)': 40,
  'tmj disorder': 10, 'vertigo / dizziness': 10,
  'cognitive disorder': 30, 'vision impairment': 10,

  // Mental Health
  'anxiety': 30, 'generalized anxiety disorder': 30,
  'depression due to chronic pain': 30, 'major depressive disorder': 50,
  'ptsd': 50, 'ptsd (related to injury)': 50, 'posttraumatic stress disorder': 50,
  'insomnia': 0, 'insomnia / sleep disturbance': 0, 'adjustment disorder': 30,
  'tbi': 40, 'depression': 30,
  'chronic adjustment disorder': 30, 'somatic symptom disorder': 30,
  'bipolar disorder': 50, 'panic disorder and/or agoraphobia': 30,
  'persistent depressive disorder (dysthymia)': 30,
  'obsessive compulsive disorder': 30,

  // Respiratory
  'sleep apnea syndromes (obstructive, central, mixed)': 50,
  'asthma, bronchial': 30, 'chronic obstructive pulmonary disease': 30,

  // Cardiovascular
  'hypertensive vascular disease (hypertension and isolated systolic hypertension)': 10,

  // Digestive
  'gerd': 10, 'gastroesophageal reflux disease': 10,
  'ibs': 10, 'irritable bowel syndrome': 10,

  // Genitourinary
  'erectile dysfunction': 0, 'bladder dysfunction': 20,

  // Skin
  'scarring': 10,

  // Other
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
  if (Object.prototype.hasOwnProperty.call(SUGGESTED_RATINGS, key)) return SUGGESTED_RATINGS[key]
  for (const [k, v] of Object.entries(SUGGESTED_RATINGS)) {
    if (key.includes(k) || k.includes(key)) return v
  }
  return null
}

// ── BILATERAL EXTREMITY MAP ────────────────────────────────────────────────────
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

// ── COMBINED RATING MATH (38 CFR 4.25) ────────────────────────────────────────
export function combineVARatings(ratings: number[]): number {
  if (ratings.length === 0) return 0
  if (ratings.length === 1) return ratings[0]
  const sorted = [...ratings].sort((a, b) => b - a)
  let combined = sorted[0]
  for (let i = 1; i < sorted.length; i++) {
    combined = combined + (sorted[i] / 100) * (100 - combined)
  }
  return combined
}

// Round a raw combined rating to the nearest 10 (VA rounding rules)
export function roundVARating(raw: number): number {
  const pct = Math.min(100, Math.round(raw))
  // VA rounds to nearest 10 — 5 rounds up
  const rem = pct % 10
  if (rem < 5) return pct - rem
  return pct - rem + 10
}
