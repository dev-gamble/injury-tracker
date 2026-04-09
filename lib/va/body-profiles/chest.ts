import type { EvalProfile } from '../types'

export const CHEST_PROFILES: Record<string, EvalProfile> = {
  respiratory: {
    label: 'Respiratory / Pulmonary (DC 6600–6817)',
    domains: [
      {
        id: 'pft', label: 'Pulmonary Function (FEV-1 % Predicted)',
        description: 'FEV-1 (forced expiratory volume in 1 second) as a percent of predicted normal.',
        levels: [
          { value: 0,   label: 'Normal (≥71%)',   description: 'FEV-1 71% or greater of predicted.' },
          { value: 10,  label: 'Mild (56–70%)',   description: 'FEV-1 56–70% of predicted.' },
          { value: 30,  label: 'Moderate (40–55%)', description: 'FEV-1 40–55% of predicted.' },
          { value: 60,  label: 'Severe (less than 40%)', description: 'FEV-1 less than 40% of predicted.' },
          { value: 100, label: 'Total (FVC <40% or cor pulmonale)', description: 'FVC less than 40% of predicted or cor pulmonale or chronic respiratory failure.' },
        ],
      },
      {
        id: 'oxygen', label: 'Continuous Oxygen Use',
        description: 'Whether continuous oxygen therapy is required.',
        levels: [
          { value: 0,  label: 'Not required', description: 'No continuous oxygen required.' },
          { value: 30, label: 'Required',     description: 'Requires continuous oxygen therapy.' },
        ],
      },
    ],
  },
  apnea: {
    label: 'Sleep Apnea (DC 6847)',
    domains: [
      {
        id: 'severity', label: 'Sleep Apnea Severity',
        description: 'Severity of sleep apnea based on symptoms and treatment (DC 6847).',
        levels: [
          { value: 0,   label: 'Asymptomatic',       description: 'Asymptomatic, no treatment required.' },
          { value: 30,  label: 'Hypersomnolence',    description: 'Persistent daytime hypersomnolence.' },
          { value: 50,  label: 'CPAP Required',      description: 'Requires use of CPAP machine.' },
          { value: 100, label: 'Cor Pulmonale',      description: 'Chronic respiratory failure with cor pulmonale or requires tracheostomy.' },
        ],
      },
    ],
  },
  asthma: {
    label: 'Asthma / Reactive Airway Disease (DC 6602)',
    domains: [
      {
        id: 'pft', label: 'Pulmonary Function',
        description: 'FEV-1 % of predicted for asthma severity.',
        levels: [
          { value: 0,  label: 'Normal (≥71%)',         description: 'FEV-1 71% or greater of predicted; no daily medications.' },
          { value: 10, label: 'Mild (FEV-1 ≥70%)',     description: 'FEV-1 ≥70%; intermittent bronchodilator therapy.' },
          { value: 30, label: 'Moderate (FEV-1 56–70%)', description: 'FEV-1 56–70%; daily inhalational or oral bronchodilator therapy or anti-inflammatory inhalational therapy.' },
          { value: 60, label: 'Severe (FEV-1 40–55%)',  description: 'FEV-1 40–55%; more than one attack per week; requires systemic corticosteroids.' },
          { value: 100, label: 'Total (FEV-1 <40%)',    description: 'FEV-1 less than 40% of predicted; or; at least one attack per week; or; requires daily systemic high-dose corticosteroids.' },
        ],
      },
      {
        id: 'medication', label: 'Medication Use',
        description: 'Daily medication required for asthma control.',
        levels: [
          { value: 0,  label: 'None / Rescue only',       description: 'No daily medications or rescue inhaler only.' },
          { value: 10, label: 'Daily inhalational therapy', description: 'Daily inhalational or oral bronchodilator therapy.' },
          { value: 30, label: 'Systemic corticosteroids',  description: 'Requires systemic corticosteroid course more than 3x per year.' },
        ],
      },
      {
        id: 'attacks', label: 'Attacks/Flare-ups Frequency',
        description: 'Frequency of asthma attacks or exacerbations.',
        levels: [
          { value: 0,  label: 'None or rare',    description: 'No attacks or very rare.' },
          { value: 10, label: 'Occasional',      description: 'Occasional attacks less than once per month.' },
          { value: 30, label: 'Frequent',        description: 'Attacks several times per month.' },
          { value: 60, label: 'Weekly',          description: 'More than one attack per week.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Chest / Respiratory — General',
    domains: [
      {
        id: 'severity', label: 'Overall Severity',
        description: 'General severity of the chest or respiratory condition.',
        levels: [
          { value: 0,  label: 'None',       description: 'No significant impairment.' },
          { value: 10, label: 'Mild',       description: 'Mild impairment with occasional symptoms.' },
          { value: 30, label: 'Moderate',   description: 'Moderate impairment affecting daily activities.' },
          { value: 60, label: 'Severe',     description: 'Severe impairment with significant limitation.' },
          { value: 100, label: 'Total',     description: 'Total impairment.' },
        ],
      },
    ],
  },
}

export const CHEST_CONDITION_PROFILE: Record<string, string> = {
  'Asthma / reactive airway disease': 'asthma',
  'Sleep apnea': 'apnea',
  'COPD / emphysema': 'respiratory',
  'Chronic bronchitis': 'respiratory',
  'Pulmonary fibrosis': 'respiratory',
  'Pneumonia residuals': 'respiratory',
  'Pleurisy / pleural effusion': 'respiratory',
  'Rib fracture residuals': 'generic',
  'Costochondritis': 'generic',
  'Pneumothorax residuals': 'respiratory',
}

export function getChestProfile(name: string): EvalProfile {
  return CHEST_PROFILES[CHEST_CONDITION_PROFILE[name] ?? 'generic'] ?? CHEST_PROFILES.generic
}
export function getChestProfileKey(name: string): string {
  return CHEST_CONDITION_PROFILE[name] ?? 'generic'
}
export function calculateChestRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
