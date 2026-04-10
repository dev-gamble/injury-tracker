// ── MENTAL HEALTH EVALUATION DATA ─────────────────────────────────────────────

export interface MHDomainDef {
  id: string
  label: string
  description: string
  examples: Record<string, string>
}

export const MH_DOMAINS: MHDomainDef[] = [
  {
    id: 'cognition', label: 'Cognition',
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
    id: 'interpersonal', label: 'Interpersonal Interactions',
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
    id: 'taskCompletion', label: 'Task Completion',
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
    id: 'environments', label: 'Navigating Environments',
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
    id: 'selfCare', label: 'Self-Care',
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

export const MH_IMPAIRMENT_LEVELS = ['none', 'mild', 'moderate', 'severe', 'total'] as const
export type MHLevel = typeof MH_IMPAIRMENT_LEVELS[number]

export const MH_IMPAIRMENT_LABELS: Record<MHLevel, string> = {
  none: 'None', mild: 'Mild', moderate: 'Moderate', severe: 'Severe', total: 'Total',
}

// ── MENTAL HEALTH CONDITION LIST (VA MEPSS) ────────────────────────────────────
export const VA_MENTAL = [
  'Major depressive disorder', 'Persistent depressive disorder (dysthymia)',
  'Unspecified depressive disorder', 'Bipolar disorder', 'Cyclothymic disorder',
  'Generalized anxiety disorder', 'Unspecified anxiety disorder',
  'Panic disorder and/or agoraphobia', 'Specific phobia; social anxiety disorder (social phobia)',
  'Obsessive compulsive disorder', 'Posttraumatic stress disorder',
  'Chronic adjustment disorder', 'Schizoaffective disorder',
  'Schizophrenia, disorganized type',
  'Other specified and unspecified schizophrenia spectrum and other psychotic disorders',
  'Delusional disorder', 'Conversion disorder (functional neurological symptom disorder)',
  'Somatic symptom disorder', 'Illness anxiety disorder',
  'Other specified somatic symptom and related disorder',
  'Unspecified somatic symptom and related disorder',
  'Depersonalization/Derealization disorder',
  'Dissociative amnesia; dissociative identity disorder',
  'Anorexia nervosa', 'Bulimia nervosa', 'Delirium',
  'Major or mild neurocognitive disorder due to traumatic brain injury',
  "Major or mild neurocognitive disorder due to Alzheimer's disease",
  'Major or mild neurocognitive disorder due to HIV or other infections',
  'Major or mild neurocognitive disorder due to another medical condition or substance/medication-induced major or mild neurocognitive disorder',
  'Major or mild vascular neurocognitive disorder',
  'Unspecified neurocognitive disorder',
  'Other and unspecified neurosis',
  'Military sexual trauma (MST)',
]

// Condition description examples (for search display)
export const MH_EXAMPLES: Record<string, string> = {
  'Major depressive disorder': 'insomnia, fatigue, appetite changes, hopelessness',
  'Persistent depressive disorder (dysthymia)': 'chronic low mood, fatigue, poor concentration',
  'Generalized anxiety disorder': 'insomnia, restlessness, irritability, muscle tension',
  'Panic disorder and/or agoraphobia': 'chest tightness, racing heart, shortness of breath',
  'Obsessive compulsive disorder': 'intrusive thoughts, repetitive behaviors, rituals',
  'Posttraumatic stress disorder': 'nightmares, insomnia, hypervigilance, flashbacks',
  'Chronic adjustment disorder': 'stress response, difficulty coping, emotional distress',
  'Bipolar disorder': 'mood swings, insomnia, impulsivity, mania',
  'Somatic symptom disorder': 'chronic pain focus, excessive health worry',
  'Dissociative amnesia; dissociative identity disorder': 'memory gaps, identity confusion',
  'Military sexual trauma (MST)': 'anxiety, insomnia, hypervigilance, avoidance',
}

// ── RATING CALCULATION ─────────────────────────────────────────────────────────
export function calculateMHRating(domainRatings: Record<string, { level: string; frequency: string }>): number {
  const domains = Object.values(domainRatings)
  if (!domains.length) return 0

  let hasTotal25 = 0, hasTotalLess25 = 0
  let hasSevere25 = 0, hasSevereLess25 = 0
  let hasModerate25 = 0, hasModerateLess25 = 0
  let hasMild = 0

  domains.forEach((d) => {
    const lv = d.level || 'none'
    const freq = d.frequency || 'less25'
    if (lv === 'total') { if (freq === '25plus') hasTotal25++; else hasTotalLess25++ }
    if (lv === 'severe') { if (freq === '25plus') hasSevere25++; else hasSevereLess25++ }
    if (lv === 'moderate') { if (freq === '25plus') hasModerate25++; else hasModerateLess25++ }
    if (lv === 'mild') hasMild++
  })

  if (hasTotal25 >= 1) return 100
  if (hasSevere25 >= 1 || hasTotalLess25 >= 1) return 70
  if (hasModerate25 >= 2 || hasSevereLess25 >= 2 || (hasModerate25 >= 1 && hasSevereLess25 >= 1)) return 50
  if (hasModerate25 >= 1 || hasModerateLess25 >= 1 || hasSevereLess25 >= 1) return 30
  if (hasMild >= 1) return 10
  return 0
}
