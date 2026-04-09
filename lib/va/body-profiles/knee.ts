import type { EvalProfile } from '../types'

export const KNEE_PROFILES: Record<string, EvalProfile> = {
  rom: {
    label: 'Range of Motion — How Far It Moves (DC 5260/5261)',
    domains: [
      {
        id: 'flexion', label: 'Bending (Flexion) — DC 5260',
        description: 'How far can the knee bend? Normal is 140+ degrees.',
        levels: [
          { value: 0,  label: 'Normal (140°+)',    description: 'Full bending (flexion), no limitation.' },
          { value: 10, label: 'Limited to 45°',    description: 'Bending (flexion) limited to 45 degrees.' },
          { value: 20, label: 'Limited to 30°',    description: 'Bending (flexion) limited to 30 degrees.' },
          { value: 30, label: 'Limited to 15°',    description: 'Bending (flexion) limited to 15 degrees or less.' },
        ],
      },
      {
        id: 'extension', label: 'Straightening (Extension) — DC 5261',
        description: 'How far can the knee straighten? Normal is 0 degrees (fully straight).',
        levels: [
          { value: 0,  label: 'Normal (0°)',       description: 'Full straightening (extension), no limitation.' },
          { value: 10, label: 'Limited to 10°',    description: 'Straightening (extension) limited to 10 degrees.' },
          { value: 20, label: 'Limited to 15°',    description: 'Straightening (extension) limited to 15 degrees.' },
          { value: 30, label: 'Limited to 20°',    description: 'Straightening (extension) limited to 20 degrees.' },
          { value: 40, label: 'Limited to 30°',    description: 'Straightening (extension) limited to 30 degrees.' },
          { value: 50, label: 'Limited to 45°+',   description: 'Straightening (extension) limited to 45 degrees or more.' },
        ],
      },
    ],
  },
  instability: {
    label: 'Instability / Partial Dislocation (DC 5257)',
    domains: [
      {
        id: 'instability', label: 'Recurrent Partial Dislocation or Lateral Instability',
        description: 'Severity of knee giving way, lateral instability, or recurrent partial dislocation (subluxation).',
        levels: [
          { value: 0,  label: 'None',     description: 'No instability or partial dislocation.' },
          { value: 10, label: 'Slight',   description: 'Slight recurrent partial dislocation (subluxation) or slight lateral instability.' },
          { value: 20, label: 'Moderate', description: 'Moderate recurrent partial dislocation (subluxation) or moderate lateral instability.' },
          { value: 30, label: 'Severe',   description: 'Severe recurrent partial dislocation (subluxation) or severe lateral instability.' },
        ],
      },
    ],
  },
  meniscus: {
    label: 'Meniscus / Cartilage (DC 5258/5259)',
    domains: [
      {
        id: 'meniscus', label: 'Semilunar Cartilage Condition',
        description: 'Meniscus (cartilage) damage, locking, or surgical removal.',
        levels: [
          { value: 0,  label: 'Asymptomatic',             description: 'No symptoms or asymptomatic residuals following removal.' },
          { value: 10, label: 'Dislocated with locking',  description: 'Dislocated semilunar cartilage with frequent episodes of locking, pain, and swelling from fluid in the joint (effusion).' },
          { value: 20, label: 'Symptomatic after removal', description: 'Symptomatic residuals following semilunar cartilage removal.' },
        ],
      },
    ],
  },
  replacement: {
    label: 'Knee Replacement (DC 5055)',
    domains: [
      {
        id: 'replacement', label: 'Prosthetic Knee Status',
        description: 'Current status after total or partial knee replacement surgery.',
        levels: [
          { value: 30,  label: 'Minimum post-replacement',    description: 'Minimum evaluation following prosthetic replacement (after initial 100% period).' },
          { value: 60,  label: 'Chronic residuals',           description: 'Chronic residuals: severe painful motion or weakness requiring assistive devices.' },
          { value: 100, label: 'Within 13 months of surgery', description: '100% rating for 13 months following prosthetic replacement of knee joint.' },
        ],
      },
    ],
  },
  arthritis: {
    label: 'Degenerative Arthritis (DC 5003)',
    domains: [
      {
        id: 'arthritis', label: 'Arthritis Severity',
        description: 'Degenerative arthritis confirmed by X-ray with limitation of motion.',
        levels: [
          { value: 0,  label: 'X-ray only, no limitation',   description: 'X-ray evidence of arthritis without painful or limited motion.' },
          { value: 10, label: 'Painful motion / minor',      description: 'X-ray evidence with painful motion or some limitation of motion.' },
          { value: 20, label: 'Significant limitation',      description: 'X-ray evidence with more significant limitation of motion in the joint.' },
        ],
      },
    ],
  },
  generic: {
    label: 'General Knee Assessment',
    domains: [
      {
        id: 'severity', label: 'Overall Knee Condition Severity',
        description: 'General functional impact of this knee condition.',
        levels: [
          { value: 0,  label: 'Asymptomatic',     description: 'Condition present but no functional limitation.' },
          { value: 10, label: 'Mild',              description: 'Mild symptoms with slight functional limitation.' },
          { value: 20, label: 'Moderate',          description: 'Moderate symptoms with noticeable limitation.' },
          { value: 30, label: 'Moderately severe', description: 'Significant symptoms affecting daily activities.' },
          { value: 50, label: 'Severe',            description: 'Severe symptoms substantially limiting function.' },
        ],
      },
    ],
  },
}

export const KNEE_CONDITION_PROFILE: Record<string, string> = {
  'Knee osteoarthritis': 'arthritis',
  'ACL tear / reconstruction': 'instability',
  'Meniscus tear': 'meniscus',
  'Patellar tendinitis': 'rom',
  'Patellofemoral syndrome': 'rom',
  'MCL / LCL sprain': 'instability',
  'Knee bursitis': 'generic',
  'Knee instability': 'instability',
  'Knee replacement (total)': 'replacement',
  "Baker's cyst": 'generic',
  'Chondromalacia patella': 'rom',
}

export function getKneeProfile(name: string): EvalProfile {
  return KNEE_PROFILES[KNEE_CONDITION_PROFILE[name] ?? 'generic'] ?? KNEE_PROFILES.generic
}
export function getKneeProfileKey(name: string): string {
  return KNEE_CONDITION_PROFILE[name] ?? 'generic'
}
export function calculateKneeRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
