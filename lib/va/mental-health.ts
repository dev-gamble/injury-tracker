import type { EvalDomain, MHImpairmentLevel, MHFrequency, MHDomainState } from './types'

export const VA_MENTAL: string[] = [
  'Major depressive disorder',
  'Persistent depressive disorder (dysthymia)',
  'Unspecified depressive disorder',
  'Bipolar disorder',
  'Cyclothymic disorder',
  'Generalized anxiety disorder',
  'Unspecified anxiety disorder',
  'Panic disorder and/or agoraphobia',
  'Specific phobia; social anxiety disorder (social phobia)',
  'Obsessive compulsive disorder',
  'Posttraumatic stress disorder',
  'Chronic adjustment disorder',
  'Schizoaffective disorder',
  'Schizophrenia, disorganized type',
  'Other specified and unspecified schizophrenia spectrum and other psychotic disorders',
  'Delusional disorder',
  'Conversion disorder (functional neurological symptom disorder)',
  'Somatic symptom disorder',
  'Illness anxiety disorder',
  'Other specified somatic symptom and related disorder',
  'Unspecified somatic symptom and related disorder',
  'Depersonalization/Derealization disorder',
  'Dissociative amnesia; dissociative identity disorder',
  'Anorexia nervosa',
  'Bulimia nervosa',
  'Delirium',
  'Major or mild neurocognitive disorder due to traumatic brain injury',
  'Major or mild neurocognitive disorder due to Alzheimer\'s disease',
  'Major or mild neurocognitive disorder due to HIV or other infections',
  'Major or mild neurocognitive disorder due to another medical condition or substance/medication-induced major or mild neurocognitive disorder',
  'Major or mild vascular neurocognitive disorder',
  'Unspecified neurocognitive disorder',
  'Other and unspecified neurosis',
  'Military sexual trauma (MST)',
]

export const MH_EXAMPLES: Record<string, string> = {
  'Major depressive disorder': 'insomnia, fatigue, appetite changes, hopelessness',
  'Persistent depressive disorder (dysthymia)': 'chronic low mood, fatigue, poor concentration',
  'Unspecified depressive disorder': 'low mood, sleep changes, loss of interest',
  'Bipolar disorder': 'mood swings, insomnia, impulsivity, mania',
  'Cyclothymic disorder': 'mild mood swings, emotional instability',
  'Generalized anxiety disorder': 'insomnia, restlessness, irritability, muscle tension',
  'Unspecified anxiety disorder': 'worry, sleep difficulty, nervousness',
  'Panic disorder and/or agoraphobia': 'chest tightness, racing heart, shortness of breath',
  'Specific phobia; social anxiety disorder (social phobia)': 'avoidance, fear of social situations, dread',
  'Obsessive compulsive disorder': 'intrusive thoughts, repetitive behaviors, rituals',
  'Posttraumatic stress disorder': 'nightmares, insomnia, hypervigilance, flashbacks',
  'Chronic adjustment disorder': 'stress response, difficulty coping, emotional distress',
  'Schizoaffective disorder': 'hallucinations, mood episodes, disorganized thinking',
  'Schizophrenia, disorganized type': 'hallucinations, delusions, disorganized speech',
  'Delusional disorder': 'fixed false beliefs, paranoia',
  'Conversion disorder (functional neurological symptom disorder)': 'weakness, tremors, numbness without medical cause',
  'Somatic symptom disorder': 'chronic pain focus, excessive health worry',
  'Illness anxiety disorder': 'fear of serious illness, body checking, reassurance seeking',
  'Depersonalization/Derealization disorder': 'feeling detached from self, surroundings feel unreal',
  'Dissociative amnesia; dissociative identity disorder': 'memory gaps, identity confusion',
  'Anorexia nervosa': 'food restriction, weight loss, body image distortion',
  'Bulimia nervosa': 'binge eating, purging, weight fluctuation',
  'Delirium': 'confusion, disorientation, attention deficits',
  'Major or mild neurocognitive disorder due to traumatic brain injury': 'memory loss, concentration problems, headaches',
  'Major or mild neurocognitive disorder due to Alzheimer\'s disease': 'progressive memory loss, confusion, disorientation',
  'Major or mild neurocognitive disorder due to HIV or other infections': 'cognitive decline, memory issues, slowed thinking',
  'Major or mild neurocognitive disorder due to another medical condition or substance/medication-induced major or mild neurocognitive disorder': 'cognitive impairment, memory problems',
  'Major or mild vascular neurocognitive disorder': 'memory loss, slowed thinking after stroke',
  'Unspecified neurocognitive disorder': 'cognitive decline, memory or attention issues',
  'Military sexual trauma (MST)': 'anxiety, insomnia, hypervigilance, avoidance',
}

export const MENTAL_SECONDARIES: string[] = [
  'Depression due to chronic pain',
  'Anxiety',
  'PTSD (related to injury)',
  'Insomnia / Sleep disturbance',
  'Adjustment disorder',
  'Somatic symptom disorder',
]

export interface MHDomainDef {
  id: string
  label: string
  description: string
  examples: Record<MHImpairmentLevel, string>
}

export const MH_DOMAINS: MHDomainDef[] = [
  {
    id: 'cognition',
    label: 'Cognition',
    description: 'Memory, concentration, decision-making, problem-solving, planning',
    examples: {
      none: 'No noticeable difficulty with memory, concentration, or decision-making.',
      mild: 'Occasional forgetfulness or slight difficulty concentrating under stress; can still manage daily tasks.',
      moderate: 'Frequent forgetfulness; noticeable difficulty concentrating, planning, or making decisions that affects productivity.',
      severe: 'Persistent memory gaps; significant difficulty with problem-solving, judgment, and decisions; needs frequent reminders.',
      total: 'Cannot remember basic tasks, make simple decisions, or solve everyday problems without assistance.',
    },
  },
  {
    id: 'interpersonal',
    label: 'Interpersonal Interactions',
    description: 'Intimate, family, informal, and formal relationships',
    examples: {
      none: 'Maintains healthy relationships with family, friends, and coworkers.',
      mild: 'Occasional tension or withdrawal in relationships; generally gets along with others.',
      moderate: 'Frequent conflicts or emotional distance with family, friends, or coworkers; difficulty maintaining relationships.',
      severe: 'Serious relationship breakdowns; frequent isolation, hostility, or inability to maintain employment relationships.',
      total: 'Complete inability to maintain any meaningful relationships; total social isolation or danger to others.',
    },
  },
  {
    id: 'taskCompletion',
    label: 'Task Completion',
    description: 'Vocational, educational, domestic, and social activities',
    examples: {
      none: 'Completes work, household, and social tasks without difficulty.',
      mild: 'Occasionally falls behind on tasks or needs extra time; generally meets responsibilities.',
      moderate: 'Frequently unable to complete tasks on time; reduced reliability at work or home; needs accommodation.',
      severe: 'Cannot maintain regular employment or complete most household tasks without significant help.',
      total: 'Completely unable to perform any vocational, educational, or domestic tasks.',
    },
  },
  {
    id: 'environments',
    label: 'Navigating Environments',
    description: 'Leaving home, confined/crowded spaces, new environments, driving, public transportation',
    examples: {
      none: 'Moves freely through all environments without distress.',
      mild: 'Occasional discomfort in crowds or unfamiliar places; can still navigate independently.',
      moderate: 'Frequently avoids crowds, new places, or driving; needs planning or support to leave home.',
      severe: 'Rarely leaves home; extreme distress in most environments outside the home; cannot drive safely.',
      total: 'Completely homebound; unable to leave home under any circumstances without extreme distress.',
    },
  },
  {
    id: 'selfCare',
    label: 'Self-Care',
    description: 'Hygiene, appropriate dressing, nourishment',
    examples: {
      none: 'Maintains personal hygiene, dresses appropriately, and eats regular meals.',
      mild: 'Occasionally neglects grooming or skips meals; generally maintains appearance.',
      moderate: 'Frequently neglects hygiene, wears inappropriate clothing, or has poor nutrition; noticeable to others.',
      severe: 'Rarely bathes, changes clothes, or eats properly; requires prompting or assistance for basic self-care.',
      total: 'Completely unable to care for self; requires full-time assistance for hygiene, dressing, and eating.',
    },
  },
]

export const MH_IMPAIRMENT_LEVELS: MHImpairmentLevel[] = ['none', 'mild', 'moderate', 'severe', 'total']

export const MH_IMPAIRMENT_LABELS: Record<MHImpairmentLevel, string> = {
  none: 'None',
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  total: 'Total',
}

export const MH_FREQUENCY_LABELS: Record<MHFrequency, string> = {
  less25: '<25%',
  less50: '25–50%',
  more50: '>50%',
  always: 'Always',
}

/**
 * Calculate MH rating from domain assessments using VA 8787 criteria.
 * domainRatings: { cognition: {level, frequency}, interpersonal: {level, frequency}, ... }
 */
export function calculateMHRating(domainRatings: Record<string, MHDomainState>): number {
  const domains = Object.values(domainRatings)
  if (!domains.length) return 0

  let hasTotal25 = 0, hasTotalLess25 = 0
  let hasSevere25 = 0, hasSevereLess25 = 0
  let hasModerate25 = 0, hasModerateLess25 = 0
  let hasMild = 0

  domains.forEach(d => {
    const lv = d.level || 'none'
    const freq = d.frequency || 'less25'
    const is25 = freq === 'less50' || freq === 'more50' || freq === 'always'
    if (lv === 'total')    { if (is25) hasTotal25++;    else hasTotalLess25++; }
    if (lv === 'severe')   { if (is25) hasSevere25++;   else hasSevereLess25++; }
    if (lv === 'moderate') { if (is25) hasModerate25++; else hasModerateLess25++; }
    if (lv === 'mild')     hasMild++
  })

  if (hasTotal25 >= 1) return 100
  if (hasSevere25 >= 1 || hasTotalLess25 >= 1) return 70
  if (hasModerate25 >= 2 || hasSevereLess25 >= 2 || (hasModerate25 >= 1 && hasSevereLess25 >= 1)) return 50
  if (hasModerate25 >= 1 || hasModerateLess25 >= 1 || hasSevereLess25 >= 1) return 30
  if (hasMild >= 1) return 10
  return 0
}
