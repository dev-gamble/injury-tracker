// ── EVALUATION PROFILE TYPES ────────────────────────────────────────────────

export interface DomainLevel {
  value: number
  label: string
  description: string
}

export interface EvalDomain {
  id: string
  label: string
  description: string
  levels: DomainLevel[]
}

export interface EvalProfile {
  label: string
  note?: string
  domains: EvalDomain[]
}

// ── MENTAL HEALTH DOMAINS (8787) ────────────────────────────────────────────

export interface MHDomainDef {
  id: string
  label: string
  description: string
  examples: Record<string, string>
}

export const MH_DOMAINS: MHDomainDef[] = [
  {
    id: "cognition",
    label: "Cognition",
    description: "Memory, concentration, decision-making, problem-solving, planning",
    examples: {
      none: "No noticeable difficulty with memory, concentration, or decision-making.",
      mild: "Occasional forgetfulness or slight difficulty concentrating under stress; can still manage daily tasks.",
      moderate: "Frequent forgetfulness; noticeable difficulty concentrating, planning, or making decisions that affects productivity.",
      severe: "Persistent memory gaps; significant difficulty with problem-solving, judgment, and decisions; needs frequent reminders.",
      total: "Cannot remember basic tasks, make simple decisions, or solve everyday problems without assistance.",
    },
  },
  {
    id: "interpersonal",
    label: "Interpersonal Interactions",
    description: "Intimate, family, informal, and formal relationships",
    examples: {
      none: "Maintains healthy relationships with family, friends, and coworkers.",
      mild: "Occasional tension or withdrawal in relationships; generally gets along with others.",
      moderate: "Frequent conflicts or emotional distance with family, friends, or coworkers; difficulty maintaining relationships.",
      severe: "Serious relationship breakdowns; frequent isolation, hostility, or inability to maintain employment relationships.",
      total: "Complete inability to maintain any meaningful relationships; total social isolation or danger to others.",
    },
  },
  {
    id: "taskCompletion",
    label: "Task Completion",
    description: "Vocational, educational, domestic, and social activities",
    examples: {
      none: "Completes work, household, and social tasks without difficulty.",
      mild: "Occasionally falls behind on tasks or needs extra time; generally meets responsibilities.",
      moderate: "Frequently unable to complete tasks on time; reduced reliability at work or home; needs accommodation.",
      severe: "Cannot maintain regular employment or complete most household tasks without significant help.",
      total: "Completely unable to perform any vocational, educational, or domestic tasks.",
    },
  },
  {
    id: "environments",
    label: "Navigating Environments",
    description: "Leaving home, confined/crowded spaces, new environments, driving, public transportation",
    examples: {
      none: "Moves freely through all environments without distress.",
      mild: "Occasional discomfort in crowds or unfamiliar places; can still navigate independently.",
      moderate: "Frequently avoids crowds, new places, or driving; needs planning or support to leave home.",
      severe: "Rarely leaves home; extreme distress in most environments outside the home; cannot drive safely.",
      total: "Completely homebound; unable to leave home under any circumstances without extreme distress.",
    },
  },
  {
    id: "selfCare",
    label: "Self-Care",
    description: "Hygiene, appropriate dressing, nourishment",
    examples: {
      none: "Maintains personal hygiene, dresses appropriately, and eats regular meals.",
      mild: "Occasionally neglects grooming or skips meals; generally maintains appearance.",
      moderate: "Frequently neglects hygiene, wears inappropriate clothing, or has poor nutrition; noticeable to others.",
      severe: "Rarely bathes, changes clothes, or eats properly; requires prompting or assistance for basic self-care.",
      total: "Completely unable to care for self; requires full-time assistance for hygiene, dressing, and eating.",
    },
  },
]

export const MH_IMPAIRMENT_LEVELS = ["none", "mild", "moderate", "severe", "total"] as const
export const MH_IMPAIRMENT_LABELS: Record<string, string> = {
  none: "None",
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
  total: "Total",
}

export function calculateMHRating(domainRatings: Record<string, { level: string; frequency: string }>): number {
  const domains = Object.values(domainRatings)
  if (!domains.length) return 0

  let hasTotal25 = 0, hasTotalLess25 = 0
  let hasSevere25 = 0, hasSevereLess25 = 0
  let hasModerate25 = 0, hasModerateLess25 = 0
  let hasMild = 0

  for (const d of domains) {
    const lv = d.level || "none"
    const freq = d.frequency || "less25"
    if (lv === "total") { if (freq === "25plus") hasTotal25++; else hasTotalLess25++ }
    if (lv === "severe") { if (freq === "25plus") hasSevere25++; else hasSevereLess25++ }
    if (lv === "moderate") { if (freq === "25plus") hasModerate25++; else hasModerateLess25++ }
    if (lv === "mild") hasMild++
  }

  if (hasTotal25 >= 1) return 100
  if (hasSevere25 >= 1 || hasTotalLess25 >= 1) return 70
  if (hasModerate25 >= 2 || hasSevereLess25 >= 2 || (hasModerate25 >= 1 && hasSevereLess25 >= 1)) return 50
  if (hasModerate25 >= 1 || hasModerateLess25 >= 1 || hasSevereLess25 >= 1) return 30
  if (hasMild >= 1) return 10
  return 0
}

// ── GENERIC MAX-OF-DOMAINS RATING ──────────────────────────────────────────

export function calculateMaxRating(domainValues: Record<string, number>): number {
  let max = 0
  for (const v of Object.values(domainValues)) {
    if (typeof v === "number" && v > max) max = v
  }
  return max
}

// ── HEAD & FACE PROFILES ────────────────────────────────────────────────────

export const HEAD_PROFILES: Record<string, EvalProfile> = {
  migraine: {
    label: "Migraine / Headaches (DC 8100)",
    domains: [{
      id: "severity", label: "Attack Frequency & Severity",
      description: "Frequency and severity of migraine attacks severe enough to leave you unable to function (prostrating)",
      levels: [
        { value: 0, label: "Less frequent attacks", description: "Attacks that are not severe enough to leave you unable to function, or infrequent attacks" },
        { value: 10, label: "Severe attacks ~every 2 months", description: "Attacks severe enough to leave you unable to function (prostrating) averaging one in 2 months over last several months" },
        { value: 30, label: "Severe attacks ~once per month", description: "Attacks severe enough to leave you unable to function (prostrating) occurring on average once a month over last several months" },
        { value: 50, label: "Very frequent severe & prolonged attacks", description: "Very frequent attacks that completely leave you unable to function (prostrating) and are prolonged, causing severe inability to work" },
      ],
    }],
  },
  tbi: {
    label: "TBI Residuals (DC 8045)",
    note: "Rate based on 10 facets. Overall rating equals the highest facet level.",
    domains: [
      { id: "memory", label: "Facet 1: Memory / Attention / Concentration", description: "Executive functions including memory, attention, concentration", levels: [
        { value: 0, label: "Level 0 \u2014 No complaints", description: "No complaints of impairment" },
        { value: 10, label: "Level 1 \u2014 Mild (subjective)", description: "Mild loss of memory, difficulty following conversation, misplacing items \u2014 no objective evidence on testing" },
        { value: 40, label: "Level 2 \u2014 Mild (objective)", description: "Objective evidence on testing of mild impairment resulting in mild functional impairment" },
        { value: 70, label: "Level 3 \u2014 Moderate (objective)", description: "Objective evidence on testing of moderate impairment resulting in moderate functional impairment" },
        { value: 100, label: "Total \u2014 Severe (objective)", description: "Objective evidence of severe impairment resulting in severe functional impairment" },
      ]},
      { id: "judgment", label: "Facet 2: Judgment", description: "Ability to make reasonable decisions", levels: [
        { value: 0, label: "Level 0 \u2014 Normal", description: "Normal judgment" },
        { value: 10, label: "Level 1 \u2014 Mildly impaired", description: "Occasionally unable to handle complex/unfamiliar decisions" },
        { value: 40, label: "Level 2 \u2014 Moderately impaired", description: "Usually unable to make reasonable decisions for complex matters" },
        { value: 70, label: "Level 3 \u2014 Moderately severely impaired", description: "Occasionally unable to make reasonable decisions even for routine matters" },
        { value: 100, label: "Total \u2014 Severely impaired", description: "Usually unable to make reasonable decisions even for routine/familiar matters" },
      ]},
      { id: "social", label: "Facet 3: Social Interaction", description: "Appropriateness of social interaction", levels: [
        { value: 0, label: "Level 0 \u2014 Routinely appropriate", description: "Social interaction is routinely appropriate" },
        { value: 10, label: "Level 1 \u2014 Occasionally inappropriate", description: "Social interaction is occasionally inappropriate" },
        { value: 40, label: "Level 2 \u2014 Frequently inappropriate", description: "Social interaction is frequently inappropriate" },
        { value: 70, label: "Level 3 \u2014 Inappropriate most/all of the time", description: "Inappropriate most or all of the time" },
      ]},
      { id: "orientation", label: "Facet 4: Orientation", description: "Orientation to person, time, place, and situation", levels: [
        { value: 0, label: "Level 0 \u2014 Always oriented", description: "Always oriented to person, time, place, and situation" },
        { value: 10, label: "Level 1 \u2014 Occasionally disoriented to 1 aspect", description: "Occasionally disoriented to one of the four aspects" },
        { value: 40, label: "Level 2 \u2014 Occasionally to 2 / often to 1", description: "Occasionally disoriented to two aspects, or often disoriented to one" },
        { value: 70, label: "Level 3 \u2014 Often disoriented to 2+", description: "Often disoriented to two or more aspects" },
        { value: 100, label: "Total \u2014 Consistently disoriented", description: "Consistently disoriented to two or more aspects" },
      ]},
      { id: "motor", label: "Facet 5: Motor Activity", description: "Motor activity with intact motor and sensory system", levels: [
        { value: 0, label: "Level 0 \u2014 Normal", description: "Motor activity is normal" },
        { value: 10, label: "Level 1 \u2014 Mildly slowed at times", description: "Normal most of the time, mildly slowed at times due to difficulty with coordinated movements (apraxia)" },
        { value: 40, label: "Level 2 \u2014 Mildly decreased", description: "Motor activity mildly decreased or with moderate slowing due to difficulty with coordinated movements (apraxia)" },
        { value: 70, label: "Level 3 \u2014 Moderately decreased", description: "Motor activity moderately decreased due to difficulty with coordinated movements (apraxia)" },
        { value: 100, label: "Total \u2014 Severely decreased", description: "Motor activity severely decreased due to difficulty with coordinated movements (apraxia)" },
      ]},
      { id: "spatial", label: "Facet 6: Visual Spatial Orientation", description: "Ability to navigate environments and use maps/directions", levels: [
        { value: 0, label: "Level 0 \u2014 Normal", description: "Normal spatial orientation" },
        { value: 10, label: "Level 1 \u2014 Mildly impaired", description: "Occasionally lost in unfamiliar surroundings; can use GPS" },
        { value: 40, label: "Level 2 \u2014 Moderately impaired", description: "Usually lost in unfamiliar surroundings; difficulty using GPS" },
        { value: 70, label: "Level 3 \u2014 Moderately severely impaired", description: "Lost even in familiar surroundings; unable to use GPS" },
        { value: 100, label: "Total \u2014 Severely impaired", description: "Unable to touch/name body parts or find way in familiar places" },
      ]},
      { id: "subjective", label: "Facet 7: Subjective Symptoms", description: "Headaches, dizziness, fatigue, insomnia, hypersensitivity to sound/light", levels: [
        { value: 0, label: "Level 0 \u2014 Do not interfere", description: "Symptoms do not interfere with work, daily activities, or relationships" },
        { value: 10, label: "Level 1 \u2014 Mildly interfere", description: "3+ symptoms that mildly interfere: intermittent dizziness, daily mild headaches, tinnitus, insomnia" },
        { value: 40, label: "Level 2 \u2014 Moderately interfere", description: "3+ symptoms that moderately interfere: marked fatigue, blurred/double vision, headaches requiring rest" },
      ]},
      { id: "neurobehavioral", label: "Facet 8: Neurobehavioral Effects", description: "Irritability, impulsivity, aggression, apathy, lack of motivation", levels: [
        { value: 0, label: "Level 0 \u2014 Do not interfere", description: "Effects present but do not interfere with workplace or social interaction" },
        { value: 10, label: "Level 1 \u2014 Occasionally interfere", description: "Occasionally interfere with workplace/social interaction but do not preclude them" },
        { value: 40, label: "Level 2 \u2014 Frequently interfere", description: "Frequently interfere but do not preclude workplace/social interaction" },
        { value: 70, label: "Level 3 \u2014 Preclude interaction most days", description: "Interfere with or preclude interaction on most days; occasionally require supervision" },
      ]},
      { id: "communication", label: "Facet 9: Communication", description: "Ability to communicate by spoken/written language", levels: [
        { value: 0, label: "Level 0 \u2014 Normal", description: "Able to communicate and comprehend spoken and written language" },
        { value: 10, label: "Level 1 \u2014 Occasionally impaired", description: "Comprehension or expression only occasionally impaired; can communicate complex ideas" },
        { value: 40, label: "Level 2 \u2014 Impaired < half the time", description: "Unable to communicate more than occasionally but less than half the time" },
        { value: 70, label: "Level 3 \u2014 Impaired \u2265 half the time", description: "Unable to communicate at least half the time; may rely on gestures; can communicate basic needs" },
        { value: 100, label: "Total \u2014 Complete inability", description: "Complete inability to communicate or comprehend; unable to communicate basic needs" },
      ]},
      { id: "consciousness", label: "Facet 10: Consciousness", description: "Level of consciousness", levels: [
        { value: 0, label: "Normal", description: "Normal state of consciousness" },
        { value: 100, label: "Total \u2014 Persistently altered", description: "Persistently altered state (vegetative state, minimally responsive, coma)" },
      ]},
    ],
  },
  tmj: {
    label: "TMJ / Temporomandibular Disorder (DC 9905)",
    domains: [
      { id: "opening", label: "Maximum Unassisted Vertical Opening", description: "Jaw opening range and dietary restrictions (normal: 35\u201350 mm)", levels: [
        { value: 0, label: "Normal opening (35+ mm)", description: "No limitation of jaw opening." },
        { value: 10, label: "34 mm / limited lateral excursion", description: "34 mm opening; or 0\u20134 mm lateral excursion." },
        { value: 20, label: "29 mm or 34 mm with soft-food diet", description: "29 mm without dietary restriction; or 34 mm with restriction to soft/semi-solid foods." },
        { value: 30, label: "20 mm or 29\u201334 mm with restricted diet", description: "20 mm without restriction; or 29 mm without restriction to soft foods; or 34 mm with liquid/pureed diet." },
        { value: 40, label: "10\u201320 mm with dietary restrictions", description: "10 mm without restriction; or 20 mm with mechanically altered food; or 29 mm with liquid/pureed diet." },
        { value: 50, label: "10 mm with all mechanically altered food diet", description: "10 mm maximum opening with dietary restrictions to all mechanically altered food." },
      ]},
      { id: "pain", label: "Pain on Movement", description: "Pain when chewing, talking, yawning, or at rest", levels: [
        { value: 0, label: "No pain", description: "No jaw pain during movement or at rest." },
        { value: 10, label: "Mild \u2014 occasional pain", description: "Occasional pain with prolonged chewing or wide opening. Clicking/popping without significant pain." },
        { value: 20, label: "Moderate \u2014 frequent pain", description: "Frequent pain during normal chewing, talking, or yawning. May radiate to ear, temple, or neck." },
        { value: 30, label: "Severe \u2014 constant pain", description: "Near-constant jaw pain, significantly limits talking and eating. Pain at rest or wakes from sleep." },
      ]},
      { id: "mastication", label: "Chewing / Eating Difficulty", description: "Impact on ability to eat normally", levels: [
        { value: 0, label: "Normal diet", description: "Can eat all foods without difficulty." },
        { value: 10, label: "Avoids hard/chewy foods", description: "Avoids hard, crunchy, or very chewy foods (steak, raw vegetables, etc.) but manages most foods." },
        { value: 20, label: "Soft food diet", description: "Limited to soft foods \u2014 pasta, bread, cooked vegetables. Cannot eat steak, nuts, raw produce." },
        { value: 30, label: "Liquid/pureed diet", description: "Restricted to liquids, smoothies, or pureed foods due to inability to chew." },
      ]},
    ],
  },
  tinnitus: {
    label: "Tinnitus (DC 6260)",
    note: "Single evaluation whether perceived in one ear, both ears, or head.",
    domains: [{
      id: "severity", label: "Tinnitus Impact", description: "Whether tinnitus significantly impacts daily life", levels: [
        { value: 0, label: "Not recurrent or no significant impact", description: "Tinnitus present but not recurrent, or does not interfere with sleep, concentration, or daily life" },
        { value: 10, label: "Recurrent; interferes with sleep / concentration / daily life", description: "Significantly interferes with sleep, concentration, or daily life; or causes emotional distress" },
      ],
    }],
  },
  hearing: {
    label: "Hearing Loss (DC 6100)",
    note: "VA rates hearing based on audiometric testing. Select what best describes your hearing.",
    domains: [
      { id: "type", label: "Type of Hearing Problem", description: "What kind of hearing issue do you experience?", levels: [
        { value: 0, label: "No hearing problems", description: "Normal hearing in both ears." },
        { value: 10, label: "Hearing loss only", description: "Difficulty hearing conversations or sounds, but no ringing." },
        { value: 10, label: "Ringing only (tinnitus)", description: "Ringing, buzzing, or hissing in one or both ears, but hearing is otherwise normal." },
        { value: 10, label: "Both hearing loss and ringing", description: "Both reduced hearing and persistent ringing/buzzing. Each may be rated separately." },
      ]},
      { id: "degree", label: "Degree of Hearing Loss", description: "How much does hearing loss affect your daily life?", levels: [
        { value: 0, label: "None or minimal", description: "Can hear conversations normally in most situations." },
        { value: 10, label: "Mild", description: "Difficulty hearing in noisy environments (restaurants, groups). May need to ask people to repeat." },
        { value: 20, label: "Moderate", description: "Frequently miss parts of conversations. Need hearing aids to function normally." },
        { value: 30, label: "Moderately severe", description: "Significant difficulty even with hearing aids. Struggle with phone calls and TV at normal volume." },
        { value: 50, label: "Severe", description: "Very limited hearing even with aids. Rely on lip reading or visual cues." },
        { value: 100, label: "Total loss (both ears)", description: "Complete or near-complete deafness in both ears." },
      ]},
    ],
  },
  vestibular: {
    label: "Peripheral Vestibular Disorder (DC 6204)",
    domains: [{ id: "severity", label: "Symptom Severity (last 6 months)", description: "Impact of dizziness/vertigo on daily activities", levels: [
      { value: 0, label: "No significant symptoms", description: "No dizziness or balance issues" },
      { value: 10, label: "Brief / temporary modification needed", description: "Symptoms require brief modification of activity but do not prevent normal functions" },
      { value: 30, label: "Routine limitation of activities", description: "Frequent symptoms requiring routine limitation in work/self-care; independent with effort and modification" },
      { value: 100, label: "Inability to work or self-care", description: "Symptoms result in inability to engage in work and/or self-care; cannot perform routine daily activities" },
    ]}],
  },
  menieres: {
    label: "Meniere\u2019s Disease (DC 6205)",
    note: "Rate under these criteria OR separately rate vertigo + hearing + tinnitus \u2014 whichever is higher.",
    domains: [{ id: "severity", label: "Vertigo Frequency (with hearing impairment)", description: "How often vertigo attacks occur, with concurrent hearing impairment", levels: [
      { value: 0, label: "No vertigo", description: "Hearing impairment without vertigo episodes" },
      { value: 30, label: "Vertigo less than once a month", description: "Hearing impairment with vertigo less than once monthly" },
      { value: 60, label: "Vertigo 1\u20134 times a month", description: "Hearing impairment with vertigo occurring 1\u20134 times monthly" },
      { value: 100, label: "Vertigo >5 times/month or persistent balance problems", description: "Vertigo >5x/month or persistent balance problems (disequilibrium) and unsteady walking" },
    ]}],
  },
  sinusitis: {
    label: "Sinusitis (DC 6510\u20136514)",
    domains: [{ id: "severity", label: "Episode Frequency & Severity", description: "Frequency of severe (bed-rest-level) and milder sinusitis episodes per year", levels: [
      { value: 0, label: "Detected by imaging only", description: "Sinusitis detected by X-ray/CT only; no clinical symptoms" },
      { value: 10, label: "1\u20132 severe or 3\u20136 milder episodes/year", description: "1\u20132 episodes requiring prolonged antibiotics; or 3\u20136 episodes with headaches, pain, discharge" },
      { value: 30, label: "3+ severe or 6+ milder episodes/year", description: "3+ episodes requiring prolonged antibiotics; or 6+ milder episodes yearly" },
      { value: 50, label: "Post-surgical chronic symptoms or near-constant sinusitis", description: "Following radical surgery with chronic bone infection (osteomyelitis); or near-constant sinusitis" },
    ]}],
  },
  vision: {
    label: "Visual Acuity Impairment (DC 6061\u20136066)",
    note: "VA rating is based on corrected visual acuity testing. Select the closest match.",
    domains: [{ id: "severity", label: "Visual Acuity (corrected)", description: "Best corrected visual acuity in the affected eye(s)", levels: [
      { value: 0, label: "20/40 or better both eyes", description: "Normal or near-normal corrected vision" },
      { value: 10, label: "20/50\u201320/70 in one eye", description: "Mild impairment in one eye; other 20/40 or better" },
      { value: 20, label: "20/100 one eye or 20/70 both", description: "Moderate visual impairment" },
      { value: 30, label: "20/200 one eye or 20/100 both", description: "Significant impairment; legally impaired in one eye" },
      { value: 40, label: "20/200 both eyes or 5/200 one eye", description: "Severe visual impairment" },
      { value: 50, label: "5/200 both eyes", description: "Very severe visual impairment" },
      { value: 70, label: "Light perception only in one eye", description: "Functional blindness in one eye" },
      { value: 100, label: "No light perception / anatomical loss both eyes", description: "Total blindness" },
    ]}],
  },
  cranial_nerve: {
    label: "Cranial Nerve Impairment",
    domains: [{ id: "severity", label: "Nerve Paralysis / Neuralgia Severity", description: "Degree of nerve dysfunction", levels: [
      { value: 0, label: "Normal function", description: "No nerve impairment" },
      { value: 10, label: "Mild / Incomplete paralysis", description: "Mild dysfunction; slight sensory or motor loss" },
      { value: 20, label: "Moderate incomplete paralysis", description: "Moderate dysfunction; noticeable sensory or motor deficit" },
      { value: 30, label: "Severe incomplete paralysis", description: "Severe dysfunction; significant functional loss" },
      { value: 50, label: "Complete paralysis", description: "Complete loss of function of the affected nerve" },
    ]}],
  },
  disfigurement: {
    label: "Disfigurement of Head, Face, or Neck (DC 7800)",
    note: "Rated based on the 8 characteristics of disfigurement and whether there is visible tissue loss or asymmetry of features.",
    domains: [
      { id: "characteristics", label: "Characteristics of Disfigurement", description: "Count how many of these 8 characteristics apply: (1) Scar 5+ inches long, (2) Scar 1/4+ inch wide, (3) Surface contour elevated or depressed, (4) Scar adherent to underlying tissue, (5) Hypo/hyper-pigmented area exceeding 6 sq inches, (6) Abnormal skin texture exceeding 6 sq inches, (7) Underlying soft tissue missing exceeding 6 sq inches, (8) Skin indurated and inflexible exceeding 6 sq inches", levels: [
        { value: 0, label: "No characteristics of disfigurement", description: "No scars or disfigurement meeting any of the 8 characteristics." },
        { value: 10, label: "1 characteristic", description: "One characteristic of disfigurement present." },
        { value: 30, label: "2 or 3 characteristics", description: "Two or three characteristics of disfigurement; or visible/palpable tissue loss with gross distortion or asymmetry of one feature or paired set of features." },
        { value: 50, label: "4 or 5 characteristics", description: "Four or five characteristics of disfigurement; or visible/palpable tissue loss with gross distortion or asymmetry of two features or paired sets of features." },
        { value: 80, label: "6 or more characteristics", description: "Six or more characteristics of disfigurement; or visible/palpable tissue loss with gross distortion or asymmetry of three or more features or paired sets of features." },
      ]},
      { id: "tissue_loss", label: "Tissue Loss & Asymmetry", description: "Is there visible or palpable tissue loss with distortion or asymmetry of facial features?", levels: [
        { value: 0, label: "No tissue loss or asymmetry", description: "No visible tissue loss. Facial features are symmetric." },
        { value: 30, label: "Tissue loss with asymmetry of 1 feature", description: "Visible or palpable tissue loss AND either gross distortion or asymmetry of one feature or paired set of features." },
        { value: 50, label: "Tissue loss with asymmetry of 2 features", description: "Visible or palpable tissue loss AND gross distortion or asymmetry of two features or paired sets." },
        { value: 80, label: "Tissue loss with asymmetry of 3+ features", description: "Visible or palpable tissue loss AND gross distortion or asymmetry of three or more features or paired sets." },
      ]},
    ],
  },
  generic: {
    label: "General Severity Assessment",
    domains: [{ id: "severity", label: "Condition Severity", description: "Overall functional impact of this condition", levels: [
      { value: 0, label: "Asymptomatic / No disability", description: "Condition present but causes no functional limitation" },
      { value: 10, label: "Mild", description: "Mild symptoms with slight functional limitation" },
      { value: 20, label: "Moderate", description: "Moderate symptoms with noticeable functional limitation" },
      { value: 30, label: "Moderately Severe", description: "Significant symptoms affecting daily activities" },
      { value: 50, label: "Severe", description: "Severe symptoms substantially limiting function" },
      { value: 70, label: "Very Severe", description: "Very severe symptoms; near-total limitation" },
      { value: 100, label: "Total Disability", description: "Complete functional disability from this condition" },
    ]}],
  },
}

export const HEAD_CONDITION_PROFILE: Record<string, string> = {}
;["Migraine headaches", "Migraine"].forEach(n => HEAD_CONDITION_PROFILE[n] = "migraine")
;["TBI residuals", "Residuals of Traumatic Brain Injury (TBI)", "Cognitive disorder"].forEach(n => HEAD_CONDITION_PROFILE[n] = "tbi")
;["TMJ disorder", "Temporomandibular disorder (TMD)"].forEach(n => HEAD_CONDITION_PROFILE[n] = "tmj")
;["Tinnitus", "Tinnitus, recurrent"].forEach(n => HEAD_CONDITION_PROFILE[n] = "tinnitus")
;["Hearing impairment (hearing loss)"].forEach(n => HEAD_CONDITION_PROFILE[n] = "hearing")
;["Vertigo / Dizziness", "Peripheral vestibular disorders"].forEach(n => HEAD_CONDITION_PROFILE[n] = "vestibular")
;["Meniere\u2019s syndrome (endolymphatic hydrops)"].forEach(n => HEAD_CONDITION_PROFILE[n] = "menieres")
;["Vision impairment", "Diplopia (double vision)", "Visual field defects", "Scotoma, unilateral",
  "Retinal dystrophy (including retinitis pigmentosa, wet or dry macular degeneration, early-onset macular degeneration, rod and/or cone dystrophy)",
  "Diabetic retinopathy", "Optic neuropathy", "Ptosis, unilateral or bilateral", "Post-chiasmal disorders",
].forEach(n => HEAD_CONDITION_PROFILE[n] = "vision")
;["Fifth (trigeminal) cranial nerve, Neuralgia", "Seventh (facial) cranial nerve, Paralysis of"].forEach(n => HEAD_CONDITION_PROFILE[n] = "cranial_nerve")
;["Sinusitis, chronic"].forEach(n => HEAD_CONDITION_PROFILE[n] = "sinusitis")
;["Burn scar(s) of the head, face, or neck; scar(s) of the head, face, or neck due to other causes; or other disfigurement of the head, face, or neck"].forEach(n => HEAD_CONDITION_PROFILE[n] = "disfigurement")

export function getHeadProfileKey(name: string): string { return HEAD_CONDITION_PROFILE[name] || "generic" }
export function getHeadProfile(name: string): EvalProfile { return HEAD_PROFILES[getHeadProfileKey(name)] }

// ── GENERIC PHYSICAL PROFILE ────────────────────────────────────────────────

export const PHYSICAL_PROFILE: EvalProfile = {
  label: "Musculoskeletal / General Physical",
  domains: [
    { id: "rom", label: "Range of Motion / Function", description: "How limited is your movement or physical function in this area?", levels: [
      { value: 0, label: "Normal", description: "Full range of motion, no functional limitation." },
      { value: 10, label: "Slight limitation", description: "Minor restriction noticeable with strenuous activity; mostly functional." },
      { value: 20, label: "Moderate limitation", description: "Noticeable restriction affecting some daily activities; compensating movements." },
      { value: 30, label: "Significant limitation", description: "Movement substantially restricted; difficulty with routine tasks." },
      { value: 50, label: "Severe limitation", description: "Major restriction; unable to perform most physical tasks in this area." },
      { value: 100, label: "Total loss / Ankylosis", description: "No useful movement remaining; complete loss of function." },
    ]},
    { id: "pain", label: "Pain Severity", description: "Rate your typical pain level during daily activities.", levels: [
      { value: 0, label: "No pain", description: "No pain during normal activities." },
      { value: 10, label: "Mild", description: "Occasional mild pain; manageable without medication." },
      { value: 20, label: "Moderate", description: "Frequent pain requiring over-the-counter medication; affects some activities." },
      { value: 30, label: "Moderately severe", description: "Constant or near-constant pain; prescription medication needed; limits many activities." },
      { value: 50, label: "Severe", description: "Pain prevents most activities; requires strong medication or injections." },
    ]},
    { id: "flare", label: "Flare-ups / Episodes Bad Enough to Keep You in Bed", description: "How often do you experience worsening episodes that significantly limit activity?", levels: [
      { value: 0, label: "None", description: "No flare-ups or episodes bad enough to keep you in bed." },
      { value: 10, label: "Occasional", description: "A few times per year; brief duration (1-2 days)." },
      { value: 20, label: "Monthly", description: "Several times per month; moderate duration." },
      { value: 40, label: "Weekly", description: "Weekly episodes affecting work and daily activities." },
      { value: 60, label: "Completely disabling", description: "Frequent episodes so severe they leave you unable to function (multiple per week or constant)." },
    ]},
    { id: "daily", label: "Impact on Daily Living", description: "How does this condition affect your ability to work, exercise, and perform daily tasks?", levels: [
      { value: 0, label: "No impact", description: "Condition does not interfere with daily living." },
      { value: 10, label: "Minimal", description: "Minor inconvenience; can perform all duties with slight difficulty." },
      { value: 20, label: "Moderate", description: "Cannot perform some physical tasks; needs accommodation at work." },
      { value: 30, label: "Considerable", description: "Significant limitation on employment and daily activities." },
      { value: 50, label: "Major", description: "Unable to maintain substantially gainful employment due to this condition." },
      { value: 100, label: "Total", description: "Completely dependent on others for daily living activities." },
    ]},
  ],
}

// ── SYSTEMIC / OTHER PROFILES ───────────────────────────────────────────────

const FIBRO_PROFILES: Record<string, EvalProfile> = { fibromyalgia: { label: "Fibromyalgia (DC 5025)", note: "Rated based on whether symptoms are widespread, constant vs episodic, and response to therapy.", domains: [{ id: "severity", label: "Overall Severity", description: "Frequency of symptoms and response to treatment", levels: [{ value: 10, label: "Continuous medication needed", description: "Symptoms controlled by continuous medication." }, { value: 20, label: "Episodic, with exacerbations", description: "Episodic, with exacerbations often precipitated by environmental or emotional stress or by overexertion, but symptoms that are present more than one-third of the time." }, { value: 40, label: "Constant or nearly constant", description: "Widespread musculoskeletal pain and tender points, with or without associated fatigue, sleep disturbance, stiffness, numbness/tingling/pins-and-needles (paresthesias), headache, irritable bowel symptoms, depression, anxiety, or Raynaud\u2019s-like symptoms that are constant or nearly so and not responding to therapy." }] }] } }
const FIBRO_CONDITION_PROFILE: Record<string, string> = { "Fibromyalgia": "fibromyalgia" }

const CFS_PROFILES: Record<string, EvalProfile> = { cfs: { label: "Chronic Fatigue Syndrome (DC 6354)", note: "Rated based on activity restriction and flare-ups bad enough to keep you in bed.", domains: [{ id: "severity", label: "Functional Limitation", description: "Degree of activity restriction and flare-ups bad enough to keep you in bed", levels: [{ value: 10, label: "Nearly constant but able to function", description: "Debilitating fatigue, cognitive impairments, or other symptoms nearly constant and restrict routine daily activities by less than 25 percent of the pre-illness level; or flare-ups bad enough to keep you in bed for at least 1 but less than 2 weeks total per year." }, { value: 20, label: "Routine activities restricted 25-50%", description: "Symptoms restrict routine daily activities to 50 to 75 percent of the pre-illness level; or flare-ups bad enough to keep you in bed for at least 2 but less than 4 weeks total per year." }, { value: 40, label: "Routine activities restricted 50-75%", description: "Symptoms restrict routine daily activities to less than 50 percent of the pre-illness level; or flare-ups bad enough to keep you in bed for at least 4 but less than 6 weeks total per year." }, { value: 60, label: "Nearly completely restricted", description: "Symptoms nearly completely restrict routine daily activities; or flare-ups bad enough to keep you in bed for at least 6 weeks total per year." }, { value: 100, label: "Completely debilitating", description: "Debilitating fatigue, cognitive impairments and other symptoms that are completely debilitating, virtually restricting all routine daily activities." }] }] } }
const CFS_CONDITION_PROFILE: Record<string, string> = { "Chronic fatigue syndrome": "cfs" }

const DIABETES_PROFILES: Record<string, EvalProfile> = { diabetes: { label: "Diabetes Mellitus (DC 7913)", note: "Rated based on management requirements: diet, medication, insulin, and activity regulation.", domains: [{ id: "management", label: "Treatment & Management", description: "Level of treatment required to manage diabetes", levels: [{ value: 10, label: "Manageable by diet alone", description: "Manageable by restricted diet only." }, { value: 20, label: "Insulin and diet, or oral meds and diet", description: "Requiring insulin and restricted diet, or oral hypoglycemic agent and restricted diet." }, { value: 40, label: "Insulin, diet, and activity regulation", description: "Requiring insulin, restricted diet, and regulation of activities." }, { value: 60, label: "Insulin, diet, activity regulation + episodes", description: "Requiring insulin, restricted diet, and regulation of activities with dangerous blood sugar emergencies (ketoacidosis) or low blood sugar episodes (hypoglycemic reactions) requiring 1-2 hospitalizations per year or twice-a-month visits to a diabetic care provider, plus complications that would not be compensable if separately evaluated." }, { value: 100, label: "Requires more than one daily insulin injection", description: "Requiring more than one daily injection of insulin, restricted diet, and regulation of activities with dangerous blood sugar emergencies or low blood sugar episodes requiring at least 3 hospitalizations per year or weekly visits to a diabetic care provider." }] }] } }
const DIABETES_CONDITION_PROFILE: Record<string, string> = { "Diabetes mellitus": "diabetes", "Diabetes mellitus, Type 2": "diabetes", "Diabetes mellitus, Type 1": "diabetes" }

const HYPOTHYROID_PROFILES: Record<string, EvalProfile> = { hypothyroid: { label: "Hypothyroidism (DC 7903)", note: "Includes Hashimoto\u2019s thyroiditis. Rated based on symptoms and response to treatment.", domains: [{ id: "severity", label: "Symptom Severity", description: "Degree of symptoms despite treatment", levels: [{ value: 0, label: "Asymptomatic on medication", description: "No symptoms; controlled by continuous medication." }, { value: 10, label: "Fatigability, or medication required", description: "Fatigability, or continuous medication required for control." }, { value: 30, label: "Fatigability, constipation, mental sluggishness", description: "Fatigability, constipation, and mental sluggishness." }, { value: 60, label: "Muscular weakness, mental disturbance, weight gain", description: "Muscular weakness, mental disturbance, and weight gain." }, { value: 100, label: "Cold intolerance, cardiovascular involvement", description: "Cold intolerance, muscular weakness, cardiovascular involvement, mental disturbance (dementia, slowing of thought, depression), slow heartbeat (bradycardia), and sleepiness." }] }] } }
const HYPOTHYROID_CONDITION_PROFILE: Record<string, string> = { "Hypothyroidism": "hypothyroid", "Hashimoto\u2019s thyroiditis": "hypothyroid" }

const HYPERTHYROID_PROFILES: Record<string, EvalProfile> = { hyperthyroid: { label: "Hyperthyroidism / Graves\u2019 Disease (DC 7900)", note: "Rated based on symptoms and cardiovascular involvement.", domains: [{ id: "severity", label: "Symptom Severity", description: "Degree of symptoms including rapid heartbeat (tachycardia), tremor, and weight loss", levels: [{ value: 0, label: "Asymptomatic on medication", description: "No symptoms; controlled by continuous medication." }, { value: 10, label: "Rapid heartbeat, tremor, medication required", description: "Rapid heartbeat (tachycardia, 100+ bpm), which may be intermittent, and tremor, or continuous medication required for control." }, { value: 30, label: "Rapid heartbeat, tremor, increased pulse pressure or blood pressure", description: "Rapid heartbeat (tachycardia), tremor, and increased pulse pressure or blood pressure." }, { value: 60, label: "Emotional instability, weight loss, fatigability", description: "Emotional instability, rapid heartbeat (tachycardia), fatigability, and increased pulse pressure or blood pressure." }, { value: 100, label: "Thyroid enlargement, rapid/irregular pulse, weight loss", description: "Thyroid enlargement, rapid heartbeat (tachycardia, more than 150 bpm), eye involvement, muscular weakness, loss of weight, and sympathetic nervous system, cardiovascular, or gastrointestinal symptoms." }] }] } }
const HYPERTHYROID_CONDITION_PROFILE: Record<string, string> = { "Hyperthyroidism": "hyperthyroid", "Graves\u2019 disease": "hyperthyroid" }

const SKIN_PROFILES: Record<string, EvalProfile> = {
  dermatitis: { label: "Skin Conditions \u2014 Dermatitis / Eczema (DC 7806)", note: "Covers dermatitis, eczema, psoriasis, and most general skin conditions. Rated by body area affected and treatment type.", domains: [{ id: "area", label: "Body Area Affected", description: "Percentage of entire body or exposed areas affected", levels: [{ value: 0, label: "Less than 5% of body", description: "Less than 5 percent of the entire body or less than 5 percent of exposed areas affected, and no more than topical therapy required during the past 12-month period." }, { value: 10, label: "At least 5% but less than 20%", description: "At least 5 percent but less than 20 percent of the entire body or at least 5 percent but less than 20 percent of exposed areas affected, and intermittent systemic therapy required for a total duration of less than 6 weeks during the past 12-month period." }, { value: 30, label: "20 to 40% of body", description: "20 to 40 percent of the entire body or 20 to 40 percent of exposed areas affected, or systemic therapy required for a total duration of 6 weeks or more, but not constantly, during the past 12-month period." }, { value: 60, label: "More than 40% of body", description: "More than 40 percent of the entire body or more than 40 percent of exposed areas affected, or constant or near-constant systemic therapy required during the past 12-month period." }] }] },
  scars: { label: "Scars \u2014 Painful or Unstable (DC 7804)", note: "Rated based on number of scars and whether they are painful, unstable, or both.", domains: [{ id: "count", label: "Number of Painful or Unstable Scars", description: "Count of scars that are painful on examination and/or unstable", levels: [{ value: 0, label: "No painful or unstable scars", description: "No scars that are painful on examination or unstable." }, { value: 10, label: "1 or 2 scars", description: "One or two scars that are unstable or painful." }, { value: 20, label: "3 or 4 scars", description: "Three or four scars that are unstable or painful." }, { value: 30, label: "5 or more scars", description: "Five or more scars that are unstable or painful." }] }, { id: "both", label: "Both Painful AND Unstable?", description: "If one or more scars are BOTH painful and unstable, an additional 10% is added per VA Note 2", levels: [{ value: 0, label: "No \u2014 painful only or unstable only", description: "Scars are either painful or unstable, but not both." }, { value: 10, label: "Yes \u2014 at least one scar is both painful AND unstable", description: "One or more scars are both painful on examination AND unstable. VA adds 10% to the evaluation." }] }] },
  burn_deep: { label: "Burn Scars / Deep Scars (DC 7801)", note: "For burn scars or scars due to other causes, NOT of the head/face/neck, that are deep and nonlinear. Rated by total area.", domains: [{ id: "area", label: "Total Area of Deep Scars", description: "Combined area of all deep nonlinear scars (not on head/face/neck)", levels: [{ value: 0, label: "Less than 6 sq inches (39 sq cm)", description: "Total area less than 6 square inches (39 sq cm)." }, { value: 10, label: "6 to 12 sq inches (39\u201377 sq cm)", description: "Area at least 6 but less than 12 square inches." }, { value: 20, label: "12 to 72 sq inches (77\u2013465 sq cm)", description: "Area at least 12 but less than 72 square inches." }, { value: 30, label: "72 to 144 sq inches (465\u2013929 sq cm)", description: "Area at least 72 but less than 144 square inches." }, { value: 40, label: "144+ sq inches (929+ sq cm)", description: "Area of 144 square inches (929 sq cm) or greater." }] }, { id: "function", label: "Limitation of Function", description: "Does the scar cause limitation of motion or other functional loss?", levels: [{ value: 0, label: "No functional limitation", description: "Scar does not limit movement or function." }, { value: 10, label: "Mild limitation", description: "Scar causes mild tightness or pulling that slightly limits range of motion." }, { value: 20, label: "Moderate limitation", description: "Scar noticeably restricts movement of the affected body part." }, { value: 30, label: "Severe limitation", description: "Scar severely restricts movement." }] }] },
  burn_superficial: { label: "Superficial Scars (DC 7802)", note: "For burn scars or scars due to other causes, NOT of the head/face/neck, that are superficial and nonlinear. Rated by total area.", domains: [{ id: "area", label: "Total Area of Superficial Scars", description: "Combined area of all superficial nonlinear scars (not on head/face/neck)", levels: [{ value: 0, label: "Less than 144 sq inches (929 sq cm)", description: "Total area less than 144 square inches. Not compensable under DC 7802." }, { value: 10, label: "144+ sq inches (929+ sq cm)", description: "Area of 144 square inches (929 sq cm) or greater." }] }] },
}
const SKIN_CONDITION_PROFILE: Record<string, string> = {
  "Dermatitis or eczema": "dermatitis", "Psoriasis": "dermatitis", "Acne vulgaris": "dermatitis",
  "Chronic urticaria": "dermatitis", "Contact dermatitis": "dermatitis", "Seborrheic dermatitis": "dermatitis",
  "Pseudofolliculitis barbae": "dermatitis", "Folliculitis": "dermatitis", "Hidradenitis suppurativa": "dermatitis",
  "Alopecia areata": "dermatitis", "Vitiligo": "dermatitis", "Chloracne": "dermatitis",
  "Tinea pedis (athlete\u2019s foot)": "dermatitis", "Hyperhidrosis": "dermatitis",
  "Scar(s), unstable or painful": "scars", "Keloid scarring": "scars", "Burn scar(s)": "burn_deep",
  "Skin cancer (basal cell, squamous cell, melanoma)": "dermatitis",
}

const EPILEPSY_PROFILES: Record<string, EvalProfile> = { epilepsy: { label: "Seizure Disorder / Epilepsy (DC 8910-8914)", note: "Rated based on frequency of major (grand mal) and minor (petit mal) seizures.", domains: [{ id: "major", label: "Major Seizures (Grand Mal)", description: "Full-body convulsive seizure frequency over the past year", levels: [{ value: 0, label: "No major seizures", description: "No documented major seizures." }, { value: 20, label: "1 in last 2 years", description: "At least 1 major seizure in the last 2 years." }, { value: 40, label: "1 in last 6 months", description: "At least 1 major seizure in the last 6 months; or 2+ in last year." }, { value: 60, label: "1 every 3 months", description: "Averaging at least 1 major seizure every 3 months over the last year." }, { value: 80, label: "1 per month", description: "Averaging at least 1 major seizure per month over the last year." }, { value: 100, label: "1+ per week", description: "Averaging at least 1 major seizure per week over the last year." }] }, { id: "minor", label: "Minor Seizures (Petit Mal / Absence)", description: "Absence seizures, sudden muscle jerks, or other minor seizure activity", levels: [{ value: 0, label: "No minor seizures", description: "No documented minor seizures." }, { value: 10, label: "1-2 minor seizures in last 6 months", description: "A confirmed minor seizure within the last 6 months." }, { value: 20, label: "2+ minor seizures in last 6 months", description: "At least 2 minor seizures in the last 6 months." }, { value: 40, label: "5-8 minor seizures per week", description: "Averaging 5 to 8 minor seizures weekly." }, { value: 60, label: "More than 10 minor seizures per week", description: "Averaging more than 10 minor seizures weekly." }] }] } }
const EPILEPSY_CONDITION_PROFILE: Record<string, string> = { "Seizure disorder (epilepsy)": "epilepsy", "Epilepsy": "epilepsy" }

const LUPUS_PROFILES: Record<string, EvalProfile> = { lupus: { label: "Systemic Lupus Erythematosus (DC 6350)", note: "Rated based on exacerbation frequency and organ/system involvement.", domains: [{ id: "severity", label: "Disease Activity", description: "Frequency of exacerbations and extent of organ involvement", levels: [{ value: 10, label: "Exacerbations once or twice per year", description: "Exacerbations once or twice a year or symptomatic during the past 2 years." }, { value: 60, label: "Frequent exacerbations", description: "Exacerbations lasting a week or more, 2 to 3 times per year." }, { value: 100, label: "Acute with frequent crises", description: "Acute, with frequent exacerbations, producing severe impairment of health." }] }] } }
const LUPUS_CONDITION_PROFILE: Record<string, string> = { "Systemic lupus erythematosus (SLE)": "lupus" }

const RA_PROFILES: Record<string, EvalProfile> = { ra: { label: "Rheumatoid Arthritis (DC 5002)", note: "Rated as active process or chronic residuals, whichever is higher.", domains: [{ id: "active", label: "Active Disease Process", description: "Whole-body symptoms: weight loss, anemia, and overall impairment during active disease", levels: [{ value: 0, label: "No active disease", description: "Inactive or in remission." }, { value: 20, label: "1-2 flare-ups per year", description: "One or two flare-ups a year in a well-established diagnosis." }, { value: 40, label: "Symptom combinations that are disabling", description: "Symptom combinations causing definite impairment of health, or disabling flare-ups occurring 3 or more times a year." }, { value: 60, label: "Weight loss and anemia, severely disabling", description: "Weight loss and anemia causing severe impairment of health, or severely disabling flare-ups occurring 4 or more times a year." }, { value: 100, label: "Whole-body symptoms with total disability", description: "Whole-body symptoms associated with active joint involvement, totally disabling." }] }] } }
const RA_CONDITION_PROFILE: Record<string, string> = { "Rheumatoid arthritis": "ra" }

const HTN_PROFILES: Record<string, EvalProfile> = { htn: { label: "Hypertension (DC 7101)", note: "Rated based on blood pressure readings with or without medication.", domains: [{ id: "severity", label: "Blood Pressure Severity", description: "Based on diastolic and systolic blood pressure readings", levels: [{ value: 0, label: "Within normal limits on medication", description: "Blood pressure controlled to normal limits with medication." }, { value: 10, label: "Diastolic 100+ or systolic 160+", description: "Diastolic pressure predominantly 100 or more, or systolic pressure predominantly 160 or more; or minimum evaluation for history of diastolic 100+ requiring continuous medication." }, { value: 20, label: "Diastolic 110+ or systolic 200+", description: "Diastolic pressure predominantly 110 or more, or systolic pressure predominantly 200 or more." }, { value: 40, label: "Diastolic 120+", description: "Diastolic pressure predominantly 120 or more." }, { value: 60, label: "Diastolic 130+", description: "Diastolic pressure predominantly 130 or more." }] }] } }
const HTN_CONDITION_PROFILE: Record<string, string> = { "Hypertension": "htn" }

const RAYNAUDS_PROFILES: Record<string, EvalProfile> = { raynauds: { label: "Raynaud\u2019s Syndrome (DC 7117)", note: "Rated based on frequency of attacks and digital involvement.", domains: [{ id: "severity", label: "Attack Frequency & Severity", description: "Frequency of characteristic attacks and extent of digital involvement", levels: [{ value: 10, label: "1-3 attacks per week", description: "Characteristic attacks occurring one to three times a week." }, { value: 20, label: "4-6 attacks per week", description: "Characteristic attacks occurring four to six times a week." }, { value: 40, label: "Daily attacks", description: "Characteristic attacks occurring at least daily." }, { value: 60, label: "2+ digital ulcers, autoamputation", description: "Two or more digital ulcers and history of characteristic attacks, including autoamputation of one or more digits." }, { value: 100, label: "2+ digital ulcers plus autoamputation + critical ischemia", description: "Two or more digital ulcers plus autoamputation of one or more digits and history of characteristic attacks." }] }] } }
const RAYNAUDS_CONDITION_PROFILE: Record<string, string> = { "Raynaud\u2019s syndrome": "raynauds", "Raynaud\u2019s phenomenon": "raynauds" }

const GERD_PROFILES: Record<string, EvalProfile> = { gerd: { label: "GERD / Hiatal Hernia (DC 7346)", note: "Rated based on symptom severity, pain, and weight loss.", domains: [{ id: "severity", label: "Symptom Severity", description: "Frequency and severity of reflux symptoms", levels: [{ value: 10, label: "Two or more symptoms of less severity", description: "Two or more of the symptoms for the 30 percent evaluation of less severity." }, { value: 30, label: "Persistently recurrent symptoms with chest pain, difficulty swallowing, heartburn, regurgitation", description: "Persistently recurrent stomach/chest distress with difficulty swallowing, heartburn, and regurgitation, accompanied by pain, causing considerable impairment of health." }, { value: 60, label: "Pain, vomiting, significant weight loss, bleeding with anemia", description: "Symptoms of pain, vomiting, significant weight loss and vomiting blood or black/bloody stool with moderate anemia; or other symptom combinations causing severe impairment of health." }] }] } }
const GERD_CONDITION_PROFILE: Record<string, string> = { "GERD / acid reflux": "gerd", "Hiatal hernia": "gerd" }

const ED_PROFILES: Record<string, EvalProfile> = { ed: { label: "Erectile Dysfunction (DC 7522)", note: "ED itself is typically rated 0% but qualifies for Special Monthly Compensation (SMC-K) for loss of use of a creative organ.", domains: [{ id: "severity", label: "Severity of Dysfunction", description: "Degree of erectile dysfunction or loss of creative organ", levels: [{ value: 0, label: "Erectile dysfunction present", description: "Loss of erectile power; rated 0% but eligible for Special Monthly Compensation (SMC-K) (~$120/month additional)." }, { value: 20, label: "Penile deformity with loss of erectile power", description: "Deformity of the penis with loss of erectile power." }, { value: 30, label: "Removal of half or more of penis", description: "Removal of half or more of the penis." }] }, { id: "organ", label: "Loss of Creative Organ", description: "Loss or removal of a creative organ (testicle, ovary)", levels: [{ value: 0, label: "No loss of creative organ", description: "No loss or removal of a creative organ." }, { value: 0, label: "Loss of use (SMC-K eligible)", description: "Loss of use of a creative organ qualifies for Special Monthly Compensation (SMC-K)." }, { value: 20, label: "Removal of one testicle", description: "Removal of one testicle." }, { value: 30, label: "Removal of both testicles / complete loss", description: "Removal of both testicles, or complete shrinkage/wasting (atrophy)." }] }] } }
const ED_CONDITION_PROFILE: Record<string, string> = { "Erectile dysfunction": "ed", "Loss of use of creative organ": "ed" }

const PARKINSONS_PROFILES: Record<string, EvalProfile> = { parkinsons: { label: "Parkinson\u2019s Disease (DC 8004)", note: "Minimum rating of 30%. Rated based on severity of motor and non-motor symptoms.", domains: [{ id: "severity", label: "Disease Severity", description: "Overall functional impairment from Parkinson\u2019s symptoms", levels: [{ value: 30, label: "Minimum rating", description: "Minimum rating for Parkinson\u2019s disease. Mild symptoms: slight tremor, minor rigidity, minimal impact on daily activities." }, { value: 60, label: "Moderately severe", description: "Moderate symptoms: significant tremor and/or rigidity, slowness of movement (bradykinesia), balance problems, noticeable impact on daily activities and employment." }, { value: 100, label: "Complete disability", description: "Severe symptoms: pronounced tremor, severe rigidity, significant balance problems, unable to perform most daily activities independently." }] }] } }
const PARKINSONS_CONDITION_PROFILE: Record<string, string> = { "Parkinson\u2019s disease": "parkinsons" }

const MS_PROFILES: Record<string, EvalProfile> = { ms: { label: "Multiple Sclerosis (DC 8018)", note: "Minimum rating of 30%. May also be rated on individual residuals if higher.", domains: [{ id: "severity", label: "Disease Severity", description: "Overall functional impairment from MS symptoms", levels: [{ value: 30, label: "Minimum rating", description: "Minimum rating for MS. Mild symptoms: fatigue, occasional numbness/tingling, minor balance issues." }, { value: 60, label: "Moderately severe", description: "Moderate symptoms: significant fatigue, muscle weakness, coordination problems, bladder dysfunction, cognitive fog impacting work." }, { value: 100, label: "Complete disability", description: "Severe symptoms: pronounced disability requiring assistance, severe mobility impairment, significant cognitive decline." }] }] } }
const MS_CONDITION_PROFILE: Record<string, string> = { "Multiple sclerosis": "ms" }

const MG_PROFILES: Record<string, EvalProfile> = { mg: { label: "Myasthenia Gravis (DC 8025)", note: "Minimum rating of 30%. Rated on severity of muscular weakness and fatigue.", domains: [{ id: "severity", label: "Disease Severity", description: "Degree of muscular weakness and functional impairment", levels: [{ value: 30, label: "Minimum rating", description: "Minimum rating for myasthenia gravis. Mild weakness: intermittent drooping eyelid (ptosis), mild double vision, fatigable muscles." }, { value: 60, label: "Moderately severe", description: "Moderate muscular weakness: difficulty chewing/swallowing, limb weakness, respiratory muscle involvement." }, { value: 100, label: "Severe / crisis-prone", description: "Severe weakness: myasthenic crises, significant respiratory compromise, inability to perform daily activities." }] }] } }
const MG_CONDITION_PROFILE: Record<string, string> = { "Myasthenia gravis": "mg" }

const GBS_PROFILES: Record<string, EvalProfile> = { gbs: { label: "Guillain-Barr\u00e9 Syndrome", note: "Rated by analogy based on residual nerve damage and functional impairment.", domains: [{ id: "severity", label: "Residual Severity", description: "Degree of residual weakness and nerve damage after acute phase", levels: [{ value: 10, label: "Mild residuals", description: "Mild residual weakness or numbness; mostly recovered; minor functional impact." }, { value: 30, label: "Moderate residuals", description: "Moderate residual weakness in extremities; balance problems; fatigue; noticeable impact on daily activities." }, { value: 60, label: "Severe residuals", description: "Significant residual paralysis or weakness; requires assistive devices; substantial functional impairment." }, { value: 100, label: "Complete or near-complete paralysis", description: "Severe residual paralysis; wheelchair-bound or bedridden; requires assistance for daily activities." }] }] } }
const GBS_CONDITION_PROFILE: Record<string, string> = { "Guillain-Barr\u00e9 syndrome": "gbs" }

// ── SYSTEMIC MASTER REGISTRY ────────────────────────────────────────────────

export const SYSTEMIC_PROFILES_ALL: Record<string, EvalProfile> = {
  ...FIBRO_PROFILES, ...CFS_PROFILES, ...DIABETES_PROFILES,
  ...HYPOTHYROID_PROFILES, ...HYPERTHYROID_PROFILES, ...SKIN_PROFILES,
  ...EPILEPSY_PROFILES, ...LUPUS_PROFILES, ...RA_PROFILES,
  ...HTN_PROFILES, ...RAYNAUDS_PROFILES, ...GERD_PROFILES,
  ...ED_PROFILES, ...PARKINSONS_PROFILES, ...MS_PROFILES,
  ...MG_PROFILES, ...GBS_PROFILES,
  generic: PHYSICAL_PROFILE,
}

const SYSTEMIC_CONDITION_PROFILE: Record<string, string> = {
  ...FIBRO_CONDITION_PROFILE, ...CFS_CONDITION_PROFILE, ...DIABETES_CONDITION_PROFILE,
  ...HYPOTHYROID_CONDITION_PROFILE, ...HYPERTHYROID_CONDITION_PROFILE, ...SKIN_CONDITION_PROFILE,
  ...EPILEPSY_CONDITION_PROFILE, ...LUPUS_CONDITION_PROFILE, ...RA_CONDITION_PROFILE,
  ...HTN_CONDITION_PROFILE, ...RAYNAUDS_CONDITION_PROFILE, ...GERD_CONDITION_PROFILE,
  ...ED_CONDITION_PROFILE, ...PARKINSONS_CONDITION_PROFILE, ...MS_CONDITION_PROFILE,
  ...MG_CONDITION_PROFILE, ...GBS_CONDITION_PROFILE,
}

export function getSystemicProfileKey(name: string): string { return SYSTEMIC_CONDITION_PROFILE[name] || "generic" }
export function getSystemicProfile(name: string): EvalProfile { return SYSTEMIC_PROFILES_ALL[getSystemicProfileKey(name)] }

// ── KNEE PROFILES ───────────────────────────────────────────────────────────

export const KNEE_PROFILES: Record<string, EvalProfile> = {
  rom: { label: "Range of Motion \u2014 How Far It Moves (DC 5260/5261)", domains: [
    { id: "flexion", label: "Bending (Flexion) \u2014 DC 5260", description: "How far can the knee bend? Normal is 140+ degrees.", levels: [{ value: 0, label: "Normal (140\u00b0+)", description: "Full bending (flexion), no limitation." }, { value: 10, label: "Limited to 45\u00b0", description: "Bending (flexion) limited to 45 degrees." }, { value: 20, label: "Limited to 30\u00b0", description: "Bending (flexion) limited to 30 degrees." }, { value: 30, label: "Limited to 15\u00b0", description: "Bending (flexion) limited to 15 degrees or less." }] },
    { id: "extension", label: "Straightening (Extension) \u2014 DC 5261", description: "How far can the knee straighten? Normal is 0 degrees (fully straight).", levels: [{ value: 0, label: "Normal (0\u00b0)", description: "Full straightening (extension), no limitation." }, { value: 10, label: "Limited to 10\u00b0", description: "Straightening (extension) limited to 10 degrees." }, { value: 20, label: "Limited to 15\u00b0", description: "Straightening (extension) limited to 15 degrees." }, { value: 30, label: "Limited to 20\u00b0", description: "Straightening (extension) limited to 20 degrees." }, { value: 40, label: "Limited to 30\u00b0", description: "Straightening (extension) limited to 30 degrees." }, { value: 50, label: "Limited to 45\u00b0+", description: "Straightening (extension) limited to 45 degrees or more." }] },
  ]},
  instability: { label: "Instability / Partial Dislocation (DC 5257)", domains: [{ id: "instability", label: "Recurrent Partial Dislocation or Lateral Instability", description: "Severity of knee giving way, lateral instability, or recurrent partial dislocation (subluxation).", levels: [{ value: 0, label: "None", description: "No instability or partial dislocation." }, { value: 10, label: "Slight", description: "Slight recurrent partial dislocation (subluxation) or slight lateral instability." }, { value: 20, label: "Moderate", description: "Moderate recurrent partial dislocation (subluxation) or moderate lateral instability." }, { value: 30, label: "Severe", description: "Severe recurrent partial dislocation (subluxation) or severe lateral instability." }] }] },
  meniscus: { label: "Meniscus / Cartilage (DC 5258/5259)", domains: [{ id: "meniscus", label: "Semilunar Cartilage Condition", description: "Meniscus (cartilage) damage, locking, or surgical removal.", levels: [{ value: 0, label: "Asymptomatic", description: "No symptoms or asymptomatic residuals following removal." }, { value: 10, label: "Dislocated with locking", description: "Dislocated semilunar cartilage with frequent episodes of locking, pain, and swelling from fluid in the joint (effusion)." }, { value: 20, label: "Symptomatic after removal", description: "Symptomatic residuals following semilunar cartilage removal." }] }] },
  replacement: { label: "Knee Replacement (DC 5055)", domains: [{ id: "replacement", label: "Prosthetic Knee Status", description: "Current status after total or partial knee replacement surgery.", levels: [{ value: 30, label: "Intermediate residuals", description: "Chronic residuals consisting of moderate painful motion or weakness in the knee." }, { value: 60, label: "Chronic residuals", description: "Chronic residuals: severe painful motion or weakness requiring assistive devices." }, { value: 100, label: "Within 13 months of surgery", description: "100% rating for 13 months following prosthetic replacement of knee joint." }] }] },
  arthritis: { label: "Degenerative Arthritis (DC 5003)", domains: [{ id: "arthritis", label: "Arthritis Severity", description: "Degenerative arthritis confirmed by X-ray with limitation of motion.", levels: [{ value: 0, label: "X-ray only, no limitation", description: "X-ray evidence of arthritis without painful or limited motion." }, { value: 10, label: "Painful motion / minor limitation", description: "X-ray evidence with painful motion or some limitation of motion." }, { value: 20, label: "Significant limitation", description: "X-ray evidence with more significant limitation of motion in the joint." }] }] },
  generic: { label: "General Knee Assessment", domains: [{ id: "severity", label: "Overall Knee Condition Severity", description: "General functional impact of this knee condition.", levels: [{ value: 0, label: "Asymptomatic", description: "Condition present but no functional limitation." }, { value: 10, label: "Mild", description: "Mild symptoms with slight functional limitation." }, { value: 20, label: "Moderate", description: "Moderate symptoms with noticeable limitation." }, { value: 30, label: "Moderately severe", description: "Significant symptoms affecting daily activities." }, { value: 50, label: "Severe", description: "Severe symptoms substantially limiting function." }] }] },
}
const KNEE_CONDITION_PROFILE: Record<string, string> = { "Knee osteoarthritis": "arthritis", "ACL tear / reconstruction": "instability", "Meniscus tear": "meniscus", "Patellar tendinitis": "rom", "Patellofemoral syndrome": "rom", "MCL / LCL sprain": "instability", "Knee bursitis": "generic", "Knee instability": "instability", "Knee replacement (total)": "replacement", "Baker\u2019s cyst": "generic", "Chondromalacia patella": "rom" }
export function getKneeProfileKey(name: string): string { return KNEE_CONDITION_PROFILE[name] || "generic" }
export function getKneeProfile(name: string): EvalProfile { return KNEE_PROFILES[getKneeProfileKey(name)] }

// ── SPINE PROFILES ──────────────────────────────────────────────────────────

export const SPINE_PROFILES: Record<string, EvalProfile> = {
  thoracolumbar: { label: "Thoracolumbar Spine Range of Motion (General Rating Formula)", domains: [
    { id: "forward_flexion", label: "Forward Bending (Flexion)", description: "How far can you bend forward? Normal is 90 degrees.", levels: [{ value: 0, label: "Normal (90\u00b0)", description: "Full forward bending (flexion), no limitation." }, { value: 10, label: "Greater than 60\u00b0 but \u226485\u00b0", description: "Forward bending greater than 60\u00b0 but not greater than 85\u00b0; or combined range of motion >120\u00b0 but \u2264235\u00b0." }, { value: 20, label: "Greater than 30\u00b0 but \u226460\u00b0", description: "Forward bending greater than 30\u00b0 but not greater than 60\u00b0; or combined range of motion \u2264120\u00b0; or muscle spasm/guarding causing abnormal gait or contour." }, { value: 40, label: "30\u00b0 or less", description: "Forward bending 30\u00b0 or less; or the spine is frozen/locked in a favorable position (favorable ankylosis)." }, { value: 50, label: "Spine frozen in unfavorable position", description: "The entire thoracolumbar spine is frozen/locked in an unfavorable position (unfavorable ankylosis)." }, { value: 100, label: "Entire spine frozen", description: "The entire spine is frozen/locked in an unfavorable position (unfavorable ankylosis of the entire spine)." }] },
    { id: "pain", label: "Painful Motion / Spasm", description: "Presence of painful motion, muscle spasm, or guarding.", levels: [{ value: 0, label: "None", description: "No painful motion, spasm, or guarding." }, { value: 10, label: "Painful motion / tenderness", description: "Painful motion; or muscle spasm, guarding, or localized tenderness not resulting in abnormal gait." }, { value: 20, label: "Spasm causing abnormal gait", description: "Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour." }] },
    { id: "radiculopathy", label: "Nerve Pain / Numbness Traveling Down the Leg (Radiculopathy / Sciatica \u2014 DC 8520)", description: "Nerve root involvement \u2014 numbness, tingling, pain, or weakness radiating into the legs", levels: [{ value: 0, label: "None", description: "No nerve pain/numbness traveling down the leg (radiculopathy) or nerve involvement." }, { value: 10, label: "Mild", description: "Mild incomplete paralysis \u2014 intermittent numbness or tingling in the leg/foot." }, { value: 20, label: "Moderate", description: "Moderate incomplete paralysis \u2014 frequent numbness, pain radiating below the knee, mild foot weakness." }, { value: 40, label: "Moderately Severe", description: "Moderately severe incomplete paralysis \u2014 significant pain, noticeable muscle weakness, difficulty with toe/heel walking." }, { value: 60, label: "Severe", description: "Severe incomplete paralysis \u2014 marked muscle shrinkage/wasting (atrophy), foot drop, or significant loss of function." }, { value: 80, label: "Complete", description: "Complete paralysis \u2014 foot dangles and drops, no active movement possible below the knee." }] },
  ]},
  cervical: { label: "Cervical Spine Range of Motion (General Rating Formula)", domains: [
    { id: "forward_flexion", label: "Forward Bending (Flexion)", description: "How far can you bend your neck forward? Normal is 45 degrees.", levels: [{ value: 0, label: "Normal (45\u00b0)", description: "Full cervical forward bending (flexion), no limitation." }, { value: 10, label: "Greater than 30\u00b0 but \u226440\u00b0", description: "Forward bending greater than 30\u00b0 but not greater than 40\u00b0; or combined range of motion >170\u00b0 but \u2264335\u00b0." }, { value: 20, label: "Greater than 15\u00b0 but \u226430\u00b0", description: "Forward bending greater than 15\u00b0 but not greater than 30\u00b0; or combined range of motion \u2264170\u00b0; or muscle spasm/guarding causing abnormal gait." }, { value: 30, label: "15\u00b0 or less", description: "Forward bending 15\u00b0 or less; or the entire cervical spine is frozen/locked in a favorable position." }, { value: 40, label: "Neck frozen in unfavorable position", description: "The entire cervical spine is frozen/locked in an unfavorable position (unfavorable ankylosis)." }, { value: 100, label: "Entire spine frozen", description: "The entire spine is frozen/locked in an unfavorable position." }] },
    { id: "pain", label: "Painful Motion / Spasm", description: "Presence of painful motion, muscle spasm, or guarding.", levels: [{ value: 0, label: "None", description: "No painful motion, spasm, or guarding." }, { value: 10, label: "Painful motion / tenderness", description: "Painful motion; or muscle spasm, guarding, or localized tenderness." }, { value: 20, label: "Spasm causing abnormal gait", description: "Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour." }] },
  ]},
  ivds: { label: "Intervertebral Disc Syndrome (DC 5243)", note: "Rate based on flare-ups bad enough to keep you in bed, as prescribed by a physician.", domains: [{ id: "episodes", label: "Flare-Ups Bad Enough to Keep You in Bed (past 12 months)", description: "Total duration of flare-ups requiring bed rest prescribed by a physician during past 12 months.", levels: [{ value: 0, label: "None", description: "No flare-ups requiring bed rest in past 12 months." }, { value: 10, label: "1-2 weeks total", description: "At least 1 week but less than 2 weeks total duration." }, { value: 20, label: "2-4 weeks total", description: "At least 2 weeks but less than 4 weeks total duration." }, { value: 40, label: "4-6 weeks total", description: "At least 4 weeks but less than 6 weeks total duration." }, { value: 60, label: "6+ weeks total", description: "At least 6 weeks total duration." }] }] },
  generic: { label: "General Spine Assessment", domains: [{ id: "severity", label: "Overall Spine Condition Severity", description: "General functional impact of this spine/back condition.", levels: [{ value: 0, label: "Asymptomatic", description: "Condition present but no functional limitation." }, { value: 10, label: "Mild", description: "Mild symptoms with slight functional limitation." }, { value: 20, label: "Moderate", description: "Moderate symptoms with noticeable limitation." }, { value: 30, label: "Moderately severe", description: "Significant symptoms affecting daily activities." }, { value: 50, label: "Severe", description: "Severe symptoms substantially limiting function." }] }] },
}
const SPINE_CONDITION_PROFILE: Record<string, string> = { "Lumbar strain / sprain": "thoracolumbar", "Lumbar disc herniation": "thoracolumbar", "Lumbar radiculopathy / sciatica": "thoracolumbar", "Degenerative disc disease (lumbar)": "thoracolumbar", "Spinal stenosis (lumbar)": "thoracolumbar", "Thoracic strain": "thoracolumbar", "Compression fracture": "thoracolumbar", "Sacroiliac joint dysfunction": "thoracolumbar", "Ankylosing spondylitis": "thoracolumbar", "Intervertebral disc syndrome (IVDS)": "ivds", "Scoliosis": "thoracolumbar" }
export function getSpineProfileKey(name: string): string { return SPINE_CONDITION_PROFILE[name] || "generic" }
export function getSpineProfile(name: string): EvalProfile { return SPINE_PROFILES[getSpineProfileKey(name)] }

// ── SHOULDER PROFILES ───────────────────────────────────────────────────────

export const SHOULDER_PROFILES: Record<string, EvalProfile> = {
  rom: { label: "Limitation of Motion (DC 5201)", domains: [{ id: "motion", label: "Arm Motion at Shoulder", description: "How far can you raise your arm? Rated by limitation of motion.", levels: [{ value: 0, label: "Normal (full overhead)", description: "Full range of motion, no limitation." }, { value: 10, label: "Mildly limited", description: "Overhead reach slightly limited but functional above shoulder level." }, { value: 20, label: "At shoulder level", description: "Motion limited to shoulder level (90\u00b0)." }, { value: 30, label: "Midway (side to shoulder)", description: "Motion limited to midway between side and shoulder level (~45\u00b0)." }, { value: 40, label: "To 25\u00b0 from side", description: "Motion limited to 25\u00b0 from side. Significant functional loss." }] }] },
  instability: { label: "Instability / Dislocation (DC 5202)", domains: [{ id: "instability", label: "Recurrent Dislocation or Impairment", description: "Humerus impairment: recurrent dislocation, malunion, or nonunion.", levels: [{ value: 0, label: "None", description: "No instability, dislocation, or impairment." }, { value: 20, label: "Infrequent dislocation or moderate deformity", description: "Recurrent dislocation with infrequent episodes and guarding only at shoulder level; or malunion of humerus with moderate deformity." }, { value: 30, label: "Frequent dislocation or marked deformity", description: "Recurrent dislocation with frequent episodes and guarding of all arm movements; or malunion of humerus with marked deformity." }, { value: 50, label: "Fibrous union", description: "Fibrous union of the humerus." }, { value: 60, label: "Nonunion (false flail)", description: "Nonunion of the humerus (false flail joint)." }, { value: 80, label: "Loss of head (flail)", description: "Loss of head of the humerus (flail shoulder)." }] }] },
  clavicle: { label: "Clavicle / Scapula (DC 5203)", domains: [{ id: "clavicle", label: "Clavicle or Scapula Impairment", description: "Impairment of the clavicle or scapula.", levels: [{ value: 0, label: "None / Malunion only", description: "No impairment or malunion of clavicle/scapula." }, { value: 10, label: "Nonunion without loose movement", description: "Nonunion of clavicle or scapula without loose movement." }, { value: 20, label: "Nonunion with loose movement / Dislocation", description: "Nonunion with loose movement; or dislocation of clavicle or scapula." }] }] },
  generic: { label: "General Shoulder Assessment", domains: [{ id: "severity", label: "Overall Shoulder Condition Severity", description: "General functional impact of this shoulder condition.", levels: [{ value: 0, label: "Asymptomatic", description: "No functional limitation." }, { value: 10, label: "Mild", description: "Mild symptoms with slight limitation." }, { value: 20, label: "Moderate", description: "Moderate symptoms with noticeable limitation." }, { value: 30, label: "Moderately severe", description: "Significant symptoms affecting daily activities." }, { value: 50, label: "Severe", description: "Severe symptoms substantially limiting function." }] }] },
}
const SHOULDER_CONDITION_PROFILE: Record<string, string> = { "Rotator cuff tear / tendinopathy": "rom", "Shoulder impingement": "rom", "Shoulder instability / dislocation": "instability", "Labral tear (SLAP)": "rom", "Frozen shoulder (adhesive capsulitis)": "rom", "AC joint separation": "clavicle", "Shoulder arthritis": "rom", "Shoulder bursitis": "generic", "Shoulder fracture": "instability" }
export function getShoulderProfileKey(name: string): string { return SHOULDER_CONDITION_PROFILE[name] || "generic" }
export function getShoulderProfile(name: string): EvalProfile { return SHOULDER_PROFILES[getShoulderProfileKey(name)] }

// ── NECK PROFILES ───────────────────────────────────────────────────────────

export const NECK_PROFILES: Record<string, EvalProfile> = {
  cervical: { label: "Cervical Spine (DC 5237-5243)", note: "Rated using the General Rating Formula for Diseases and Injuries of the Spine \u2014 cervical segment.", domains: [
    { id: "rom", label: "Range of Motion (How Far It Moves)", description: "Forward bending and combined range of motion of the cervical spine", levels: [{ value: 0, label: "Normal", description: "Forward bending (flexion) greater than 40\u00b0, combined range of motion greater than 335\u00b0." }, { value: 10, label: "Mild", description: "Forward bending greater than 30\u00b0 but not greater than 40\u00b0, or combined range of motion greater than 170\u00b0 but not greater than 335\u00b0." }, { value: 20, label: "Moderate", description: "Forward bending greater than 15\u00b0 but not greater than 30\u00b0, or combined range of motion not greater than 170\u00b0." }, { value: 30, label: "Severe", description: "Forward bending 15\u00b0 or less, or the entire cervical spine is frozen/locked in a favorable position." }, { value: 40, label: "Very Severe", description: "The entire cervical spine is frozen/locked in an unfavorable position." }, { value: 100, label: "Total", description: "The entire spine is frozen/locked in an unfavorable position." }] },
    { id: "pain", label: "Pain / Functional Loss", description: "Pain on movement, guarding, muscle spasm, abnormal gait", levels: [{ value: 0, label: "None", description: "No additional functional loss due to pain." }, { value: 10, label: "Mild", description: "Painful motion without significant functional loss." }, { value: 20, label: "Moderate", description: "Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour." }] },
    { id: "radiculopathy", label: "Nerve Pain / Numbness Traveling Down the Arm (Radiculopathy)", description: "Nerve root involvement \u2014 numbness, tingling, weakness in arms", levels: [{ value: 0, label: "None", description: "No nerve pain/numbness traveling down the arm." }, { value: 20, label: "Mild", description: "Mild incomplete paralysis of affected nerve group." }, { value: 30, label: "Moderate", description: "Moderate incomplete paralysis." }, { value: 40, label: "Moderately Severe", description: "Moderately severe incomplete paralysis." }, { value: 50, label: "Severe", description: "Severe incomplete paralysis with marked muscle shrinkage/wasting." }, { value: 70, label: "Complete", description: "Complete paralysis of affected nerve group." }] },
  ]},
  generic: { label: "Neck \u2014 General", note: "General neck condition evaluation.", domains: [{ id: "severity", label: "Overall Severity", description: "General severity of the neck condition", levels: [{ value: 0, label: "None", description: "No significant impairment." }, { value: 10, label: "Mild", description: "Mild impairment with occasional symptoms." }, { value: 20, label: "Moderate", description: "Moderate impairment affecting daily activities." }, { value: 30, label: "Severe", description: "Severe impairment with significant limitation." }, { value: 50, label: "Very Severe", description: "Very severe impairment, near-constant symptoms." }] }] },
}
const NECK_CONDITION_PROFILE: Record<string, string> = { "cervical strain": "cervical", "cervical sprain": "cervical", "cervical degenerative disc disease": "cervical", "cervical radiculopathy": "cervical", "cervical stenosis": "cervical", "herniated disc (cervical)": "cervical", "cervical spondylosis": "cervical", "neck pain (cervicalgia)": "cervical", "whiplash injury": "cervical" }
export function getNeckProfileKey(name: string): string { return NECK_CONDITION_PROFILE[name.toLowerCase()] || "cervical" }
export function getNeckProfile(name: string): EvalProfile { return NECK_PROFILES[getNeckProfileKey(name)] }

// ── HIP PROFILES ────────────────────────────────────────────────────────────

export const HIP_PROFILES: Record<string, EvalProfile> = {
  rom: { label: "Hip Range of Motion (DC 5252/5253)", note: "Rated based on limitation of flexion and extension of the thigh.", domains: [
    { id: "flexion", label: "Limitation of Bending (Flexion)", description: "Limitation of bending (flexion) of the thigh (DC 5252)", levels: [{ value: 0, label: "Normal", description: "Bending (flexion) greater than 45\u00b0." }, { value: 10, label: "Mild", description: "Bending (flexion) limited to 45\u00b0." }, { value: 20, label: "Moderate", description: "Bending (flexion) limited to 30\u00b0." }, { value: 30, label: "Severe", description: "Bending (flexion) limited to 20\u00b0." }, { value: 40, label: "Very Severe", description: "Bending (flexion) limited to 10\u00b0." }] },
    { id: "extension", label: "Limitation of Straightening (Extension)", description: "Limitation of straightening (extension) of the thigh (DC 5251)", levels: [{ value: 0, label: "Normal", description: "Straightening (extension) not limited to 5\u00b0." }, { value: 10, label: "Mild", description: "Straightening (extension) limited to 5\u00b0." }] },
    { id: "abduction", label: "Limitation of Spreading/Moving Outward (Abduction)", description: "Limitation of abduction, adduction, or rotation (DC 5253)", levels: [{ value: 0, label: "Normal", description: "Can cross legs, no motion lost beyond 10\u00b0." }, { value: 10, label: "Mild", description: "Cannot cross legs or cannot toe-out more than 15\u00b0." }, { value: 20, label: "Moderate", description: "Motion lost beyond 10\u00b0." }] },
  ]},
  replacement: { label: "Hip Replacement (DC 5054)", note: "Following prosthetic replacement. Minimum 30% rating following implantation. 100% for 1 year following.", domains: [{ id: "status", label: "Replacement Status", description: "Current functional status after hip replacement", levels: [{ value: 30, label: "Minimum", description: "Prosthetic replacement with no significant residuals." }, { value: 50, label: "Moderate", description: "Moderately severe residuals of weakness, pain, or limitation of motion." }, { value: 70, label: "Severe", description: "Markedly severe residual weakness, pain, or limitation of motion." }, { value: 90, label: "Very Severe", description: "Painful motion or weakness requiring assistive devices." }, { value: 100, label: "1-Year Post-Op", description: "For 1 year following implantation of prosthesis." }] }] },
  generic: { label: "Hip \u2014 General", note: "General hip condition evaluation.", domains: [{ id: "severity", label: "Overall Severity", description: "General severity of the hip condition", levels: [{ value: 0, label: "None", description: "No significant impairment." }, { value: 10, label: "Mild", description: "Mild impairment with occasional symptoms." }, { value: 20, label: "Moderate", description: "Moderate impairment affecting daily activities." }, { value: 30, label: "Severe", description: "Severe impairment with significant limitation." }, { value: 50, label: "Very Severe", description: "Very severe impairment." }] }] },
}
const HIP_CONDITION_PROFILE: Record<string, string> = { "hip osteoarthritis": "rom", "degenerative joint disease - hip": "rom", "hip labral tear": "rom", "hip bursitis (trochanteric)": "rom", "hip impingement (femoroacetabular)": "rom", "avascular necrosis (hip)": "rom", "hip fracture residuals": "rom", "total hip replacement": "replacement", "hip replacement": "replacement" }
export function getHipProfileKey(name: string): string { return HIP_CONDITION_PROFILE[name.toLowerCase()] || "rom" }
export function getHipProfile(name: string): EvalProfile { return HIP_PROFILES[getHipProfileKey(name)] }

// ── ELBOW PROFILES ──────────────────────────────────────────────────────────

export const ELBOW_PROFILES: Record<string, EvalProfile> = {
  rom: { label: "Elbow Range of Motion (DC 5206/5207)", note: "Rated based on limitation of flexion and extension of the forearm.", domains: [
    { id: "flexion", label: "Limitation of Bending (Flexion)", description: "Limitation of bending (flexion) of the forearm (DC 5206)", levels: [{ value: 0, label: "Normal", description: "Bending (flexion) greater than 100\u00b0." }, { value: 10, label: "Mild", description: "Bending (flexion) limited to 100\u00b0." }, { value: 20, label: "Moderate", description: "Bending (flexion) limited to 90\u00b0." }, { value: 30, label: "Severe", description: "Bending (flexion) limited to 70\u00b0." }, { value: 40, label: "Very Severe", description: "Bending (flexion) limited to 55\u00b0." }, { value: 50, label: "Extreme", description: "Bending (flexion) limited to 45\u00b0." }] },
    { id: "extension", label: "Limitation of Straightening (Extension)", description: "Limitation of straightening (extension) of the forearm (DC 5207)", levels: [{ value: 0, label: "Normal", description: "Straightening (extension) not limited." }, { value: 10, label: "Mild", description: "Straightening (extension) limited to 45\u00b0 or 60\u00b0." }, { value: 20, label: "Moderate", description: "Straightening (extension) limited to 75\u00b0." }, { value: 30, label: "Severe", description: "Straightening (extension) limited to 90\u00b0." }, { value: 40, label: "Very Severe", description: "Straightening (extension) limited to 100\u00b0." }, { value: 50, label: "Extreme", description: "Straightening (extension) limited to 110\u00b0." }] },
    { id: "pronation", label: "Rotating Palm Down/Up (Pronation/Supination)", description: "Limitation of rotation (DC 5213)", levels: [{ value: 0, label: "Normal", description: "No limitation." }, { value: 10, label: "Mild", description: "Rotating palm up (supination) limited to 30\u00b0 or less." }, { value: 20, label: "Moderate", description: "Rotating palm down (pronation) limited beyond last quarter of arc; hand does not approach full rotation." }, { value: 30, label: "Severe", description: "Rotating palm down (pronation) lost beyond middle of arc." }] },
  ]},
  generic: { label: "Elbow \u2014 General", note: "General elbow/forearm condition evaluation.", domains: [{ id: "severity", label: "Overall Severity", description: "General severity of the elbow condition", levels: [{ value: 0, label: "None", description: "No significant impairment." }, { value: 10, label: "Mild", description: "Mild impairment." }, { value: 20, label: "Moderate", description: "Moderate impairment." }, { value: 30, label: "Severe", description: "Severe impairment." }, { value: 50, label: "Very Severe", description: "Very severe impairment." }] }] },
}
const ELBOW_CONDITION_PROFILE: Record<string, string> = { "tennis elbow (lateral epicondylitis)": "rom", "golfer's elbow (medial epicondylitis)": "rom", "cubital tunnel syndrome": "rom", "elbow bursitis (olecranon)": "rom", "limited rom - elbow": "rom", "elbow instability": "rom", "elbow fracture residuals": "rom", "elbow arthritis": "rom", "radial head fracture": "rom" }
export function getElbowProfileKey(name: string): string { return ELBOW_CONDITION_PROFILE[name.toLowerCase()] || "rom" }
export function getElbowProfile(name: string): EvalProfile { return ELBOW_PROFILES[getElbowProfileKey(name)] }

// ── WRIST / HAND PROFILES ───────────────────────────────────────────────────

export const WRIST_PROFILES: Record<string, EvalProfile> = {
  rom: { label: "Wrist Range of Motion (DC 5215)", note: "Rated based on limitation of motion of the wrist.", domains: [
    { id: "dorsiflexion", label: "Bending Wrist Back (Dorsiflexion)", description: "Limitation of dorsiflexion/extension of the wrist (DC 5215)", levels: [{ value: 0, label: "Normal", description: "Wrist bends back (dorsiflexion) greater than 15\u00b0." }, { value: 10, label: "Mild", description: "Wrist bends back (dorsiflexion) less than 15\u00b0." }] },
    { id: "palmarflexion", label: "Bending Wrist Forward (Palmar Flexion)", description: "Limitation of palmar flexion", levels: [{ value: 0, label: "Normal", description: "Bending wrist forward (palmar flexion) not limited in line with forearm." }, { value: 10, label: "Mild", description: "Bending wrist forward (palmar flexion) limited in line with forearm." }] },
    { id: "ankylosis", label: "Wrist Frozen/Locked (Ankylosis)", description: "Ankylosis of the wrist (DC 5214)", levels: [{ value: 0, label: "None", description: "Wrist is not frozen/locked (no ankylosis)." }, { value: 20, label: "Favorable", description: "Wrist frozen/locked in 20\u00b0 to 30\u00b0 bent-back position (minor)." }, { value: 30, label: "Any Other", description: "Wrist frozen/locked in any other position except favorable (minor)." }, { value: 40, label: "Unfavorable", description: "Wrist frozen/locked in an unfavorable position in any degree of forward bend, or with side-to-side deviation (minor)." }] },
  ]},
  carpal: { label: "Carpal Tunnel (DC 8515)", note: "Median nerve impairment rated under DC 8515.", domains: [{ id: "nerve", label: "Median Nerve Impairment", description: "Severity of median nerve (carpal tunnel) paralysis", levels: [{ value: 0, label: "Normal", description: "No impairment." }, { value: 10, label: "Mild", description: "Mild incomplete paralysis (minor hand)." }, { value: 20, label: "Moderate", description: "Moderate incomplete paralysis." }, { value: 40, label: "Severe", description: "Severe incomplete paralysis." }, { value: 60, label: "Complete", description: "Complete paralysis \u2014 hand inclined to ulnar side, can\u2019t make a fist." }] }] },
  finger: { label: "Finger/Hand (DC 5216-5230)", note: "Individual finger ankylosis or limitation.", domains: [{ id: "severity", label: "Finger/Hand Severity", description: "Overall severity of finger or hand impairment", levels: [{ value: 0, label: "None", description: "No significant impairment." }, { value: 10, label: "Mild", description: "Mild limitation of one or more fingers." }, { value: 20, label: "Moderate", description: "Moderate limitation, one finger ankylosis." }, { value: 30, label: "Severe", description: "Multiple fingers ankylosis or significant grip loss." }, { value: 40, label: "Very Severe", description: "Loss of use of hand or multiple finger amputations." }] }] },
  generic: { label: "Wrist/Hand \u2014 General", note: "General wrist/hand condition evaluation.", domains: [{ id: "severity", label: "Overall Severity", description: "General severity of the wrist/hand condition", levels: [{ value: 0, label: "None", description: "No significant impairment." }, { value: 10, label: "Mild", description: "Mild impairment." }, { value: 20, label: "Moderate", description: "Moderate impairment." }, { value: 30, label: "Severe", description: "Severe impairment." }, { value: 50, label: "Very Severe", description: "Very severe impairment." }] }] },
}
const WRIST_CONDITION_PROFILE: Record<string, string> = { "carpal tunnel syndrome": "carpal", "limited rom - wrist": "rom", "de quervain's tenosynovitis": "rom", "trigger finger": "finger", "wrist fracture residuals": "rom", "wrist tendinitis": "rom", "ganglion cyst": "generic", "grip strength loss": "finger", "wrist instability": "rom", "wrist arthritis": "rom" }
export function getWristProfileKey(name: string): string { return WRIST_CONDITION_PROFILE[name.toLowerCase()] || "rom" }
export function getWristProfile(name: string): EvalProfile { return WRIST_PROFILES[getWristProfileKey(name)] }

// ── ANKLE / FOOT PROFILES ───────────────────────────────────────────────────

export const ANKLE_PROFILES: Record<string, EvalProfile> = {
  rom: { label: "Ankle Range of Motion (DC 5271)", note: "Rated based on limitation of motion of the ankle.", domains: [
    { id: "motion", label: "Limitation of Motion", description: "Limited motion of the ankle (DC 5271)", levels: [{ value: 0, label: "Normal", description: "No significant limitation." }, { value: 10, label: "Moderate", description: "Moderate limitation of motion." }, { value: 20, label: "Marked", description: "Marked limitation of motion." }] },
    { id: "ankylosis", label: "Joint Frozen/Locked (Ankylosis)", description: "Ankylosis of the ankle (DC 5270)", levels: [{ value: 0, label: "None", description: "Ankle is not frozen/locked (no ankylosis)." }, { value: 20, label: "Foot pointed down (plantar flexion) <30\u00b0", description: "Ankle frozen/locked with foot pointing down (plantar flexion) less than 30\u00b0." }, { value: 30, label: "Foot pointed down 30-40\u00b0", description: "Ankle frozen/locked with foot pointing down between 30\u00b0 and 40\u00b0, or with foot pulled up between 0\u00b0 and 10\u00b0." }, { value: 40, label: "Unfavorable", description: "Ankle frozen/locked with foot pointing down at more than 40\u00b0, or foot pulled up at more than 10\u00b0, or with deformity." }] },
  ]},
  instability: { label: "Ankle Instability (DC 5271)", note: "Chronic ankle instability or recurrent subluxation.", domains: [{ id: "severity", label: "Instability Severity", description: "Severity of ankle instability", levels: [{ value: 0, label: "None", description: "No instability." }, { value: 10, label: "Moderate", description: "Moderate instability with occasional giving way." }, { value: 20, label: "Marked", description: "Marked instability, frequent giving way." }] }] },
  flatfoot: { label: "Flatfoot (DC 5276)", note: "Acquired flatfoot (pes planus).", domains: [{ id: "severity", label: "Flatfoot Severity", description: "Severity of acquired flatfoot", levels: [{ value: 0, label: "Mild", description: "Symptoms relieved by built-up shoe or arch support." }, { value: 10, label: "Moderate", description: "Weight-bearing line over or toward the big toe, inward bowing of the Achilles tendon. One or both feet." }, { value: 20, label: "Severe (Unilateral)", description: "Clear evidence of marked deformity, pain, swelling, thick calluses. One foot." }, { value: 30, label: "Severe (Bilateral)", description: "Severe flatfoot in both feet \u2014 marked deformity, pain, swelling, thick calluses." }, { value: 50, label: "Pronounced", description: "Pronounced; marked inward rolling of the foot, extreme tenderness of the bottom of the foot, not improved by orthopedic shoes/appliances." }] }] },
  plantar: { label: "Plantar Fasciitis", note: "Rated by analogy, commonly under DC 5276 or 5284.", domains: [{ id: "severity", label: "Plantar Fasciitis Severity", description: "Overall severity of plantar fasciitis", levels: [{ value: 0, label: "None", description: "No significant impairment." }, { value: 10, label: "Moderate", description: "Pain with prolonged standing/walking, relieved with rest." }, { value: 20, label: "Moderately Severe", description: "Pain with most weight-bearing, some activity limitation." }, { value: 30, label: "Severe", description: "Severe pain limiting most activities." }] }] },
  generic: { label: "Ankle/Foot \u2014 General", note: "General ankle/foot condition evaluation.", domains: [{ id: "severity", label: "Overall Severity", description: "General severity of the ankle/foot condition", levels: [{ value: 0, label: "None", description: "No significant impairment." }, { value: 10, label: "Mild", description: "Mild impairment." }, { value: 20, label: "Moderate", description: "Moderate impairment." }, { value: 30, label: "Severe", description: "Severe impairment." }, { value: 50, label: "Very Severe", description: "Very severe impairment." }] }] },
}
const ANKLE_CONDITION_PROFILE: Record<string, string> = { "limited rom - ankle": "rom", "ankle instability": "instability", "ankle sprain (chronic)": "instability", "flatfoot (pes planus)": "flatfoot", "plantar fasciitis": "plantar", "achilles tendinitis": "rom", "heel spurs": "plantar", "ankle fracture residuals": "rom", "ankle arthritis": "rom", "morton's neuroma": "generic", "bunion (hallux valgus)": "generic", "hammer toe": "generic" }
export function getAnkleProfileKey(name: string): string { return ANKLE_CONDITION_PROFILE[name.toLowerCase()] || "rom" }
export function getAnkleProfile(name: string): EvalProfile { return ANKLE_PROFILES[getAnkleProfileKey(name)] }

// ── CHEST / LUNG PROFILES ───────────────────────────────────────────────────

export const CHEST_PROFILES: Record<string, EvalProfile> = {
  respiratory: { label: "Respiratory (DC 6600-6604)", note: "Rated based on pulmonary function tests (PFT) and clinical findings.", domains: [
    { id: "pft", label: "Lung/Breathing Capacity", description: "FEV-1/FVC ratio or FEV-1 percent predicted", levels: [{ value: 0, label: "Normal", description: "FEV-1 greater than 80% predicted; FEV-1/FVC greater than 80%." }, { value: 10, label: "Mild", description: "FEV-1 of 71-80% predicted, or FEV-1/FVC of 71-80%." }, { value: 30, label: "Moderate", description: "FEV-1 of 56-70% predicted, or FEV-1/FVC of 56-70%." }, { value: 60, label: "Severe", description: "FEV-1 of 40-55% predicted, or FEV-1/FVC of 40-55%." }, { value: 100, label: "Very Severe", description: "FEV-1 less than 40% predicted, or FEV-1/FVC less than 40%." }] },
    { id: "oxygen", label: "Oxygen Dependence", description: "Requirement for outpatient oxygen therapy", levels: [{ value: 0, label: "None", description: "No supplemental oxygen needed." }, { value: 60, label: "Intermittent", description: "Requires intermittent outpatient oxygen therapy." }, { value: 100, label: "Continuous", description: "Requires continuous outpatient oxygen therapy." }] },
  ]},
  apnea: { label: "Sleep Apnea (DC 6847)", note: "Rated under DC 6847 for obstructive, central, or mixed sleep apnea.", domains: [{ id: "severity", label: "Sleep Apnea Severity", description: "Severity of sleep apnea and treatment required", levels: [{ value: 0, label: "Asymptomatic", description: "Asymptomatic but with documented sleep disorder breathing." }, { value: 30, label: "Mild", description: "Persistent excessive daytime sleepiness (hypersomnolence)." }, { value: 50, label: "Moderate", description: "Requires use of breathing assistance device such as CPAP." }, { value: 100, label: "Severe", description: "Chronic respiratory failure with carbon dioxide retention or heart failure from lung disease, or requires a breathing tube (tracheostomy)." }] }] },
  asthma: { label: "Bronchial Asthma (DC 6602)", note: "Rated based on FEV-1 results, medication requirements, and frequency of exacerbations.", domains: [
    { id: "pft", label: "Lung/Breathing Capacity (FEV-1)", description: "FEV-1 percent predicted from pulmonary function testing", levels: [{ value: 0, label: "Normal (>80%)", description: "FEV-1 greater than 80% predicted." }, { value: 10, label: "71-80% predicted", description: "FEV-1 of 71-80% predicted." }, { value: 30, label: "56-70% predicted", description: "FEV-1 of 56-70% predicted." }, { value: 60, label: "40-55% predicted", description: "FEV-1 of 40-55% predicted; or at least monthly visits to physician for exacerbations; or intermittent courses of systemic corticosteroids." }, { value: 100, label: "<40% predicted", description: "FEV-1 less than 40% predicted; or more than one attack per week with episodes of respiratory failure; or daily use of systemic high-dose corticosteroids or immuno-suppressive medications." }] },
    { id: "medication", label: "Medication Level", description: "Current asthma treatment tier", levels: [{ value: 0, label: "No daily medication", description: "Intermittent use of bronchodilator only." }, { value: 10, label: "Daily inhaled bronchodilator", description: "Daily use of inhaled bronchodilator therapy." }, { value: 30, label: "Daily inhaled corticosteroid", description: "Daily inhalational anti-inflammatory medication." }, { value: 60, label: "High-dose inhaled + intermittent oral steroids", description: "High-dose inhaled corticosteroid plus intermittent systemic (oral) corticosteroid courses." }, { value: 100, label: "Daily systemic corticosteroids or immuno-suppressive", description: "Requires daily use of systemic high-dose corticosteroids or immuno-suppressive medications." }] },
    { id: "attacks", label: "Exacerbation Frequency", description: "How often asthma attacks require medical intervention", levels: [{ value: 0, label: "Rare", description: "Attacks less than once per month; no ER visits." }, { value: 10, label: "Monthly symptoms", description: "Symptoms requiring inhaler use several times per month." }, { value: 30, label: "Monthly physician visits", description: "At least monthly visits to a physician for required care of exacerbations." }, { value: 60, label: "Intermittent systemic steroids", description: "Requires intermittent courses of systemic corticosteroids." }, { value: 100, label: "Weekly attacks / respiratory failure", description: "More than one attack per week with episodes of respiratory failure; or requires immuno-suppressive therapy." }] },
  ]},
  generic: { label: "Chest/Lung \u2014 General", note: "General chest/lung condition evaluation.", domains: [{ id: "severity", label: "Overall Severity", description: "General severity of the chest/lung condition", levels: [{ value: 0, label: "None", description: "No significant impairment." }, { value: 10, label: "Mild", description: "Mild impairment." }, { value: 30, label: "Moderate", description: "Moderate impairment." }, { value: 60, label: "Severe", description: "Severe impairment." }, { value: 100, label: "Total", description: "Total impairment." }] }] },
}
const CHEST_CONDITION_PROFILE: Record<string, string> = { "asthma, bronchial": "asthma", "chronic obstructive pulmonary disease": "respiratory", "bronchitis": "respiratory", "restrictive lung disease": "respiratory", "sleep apnea syndromes (obstructive, central, mixed)": "apnea", "costochondritis": "generic", "pulmonary embolism residuals": "respiratory" }
export function getChestProfileKey(name: string): string { return CHEST_CONDITION_PROFILE[name.toLowerCase()] || "generic" }
export function getChestProfile(name: string): EvalProfile { return CHEST_PROFILES[getChestProfileKey(name)] }

// ── ABDOMEN / PELVIS PROFILES ───────────────────────────────────────────────

export const ABDOMEN_PROFILES: Record<string, EvalProfile> = {
  digestive: { label: "Digestive (DC 7301-7354)", note: "Rated based on severity, frequency, and treatment response of digestive conditions.", domains: [
    { id: "severity", label: "Condition Severity", description: "Overall severity and impact on daily function", levels: [{ value: 0, label: "None", description: "No significant symptoms." }, { value: 10, label: "Mild", description: "Mild symptoms manageable with diet or OTC medication." }, { value: 30, label: "Moderate", description: "Moderate symptoms requiring prescription medication; some weight loss or nutritional deficiency." }, { value: 60, label: "Severe", description: "Severe and frequent symptoms; material weight loss; requires continuous medication." }, { value: 100, label: "Total", description: "Pronounced symptoms causing marked malnutrition and health impairment." }] },
    { id: "frequency", label: "Symptom Frequency", description: "How often symptoms occur", levels: [{ value: 0, label: "Rare", description: "Symptoms occur rarely, long periods of remission." }, { value: 10, label: "Occasional", description: "Symptoms several times per month." }, { value: 20, label: "Frequent", description: "Symptoms occur weekly or more." }, { value: 30, label: "Near-Constant", description: "Nearly constant symptoms affecting most daily activities." }] },
  ]},
  genitourinary: { label: "Genitourinary (DC 7500-7542)", note: "Rated based on renal function, voiding dysfunction, or specific condition criteria.", domains: [{ id: "voiding", label: "Voiding Dysfunction", description: "Frequency, urgency, or incontinence", levels: [{ value: 0, label: "Normal", description: "Normal voiding function." }, { value: 10, label: "Mild", description: "Daytime voiding interval 1-2 hours, or awakening to void 2 times per night." }, { value: 20, label: "Moderate", description: "Daytime voiding interval <1 hour, or awakening to void 3-4 times per night." }, { value: 40, label: "Severe", description: "Requiring absorbent materials that must be changed 2-4 times per day." }, { value: 60, label: "Very Severe", description: "Requiring absorbent materials changed more than 4 times per day, or use of appliance." }] }] },
  generic: { label: "Abdomen \u2014 General", note: "General abdominal/pelvic condition evaluation.", domains: [{ id: "severity", label: "Overall Severity", description: "General severity of the condition", levels: [{ value: 0, label: "None", description: "No significant impairment." }, { value: 10, label: "Mild", description: "Mild impairment." }, { value: 20, label: "Moderate", description: "Moderate impairment." }, { value: 30, label: "Severe", description: "Severe impairment." }, { value: 50, label: "Very Severe", description: "Very severe impairment." }] }] },
}
const ABDOMEN_CONDITION_PROFILE: Record<string, string> = { "gerd": "digestive", "gastroesophageal reflux disease": "digestive", "ibs": "digestive", "irritable bowel syndrome": "digestive", "hiatal hernia": "digestive", "crohn's disease": "digestive", "ulcerative colitis": "digestive", "bladder dysfunction": "genitourinary", "erectile dysfunction": "genitourinary", "kidney stones": "genitourinary" }
export function getAbdomenProfileKey(name: string): string { return ABDOMEN_CONDITION_PROFILE[name.toLowerCase()] || "generic" }
export function getAbdomenProfile(name: string): EvalProfile { return ABDOMEN_PROFILES[getAbdomenProfileKey(name)] }

// ── LEG (THIGH / SHIN / CALF) PROFILES ─────────────────────────────────────

export const LEG_PROFILES: Record<string, EvalProfile> = {
  muscle: { label: "Muscle Injury (DC 5311-5315)", note: "Rated based on muscle group injury severity \u2014 function of movement, strength, fatigue.", domains: [{ id: "severity", label: "Muscle Injury Severity", description: "Key signs: loss of power, weakness, getting tired more easily, pain, difficulty with coordination, unsteady movement", levels: [{ value: 0, label: "Slight", description: "Simple wound, no surgical cleaning needed, no lasting impairment." }, { value: 10, label: "Moderate", description: "Through-and-through or deep penetrating wound; hospitalized and treated; consistent complaints on exam." }, { value: 20, label: "Moderately Severe", description: "Wound required surgical cleaning; prolonged infection or tissue breakdown; scarring between muscles; loss of deep tissue, muscle substance, or normal firm resistance." }, { value: 30, label: "Severe", description: "Shattering bone fracture or comminuted fracture; extensive surgical wound cleaning; prolonged infection; ragged, sunken, stuck-down scars; loss of deep tissue or muscle substance; soft, flabby muscles in wound area." }] }] },
  neuropathy: { label: "Peripheral Neuropathy (DC 8520/8521)", note: "Sciatic or peroneal nerve involvement rated under DC 8520/8521.", domains: [{ id: "nerve", label: "Nerve Impairment", description: "Severity of nerve damage causing numbness, tingling, or weakness", levels: [{ value: 0, label: "Normal", description: "No nerve damage." }, { value: 10, label: "Mild", description: "Mild incomplete paralysis." }, { value: 20, label: "Moderate", description: "Moderate incomplete paralysis." }, { value: 40, label: "Moderately Severe", description: "Moderately severe incomplete paralysis." }, { value: 60, label: "Severe", description: "Severe incomplete paralysis with marked muscle shrinkage/wasting." }, { value: 80, label: "Complete", description: "Complete paralysis \u2014 foot dangles, no active movement possible." }] }] },
  generic: { label: "Leg \u2014 General", note: "General thigh/shin/calf condition evaluation.", domains: [{ id: "severity", label: "Overall Severity", description: "General severity of the leg condition", levels: [{ value: 0, label: "None", description: "No significant impairment." }, { value: 10, label: "Mild", description: "Mild impairment." }, { value: 20, label: "Moderate", description: "Moderate impairment." }, { value: 30, label: "Severe", description: "Severe impairment." }, { value: 50, label: "Very Severe", description: "Very severe impairment." }] }] },
}
const LEG_CONDITION_PROFILE: Record<string, string> = { "shin splints (mtss)": "muscle", "muscle strain (thigh)": "muscle", "muscle strain (calf)": "muscle", "muscle atrophy": "muscle", "peripheral neuropathy (lower)": "neuropathy", "sciatic nerve involvement": "neuropathy", "lower extremity numbness / tingling": "neuropathy", "deep vein thrombosis": "generic", "varicose veins": "generic", "compartment syndrome": "muscle" }
export function getLegProfileKey(name: string): string { return LEG_CONDITION_PROFILE[name.toLowerCase()] || "generic" }
export function getLegProfile(name: string): EvalProfile { return LEG_PROFILES[getLegProfileKey(name)] }

// ── REGION → PROFILE RESOLVER ───────────────────────────────────────────────

const REGION_PROFILES: Record<string, { profiles: Record<string, EvalProfile>; getKey: (name: string) => string }> = {
  knee: { profiles: KNEE_PROFILES, getKey: getKneeProfileKey },
  back: { profiles: SPINE_PROFILES, getKey: getSpineProfileKey },
  shoulder: { profiles: SHOULDER_PROFILES, getKey: getShoulderProfileKey },
  neck: { profiles: NECK_PROFILES, getKey: getNeckProfileKey },
  hip: { profiles: HIP_PROFILES, getKey: getHipProfileKey },
  elbow: { profiles: ELBOW_PROFILES, getKey: getElbowProfileKey },
  wrist_hand: { profiles: WRIST_PROFILES, getKey: getWristProfileKey },
  ankle_foot: { profiles: ANKLE_PROFILES, getKey: getAnkleProfileKey },
  chest: { profiles: CHEST_PROFILES, getKey: getChestProfileKey },
  abdomen: { profiles: ABDOMEN_PROFILES, getKey: getAbdomenProfileKey },
  leg: { profiles: LEG_PROFILES, getKey: getLegProfileKey },
  systemic: { profiles: SYSTEMIC_PROFILES_ALL, getKey: getSystemicProfileKey },
  headFace: { profiles: HEAD_PROFILES, getKey: getHeadProfileKey },
}

export function getProfileForRegion(regionId: string, conditionName: string): { profile: EvalProfile; profileKey: string } {
  const entry = REGION_PROFILES[regionId]
  if (!entry) return { profile: PHYSICAL_PROFILE, profileKey: "generic" }
  const key = entry.getKey(conditionName)
  return { profile: entry.profiles[key] || PHYSICAL_PROFILE, profileKey: key }
}

export function getProfilesForRegion(regionId: string): Record<string, EvalProfile> {
  return REGION_PROFILES[regionId]?.profiles || { generic: PHYSICAL_PROFILE }
}
