import type { EvalProfile } from '../types'

export const ELBOW_PROFILES: Record<string, EvalProfile> = {
  rom: {
    label: 'Elbow Range of Motion (DC 5206/5207/5213)',
    domains: [
      {
        id: 'flexion', label: 'Limitation of Bending (Flexion)',
        description: 'Limitation of bending (flexion) of the forearm (DC 5206).',
        levels: [
          { value: 0,  label: 'Normal',      description: 'Bending (flexion) greater than 100°.' },
          { value: 10, label: 'Mild',        description: 'Bending (flexion) limited to 100°.' },
          { value: 20, label: 'Moderate',    description: 'Bending (flexion) limited to 90°.' },
          { value: 30, label: 'Severe',      description: 'Bending (flexion) limited to 70°.' },
          { value: 40, label: 'Very Severe', description: 'Bending (flexion) limited to 55°.' },
          { value: 50, label: 'Extreme',     description: 'Bending (flexion) limited to 45°.' },
        ],
      },
      {
        id: 'extension', label: 'Limitation of Straightening (Extension)',
        description: 'Limitation of straightening (extension) of the forearm (DC 5207).',
        levels: [
          { value: 0,  label: 'Normal',      description: 'Straightening (extension) not limited.' },
          { value: 10, label: 'Mild',        description: 'Straightening limited to 45° or 60°.' },
          { value: 20, label: 'Moderate',    description: 'Straightening limited to 75°.' },
          { value: 30, label: 'Severe',      description: 'Straightening limited to 90°.' },
          { value: 40, label: 'Very Severe', description: 'Straightening limited to 100°.' },
          { value: 50, label: 'Extreme',     description: 'Straightening limited to 110°.' },
        ],
      },
      {
        id: 'pronation', label: 'Rotating Palm Down/Up (Pronation/Supination)',
        description: 'Limitation of rotating palm down (pronation) or rotating palm up (supination) (DC 5213).',
        levels: [
          { value: 0,  label: 'Normal',   description: 'No limitation.' },
          { value: 10, label: 'Mild',     description: 'Rotating palm up (supination) limited to 30° or less.' },
          { value: 20, label: 'Moderate', description: 'Rotating palm down (pronation) limited beyond last quarter of arc.' },
          { value: 30, label: 'Severe',   description: 'Rotating palm down (pronation) lost beyond middle of arc.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Elbow — General',
    domains: [
      {
        id: 'severity', label: 'Overall Severity',
        description: 'General severity of the elbow condition.',
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

export const ELBOW_CONDITION_PROFILE: Record<string, string> = {
  'Lateral epicondylitis (tennis elbow)': 'rom',
  'Medial epicondylitis (golfer\'s elbow)': 'rom',
  'Elbow bursitis (olecranon)': 'generic',
  'Cubital tunnel syndrome': 'rom',
  'Elbow fracture': 'rom',
  'Elbow arthritis': 'rom',
  'Forearm fracture': 'rom',
  'Forearm muscle strain': 'generic',
  'Elbow dislocation': 'rom',
}

export function getElbowProfile(name: string): EvalProfile {
  return ELBOW_PROFILES[ELBOW_CONDITION_PROFILE[name] ?? 'rom'] ?? ELBOW_PROFILES.rom
}
export function getElbowProfileKey(name: string): string {
  return ELBOW_CONDITION_PROFILE[name] ?? 'rom'
}
export function calculateElbowRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
