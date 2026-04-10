// ── HEAD & FACE EVALUATION DATA ────────────────────────────────────────────────

export interface HDLevel {
  value: number
  label: string
  description: string
}

export interface HDDomainDef {
  id: string
  label: string
  description: string
  levels: HDLevel[]
}

export interface HDProfile {
  label: string
  note?: string
  domains: HDDomainDef[]
}

export const HEAD_PROFILES: Record<string, HDProfile> = {
  migraine: {
    label: 'Migraine / Headaches (DC 8100)',
    domains: [{
      id: 'severity', label: 'Attack Frequency & Severity',
      description: 'Frequency and severity of migraine attacks severe enough to leave you unable to function (prostrating)',
      levels: [
        { value: 0, label: 'Less frequent attacks', description: 'Attacks that are not severe enough to leave you unable to function, or infrequent attacks' },
        { value: 10, label: 'Severe attacks ~every 2 months', description: 'Attacks severe enough to leave you unable to function (prostrating) averaging one in 2 months over last several months' },
        { value: 30, label: 'Severe attacks ~once per month', description: 'Attacks severe enough to leave you unable to function (prostrating) occurring on average once a month over last several months' },
        { value: 50, label: 'Very frequent severe & prolonged attacks', description: 'Very frequent attacks that completely leave you unable to function (prostrating) and are prolonged, causing severe inability to work' },
      ],
    }],
  },
  tbi: {
    label: 'TBI Residuals (DC 8045)',
    note: 'Rate based on 10 facets. Overall rating equals the highest facet level.',
    domains: [
      { id: 'memory', label: 'Facet 1: Memory / Attention / Concentration',
        description: 'Executive functions including memory, attention, concentration',
        levels: [
          { value: 0, label: 'Level 0 — No complaints', description: 'No complaints of impairment' },
          { value: 10, label: 'Level 1 — Mild (subjective)', description: 'Mild loss of memory, difficulty following conversation, misplacing items — no objective evidence on testing' },
          { value: 40, label: 'Level 2 — Mild (objective)', description: 'Objective evidence on testing of mild impairment resulting in mild functional impairment' },
          { value: 70, label: 'Level 3 — Moderate (objective)', description: 'Objective evidence on testing of moderate impairment resulting in moderate functional impairment' },
          { value: 100, label: 'Total — Severe (objective)', description: 'Objective evidence of severe impairment resulting in severe functional impairment' },
        ],
      },
      { id: 'judgment', label: 'Facet 2: Judgment',
        description: 'Ability to make reasonable decisions',
        levels: [
          { value: 0, label: 'Level 0 — Normal', description: 'Normal judgment' },
          { value: 10, label: 'Level 1 — Mildly impaired', description: 'Occasionally unable to handle complex/unfamiliar decisions' },
          { value: 40, label: 'Level 2 — Moderately impaired', description: 'Usually unable to make reasonable decisions for complex matters' },
          { value: 70, label: 'Level 3 — Moderately severely impaired', description: 'Occasionally unable to make reasonable decisions even for routine matters' },
          { value: 100, label: 'Total — Severely impaired', description: 'Usually unable to make reasonable decisions even for routine/familiar matters' },
        ],
      },
      { id: 'social', label: 'Facet 3: Social Interaction',
        description: 'Appropriateness of social interaction',
        levels: [
          { value: 0, label: 'Level 0 — Routinely appropriate', description: 'Social interaction is routinely appropriate' },
          { value: 10, label: 'Level 1 — Occasionally inappropriate', description: 'Social interaction is occasionally inappropriate' },
          { value: 40, label: 'Level 2 — Frequently inappropriate', description: 'Social interaction is frequently inappropriate' },
          { value: 70, label: 'Level 3 — Inappropriate most/all of the time', description: 'Inappropriate most or all of the time' },
        ],
      },
      { id: 'orientation', label: 'Facet 4: Orientation',
        description: 'Orientation to person, time, place, and situation',
        levels: [
          { value: 0, label: 'Level 0 — Always oriented', description: 'Always oriented to person, time, place, and situation' },
          { value: 10, label: 'Level 1 — Occasionally disoriented to 1 aspect', description: 'Occasionally disoriented to one of the four aspects' },
          { value: 40, label: 'Level 2 — Occasionally to 2 / often to 1', description: 'Occasionally disoriented to two aspects, or often disoriented to one' },
          { value: 70, label: 'Level 3 — Often disoriented to 2+', description: 'Often disoriented to two or more aspects' },
          { value: 100, label: 'Total — Consistently disoriented', description: 'Consistently disoriented to two or more aspects' },
        ],
      },
      { id: 'motor', label: 'Facet 5: Motor Activity',
        description: 'Motor activity with intact motor and sensory system',
        levels: [
          { value: 0, label: 'Level 0 — Normal', description: 'Motor activity is normal' },
          { value: 10, label: 'Level 1 — Mildly slowed at times', description: 'Normal most of the time, mildly slowed at times due to difficulty with coordinated movements (apraxia)' },
          { value: 40, label: 'Level 2 — Mildly decreased', description: 'Motor activity mildly decreased or with moderate slowing due to difficulty with coordinated movements (apraxia)' },
          { value: 70, label: 'Level 3 — Moderately decreased', description: 'Motor activity moderately decreased due to difficulty with coordinated movements (apraxia)' },
          { value: 100, label: 'Total — Severely decreased', description: 'Motor activity severely decreased due to difficulty with coordinated movements (apraxia)' },
        ],
      },
      { id: 'spatial', label: 'Facet 6: Visual Spatial Orientation',
        description: 'Ability to navigate environments and use maps/directions',
        levels: [
          { value: 0, label: 'Level 0 — Normal', description: 'Normal spatial orientation' },
          { value: 10, label: 'Level 1 — Mildly impaired', description: 'Occasionally lost in unfamiliar surroundings; can use GPS' },
          { value: 40, label: 'Level 2 — Moderately impaired', description: 'Usually lost in unfamiliar surroundings; difficulty using GPS' },
          { value: 70, label: 'Level 3 — Moderately severely impaired', description: 'Lost even in familiar surroundings; unable to use GPS' },
          { value: 100, label: 'Total — Severely impaired', description: 'Unable to touch/name body parts or find way in familiar places' },
        ],
      },
      { id: 'subjective', label: 'Facet 7: Subjective Symptoms',
        description: 'Headaches, dizziness, fatigue, insomnia, hypersensitivity to sound/light',
        levels: [
          { value: 0, label: 'Level 0 — Do not interfere', description: 'Symptoms do not interfere with work, daily activities, or relationships' },
          { value: 10, label: 'Level 1 — Mildly interfere', description: '3+ symptoms that mildly interfere: intermittent dizziness, daily mild headaches, tinnitus, insomnia' },
          { value: 40, label: 'Level 2 — Moderately interfere', description: '3+ symptoms that moderately interfere: marked fatigue, blurred/double vision, headaches requiring rest' },
        ],
      },
      { id: 'neurobehavioral', label: 'Facet 8: Neurobehavioral Effects',
        description: 'Irritability, impulsivity, aggression, apathy, lack of motivation',
        levels: [
          { value: 0, label: 'Level 0 — Do not interfere', description: 'Effects present but do not interfere with workplace or social interaction' },
          { value: 10, label: 'Level 1 — Occasionally interfere', description: 'Occasionally interfere with workplace/social interaction but do not preclude them' },
          { value: 40, label: 'Level 2 — Frequently interfere', description: 'Frequently interfere but do not preclude workplace/social interaction' },
          { value: 70, label: 'Level 3 — Preclude interaction most days', description: 'Interfere with or preclude interaction on most days; occasionally require supervision' },
        ],
      },
      { id: 'communication', label: 'Facet 9: Communication',
        description: 'Ability to communicate by spoken/written language',
        levels: [
          { value: 0, label: 'Level 0 — Normal', description: 'Able to communicate and comprehend spoken and written language' },
          { value: 10, label: 'Level 1 — Occasionally impaired', description: 'Comprehension or expression only occasionally impaired; can communicate complex ideas' },
          { value: 40, label: 'Level 2 — Impaired < half the time', description: 'Unable to communicate more than occasionally but less than half the time' },
          { value: 70, label: 'Level 3 — Impaired ≥ half the time', description: 'Unable to communicate at least half the time; may rely on gestures; can communicate basic needs' },
          { value: 100, label: 'Total — Complete inability', description: 'Complete inability to communicate or comprehend; unable to communicate basic needs' },
        ],
      },
      { id: 'consciousness', label: 'Facet 10: Consciousness',
        description: 'Level of consciousness',
        levels: [
          { value: 0, label: 'Normal', description: 'Normal state of consciousness' },
          { value: 100, label: 'Total — Persistently altered', description: 'Persistently altered state (vegetative state, minimally responsive, coma)' },
        ],
      },
    ],
  },
  tmj: {
    label: 'TMJ / Temporomandibular Disorder (DC 9905)',
    domains: [
      { id: 'opening', label: 'Maximum Unassisted Vertical Opening',
        description: 'Jaw opening range and dietary restrictions (normal: 35–50 mm)',
        levels: [
          { value: 0, label: 'Normal opening (35+ mm)', description: 'No limitation of jaw opening.' },
          { value: 10, label: '34 mm / limited lateral excursion', description: '34 mm opening; or 0–4 mm lateral excursion.' },
          { value: 20, label: '29 mm or 34 mm with soft-food diet', description: '29 mm without dietary restriction; or 34 mm with restriction to soft/semi-solid foods.' },
          { value: 30, label: '20 mm or 29–34 mm with restricted diet', description: '20 mm without restriction; or 29 mm without restriction to soft foods; or 34 mm with liquid/pureed diet.' },
          { value: 40, label: '10–20 mm with dietary restrictions', description: '10 mm without restriction; or 20 mm with mechanically altered food; or 29 mm with liquid/pureed diet.' },
          { value: 50, label: '10 mm with all mechanically altered food diet', description: '10 mm maximum opening with dietary restrictions to all mechanically altered food.' },
        ],
      },
      { id: 'pain', label: 'Pain on Movement',
        description: 'Pain when chewing, talking, yawning, or at rest',
        levels: [
          { value: 0, label: 'No pain', description: 'No jaw pain during movement or at rest.' },
          { value: 10, label: 'Mild — occasional pain', description: 'Occasional pain with prolonged chewing or wide opening. Clicking/popping without significant pain.' },
          { value: 20, label: 'Moderate — frequent pain', description: 'Frequent pain during normal chewing, talking, or yawning. May radiate to ear, temple, or neck.' },
          { value: 30, label: 'Severe — constant pain', description: 'Near-constant jaw pain, significantly limits talking and eating. Pain at rest or wakes from sleep.' },
        ],
      },
      { id: 'mastication', label: 'Chewing / Eating Difficulty',
        description: 'Impact on ability to eat normally',
        levels: [
          { value: 0, label: 'Normal diet', description: 'Can eat all foods without difficulty.' },
          { value: 10, label: 'Avoids hard/chewy foods', description: 'Avoids hard, crunchy, or very chewy foods (steak, raw vegetables, etc.) but manages most foods.' },
          { value: 20, label: 'Soft food diet', description: 'Limited to soft foods — pasta, bread, cooked vegetables. Cannot eat steak, nuts, raw produce.' },
          { value: 30, label: 'Liquid/pureed diet', description: 'Restricted to liquids, smoothies, or pureed foods due to inability to chew.' },
        ],
      },
    ],
  },
  tinnitus: {
    label: 'Tinnitus (DC 6260)',
    note: 'Single evaluation whether perceived in one ear, both ears, or head.',
    domains: [{
      id: 'severity', label: 'Tinnitus Impact',
      description: 'Whether tinnitus significantly impacts daily life',
      levels: [
        { value: 0, label: 'Not recurrent or no significant impact', description: 'Tinnitus present but not recurrent, or does not interfere with sleep, concentration, or daily life' },
        { value: 10, label: 'Recurrent; interferes with sleep / concentration / daily life', description: 'Significantly interferes with sleep, concentration, or daily life; or causes emotional distress' },
      ],
    }],
  },
  hearing: {
    label: 'Hearing Loss (DC 6100)',
    note: 'VA rates hearing based on audiometric testing. Select what best describes your hearing.',
    domains: [
      { id: 'type', label: 'Type of Hearing Problem',
        description: 'What kind of hearing issue do you experience?',
        levels: [
          { value: 0, label: 'No hearing problems', description: 'Normal hearing in both ears.' },
          { value: 10, label: 'Hearing loss only', description: 'Difficulty hearing conversations or sounds, but no ringing.' },
          { value: 10, label: 'Ringing only (tinnitus)', description: 'Ringing, buzzing, or hissing in one or both ears, but hearing is otherwise normal.' },
          { value: 10, label: 'Both hearing loss and ringing', description: 'Both reduced hearing and persistent ringing/buzzing. Each may be rated separately.' },
        ],
      },
      { id: 'degree', label: 'Degree of Hearing Loss',
        description: 'How much does hearing loss affect your daily life?',
        levels: [
          { value: 0, label: 'None or minimal', description: 'Can hear conversations normally in most situations.' },
          { value: 10, label: 'Mild', description: 'Difficulty hearing in noisy environments (restaurants, groups). May need to ask people to repeat.' },
          { value: 20, label: 'Moderate', description: 'Frequently miss parts of conversations. Need hearing aids to function normally.' },
          { value: 30, label: 'Moderately severe', description: 'Significant difficulty even with hearing aids. Struggle with phone calls and TV at normal volume.' },
          { value: 50, label: 'Severe', description: 'Very limited hearing even with aids. Rely on lip reading or visual cues.' },
          { value: 100, label: 'Total loss (both ears)', description: 'Complete or near-complete deafness in both ears.' },
        ],
      },
    ],
  },
  vestibular: {
    label: 'Peripheral Vestibular Disorder (DC 6204)',
    domains: [{
      id: 'severity', label: 'Symptom Severity (last 6 months)',
      description: 'Impact of dizziness/vertigo on daily activities',
      levels: [
        { value: 0, label: 'No significant symptoms', description: 'No dizziness or balance issues' },
        { value: 10, label: 'Brief / temporary modification needed', description: 'Symptoms require brief modification of activity but do not prevent normal functions' },
        { value: 30, label: 'Routine limitation of activities', description: 'Frequent symptoms requiring routine limitation in work/self-care; independent with effort and modification' },
        { value: 100, label: 'Inability to work or self-care', description: 'Symptoms result in inability to engage in work and/or self-care; cannot perform routine daily activities' },
      ],
    }],
  },
  menieres: {
    label: "Meniere's Disease (DC 6205)",
    note: "Rate under these criteria OR separately rate vertigo + hearing + tinnitus — whichever is higher.",
    domains: [{
      id: 'severity', label: 'Vertigo Frequency (with hearing impairment)',
      description: 'How often vertigo attacks occur, with concurrent hearing impairment',
      levels: [
        { value: 0, label: 'No vertigo', description: 'Hearing impairment without vertigo episodes' },
        { value: 30, label: 'Vertigo less than once a month', description: 'Hearing impairment with vertigo less than once monthly' },
        { value: 60, label: 'Vertigo 1–4 times a month', description: 'Hearing impairment with vertigo occurring 1–4 times monthly' },
        { value: 100, label: 'Vertigo >5 times/month or persistent balance problems', description: 'Vertigo >5x/month or persistent balance problems (disequilibrium) and unsteady walking' },
      ],
    }],
  },
  sinusitis: {
    label: 'Sinusitis (DC 6510–6514)',
    domains: [{
      id: 'severity', label: 'Episode Frequency & Severity',
      description: 'Frequency of severe (bed-rest-level) and milder sinusitis episodes per year',
      levels: [
        { value: 0, label: 'Detected by imaging only', description: 'Sinusitis detected by X-ray/CT only; no clinical symptoms' },
        { value: 10, label: '1–2 severe or 3–6 milder episodes/year', description: '1–2 episodes requiring prolonged antibiotics; or 3–6 episodes with headaches, pain, discharge' },
        { value: 30, label: '3+ severe or 6+ milder episodes/year', description: '3+ episodes requiring prolonged antibiotics; or 6+ milder episodes yearly' },
        { value: 50, label: 'Post-surgical chronic symptoms or near-constant sinusitis', description: 'Following radical surgery with chronic bone infection (osteomyelitis); or near-constant sinusitis' },
      ],
    }],
  },
  vision: {
    label: 'Visual Acuity Impairment (DC 6061–6066)',
    note: 'VA rating is based on corrected visual acuity testing. Select the closest match.',
    domains: [{
      id: 'severity', label: 'Visual Acuity (corrected)',
      description: 'Best corrected visual acuity in the affected eye(s)',
      levels: [
        { value: 0, label: '20/40 or better both eyes', description: 'Normal or near-normal corrected vision' },
        { value: 10, label: '20/50–20/70 in one eye', description: 'Mild impairment in one eye; other 20/40 or better' },
        { value: 20, label: '20/100 one eye or 20/70 both', description: 'Moderate visual impairment' },
        { value: 30, label: '20/200 one eye or 20/100 both', description: 'Significant impairment; legally impaired in one eye' },
        { value: 40, label: '20/200 both eyes or 5/200 one eye', description: 'Severe visual impairment' },
        { value: 50, label: '5/200 both eyes', description: 'Very severe visual impairment' },
        { value: 70, label: 'Light perception only in one eye', description: 'Functional blindness in one eye' },
        { value: 100, label: 'No light perception / anatomical loss both eyes', description: 'Total blindness' },
      ],
    }],
  },
  cranial_nerve: {
    label: 'Cranial Nerve Impairment',
    domains: [{
      id: 'severity', label: 'Nerve Paralysis / Neuralgia Severity',
      description: 'Degree of nerve dysfunction',
      levels: [
        { value: 0, label: 'Normal function', description: 'No nerve impairment' },
        { value: 10, label: 'Mild / Incomplete paralysis', description: 'Mild dysfunction; slight sensory or motor loss' },
        { value: 20, label: 'Moderate incomplete paralysis', description: 'Moderate dysfunction; noticeable sensory or motor deficit' },
        { value: 30, label: 'Severe incomplete paralysis', description: 'Severe dysfunction; significant functional loss' },
        { value: 50, label: 'Complete paralysis', description: 'Complete loss of function of the affected nerve' },
      ],
    }],
  },
  disfigurement: {
    label: 'Disfigurement of Head, Face, or Neck (DC 7800)',
    note: 'Rated based on the 8 characteristics of disfigurement and whether there is visible tissue loss or asymmetry of features.',
    domains: [
      { id: 'characteristics', label: 'Characteristics of Disfigurement',
        description: 'Count how many of these 8 characteristics apply: (1) Scar 5+ inches long, (2) Scar 1/4+ inch wide, (3) Surface contour elevated or depressed, (4) Scar adherent to underlying tissue, (5) Hypo/hyper-pigmented area exceeding 6 sq inches, (6) Abnormal skin texture exceeding 6 sq inches, (7) Underlying soft tissue missing exceeding 6 sq inches, (8) Skin indurated and inflexible exceeding 6 sq inches',
        levels: [
          { value: 0, label: 'No characteristics of disfigurement', description: 'No scars or disfigurement meeting any of the 8 characteristics.' },
          { value: 10, label: '1 characteristic', description: 'One characteristic of disfigurement present.' },
          { value: 30, label: '2 or 3 characteristics', description: 'Two or three characteristics of disfigurement; or visible/palpable tissue loss with gross distortion or asymmetry of one feature or paired set of features.' },
          { value: 50, label: '4 or 5 characteristics', description: 'Four or five characteristics of disfigurement; or visible/palpable tissue loss with gross distortion or asymmetry of two features or paired sets of features.' },
          { value: 80, label: '6 or more characteristics', description: 'Six or more characteristics of disfigurement; or visible/palpable tissue loss with gross distortion or asymmetry of three or more features or paired sets of features.' },
        ],
      },
      { id: 'tissue_loss', label: 'Tissue Loss & Asymmetry',
        description: 'Is there visible or palpable tissue loss with distortion or asymmetry of facial features?',
        levels: [
          { value: 0, label: 'No tissue loss or asymmetry', description: 'No visible tissue loss. Facial features are symmetric.' },
          { value: 30, label: 'Tissue loss with asymmetry of 1 feature', description: 'Visible or palpable tissue loss AND either gross distortion or asymmetry of one feature or paired set of features.' },
          { value: 50, label: 'Tissue loss with asymmetry of 2 features', description: 'Visible or palpable tissue loss AND gross distortion or asymmetry of two features or paired sets.' },
          { value: 80, label: 'Tissue loss with asymmetry of 3+ features', description: 'Visible or palpable tissue loss AND gross distortion or asymmetry of three or more features or paired sets.' },
        ],
      },
    ],
  },
  generic: {
    label: 'General Severity Assessment',
    domains: [{
      id: 'severity', label: 'Condition Severity',
      description: 'Overall functional impact of this condition',
      levels: [
        { value: 0, label: 'Asymptomatic / No disability', description: 'Condition present but causes no functional limitation' },
        { value: 10, label: 'Mild', description: 'Mild symptoms with slight functional limitation' },
        { value: 20, label: 'Moderate', description: 'Moderate symptoms with noticeable functional limitation' },
        { value: 30, label: 'Moderately Severe', description: 'Significant symptoms affecting daily activities' },
        { value: 50, label: 'Severe', description: 'Severe symptoms substantially limiting function' },
        { value: 70, label: 'Very Severe', description: 'Very severe symptoms; near-total limitation' },
        { value: 100, label: 'Total Disability', description: 'Complete functional disability from this condition' },
      ],
    }],
  },
}

// Map condition names → profile key
const HEAD_CONDITION_PROFILE: Record<string, string> = {}
;['Migraine headaches'].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'migraine' })
;['Residuals of Traumatic Brain Injury (TBI)', 'Cognitive disorder'].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'tbi' })
;['Temporomandibular disorder (TMD)'].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'tmj' })
;['Tinnitus, recurrent'].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'tinnitus' })
;['Hearing impairment (hearing loss)'].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'hearing' })
;['Vertigo / Dizziness', 'Peripheral vestibular disorders'].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'vestibular' })
;["Meniere's syndrome (endolymphatic hydrops)"].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'menieres' })
;[
  'Vision impairment', 'Diplopia (double vision)', 'Visual field defects', 'Scotoma, unilateral',
  'Retinal dystrophy (including retinitis pigmentosa, wet or dry macular degeneration, early-onset macular degeneration, rod and/or cone dystrophy)',
  'Diabetic retinopathy', 'Optic neuropathy', 'Ptosis, unilateral or bilateral', 'Post-chiasmal disorders',
].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'vision' })
;['Fifth (trigeminal) cranial nerve, Neuralgia', 'Seventh (facial) cranial nerve, Paralysis of'].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'cranial_nerve' })
;['Sinusitis, chronic'].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'sinusitis' })
;['Burn scar(s) of the head, face, or neck; scar(s) of the head, face, or neck due to other causes; or other disfigurement of the head, face, or neck'].forEach(n => { HEAD_CONDITION_PROFILE[n] = 'disfigurement' })

export function getHeadProfileKey(conditionName: string): string {
  return HEAD_CONDITION_PROFILE[conditionName] ?? 'generic'
}

export function getHeadProfile(conditionName: string): HDProfile {
  return HEAD_PROFILES[getHeadProfileKey(conditionName)]
}

export function calculateHeadRating(domainValues: Record<string, number>): number {
  return Object.values(domainValues).reduce((max, v) => (v > max ? v : max), 0)
}

export const VA_HEAD = [
  'Migraine headaches', 'Residuals of Traumatic Brain Injury (TBI)',
  'Temporomandibular disorder (TMD)', 'Tinnitus, recurrent',
  'Vision impairment', 'Cognitive disorder', 'Vertigo / Dizziness',
  'Hearing impairment (hearing loss)',
  'Chronic suppurative otitis media, mastoiditis, or cholesteatoma (or any combination)',
  'Chronic nonsuppurative otitis media with effusion (serious otitis media)',
  'Otosclerosis', 'Peripheral vestibular disorders',
  "Meniere's syndrome (endolymphatic hydrops)", 'Loss of auricle',
  'Malignant neoplasm of the ear (other than skin only)',
  'Benign neoplasms of the ear (other than skin only)',
  'Chronic otitis externa', 'Tympanic membrane, perforation of',
  'Loss of sense of smell, complete', 'Loss of sense of taste, complete',
  'Cataract of any type', 'Aphakia or dislocation of crystalline lens',
  'Diabetic retinopathy', 'Diplopia (double vision)',
  'Disorders of the lacrimal apparatus (epiphora, dacryocystitis, etc.)',
  'Keratoconus', 'Nystagmus, central', 'Optic neuropathy',
  'Retinal dystrophy (including retinitis pigmentosa, wet or dry macular degeneration, early-onset macular degeneration, rod and/or cone dystrophy)',
  'Visual field defects', 'Scotoma, unilateral',
  'Chronic conjunctivitis (nontrachomatous)', 'Pterygium',
  'Ptosis, unilateral or bilateral', 'Papilledema',
  'Post-chiasmal disorders', 'Blepharitis',
  'Maxilla or mandible, chronic osteomyelitis, osteonecrosis or osteoradionecrosis of',
  'Fifth (trigeminal) cranial nerve, Neuralgia',
  'Seventh (facial) cranial nerve, Paralysis of',
  'Brain, vessels, hemorrhage from', 'Brain, vessels, thrombosis of',
  'Burn scar(s) of the head, face, or neck; scar(s) of the head, face, or neck due to other causes; or other disfigurement of the head, face, or neck',
  'Sinusitis, chronic', 'Rhinitis, allergic or vasomotor',
  'Seizure disorder (epilepsy)',
]
