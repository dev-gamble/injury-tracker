export const MST_CONDITIONS: string[] = [
  'PTSD',
  'Major Depressive Disorder',
  'Generalized Anxiety Disorder',
  'Panic Disorder',
  'Adjustment Disorder',
  'Insomnia / Sleep Disturbance',
  'Substance Use Disorder',
  'Eating Disorder',
  'Sexual Dysfunction / Pain',
  'Chronic Pelvic Pain',
  'Irritable Bowel Syndrome (stress-related)',
  'Somatic Symptom Disorder',
  'Other condition related to MST',
]

export interface MSTEvidenceType {
  id: string
  label: string
}

export const MST_EVIDENCE_TYPES: MSTEvidenceType[] = [
  { id: 'buddy',       label: 'Buddy statement(s) from someone you told' },
  { id: 'behavioral',  label: 'Behavioral changes in service records (performance drop, discipline issues, etc.)' },
  { id: 'police',      label: 'Police or military police report' },
  { id: 'counseling',  label: 'Counseling or therapy records' },
  { id: 'medical',     label: 'Medical records showing treatment' },
  { id: 'performance', label: 'Performance evaluations showing decline after the event' },
  { id: 'transfer',    label: 'Transfer, duty change, or reassignment requests' },
  { id: 'pregnancy',   label: 'Pregnancy or STI testing records' },
  { id: 'journal',     label: 'Personal journal or diary entries' },
  { id: 'other',       label: 'Other supporting evidence' },
]

export const MST_SECONDARY_SUGGESTIONS: Record<string, string[]> = {
  'PTSD':                      ['Sleep Apnea', 'Migraines', 'Hypertension', 'Bruxism (Teeth Grinding)', 'Tinnitus', 'GERD / Acid Reflux', 'Erectile Dysfunction', 'Weight Gain / Obesity'],
  'Major Depressive Disorder':  ['Sleep Apnea', 'Migraines', 'Weight Gain / Obesity', 'Chronic Fatigue', 'Erectile Dysfunction', 'Fibromyalgia'],
  'Generalized Anxiety Disorder': ['Migraines', 'Hypertension', 'GERD / Acid Reflux', 'Irritable Bowel Syndrome', 'Bruxism (Teeth Grinding)'],
  'Panic Disorder':             ['Migraines', 'Hypertension', 'GERD / Acid Reflux', 'Chest Pain (Non-cardiac)'],
  'Insomnia / Sleep Disturbance': ['Sleep Apnea', 'Chronic Fatigue', 'Migraines', 'Weight Gain / Obesity'],
  'Substance Use Disorder':     ['Liver Disease', 'Peripheral Neuropathy', 'GERD / Acid Reflux', 'Hypertension'],
  'Eating Disorder':            ['GERD / Acid Reflux', 'Dental Conditions', 'Malnutrition-related Conditions'],
  '_default':                   ['Sleep Apnea', 'Migraines', 'Hypertension', 'Chronic Fatigue', 'GERD / Acid Reflux', 'Erectile Dysfunction'],
}

export interface SMCLevel {
  id: string
  label: string
  description: string
}

export const SMC_LEVELS: SMCLevel[] = [
  {
    id: 'smc_k',
    label: 'SMC-K: Loss of Body Part',
    description: "You've lost (or lost the use of) a body part — a reproductive organ, one hand, one foot, both buttocks, a breast, or sight in one eye. This extra payment gets added on top of your regular disability check. You can receive more than one SMC-K if multiple body parts are affected. Also commonly awarded with erectile dysfunction (ED) ratings.",
  },
  {
    id: 'smc_l',
    label: 'SMC-L: Aid & Attendance',
    description: "You need someone to help you with everyday tasks — bathing, getting dressed, eating, or using the bathroom — because of your service-connected disabilities. Also applies if you are bedridden or blind from service-connected conditions. You do NOT need a 100% rating to qualify — you just need to show you need daily help.",
  },
  {
    id: 'smc_l_half',
    label: 'SMC-L½: Aid & Attendance + Body Part Loss',
    description: "You already qualify for Aid & Attendance (SMC-L) AND you've also lost or lost the use of a hand, foot, or eye on top of that. This bumps your payment higher because you have both the daily help need AND a physical loss.",
  },
  {
    id: 'smc_m',
    label: 'SMC-M: Higher Level of Care',
    description: "You need more help than a regular caregiver can provide — like skilled nursing or someone with medical training. This is for veterans whose daily care needs go beyond what family or a basic aide can handle.",
  },
  {
    id: 'smc_m_half',
    label: 'SMC-M½: Higher Care + Additional Loss',
    description: "You qualify for the higher level of care (SMC-M) AND have additional body part losses on top of your care needs. A step up from M because of the combined severity.",
  },
  {
    id: 'smc_n',
    label: 'SMC-N: Multiple Losses + Aid & Attendance',
    description: "You need Aid & Attendance AND have lost or lost use of multiple body parts — such as two hands, two feet, one of each, or a combination with blindness. The payment is higher because of the combined effect of multiple losses plus needing daily help.",
  },
  {
    id: 'smc_n_half',
    label: 'SMC-N½: Severe Multiple Losses',
    description: "You have losses and care needs that go beyond N level. Multiple severe body part losses plus Aid & Attendance needs that are especially impactful.",
  },
  {
    id: 'smc_o',
    label: 'SMC-O: Maximum Regular SMC',
    description: "The highest regular SMC level. This is for veterans with multiple severe body part losses or conditions so severe they require the most intensive ongoing care. This is rare and reserved for the most seriously disabled veterans.",
  },
  {
    id: 'smc_r1',
    label: 'SMC-R.1: Higher A&A (TBI / Severe Conditions)',
    description: "You need regular daily help specifically because of a traumatic brain injury (TBI) or conditions so severe that standard Aid & Attendance isn't enough. This level recognizes that some conditions require a higher, more specialized type of daily assistance.",
  },
  {
    id: 'smc_r2',
    label: 'SMC-R.2: Hospitalization / Nursing Home Level',
    description: "You need ongoing hospitalization or nursing home-level care because of your service-connected conditions. This is the highest SMC payment level — for veterans who essentially need institutional-level medical care on a permanent basis.",
  },
  {
    id: 'smc_s',
    label: 'SMC-S: Housebound',
    description: "One of your conditions is rated at 100% AND your other conditions combine to at least 60% on their own (without the 100% condition). OR your disabilities physically keep you confined to your home and immediate area. This is extra money on top of your 100% rating.",
  },
]

export interface PresumptiveField {
  id: string
  label: string
  placeholder: string
}

export interface PresumptiveClaim {
  id: string
  label: string
  description: string
  fields: PresumptiveField[]
}

export const PRESUMPTIVE_CLAIMS: PresumptiveClaim[] = [
  {
    id: 'pow',
    label: 'Prisoner of War (POW)',
    description: "If you were a prisoner of war, the VA automatically assumes certain conditions were caused by your time in captivity — you don't have to prove the connection yourself. This includes PTSD, anxiety, arthritis, heart disease, stroke, liver disease, and more, depending on how long you were held. You still need a current diagnosis from a doctor, but the hardest part (proving it's connected to service) is done for you.",
    fields: [
      { id: 'dates',      label: 'When were you held?',                    placeholder: 'e.g., Mar 1968 - Jan 1969' },
      { id: 'location',   label: 'Where were you held?',                   placeholder: 'e.g., Hanoi, Vietnam' },
      { id: 'duration',   label: 'How long?',                              placeholder: 'e.g., 10 months' },
      { id: 'conditions', label: 'Conditions you believe are related',     placeholder: 'e.g., PTSD, arthritis, heart disease' },
    ],
  },
  {
    id: 'agent_orange',
    label: 'Agent Orange / Herbicide Exposure',
    description: "If you served somewhere the military used Agent Orange or other herbicides, certain conditions are automatically connected to your service — no need to prove the chemicals caused your illness. The VA just needs to know you were there. Covered conditions include Type 2 diabetes, heart disease, Parkinson's, bladder cancer, prostate cancer, lung cancer, and more. You still need a current diagnosis, but you skip proving the connection.",
    fields: [
      { id: 'dates',      label: 'When did you serve there?',              placeholder: 'e.g., Jun 1967 - Aug 1968' },
      { id: 'location',   label: 'Where did you serve?',                   placeholder: 'e.g., Da Nang, Vietnam / Korat RTAFB, Thailand' },
      { id: 'unit',       label: 'Unit (optional)',                        placeholder: 'e.g., 1st Infantry Division' },
      { id: 'conditions', label: 'Conditions you believe are related',     placeholder: 'e.g., Type 2 diabetes, prostate cancer' },
    ],
  },
  {
    id: 'gulf_war',
    label: 'Gulf War / Southwest Asia Illness',
    description: "If you served in Southwest Asia (Iraq, Kuwait, Saudi Arabia, etc.) from 1990 to now, you may qualify even WITHOUT a specific diagnosis. Unexplained symptoms lasting 6+ months can count on their own — things like constant fatigue, joint pain, headaches, stomach problems, skin issues, or trouble breathing. The VA rates these based on how often they happen and how much they affect your daily life.",
    fields: [
      { id: 'dates',    label: 'When did you serve there?',               placeholder: 'e.g., Jan 1991 - May 1991' },
      { id: 'location', label: 'Where did you serve?',                    placeholder: 'e.g., Kuwait, Saudi Arabia' },
      { id: 'unit',     label: 'Unit (optional)',                         placeholder: 'e.g., 3rd Armored Division' },
      { id: 'symptoms', label: 'Unexplained symptoms you experience',     placeholder: 'e.g., chronic fatigue, joint pain, headaches' },
    ],
  },
  {
    id: 'burn_pit',
    label: 'Burn Pit / PACT Act Exposure',
    description: "The PACT Act (2022) made it so the VA automatically connects certain cancers and breathing problems to burn pit and toxic exposure — you don't have to prove the link yourself. This covers post-9/11 veterans who served near burn pits in Iraq, Afghanistan, and other locations. Even if you don't have a condition yet, you can enroll in VA healthcare just for being exposed. Covered conditions include various cancers and respiratory diseases.",
    fields: [
      { id: 'dates',      label: 'When did you serve there?',             placeholder: 'e.g., Mar 2004 - Feb 2005' },
      { id: 'location',   label: 'Where did you serve?',                  placeholder: 'e.g., Balad Air Base, Iraq' },
      { id: 'unit',       label: 'Unit (optional)',                       placeholder: 'e.g., 332nd Air Expeditionary Wing' },
      { id: 'exposure',   label: 'What were you exposed to?',             placeholder: 'e.g., burn pits, oil well fires, depleted uranium' },
      { id: 'conditions', label: 'Conditions you believe are related',    placeholder: 'e.g., chronic bronchitis, sinusitis' },
    ],
  },
]

export const VOCATIONAL_CONDITIONS: string[] = [
  'Difficulty maintaining employment',
  'Unable to perform physical labor',
  'Unable to perform sedentary work',
  'Frequent absences due to conditions',
  'Reduced work hours / part-time only',
  'Loss of prior career / MOS-related work',
  'Difficulty with retraining / new skills',
  'Social / interpersonal workplace difficulties',
  'Combat-related occupational limitations',
  'Agent Orange related conditions',
  'Gulf War illness related limitations',
  'Burn pit / toxic exposure related',
]
