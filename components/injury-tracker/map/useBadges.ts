import { useInjuryStore } from '../store/useInjuryStore'

/** Sidebar key → { count, severity } */
export interface BadgeInfo {
  count: number
  severity: 'mild' | 'moderate' | 'severe' | 'custom'
}

function ratingToSeverity(r: number): BadgeInfo['severity'] {
  if (r >= 70) return 'severe'
  if (r >= 30) return 'moderate'
  if (r > 0) return 'mild'
  return 'custom'
}

// Sidebar key → pin keys that belong to it
const SIDEBAR_TO_KEYS: Record<string, string[]> = {
  shoulder: ['leftShoulder', 'rightShoulder'],
  elbow: ['leftElbow', 'rightElbow', 'leftForearm', 'rightForearm'],
  wrist_hand: ['leftWrist', 'rightWrist', 'leftHand', 'rightHand'],
  hip: ['leftHip', 'rightHip'],
  knee: ['leftKnee', 'rightKnee'],
  leg: ['leftThigh', 'rightThigh', 'leftShin', 'rightShin', 'leftHamstring', 'rightHamstring', 'leftCalf', 'rightCalf'],
  ankle_foot: ['leftAnkle', 'rightAnkle', 'leftFoot', 'rightFoot'],
  neck: ['neck'],
  chest: ['chest', 'leftLung', 'rightLung'],
  abdomen: ['abdomen', 'pelvis'],
  back: ['upperBack', 'spine', 'lowerBack', 'glutes'],
  headFace: ['headFace', 'head', 'leftEar', 'rightEar', 'leftEye', 'rightEye', 'nose', 'jaw'],
}

export function useBadges(): Record<string, BadgeInfo> {
  const injuries = useInjuryStore((s) => s.injuries)
  const mentalConditions = useInjuryStore((s) => s.mentalConditions)
  const headConditions = useInjuryStore((s) => s.headConditions)
  const bpConditions = useInjuryStore((s) => s.bpConditions)

  const badges: Record<string, BadgeInfo> = {}

  // Mental Health
  if (mentalConditions.length) {
    const maxR = Math.max(...mentalConditions.map((c) => c.effectiveRating ?? 0))
    badges['mental'] = { count: mentalConditions.length, severity: ratingToSeverity(maxR) }
  }

  // Head & Face (eval panel conditions)
  if (headConditions.length) {
    const maxR = Math.max(...headConditions.map((c) => c.effectiveRating ?? 0))
    badges['headFace'] = { count: headConditions.length, severity: ratingToSeverity(maxR) }
  }

  // BP regions
  Object.entries(bpConditions).forEach(([region, conds]) => {
    if (!conds.length) return
    const maxR = Math.max(...conds.map((c) => c.effectiveRating ?? 0))
    badges[region] = { count: conds.length, severity: ratingToSeverity(maxR) }
  })

  // Physical injuries — add to appropriate sidebar key badge
  const allSidebarKeys = Object.keys(SIDEBAR_TO_KEYS)
  injuries.forEach((inj) => {
    let assigned = false
    for (const sidebarKey of allSidebarKeys) {
      if (SIDEBAR_TO_KEYS[sidebarKey].includes(inj.key) || inj.key === sidebarKey) {
        if (!badges[sidebarKey]) badges[sidebarKey] = { count: 0, severity: 'custom' }
        badges[sidebarKey].count++
        assigned = true
        break
      }
    }
    if (!assigned && inj.key && inj.key !== 'custom') {
      if (!badges[inj.key]) badges[inj.key] = { count: 0, severity: 'custom' }
      badges[inj.key].count++
    }
  })

  return badges
}
