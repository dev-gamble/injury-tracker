import type { EvalProfile } from '../types'

export const ABDOMEN_PROFILES: Record<string, EvalProfile> = {
  digestive: {
    label: 'Digestive / GI Conditions',
    domains: [
      {
        id: 'severity', label: 'Symptom Severity',
        description: 'Overall severity of digestive symptoms.',
        levels: [
          { value: 0,  label: 'None',       description: 'No significant digestive symptoms.' },
          { value: 10, label: 'Mild',       description: 'Mild symptoms — occasional pain, nausea, or irregularity.' },
          { value: 20, label: 'Moderate',   description: 'Moderate symptoms — regular pain or discomfort affecting diet.' },
          { value: 30, label: 'Severe',     description: 'Severe symptoms — frequent pain, vomiting, significant dietary restriction.' },
          { value: 60, label: 'Very Severe', description: 'Very severe — marked malnutrition, repeated hospitalizations.' },
        ],
      },
      {
        id: 'frequency', label: 'Frequency of Episodes',
        description: 'How often symptoms occur.',
        levels: [
          { value: 0,  label: 'Rarely',     description: 'Symptoms occur rarely.' },
          { value: 10, label: 'Occasional', description: 'Symptoms occur occasionally — several times per month.' },
          { value: 20, label: 'Frequent',   description: 'Symptoms occur frequently — several times per week.' },
          { value: 30, label: 'Daily',      description: 'Symptoms are daily and persistent.' },
        ],
      },
    ],
  },
  genitourinary: {
    label: 'Genitourinary / Kidney Conditions',
    domains: [
      {
        id: 'voiding', label: 'Voiding Dysfunction',
        description: 'Severity of urinary dysfunction.',
        levels: [
          { value: 0,  label: 'None',      description: 'No voiding dysfunction.' },
          { value: 10, label: 'Mild',      description: 'Voiding dysfunction that does not require wearing of absorbent materials.' },
          { value: 20, label: 'Moderate',  description: 'Voiding dysfunction requiring absorbent materials.' },
          { value: 40, label: 'Severe',    description: 'Voiding dysfunction requiring use of an appliance.' },
          { value: 60, label: 'Very Severe', description: 'Constant need for an appliance or requiring surgery.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Abdomen — General',
    domains: [
      {
        id: 'severity', label: 'Overall Severity',
        description: 'General severity of the abdominal condition.',
        levels: [
          { value: 0,  label: 'None',       description: 'No significant impairment.' },
          { value: 10, label: 'Mild',       description: 'Mild impairment with occasional symptoms.' },
          { value: 20, label: 'Moderate',   description: 'Moderate impairment affecting daily activities.' },
          { value: 30, label: 'Severe',     description: 'Severe impairment with significant limitation.' },
          { value: 60, label: 'Very Severe', description: 'Very severe impairment.' },
        ],
      },
    ],
  },
}

export const ABDOMEN_CONDITION_PROFILE: Record<string, string> = {
  'GERD / acid reflux': 'digestive',
  'Irritable bowel syndrome (IBS)': 'digestive',
  'Crohn\'s disease': 'digestive',
  'Ulcerative colitis': 'digestive',
  'Peptic ulcer disease': 'digestive',
  'Hernia (inguinal/ventral)': 'generic',
  'Kidney stones': 'genitourinary',
  'Chronic kidney disease': 'genitourinary',
  'Bladder dysfunction (neurogenic)': 'genitourinary',
  'Urinary incontinence': 'genitourinary',
  'Gallbladder disease': 'digestive',
  'Liver disease / hepatitis': 'digestive',
}

export function getAbdomenProfile(name: string): EvalProfile {
  return ABDOMEN_PROFILES[ABDOMEN_CONDITION_PROFILE[name] ?? 'generic'] ?? ABDOMEN_PROFILES.generic
}
export function getAbdomenProfileKey(name: string): string {
  return ABDOMEN_CONDITION_PROFILE[name] ?? 'generic'
}
export function calculateAbdomenRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
