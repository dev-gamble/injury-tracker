import type { EvalProfile } from '../types'

export const LEG_PROFILES: Record<string, EvalProfile> = {
  muscle: {
    label: 'Muscle Injuries of the Leg (DC 5311–5315)',
    domains: [
      {
        id: 'severity', label: 'Muscle Injury Severity',
        description: 'Severity of leg muscle group injury (DC 5311-5315 — thigh, leg, calf).',
        levels: [
          { value: 0,  label: 'Slight',            description: 'Slight — no significant functional loss; mild scar, no objective findings.' },
          { value: 10, label: 'Moderate',           description: 'Moderate — loss of muscle substance with some functional impairment.' },
          { value: 20, label: 'Moderately Severe',  description: 'Moderately severe — loss of muscle substance with marked functional impairment; muscle pull on use.' },
          { value: 30, label: 'Severe',             description: 'Severe — extensive loss of muscle substance, marked functional impairment, weakness, and atrophy.' },
        ],
      },
    ],
  },
  neuropathy: {
    label: 'Lower Extremity Nerve / Neuropathy (DC 8520/8521)',
    domains: [
      {
        id: 'nerve', label: 'Sciatic / Peroneal Nerve Impairment',
        description: 'Sciatic nerve (DC 8520) or common peroneal nerve (DC 8521) impairment.',
        levels: [
          { value: 0,  label: 'None',              description: 'No significant nerve impairment.' },
          { value: 10, label: 'Mild',              description: 'Mild incomplete paralysis — intermittent numbness or tingling.' },
          { value: 20, label: 'Moderate',          description: 'Moderate incomplete paralysis — frequent numbness, mild weakness.' },
          { value: 40, label: 'Moderately Severe', description: 'Moderately severe incomplete paralysis — significant weakness, difficulty with activities.' },
          { value: 60, label: 'Severe',            description: 'Severe incomplete paralysis — marked muscle weakness, foot drop, atrophy.' },
          { value: 80, label: 'Complete',          description: 'Complete paralysis — foot drop, no active movement below knee.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Leg / Thigh — General',
    domains: [
      {
        id: 'severity', label: 'Overall Severity',
        description: 'General severity of the leg or thigh condition.',
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

export const LEG_CONDITION_PROFILE: Record<string, string> = {
  'Thigh muscle injury / strain': 'muscle',
  'Calf muscle strain / tear': 'muscle',
  'Hamstring injury': 'muscle',
  'Quadriceps injury': 'muscle',
  'Sciatic nerve injury': 'neuropathy',
  'Peroneal nerve palsy': 'neuropathy',
  'Peripheral neuropathy (lower extremity)': 'neuropathy',
  'Femur fracture residuals': 'generic',
  'Tibia/fibula fracture residuals': 'generic',
  'Deep vein thrombosis (DVT) residuals': 'generic',
  'Varicose veins': 'generic',
  'Restless leg syndrome': 'generic',
}

export function getLegProfile(name: string): EvalProfile {
  return LEG_PROFILES[LEG_CONDITION_PROFILE[name] ?? 'generic'] ?? LEG_PROFILES.generic
}
export function getLegProfileKey(name: string): string {
  return LEG_CONDITION_PROFILE[name] ?? 'generic'
}
export function calculateLegRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
