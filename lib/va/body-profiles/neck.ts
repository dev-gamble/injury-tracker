import type { EvalProfile } from '../types'

export const NECK_PROFILES: Record<string, EvalProfile> = {
  cervical: {
    label: 'Cervical Spine (DC 5237-5243)',
    domains: [
      {
        id: 'rom', label: 'Range of Motion (How Far It Moves)',
        description: 'Forward bending and combined range of motion of the cervical spine.',
        levels: [
          { value: 0,   label: 'Normal',             description: 'Forward bending (flexion) greater than 40°, combined ROM greater than 335°.' },
          { value: 10,  label: 'Mild',               description: 'Forward bending greater than 30° but not greater than 40°, or combined ROM greater than 170° but not greater than 335°.' },
          { value: 20,  label: 'Moderate',           description: 'Forward bending greater than 15° but not greater than 30°, or combined ROM not greater than 170°.' },
          { value: 30,  label: 'Severe',             description: 'Forward bending 15° or less, or entire cervical spine frozen in favorable position (favorable ankylosis).' },
          { value: 40,  label: 'Very Severe',        description: 'Entire cervical spine frozen in unfavorable position (unfavorable ankylosis).' },
          { value: 100, label: 'Total',              description: 'Entire spine frozen in unfavorable position (unfavorable ankylosis of entire spine).' },
        ],
      },
      {
        id: 'pain', label: 'Pain / Functional Loss',
        description: 'Pain on movement, guarding, muscle spasm, abnormal gait.',
        levels: [
          { value: 0,  label: 'None',     description: 'No additional functional loss due to pain.' },
          { value: 10, label: 'Mild',     description: 'Painful motion without significant functional loss.' },
          { value: 20, label: 'Moderate', description: 'Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour.' },
        ],
      },
      {
        id: 'radiculopathy', label: 'Nerve Pain / Numbness Traveling Down the Arm (Radiculopathy)',
        description: 'Nerve root involvement — numbness, tingling, weakness in arms.',
        levels: [
          { value: 0,  label: 'None',              description: 'No nerve pain/numbness traveling down the arm (radiculopathy).' },
          { value: 20, label: 'Mild',              description: 'Mild incomplete paralysis of affected nerve group.' },
          { value: 30, label: 'Moderate',          description: 'Moderate incomplete paralysis.' },
          { value: 40, label: 'Moderately Severe', description: 'Moderately severe incomplete paralysis.' },
          { value: 50, label: 'Severe',            description: 'Severe incomplete paralysis with marked muscle atrophy.' },
          { value: 70, label: 'Complete',          description: 'Complete paralysis of affected nerve group.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Neck — General',
    domains: [
      {
        id: 'severity', label: 'Overall Severity',
        description: 'General severity of the neck condition.',
        levels: [
          { value: 0,  label: 'None',       description: 'No significant impairment.' },
          { value: 10, label: 'Mild',       description: 'Mild impairment with occasional symptoms.' },
          { value: 20, label: 'Moderate',   description: 'Moderate impairment affecting daily activities.' },
          { value: 30, label: 'Severe',     description: 'Severe impairment with significant limitation.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment, near-constant symptoms.' },
        ],
      },
    ],
  },
}

export const NECK_CONDITION_PROFILE: Record<string, string> = {
  'Cervical strain / sprain': 'cervical',
  'Cervical radiculopathy': 'cervical',
  'Cervical disc disease (DDD)': 'cervical',
  'Cervical spinal stenosis': 'cervical',
  'Cervical vertebral fracture': 'cervical',
  'Whiplash injury': 'cervical',
  'Cervical spondylosis': 'cervical',
  'Torticollis': 'generic',
  'Neck muscle spasm': 'cervical',
}

export function getNeckProfile(name: string): EvalProfile {
  return NECK_PROFILES[NECK_CONDITION_PROFILE[name] ?? 'cervical'] ?? NECK_PROFILES.cervical
}
export function getNeckProfileKey(name: string): string {
  return NECK_CONDITION_PROFILE[name] ?? 'cervical'
}
export function calculateNeckRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
