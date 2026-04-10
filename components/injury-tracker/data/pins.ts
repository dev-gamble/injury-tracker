// ── PIN COORDINATE DATA ───────────────────────────────────────────────────────

export interface PinInfo {
  label: string
  x: number
  y: number
}

export const MENTAL_PINS: Record<string, PinInfo> = {
  mental: { label: 'Mental Health', x: 52, y: 10 },
}

export const HEAD_PINS: Record<string, PinInfo> = {
  headFace: { label: 'Head & Face', x: 52, y: 17 },
}

export const FRONT_PINS: Record<string, PinInfo> = {
  head: { label: 'Head', x: 52, y: 17 },
  leftEar: { label: 'Left Ear', x: 30, y: 17 },
  rightEar: { label: 'Right Ear', x: 73, y: 17 },
  leftEye: { label: 'Left Eye', x: 40, y: 14 },
  rightEye: { label: 'Right Eye', x: 63, y: 14 },
  nose: { label: 'Nose', x: 52, y: 16 },
  jaw: { label: 'Jaw / TMJ', x: 52, y: 22 },
  neck: { label: 'Neck', x: 52, y: 25 },
  leftShoulder: { label: 'Left Shoulder', x: 21, y: 30 },
  rightShoulder: { label: 'Right Shoulder', x: 80, y: 30 },
  chest: { label: 'Chest', x: 52, y: 34 },
  leftLung: { label: 'Left Lung', x: 35, y: 34 },
  rightLung: { label: 'Right Lung', x: 68, y: 34 },
  abdomen: { label: 'Abdomen', x: 52, y: 46 },
  leftElbow: { label: 'Left Elbow', x: 19, y: 42 },
  rightElbow: { label: 'Right Elbow', x: 83, y: 42 },
  leftForearm: { label: 'Left Forearm', x: 13, y: 49 },
  rightForearm: { label: 'Right Forearm', x: 88, y: 49 },
  leftWrist: { label: 'Left Wrist', x: 10, y: 54 },
  rightWrist: { label: 'Right Wrist', x: 90, y: 54 },
  leftHand: { label: 'Left Hand', x: 14, y: 57 },
  rightHand: { label: 'Right Hand', x: 87, y: 57 },
  leftHip: { label: 'Left Hip', x: 37, y: 54 },
  rightHip: { label: 'Right Hip', x: 63, y: 54 },
  pelvis: { label: 'Pelvis / Groin', x: 52, y: 55 },
  leftThigh: { label: 'Left Thigh', x: 38, y: 63 },
  rightThigh: { label: 'Right Thigh', x: 62, y: 63 },
  leftKnee: { label: 'Left Knee', x: 38, y: 70 },
  rightKnee: { label: 'Right Knee', x: 62, y: 70 },
  leftShin: { label: 'Left Shin', x: 38, y: 77 },
  rightShin: { label: 'Right Shin', x: 62, y: 77 },
  leftAnkle: { label: 'Left Ankle', x: 38, y: 84 },
  rightAnkle: { label: 'Right Ankle', x: 62, y: 84 },
  leftFoot: { label: 'Left Foot', x: 37, y: 87 },
  rightFoot: { label: 'Right Foot', x: 62, y: 87 },
}

export const BACK_PINS: Record<string, PinInfo> = {
  head: { label: 'Head', x: 52, y: 17 },
  neck: { label: 'Neck', x: 52, y: 25 },
  leftShoulder: { label: 'Left Shoulder', x: 21, y: 30 },
  rightShoulder: { label: 'Right Shoulder', x: 80, y: 30 },
  upperBack: { label: 'Upper Back', x: 52, y: 34 },
  spine: { label: 'Spine', x: 52, y: 43 },
  lowerBack: { label: 'Lower Back', x: 52, y: 49 },
  leftElbow: { label: 'Left Elbow', x: 19, y: 42 },
  rightElbow: { label: 'Right Elbow', x: 83, y: 42 },
  leftForearm: { label: 'Left Forearm', x: 13, y: 49 },
  rightForearm: { label: 'Right Forearm', x: 88, y: 49 },
  leftWrist: { label: 'Left Wrist', x: 10, y: 54 },
  rightWrist: { label: 'Right Wrist', x: 90, y: 54 },
  leftHand: { label: 'Left Hand', x: 14, y: 57 },
  rightHand: { label: 'Right Hand', x: 87, y: 57 },
  glutes: { label: 'Glutes', x: 52, y: 56 },
  leftHamstring: { label: 'Left Hamstring', x: 38, y: 63 },
  rightHamstring: { label: 'Right Hamstring', x: 62, y: 63 },
  leftKnee: { label: 'Left Knee', x: 38, y: 70 },
  rightKnee: { label: 'Right Knee', x: 62, y: 70 },
  leftCalf: { label: 'Left Calf', x: 38, y: 77 },
  rightCalf: { label: 'Right Calf', x: 62, y: 77 },
  leftAnkle: { label: 'Left Ankle', x: 38, y: 84 },
  rightAnkle: { label: 'Right Ankle', x: 62, y: 84 },
  leftFoot: { label: 'Left Foot', x: 37, y: 87 },
  rightFoot: { label: 'Right Foot', x: 62, y: 87 },
}

// ── SIDEBAR ITEMS ──────────────────────────────────────────────────────────────

export const SIDEBAR_ITEMS: Record<string, string> = {
  mental: 'Mental Health',
  headFace: 'Head & Face',
  neck: 'Neck',
  shoulder: 'Shoulders',
  chest: 'Chest / Lungs',
  elbow: 'Elbow / Forearm',
  wrist_hand: 'Wrist / Hand',
  abdomen: 'Abdomen / Pelvis',
  hip: 'Hips',
  knee: 'Knees',
  leg: 'Thigh / Shin / Calf',
  ankle_foot: 'Ankle / Foot',
  back: 'Back & Spine',
  systemic: 'Other / Systemic',
}

export const GROUPS_FRONT: [string, string[]][] = [
  ['Mental Health', ['mental']],
  ['Head & Face', ['headFace']],
  ['Neck / Shoulders', ['neck', 'shoulder']],
  ['Chest / Lungs', ['chest']],
  ['Arms', ['elbow', 'wrist_hand']],
  ['Abdomen / Pelvis', ['abdomen']],
  ['Hips', ['hip']],
  ['Legs', ['knee', 'leg', 'ankle_foot']],
  ['Other / Systemic', ['systemic']],
]

export const GROUPS_BACK: [string, string[]][] = [
  ['Mental Health', ['mental']],
  ['Head & Face', ['headFace']],
  ['Neck / Shoulders', ['neck', 'shoulder']],
  ['Back & Spine', ['back']],
  ['Arms', ['elbow', 'wrist_hand']],
  ['Lower Body', ['hip', 'knee', 'leg', 'ankle_foot']],
  ['Other / Systemic', ['systemic']],
]

// ── SEVERITY COLORS ────────────────────────────────────────────────────────────

export const SEVERITY_COLOR: Record<string, string> = {
  mild: '#16a34a',
  moderate: '#d97706',
  severe: '#dc2626',
  custom: '#7c3aed',
}

export const SEVERITY_BG: Record<string, string> = {
  mild: '#f0fdf4',
  moderate: '#fffbeb',
  severe: '#fef2f2',
  custom: '#f5f3ff',
}

export const SEVERITY_BORDER: Record<string, string> = {
  mild: '#bbf7d0',
  moderate: '#fde68a',
  severe: '#fecaca',
  custom: '#ddd6fe',
}

// ── PANEL KEY SET ──────────────────────────────────────────────────────────────
// Keys that are managed by evaluation panels (not the injuries array)

export const PANEL_KEYS: Set<string> = new Set([
  'mental', 'headFace', 'head',
  // Body part side keys
  'leftKnee', 'rightKnee',
  'upperBack', 'spine', 'lowerBack',
  'leftShoulder', 'rightShoulder',
  'neck',
  'leftHip', 'rightHip',
  'leftElbow', 'rightElbow', 'leftForearm', 'rightForearm',
  'leftWrist', 'rightWrist', 'leftHand', 'rightHand',
  'leftAnkle', 'rightAnkle', 'leftFoot', 'rightFoot',
  'chest', 'leftLung', 'rightLung',
  'abdomen', 'pelvis',
  // BP registry IDs
  'knee', 'back', 'shoulder', 'hip', 'elbow', 'wrist_hand', 'ankle_foot',
  'chest_region', 'abdomen_region', 'leg', 'systemic',
])

// ── RESOLVE PIN FROM LABEL ─────────────────────────────────────────────────────

interface ResolvedPin {
  key: string
  x: number
  y: number
  side: 'front' | 'back'
  body: 'male' | 'female'
  label: string
}

// Build label→pin lookup
const _LABEL_TO_PIN: Record<string, ResolvedPin> = {}

function _buildLabelMap() {
  Object.entries(FRONT_PINS).forEach(([key, info]) => {
    _LABEL_TO_PIN[info.label.toLowerCase()] = {
      key, x: info.x, y: info.y, side: 'front', body: 'male', label: info.label,
    }
  })
  Object.entries(BACK_PINS).forEach(([key, info]) => {
    const lbl = info.label.toLowerCase()
    if (!_LABEL_TO_PIN[lbl]) {
      _LABEL_TO_PIN[lbl] = {
        key, x: info.x, y: info.y, side: 'back', body: 'male', label: info.label,
      }
    }
  })
  const aliases: Record<string, string> = {
    'head': 'head', 'tmj': 'jaw', 'jaw': 'jaw',
    'left ear': 'leftEar', 'right ear': 'rightEar',
    'left eye': 'leftEye', 'right eye': 'rightEye',
    'neck': 'neck', 'cervical': 'neck',
    'left shoulder': 'leftShoulder', 'right shoulder': 'rightShoulder',
    'chest': 'chest', 'left lung': 'leftLung', 'right lung': 'rightLung',
    'abdomen': 'abdomen', 'stomach': 'abdomen',
    'pelvis': 'pelvis', 'groin': 'pelvis', 'pelvis / groin': 'pelvis',
    'left elbow': 'leftElbow', 'right elbow': 'rightElbow',
    'left forearm': 'leftForearm', 'right forearm': 'rightForearm',
    'left wrist': 'leftWrist', 'right wrist': 'rightWrist',
    'left hand': 'leftHand', 'right hand': 'rightHand',
    'left hip': 'leftHip', 'right hip': 'rightHip',
    'left thigh': 'leftThigh', 'right thigh': 'rightThigh',
    'left knee': 'leftKnee', 'right knee': 'rightKnee',
    'left shin': 'leftShin', 'right shin': 'rightShin',
    'left ankle': 'leftAnkle', 'right ankle': 'rightAnkle',
    'left foot': 'leftFoot', 'right foot': 'rightFoot',
    'upper back': 'upperBack', 'spine': 'spine',
    'lower back': 'lowerBack', 'lumbar': 'lowerBack',
    'glutes': 'glutes', 'buttocks': 'glutes',
    'left hamstring': 'leftHamstring', 'right hamstring': 'rightHamstring',
    'left calf': 'leftCalf', 'right calf': 'rightCalf',
    'back': 'lowerBack', 'shoulder': 'leftShoulder', 'knee': 'leftKnee',
    'ankle': 'leftAnkle', 'foot': 'leftFoot', 'elbow': 'leftElbow',
    'wrist': 'leftWrist', 'hand': 'leftHand', 'hip': 'leftHip',
    'shin': 'leftShin', 'thigh': 'leftThigh', 'lung': 'leftLung',
    'ear': 'leftEar', 'eye': 'leftEye',
  }
  Object.entries(aliases).forEach(([alias, key]) => {
    if (_LABEL_TO_PIN[alias]) return
    const pin = FRONT_PINS[key] || BACK_PINS[key]
    if (!pin) return
    const side: 'front' | 'back' = BACK_PINS[key] && !FRONT_PINS[key] ? 'back' : 'front'
    _LABEL_TO_PIN[alias] = { key, x: pin.x, y: pin.y, side, body: 'male', label: pin.label }
  })
}

_buildLabelMap()

export function resolvePin(
  label: string,
  body?: 'male' | 'female',
  side?: 'front' | 'back',
): ResolvedPin {
  const lbl = (label ?? '').toLowerCase().trim()
  const match = _LABEL_TO_PIN[lbl]
  if (match) {
    return {
      key: match.key,
      x: match.x,
      y: match.y,
      side: side ?? match.side,
      body: body ?? match.body,
      label,
    }
  }
  return {
    key: 'custom',
    x: 52,
    y: 45,
    side: side ?? 'front',
    body: body ?? 'male',
    label,
  }
}
