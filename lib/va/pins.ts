import type { PinCoord } from './types'

export const MENTAL_PINS: Record<string, PinCoord> = {
  mental: { label: 'Mental Health', x: 52, y: 10 },
}

export const HEAD_PINS: Record<string, PinCoord> = {
  headFace: { label: 'Head & Face', x: 52, y: 17 },
}

export const FRONT_PINS: Record<string, PinCoord> = {
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

export const BACK_PINS: Record<string, PinCoord> = {
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

// All pins combined for lookup
export const ALL_PINS: Record<string, PinCoord> = { ...MENTAL_PINS, ...HEAD_PINS, ...FRONT_PINS, ...BACK_PINS }

export const SEVERITY_COLORS = {
  mild: '#16a34a',
  moderate: '#d97706',
  severe: '#dc2626',
  custom: '#7c3aed',
} as const

export const SEVERITY_BG = {
  mild: '#f0fdf4',
  moderate: '#fffbeb',
  severe: '#fef2f2',
  custom: '#f5f3ff',
} as const

export const SEVERITY_BORDER = {
  mild: '#bbf7d0',
  moderate: '#fde68a',
  severe: '#fecaca',
  custom: '#ddd6fe',
} as const
