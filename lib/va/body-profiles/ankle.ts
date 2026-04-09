import type { EvalProfile } from '../types'

export const ANKLE_PROFILES: Record<string, EvalProfile> = {
  rom: {
    label: 'Ankle Range of Motion (DC 5270/5271)',
    domains: [
      {
        id: 'motion', label: 'Ankle Motion',
        description: 'Limitation of dorsiflexion and plantar flexion of the ankle.',
        levels: [
          { value: 0,  label: 'Normal',      description: 'Full range of motion, no limitation.' },
          { value: 10, label: 'Mild',        description: 'Dorsiflexion limited to less than 10° or plantar flexion limited to less than 30°.' },
          { value: 20, label: 'Moderate',    description: 'Both dorsiflexion and plantar flexion significantly limited.' },
        ],
      },
      {
        id: 'ankylosis', label: 'Ankle Fusion/Locking (Ankylosis)',
        description: 'Ankylosis (complete stiffness) of the ankle (DC 5270).',
        levels: [
          { value: 0,  label: 'None',        description: 'No ankylosis.' },
          { value: 20, label: 'Favorable',   description: 'Ankylosis in plantigrade (functional) position.' },
          { value: 30, label: 'Unfavorable', description: 'Ankylosis in non-plantigrade or unfavorable position.' },
          { value: 40, label: 'Marked',      description: 'Ankylosis in marked plantar flexion or inversion/eversion.' },
        ],
      },
    ],
  },
  instability: {
    label: 'Ankle Instability (DC 5262)',
    domains: [
      {
        id: 'severity', label: 'Instability Severity',
        description: 'Chronic instability or recurrent dislocation of the ankle.',
        levels: [
          { value: 0,  label: 'None',      description: 'No instability.' },
          { value: 10, label: 'Mild',      description: 'Mild instability — occasional giving way with minimal functional loss.' },
          { value: 20, label: 'Moderate',  description: 'Moderate instability — frequent giving way affecting gait and daily activities.' },
          { value: 30, label: 'Severe',    description: 'Severe instability — constant instability requiring brace or significant functional loss.' },
        ],
      },
    ],
  },
  flatfoot: {
    label: 'Flatfoot / Pes Planus (DC 5276)',
    domains: [
      {
        id: 'severity', label: 'Flatfoot Severity',
        description: 'Acquired flatfoot (pes planus) severity (DC 5276).',
        levels: [
          { value: 0,  label: 'Mild',                    description: 'Mild — weight-bearing line falls over or medial to great toe, inward bowing of Achilles tendon, pain on use, correctable, no inward displacement of os calcis.' },
          { value: 10, label: 'Moderate',                description: 'Moderate — weight-bearing line falls over or medial to great toe, inward bowing of Achilles tendon, pain on use, not correctable.' },
          { value: 20, label: 'Severe (unilateral)',     description: 'Severe — marked pronation, extreme tenderness of plantar surfaces, marked inward displacement of os calcis — unilateral.' },
          { value: 30, label: 'Severe (bilateral)',      description: 'Severe — marked pronation, extreme tenderness of plantar surfaces, marked inward displacement of os calcis — bilateral.' },
          { value: 50, label: 'Pronounced',              description: 'Pronounced — arch absent, entire sole rests on ground, marked eversion of foot.' },
        ],
      },
    ],
  },
  plantar: {
    label: 'Plantar Fasciitis / Heel Pain',
    domains: [
      {
        id: 'severity', label: 'Plantar Fasciitis Severity',
        description: 'Severity of plantar fasciitis or heel pain condition.',
        levels: [
          { value: 0,  label: 'None',      description: 'No significant heel or plantar pain.' },
          { value: 10, label: 'Mild',      description: 'Mild — pain on use, mild functional limitation.' },
          { value: 20, label: 'Moderate',  description: 'Moderate — pain limiting prolonged standing/walking.' },
          { value: 30, label: 'Severe',    description: 'Severe — significant limitation affecting daily activities and gait.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Ankle/Foot — General',
    domains: [
      {
        id: 'severity', label: 'Overall Severity',
        description: 'General severity of the ankle or foot condition.',
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

export const ANKLE_CONDITION_PROFILE: Record<string, string> = {
  'Ankle instability / chronic sprain': 'instability',
  'Ankle fracture residuals': 'rom',
  'Achilles tendinitis / tendon rupture': 'generic',
  'Ankle arthritis': 'rom',
  'Flatfoot (pes planus)': 'flatfoot',
  'Plantar fasciitis': 'plantar',
  'Ankle impingement': 'rom',
  'Subtalar joint dysfunction': 'rom',
  'Peroneal tendon disorder': 'generic',
}

export function getAnkleProfile(name: string): EvalProfile {
  return ANKLE_PROFILES[ANKLE_CONDITION_PROFILE[name] ?? 'rom'] ?? ANKLE_PROFILES.rom
}
export function getAnkleProfileKey(name: string): string {
  return ANKLE_CONDITION_PROFILE[name] ?? 'rom'
}
export function calculateAnkleRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
