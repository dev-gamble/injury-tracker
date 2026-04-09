import type { EvalProfile } from '../types'

export const SPINE_PROFILES: Record<string, EvalProfile> = {
  thoracolumbar: {
    label: 'Thoracolumbar Spine Range of Motion (General Rating Formula)',
    domains: [
      {
        id: 'forward_flexion', label: 'Forward Bending (Flexion)',
        description: 'How far can you bend forward? Normal is 90 degrees.',
        levels: [
          { value: 0,   label: 'Normal (90°)',                       description: 'Full forward bending (flexion), no limitation.' },
          { value: 10,  label: 'Greater than 60° but ≤85°',          description: 'Forward bending greater than 60° but not greater than 85°; or combined range of motion >120° but ≤235°.' },
          { value: 20,  label: 'Greater than 30° but ≤60°',          description: 'Forward bending greater than 30° but not greater than 60°; or combined ROM ≤120°; or muscle spasm/guarding causing abnormal gait.' },
          { value: 40,  label: '30° or less',                         description: 'Forward bending 30° or less; or spine frozen in favorable position (favorable ankylosis).' },
          { value: 50,  label: 'Spine frozen in unfavorable position', description: 'Entire thoracolumbar spine frozen in unfavorable position (unfavorable ankylosis).' },
          { value: 100, label: 'Entire spine frozen',                  description: 'Entire spine frozen in unfavorable position (unfavorable ankylosis of entire spine).' },
        ],
      },
      {
        id: 'pain', label: 'Painful Motion / Spasm',
        description: 'Presence of painful motion, muscle spasm, or guarding.',
        levels: [
          { value: 0,  label: 'None',                         description: 'No painful motion, spasm, or guarding.' },
          { value: 10, label: 'Painful motion / tenderness',  description: 'Painful motion; or muscle spasm, guarding, or localized tenderness not resulting in abnormal gait.' },
          { value: 20, label: 'Spasm causing abnormal gait',  description: 'Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour.' },
        ],
      },
      {
        id: 'radiculopathy', label: 'Nerve Pain / Numbness Traveling Down the Leg (Radiculopathy — DC 8520)',
        description: 'Nerve root involvement — numbness, tingling, pain, or weakness radiating into the legs.',
        levels: [
          { value: 0,  label: 'None',              description: 'No nerve pain/numbness traveling down the leg.' },
          { value: 10, label: 'Mild',              description: 'Mild incomplete paralysis — intermittent numbness or tingling in the leg/foot.' },
          { value: 20, label: 'Moderate',          description: 'Moderate incomplete paralysis — frequent numbness, pain radiating below the knee, mild foot weakness.' },
          { value: 40, label: 'Moderately Severe', description: 'Moderately severe incomplete paralysis — significant pain, noticeable muscle weakness, difficulty with toe/heel walking.' },
          { value: 60, label: 'Severe',            description: 'Severe incomplete paralysis — marked muscle atrophy, foot drop, or significant loss of function.' },
          { value: 80, label: 'Complete',          description: 'Complete paralysis — foot drop, no active movement possible below the knee.' },
        ],
      },
    ],
  },
  cervical: {
    label: 'Cervical Spine Range of Motion (General Rating Formula)',
    domains: [
      {
        id: 'forward_flexion', label: 'Forward Bending (Flexion)',
        description: 'How far can you bend your neck forward? Normal is 45 degrees.',
        levels: [
          { value: 0,   label: 'Normal (45°)',              description: 'Full cervical forward bending (flexion), no limitation.' },
          { value: 10,  label: 'Greater than 30° but ≤40°', description: 'Forward bending greater than 30° but not greater than 40°; or combined ROM >170° but ≤335°.' },
          { value: 20,  label: 'Greater than 15° but ≤30°', description: 'Forward bending greater than 15° but not greater than 30°; or combined ROM ≤170°; or muscle spasm causing abnormal gait.' },
          { value: 30,  label: '15° or less',               description: 'Forward bending 15° or less; or entire cervical spine frozen in favorable position (favorable ankylosis).' },
          { value: 40,  label: 'Neck frozen in unfavorable', description: 'Entire cervical spine frozen in unfavorable position (unfavorable ankylosis).' },
          { value: 100, label: 'Entire spine frozen',        description: 'Entire spine frozen in unfavorable position (unfavorable ankylosis of entire spine).' },
        ],
      },
      {
        id: 'pain', label: 'Painful Motion / Spasm',
        description: 'Presence of painful motion, muscle spasm, or guarding.',
        levels: [
          { value: 0,  label: 'None',                        description: 'No painful motion, spasm, or guarding.' },
          { value: 10, label: 'Painful motion / tenderness', description: 'Painful motion; or muscle spasm, guarding, or localized tenderness.' },
          { value: 20, label: 'Spasm causing abnormal gait', description: 'Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour.' },
        ],
      },
    ],
  },
  ivds: {
    label: 'Intervertebral Disc Syndrome (DC 5243)',
    domains: [
      {
        id: 'episodes', label: 'Flare-Ups Bad Enough to Keep You in Bed (past 12 months)',
        description: 'Total duration of incapacitating episodes requiring bed rest prescribed by a physician during past 12 months.',
        levels: [
          { value: 0,  label: 'None',             description: 'No flare-ups requiring bed rest in past 12 months.' },
          { value: 10, label: '1-2 weeks total',  description: 'At least 1 week but less than 2 weeks total duration.' },
          { value: 20, label: '2-4 weeks total',  description: 'At least 2 weeks but less than 4 weeks total duration.' },
          { value: 40, label: '4-6 weeks total',  description: 'At least 4 weeks but less than 6 weeks total duration.' },
          { value: 60, label: '6+ weeks total',   description: 'At least 6 weeks total duration. Highest schedular evaluation for IVDS.' },
        ],
      },
    ],
  },
  generic: {
    label: 'General Spine Assessment',
    domains: [
      {
        id: 'severity', label: 'Overall Spine Condition Severity',
        description: 'General functional impact of this spine condition.',
        levels: [
          { value: 0,  label: 'Asymptomatic',     description: 'No functional limitation.' },
          { value: 10, label: 'Mild',              description: 'Mild symptoms with slight limitation.' },
          { value: 20, label: 'Moderate',          description: 'Moderate symptoms with noticeable limitation.' },
          { value: 40, label: 'Severe',            description: 'Significant symptoms substantially affecting function.' },
          { value: 50, label: 'Very Severe',       description: 'Severe symptoms, marked functional loss.' },
        ],
      },
    ],
  },
}

export const SPINE_CONDITION_PROFILE: Record<string, string> = {
  'Lumbar strain / sprain': 'thoracolumbar',
  'Lumbar disc herniation': 'thoracolumbar',
  'Lumbar radiculopathy / sciatica': 'thoracolumbar',
  'Degenerative disc disease (lumbar)': 'thoracolumbar',
  'Spinal stenosis (lumbar)': 'thoracolumbar',
  'Thoracic strain': 'thoracolumbar',
  'Scoliosis': 'thoracolumbar',
  'Compression fracture': 'thoracolumbar',
  'Sacroiliac joint dysfunction': 'thoracolumbar',
  'Ankylosing spondylitis': 'thoracolumbar',
  'Intervertebral disc syndrome (IVDS)': 'ivds',
}

export function getSpineProfile(name: string): EvalProfile {
  return SPINE_PROFILES[SPINE_CONDITION_PROFILE[name] ?? 'generic'] ?? SPINE_PROFILES.generic
}
export function getSpineProfileKey(name: string): string {
  return SPINE_CONDITION_PROFILE[name] ?? 'generic'
}
export function calculateSpineRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
