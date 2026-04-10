import type { BPRegion } from '../types'

export interface BPMeta {
  id: BPRegion
  title: string
  panelId: string
  abbr: string
  /** Pin keys that belong to this region (used to check panel membership) */
  sideKeys: Record<string, string>
}

export const BP_META: Record<BPRegion, BPMeta> = {
  knee: {
    id: 'knee', title: 'Knee Evaluation', panelId: 'knee-panel', abbr: 'KN',
    sideKeys: { leftKnee: 'Left', rightKnee: 'Right' },
  },
  back: {
    id: 'back', title: 'Back & Spine Evaluation', panelId: 'back-panel', abbr: 'BK',
    sideKeys: { upperBack: 'Upper', spine: 'Mid', lowerBack: 'Lower' },
  },
  shoulder: {
    id: 'shoulder', title: 'Shoulder Evaluation', panelId: 'shoulder-panel', abbr: 'SH',
    sideKeys: { leftShoulder: 'Left', rightShoulder: 'Right' },
  },
  neck: {
    id: 'neck', title: 'Neck Evaluation', panelId: 'neck-panel', abbr: 'NK',
    sideKeys: { neck: 'Neck' },
  },
  hip: {
    id: 'hip', title: 'Hip Evaluation', panelId: 'hip-panel', abbr: 'HP',
    sideKeys: { leftHip: 'Left', rightHip: 'Right' },
  },
  elbow: {
    id: 'elbow', title: 'Elbow / Forearm Evaluation', panelId: 'elbow-panel', abbr: 'EL',
    sideKeys: { leftElbow: 'Left', rightElbow: 'Right', leftForearm: 'Left Forearm', rightForearm: 'Right Forearm' },
  },
  wrist_hand: {
    id: 'wrist_hand', title: 'Wrist / Hand Evaluation', panelId: 'wrist-panel', abbr: 'WH',
    sideKeys: { leftWrist: 'Left Wrist', rightWrist: 'Right Wrist', leftHand: 'Left Hand', rightHand: 'Right Hand' },
  },
  ankle_foot: {
    id: 'ankle_foot', title: 'Ankle / Foot Evaluation', panelId: 'ankle-panel', abbr: 'AF',
    sideKeys: { leftAnkle: 'Left Ankle', rightAnkle: 'Right Ankle', leftFoot: 'Left Foot', rightFoot: 'Right Foot' },
  },
  chest: {
    id: 'chest', title: 'Chest / Lungs Evaluation', panelId: 'chest-panel', abbr: 'CH',
    sideKeys: { chest: 'Chest', leftLung: 'Left Lung', rightLung: 'Right Lung' },
  },
  abdomen: {
    id: 'abdomen', title: 'Abdomen / Pelvis Evaluation', panelId: 'abdomen-panel', abbr: 'AB',
    sideKeys: { abdomen: 'Abdomen', pelvis: 'Pelvis' },
  },
  leg: {
    id: 'leg', title: 'Leg Evaluation', panelId: 'leg-panel', abbr: 'LG',
    sideKeys: { leftThigh: 'Left Thigh', rightThigh: 'Right Thigh', leftShin: 'Left Shin', rightShin: 'Right Shin', leftHamstring: 'Left Hamstring', rightHamstring: 'Right Hamstring', leftCalf: 'Left Calf', rightCalf: 'Right Calf' },
  },
  systemic: {
    id: 'systemic', title: 'Other / Systemic Evaluation', panelId: 'systemic-panel', abbr: 'SY',
    sideKeys: {},
  },
}

/** Build a set of all pin keys managed by evaluation panels */
export function getPanelKeys(): Set<string> {
  const s = new Set<string>(['mental', 'headFace', 'head'])
  Object.values(BP_META).forEach((m) => {
    Object.keys(m.sideKeys).forEach((k) => s.add(k))
    s.add(m.id)
  })
  return s
}
