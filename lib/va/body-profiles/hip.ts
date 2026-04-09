import type { EvalProfile } from '../types'

export const HIP_PROFILES: Record<string, EvalProfile> = {
  rom: {
    label: 'Hip Range of Motion (DC 5252/5253)',
    domains: [
      {
        id: 'flexion', label: 'Limitation of Bending (Flexion)',
        description: 'Limitation of bending (flexion) of the thigh (DC 5252).',
        levels: [
          { value: 0,  label: 'Normal',      description: 'Bending (flexion) greater than 45°.' },
          { value: 10, label: 'Mild',        description: 'Bending (flexion) limited to 45°.' },
          { value: 20, label: 'Moderate',    description: 'Bending (flexion) limited to 30°.' },
          { value: 30, label: 'Severe',      description: 'Bending (flexion) limited to 20°.' },
          { value: 40, label: 'Very Severe', description: 'Bending (flexion) limited to 10°.' },
        ],
      },
      {
        id: 'extension', label: 'Limitation of Straightening (Extension)',
        description: 'Limitation of straightening (extension) of the thigh (DC 5251).',
        levels: [
          { value: 0,  label: 'Normal', description: 'Straightening (extension) not limited to 5°.' },
          { value: 10, label: 'Mild',   description: 'Straightening (extension) limited to 5°.' },
        ],
      },
      {
        id: 'abduction', label: 'Spreading/Moving Outward (Abduction)',
        description: 'Limitation of abduction, adduction, or rotation (DC 5253).',
        levels: [
          { value: 0,  label: 'Normal',   description: 'Can cross legs, no motion lost beyond 10°.' },
          { value: 10, label: 'Mild',     description: 'Cannot cross legs or cannot toe-out more than 15°.' },
          { value: 20, label: 'Moderate', description: 'Motion lost beyond 10°.' },
        ],
      },
    ],
  },
  replacement: {
    label: 'Hip Replacement (DC 5054)',
    domains: [
      {
        id: 'status', label: 'Replacement Status',
        description: 'Current functional status after hip replacement.',
        levels: [
          { value: 30,  label: 'Minimum',       description: 'Prosthetic replacement with no significant residuals.' },
          { value: 50,  label: 'Moderate',      description: 'Moderately severe residuals of weakness, pain, or limitation of motion.' },
          { value: 70,  label: 'Severe',        description: 'Markedly severe residual weakness, pain, or limitation of motion.' },
          { value: 90,  label: 'Very Severe',   description: 'Painful motion or weakness requiring assistive devices.' },
          { value: 100, label: '1-Year Post-Op', description: 'For 1 year following implantation of prosthesis.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Hip — General',
    domains: [
      {
        id: 'severity', label: 'Overall Severity',
        description: 'General severity of the hip condition.',
        levels: [
          { value: 0,  label: 'None',       description: 'No significant impairment.' },
          { value: 10, label: 'Mild',       description: 'Mild impairment with occasional symptoms.' },
          { value: 20, label: 'Moderate',   description: 'Moderate impairment affecting daily activities.' },
          { value: 30, label: 'Severe',     description: 'Severe impairment with significant limitation.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment.' },
        ],
      },
    ],
  },
}

export const HIP_CONDITION_PROFILE: Record<string, string> = {
  'Hip osteoarthritis': 'rom',
  'Hip labral tear': 'rom',
  'Hip bursitis (trochanteric)': 'rom',
  'Hip impingement (FAI)': 'rom',
  'Hip fracture': 'rom',
  'Avascular necrosis of hip': 'rom',
  'Hip flexor strain': 'rom',
  'Snapping hip syndrome': 'generic',
  'Hip replacement (total)': 'replacement',
}

export function getHipProfile(name: string): EvalProfile {
  return HIP_PROFILES[HIP_CONDITION_PROFILE[name] ?? 'rom'] ?? HIP_PROFILES.rom
}
export function getHipProfileKey(name: string): string {
  return HIP_CONDITION_PROFILE[name] ?? 'rom'
}
export function calculateHipRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
