import type { EvalProfile } from '../types'

export const WRIST_PROFILES: Record<string, EvalProfile> = {
  rom: {
    label: 'Wrist Range of Motion (DC 5214/5215)',
    domains: [
      {
        id: 'dorsiflexion', label: 'Bending Wrist Back (Dorsiflexion)',
        description: 'Limitation of wrist dorsiflexion (DC 5214).',
        levels: [
          { value: 0,  label: 'Normal',   description: 'Dorsiflexion greater than 30°.' },
          { value: 10, label: 'Mild',     description: 'Dorsiflexion limited to 30°.' },
          { value: 20, label: 'Moderate', description: 'Dorsiflexion limited to 15°.' },
          { value: 30, label: 'Severe',   description: 'Dorsiflexion impossible.' },
        ],
      },
      {
        id: 'palmarflexion', label: 'Bending Wrist Forward (Palmar Flexion)',
        description: 'Limitation of wrist palmar flexion (DC 5215).',
        levels: [
          { value: 0,  label: 'Normal',   description: 'Palmar flexion greater than 30°.' },
          { value: 10, label: 'Mild',     description: 'Palmar flexion limited to 30°.' },
          { value: 20, label: 'Moderate', description: 'Palmar flexion limited to 15°.' },
          { value: 30, label: 'Severe',   description: 'Palmar flexion impossible.' },
        ],
      },
      {
        id: 'ankylosis', label: 'Wrist Fusion/Locking (Ankylosis)',
        description: 'Ankylosis (complete stiffness) of the wrist.',
        levels: [
          { value: 0,  label: 'None',       description: 'No ankylosis.' },
          { value: 20, label: 'Favorable',  description: 'Ankylosis in proper functional position (slight dorsiflexion).' },
          { value: 30, label: 'Unfavorable', description: 'Ankylosis in other than proper functional position.' },
        ],
      },
    ],
  },
  carpal: {
    label: 'Carpal Tunnel / Nerve Impairment (DC 8515)',
    domains: [
      {
        id: 'nerve', label: 'Median Nerve Impairment',
        description: 'Incomplete or complete paralysis of the median nerve (DC 8515).',
        levels: [
          { value: 0,  label: 'None',              description: 'No significant nerve impairment.' },
          { value: 10, label: 'Mild',              description: 'Mild incomplete paralysis — intermittent numbness/tingling.' },
          { value: 20, label: 'Moderate',          description: 'Moderate incomplete paralysis — sensory loss, mild grip weakness.' },
          { value: 40, label: 'Moderately Severe', description: 'Moderately severe incomplete paralysis — significant grip weakness, thenar atrophy.' },
          { value: 60, label: 'Complete',          description: 'Complete paralysis — loss of opposition, significant thenar muscle wasting.' },
        ],
      },
    ],
  },
  finger: {
    label: 'Finger / Hand Impairment (DC 5216–5230)',
    domains: [
      {
        id: 'severity', label: 'Overall Hand/Finger Severity',
        description: 'General severity of finger or hand impairment.',
        levels: [
          { value: 0,  label: 'None',      description: 'No significant impairment.' },
          { value: 10, label: 'Mild',      description: 'Mild — limited ROM of fingers, mild grip weakness.' },
          { value: 20, label: 'Moderate',  description: 'Moderate — reduced grip, affects daily tasks.' },
          { value: 30, label: 'Severe',    description: 'Severe — marked limitation, difficulty with fine motor tasks.' },
          { value: 40, label: 'Very Severe', description: 'Very severe — near-complete loss of hand function.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Wrist — General',
    domains: [
      {
        id: 'severity', label: 'Overall Severity',
        description: 'General severity of the wrist condition.',
        levels: [
          { value: 0,  label: 'None',       description: 'No significant impairment.' },
          { value: 10, label: 'Mild',       description: 'Mild impairment.' },
          { value: 20, label: 'Moderate',   description: 'Moderate impairment.' },
          { value: 30, label: 'Severe',     description: 'Severe impairment.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment.' },
        ],
      },
    ],
  },
}

export const WRIST_CONDITION_PROFILE: Record<string, string> = {
  'Carpal tunnel syndrome': 'carpal',
  'Wrist fracture residuals': 'rom',
  'Wrist sprain / strain': 'rom',
  'De Quervain\'s tenosynovitis': 'generic',
  'Wrist arthritis': 'rom',
  'Triangular fibrocartilage complex (TFCC) tear': 'rom',
  'Wrist tendinitis': 'generic',
  'Finger fracture residuals': 'finger',
  'Trigger finger': 'finger',
}

export function getWristProfile(name: string): EvalProfile {
  return WRIST_PROFILES[WRIST_CONDITION_PROFILE[name] ?? 'rom'] ?? WRIST_PROFILES.rom
}
export function getWristProfileKey(name: string): string {
  return WRIST_CONDITION_PROFILE[name] ?? 'rom'
}
export function calculateWristRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
