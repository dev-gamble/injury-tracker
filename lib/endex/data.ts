import type { BPRegistryEntry, PinCoordinate, SidebarGroup } from "./types"

// ── PIN COORDINATE MAPS ─────────────────────────────────────────────────────

export const MENTAL_PINS: Record<string, PinCoordinate> = {
  mental: { label: "Mental Health", x: 52, y: 10 },
}

export const HEAD_PINS: Record<string, PinCoordinate> = {
  headFace: { label: "Head & Face", x: 52, y: 17 },
}

export const FRONT_PINS: Record<string, PinCoordinate> = {
  head: { label: "Head", x: 52, y: 17 },
  leftEar: { label: "Left Ear", x: 30, y: 17 },
  rightEar: { label: "Right Ear", x: 73, y: 17 },
  leftEye: { label: "Left Eye", x: 40, y: 14 },
  rightEye: { label: "Right Eye", x: 63, y: 14 },
  nose: { label: "Nose", x: 52, y: 16 },
  jaw: { label: "Jaw / TMJ", x: 52, y: 22 },
  neck: { label: "Neck", x: 52, y: 25 },
  leftShoulder: { label: "Left Shoulder", x: 21, y: 30 },
  rightShoulder: { label: "Right Shoulder", x: 80, y: 30 },
  chest: { label: "Chest", x: 52, y: 34 },
  leftLung: { label: "Left Lung", x: 35, y: 34 },
  rightLung: { label: "Right Lung", x: 68, y: 34 },
  abdomen: { label: "Abdomen", x: 52, y: 46 },
  leftElbow: { label: "Left Elbow", x: 19, y: 42 },
  rightElbow: { label: "Right Elbow", x: 83, y: 42 },
  leftForearm: { label: "Left Forearm", x: 13, y: 49 },
  rightForearm: { label: "Right Forearm", x: 88, y: 49 },
  leftWrist: { label: "Left Wrist", x: 10, y: 54 },
  rightWrist: { label: "Right Wrist", x: 90, y: 54 },
  leftHand: { label: "Left Hand", x: 14, y: 57 },
  rightHand: { label: "Right Hand", x: 87, y: 57 },
  leftHip: { label: "Left Hip", x: 37, y: 54 },
  rightHip: { label: "Right Hip", x: 63, y: 54 },
  pelvis: { label: "Pelvis / Groin", x: 52, y: 55 },
  leftThigh: { label: "Left Thigh", x: 38, y: 63 },
  rightThigh: { label: "Right Thigh", x: 62, y: 63 },
  leftKnee: { label: "Left Knee", x: 38, y: 70 },
  rightKnee: { label: "Right Knee", x: 62, y: 70 },
  leftShin: { label: "Left Shin", x: 38, y: 77 },
  rightShin: { label: "Right Shin", x: 62, y: 77 },
  leftAnkle: { label: "Left Ankle", x: 38, y: 84 },
  rightAnkle: { label: "Right Ankle", x: 62, y: 84 },
  leftFoot: { label: "Left Foot", x: 37, y: 87 },
  rightFoot: { label: "Right Foot", x: 62, y: 87 },
}

export const BACK_PINS: Record<string, PinCoordinate> = {
  head: { label: "Head", x: 52, y: 17 },
  neck: { label: "Neck", x: 52, y: 25 },
  leftShoulder: { label: "Left Shoulder", x: 21, y: 30 },
  rightShoulder: { label: "Right Shoulder", x: 80, y: 30 },
  upperBack: { label: "Upper Back", x: 52, y: 34 },
  spine: { label: "Spine", x: 52, y: 43 },
  lowerBack: { label: "Lower Back", x: 52, y: 49 },
  leftElbow: { label: "Left Elbow", x: 19, y: 42 },
  rightElbow: { label: "Right Elbow", x: 83, y: 42 },
  leftForearm: { label: "Left Forearm", x: 13, y: 49 },
  rightForearm: { label: "Right Forearm", x: 88, y: 49 },
  leftWrist: { label: "Left Wrist", x: 10, y: 54 },
  rightWrist: { label: "Right Wrist", x: 90, y: 54 },
  leftHand: { label: "Left Hand", x: 14, y: 57 },
  rightHand: { label: "Right Hand", x: 87, y: 57 },
  glutes: { label: "Glutes", x: 52, y: 56 },
  leftHamstring: { label: "Left Hamstring", x: 38, y: 63 },
  rightHamstring: { label: "Right Hamstring", x: 62, y: 63 },
  leftKnee: { label: "Left Knee", x: 38, y: 70 },
  rightKnee: { label: "Right Knee", x: 62, y: 70 },
  leftCalf: { label: "Left Calf", x: 38, y: 77 },
  rightCalf: { label: "Right Calf", x: 62, y: 77 },
  leftAnkle: { label: "Left Ankle", x: 38, y: 84 },
  rightAnkle: { label: "Right Ankle", x: 62, y: 84 },
  leftFoot: { label: "Left Foot", x: 37, y: 87 },
  rightFoot: { label: "Right Foot", x: 62, y: 87 },
}

// ── SIDEBAR CONFIGURATION ───────────────────────────────────────────────────

export const SIDEBAR_ITEMS: Record<string, string> = {
  mental: "Mental Health",
  headFace: "Head & Face",
  neck: "Neck",
  shoulder: "Shoulders",
  chest: "Chest / Lungs",
  elbow: "Elbow / Forearm",
  wrist_hand: "Wrist / Hand",
  abdomen: "Abdomen / Pelvis",
  hip: "Hips",
  knee: "Knees",
  leg: "Thigh / Shin / Calf",
  ankle_foot: "Ankle / Foot",
  back: "Back & Spine",
  systemic: "Other / Systemic",
}

export const GROUPS_FRONT: SidebarGroup[] = [
  { heading: "Mental Health", keys: ["mental"] },
  { heading: "Head & Face", keys: ["headFace"] },
  { heading: "Neck / Shoulders", keys: ["neck", "shoulder"] },
  { heading: "Chest / Lungs", keys: ["chest"] },
  { heading: "Arms", keys: ["elbow", "wrist_hand"] },
  { heading: "Abdomen / Pelvis", keys: ["abdomen"] },
  { heading: "Hips", keys: ["hip"] },
  { heading: "Legs", keys: ["knee", "leg", "ankle_foot"] },
  { heading: "Other / Systemic", keys: ["systemic"] },
]

export const GROUPS_BACK: SidebarGroup[] = [
  { heading: "Mental Health", keys: ["mental"] },
  { heading: "Head & Face", keys: ["headFace"] },
  { heading: "Neck / Shoulders", keys: ["neck", "shoulder"] },
  { heading: "Back & Spine", keys: ["back"] },
  { heading: "Arms", keys: ["elbow", "wrist_hand"] },
  { heading: "Lower Body", keys: ["hip", "knee", "leg", "ankle_foot"] },
  { heading: "Other / Systemic", keys: ["systemic"] },
]

// ── KEY TO GROUP MAPPING ────────────────────────────────────────────────────

const KEY_TO_GROUP: Record<string, string> = {}
const mappings: [string, string[]][] = [
  ["head", ["head", "leftEar", "rightEar", "leftEye", "rightEye", "nose", "jaw"]],
  ["neck", ["neck"]],
  ["shoulder", ["leftShoulder", "rightShoulder"]],
  ["back", ["upperBack", "spine", "lowerBack"]],
  ["chest", ["chest", "leftLung", "rightLung"]],
  ["abdomen", ["abdomen", "pelvis", "glutes"]],
  ["hip", ["leftHip", "rightHip"]],
  ["elbow", ["leftElbow", "rightElbow"]],
  ["wrist_hand", ["leftWrist", "rightWrist", "leftForearm", "rightForearm", "leftHand", "rightHand"]],
  ["knee", ["leftKnee", "rightKnee"]],
  ["leg", ["leftThigh", "rightThigh", "leftShin", "rightShin", "leftHamstring", "rightHamstring", "leftCalf", "rightCalf"]],
  ["ankle_foot", ["leftAnkle", "rightAnkle", "leftFoot", "rightFoot"]],
  ["mental", ["mental"]],
  ["systemic", ["systemic"]],
]
for (const [group, keys] of mappings) {
  for (const k of keys) {
    KEY_TO_GROUP[k] = group
  }
}

export function getGroupForKey(key: string): string {
  return KEY_TO_GROUP[key] || "other"
}

// ── SEVERITY COLORS ─────────────────────────────────────────────────────────

export const SC: Record<string, string> = {
  mild: "#16a34a",
  moderate: "#d97706",
  severe: "#dc2626",
  custom: "#7c3aed",
}

export const SBG: Record<string, string> = {
  mild: "#f0fdf4",
  moderate: "#fffbeb",
  severe: "#fef2f2",
  custom: "#f5f3ff",
}

export const SBD: Record<string, string> = {
  mild: "#bbf7d0",
  moderate: "#fde68a",
  severe: "#fecaca",
  custom: "#ddd6fe",
}

// ── CONDITION LISTS PER BODY AREA ───────────────────────────────────────────

export const VA_AREA_CONDITIONS: Record<string, string[]> = {
  head: [
    "Migraine headaches", "Residuals of Traumatic Brain Injury (TBI)",
    "Temporomandibular disorder (TMD)", "Tinnitus, recurrent",
    "Vision impairment", "Cognitive disorder", "Vertigo / Dizziness",
    "Hearing impairment (hearing loss)",
    "Chronic suppurative otitis media, mastoiditis, or cholesteatoma (or any combination)",
    "Chronic nonsuppurative otitis media with effusion (serious otitis media)",
    "Otosclerosis", "Peripheral vestibular disorders",
    "Meniere's syndrome (endolymphatic hydrops)", "Loss of auricle",
    "Malignant neoplasm of the ear (other than skin only)",
    "Benign neoplasms of the ear (other than skin only)",
    "Chronic otitis externa", "Tympanic membrane, perforation of",
    "Loss of sense of smell, complete", "Loss of sense of taste, complete",
    "Cataract of any type", "Aphakia or dislocation of crystalline lens",
    "Diabetic retinopathy", "Diplopia (double vision)",
    "Disorders of the lacrimal apparatus (epiphora, dacryocystitis, etc.)",
    "Keratoconus", "Nystagmus, central", "Optic neuropathy",
    "Retinal dystrophy (including retinitis pigmentosa, wet or dry macular degeneration, early-onset macular degeneration, rod and/or cone dystrophy)",
    "Visual field defects", "Scotoma, unilateral",
    "Chronic conjunctivitis (nontrachomatous)", "Pterygium",
    "Ptosis, unilateral or bilateral", "Papilledema",
    "Post-chiasmal disorders", "Blepharitis",
    "Maxilla or mandible, chronic osteomyelitis, osteonecrosis or osteoradionecrosis of",
    "Fifth (trigeminal) cranial nerve, Neuralgia",
    "Seventh (facial) cranial nerve, Paralysis of",
    "Brain, vessels, hemorrhage from", "Brain, vessels, thrombosis of",
    "Burn scar(s) of the head, face, or neck; scar(s) of the head, face, or neck due to other causes; or other disfigurement of the head, face, or neck",
    "Sinusitis, chronic", "Rhinitis, allergic or vasomotor",
    "Deviated nasal septum",
    "Seizure disorder (epilepsy)",
  ],
  mental: [
    "Major depressive disorder", "Persistent depressive disorder (dysthymia)",
    "Unspecified depressive disorder", "Bipolar disorder", "Cyclothymic disorder",
    "Generalized anxiety disorder", "Unspecified anxiety disorder",
    "Panic disorder and/or agoraphobia", "Specific phobia; social anxiety disorder (social phobia)",
    "Obsessive compulsive disorder", "Posttraumatic stress disorder",
    "Acute stress disorder", "Unspecified trauma and stressor related disorder",
    "Chronic adjustment disorder", "Schizoaffective disorder",
    "Schizophrenia, disorganized type",
    "Other specified and unspecified schizophrenia spectrum and other psychotic disorders",
    "Delusional disorder", "Conversion disorder (functional neurological symptom disorder)",
    "Somatic symptom disorder", "Illness anxiety disorder",
    "Other specified somatic symptom and related disorder",
    "Unspecified somatic symptom and related disorder",
    "Depersonalization/Derealization disorder",
    "Dissociative amnesia; dissociative identity disorder",
    "Anorexia nervosa", "Bulimia nervosa", "Delirium",
    "Major or mild neurocognitive disorder due to traumatic brain injury",
    "Major or mild neurocognitive disorder due to Alzheimer's disease",
    "Major or mild neurocognitive disorder due to HIV or other infections",
    "Major or mild neurocognitive disorder due to another medical condition or substance/medication-induced major or mild neurocognitive disorder",
    "Major or mild vascular neurocognitive disorder",
    "Unspecified neurocognitive disorder",
    "Other and unspecified neurosis",
    "Military sexual trauma (MST)",
  ],
  neck: [
    "Cervical strain / sprain", "Cervical radiculopathy", "Cervical disc disease (DDD)",
    "Cervical spinal stenosis", "Cervical vertebral fracture", "Whiplash injury",
    "Cervical spondylosis", "Torticollis", "Neck muscle spasm", "Other neck condition",
  ],
  shoulder: [
    "Rotator cuff tear / tendinopathy", "Shoulder impingement", "Shoulder instability / dislocation",
    "Labral tear (SLAP)", "Frozen shoulder (adhesive capsulitis)", "AC joint separation",
    "Shoulder arthritis", "Shoulder bursitis", "Shoulder fracture", "Other shoulder condition",
  ],
  back: [
    "Lumbar strain / sprain", "Lumbar disc herniation", "Lumbar radiculopathy / sciatica",
    "Degenerative disc disease (lumbar)", "Spinal stenosis (lumbar)", "Thoracic strain",
    "Scoliosis", "Compression fracture", "Sacroiliac joint dysfunction",
    "Ankylosing spondylitis", "Intervertebral disc syndrome (IVDS)", "Other back / spine condition",
  ],
  chest: [
    "Asthma", "COPD / chronic bronchitis", "Pulmonary embolism",
    "Costochondritis", "Rib fracture", "Restrictive lung disease",
    "Sleep apnea", "Pleural effusion", "Pneumothorax",
    "Chronic cough", "Chest wall pain", "Other chest / lung condition",
  ],
  abdomen: [
    "GERD / acid reflux", "Irritable bowel syndrome (IBS)", "Hiatal hernia",
    "Inguinal hernia", "Peptic ulcer disease", "Crohn's disease",
    "Ulcerative colitis", "Gallbladder disease", "Kidney stones",
    "Liver condition", "Bladder condition", "Pelvic pain", "Other abdominal condition",
  ],
  hip: [
    "Hip osteoarthritis", "Hip labral tear", "Hip bursitis (trochanteric)",
    "Hip impingement (FAI)", "Hip fracture", "Avascular necrosis of hip",
    "Hip flexor strain", "Snapping hip syndrome", "Hip replacement (total)",
    "Other hip condition",
  ],
  elbow: [
    "Lateral epicondylitis (tennis elbow)", "Medial epicondylitis (golfer's elbow)",
    "Elbow bursitis (olecranon)", "Cubital tunnel syndrome", "Elbow fracture",
    "Elbow arthritis", "Forearm fracture", "Forearm muscle strain",
    "Elbow dislocation", "Other elbow / forearm condition",
  ],
  wrist_hand: [
    "Carpal tunnel syndrome", "De Quervain's tenosynovitis", "Wrist fracture",
    "Trigger finger", "Dupuytren's contracture", "Hand / finger fracture",
    "Wrist sprain", "Ganglion cyst", "Wrist arthritis", "Hand arthritis",
    "Raynaud's phenomenon", "Other wrist / hand condition",
  ],
  knee: [
    "Knee osteoarthritis", "ACL tear / reconstruction", "Meniscus tear",
    "Patellar tendinitis", "Patellofemoral syndrome", "MCL / LCL sprain",
    "Knee bursitis", "Knee instability", "Knee replacement (total)",
    "Baker's cyst", "Chondromalacia patella", "Other knee condition",
  ],
  leg: [
    "Shin splints (MTSS)", "Stress fracture (tibia / fibula)", "Hamstring strain",
    "Quadriceps strain", "Calf strain / tear", "Deep vein thrombosis (DVT)",
    "Peripheral neuropathy", "Femur fracture", "Compartment syndrome",
    "Varicose veins", "Muscle atrophy", "Other leg condition",
  ],
  ankle_foot: [
    "Ankle sprain (chronic)", "Ankle instability", "Achilles tendinitis / rupture",
    "Plantar fasciitis", "Flat feet (pes planus)", "Ankle fracture",
    "Foot fracture (metatarsal / stress)", "Bunion (hallux valgus)", "Heel spurs",
    "Morton's neuroma", "Tarsal tunnel syndrome", "Diabetic foot neuropathy",
    "Other ankle / foot condition",
  ],
  systemic: [
    "Systemic lupus erythematosus (SLE)", "Rheumatoid arthritis", "Multiple sclerosis",
    "Myasthenia gravis", "Guillain-Barr\u00e9 syndrome", "Sj\u00f6gren's syndrome",
    "Psoriatic arthritis", "Celiac disease",
    "Diabetes mellitus", "Diabetes mellitus, Type 2", "Diabetes mellitus, Type 1",
    "Hypothyroidism", "Hashimoto's thyroiditis", "Hyperthyroidism", "Graves' disease",
    "Addison's disease", "Cushing's syndrome", "Hyperparathyroidism",
    "Hypogonadism / low testosterone",
    "Parkinson's disease", "Seizure disorder (epilepsy)",
    "Restless leg syndrome", "Peripheral artery disease",
    "Dermatitis or eczema", "Psoriasis", "Acne vulgaris", "Contact dermatitis",
    "Seborrheic dermatitis", "Pseudofolliculitis barbae", "Folliculitis",
    "Hidradenitis suppurativa", "Alopecia areata", "Chloracne",
    "Tinea pedis (athlete's foot)", "Hyperhidrosis", "Chronic urticaria", "Vitiligo",
    "Skin cancer (basal cell, squamous cell, melanoma)", "Keloid scarring",
    "Scar(s), unstable or painful", "Burn scar(s)",
    "Fibromyalgia", "Chronic fatigue syndrome", "Chronic pain syndrome",
    "Hypertension", "Raynaud's syndrome", "Raynaud's phenomenon",
    "GERD / acid reflux", "Hiatal hernia", "Irritable bowel syndrome (IBS)",
    "Erectile dysfunction", "Loss of use of creative organ",
    "SIRVA (shoulder injury related to vaccine administration)",
    "Myocarditis (vaccine-related)", "Transverse myelitis",
    "Small fiber neuropathy", "CIDP (chronic inflammatory demyelinating polyneuropathy)",
    "Constrictive bronchiolitis", "Respiratory cancer",
    "Kidney cancer / renal cell carcinoma", "Bladder cancer", "Prostate cancer",
    "Pancreatic cancer", "Glioblastoma / brain cancer",
    "Sickle cell anemia", "Iron deficiency anemia",
    "Lyme disease", "Sarcoidosis", "HIV/AIDS", "Hepatitis B", "Hepatitis C",
    "Gout", "Obesity (secondary)", "Amyloidosis",
    "Other systemic condition",
  ],
}

// ── HEAD KEYS (for quickSelect routing) ────────────────────────────────────

export const HEAD_KEYS = [
  "headFace", "head", "leftEar", "rightEar", "leftEye", "rightEye", "nose", "jaw",
]

// ── BP_REGISTRY ────────────────────────────────────────────────────────────

export const BP_REGISTRY: Record<string, BPRegistryEntry> = {
  knee: {
    id: "knee",
    title: "Knee Evaluation",
    conditions: "knee",
    sideKeys: { leftKnee: "Left", rightKnee: "Right" },
    extremityMap: { leftKnee: "LL", rightKnee: "RL" },
    note: "Knee conditions can be rated for how far it bends, whether it gives out, and cartilage damage — each rated separately. All contribute to your combined VA rating.",
  },
  back: {
    id: "back",
    title: "Back & Spine Evaluation",
    conditions: "back",
    sideKeys: { upperBack: "Upper", spine: "Mid", lowerBack: "Lower" },
    extremityMap: {},
    note: "Back conditions are rated based on how far you can bend and move your spine. Nerve pain that shoots down your legs (radiculopathy/sciatica) is rated as a separate condition.",
  },
  shoulder: {
    id: "shoulder",
    title: "Shoulder Evaluation",
    conditions: "shoulder",
    sideKeys: { leftShoulder: "Left", rightShoulder: "Right" },
    extremityMap: { leftShoulder: "LU", rightShoulder: "RU" },
    note: "Shoulder conditions are rated on how far you can raise and move your arm, whether it dislocates or slips, and any bone or joint damage.",
  },
  neck: {
    id: "neck",
    title: "Neck Evaluation",
    conditions: "neck",
    sideKeys: { neck: "Neck" },
    extremityMap: {},
    note: "Neck conditions are rated on how far you can turn and tilt your head. Nerve pain, numbness, or tingling that travels down your arms (radiculopathy) is rated as a separate condition.",
  },
  hip: {
    id: "hip",
    title: "Hip Evaluation",
    conditions: "hip",
    sideKeys: { leftHip: "Left", rightHip: "Right" },
    extremityMap: { leftHip: "LL", rightHip: "RL" },
    note: "Hip conditions are rated on how far you can bend, straighten, and spread your leg. The worse your movement limitation, the higher the rating.",
  },
  elbow: {
    id: "elbow",
    title: "Elbow / Forearm Evaluation",
    conditions: "elbow",
    sideKeys: { leftElbow: "Left", rightElbow: "Right", leftForearm: "Left Forearm", rightForearm: "Right Forearm" },
    extremityMap: { leftElbow: "LU", rightElbow: "RU", leftForearm: "LU", rightForearm: "RU" },
    note: "Elbow and forearm conditions are rated on how far you can bend, straighten, and rotate your arm (like turning a doorknob or screwdriver).",
  },
  wrist_hand: {
    id: "wrist_hand",
    title: "Wrist / Hand Evaluation",
    conditions: "wrist_hand",
    sideKeys: { leftWrist: "Left Wrist", rightWrist: "Right Wrist", leftHand: "Left Hand", rightHand: "Right Hand" },
    extremityMap: { leftWrist: "LU", rightWrist: "RU", leftHand: "LU", rightHand: "RU" },
    note: "Wrist and hand conditions are rated on how well you can move your wrist, grip strength, nerve problems (like carpal tunnel causing numbness/tingling), and finger function.",
  },
  ankle_foot: {
    id: "ankle_foot",
    title: "Ankle / Foot Evaluation",
    conditions: "ankle_foot",
    sideKeys: { leftAnkle: "Left Ankle", rightAnkle: "Right Ankle", leftFoot: "Left Foot", rightFoot: "Right Foot" },
    extremityMap: { leftAnkle: "LL", rightAnkle: "RL", leftFoot: "LL", rightFoot: "RL" },
    note: "Ankle and foot conditions are rated on how far you can move your ankle, whether it gives out, flat feet, and heel/arch pain (plantar fasciitis).",
  },
  chest: {
    id: "chest",
    title: "Chest / Lungs Evaluation",
    conditions: "chest",
    sideKeys: { chest: "Chest", leftLung: "Left Lung", rightLung: "Right Lung" },
    extremityMap: {},
    note: "Breathing conditions are rated on how well your lungs work (based on breathing tests) and whether you need oxygen or inhalers.",
  },
  abdomen: {
    id: "abdomen",
    title: "Abdomen / Pelvis Evaluation",
    conditions: "abdomen",
    sideKeys: { abdomen: "Abdomen", pelvis: "Pelvis" },
    extremityMap: {},
    note: "Stomach, digestive, bladder, and pelvic conditions are rated on how often symptoms occur, how severe they are, and what treatment you need.",
  },
  leg: {
    id: "leg",
    title: "Thigh / Shin / Calf Evaluation",
    conditions: "leg",
    sideKeys: { leftThigh: "Left Thigh", rightThigh: "Right Thigh", leftShin: "Left Shin", rightShin: "Right Shin", leftHamstring: "Left Hamstring", rightHamstring: "Right Hamstring", leftCalf: "Left Calf", rightCalf: "Right Calf" },
    extremityMap: { leftThigh: "LL", rightThigh: "RL", leftShin: "LL", rightShin: "RL", leftHamstring: "LL", rightHamstring: "RL", leftCalf: "LL", rightCalf: "RL" },
    note: "Leg muscle injuries are rated based on how badly the muscle is damaged and how it affects your strength and movement. Nerve damage causing numbness or weakness (neuropathy) is rated as a separate condition.",
  },
  systemic: {
    id: "systemic",
    title: "Other / Systemic Evaluation",
    conditions: "systemic",
    sideKeys: { systemic: "Overall" },
    extremityMap: {},
    note: "Whole-body conditions like diabetes, thyroid problems, skin conditions, immune system disorders, and chronic pain are evaluated here. These are conditions that affect your overall health rather than one specific body part.",
  },
}

// ── BILATERAL HELPERS ──────────────────────────────────────────────────────

export function hasBilateralSides(regionId: string): boolean {
  const cfg = BP_REGISTRY[regionId]
  if (!cfg) return false
  const entries = Object.entries(cfg.sideKeys)
  return (
    entries.some(([k]) => k.toLowerCase().startsWith("left")) &&
    entries.some(([k]) => k.toLowerCase().startsWith("right"))
  )
}

export function getOppositeSideKey(regionId: string, pinKey: string): string | null {
  const cfg = BP_REGISTRY[regionId]
  if (!cfg) return null
  const keys = Object.keys(cfg.sideKeys)
  const lower = pinKey.toLowerCase()
  if (lower.startsWith("left")) {
    const suffix = pinKey.substring(4)
    return keys.find((k) => k.toLowerCase() === "right" + suffix.toLowerCase()) || null
  }
  if (lower.startsWith("right")) {
    const suffix = pinKey.substring(5)
    return keys.find((k) => k.toLowerCase() === "left" + suffix.toLowerCase()) || null
  }
  return null
}

export function getBilateralBodyName(regionId: string): string {
  const map: Record<string, string> = {
    knee: "knees",
    shoulder: "shoulders",
    hip: "hips",
    elbow: "elbows",
    wrist_hand: "wrists/hands",
    ankle_foot: "ankles/feet",
    leg: "legs",
  }
  return map[regionId] || regionId
}

// ── FUNCTIONAL IMPACT OPTIONS ───────────────────────────────────────────────

export const IMPACT_OPTIONS: string[] = [
  "Cannot stand for long periods",
  "Difficulty lifting objects",
  "Sleep disruption",
  "Difficulty driving",
  "Limited range of motion",
  "Chronic pain",
  "Difficulty walking",
  "Difficulty sitting",
  "Cognitive difficulty / focus",
  "Memory problems",
  "Difficulty with stairs",
  "Unable to exercise",
  "Difficulty gripping / fine motor",
  "Hearing difficulty",
  "Vision impairment",
  "Difficulty bending / kneeling",
  "Balance problems",
  "Anxiety in daily activities",
  "Difficulty with personal care",
]
