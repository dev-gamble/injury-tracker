// ── VA CONDITION LISTS BY BODY AREA ───────────────────────────────────────────

export const VA_AREA_CONDITIONS: Record<string, string[]> = {
  head: [
    'Migraine headaches', 'Residuals of Traumatic Brain Injury (TBI)',
    'Temporomandibular disorder (TMD)', 'Sinusitis, chronic', 'Rhinitis, allergic or vasomotor',
    'Tinnitus, recurrent', 'Hearing impairment (hearing loss)', 'Vision impairment',
    'Vertigo / Dizziness', 'Cognitive disorder', 'Seizure disorder (epilepsy)',
    'Other head / face condition',
  ],
  mental: [
    'Major depressive disorder', 'Persistent depressive disorder (dysthymia)',
    'Unspecified depressive disorder', 'Bipolar disorder', 'Cyclothymic disorder',
    'Generalized anxiety disorder', 'Unspecified anxiety disorder',
    'Panic disorder and/or agoraphobia', 'Specific phobia; social anxiety disorder (social phobia)',
    'Obsessive compulsive disorder', 'Posttraumatic stress disorder',
    'Chronic adjustment disorder', 'Schizoaffective disorder', 'Schizophrenia, disorganized type',
    'Delusional disorder', 'Conversion disorder (functional neurological symptom disorder)',
    'Somatic symptom disorder', 'Illness anxiety disorder',
    'Depersonalization/Derealization disorder', 'Dissociative amnesia; dissociative identity disorder',
    'Anorexia nervosa', 'Bulimia nervosa', 'Delirium',
    'Major or mild neurocognitive disorder due to traumatic brain injury',
    'Major or mild neurocognitive disorder due to Alzheimer\'s disease',
    'Unspecified neurocognitive disorder', 'Military sexual trauma (MST)',
  ],
  neck: [
    'Cervical strain / sprain', 'Cervical radiculopathy', 'Cervical disc disease (DDD)',
    'Cervical spinal stenosis', 'Cervical vertebral fracture', 'Whiplash injury',
    'Cervical spondylosis', 'Torticollis', 'Neck muscle spasm', 'Other neck condition',
  ],
  shoulder: [
    'Rotator cuff tear / tendinopathy', 'Shoulder impingement', 'Shoulder instability / dislocation',
    'Labral tear (SLAP)', 'Frozen shoulder (adhesive capsulitis)', 'AC joint separation',
    'Shoulder arthritis', 'Shoulder bursitis', 'Shoulder fracture', 'Other shoulder condition',
  ],
  back: [
    'Lumbar strain / sprain', 'Lumbar disc herniation', 'Lumbar radiculopathy / sciatica',
    'Degenerative disc disease (lumbar)', 'Spinal stenosis (lumbar)', 'Thoracic strain',
    'Scoliosis', 'Compression fracture', 'Sacroiliac joint dysfunction',
    'Ankylosing spondylitis', 'Intervertebral disc syndrome (IVDS)', 'Other back / spine condition',
  ],
  chest: [
    'Asthma', 'COPD / chronic bronchitis', 'Pulmonary embolism',
    'Costochondritis', 'Rib fracture', 'Restrictive lung disease',
    'Sleep apnea', 'Pleural effusion', 'Pneumothorax',
    'Chronic cough', 'Chest wall pain', 'Other chest / lung condition',
  ],
  abdomen: [
    'GERD / acid reflux', 'Irritable bowel syndrome (IBS)', 'Hiatal hernia',
    'Inguinal hernia', 'Peptic ulcer disease', "Crohn's disease",
    'Ulcerative colitis', 'Gallbladder disease', 'Kidney stones',
    'Liver condition', 'Bladder condition', 'Pelvic pain', 'Other abdominal condition',
  ],
  hip: [
    'Hip osteoarthritis', 'Hip labral tear', 'Hip bursitis (trochanteric)',
    'Hip impingement (FAI)', 'Hip fracture', 'Avascular necrosis of hip',
    'Hip flexor strain', 'Snapping hip syndrome', 'Hip replacement (total)',
    'Other hip condition',
  ],
  elbow: [
    'Lateral epicondylitis (tennis elbow)', "Medial epicondylitis (golfer's elbow)",
    'Elbow bursitis (olecranon)', 'Cubital tunnel syndrome', 'Elbow fracture',
    'Elbow arthritis', 'Forearm fracture', 'Forearm muscle strain',
    'Elbow dislocation', 'Other elbow / forearm condition',
  ],
  wrist_hand: [
    'Carpal tunnel syndrome', "De Quervain's tenosynovitis", 'Wrist fracture',
    'Trigger finger', "Dupuytren's contracture", 'Hand / finger fracture',
    'Wrist sprain', 'Ganglion cyst', 'Wrist arthritis', 'Hand arthritis',
    "Raynaud's phenomenon", 'Other wrist / hand condition',
  ],
  knee: [
    'Knee osteoarthritis', 'ACL tear / reconstruction', 'Meniscus tear',
    'Patellar tendinitis', 'Patellofemoral syndrome', 'MCL / LCL sprain',
    'Knee bursitis', 'Knee instability', 'Knee replacement (total)',
    "Baker's cyst", 'Chondromalacia patella', 'Other knee condition',
  ],
  leg: [
    'Shin splints (MTSS)', 'Stress fracture (tibia / fibula)', 'Hamstring strain',
    'Quadriceps strain', 'Calf strain / tear', 'Deep vein thrombosis (DVT)',
    'Peripheral neuropathy', 'Femur fracture', 'Compartment syndrome',
    'Varicose veins', 'Muscle atrophy', 'Other leg condition',
  ],
  ankle_foot: [
    'Ankle sprain (chronic)', 'Ankle instability', 'Achilles tendinitis / rupture',
    'Plantar fasciitis', 'Flat feet (pes planus)', 'Ankle fracture',
    'Foot fracture (metatarsal / stress)', 'Bunion (hallux valgus)', 'Heel spurs',
    "Morton's neuroma", 'Tarsal tunnel syndrome', 'Diabetic foot neuropathy',
    'Other ankle / foot condition',
  ],
  systemic: [
    'Systemic lupus erythematosus (SLE)', 'Rheumatoid arthritis', 'Multiple sclerosis',
    'Fibromyalgia', 'Chronic fatigue syndrome', 'Chronic pain syndrome',
    'Hypertension', 'Diabetes mellitus', 'Hypothyroidism', 'Hyperthyroidism',
    "Parkinson's disease", 'Seizure disorder (epilepsy)', 'Restless leg syndrome',
    'Dermatitis or eczema', 'Psoriasis', 'Pseudofolliculitis barbae',
    'GERD / acid reflux', 'Irritable bowel syndrome (IBS)',
    'Erectile dysfunction', 'Loss of use of creative organ',
    'SIRVA (shoulder injury related to vaccine administration)',
    'Myocarditis (vaccine-related)', 'Small fiber neuropathy',
    'Constrictive bronchiolitis', 'Lyme disease', 'Sarcoidosis',
    'Hepatitis B', 'Hepatitis C',
    'Other systemic / other condition',
  ],
}

// ── FUNCTIONAL IMPACT OPTIONS ──────────────────────────────────────────────────
export const FUNCTIONAL_IMPACTS = [
  'Cannot stand for long periods',
  'Difficulty lifting objects',
  'Sleep disruption',
  'Difficulty driving',
  'Limited range of motion',
  'Chronic pain',
  'Difficulty walking',
  'Difficulty sitting',
  'Cognitive difficulty / focus',
  'Memory problems',
  'Difficulty with stairs',
  'Unable to exercise',
  'Difficulty gripping / fine motor',
  'Hearing difficulty',
  'Vision impairment',
  'Difficulty bending / kneeling',
  'Balance problems',
  'Anxiety in daily activities',
  'Difficulty with personal care',
]

// ── BP PANEL AREAS (areas that open an eval panel, not the injury form) ─────────
// These areas close the form and open their dedicated eval panel
export const BP_PANEL_AREAS = new Set([
  'head', 'mental',
  'knee', 'back', 'shoulder', 'neck', 'hip', 'elbow', 'wrist_hand', 'ankle_foot',
  'chest', 'abdomen', 'leg', 'systemic',
])
