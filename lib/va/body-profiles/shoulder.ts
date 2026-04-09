import type { EvalProfile } from '../types'

export const SHOULDER_PROFILES: Record<string, EvalProfile> = {
  rom: {
    label: 'Limitation of Motion (DC 5201)',
    domains: [
      {
        id: 'motion', label: 'Arm Motion at Shoulder',
        description: 'How far can you raise your arm? Rated by limitation of motion.',
        levels: [
          { value: 0,  label: 'Normal (full overhead)',      description: 'Full range of motion, no limitation.' },
          { value: 20, label: 'At shoulder level',           description: 'Motion limited to shoulder level (90°).' },
          { value: 30, label: 'Midway (side to shoulder)',   description: 'Motion limited to midway between side and shoulder level (~45°).' },
          { value: 40, label: 'To 25° from side',            description: 'Motion limited to 25° from side. Significant functional loss.' },
        ],
      },
    ],
  },
  instability: {
    label: 'Instability / Dislocation (DC 5202)',
    domains: [
      {
        id: 'instability', label: 'Recurrent Dislocation or Impairment',
        description: 'Humerus impairment: recurrent dislocation, malunion, or nonunion.',
        levels: [
          { value: 0,  label: 'None',                  description: 'No instability, dislocation, or impairment.' },
          { value: 20, label: 'Infrequent dislocation / Moderate malunion', description: 'Recurrent dislocation infrequently; or malunion with moderate deformity.' },
          { value: 30, label: 'Frequent dislocation / Marked malunion',     description: 'Recurrent dislocation frequently with guarding; or malunion with marked deformity.' },
          { value: 50, label: 'Fibrous union',          description: 'Fibrous union of the humerus.' },
          { value: 60, label: 'Nonunion (false flail)', description: 'Nonunion of the humerus (false flail joint).' },
          { value: 80, label: 'Loss of head (flail)',   description: 'Loss of head of the humerus (flail shoulder).' },
        ],
      },
    ],
  },
  clavicle: {
    label: 'Clavicle / Scapula (DC 5203)',
    domains: [
      {
        id: 'clavicle', label: 'Clavicle or Scapula Impairment',
        description: 'Impairment of the clavicle or scapula.',
        levels: [
          { value: 0,  label: 'None / Malunion only',                description: 'No impairment or malunion of clavicle/scapula.' },
          { value: 10, label: 'Nonunion without loose movement',     description: 'Nonunion of clavicle or scapula without loose movement.' },
          { value: 20, label: 'Nonunion with loose movement / Dislocation', description: 'Nonunion with loose movement; or dislocation of clavicle or scapula.' },
        ],
      },
    ],
  },
  generic: {
    label: 'General Shoulder Assessment',
    domains: [
      {
        id: 'severity', label: 'Overall Shoulder Condition Severity',
        description: 'General functional impact of this shoulder condition.',
        levels: [
          { value: 0,  label: 'Asymptomatic',     description: 'No functional limitation.' },
          { value: 10, label: 'Mild',              description: 'Mild symptoms with slight limitation.' },
          { value: 20, label: 'Moderate',          description: 'Moderate symptoms with noticeable limitation.' },
          { value: 30, label: 'Moderately severe', description: 'Significant symptoms affecting daily activities.' },
          { value: 50, label: 'Severe',            description: 'Severe symptoms substantially limiting function.' },
        ],
      },
    ],
  },
}

export const SHOULDER_CONDITION_PROFILE: Record<string, string> = {
  'Rotator cuff tear / tendinopathy': 'rom',
  'Shoulder impingement': 'rom',
  'Shoulder instability / dislocation': 'instability',
  'Labral tear (SLAP)': 'rom',
  'Frozen shoulder (adhesive capsulitis)': 'rom',
  'AC joint separation': 'clavicle',
  'Shoulder arthritis': 'rom',
  'Shoulder bursitis': 'generic',
  'Shoulder fracture': 'instability',
}

export function getShoulderProfile(name: string): EvalProfile {
  return SHOULDER_PROFILES[SHOULDER_CONDITION_PROFILE[name] ?? 'generic'] ?? SHOULDER_PROFILES.generic
}
export function getShoulderProfileKey(name: string): string {
  return SHOULDER_CONDITION_PROFILE[name] ?? 'generic'
}
export function calculateShoulderRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
