// ── DATA CONSTANTS ── Pin coordinates, groups, secondary condition maps
const MENTAL_PINS = {"mental": {"label": "Mental Health", "x": 52, "y": 10}};
const HEAD_PINS = {"headFace": {"label": "Head & Face", "x": 52, "y": 17}};
const FRONT_PINS = {"head": {"label": "Head", "x": 52, "y": 17}, "leftEar": {"label": "Left Ear", "x": 30, "y": 17}, "rightEar": {"label": "Right Ear", "x": 73, "y": 17}, "leftEye": {"label": "Left Eye", "x": 40, "y": 14}, "rightEye": {"label": "Right Eye", "x": 63, "y": 14}, "nose": {"label": "Nose", "x": 52, "y": 16}, "jaw": {"label": "Jaw / TMJ", "x": 52, "y": 22}, "neck": {"label": "Neck", "x": 52, "y": 25}, "leftShoulder": {"label": "Left Shoulder", "x": 21, "y": 30}, "rightShoulder": {"label": "Right Shoulder", "x": 80, "y": 30}, "chest": {"label": "Chest", "x": 52, "y": 34}, "leftLung": {"label": "Left Lung", "x": 35, "y": 34}, "rightLung": {"label": "Right Lung", "x": 68, "y": 34}, "abdomen": {"label": "Abdomen", "x": 52, "y": 46}, "leftElbow": {"label": "Left Elbow", "x": 19, "y": 42}, "rightElbow": {"label": "Right Elbow", "x": 83, "y": 42}, "leftForearm": {"label": "Left Forearm", "x": 13, "y": 49}, "rightForearm": {"label": "Right Forearm", "x": 88, "y": 49}, "leftWrist": {"label": "Left Wrist", "x": 10, "y": 54}, "rightWrist": {"label": "Right Wrist", "x": 90, "y": 54}, "leftHand": {"label": "Left Hand", "x": 14, "y": 57}, "rightHand": {"label": "Right Hand", "x": 87, "y": 57}, "leftHip": {"label": "Left Hip", "x": 37, "y": 54}, "rightHip": {"label": "Right Hip", "x": 63, "y": 54}, "pelvis": {"label": "Pelvis / Groin", "x": 52, "y": 55}, "leftThigh": {"label": "Left Thigh", "x": 38, "y": 63}, "rightThigh": {"label": "Right Thigh", "x": 62, "y": 63}, "leftKnee": {"label": "Left Knee", "x": 38, "y": 70}, "rightKnee": {"label": "Right Knee", "x": 62, "y": 70}, "leftShin": {"label": "Left Shin", "x": 38, "y": 77}, "rightShin": {"label": "Right Shin", "x": 62, "y": 77}, "leftAnkle": {"label": "Left Ankle", "x": 38, "y": 84}, "rightAnkle": {"label": "Right Ankle", "x": 62, "y": 84}, "leftFoot": {"label": "Left Foot", "x": 37, "y": 87}, "rightFoot": {"label": "Right Foot", "x": 62, "y": 87}};
const BACK_PINS  = {"head": {"label": "Head", "x": 52, "y": 17}, "neck": {"label": "Neck", "x": 52, "y": 25}, "leftShoulder": {"label": "Left Shoulder", "x": 21, "y": 30}, "rightShoulder": {"label": "Right Shoulder", "x": 80, "y": 30}, "upperBack": {"label": "Upper Back", "x": 52, "y": 34}, "spine": {"label": "Spine", "x": 52, "y": 43}, "lowerBack": {"label": "Lower Back", "x": 52, "y": 49}, "leftElbow": {"label": "Left Elbow", "x": 19, "y": 42}, "rightElbow": {"label": "Right Elbow", "x": 83, "y": 42}, "leftForearm": {"label": "Left Forearm", "x": 13, "y": 49}, "rightForearm": {"label": "Right Forearm", "x": 88, "y": 49}, "leftWrist": {"label": "Left Wrist", "x": 10, "y": 54}, "rightWrist": {"label": "Right Wrist", "x": 90, "y": 54}, "leftHand": {"label": "Left Hand", "x": 14, "y": 57}, "rightHand": {"label": "Right Hand", "x": 87, "y": 57}, "glutes": {"label": "Glutes", "x": 52, "y": 56}, "leftHamstring": {"label": "Left Hamstring", "x": 38, "y": 63}, "rightHamstring": {"label": "Right Hamstring", "x": 62, "y": 63}, "leftKnee": {"label": "Left Knee", "x": 38, "y": 70}, "rightKnee": {"label": "Right Knee", "x": 62, "y": 70}, "leftCalf": {"label": "Left Calf", "x": 38, "y": 77}, "rightCalf": {"label": "Right Calf", "x": 62, "y": 77}, "leftAnkle": {"label": "Left Ankle", "x": 38, "y": 84}, "rightAnkle": {"label": "Right Ankle", "x": 62, "y": 84}, "leftFoot": {"label": "Left Foot", "x": 37, "y": 87}, "rightFoot": {"label": "Right Foot", "x": 62, "y": 87}};

const SIDEBAR_ITEMS = {
  mental:'Mental Health', headFace:'Head & Face', neck:'Neck',
  shoulder:'Shoulders', chest:'Chest / Lungs', elbow:'Elbow / Forearm',
  wrist_hand:'Wrist / Hand', abdomen:'Abdomen / Pelvis', hip:'Hips',
  knee:'Knees', leg:'Thigh / Shin / Calf', ankle_foot:'Ankle / Foot',
  back:'Back & Spine', systemic:'Other / Systemic',
};
const GROUPS_FRONT = [
  ["Mental Health",     ["mental"]],
  ["Head & Face",       ["headFace"]],
  ["Neck / Shoulders",  ["neck","shoulder"]],
  ["Chest / Lungs",     ["chest"]],
  ["Arms",              ["elbow","wrist_hand"]],
  ["Abdomen / Pelvis",  ["abdomen"]],
  ["Hips",              ["hip"]],
  ["Legs",              ["knee","leg","ankle_foot"]],
  ["Other / Systemic",  ["systemic"]],
];
const GROUPS_BACK = [
  ["Mental Health",     ["mental"]],
  ["Head & Face",       ["headFace"]],
  ["Neck / Shoulders",  ["neck","shoulder"]],
  ["Back & Spine",      ["back"]],
  ["Arms",              ["elbow","wrist_hand"]],
  ["Lower Body",        ["hip","knee","leg","ankle_foot"]],
  ["Other / Systemic",  ["systemic"]],
];

const SC = {mild:"#16a34a",moderate:"#d97706",severe:"#dc2626",custom:"#7c3aed"};
const SBG = {mild:"#f0fdf4",moderate:"#fffbeb",severe:"#fef2f2",custom:"#f5f3ff"};
const SBD = {mild:"#bbf7d0",moderate:"#fde68a",severe:"#fecaca",custom:"#ddd6fe"};

// ── CONDITION INFO FIELDS (shared across all panels) ────────────────────────
// Keys managed by evaluation panels (not the injuries array)
function _getPanelKeys(){
  const s = new Set(['mental','headFace','head']);
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      Object.keys(cfg.sideKeys).forEach(k => s.add(k));
      s.add(cfg.id);
    });
  }
  return s;
}

// Returns default info field values for new conditions
function _condInfoDefaults(){ return {date:'',location:'',event:'',description:'',medicalCare:'',clinicName:'',witnesses:'',stillBeingSeen:false}; }

// Renders the info fields HTML for a condition card
function _condInfoHTML(type, cond){
  const id = cond.id;
  const c = function(f){ return "_updateCondInfo('"+type+"',"+id+",'"+f+"',this.value)"; };
  let h = '<div class="cond-info-fields">';
  h += '<div class="cond-info-row">'+
    '<label class="cond-info-lbl">Date <span style="color:var(--red)">*</span> <span class="tip tip-right" data-tip="When did this injury happen or start? If you don\'t remember the exact date, your best estimate is fine. This is used for your timeline and helps show when conditions began.">?</span></label>'+
    '<input type="date" class="cond-info-input" value="'+(cond.date||'')+'" onchange="'+c('date')+'">';
  if(!cond.date) h += '<span class="cond-info-req">Required for timeline</span>';
  h += '</div>';
  h += '<div class="cond-info-row">'+
    '<label class="cond-info-lbl">Location <span class="tip tip-right" data-tip="Where were you stationed when this happened? (base, deployment location, training site). This helps connect the injury to your service — especially useful if medical records from that location exist.">?</span></label>'+
    '<input type="text" class="cond-info-input" placeholder="Duty station, base, deployment..." value="'+(cond.location||'').replace(/"/g,'&quot;')+'" onchange="'+c('location')+'">';
  h += '</div>';
  h += '<div class="cond-info-row">'+
    '<label class="cond-info-lbl">Event / Cause <span class="tip tip-right" data-tip="What happened that caused or aggravated this condition? Be specific — e.g., \'jumped from vehicle during training\' or \'repetitive heavy lifting.\' This is the nexus event the VA uses to connect the injury to service.">?</span></label>'+
    '<input type="text" class="cond-info-input" placeholder="What happened..." value="'+(cond.event||'').replace(/"/g,'&quot;')+'" onchange="'+c('event')+'">';
  h += '</div>';
  h += '<div class="cond-info-row">'+
    '<label class="cond-info-lbl">Description</label>'+
    '<input type="text" class="cond-info-input" placeholder="Brief description..." value="'+(cond.description||'').replace(/"/g,'&quot;')+'" onchange="'+c('description')+'">';
  h += '</div>';
  h += '<div class="cond-info-row">'+
    '<label class="cond-info-lbl">Medical Care <span class="tip tip-right" data-tip="Did you see a doctor, go to sick call, or visit the ER for this? Medical records are the strongest evidence, but you can still file a claim without them. If yes, note the clinic or provider name.">?</span></label>'+
    '<select class="cond-info-select" onchange="'+c('medicalCare')+'">'+
      '<option value="">—</option>'+
      '<option value="yes"'+(cond.medicalCare==='yes'?' selected':'')+'>Yes</option>'+
      '<option value="no"'+(cond.medicalCare==='no'?' selected':'')+'>No</option>'+
    '</select>';
  if(cond.medicalCare==='yes'){
    h += '<input type="text" class="cond-info-input" placeholder="Clinic / provider name" value="'+(cond.clinicName||'').replace(/"/g,'&quot;')+'" onchange="'+c('clinicName')+'" style="flex:1;">';
  }
  h += '<label style="display:flex;align-items:center;gap:5px;margin-left:8px;white-space:nowrap;cursor:pointer;">'+
    '<input type="checkbox" '+(cond.stillBeingSeen?'checked':'')+' onchange="_updateCondInfo(\''+type+'\','+id+',\'stillBeingSeen\',this.checked)" style="width:14px;height:14px;accent-color:var(--red);cursor:pointer;">'+
    '<span style="font-size:10px;font-weight:700;font-family:var(--fh);color:var(--navy);text-transform:uppercase;letter-spacing:.3px;">Still being seen <span class="tip" data-tip="Are you still receiving treatment for this condition? Ongoing treatment shows the VA that the problem hasn\'t gone away and is still affecting you.">?</span></span>'+
  '</label>';
  h += '</div>';
  h += '<div class="cond-info-row">'+
    '<label class="cond-info-lbl">Witnesses <span class="tip tip-right" data-tip="Anyone who saw what happened or can confirm your condition — fellow service members, supervisors, medics. Their statements (called \'buddy letters\') can be powerful evidence for your claim.">?</span></label>'+
    '<input type="text" class="cond-info-input" placeholder="Names of witnesses (if any)" value="'+(cond.witnesses||'').replace(/"/g,'&quot;')+'" onchange="'+c('witnesses')+'">';
  h += '</div>';
  h += '</div>';
  return h;
}

// Global update handler for condition info fields
function _updateCondInfo(type, condId, field, value){
  let cond, rerender;
  if(type==='mh'){
    cond = (window._mentalHealthConditions||[]).find(c=>c.id===condId);
    rerender = function(){ if(typeof renderMentalPanel==='function') renderMentalPanel(); };
  } else if(type==='head'){
    cond = (window._headConditions||[]).find(c=>c.id===condId);
    rerender = function(){ if(typeof renderHeadPanel==='function') renderHeadPanel(); };
  } else {
    const cfg = typeof BP_REGISTRY!=='undefined' ? BP_REGISTRY[type] : null;
    if(cfg) cond = (window[cfg.stateKey]||[]).find(c=>c.id===condId);
    rerender = function(){ if(typeof renderBPPanel==='function') renderBPPanel(type); };
  }
  if(!cond) return;
  cond[field] = value;
  // Only full re-render for medicalCare (show/hide clinic field)
  if(field==='medicalCare') rerender();
  if(typeof updateCount==='function') updateCount();
}

// ── MENTAL HEALTH CONDITION EXAMPLES ─────────────────────────────────────────
const MH_EXAMPLES = {
  "Major depressive disorder": "insomnia, fatigue, appetite changes, hopelessness",
  "Persistent depressive disorder (dysthymia)": "chronic low mood, fatigue, poor concentration",
  "Unspecified depressive disorder": "low mood, sleep changes, loss of interest",
  "Bipolar disorder": "mood swings, insomnia, impulsivity, mania",
  "Cyclothymic disorder": "mild mood swings, emotional instability",
  "Generalized anxiety disorder": "insomnia, restlessness, irritability, muscle tension",
  "Unspecified anxiety disorder": "worry, sleep difficulty, nervousness",
  "Panic disorder and/or agoraphobia": "chest tightness, racing heart, shortness of breath",
  "Specific phobia; social anxiety disorder (social phobia)": "avoidance, fear of social situations, dread",
  "Obsessive compulsive disorder": "intrusive thoughts, repetitive behaviors, rituals",
  "Posttraumatic stress disorder": "nightmares, insomnia, hypervigilance, flashbacks",
  "Chronic adjustment disorder": "stress response, difficulty coping, emotional distress",
  "Schizoaffective disorder": "hallucinations, mood episodes, disorganized thinking",
  "Schizophrenia, disorganized type": "hallucinations, delusions, disorganized speech",
  "Delusional disorder": "fixed false beliefs, paranoia",
  "Conversion disorder (functional neurological symptom disorder)": "weakness, tremors, numbness without medical cause",
  "Somatic symptom disorder": "chronic pain focus, excessive health worry",
  "Illness anxiety disorder": "fear of serious illness, body checking, reassurance seeking",
  "Depersonalization/Derealization disorder": "feeling detached from self, surroundings feel unreal",
  "Dissociative amnesia; dissociative identity disorder": "memory gaps, identity confusion",
  "Anorexia nervosa": "food restriction, weight loss, body image distortion",
  "Bulimia nervosa": "binge eating, purging, weight fluctuation",
  "Delirium": "confusion, disorientation, attention deficits",
  "Major or mild neurocognitive disorder due to traumatic brain injury": "memory loss, concentration problems, headaches",
  "Major or mild neurocognitive disorder due to Alzheimer's disease": "progressive memory loss, confusion, disorientation",
  "Major or mild neurocognitive disorder due to HIV or other infections": "cognitive decline, memory issues, slowed thinking",
  "Major or mild neurocognitive disorder due to another medical condition or substance/medication-induced major or mild neurocognitive disorder": "cognitive impairment, memory problems",
  "Major or mild vascular neurocognitive disorder": "memory loss, slowed thinking after stroke",
  "Unspecified neurocognitive disorder": "cognitive decline, memory or attention issues",
  "Military sexual trauma (MST)": "anxiety, insomnia, hypervigilance, avoidance"
};

// ── PHYSICAL CONDITION EXAMPLES ──────────────────────────────────────────────
const PHYS_EXAMPLES = {
  // Neck
  "Cervical radiculopathy": "arm numbness, tingling, shooting pain",
  "Cervical spondylosis": "neck stiffness, grinding, bone spurs",
  "Torticollis": "neck stuck turned to one side",
  // Shoulder
  "Labral tear (SLAP)": "clicking, catching, deep shoulder pain",
  "AC joint separation": "bump on top of shoulder, pain reaching across body",
  "Shoulder impingement": "pain raising arm overhead",
  // Back
  "Lumbar radiculopathy / sciatica": "leg pain, numbness, shooting down leg",
  "Sacroiliac joint dysfunction": "lower back/buttock pain, worse sitting",
  "Spinal stenosis (lumbar)": "leg weakness, pain walking that eases sitting",
  "Intervertebral disc syndrome (IVDS)": "back pain with leg symptoms, flare-ups",
  // Chest
  "Costochondritis": "chest wall pain, mimics heart attack",
  "Restrictive lung disease": "difficulty taking deep breaths",
  // Elbow
  "Cubital tunnel syndrome": "elbow tingling, ring/pinky finger numbness",
  // Wrist / Hand
  "De Quervain's tenosynovitis": "thumb/wrist pain, difficulty gripping",
  "Dupuytren's contracture": "fingers curling inward, can't straighten",
  "Ganglion cyst": "lump on wrist, aching",
  "Trigger finger": "finger catching/locking when bending",
  // Knee
  "Patellofemoral syndrome": "knee cap pain, grinding going up stairs",
  "Chondromalacia patella": "cartilage softening, knee cap grinding",
  "Baker's cyst": "swelling behind knee, tightness",
  // Leg
  "Shin splints (MTSS)": "lower leg pain during activity",
  "Compartment syndrome": "tightness, swelling, pressure in leg",
  "Deep vein thrombosis (DVT)": "leg swelling, warmth, pain in calf",
  // Ankle / Foot
  "Tarsal tunnel syndrome": "foot/ankle tingling, burning",
  "Morton's neuroma": "ball of foot pain, toe numbness",
  "Flat feet (pes planus)": "arch pain, tired feet, overpronation",
  "Plantar fasciitis": "heel pain, worse first steps in morning",
  // Head
  "Peripheral vestibular disorders": "dizziness, balance problems",
  "Meniere's syndrome (endolymphatic hydrops)": "vertigo episodes, ringing, hearing loss",
  "Optic neuropathy": "vision loss, color fading",
  "Papilledema": "headaches, blurred vision from pressure",
  "Keratoconus": "blurry/distorted vision, light sensitivity",
  "Otosclerosis": "gradual hearing loss, ringing",
  "Pterygium": "growth on eye surface, irritation",
  "Sinusitis, chronic": "facial pressure, headaches, nasal drainage, congestion",
  "Rhinitis, allergic or vasomotor": "chronic congestion, runny nose, sneezing",
  "Temporomandibular disorder (TMD)": "jaw pain, clicking, difficulty chewing",
  "Residuals of Traumatic Brain Injury (TBI)": "memory loss, headaches, concentration problems",
  "Seizure disorder (epilepsy)": "seizures, loss of consciousness, convulsions",
  // Systemic / Other conditions
  "Systemic lupus erythematosus (SLE)": "joint pain, skin rash, fatigue, organ inflammation",
  "Rheumatoid arthritis": "joint swelling, morning stiffness, fatigue, symmetrical joint pain",
  "Multiple sclerosis": "numbness, vision problems, fatigue, balance issues",
  "Myasthenia gravis": "muscle weakness, drooping eyelids, difficulty swallowing",
  "Guillain-Barré syndrome": "ascending weakness, tingling, paralysis after infection/vaccine",
  "Sjögren's syndrome": "dry eyes, dry mouth, joint pain, fatigue",
  "Psoriatic arthritis": "joint pain with skin plaques, swollen fingers/toes",
  "Celiac disease": "digestive issues, bloating, fatigue from gluten",
  "Diabetes mellitus": "high blood sugar, frequent urination, thirst, fatigue",
  "Hypothyroidism": "fatigue, weight gain, cold intolerance, depression (includes Hashimoto's)",
  "Hashimoto's thyroiditis": "fatigue, weight gain, cold sensitivity, thyroid swelling",
  "Hyperthyroidism": "weight loss, rapid heartbeat, tremor, anxiety",
  "Graves' disease": "bulging eyes, weight loss, rapid heartbeat, tremor",
  "Addison's disease": "fatigue, weight loss, low blood pressure, darkened skin",
  "Cushing's syndrome": "weight gain, moon face, thin skin, muscle weakness",
  "Hyperparathyroidism": "bone pain, kidney stones, fatigue, depression",
  "Hypogonadism / low testosterone": "fatigue, low libido, mood changes, muscle loss",
  "Parkinson's disease": "tremor, rigidity, slow movement, balance problems",
  "Seizure disorder (epilepsy)": "seizures, loss of consciousness, convulsions",
  "Restless leg syndrome": "urge to move legs, worse at rest/night, tingling",
  "Peripheral artery disease": "leg pain when walking, numbness, cold legs/feet",
  "Dermatitis or eczema": "itchy, red, inflamed skin patches",
  "Psoriasis": "thick, scaly skin patches, itching, flaking",
  "Contact dermatitis": "skin rash from chemical/material exposure",
  "Seborrheic dermatitis": "flaky, scaly skin on scalp and face",
  "Pseudofolliculitis barbae": "razor bumps, ingrown hairs, scarring",
  "Folliculitis": "inflamed hair follicles, bumps, itching",
  "Hidradenitis suppurativa": "painful lumps under skin, abscesses, scarring",
  "Alopecia areata": "patchy hair loss, autoimmune",
  "Chloracne": "acne-like skin lesions from chemical exposure",
  "Tinea pedis (athlete's foot)": "itchy, cracking skin on feet, fungal infection",
  "Hyperhidrosis": "excessive sweating beyond what's needed for cooling",
  "Skin cancer (basal cell, squamous cell, melanoma)": "abnormal skin growth, changing moles",
  "Keloid scarring": "raised, overgrown scar tissue beyond wound area",
  "Fibromyalgia": "widespread pain, tender points, fatigue, brain fog",
  "Chronic fatigue syndrome": "debilitating fatigue, post-exertional malaise, brain fog",
  "Chronic pain syndrome": "persistent pain affecting daily function",
  "Hypertension": "high blood pressure, headaches, often silent",
  "Raynaud's syndrome": "fingers/toes turn white/blue in cold, numbness",
  "Raynaud's phenomenon": "fingers/toes turn white/blue in cold, numbness",
  "GERD / acid reflux": "heartburn, regurgitation, difficulty swallowing",
  "Hiatal hernia": "chest pain, acid reflux, difficulty swallowing",
  "Erectile dysfunction": "loss of erectile power, may qualify for SMC-K",
  "Loss of use of creative organ": "loss/removal of testicle, ovary, or penis; SMC-K eligible",
  "SIRVA (shoulder injury related to vaccine administration)": "shoulder pain/weakness after injection, limited motion",
  "Myocarditis (vaccine-related)": "chest pain, shortness of breath, fatigue after vaccination",
  "Transverse myelitis": "back pain, weakness, numbness, bladder/bowel issues",
  "Small fiber neuropathy": "burning pain, tingling in hands/feet, temperature sensitivity",
  "CIDP (chronic inflammatory demyelinating polyneuropathy)": "progressive weakness, numbness, impaired walking",
  "Constrictive bronchiolitis": "shortness of breath, cough from toxic exposure",
  "Gout": "sudden severe joint pain, swelling, redness (often big toe)",
  "Sarcoidosis": "swollen lymph nodes, lung involvement, skin lesions, fatigue",
  "Lyme disease": "joint pain, fatigue, neurological issues from tick bite",
  "Irritable bowel syndrome (IBS)": "abdominal pain, bloating, diarrhea/constipation"
};

// ── SECONDARY CONDITIONS MAP ─────────────────────────────────────────────────
// Mental health conditions included in every physical group
const MENTAL_SECONDARIES = [
  "Depression due to chronic pain",
  "Anxiety",
  "PTSD (related to injury)",
  "Insomnia / Sleep disturbance",
  "Adjustment disorder",
  "Somatic symptom disorder"
];

// VA MEPSS mental health diagnostic conditions (from CSV)
const VA_MENTAL = [
  "Major depressive disorder","Persistent depressive disorder (dysthymia)",
  "Unspecified depressive disorder","Bipolar disorder","Cyclothymic disorder",
  "Generalized anxiety disorder","Unspecified anxiety disorder",
  "Panic disorder and/or agoraphobia","Specific phobia; social anxiety disorder (social phobia)",
  "Obsessive compulsive disorder","Posttraumatic stress disorder",
  "Chronic adjustment disorder","Schizoaffective disorder",
  "Schizophrenia, disorganized type",
  "Other specified and unspecified schizophrenia spectrum and other psychotic disorders",
  "Delusional disorder","Conversion disorder (functional neurological symptom disorder)",
  "Somatic symptom disorder","Illness anxiety disorder",
  "Other specified somatic symptom and related disorder",
  "Unspecified somatic symptom and related disorder",
  "Depersonalization/Derealization disorder",
  "Dissociative amnesia; dissociative identity disorder",
  "Anorexia nervosa","Bulimia nervosa","Delirium",
  "Major or mild neurocognitive disorder due to traumatic brain injury",
  "Major or mild neurocognitive disorder due to Alzheimer's disease",
  "Major or mild neurocognitive disorder due to HIV or other infections",
  "Major or mild neurocognitive disorder due to another medical condition or substance/medication-induced major or mild neurocognitive disorder",
  "Major or mild vascular neurocognitive disorder",
  "Unspecified neurocognitive disorder",
  "Other and unspecified neurosis",
  "Military sexual trauma (MST)"
];

const SECONDARY_MAP = {
  head: [
    // — Custom common secondaries —
    "Migraine headaches","TBI residuals","TMJ disorder","Tinnitus",
    "Vision impairment","Cognitive disorder","Vertigo / Dizziness",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Auditory —
    "Hearing impairment (hearing loss)",
    "Chronic suppurative otitis media, mastoiditis, or cholesteatoma (or any combination)",
    "Chronic nonsuppurative otitis media with effusion (serious otitis media)",
    "Otosclerosis","Peripheral vestibular disorders",
    "Meniere's syndrome (endolymphatic hydrops)","Loss of auricle",
    "Malignant neoplasm of the ear (other than skin only)",
    "Benign neoplasms of the ear (other than skin only)",
    "Chronic otitis externa","Tympanic membrane, perforation of",
    "Tinnitus, recurrent",
    "Loss of sense of smell, complete","Loss of sense of taste, complete",
    // — VA MEPSS: Eyes —
    "Cataract of any type","Aphakia or dislocation of crystalline lens",
    "Diabetic retinopathy","Diplopia (double vision)",
    "Disorders of the lacrimal apparatus (epiphora, dacryocystitis, etc.)",
    "Keratoconus","Nystagmus, central","Optic neuropathy",
    "Retinal dystrophy (including retinitis pigmentosa, wet or dry macular degeneration, early-onset macular degeneration, rod and/or cone dystrophy)",
    "Visual field defects","Scotoma, unilateral",
    "Chronic conjunctivitis (nontrachomatous)","Pterygium",
    "Ptosis, unilateral or bilateral","Papilledema",
    "Post-chiasmal disorders","Blepharitis",
    // — VA MEPSS: Dental —
    "Temporomandibular disorder (TMD)",
    "Maxilla or mandible, chronic osteomyelitis, osteonecrosis or osteoradionecrosis of",
    // — VA MEPSS: Neurological (cranial) —
    "Residuals of Traumatic Brain Injury (TBI)","Migraine",
    "Fifth (trigeminal) cranial nerve, Neuralgia",
    "Seventh (facial) cranial nerve, Paralysis of",
    "Brain, vessels, hemorrhage from","Brain, vessels, thrombosis of",
    // — VA MEPSS: Skin (head/face) —
    "Burn scar(s) of the head, face, or neck; scar(s) of the head, face, or neck due to other causes; or other disfigurement of the head, face, or neck",
    // — VA Mental —
    ...VA_MENTAL
  ],
  neck: [
    // — Custom common secondaries —
    "Cervical radiculopathy","Degenerative disc disease (cervical)",
    "Limited ROM - cervical spine","Upper extremity numbness / tingling",
    "Migraine headaches","IVDS - cervical",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Musculoskeletal (spine/neck) —
    "The Spine - Lumbosacral or cervical strain",
    "The Spine - Intervertebral disc syndrome",
    "The Spine - Degenerative arthritis, degenerative disc disease other than intervertebral disc syndrome (also, see either DC 5003 or 5010)",
    "The Spine - Spinal stenosis","The Spine - Spinal fusion",
    "The Spine - Ankylosing spondylitis",
    "The Spine - Spondylolisthesis or segmental instability",
    "The Spine - Vertebral fracture or dislocation",
    // — VA MEPSS: Neurological (upper radicular) —
    "Upper radicular group (fifth and sixth cervicals), Neuralgia",
    "Upper radicular group (fifth and sixth cervicals), Neuritis",
    "Upper radicular group (fifth and sixth cervicals), Paralysis of",
    "Middle radicular group, Neuralgia","Middle radicular group, Neuritis",
    "Middle radicular group, Paralysis of",
    "All radicular groups, Paralysis of",
    // — VA MEPSS: Muscle Injuries (torso/neck) —
    "The Torso & Neck Group XIX","The Torso & Neck Group XX",
    "The Torso & Neck Group XXI","The Torso & Neck Group XXII",
    "The Torso & Neck Group XXIII",
    // — VA Mental —
    ...VA_MENTAL
  ],
  shoulder: [
    // — Custom common secondaries —
    "Rotator cuff tendinopathy","Frozen shoulder (adhesive capsulitis)",
    "Limited ROM - shoulder","Thoracic outlet syndrome",
    "Shoulder instability","Nerve damage (upper extremity)",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Musculoskeletal (shoulder/arm) —
    "The Shoulder & Arm - Arm, limitation of motion of",
    "The Shoulder & Arm - Scapulohumeral articulation, ankylosis of",
    "The Shoulder & Arm - Humerus, other impairment of",
    "The Shoulder & Arm - Clavicle or scapula, impairment of",
    "Shoulder replacement (prosthesis)","Rotator cuff tear",
    "Fracture, clavicle","Bursitis",
    // — VA MEPSS: Neurological (upper extremity) —
    "Circumflex nerve, Neuralgia","Circumflex nerve, Neuritis",
    "Circumflex nerve, Paralysis of",
    "Long thoracic nerve, Neuralgia","Long thoracic nerve, Neuritis",
    "Long thoracic nerve, Paralysis of",
    // — VA MEPSS: Muscle Injuries (shoulder/arm) —
    "The Shoulder Girdle & Arm Group I","The Shoulder Girdle & Arm Group II",
    "The Shoulder Girdle & Arm Group III","The Shoulder Girdle & Arm Group IV",
    "The Shoulder Girdle & Arm Group V","The Shoulder Girdle & Arm Group VI",
    // — VA Mental —
    ...VA_MENTAL
  ],
  back: [
    // — Custom common secondaries —
    "Lumbar radiculopathy","Sciatica",
    "Degenerative disc disease (lumbar)","Limited ROM - thoracolumbar spine",
    "IVDS - lumbar","Lower extremity numbness / tingling",
    "Erectile dysfunction","Bladder dysfunction","Bowel dysfunction",
    "Abnormal gait",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Musculoskeletal (spine) —
    "The Spine - Lumbosacral or cervical strain",
    "The Spine - Intervertebral disc syndrome",
    "The Spine - Degenerative arthritis, degenerative disc disease other than intervertebral disc syndrome (also, see either DC 5003 or 5010)",
    "The Spine - Sacroiliac injury and weakness",
    "The Spine - Spinal stenosis","The Spine - Spinal fusion",
    "The Spine - Ankylosing spondylitis",
    "The Spine - Spondylolisthesis or segmental instability",
    "The Spine - Vertebral fracture or dislocation",
    "Scoliosis, dorsal","Kyphosis, dorsal",
    // — VA MEPSS: Neurological (lower radicular / spinal) —
    "Lower radicular group, Neuralgia","Lower radicular group, Neuritis",
    "Lower radicular group, Paralysis of",
    "All radicular groups, Paralysis of",
    "Sciatic nerve, Neuralgia","Sciatic nerve, Neuritis","Sciatic nerve, Paralysis of",
    "Spinal cord, new growths of: benign, minimum rating",
    "Syringomyelia","Myelitis",
    // — VA MEPSS: Genitourinary (secondary to back) —
    "Impotency","Cystitis, chronic, includes interstitial and all etiologies, infectious and non-infectious",
    // — VA Mental —
    ...VA_MENTAL
  ],
  chest: [
    // — Custom common secondaries —
    "Costochondritis","Respiratory condition","GERD","Scarring",
    "Anxiety / Panic disorder",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Cardiovascular —
    "Valvular heart disease (including rheumatic heart disease)",
    "Arteriosclerotic heart disease (Coronary artery disease)",
    "Hypertensive heart disease","Hypertensive vascular disease (hypertension and isolated systolic hypertension)",
    "Myocardial infarction","Cardiomyopathy","Pericarditis",
    "Supraventricular arrhythmias","Ventricular arrhythmias (sustained)",
    "Atrioventricular block","Endocarditis",
    "Coronary bypass surgery","Heart valve replacement (prosthesis)",
    "Varicose veins","Raynaud's syndrome",
    // — VA MEPSS: Respiratory —
    "Asthma, bronchial","Chronic obstructive pulmonary disease",
    "Bronchitis, chronic","Bronchiectasis","Emphysema, pulmonary",
    "Sleep apnea syndromes (Obstructive, central, mixed)",
    "Reactive airway disease","Sarcoidosis",
    "Chronic pleural effusion or fibrosis",
    "Diffuse interstitial fibrosis (interstitial pneumonitis, fibrosing alveolitis)",
    "Pulmonary embolus","Pulmonary vascular disease",
    "Traumatic chest wall defect, pneumothorax, hernia, etc.",
    "Post-surgical residual (lobectomy, pneumonectomy, etc.)",
    "Kyphoscoliosis, pectus excavatum, pectus carinatum",
    // — VA MEPSS: Musculoskeletal —
    "Fracture, ribs","Ribs, removal of",
    // — VA Mental —
    ...VA_MENTAL
  ],
  abdomen: [
    // — Custom common secondaries —
    "GERD","IBS","Hernia","Bladder dysfunction",
    "Erectile dysfunction","Pelvic pain syndrome",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Digestive —
    "Gastroesophageal reflux disease","Gastritis, chronic","Peptic ulcer disease",
    "Irritable bowel syndrome","Colitis, ulcerative",
    "Crohn's disease or undifferentiated form of inflammatory bowel disease",
    "Diverticulitis and diverticulosis","Enteritis, chronic",
    "Hiatal hernia and paraesophageal hernia",
    "Hernia, including femoral, inguinal, umbilical, ventral, incisional, and other (but not including hiatal)",
    "Pancreatitis, chronic","Cirrhosis of the liver",
    "Chronic liver disease without cirrhosis","Hepatitis C (or non-A, non-B hepatitis)",
    "Cholelithiasis, chronic",
    "Cholecystectomy (gallbladder removal), complications of (such as strictures and biliary leaks)",
    "Postgastrectomy syndromes","Visceroptosis, symptomatic, marked",
    "Rectum and anus, impairment of sphincter control",
    "Hemorroids, external or internal",
    "Peritoneum, adhesions of, due to surgery, trauma, or infection",
    // — VA MEPSS: Genitourinary —
    "Chronic renal disease requiring regular dialysis","Kidney transplant",
    "Kidney, removal of one","Nephritis, chronic","Nephrolithiasis",
    "Prostate gland injuries, infections, hypertrophy, post-operative residuals",
    "Cystitis, chronic, includes interstitial and all etiologies, infectious and non-infectious",
    "Bladder, injury of","Impotency",
    // — VA MEPSS: Gynecological —
    "Endometriosis",
    "Complete or incomplete pelvic organ prolapse due to injury, disease, or surgical complications of pregnancy",
    "Uterus, removal of, including corpus","Ovary, removal of",
    // — VA MEPSS: Endocrine —
    "Diabetes mellitus","Hypothyroidism","Hyperthyroidism, including, but not limited to, Graves' disease",
    "Addison's disease (adrenocortical insufficiency)","Cushing's syndrome",
    // — VA Mental —
    ...VA_MENTAL
  ],
  hip: [
    // — Custom common secondaries —
    "Limited ROM - hip","Hip labral tear","Abnormal gait",
    "Leg length discrepancy","Sciatic nerve involvement",
    "Degenerative joint disease - hip",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Musculoskeletal (hip/thigh) —
    "The Hip and Thigh - Hip, ankylosis of",
    "The Hip and Thigh - Hip, flail joint",
    "The Hip and Thigh - Thigh, limitation of flexion of",
    "The Hip and Thigh - Thigh, limitation of extension of",
    "The Hip and Thigh - Thigh, impairment of",
    "The Hip and Thigh - Femur, impairment of",
    "Hip replacement (prosthesis)",
    "Degenerative arthritis, other than post-traumatic",
    "Post-traumatic arthritis","Bursitis",
    // — VA MEPSS: Neurological (hip/thigh nerves) —
    "Sciatic nerve, Neuralgia","Sciatic nerve, Neuritis","Sciatic nerve, Paralysis of",
    "External cutaneous nerve of thigh, Neuralgia",
    "External cutaneous nerve of thigh, Neuritis",
    "External cutaneous nerve of thigh, Paralysis of",
    "Obturator nerve, Neuralgia","Obturator nerve, Neuritis",
    "Obturator nerve, Paralysis of",
    // — VA MEPSS: Muscle Injuries (pelvic/thigh) —
    "The Pelvic Girdle & Thigh Rating Group XIII",
    "The Pelvic Girdle & Thigh Rating Group XIV",
    "The Pelvic Girdle & Thigh Rating Group XV",
    "The Pelvic Girdle & Thigh Rating Group XVI",
    "The Pelvic Girdle & Thigh Rating Group XVII",
    "The Pelvic Girdle & Thigh Rating Group XVIII",
    // — VA Mental —
    ...VA_MENTAL
  ],
  elbow: [
    // — Custom common secondaries —
    "Cubital tunnel syndrome","Tennis elbow (lateral epicondylitis)",
    "Golfer's elbow (medial epicondylitis)","Limited ROM - elbow",
    "Nerve damage (upper extremity)",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Musculoskeletal (elbow/forearm) —
    "The Elbow & Forearm - Elbow, ankylosis of",
    "The Elbow & Forearm - Elbow, other impairment of flail joint",
    "The Elbow & Forearm - Forearm, limitation of flexion of",
    "The Elbow & Forearm - Forearm, limitation of extension of",
    "The Elbow & Forearm - Forearm, flexion limited to 100 degrees and extension to 45 degrees",
    "The Elbow & Forearm - Supination and pronation, impairment of",
    "The Elbow & Forearm - Radius, impairment of",
    "The Elbow & Forearm - Ulna, impairment of",
    "The Elbow & Forearm - Radius and ulna, nonunion of, with flail false joint",
    "Elbow replacement (prosthesis)",
    "Epicondylitis (lateral or medial)","Bursitis",
    // — VA MEPSS: Neurological (upper extremity) —
    "Musculocutaneous nerve, Neuralgia","Musculocutaneous nerve, Neuritis",
    "Musculocutaneous nerve, Paralysis of",
    "The musculospiral nerve (radial nerve), Neuralgia",
    "The musculospiral nerve (radial nerve), Neuritis",
    "The musculospiral nerve (radial nerve), Paralysis of",
    // — VA Mental —
    ...VA_MENTAL
  ],
  wrist_hand: [
    // — Custom common secondaries —
    "Carpal tunnel syndrome","De Quervain's tenosynovitis",
    "Trigger finger","Limited ROM - wrist",
    "Peripheral neuropathy (upper)","Grip strength loss",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Musculoskeletal (wrist/hand) —
    "The Wrist - Wrist, ankylosis of","The Wrist - Wrist, limitation of motion of",
    "Wrist replacement (prosthesis)","Fracture, wrist",
    "Dupuytren's contracture","Ganglia (ganglion cysts)",
    "Thumb, limitation of motion",
    "Index or long finger, limitation of motion",
    "Ring or little finger, limitation of motion",
    "Tenosynovitis, tendinitis, tendinosis or tendinopathy",
    // — VA MEPSS: Neurological (wrist/hand nerves) —
    "The median nerve, Neuralgia","The median nerve, Neuritis",
    "The median nerve, Paralysis of",
    "The ulnar nerve, Neuralgia","The ulnar nerve, Neuritis",
    "The ulnar nerve, Paralysis of",
    // — VA MEPSS: Muscle Injuries (forearm/hand) —
    "The Forearm & Hand Group VII","The Forearm & Hand Group VIII",
    "The Forearm & Hand Group IX",
    // — VA Mental —
    ...VA_MENTAL
  ],
  knee: [
    // — Custom common secondaries —
    "Limited ROM - knee","Degenerative joint disease - knee",
    "Meniscal tear","Patellar tendinitis","Baker's cyst",
    "Instability / Giving way","Abnormal gait",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Musculoskeletal (knee/leg) —
    "The Knee & Leg - Knee, ankylosis of",
    "The Knee & Leg - Knee, other impairment of",
    "The Knee & Leg - Leg, limitation of flexion of",
    "The Knee & Leg - Leg, limitation of extension of",
    "The Knee & Leg - Cartilage, semilunar, dislocated, with frequent episodes of locking, pain, and effusion into the joint",
    "The Knee & Leg - Cartilage, semilunar, removal of, symptomatic",
    "The Knee & Leg - Tibia and fibula, impairment of",
    "The Knee & Leg - Genu recurvatum (acquired, traumatic, with weakness and insecurity in weight-bearing objectively demonstrated)",
    "Knee replacement (prosthesis)","Chondromalacia patella",
    "Patellofemoral syndrome/retropatellar","Patellectomy",
    "Fracture, knee","Hypotonia, ligaments, knees",
    "Degenerative arthritis, other than post-traumatic","Post-traumatic arthritis",
    "Bursitis","Disease, Osgood-Schlatter's","Disease, Pellegrini-Stieda",
    "Varus deformity, knee (genu varum/bowlegs)",
    // — VA MEPSS: Neurological (knee area nerves) —
    "External popliteal nerve (common peroneal), Neuralgia",
    "External popliteal nerve (common peroneal), Neuritis",
    "External popliteal nerve (common peroneal), Paralysis of",
    "Internal popliteal nerve (tibial), Neuralgia",
    "Internal popliteal nerve (tibial), Neuritis",
    "Internal popliteal nerve (tibial), Paralysis of",
    // — VA Mental —
    ...VA_MENTAL
  ],
  leg: [
    // — Custom common secondaries —
    "Peripheral neuropathy (lower)","Shin splints (MTSS)",
    "Muscle atrophy","Deep vein thrombosis residuals",
    "Compartment syndrome","Abnormal gait",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Musculoskeletal (leg) —
    "The Knee & Leg - Tibia and fibula, impairment of",
    "Bones, of the lower extremity, shortening of",
    "Degenerative arthritis, other than post-traumatic","Post-traumatic arthritis",
    "Osteomyelitis, acute, subacute, or chronic",
    // — VA MEPSS: Neurological (leg nerves) —
    "Anterior crural femoral, Neuralgia","Anterior crural femoral, Neuritis",
    "Anterior crural femoral, Paralysis of",
    "Anterior tibial nerve (deep peroneal), Neuralgia",
    "Anterior tibial nerve (deep peroneal), Neuritis",
    "Anterior tibial nerve (deep peroneal), Paralysis of",
    "Musculocutaneous nerve (superficial peroneal), Neuralgia",
    "Musculocutaneous nerve (superficial peroneal), Neuritis",
    "Musculocutaneous nerve (superficial peroneal), Paralysis of",
    "Internal saphenous nerve, Neuralgia","Internal saphenous nerve, Neuritis",
    "Internal saphenous nerve, Paralysis of",
    // — VA MEPSS: Muscle Injuries (foot/leg) —
    "The Foot & Leg Group X","The Foot & Leg Group XI","The Foot & Leg Group XII",
    // — VA MEPSS: Cardiovascular —
    "Varicose veins","Post-phlebitis syndrome of any etiology",
    // — VA Mental —
    ...VA_MENTAL
  ],
  ankle_foot: [
    // — Custom common secondaries —
    "Plantar fasciitis","Limited ROM - ankle",
    "Flatfoot (pes planus)","Ankle instability",
    "Peripheral neuropathy (lower)","Abnormal gait",
    "Degenerative joint disease - ankle",
    ...MENTAL_SECONDARIES,
    // — VA MEPSS: Musculoskeletal (ankle) —
    "The Ankle - Ankle, limited motion of","The Ankle - Ankle, ankylosis of",
    "The Ankle - Subastragalar or tarsal joint, ankylosis of",
    "The Ankle - Os calcis or astragalus, malunion of",
    "The Ankle - Astragalectomy",
    "Ankle replacement (prosthesis)",
    // — VA MEPSS: Musculoskeletal (foot) —
    "The Foot - Flatfoot, acquired","The Foot - Claw foot (pes cavus), acquired",
    "The Foot - Hallux valgus, unilateral","The Foot - Hallux rigidus, unilateral, severe",
    "The Foot - Hammer toe","The Foot - Plantar Fasciitis",
    "The Foot - Metatarsalgia, anterior (Morton's disease), unilateral, or bilateral",
    "The Foot - Foot injuries, other","The Foot - Weak foot, bilateral",
    "The Foot - Tarsal, or metatarsal bones, malunion of, or nonunion of",
    "Fusion, toes",
    "Degenerative arthritis, other than post-traumatic","Post-traumatic arthritis",
    "Gout","Bursitis",
    // — VA MEPSS: Neurological (foot/ankle nerves) —
    "Posterior tibial nerve, Neuralgia","Posterior tibial nerve, Neuritis",
    "Posterior tibial nerve, Paralysis of",
    "Anterior tibial nerve (deep peroneal), Neuralgia",
    "Anterior tibial nerve (deep peroneal), Paralysis of",
    // — VA Mental —
    ...VA_MENTAL
  ],
  vocational_war: [
    // — Custom common secondaries —
    "PTSD","Combat operational stress reaction",
    "Traumatic brain injury (TBI)","Military sexual trauma (MST)",
    "Substance use disorder (secondary to service)",
    "Unemployment due to service-connected disability",
    "Loss of occupational capacity","Reduced employability",
    "Vocational rehabilitation need","Cognitive impairment affecting work",
    "Chronic fatigue affecting employability",
    "Social isolation / Relationship difficulties",
    "Depression","Anxiety","Insomnia / Sleep disturbance",
    "Moral injury","Survivor's guilt",
    // — VA MEPSS: Vocational Implications —
    "Affective Disorders","Aging and Disability","Albinism",
    "Alcohol and Other Drug Abuse Disabilities","Allergies",
    "Amputations","Arthritis","Asperger's Syndrome",
    "Asthma","Autism (Adult)","Burns","Cancer",
    "Cardiovascular Disorders","Carpal-Tunnel Syndrome","Cerebral Palsy",
    "Delusional (Paranoid) Disorders","Diabetes Mellitus","Eating Disorders",
    "Fatigue Syndrome, Chronic","Fibromyalgia","Fractures",
    "H.I.V. (AIDS)","Hearing Impairments","Hemophilia",
    "Learning Disorders","Low Back Pain, Chronic",
    "Mental Retardation - Intellectual Disability",
    "Motor Neuron Diseases","Movement Disorders","Multiple Sclerosis",
    "Obesity","Pain","Personality Disorders","Post-Polio Syndrome",
    "Post-Traumatic Stress Disorder","Renal-Kidney Disease",
    "Respiratory Disorders","Schizophrenic Disorders",
    "Seizure Disorder (Epilepsy)","Sickle Cell Anemia","Sleep Disorders",
    "Spina Bifida - Myelomeningocele","Spinal Cord Injury","Stroke",
    "Traumatic Brain Injury","Visual Impairments",
    // — VA MEPSS: War Related Issues —
    "Agent Orange & Related Illnesses (including Diabetes)",
    "Biological Weapons","Chemical Weapons",
    "Gulf War Syndrome/Illness",
    "Health Effects from Chemical, Biological, and Radiological Weapons",
    "Heat Injuries","Infectious Diseases","PACT Act",
    "POW Medical Issues","Post-Viral Syndrome",
    "Radiological Weapons","Shrapnel (Trauma) Wounds",
    "Silicosis and other conditions secondary to harmful inhalants",
    "Other Specific Environmental Hazards"
  ],
  mental: [
    ...VA_MENTAL,
    ...MENTAL_SECONDARIES,
    "Medication side effects","Cognitive disorder",
    "Substance use disorder",
  ],
  other: [
    ...MENTAL_SECONDARIES,
    "Medication side effects","Chronic fatigue",
    // — VA MEPSS: Hematologic & Lymphatic —
    "Sickle cell anemia","Iron deficiency anemia","Aplastic anemia",
    "Immune thrombocytopenia","Hodgkin's lymphoma","Non-Hodgkin's lymphoma",
    "Multiple myeloma","Polycythemia vera",
    // — VA MEPSS: Infectious Diseases —
    "Lyme disease","Rheumatic fever","Sarcoidosis","Tuberculosis, miliary",
    // — VA MEPSS: Skin —
    "Dermatitis or eczema","Psoriasis","Acne vulgaris",
    "Scar(s), unstable or painful","Chronic urticaria","Vitiligo",
    // — VA MEPSS: Endocrine —
    "Diabetes mellitus","Hypothyroidism",
    // — VA Mental —
    ...VA_MENTAL
  ],
  systemic: [
    // Autoimmune / Immune
    'Systemic lupus erythematosus (SLE)', 'Rheumatoid arthritis', 'Multiple sclerosis',
    'Myasthenia gravis', 'Guillain-Barré syndrome', 'Sjögren\'s syndrome',
    'Psoriatic arthritis', 'Celiac disease',
    // Endocrine / Metabolic
    'Diabetes mellitus', 'Diabetes mellitus, Type 2', 'Diabetes mellitus, Type 1',
    'Hypothyroidism', 'Hashimoto\'s thyroiditis', 'Hyperthyroidism', 'Graves\' disease',
    'Addison\'s disease', 'Cushing\'s syndrome', 'Hyperparathyroidism',
    'Hypogonadism / low testosterone',
    // Neurological (systemic)
    'Parkinson\'s disease', 'Seizure disorder (epilepsy)',
    'Restless leg syndrome', 'Peripheral artery disease',
    // Skin
    'Dermatitis or eczema', 'Psoriasis', 'Acne vulgaris', 'Contact dermatitis',
    'Seborrheic dermatitis', 'Pseudofolliculitis barbae', 'Folliculitis',
    'Hidradenitis suppurativa', 'Alopecia areata', 'Chloracne',
    'Tinea pedis (athlete\'s foot)', 'Hyperhidrosis', 'Chronic urticaria', 'Vitiligo',
    'Skin cancer (basal cell, squamous cell, melanoma)', 'Keloid scarring',
    'Scar(s), unstable or painful', 'Burn scar(s)',
    // Chronic Pain / Fatigue
    'Fibromyalgia', 'Chronic fatigue syndrome', 'Chronic pain syndrome',
    // Cardiovascular (systemic)
    'Hypertension', 'Raynaud\'s syndrome', 'Raynaud\'s phenomenon',
    // Gastrointestinal
    'GERD / acid reflux', 'Hiatal hernia', 'Irritable bowel syndrome (IBS)',
    // Reproductive / Genitourinary
    'Erectile dysfunction', 'Loss of use of creative organ',
    // Vaccine Injury
    'SIRVA (shoulder injury related to vaccine administration)',
    'Myocarditis (vaccine-related)', 'Transverse myelitis',
    'Small fiber neuropathy', 'CIDP (chronic inflammatory demyelinating polyneuropathy)',
    // Toxic Exposure / PACT Act
    'Constrictive bronchiolitis', 'Respiratory cancer',
    'Kidney cancer / renal cell carcinoma', 'Bladder cancer', 'Prostate cancer',
    'Pancreatic cancer', 'Glioblastoma / brain cancer',
    // Hematologic
    'Sickle cell anemia', 'Iron deficiency anemia',
    // Infectious / Other
    'Lyme disease', 'Sarcoidosis', 'HIV/AIDS', 'Hepatitis B', 'Hepatitis C',
    'Gout', 'Obesity (secondary)', 'Amyloidosis',
    'Other systemic condition',
    ...MENTAL_SECONDARIES,
    ...VA_MENTAL
  ]
};

// Map any pin key to its secondary condition group
const KEY_TO_GROUP = {};
[['head',['head','leftEar','rightEar','leftEye','rightEye','nose','jaw']],
 ['neck',['neck']],
 ['shoulder',['leftShoulder','rightShoulder']],
 ['back',['upperBack','spine','lowerBack']],
 ['chest',['chest','leftLung','rightLung']],
 ['abdomen',['abdomen','pelvis','glutes']],
 ['hip',['leftHip','rightHip']],
 ['elbow',['leftElbow','rightElbow']],
 ['wrist_hand',['leftWrist','rightWrist','leftForearm','rightForearm','leftHand','rightHand']],
 ['knee',['leftKnee','rightKnee']],
 ['leg',['leftThigh','rightThigh','leftShin','rightShin','leftHamstring','rightHamstring','leftCalf','rightCalf']],
 ['ankle_foot',['leftAnkle','rightAnkle','leftFoot','rightFoot']],
 ['mental',['mental']],
 ['systemic',['systemic']]
].forEach(([group,keys])=>keys.forEach(k=>KEY_TO_GROUP[k]=group));

function getGroupForKey(key){ return KEY_TO_GROUP[key] || 'other'; }

// ── MENTAL HEALTH 8787 EVALUATION DOMAINS ──────────────────────────────────
const MH_DOMAINS = [
  { id: 'cognition', label: 'Cognition',
    description: 'Memory, concentration, decision-making, problem-solving, planning',
    examples: {
      none: 'No noticeable difficulty with memory, concentration, or decision-making.',
      mild: 'Occasional forgetfulness or slight difficulty concentrating under stress; can still manage daily tasks.',
      moderate: 'Frequent forgetfulness; noticeable difficulty concentrating, planning, or making decisions that affects productivity.',
      severe: 'Persistent memory gaps; significant difficulty with problem-solving, judgment, and decisions; needs frequent reminders.',
      total: 'Cannot remember basic tasks, make simple decisions, or solve everyday problems without assistance.'
    }
  },
  { id: 'interpersonal', label: 'Interpersonal Interactions',
    description: 'Intimate, family, informal, and formal relationships',
    examples: {
      none: 'Maintains healthy relationships with family, friends, and coworkers.',
      mild: 'Occasional tension or withdrawal in relationships; generally gets along with others.',
      moderate: 'Frequent conflicts or emotional distance with family, friends, or coworkers; difficulty maintaining relationships.',
      severe: 'Serious relationship breakdowns; frequent isolation, hostility, or inability to maintain employment relationships.',
      total: 'Complete inability to maintain any meaningful relationships; total social isolation or danger to others.'
    }
  },
  { id: 'taskCompletion', label: 'Task Completion',
    description: 'Vocational, educational, domestic, and social activities',
    examples: {
      none: 'Completes work, household, and social tasks without difficulty.',
      mild: 'Occasionally falls behind on tasks or needs extra time; generally meets responsibilities.',
      moderate: 'Frequently unable to complete tasks on time; reduced reliability at work or home; needs accommodation.',
      severe: 'Cannot maintain regular employment or complete most household tasks without significant help.',
      total: 'Completely unable to perform any vocational, educational, or domestic tasks.'
    }
  },
  { id: 'environments', label: 'Navigating Environments',
    description: 'Leaving home, confined/crowded spaces, new environments, driving, public transportation',
    examples: {
      none: 'Moves freely through all environments without distress.',
      mild: 'Occasional discomfort in crowds or unfamiliar places; can still navigate independently.',
      moderate: 'Frequently avoids crowds, new places, or driving; needs planning or support to leave home.',
      severe: 'Rarely leaves home; extreme distress in most environments outside the home; cannot drive safely.',
      total: 'Completely homebound; unable to leave home under any circumstances without extreme distress.'
    }
  },
  { id: 'selfCare', label: 'Self-Care',
    description: 'Hygiene, appropriate dressing, nourishment',
    examples: {
      none: 'Maintains personal hygiene, dresses appropriately, and eats regular meals.',
      mild: 'Occasionally neglects grooming or skips meals; generally maintains appearance.',
      moderate: 'Frequently neglects hygiene, wears inappropriate clothing, or has poor nutrition; noticeable to others.',
      severe: 'Rarely bathes, changes clothes, or eats properly; requires prompting or assistance for basic self-care.',
      total: 'Completely unable to care for self; requires full-time assistance for hygiene, dressing, and eating.'
    }
  }
];

const MH_IMPAIRMENT_LEVELS = ['none', 'mild', 'moderate', 'severe', 'total'];
const MH_IMPAIRMENT_LABELS = { none: 'None', mild: 'Mild', moderate: 'Moderate', severe: 'Severe', total: 'Total' };

// Calculate mental health rating from domain assessments using 8787 criteria
// domainRatings: { cognition: {level, frequency}, interpersonal: {level, frequency}, ... }
// frequency: 'less25' (<25% of time) or '25plus' (25%+ of time)
function calculateMHRating(domainRatings) {
  const domains = Object.values(domainRatings);
  if (!domains.length) return 0;

  // Count impairment tiers with frequency
  let hasTotal25 = 0, hasTotalLess25 = 0;
  let hasSevere25 = 0, hasSevereLess25 = 0;
  let hasModerate25 = 0, hasModerateLess25 = 0;
  let hasMild = 0;

  domains.forEach(d => {
    const lv = d.level || 'none';
    const freq = d.frequency || 'less25';
    if (lv === 'total')    { if (freq === '25plus') hasTotal25++; else hasTotalLess25++; }
    if (lv === 'severe')   { if (freq === '25plus') hasSevere25++; else hasSevereLess25++; }
    if (lv === 'moderate') { if (freq === '25plus') hasModerate25++; else hasModerateLess25++; }
    if (lv === 'mild')     hasMild++;
  });

  // 100% — Total impairment 25%+ in 1+ domains
  if (hasTotal25 >= 1) return 100;

  // 70% — Severe 25%+ in 1+ domains, OR Total <25%
  if (hasSevere25 >= 1 || hasTotalLess25 >= 1) return 70;

  // 50% — Moderate 25%+ in 2+ domains, OR Severe <25% in 2+ domains,
  //        OR combo of moderate 25%+ and severe <25%
  if (hasModerate25 >= 2 || hasSevereLess25 >= 2 || (hasModerate25 >= 1 && hasSevereLess25 >= 1)) return 50;

  // 30% — Moderate any frequency, OR Severe <25% (single domain)
  if (hasModerate25 >= 1 || hasModerateLess25 >= 1 || hasSevereLess25 >= 1) return 30;

  // 10% — Mild in any domain
  if (hasMild >= 1) return 10;

  // 0% — All none
  return 0;
}

// ── HEAD & FACE 8787 EVALUATION ──────────────────────────────────────────────

// Head-specific conditions (excludes mental health — those use the MH panel)
const VA_HEAD = [
  "Migraine headaches","Residuals of Traumatic Brain Injury (TBI)",
  "Temporomandibular disorder (TMD)","Tinnitus, recurrent",
  "Vision impairment","Cognitive disorder","Vertigo / Dizziness",
  "Hearing impairment (hearing loss)",
  "Chronic suppurative otitis media, mastoiditis, or cholesteatoma (or any combination)",
  "Chronic nonsuppurative otitis media with effusion (serious otitis media)",
  "Otosclerosis","Peripheral vestibular disorders",
  "Meniere's syndrome (endolymphatic hydrops)","Loss of auricle",
  "Malignant neoplasm of the ear (other than skin only)",
  "Benign neoplasms of the ear (other than skin only)",
  "Chronic otitis externa","Tympanic membrane, perforation of",
  "Loss of sense of smell, complete","Loss of sense of taste, complete",
  "Cataract of any type","Aphakia or dislocation of crystalline lens",
  "Diabetic retinopathy","Diplopia (double vision)",
  "Disorders of the lacrimal apparatus (epiphora, dacryocystitis, etc.)",
  "Keratoconus","Nystagmus, central","Optic neuropathy",
  "Retinal dystrophy (including retinitis pigmentosa, wet or dry macular degeneration, early-onset macular degeneration, rod and/or cone dystrophy)",
  "Visual field defects","Scotoma, unilateral",
  "Chronic conjunctivitis (nontrachomatous)","Pterygium",
  "Ptosis, unilateral or bilateral","Papilledema",
  "Post-chiasmal disorders","Blepharitis",
  "Maxilla or mandible, chronic osteomyelitis, osteonecrosis or osteoradionecrosis of",
  "Fifth (trigeminal) cranial nerve, Neuralgia",
  "Seventh (facial) cranial nerve, Paralysis of",
  "Brain, vessels, hemorrhage from","Brain, vessels, thrombosis of",
  "Burn scar(s) of the head, face, or neck; scar(s) of the head, face, or neck due to other causes; or other disfigurement of the head, face, or neck",
  "Sinusitis, chronic","Rhinitis, allergic or vasomotor",
  "Seizure disorder (epilepsy)"
];

// Evaluation profiles — each defines the rating criteria for a condition type
const HEAD_PROFILES = {
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
      ]
    }]
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
        ]
      },
      { id: 'judgment', label: 'Facet 2: Judgment',
        description: 'Ability to make reasonable decisions',
        levels: [
          { value: 0, label: 'Level 0 — Normal', description: 'Normal judgment' },
          { value: 10, label: 'Level 1 — Mildly impaired', description: 'Occasionally unable to handle complex/unfamiliar decisions' },
          { value: 40, label: 'Level 2 — Moderately impaired', description: 'Usually unable to make reasonable decisions for complex matters' },
          { value: 70, label: 'Level 3 — Moderately severely impaired', description: 'Occasionally unable to make reasonable decisions even for routine matters' },
          { value: 100, label: 'Total — Severely impaired', description: 'Usually unable to make reasonable decisions even for routine/familiar matters' },
        ]
      },
      { id: 'social', label: 'Facet 3: Social Interaction',
        description: 'Appropriateness of social interaction',
        levels: [
          { value: 0, label: 'Level 0 — Routinely appropriate', description: 'Social interaction is routinely appropriate' },
          { value: 10, label: 'Level 1 — Occasionally inappropriate', description: 'Social interaction is occasionally inappropriate' },
          { value: 40, label: 'Level 2 — Frequently inappropriate', description: 'Social interaction is frequently inappropriate' },
          { value: 70, label: 'Level 3 — Inappropriate most/all of the time', description: 'Inappropriate most or all of the time' },
        ]
      },
      { id: 'orientation', label: 'Facet 4: Orientation',
        description: 'Orientation to person, time, place, and situation',
        levels: [
          { value: 0, label: 'Level 0 — Always oriented', description: 'Always oriented to person, time, place, and situation' },
          { value: 10, label: 'Level 1 — Occasionally disoriented to 1 aspect', description: 'Occasionally disoriented to one of the four aspects' },
          { value: 40, label: 'Level 2 — Occasionally to 2 / often to 1', description: 'Occasionally disoriented to two aspects, or often disoriented to one' },
          { value: 70, label: 'Level 3 — Often disoriented to 2+', description: 'Often disoriented to two or more aspects' },
          { value: 100, label: 'Total — Consistently disoriented', description: 'Consistently disoriented to two or more aspects' },
        ]
      },
      { id: 'motor', label: 'Facet 5: Motor Activity',
        description: 'Motor activity with intact motor and sensory system',
        levels: [
          { value: 0, label: 'Level 0 — Normal', description: 'Motor activity is normal' },
          { value: 10, label: 'Level 1 — Mildly slowed at times', description: 'Normal most of the time, mildly slowed at times due to difficulty with coordinated movements (apraxia)' },
          { value: 40, label: 'Level 2 — Mildly decreased', description: 'Motor activity mildly decreased or with moderate slowing due to difficulty with coordinated movements (apraxia)' },
          { value: 70, label: 'Level 3 — Moderately decreased', description: 'Motor activity moderately decreased due to difficulty with coordinated movements (apraxia)' },
          { value: 100, label: 'Total — Severely decreased', description: 'Motor activity severely decreased due to difficulty with coordinated movements (apraxia)' },
        ]
      },
      { id: 'spatial', label: 'Facet 6: Visual Spatial Orientation',
        description: 'Ability to navigate environments and use maps/directions',
        levels: [
          { value: 0, label: 'Level 0 — Normal', description: 'Normal spatial orientation' },
          { value: 10, label: 'Level 1 — Mildly impaired', description: 'Occasionally lost in unfamiliar surroundings; can use GPS' },
          { value: 40, label: 'Level 2 — Moderately impaired', description: 'Usually lost in unfamiliar surroundings; difficulty using GPS' },
          { value: 70, label: 'Level 3 — Moderately severely impaired', description: 'Lost even in familiar surroundings; unable to use GPS' },
          { value: 100, label: 'Total — Severely impaired', description: 'Unable to touch/name body parts or find way in familiar places' },
        ]
      },
      { id: 'subjective', label: 'Facet 7: Subjective Symptoms',
        description: 'Headaches, dizziness, fatigue, insomnia, hypersensitivity to sound/light',
        levels: [
          { value: 0, label: 'Level 0 — Do not interfere', description: 'Symptoms do not interfere with work, daily activities, or relationships' },
          { value: 10, label: 'Level 1 — Mildly interfere', description: '3+ symptoms that mildly interfere: intermittent dizziness, daily mild headaches, tinnitus, insomnia' },
          { value: 40, label: 'Level 2 — Moderately interfere', description: '3+ symptoms that moderately interfere: marked fatigue, blurred/double vision, headaches requiring rest' },
        ]
      },
      { id: 'neurobehavioral', label: 'Facet 8: Neurobehavioral Effects',
        description: 'Irritability, impulsivity, aggression, apathy, lack of motivation',
        levels: [
          { value: 0, label: 'Level 0 — Do not interfere', description: 'Effects present but do not interfere with workplace or social interaction' },
          { value: 10, label: 'Level 1 — Occasionally interfere', description: 'Occasionally interfere with workplace/social interaction but do not preclude them' },
          { value: 40, label: 'Level 2 — Frequently interfere', description: 'Frequently interfere but do not preclude workplace/social interaction' },
          { value: 70, label: 'Level 3 — Preclude interaction most days', description: 'Interfere with or preclude interaction on most days; occasionally require supervision' },
        ]
      },
      { id: 'communication', label: 'Facet 9: Communication',
        description: 'Ability to communicate by spoken/written language',
        levels: [
          { value: 0, label: 'Level 0 — Normal', description: 'Able to communicate and comprehend spoken and written language' },
          { value: 10, label: 'Level 1 — Occasionally impaired', description: 'Comprehension or expression only occasionally impaired; can communicate complex ideas' },
          { value: 40, label: 'Level 2 — Impaired < half the time', description: 'Unable to communicate more than occasionally but less than half the time' },
          { value: 70, label: 'Level 3 — Impaired ≥ half the time', description: 'Unable to communicate at least half the time; may rely on gestures; can communicate basic needs' },
          { value: 100, label: 'Total — Complete inability', description: 'Complete inability to communicate or comprehend; unable to communicate basic needs' },
        ]
      },
      { id: 'consciousness', label: 'Facet 10: Consciousness',
        description: 'Level of consciousness',
        levels: [
          { value: 0, label: 'Normal', description: 'Normal state of consciousness' },
          { value: 100, label: 'Total — Persistently altered', description: 'Persistently altered state (vegetative state, minimally responsive, coma)' },
        ]
      },
    ]
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
        ]
      },
      { id: 'pain', label: 'Pain on Movement',
        description: 'Pain when chewing, talking, yawning, or at rest',
        levels: [
          { value: 0, label: 'No pain', description: 'No jaw pain during movement or at rest.' },
          { value: 10, label: 'Mild — occasional pain', description: 'Occasional pain with prolonged chewing or wide opening. Clicking/popping without significant pain.' },
          { value: 20, label: 'Moderate — frequent pain', description: 'Frequent pain during normal chewing, talking, or yawning. May radiate to ear, temple, or neck.' },
          { value: 30, label: 'Severe — constant pain', description: 'Near-constant jaw pain, significantly limits talking and eating. Pain at rest or wakes from sleep.' },
        ]
      },
      { id: 'mastication', label: 'Chewing / Eating Difficulty',
        description: 'Impact on ability to eat normally',
        levels: [
          { value: 0, label: 'Normal diet', description: 'Can eat all foods without difficulty.' },
          { value: 10, label: 'Avoids hard/chewy foods', description: 'Avoids hard, crunchy, or very chewy foods (steak, raw vegetables, etc.) but manages most foods.' },
          { value: 20, label: 'Soft food diet', description: 'Limited to soft foods — pasta, bread, cooked vegetables. Cannot eat steak, nuts, raw produce.' },
          { value: 30, label: 'Liquid/pureed diet', description: 'Restricted to liquids, smoothies, or pureed foods due to inability to chew.' },
        ]
      }
    ]
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
      ]
    }]
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
          { value: 10, label: 'Ringing only (tinnitus)', description: 'Ringing, buzzing, or hissing in one or both ears, but hearing is otherwise normal. Note: Tinnitus is rated separately under DC 6260 — use the Tinnitus profile if claiming tinnitus alone.' },
          { value: 10, label: 'Both hearing loss and ringing', description: 'Both reduced hearing and persistent ringing/buzzing. Each may be rated separately.' },
        ]
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
        ]
      }
    ]
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
      ]
    }]
  },
  menieres: {
    label: "Meniere's Disease (DC 6205)",
    note: 'Rate under these criteria OR separately rate vertigo + hearing + tinnitus — whichever is higher.',
    domains: [{
      id: 'severity', label: 'Vertigo Frequency (with hearing impairment)',
      description: 'How often vertigo attacks occur, with concurrent hearing impairment',
      levels: [
        { value: 0, label: 'No vertigo', description: 'Hearing impairment without vertigo episodes' },
        { value: 30, label: 'Vertigo less than once a month', description: 'Hearing impairment with vertigo less than once monthly' },
        { value: 60, label: 'Vertigo 1–4 times a month', description: 'Hearing impairment with vertigo occurring 1–4 times monthly' },
        { value: 100, label: 'Vertigo >5 times/month or persistent balance problems', description: 'Vertigo >5x/month or persistent balance problems (disequilibrium) and unsteady walking' },
      ]
    }]
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
      ]
    }]
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
      ]
    }]
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
      ]
    }]
  },
  disfigurement: {
    label: 'Disfigurement of Head, Face, or Neck (DC 7800)',
    note: 'Rated based on the 8 characteristics of disfigurement and whether there is visible tissue loss or asymmetry of features.',
    domains: [
      { id: 'characteristics', label: 'Characteristics of Disfigurement',
        description: 'Count how many of these 8 characteristics apply: (1) Scar 5+ inches long, (2) Scar 1/4+ inch wide, (3) Surface contour elevated or depressed, (4) Scar adherent to underlying tissue, (5) Hypo/hyper-pigmented area exceeding 6 sq inches, (6) Abnormal skin texture exceeding 6 sq inches, (7) Underlying soft tissue missing exceeding 6 sq inches, (8) Skin indurated and inflexible exceeding 6 sq inches',
        levels: [
          {value:0, label:'No characteristics of disfigurement', description:'No scars or disfigurement meeting any of the 8 characteristics.'},
          {value:10, label:'1 characteristic', description:'One characteristic of disfigurement present.'},
          {value:30, label:'2 or 3 characteristics', description:'Two or three characteristics of disfigurement; or visible/palpable tissue loss with gross distortion or asymmetry of one feature or paired set of features (nose, chin, forehead, eyes, ears, cheeks, lips).'},
          {value:50, label:'4 or 5 characteristics', description:'Four or five characteristics of disfigurement; or visible/palpable tissue loss with gross distortion or asymmetry of two features or paired sets of features.'},
          {value:80, label:'6 or more characteristics', description:'Six or more characteristics of disfigurement; or visible/palpable tissue loss with gross distortion or asymmetry of three or more features or paired sets of features.'},
        ]
      },
      { id: 'tissue_loss', label: 'Tissue Loss & Asymmetry',
        description: 'Is there visible or palpable tissue loss with distortion or asymmetry of facial features?',
        levels: [
          {value:0, label:'No tissue loss or asymmetry', description:'No visible tissue loss. Facial features are symmetric.'},
          {value:30, label:'Tissue loss with asymmetry of 1 feature', description:'Visible or palpable tissue loss AND either gross distortion or asymmetry of one feature or paired set of features (e.g., nose, chin, forehead, eyes, ears, cheeks, lips).'},
          {value:50, label:'Tissue loss with asymmetry of 2 features', description:'Visible or palpable tissue loss AND gross distortion or asymmetry of two features or paired sets.'},
          {value:80, label:'Tissue loss with asymmetry of 3+ features', description:'Visible or palpable tissue loss AND gross distortion or asymmetry of three or more features or paired sets.'},
        ]
      }
    ]
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
      ]
    }]
  },
};

// Map condition names → evaluation profile key
const HEAD_CONDITION_PROFILE = {};
['Migraine headaches','Migraine'].forEach(n => HEAD_CONDITION_PROFILE[n] = 'migraine');
['TBI residuals','Residuals of Traumatic Brain Injury (TBI)','Cognitive disorder'].forEach(n => HEAD_CONDITION_PROFILE[n] = 'tbi');
['TMJ disorder','Temporomandibular disorder (TMD)'].forEach(n => HEAD_CONDITION_PROFILE[n] = 'tmj');
['Tinnitus','Tinnitus, recurrent'].forEach(n => HEAD_CONDITION_PROFILE[n] = 'tinnitus');
['Hearing impairment (hearing loss)'].forEach(n => HEAD_CONDITION_PROFILE[n] = 'hearing');
['Vertigo / Dizziness','Peripheral vestibular disorders'].forEach(n => HEAD_CONDITION_PROFILE[n] = 'vestibular');
["Meniere's syndrome (endolymphatic hydrops)"].forEach(n => HEAD_CONDITION_PROFILE[n] = 'menieres');
['Vision impairment','Diplopia (double vision)','Visual field defects','Scotoma, unilateral',
 'Retinal dystrophy (including retinitis pigmentosa, wet or dry macular degeneration, early-onset macular degeneration, rod and/or cone dystrophy)',
 'Diabetic retinopathy','Optic neuropathy','Ptosis, unilateral or bilateral','Post-chiasmal disorders'
].forEach(n => HEAD_CONDITION_PROFILE[n] = 'vision');
['Fifth (trigeminal) cranial nerve, Neuralgia','Seventh (facial) cranial nerve, Paralysis of'].forEach(n => HEAD_CONDITION_PROFILE[n] = 'cranial_nerve');
['Sinusitis, chronic'].forEach(n => HEAD_CONDITION_PROFILE[n] = 'sinusitis');
["Burn scar(s) of the head, face, or neck; scar(s) of the head, face, or neck due to other causes; or other disfigurement of the head, face, or neck"].forEach(n => HEAD_CONDITION_PROFILE[n] = 'disfigurement');
// All unmapped conditions use 'generic'

function getHeadProfile(conditionName) {
  return HEAD_PROFILES[HEAD_CONDITION_PROFILE[conditionName] || 'generic'];
}

function getHeadProfileKey(conditionName) {
  return HEAD_CONDITION_PROFILE[conditionName] || 'generic';
}

// Calculate head condition rating: max of all domain values
function calculateHeadRating(domainValues) {
  let maxVal = 0;
  Object.values(domainValues).forEach(v => {
    if (typeof v === 'number' && v > maxVal) maxVal = v;
  });
  return maxVal;
}

// ── GENERIC PHYSICAL EVALUATION PROFILE ─────────────────────────────────────
const PHYSICAL_PROFILE = {
  label: 'Musculoskeletal / General Physical',
  domains: [
    { id: 'rom', label: 'Range of Motion / Function',
      description: 'How limited is your movement or physical function in this area?',
      levels: [
        {value:0,  label:'Normal',             description:'Full range of motion, no functional limitation.'},
        {value:10, label:'Slight limitation',   description:'Minor restriction noticeable with strenuous activity; mostly functional.'},
        {value:20, label:'Moderate limitation',  description:'Noticeable restriction affecting some daily activities; compensating movements.'},
        {value:30, label:'Significant limitation',description:'Movement substantially restricted; difficulty with routine tasks.'},
        {value:50, label:'Severe limitation',    description:'Major restriction; unable to perform most physical tasks in this area.'},
        {value:100,label:'Total loss / Ankylosis',description:'No useful movement remaining; complete loss of function.'}
      ]
    },
    { id: 'pain', label: 'Pain Severity',
      description: 'Rate your typical pain level during daily activities.',
      levels: [
        {value:0,  label:'No pain',          description:'No pain during normal activities.'},
        {value:10, label:'Mild',              description:'Occasional mild pain; manageable without medication.'},
        {value:20, label:'Moderate',          description:'Frequent pain requiring over-the-counter medication; affects some activities.'},
        {value:30, label:'Moderately severe', description:'Constant or near-constant pain; prescription medication needed; limits many activities.'},
        {value:50, label:'Severe',            description:'Pain prevents most activities; requires strong medication or injections.'}
      ]
    },
    { id: 'flare', label: 'Flare-ups / Episodes Bad Enough to Keep You in Bed',
      description: 'How often do you experience worsening episodes that significantly limit activity?',
      levels: [
        {value:0,  label:'None',       description:'No flare-ups or episodes bad enough to keep you in bed.'},
        {value:10, label:'Occasional', description:'A few times per year; brief duration (1-2 days).'},
        {value:20, label:'Monthly',    description:'Several times per month; moderate duration.'},
        {value:40, label:'Weekly',     description:'Weekly episodes affecting work and daily activities.'},
        {value:60, label:'Completely disabling',description:'Frequent episodes so severe they leave you unable to function (multiple per week or constant).'}
      ]
    },
    { id: 'daily', label: 'Impact on Daily Living',
      description: 'How does this condition affect your ability to work, exercise, and perform daily tasks?',
      levels: [
        {value:0,  label:'No impact',    description:'Condition does not interfere with daily living.'},
        {value:10, label:'Minimal',       description:'Minor inconvenience; can perform all duties with slight difficulty.'},
        {value:20, label:'Moderate',      description:'Cannot perform some physical tasks; needs accommodation at work.'},
        {value:30, label:'Considerable',  description:'Significant limitation on employment and daily activities.'},
        {value:50, label:'Major',         description:'Unable to maintain substantially gainful employment due to this condition.'},
        {value:100,label:'Total',         description:'Completely dependent on others for daily living activities.'}
      ]
    }
  ]
};

function calculatePhysicalRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => {
    if(typeof v === 'number' && v > maxVal) maxVal = v;
  });
  return maxVal;
}

// ── SYSTEMIC / OTHER EVALUATION PROFILES ─────────────────────────────────────

// 1. Fibromyalgia (DC 5025)
const FIBRO_PROFILES = {
  fibromyalgia: {
    label: 'Fibromyalgia (DC 5025)',
    note: 'Rated based on whether symptoms are widespread, constant vs episodic, and response to therapy.',
    domains: [
      { id: 'severity', label: 'Overall Severity',
        description: 'Frequency of symptoms and response to treatment',
        levels: [
          {value:10, label:'Continuous medication needed', description:'Symptoms controlled by continuous medication.'},
          {value:20, label:'Episodic, with exacerbations', description:'Episodic, with exacerbations often precipitated by environmental or emotional stress or by overexertion, but symptoms that are present more than one-third of the time.'},
          {value:40, label:'Constant or nearly constant', description:'Widespread musculoskeletal pain and tender points, with or without associated fatigue, sleep disturbance, stiffness, numbness/tingling/pins-and-needles (paresthesias), headache, irritable bowel symptoms, depression, anxiety, or Raynaud\'s-like symptoms that are constant or nearly so and not responding to therapy.'},
        ]
      }
    ]
  }
};
const FIBRO_CONDITION_PROFILE = { 'Fibromyalgia': 'fibromyalgia' };
function getFibroProfile(cond){ return FIBRO_PROFILES[FIBRO_CONDITION_PROFILE[cond] || 'fibromyalgia']; }
function getFibroProfileKey(cond){ return FIBRO_CONDITION_PROFILE[cond] || 'fibromyalgia'; }
function calculateFibroRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 2. Chronic Fatigue Syndrome (DC 6354)
const CFS_PROFILES = {
  cfs: {
    label: 'Chronic Fatigue Syndrome (DC 6354)',
    note: 'Rated based on activity restriction and flare-ups bad enough to keep you in bed.',
    domains: [
      { id: 'severity', label: 'Functional Limitation',
        description: 'Degree of activity restriction and flare-ups bad enough to keep you in bed',
        levels: [
          {value:10, label:'Nearly constant but able to function', description:'Debilitating fatigue, cognitive impairments, or other symptoms nearly constant and restrict routine daily activities by less than 25 percent of the pre-illness level; or flare-ups bad enough to keep you in bed for at least 1 but less than 2 weeks total per year.'},
          {value:20, label:'Routine activities restricted 25-50%', description:'Symptoms restrict routine daily activities to 50 to 75 percent of the pre-illness level; or flare-ups bad enough to keep you in bed for at least 2 but less than 4 weeks total per year.'},
          {value:40, label:'Routine activities restricted 50-75%', description:'Symptoms restrict routine daily activities to less than 50 percent of the pre-illness level; or flare-ups bad enough to keep you in bed for at least 4 but less than 6 weeks total per year.'},
          {value:60, label:'Nearly completely restricted', description:'Symptoms nearly completely restrict routine daily activities; or flare-ups bad enough to keep you in bed for at least 6 weeks total per year.'},
          {value:100, label:'Completely debilitating', description:'Debilitating fatigue, cognitive impairments and other symptoms that are completely debilitating, virtually restricting all routine daily activities.'},
        ]
      }
    ]
  }
};
const CFS_CONDITION_PROFILE = { 'Chronic fatigue syndrome': 'cfs' };
function getCFSProfile(cond){ return CFS_PROFILES[CFS_CONDITION_PROFILE[cond] || 'cfs']; }
function getCFSProfileKey(cond){ return CFS_CONDITION_PROFILE[cond] || 'cfs'; }
function calculateCFSRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 3. Diabetes Mellitus (DC 7913)
const DIABETES_PROFILES = {
  diabetes: {
    label: 'Diabetes Mellitus (DC 7913)',
    note: 'Rated based on management requirements: diet, medication, insulin, and activity regulation.',
    domains: [
      { id: 'management', label: 'Treatment & Management',
        description: 'Level of treatment required to manage diabetes',
        levels: [
          {value:10, label:'Manageable by diet alone', description:'Manageable by restricted diet only.'},
          {value:20, label:'Insulin and diet, or oral meds and diet', description:'Requiring insulin and restricted diet, or oral hypoglycemic agent and restricted diet.'},
          {value:40, label:'Insulin, diet, and activity regulation', description:'Requiring insulin, restricted diet, and regulation of activities.'},
          {value:60, label:'Insulin, diet, activity regulation + episodes', description:'Requiring insulin, restricted diet, and regulation of activities with dangerous blood sugar emergencies (ketoacidosis) or low blood sugar episodes (hypoglycemic reactions) requiring 1-2 hospitalizations per year or twice-a-month visits to a diabetic care provider, plus complications that would not be compensable if separately evaluated.'},
          {value:100, label:'Requires more than one daily insulin injection', description:'Requiring more than one daily injection of insulin, restricted diet, and regulation of activities (avoidance of strenuous occupational and recreational activities) with dangerous blood sugar emergencies (ketoacidosis) or low blood sugar episodes (hypoglycemic reactions) requiring at least 3 hospitalizations per year or weekly visits to a diabetic care provider, plus either progressive loss of weight and strength or complications that would be compensable if separately evaluated.'},
        ]
      }
    ]
  }
};
const DIABETES_CONDITION_PROFILE = { 'Diabetes mellitus': 'diabetes', 'Diabetes mellitus, Type 2': 'diabetes', 'Diabetes mellitus, Type 1': 'diabetes' };
function getDiabetesProfile(cond){ return DIABETES_PROFILES[DIABETES_CONDITION_PROFILE[cond] || 'diabetes']; }
function getDiabetesProfileKey(cond){ return DIABETES_CONDITION_PROFILE[cond] || 'diabetes'; }
function calculateDiabetesRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 4. Hypothyroidism (DC 7903)
const HYPOTHYROID_PROFILES = {
  hypothyroid: {
    label: 'Hypothyroidism (DC 7903)',
    note: 'Includes Hashimoto\'s thyroiditis. Rated based on symptoms and response to treatment.',
    domains: [
      { id: 'severity', label: 'Symptom Severity',
        description: 'Degree of symptoms despite treatment',
        levels: [
          {value:0, label:'Asymptomatic on medication', description:'No symptoms; controlled by continuous medication.'},
          {value:10, label:'Fatigability, or medication required', description:'Fatigability, or continuous medication required for control.'},
          {value:30, label:'Fatigability, constipation, mental sluggishness', description:'Fatigability, constipation, and mental sluggishness.'},
          {value:60, label:'Muscular weakness, mental disturbance, weight gain', description:'Muscular weakness, mental disturbance, and weight gain.'},
          {value:100, label:'Cold intolerance, cardiovascular involvement', description:'Cold intolerance, muscular weakness, cardiovascular involvement, mental disturbance (dementia, slowing of thought, depression), slow heartbeat (bradycardia — less than 60 beats per minute), and sleepiness.'},
        ]
      }
    ]
  }
};
const HYPOTHYROID_CONDITION_PROFILE = { 'Hypothyroidism': 'hypothyroid', 'Hashimoto\'s thyroiditis': 'hypothyroid' };
function getHypothyroidProfile(cond){ return HYPOTHYROID_PROFILES[HYPOTHYROID_CONDITION_PROFILE[cond] || 'hypothyroid']; }
function getHypothyroidProfileKey(cond){ return HYPOTHYROID_CONDITION_PROFILE[cond] || 'hypothyroid'; }
function calculateHypothyroidRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 5. Hyperthyroidism (DC 7900)
const HYPERTHYROID_PROFILES = {
  hyperthyroid: {
    label: 'Hyperthyroidism / Graves\' Disease (DC 7900)',
    note: 'Rated based on symptoms and cardiovascular involvement.',
    domains: [
      { id: 'severity', label: 'Symptom Severity',
        description: 'Degree of symptoms including rapid heartbeat (tachycardia), tremor, and weight loss',
        levels: [
          {value:0, label:'Asymptomatic on medication', description:'No symptoms; controlled by continuous medication.'},
          {value:10, label:'Rapid heartbeat, tremor, medication required', description:'Rapid heartbeat (tachycardia, 100+ bpm), which may be intermittent, and tremor, or continuous medication required for control.'},
          {value:30, label:'Rapid heartbeat, tremor, increased pulse pressure or blood pressure', description:'Rapid heartbeat (tachycardia), tremor, and increased pulse pressure or blood pressure.'},
          {value:60, label:'Emotional instability, weight loss, fatigability', description:'Emotional instability, rapid heartbeat (tachycardia), fatigability, and increased pulse pressure or blood pressure.'},
          {value:100, label:'Thyroid enlargement, rapid/irregular pulse, weight loss, cardiovascular complications', description:'Thyroid enlargement, rapid heartbeat (tachycardia, more than 150 bpm), eye involvement, muscular weakness, loss of weight, and sympathetic nervous system, cardiovascular, or gastrointestinal symptoms.'},
        ]
      }
    ]
  }
};
const HYPERTHYROID_CONDITION_PROFILE = { 'Hyperthyroidism': 'hyperthyroid', 'Graves\' disease': 'hyperthyroid' };
function getHyperthyroidProfile(cond){ return HYPERTHYROID_PROFILES[HYPERTHYROID_CONDITION_PROFILE[cond] || 'hyperthyroid']; }
function getHyperthyroidProfileKey(cond){ return HYPERTHYROID_CONDITION_PROFILE[cond] || 'hyperthyroid'; }
function calculateHyperthyroidRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 6. Skin / Dermatitis (DC 7806)
const SKIN_PROFILES = {
  dermatitis: {
    label: 'Skin Conditions — Dermatitis / Eczema (DC 7806)',
    note: 'Covers dermatitis, eczema, psoriasis, and most general skin conditions. Rated by body area affected and treatment type.',
    domains: [
      { id: 'area', label: 'Body Area Affected',
        description: 'Percentage of entire body or exposed areas affected',
        levels: [
          {value:0, label:'Less than 5% of body', description:'Less than 5 percent of the entire body or less than 5 percent of exposed areas affected, and no more than topical therapy required during the past 12-month period.'},
          {value:10, label:'At least 5% but less than 20%', description:'At least 5 percent but less than 20 percent of the entire body or at least 5 percent but less than 20 percent of exposed areas affected, and intermittent systemic therapy such as corticosteroids or other immunosuppressive drugs required for a total duration of less than 6 weeks during the past 12-month period.'},
          {value:30, label:'20 to 40% of body', description:'20 to 40 percent of the entire body or 20 to 40 percent of exposed areas affected, or systemic therapy such as corticosteroids or other immunosuppressive drugs required for a total duration of 6 weeks or more, but not constantly, during the past 12-month period.'},
          {value:60, label:'More than 40% of body', description:'More than 40 percent of the entire body or more than 40 percent of exposed areas affected, or constant or near-constant systemic therapy such as corticosteroids or other immunosuppressive drugs required during the past 12-month period.'},
        ]
      }
    ]
  },
  scars: {
    label: 'Scars — Painful or Unstable (DC 7804)',
    note: 'Rated based on number of scars and whether they are painful, unstable, or both. An unstable scar is one where there is frequent loss of covering of skin over the scar.',
    domains: [
      { id: 'count', label: 'Number of Painful or Unstable Scars',
        description: 'Count of scars that are painful on examination and/or unstable (skin covering frequently breaks down)',
        levels: [
          {value:0, label:'No painful or unstable scars', description:'No scars that are painful on examination or unstable.'},
          {value:10, label:'1 or 2 scars', description:'One or two scars that are unstable or painful.'},
          {value:20, label:'3 or 4 scars', description:'Three or four scars that are unstable or painful.'},
          {value:30, label:'5 or more scars', description:'Five or more scars that are unstable or painful.'},
        ]
      },
      { id: 'both', label: 'Both Painful AND Unstable?',
        description: 'If one or more scars are BOTH painful and unstable, an additional 10% is added per VA Note 2',
        levels: [
          {value:0, label:'No — painful only or unstable only', description:'Scars are either painful or unstable, but not both.'},
          {value:10, label:'Yes — at least one scar is both painful AND unstable', description:'One or more scars are both painful on examination AND unstable (skin covering frequently breaks down). VA adds 10% to the evaluation.'},
        ]
      }
    ]
  },
  burn_deep: {
    label: 'Burn Scars / Deep Scars (DC 7801)',
    note: 'For burn scars or scars due to other causes, NOT of the head/face/neck, that are deep (associated with underlying soft tissue damage) and nonlinear. Rated by total area.',
    domains: [
      { id: 'area', label: 'Total Area of Deep Scars',
        description: 'Combined area of all deep nonlinear scars (not on head/face/neck). A deep scar is one associated with underlying soft tissue damage.',
        levels: [
          {value:0, label:'Less than 6 sq inches (39 sq cm)', description:'Total area less than 6 square inches (39 sq cm).'},
          {value:10, label:'6 to 12 sq inches (39–77 sq cm)', description:'Area at least 6 but less than 12 square inches (39 to 77 sq cm).'},
          {value:20, label:'12 to 72 sq inches (77–465 sq cm)', description:'Area at least 12 but less than 72 square inches (77 to 465 sq cm).'},
          {value:30, label:'72 to 144 sq inches (465–929 sq cm)', description:'Area at least 72 but less than 144 square inches (465 to 929 sq cm).'},
          {value:40, label:'144+ sq inches (929+ sq cm)', description:'Area of 144 square inches (929 sq cm) or greater.'},
        ]
      },
      { id: 'function', label: 'Limitation of Function',
        description: 'Does the scar cause limitation of motion or other functional loss?',
        levels: [
          {value:0, label:'No functional limitation', description:'Scar does not limit movement or function.'},
          {value:10, label:'Mild limitation', description:'Scar causes mild tightness or pulling that slightly limits range of motion.'},
          {value:20, label:'Moderate limitation', description:'Scar noticeably restricts movement of the affected body part.'},
          {value:30, label:'Severe limitation', description:'Scar severely restricts movement — may need to rate under the affected body part (DC 7805).'},
        ]
      }
    ]
  },
  burn_superficial: {
    label: 'Superficial Scars (DC 7802)',
    note: 'For burn scars or scars due to other causes, NOT of the head/face/neck, that are superficial (not associated with underlying soft tissue damage) and nonlinear. Rated by total area.',
    domains: [
      { id: 'area', label: 'Total Area of Superficial Scars',
        description: 'Combined area of all superficial nonlinear scars (not on head/face/neck). A superficial scar is one not associated with underlying soft tissue damage.',
        levels: [
          {value:0, label:'Less than 144 sq inches (929 sq cm)', description:'Total area less than 144 square inches (929 sq cm). Not compensable under DC 7802 — may still qualify under DC 7804 if painful or unstable.'},
          {value:10, label:'144+ sq inches (929+ sq cm)', description:'Area of 144 square inches (929 sq cm) or greater.'},
        ]
      }
    ]
  }
};
const SKIN_CONDITION_PROFILE = {
  'Dermatitis or eczema': 'dermatitis', 'Psoriasis': 'dermatitis', 'Acne vulgaris': 'dermatitis',
  'Chronic urticaria': 'dermatitis', 'Contact dermatitis': 'dermatitis', 'Seborrheic dermatitis': 'dermatitis',
  'Pseudofolliculitis barbae': 'dermatitis', 'Folliculitis': 'dermatitis', 'Hidradenitis suppurativa': 'dermatitis',
  'Alopecia areata': 'dermatitis', 'Vitiligo': 'dermatitis', 'Chloracne': 'dermatitis',
  'Tinea pedis (athlete\'s foot)': 'dermatitis', 'Hyperhidrosis': 'dermatitis',
  'Scar(s), unstable or painful': 'scars', 'Keloid scarring': 'scars', 'Burn scar(s)': 'burn_deep',
  'Skin cancer (basal cell, squamous cell, melanoma)': 'dermatitis',
};
function getSkinProfile(cond){ return SKIN_PROFILES[SKIN_CONDITION_PROFILE[cond] || 'dermatitis']; }
function getSkinProfileKey(cond){ return SKIN_CONDITION_PROFILE[cond] || 'dermatitis'; }
function calculateSkinRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 7. Epilepsy / Seizures (DC 8910-8914)
const EPILEPSY_PROFILES = {
  epilepsy: {
    label: 'Seizure Disorder / Epilepsy (DC 8910-8914)',
    note: 'Rated based on frequency of major (grand mal) and minor (petit mal) seizures.',
    domains: [
      { id: 'major', label: 'Major Seizures (Grand Mal)',
        description: 'Full-body convulsive (generalized tonic-clonic) or other major seizure frequency over the past year',
        levels: [
          {value:0, label:'No major seizures', description:'No documented major seizures.'},
          {value:20, label:'1 in last 2 years', description:'At least 1 major seizure in the last 2 years.'},
          {value:40, label:'1 in last 6 months', description:'At least 1 major seizure in the last 6 months; or 2+ in last year.'},
          {value:60, label:'1 every 3 months', description:'Averaging at least 1 major seizure every 3 months over the last year.'},
          {value:80, label:'1 per month', description:'Averaging at least 1 major seizure per month over the last year.'},
          {value:100, label:'1+ per week', description:'Averaging at least 1 major seizure per week over the last year.'},
        ]
      },
      { id: 'minor', label: 'Minor Seizures (Petit Mal / Absence)',
        description: 'Absence seizures (brief staring spells), sudden muscle jerks (myoclonic jerks), or other minor seizure activity',
        levels: [
          {value:0, label:'No minor seizures', description:'No documented minor seizures.'},
          {value:10, label:'1-2 minor seizures in last 6 months', description:'A confirmed minor seizure within the last 6 months.'},
          {value:20, label:'2+ minor seizures in last 6 months', description:'At least 2 minor seizures in the last 6 months.'},
          {value:40, label:'5-8 minor seizures per week', description:'Averaging 5 to 8 minor seizures weekly.'},
          {value:60, label:'More than 10 minor seizures per week', description:'Averaging more than 10 minor seizures weekly.'},
        ]
      }
    ]
  }
};
const EPILEPSY_CONDITION_PROFILE = { 'Seizure disorder (epilepsy)': 'epilepsy', 'Epilepsy': 'epilepsy' };
function getEpilepsyProfile(cond){ return EPILEPSY_PROFILES[EPILEPSY_CONDITION_PROFILE[cond] || 'epilepsy']; }
function getEpilepsyProfileKey(cond){ return EPILEPSY_CONDITION_PROFILE[cond] || 'epilepsy'; }
function calculateEpilepsyRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 8. Lupus / SLE (DC 6350)
const LUPUS_PROFILES = {
  lupus: {
    label: 'Systemic Lupus Erythematosus (DC 6350)',
    note: 'Rated based on exacerbation frequency and organ/system involvement.',
    domains: [
      { id: 'severity', label: 'Disease Activity',
        description: 'Frequency of exacerbations and extent of organ involvement',
        levels: [
          {value:10, label:'Exacerbations once or twice per year', description:'Exacerbations once or twice a year or symptomatic during the past 2 years.'},
          {value:60, label:'Frequent exacerbations', description:'Exacerbations lasting a week or more, 2 to 3 times per year.'},
          {value:100, label:'Acute with frequent crises', description:'Acute, with frequent exacerbations, producing severe impairment of health; or constantly combating active lupus involving vital organs/body systems.'},
        ]
      }
    ]
  }
};
const LUPUS_CONDITION_PROFILE = { 'Systemic lupus erythematosus (SLE)': 'lupus', 'Lupus': 'lupus' };
function getLupusProfile(cond){ return LUPUS_PROFILES[LUPUS_CONDITION_PROFILE[cond] || 'lupus']; }
function getLupusProfileKey(cond){ return LUPUS_CONDITION_PROFILE[cond] || 'lupus'; }
function calculateLupusRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 9. Rheumatoid Arthritis (DC 5002)
const RA_PROFILES = {
  ra: {
    label: 'Rheumatoid Arthritis (DC 5002)',
    note: 'Rated as active process or chronic residuals, whichever is higher.',
    domains: [
      { id: 'active', label: 'Active Disease Process',
        description: 'Whole-body symptoms (constitutional): weight loss, anemia, and overall impairment during active disease',
        levels: [
          {value:0, label:'No active disease', description:'Inactive or in remission.'},
          {value:20, label:'1-2 flare-ups per year', description:'One or two flare-ups (exacerbations) a year in a well-established diagnosis.'},
          {value:40, label:'Symptom combinations that are disabling', description:'Symptom combinations causing definite impairment of health supported by examination findings, or disabling flare-ups occurring 3 or more times a year.'},
          {value:60, label:'Weight loss and anemia, severely disabling', description:'Less than criteria for 100 percent but with weight loss and anemia causing severe impairment of health, or severely disabling flare-ups occurring 4 or more times a year or a lesser number over prolonged periods.'},
          {value:100, label:'Whole-body symptoms with total disability', description:'Whole-body symptoms (constitutional manifestations) associated with active joint involvement, totally disabling.'},
        ]
      }
    ]
  }
};
const RA_CONDITION_PROFILE = { 'Rheumatoid arthritis': 'ra' };
function getRAProfile(cond){ return RA_PROFILES[RA_CONDITION_PROFILE[cond] || 'ra']; }
function getRAProfileKey(cond){ return RA_CONDITION_PROFILE[cond] || 'ra'; }
function calculateRARating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 10. Hypertension (DC 7101)
const HTN_PROFILES = {
  htn: {
    label: 'Hypertension (DC 7101)',
    note: 'Rated based on blood pressure readings with or without medication.',
    domains: [
      { id: 'severity', label: 'Blood Pressure Severity',
        description: 'Based on diastolic and systolic blood pressure readings',
        levels: [
          {value:0, label:'Within normal limits on medication', description:'Blood pressure controlled to normal limits with medication; no history of diastolic 100+.'},
          {value:10, label:'Diastolic 100+ or systolic 160+', description:'Diastolic pressure predominantly 100 or more, or systolic pressure predominantly 160 or more; or minimum evaluation for an individual with a history of diastolic pressure predominantly 100 or more who requires continuous medication for control.'},
          {value:20, label:'Diastolic 110+ or systolic 200+', description:'Diastolic pressure predominantly 110 or more, or systolic pressure predominantly 200 or more.'},
          {value:40, label:'Diastolic 120+', description:'Diastolic pressure predominantly 120 or more.'},
          {value:60, label:'Diastolic 130+', description:'Diastolic pressure predominantly 130 or more.'},
        ]
      }
    ]
  }
};
const HTN_CONDITION_PROFILE = { 'Hypertension': 'htn' };
function getHTNProfile(cond){ return HTN_PROFILES[HTN_CONDITION_PROFILE[cond] || 'htn']; }
function getHTNProfileKey(cond){ return HTN_CONDITION_PROFILE[cond] || 'htn'; }
function calculateHTNRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 11. Raynaud's Syndrome (DC 7117)
const RAYNAUDS_PROFILES = {
  raynauds: {
    label: 'Raynaud\'s Syndrome (DC 7117)',
    note: 'Rated based on frequency of attacks and digital involvement.',
    domains: [
      { id: 'severity', label: 'Attack Frequency & Severity',
        description: 'Frequency of characteristic attacks and extent of digital involvement',
        levels: [
          {value:10, label:'1-3 attacks per week', description:'Characteristic attacks occurring one to three times a week.'},
          {value:20, label:'4-6 attacks per week', description:'Characteristic attacks occurring four to six times a week.'},
          {value:40, label:'Daily attacks', description:'Characteristic attacks occurring at least daily.'},
          {value:60, label:'2+ digital ulcers, autoamputation', description:'Two or more digital ulcers and history of characteristic attacks, including autoamputation of one or more digits.'},
          {value:100, label:'2+ digital ulcers plus autoamputation + critical ischemia', description:'Two or more digital ulcers plus autoamputation of one or more digits and history of characteristic attacks.'},
        ]
      }
    ]
  }
};
const RAYNAUDS_CONDITION_PROFILE = { 'Raynaud\'s syndrome': 'raynauds', 'Raynaud\'s phenomenon': 'raynauds' };
function getRaynaudsProfile(cond){ return RAYNAUDS_PROFILES[RAYNAUDS_CONDITION_PROFILE[cond] || 'raynauds']; }
function getRaynaudsProfileKey(cond){ return RAYNAUDS_CONDITION_PROFILE[cond] || 'raynauds'; }
function calculateRaynaudsRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 12. GERD (DC 7346)
const GERD_PROFILES = {
  gerd: {
    label: 'GERD / Hiatal Hernia (DC 7346)',
    note: 'Rated based on symptom severity, pain, and weight loss.',
    domains: [
      { id: 'severity', label: 'Symptom Severity',
        description: 'Frequency and severity of reflux symptoms',
        levels: [
          {value:10, label:'Two or more symptoms of less severity', description:'Two or more of the symptoms for the 30 percent evaluation of less severity.'},
          {value:30, label:'Persistently recurrent symptoms with chest pain, difficulty swallowing, heartburn, regurgitation', description:'Persistently recurrent stomach/chest distress with difficulty swallowing (dysphagia), heartburn (pyrosis), and regurgitation, accompanied by pain behind the breastbone or in the arm or shoulder, causing considerable impairment of health.'},
          {value:60, label:'Pain, vomiting, significant weight loss, vomiting blood/black stool with anemia', description:'Symptoms of pain, vomiting, significant weight loss and vomiting blood (hematemesis) or black/bloody stool (melena) with moderate anemia; or other symptom combinations causing severe impairment of health.'},
        ]
      }
    ]
  }
};
const GERD_CONDITION_PROFILE = { 'GERD / acid reflux': 'gerd', 'Hiatal hernia': 'gerd', 'GERD': 'gerd' };
function getGERDProfile(cond){ return GERD_PROFILES[GERD_CONDITION_PROFILE[cond] || 'gerd']; }
function getGERDProfileKey(cond){ return GERD_CONDITION_PROFILE[cond] || 'gerd'; }
function calculateGERDRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 13. Erectile Dysfunction (DC 7522) + Loss of Creative Organ
const ED_PROFILES = {
  ed: {
    label: 'Erectile Dysfunction (DC 7522)',
    note: 'ED itself is typically rated 0% but qualifies for Special Monthly Compensation (SMC-K) for loss of use of a creative organ. Loss of a creative organ (testicle, penis, ovary) may be rated higher.',
    domains: [
      { id: 'severity', label: 'Severity of Dysfunction',
        description: 'Degree of erectile dysfunction or loss of creative organ',
        levels: [
          {value:0, label:'Erectile dysfunction present', description:'Loss of erectile power; rated 0% but eligible for Special Monthly Compensation (SMC-K) for loss of use of a creative organ (~$120/month additional).'},
          {value:20, label:'Penile deformity with loss of erectile power', description:'Deformity of the penis with loss of erectile power.'},
          {value:30, label:'Removal of half or more of penis', description:'Removal of half or more of the penis.'},
        ]
      },
      { id: 'organ', label: 'Loss of Creative Organ',
        description: 'Loss or removal of a creative organ (testicle, ovary)',
        levels: [
          {value:0, label:'No loss of creative organ', description:'No loss or removal of a creative organ.'},
          {value:0, label:'Loss of use (SMC-K eligible)', description:'Loss of use of a creative organ qualifies for Special Monthly Compensation (SMC-K) at approximately $120/month, separate from the disability percentage.'},
          {value:20, label:'Removal of one testicle', description:'Removal of one testicle.'},
          {value:30, label:'Removal of both testicles / complete loss', description:'Removal of both testicles, or complete shrinkage/wasting (atrophy).'},
        ]
      }
    ]
  }
};
const ED_CONDITION_PROFILE = { 'Erectile dysfunction': 'ed', 'Loss of use of creative organ': 'ed' };
function getEDProfile(cond){ return ED_PROFILES[ED_CONDITION_PROFILE[cond] || 'ed']; }
function getEDProfileKey(cond){ return ED_CONDITION_PROFILE[cond] || 'ed'; }
function calculateEDRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 14. Parkinson's Disease (DC 8004)
const PARKINSONS_PROFILES = {
  parkinsons: {
    label: 'Parkinson\'s Disease (DC 8004)',
    note: 'Minimum rating of 30%. Rated based on severity of motor and non-motor symptoms.',
    domains: [
      { id: 'severity', label: 'Disease Severity',
        description: 'Overall functional impairment from Parkinson\'s symptoms',
        levels: [
          {value:30, label:'Minimum rating', description:'Minimum rating for Parkinson\'s disease. Mild symptoms: slight tremor, minor rigidity, minimal impact on daily activities.'},
          {value:60, label:'Moderately severe', description:'Moderate symptoms: significant tremor and/or rigidity, slowness of movement (bradykinesia), balance problems, noticeable impact on daily activities and employment.'},
          {value:100, label:'Complete disability', description:'Severe symptoms: pronounced tremor, severe rigidity, significant balance problems when standing/walking (postural instability), unable to perform most daily activities independently; may also be rated based on individual residuals if higher.'},
        ]
      }
    ]
  }
};
const PARKINSONS_CONDITION_PROFILE = { 'Parkinson\'s disease': 'parkinsons' };
function getParkinsonsProfile(cond){ return PARKINSONS_PROFILES[PARKINSONS_CONDITION_PROFILE[cond] || 'parkinsons']; }
function getParkinsonsProfileKey(cond){ return PARKINSONS_CONDITION_PROFILE[cond] || 'parkinsons'; }
function calculateParkinsonsRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 15. Multiple Sclerosis (DC 8018)
const MS_PROFILES = {
  ms: {
    label: 'Multiple Sclerosis (DC 8018)',
    note: 'Minimum rating of 30%. May also be rated on individual residuals (vision, mobility, bladder) if higher.',
    domains: [
      { id: 'severity', label: 'Disease Severity',
        description: 'Overall functional impairment from MS symptoms',
        levels: [
          {value:30, label:'Minimum rating', description:'Minimum rating for MS. Mild symptoms: fatigue, occasional numbness/tingling, minor balance issues.'},
          {value:60, label:'Moderately severe', description:'Moderate symptoms: significant fatigue, muscle weakness, coordination problems, bladder dysfunction, cognitive fog impacting work.'},
          {value:100, label:'Complete disability', description:'Severe symptoms: pronounced disability requiring assistance, severe mobility impairment, significant cognitive decline; or may be rated on individual residuals.'},
        ]
      }
    ]
  }
};
const MS_CONDITION_PROFILE = { 'Multiple sclerosis': 'ms' };
function getMSProfile(cond){ return MS_PROFILES[MS_CONDITION_PROFILE[cond] || 'ms']; }
function getMSProfileKey(cond){ return MS_CONDITION_PROFILE[cond] || 'ms'; }
function calculateMSRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 16. Myasthenia Gravis (DC 8025)
const MG_PROFILES = {
  mg: {
    label: 'Myasthenia Gravis (DC 8025)',
    note: 'Minimum rating of 30%. Rated on severity of muscular weakness and fatigue.',
    domains: [
      { id: 'severity', label: 'Disease Severity',
        description: 'Degree of muscular weakness and functional impairment',
        levels: [
          {value:30, label:'Minimum rating', description:'Minimum rating for myasthenia gravis. Mild weakness: intermittent drooping eyelid (ptosis), mild double vision, fatigable muscles, generally manageable.'},
          {value:60, label:'Moderately severe', description:'Moderate muscular weakness: difficulty chewing/difficulty swallowing (dysphagia), limb weakness, respiratory muscle involvement requiring medication adjustments.'},
          {value:100, label:'Severe / crisis-prone', description:'Severe weakness: myasthenic crises, significant respiratory compromise, inability to perform daily activities, frequent hospitalizations.'},
        ]
      }
    ]
  }
};
const MG_CONDITION_PROFILE = { 'Myasthenia gravis': 'mg' };
function getMGProfile(cond){ return MG_PROFILES[MG_CONDITION_PROFILE[cond] || 'mg']; }
function getMGProfileKey(cond){ return MG_CONDITION_PROFILE[cond] || 'mg'; }
function calculateMGRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 17. Guillain-Barré Syndrome (rated by analogy, nerve paralysis)
const GBS_PROFILES = {
  gbs: {
    label: 'Guillain-Barré Syndrome',
    note: 'Rated by analogy based on residual nerve damage and functional impairment. May also be rated on individual nerve residuals.',
    domains: [
      { id: 'severity', label: 'Residual Severity',
        description: 'Degree of residual weakness and nerve damage after acute phase',
        levels: [
          {value:10, label:'Mild residuals', description:'Mild residual weakness or numbness; mostly recovered; minor functional impact.'},
          {value:30, label:'Moderate residuals', description:'Moderate residual weakness in extremities; balance problems; fatigue; noticeable impact on daily activities.'},
          {value:60, label:'Severe residuals', description:'Significant residual paralysis or weakness; requires assistive devices; substantial functional impairment.'},
          {value:100, label:'Complete or near-complete paralysis', description:'Severe residual paralysis; wheelchair-bound or bedridden; requires assistance for daily activities.'},
        ]
      }
    ]
  }
};
const GBS_CONDITION_PROFILE = { 'Guillain-Barré syndrome': 'gbs' };
function getGBSProfile(cond){ return GBS_PROFILES[GBS_CONDITION_PROFILE[cond] || 'gbs']; }
function getGBSProfileKey(cond){ return GBS_CONDITION_PROFILE[cond] || 'gbs'; }
function calculateGBSRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// ── SYSTEMIC MASTER PROFILE REGISTRY ─────────────────────────────────────────
const SYSTEMIC_PROFILES_ALL = {
  ...FIBRO_PROFILES, ...CFS_PROFILES, ...DIABETES_PROFILES,
  ...HYPOTHYROID_PROFILES, ...HYPERTHYROID_PROFILES, ...SKIN_PROFILES,
  ...EPILEPSY_PROFILES, ...LUPUS_PROFILES, ...RA_PROFILES,
  ...HTN_PROFILES, ...RAYNAUDS_PROFILES, ...GERD_PROFILES,
  ...ED_PROFILES, ...PARKINSONS_PROFILES, ...MS_PROFILES,
  ...MG_PROFILES, ...GBS_PROFILES,
  generic: PHYSICAL_PROFILE  // fallback
};

const SYSTEMIC_CONDITION_PROFILE = {
  ...FIBRO_CONDITION_PROFILE, ...CFS_CONDITION_PROFILE, ...DIABETES_CONDITION_PROFILE,
  ...HYPOTHYROID_CONDITION_PROFILE, ...HYPERTHYROID_CONDITION_PROFILE, ...SKIN_CONDITION_PROFILE,
  ...EPILEPSY_CONDITION_PROFILE, ...LUPUS_CONDITION_PROFILE, ...RA_CONDITION_PROFILE,
  ...HTN_CONDITION_PROFILE, ...RAYNAUDS_CONDITION_PROFILE, ...GERD_CONDITION_PROFILE,
  ...ED_CONDITION_PROFILE, ...PARKINSONS_CONDITION_PROFILE, ...MS_CONDITION_PROFILE,
  ...MG_CONDITION_PROFILE, ...GBS_CONDITION_PROFILE,
};

function getSystemicProfile(cond){ return SYSTEMIC_PROFILES_ALL[SYSTEMIC_CONDITION_PROFILE[cond] || 'generic']; }
function getSystemicProfileKey(cond){ return SYSTEMIC_CONDITION_PROFILE[cond] || 'generic'; }
function calculateSystemicRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// ── BODY AREA CONDITION LISTS (for custom pin flow) ────────────────────────
const VA_AREA_CONDITIONS = {
  head: VA_HEAD,
  mental: VA_MENTAL,
  neck: [
    'Cervical strain / sprain','Cervical radiculopathy','Cervical disc disease (DDD)',
    'Cervical spinal stenosis','Cervical vertebral fracture','Whiplash injury',
    'Cervical spondylosis','Torticollis','Neck muscle spasm','Other neck condition'
  ],
  shoulder: [
    'Rotator cuff tear / tendinopathy','Shoulder impingement','Shoulder instability / dislocation',
    'Labral tear (SLAP)','Frozen shoulder (adhesive capsulitis)','AC joint separation',
    'Shoulder arthritis','Shoulder bursitis','Shoulder fracture','Other shoulder condition'
  ],
  back: [
    'Lumbar strain / sprain','Lumbar disc herniation','Lumbar radiculopathy / sciatica',
    'Degenerative disc disease (lumbar)','Spinal stenosis (lumbar)','Thoracic strain',
    'Scoliosis','Compression fracture','Sacroiliac joint dysfunction',
    'Ankylosing spondylitis','Intervertebral disc syndrome (IVDS)','Other back / spine condition'
  ],
  chest: [
    'Asthma','COPD / chronic bronchitis','Pulmonary embolism',
    'Costochondritis','Rib fracture','Restrictive lung disease',
    'Sleep apnea','Pleural effusion','Pneumothorax',
    'Chronic cough','Chest wall pain','Other chest / lung condition'
  ],
  abdomen: [
    'GERD / acid reflux','Irritable bowel syndrome (IBS)','Hiatal hernia',
    'Inguinal hernia','Peptic ulcer disease','Crohn\'s disease',
    'Ulcerative colitis','Gallbladder disease','Kidney stones',
    'Liver condition','Bladder condition','Pelvic pain','Other abdominal condition'
  ],
  hip: [
    'Hip osteoarthritis','Hip labral tear','Hip bursitis (trochanteric)',
    'Hip impingement (FAI)','Hip fracture','Avascular necrosis of hip',
    'Hip flexor strain','Snapping hip syndrome','Hip replacement (total)',
    'Other hip condition'
  ],
  elbow: [
    'Lateral epicondylitis (tennis elbow)','Medial epicondylitis (golfer\'s elbow)',
    'Elbow bursitis (olecranon)','Cubital tunnel syndrome','Elbow fracture',
    'Elbow arthritis','Forearm fracture','Forearm muscle strain',
    'Elbow dislocation','Other elbow / forearm condition'
  ],
  wrist_hand: [
    'Carpal tunnel syndrome','De Quervain\'s tenosynovitis','Wrist fracture',
    'Trigger finger','Dupuytren\'s contracture','Hand / finger fracture',
    'Wrist sprain','Ganglion cyst','Wrist arthritis','Hand arthritis',
    'Raynaud\'s phenomenon','Other wrist / hand condition'
  ],
  knee: [
    'Knee osteoarthritis','ACL tear / reconstruction','Meniscus tear',
    'Patellar tendinitis','Patellofemoral syndrome','MCL / LCL sprain',
    'Knee bursitis','Knee instability','Knee replacement (total)',
    'Baker\'s cyst','Chondromalacia patella','Other knee condition'
  ],
  leg: [
    'Shin splints (MTSS)','Stress fracture (tibia / fibula)','Hamstring strain',
    'Quadriceps strain','Calf strain / tear','Deep vein thrombosis (DVT)',
    'Peripheral neuropathy','Femur fracture','Compartment syndrome',
    'Varicose veins','Muscle atrophy','Other leg condition'
  ],
  ankle_foot: [
    'Ankle sprain (chronic)','Ankle instability','Achilles tendinitis / rupture',
    'Plantar fasciitis','Flat feet (pes planus)','Ankle fracture',
    'Foot fracture (metatarsal / stress)','Bunion (hallux valgus)','Heel spurs',
    'Morton\'s neuroma','Tarsal tunnel syndrome','Diabetic foot neuropathy',
    'Other ankle / foot condition'
  ],
  systemic: [
    // Autoimmune / Immune
    'Systemic lupus erythematosus (SLE)', 'Rheumatoid arthritis', 'Multiple sclerosis',
    'Myasthenia gravis', 'Guillain-Barré syndrome', 'Sjögren\'s syndrome',
    'Psoriatic arthritis', 'Celiac disease',
    // Endocrine / Metabolic
    'Diabetes mellitus', 'Diabetes mellitus, Type 2', 'Diabetes mellitus, Type 1',
    'Hypothyroidism', 'Hashimoto\'s thyroiditis', 'Hyperthyroidism', 'Graves\' disease',
    'Addison\'s disease', 'Cushing\'s syndrome', 'Hyperparathyroidism',
    'Hypogonadism / low testosterone',
    // Neurological (systemic)
    'Parkinson\'s disease', 'Seizure disorder (epilepsy)',
    'Restless leg syndrome', 'Peripheral artery disease',
    // Skin
    'Dermatitis or eczema', 'Psoriasis', 'Acne vulgaris', 'Contact dermatitis',
    'Seborrheic dermatitis', 'Pseudofolliculitis barbae', 'Folliculitis',
    'Hidradenitis suppurativa', 'Alopecia areata', 'Chloracne',
    'Tinea pedis (athlete\'s foot)', 'Hyperhidrosis', 'Chronic urticaria', 'Vitiligo',
    'Skin cancer (basal cell, squamous cell, melanoma)', 'Keloid scarring',
    'Scar(s), unstable or painful', 'Burn scar(s)',
    // Chronic Pain / Fatigue
    'Fibromyalgia', 'Chronic fatigue syndrome', 'Chronic pain syndrome',
    // Cardiovascular (systemic)
    'Hypertension', 'Raynaud\'s syndrome', 'Raynaud\'s phenomenon',
    // Gastrointestinal
    'GERD / acid reflux', 'Hiatal hernia', 'Irritable bowel syndrome (IBS)',
    // Reproductive / Genitourinary
    'Erectile dysfunction', 'Loss of use of creative organ',
    // Vaccine Injury
    'SIRVA (shoulder injury related to vaccine administration)',
    'Myocarditis (vaccine-related)', 'Transverse myelitis',
    'Small fiber neuropathy', 'CIDP (chronic inflammatory demyelinating polyneuropathy)',
    // Toxic Exposure / PACT Act
    'Constrictive bronchiolitis', 'Respiratory cancer',
    'Kidney cancer / renal cell carcinoma', 'Bladder cancer', 'Prostate cancer',
    'Pancreatic cancer', 'Glioblastoma / brain cancer',
    // Hematologic
    'Sickle cell anemia', 'Iron deficiency anemia',
    // Infectious / Other
    'Lyme disease', 'Sarcoidosis', 'HIV/AIDS', 'Hepatitis B', 'Hepatitis C',
    'Gout', 'Obesity (secondary)', 'Amyloidosis',
    'Other systemic condition'
  ]
};

// ── KNEE EVALUATION PROFILES (VA 8787) ──────────────────────────────────────
const KNEE_PROFILES = {
  rom: {
    label: 'Range of Motion — How Far It Moves (DC 5260/5261)',
    domains: [
      { id: 'flexion', label: 'Bending (Flexion) — DC 5260',
        description: 'How far can the knee bend? Normal is 140+ degrees.',
        levels: [
          {value:0,  label:'Normal (140°+)',         description:'Full bending (flexion), no limitation.'},
          {value:10, label:'Limited to 45°',          description:'Bending (flexion) limited to 45 degrees.'},
          {value:20, label:'Limited to 30°',          description:'Bending (flexion) limited to 30 degrees.'},
          {value:30, label:'Limited to 15°',          description:'Bending (flexion) limited to 15 degrees or less.'},
        ]
      },
      { id: 'extension', label: 'Straightening (Extension) — DC 5261',
        description: 'How far can the knee straighten? Normal is 0 degrees (fully straight).',
        levels: [
          {value:0,  label:'Normal (0°)',              description:'Full straightening (extension), no limitation.'},
          {value:10, label:'Limited to 10°',           description:'Straightening (extension) limited to 10 degrees.'},
          {value:20, label:'Limited to 15°',           description:'Straightening (extension) limited to 15 degrees.'},
          {value:30, label:'Limited to 20°',           description:'Straightening (extension) limited to 20 degrees.'},
          {value:40, label:'Limited to 30°',           description:'Straightening (extension) limited to 30 degrees.'},
          {value:50, label:'Limited to 45°+',          description:'Straightening (extension) limited to 45 degrees or more.'},
        ]
      }
    ]
  },
  instability: {
    label: 'Instability / Partial Dislocation (DC 5257)',
    domains: [
      { id: 'instability', label: 'Recurrent Partial Dislocation or Lateral Instability',
        description: 'Severity of knee giving way, lateral instability, or recurrent partial dislocation (subluxation).',
        levels: [
          {value:0,  label:'None',     description:'No instability or partial dislocation.'},
          {value:10, label:'Slight',   description:'Slight recurrent partial dislocation (subluxation) or slight lateral instability.'},
          {value:20, label:'Moderate', description:'Moderate recurrent partial dislocation (subluxation) or moderate lateral instability.'},
          {value:30, label:'Severe',   description:'Severe recurrent partial dislocation (subluxation) or severe lateral instability.'},
        ]
      }
    ]
  },
  meniscus: {
    label: 'Meniscus / Cartilage (DC 5258/5259)',
    domains: [
      { id: 'meniscus', label: 'Semilunar Cartilage Condition',
        description: 'Meniscus (cartilage) damage, locking, or surgical removal.',
        levels: [
          {value:0,  label:'Asymptomatic',            description:'No symptoms or asymptomatic residuals following removal.'},
          {value:10, label:'Dislocated with locking',  description:'Dislocated semilunar cartilage with frequent episodes of locking, pain, and swelling from fluid in the joint (effusion).'},
          {value:20, label:'Symptomatic after removal', description:'Symptomatic residuals following semilunar cartilage removal.'},
        ]
      }
    ]
  },
  replacement: {
    label: 'Knee Replacement (DC 5055)',
    domains: [
      { id: 'replacement', label: 'Prosthetic Knee Status',
        description: 'Current status after total or partial knee replacement surgery.',
        levels: [
          {value:30,  label:'Minimum post-replacement', description:'Minimum evaluation following prosthetic replacement (after initial 100% period).'},
          {value:60,  label:'Chronic residuals',        description:'Chronic residuals: severe painful motion or weakness requiring assistive devices.'},
          {value:100, label:'Within 13 months of surgery', description:'100% rating for 13 months following prosthetic replacement of knee joint.'},
        ]
      }
    ]
  },
  arthritis: {
    label: 'Degenerative Arthritis (DC 5003)',
    domains: [
      { id: 'arthritis', label: 'Arthritis Severity',
        description: 'Degenerative arthritis confirmed by X-ray with limitation of motion.',
        levels: [
          {value:0,  label:'X-ray only, no limitation', description:'X-ray evidence of arthritis without painful or limited motion.'},
          {value:10, label:'Painful motion / minor limitation', description:'X-ray evidence with painful motion or some limitation of motion.'},
          {value:20, label:'Significant limitation',    description:'X-ray evidence with more significant limitation of motion in the joint.'},
        ]
      }
    ]
  },
  generic: {
    label: 'General Knee Assessment',
    domains: [
      { id: 'severity', label: 'Overall Knee Condition Severity',
        description: 'General functional impact of this knee condition.',
        levels: [
          {value:0,  label:'Asymptomatic',       description:'Condition present but no functional limitation.'},
          {value:10, label:'Mild',                description:'Mild symptoms with slight functional limitation.'},
          {value:20, label:'Moderate',            description:'Moderate symptoms with noticeable limitation.'},
          {value:30, label:'Moderately severe',   description:'Significant symptoms affecting daily activities.'},
          {value:50, label:'Severe',              description:'Severe symptoms substantially limiting function.'},
        ]
      }
    ]
  }
};

const KNEE_CONDITION_PROFILE = {
  'Knee osteoarthritis': 'arthritis',
  'ACL tear / reconstruction': 'instability',
  'Meniscus tear': 'meniscus',
  'Patellar tendinitis': 'rom',
  'Patellofemoral syndrome': 'rom',
  'MCL / LCL sprain': 'instability',
  'Knee bursitis': 'generic',
  'Knee instability': 'instability',
  'Knee replacement (total)': 'replacement',
  'Baker\'s cyst': 'generic',
  'Chondromalacia patella': 'rom',
};

function getKneeProfile(conditionName){
  return KNEE_PROFILES[KNEE_CONDITION_PROFILE[conditionName] || 'generic'];
}
function getKneeProfileKey(conditionName){
  return KNEE_CONDITION_PROFILE[conditionName] || 'generic';
}
function calculateKneeRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => {
    if(typeof v === 'number' && v > maxVal) maxVal = v;
  });
  return maxVal;
}

// ── BACK & SPINE EVALUATION PROFILES (VA 8787) ─────────────────────────────
const SPINE_PROFILES = {
  thoracolumbar: {
    label: 'Thoracolumbar Spine Range of Motion (General Rating Formula)',
    domains: [
      { id: 'forward_flexion', label: 'Forward Bending (Flexion)',
        description: 'How far can you bend forward? Normal is 90 degrees.',
        levels: [
          {value:0,  label:'Normal (90°)',           description:'Full forward bending (flexion), no limitation.'},
          {value:10, label:'Greater than 60° but ≤85°', description:'Forward bending (flexion) greater than 60° but not greater than 85°; or combined range of motion >120° but ≤235°.'},
          {value:20, label:'Greater than 30° but ≤60°', description:'Forward bending (flexion) greater than 30° but not greater than 60°; or combined range of motion ≤120°; or muscle spasm/guarding causing abnormal gait or contour.'},
          {value:40, label:'30° or less',             description:'Forward bending (flexion) of the thoracolumbar spine 30° or less; or the spine is frozen/locked in a favorable position (favorable ankylosis).'},
          {value:50, label:'Spine frozen in unfavorable position',   description:'The entire thoracolumbar spine is frozen/locked in an unfavorable position (unfavorable ankylosis).'},
          {value:100,label:'Entire spine frozen',  description:'The entire spine is frozen/locked in an unfavorable position (unfavorable ankylosis of the entire spine).'},
        ]
      },
      { id: 'pain', label: 'Painful Motion / Spasm',
        description: 'Presence of painful motion, muscle spasm, or guarding.',
        levels: [
          {value:0,  label:'None',                  description:'No painful motion, spasm, or guarding.'},
          {value:10, label:'Painful motion / tenderness', description:'Painful motion; or muscle spasm, guarding, or localized tenderness not resulting in abnormal gait.'},
          {value:20, label:'Spasm causing abnormal gait', description:'Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour.'},
        ]
      },
      { id: 'radiculopathy', label: 'Nerve Pain / Numbness Traveling Down the Leg (Radiculopathy / Sciatica — DC 8520)',
        description: 'Nerve root involvement — numbness, tingling, pain, or weakness radiating into the legs',
        levels: [
          {value:0,  label:'None',              description:'No nerve pain/numbness traveling down the leg (radiculopathy) or nerve involvement.'},
          {value:10, label:'Mild',              description:'Mild incomplete paralysis — intermittent numbness or tingling in the leg/foot.'},
          {value:20, label:'Moderate',          description:'Moderate incomplete paralysis — frequent numbness, pain radiating below the knee, mild foot weakness.'},
          {value:40, label:'Moderately Severe', description:'Moderately severe incomplete paralysis — significant pain, noticeable muscle weakness, difficulty with toe/heel walking.'},
          {value:60, label:'Severe',            description:'Severe incomplete paralysis — marked muscle shrinkage/wasting (atrophy), foot drop, or significant loss of function.'},
          {value:80, label:'Complete',          description:'Complete paralysis — foot dangles and drops, no active movement possible below the knee, ability to bend (flex) the knee weakened or lost.'},
        ]
      }
    ]
  },
  cervical: {
    label: 'Cervical Spine Range of Motion (General Rating Formula)',
    domains: [
      { id: 'forward_flexion', label: 'Forward Bending (Flexion)',
        description: 'How far can you bend your neck forward? Normal is 45 degrees.',
        levels: [
          {value:0,  label:'Normal (45°)',             description:'Full cervical forward bending (flexion), no limitation.'},
          {value:10, label:'Greater than 30° but ≤40°', description:'Forward bending (flexion) greater than 30° but not greater than 40°; or combined range of motion >170° but ≤335°.'},
          {value:20, label:'Greater than 15° but ≤30°', description:'Forward bending (flexion) greater than 15° but not greater than 30°; or combined range of motion ≤170°; or muscle spasm/guarding causing abnormal gait.'},
          {value:30, label:'15° or less',              description:'Forward bending (flexion) of the cervical spine 15° or less; or the entire cervical spine is frozen/locked in a favorable position (favorable ankylosis).'},
          {value:40, label:'Neck frozen in unfavorable position',    description:'The entire cervical spine is frozen/locked in an unfavorable position (unfavorable ankylosis).'},
          {value:100,label:'Entire spine frozen',   description:'The entire spine is frozen/locked in an unfavorable position (unfavorable ankylosis of the entire spine).'},
        ]
      },
      { id: 'pain', label: 'Painful Motion / Spasm',
        description: 'Presence of painful motion, muscle spasm, or guarding.',
        levels: [
          {value:0,  label:'None',                  description:'No painful motion, spasm, or guarding.'},
          {value:10, label:'Painful motion / tenderness', description:'Painful motion; or muscle spasm, guarding, or localized tenderness.'},
          {value:20, label:'Spasm causing abnormal gait', description:'Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour.'},
        ]
      }
    ]
  },
  ivds: {
    label: 'Intervertebral Disc Syndrome (DC 5243)',
    note: 'Rate based on flare-ups bad enough to keep you in bed, as prescribed by a physician.',
    domains: [
      { id: 'episodes', label: 'Flare-Ups Bad Enough to Keep You in Bed (past 12 months)',
        description: 'Total duration of flare-ups bad enough to keep you in bed (incapacitating episodes) requiring bed rest prescribed by a physician during past 12 months.',
        levels: [
          {value:0,  label:'None',              description:'No flare-ups requiring bed rest in past 12 months.'},
          {value:10, label:'1-2 weeks total',   description:'At least 1 week but less than 2 weeks total duration.'},
          {value:20, label:'2-4 weeks total',   description:'At least 2 weeks but less than 4 weeks total duration.'},
          {value:40, label:'4-6 weeks total',   description:'At least 4 weeks but less than 6 weeks total duration.'},
          {value:60, label:'6+ weeks total',    description:'At least 6 weeks total duration. Highest schedular evaluation for IVDS.'},
        ]
      }
    ]
  },
  generic: {
    label: 'General Spine Assessment',
    domains: [
      { id: 'severity', label: 'Overall Spine Condition Severity',
        description: 'General functional impact of this spine/back condition.',
        levels: [
          {value:0,  label:'Asymptomatic',       description:'Condition present but no functional limitation.'},
          {value:10, label:'Mild',                description:'Mild symptoms with slight functional limitation.'},
          {value:20, label:'Moderate',            description:'Moderate symptoms with noticeable limitation.'},
          {value:30, label:'Moderately severe',   description:'Significant symptoms affecting daily activities.'},
          {value:50, label:'Severe',              description:'Severe symptoms substantially limiting function.'},
        ]
      }
    ]
  }
};

const SPINE_CONDITION_PROFILE = {
  'Lumbar strain / sprain': 'thoracolumbar',
  'Lumbar disc herniation': 'thoracolumbar',
  'Lumbar radiculopathy / sciatica': 'thoracolumbar',
  'Degenerative disc disease (lumbar)': 'thoracolumbar',
  'Spinal stenosis (lumbar)': 'thoracolumbar',
  'Thoracic strain': 'thoracolumbar',
  'Compression fracture': 'thoracolumbar',
  'Sacroiliac joint dysfunction': 'thoracolumbar',
  'Ankylosing spondylitis': 'thoracolumbar',
  'Intervertebral disc syndrome (IVDS)': 'ivds',
  'Scoliosis': 'thoracolumbar',
};

function getSpineProfile(conditionName){ return SPINE_PROFILES[SPINE_CONDITION_PROFILE[conditionName] || 'generic']; }
function getSpineProfileKey(conditionName){ return SPINE_CONDITION_PROFILE[conditionName] || 'generic'; }
function calculateSpineRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}

// ── SHOULDER EVALUATION PROFILES (VA 8787) ──────────────────────────────────
const SHOULDER_PROFILES = {
  rom: {
    label: 'Limitation of Motion (DC 5201)',
    domains: [
      { id: 'motion', label: 'Arm Motion at Shoulder',
        description: 'How far can you raise your arm? Rated by limitation of motion.',
        levels: [
          {value:0,  label:'Normal (full overhead)',  description:'Full range of motion, no limitation.'},
          {value:20, label:'At shoulder level',        description:'Motion limited to shoulder level (90°).'},
          {value:30, label:'Midway (side to shoulder)', description:'Motion limited to midway between side and shoulder level (~45°).'},
          {value:40, label:'To 25° from side',         description:'Motion limited to 25° from side. Significant functional loss.'},
        ]
      }
    ]
  },
  instability: {
    label: 'Instability / Dislocation (DC 5202)',
    domains: [
      { id: 'instability', label: 'Recurrent Dislocation or Impairment',
        description: 'Humerus impairment: recurrent dislocation, malunion, or nonunion.',
        levels: [
          {value:0,  label:'None',                  description:'No instability, dislocation, or impairment.'},
          {value:20, label:'Infrequent dislocation', description:'Recurrent dislocation with infrequent episodes; guarding only at shoulder level.'},
          {value:20, label:'Malunion (moderate)',     description:'Malunion of humerus with moderate deformity.'},
          {value:30, label:'Frequent dislocation',    description:'Recurrent dislocation with frequent episodes and guarding of all arm movements.'},
          {value:30, label:'Malunion (marked)',        description:'Malunion of humerus with marked deformity.'},
          {value:50, label:'Fibrous union',           description:'Fibrous union of the humerus.'},
          {value:60, label:'Nonunion (false flail)',   description:'Nonunion of the humerus (false flail joint).'},
          {value:80, label:'Loss of head (flail)',     description:'Loss of head of the humerus (flail shoulder).'},
        ]
      }
    ]
  },
  clavicle: {
    label: 'Clavicle / Scapula (DC 5203)',
    domains: [
      { id: 'clavicle', label: 'Clavicle or Scapula Impairment',
        description: 'Impairment of the clavicle or scapula.',
        levels: [
          {value:0,  label:'None / Malunion only',   description:'No impairment or malunion of clavicle/scapula.'},
          {value:10, label:'Nonunion without loose movement', description:'Nonunion of clavicle or scapula without loose movement.'},
          {value:20, label:'Nonunion with loose movement / Dislocation', description:'Nonunion with loose movement; or dislocation of clavicle or scapula.'},
        ]
      }
    ]
  },
  generic: {
    label: 'General Shoulder Assessment',
    domains: [
      { id: 'severity', label: 'Overall Shoulder Condition Severity',
        description: 'General functional impact of this shoulder condition.',
        levels: [
          {value:0,  label:'Asymptomatic',       description:'No functional limitation.'},
          {value:10, label:'Mild',                description:'Mild symptoms with slight limitation.'},
          {value:20, label:'Moderate',            description:'Moderate symptoms with noticeable limitation.'},
          {value:30, label:'Moderately severe',   description:'Significant symptoms affecting daily activities.'},
          {value:50, label:'Severe',              description:'Severe symptoms substantially limiting function.'},
        ]
      }
    ]
  }
};

const SHOULDER_CONDITION_PROFILE = {
  'Rotator cuff tear / tendinopathy': 'rom',
  'Shoulder impingement': 'rom',
  'Shoulder instability / dislocation': 'instability',
  'Labral tear (SLAP)': 'rom',
  'Frozen shoulder (adhesive capsulitis)': 'rom',
  'AC joint separation': 'clavicle',
  'Shoulder arthritis': 'rom',
  'Shoulder bursitis': 'generic',
  'Shoulder fracture': 'instability',
};

function getShoulderProfile(conditionName){ return SHOULDER_PROFILES[SHOULDER_CONDITION_PROFILE[conditionName] || 'generic']; }
function getShoulderProfileKey(conditionName){ return SHOULDER_CONDITION_PROFILE[conditionName] || 'generic'; }
function calculateShoulderRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}

// ── NECK PROFILES (DC 5237 / General Rating Formula for Cervical Spine) ──────

const NECK_PROFILES = {
  cervical: {
    key: 'cervical', label: 'Cervical Spine (DC 5237-5243)',
    note: 'Rated using the General Rating Formula for Diseases and Injuries of the Spine — cervical segment.',
    domains: [
      { id:'rom', label:'Range of Motion (How Far It Moves)', description:'Forward bending and combined range of motion of the cervical spine',
        levels:[
          {value:0, label:'Normal', description:'Forward bending (flexion) greater than 40°, combined range of motion greater than 335°.'},
          {value:10, label:'Mild', description:'Forward bending (flexion) greater than 30° but not greater than 40°, or combined range of motion greater than 170° but not greater than 335°.'},
          {value:20, label:'Moderate', description:'Forward bending (flexion) greater than 15° but not greater than 30°, or combined range of motion not greater than 170°.'},
          {value:30, label:'Severe', description:'Forward bending (flexion) 15° or less, or the entire cervical spine is frozen/locked in a favorable position (favorable ankylosis).'},
          {value:40, label:'Very Severe', description:'The entire cervical spine is frozen/locked in an unfavorable position (unfavorable ankylosis).'},
          {value:100, label:'Total', description:'The entire spine is frozen/locked in an unfavorable position (unfavorable ankylosis of the entire spine).'},
        ]},
      { id:'pain', label:'Pain / Functional Loss', description:'Pain on movement, guarding, muscle spasm, abnormal gait',
        levels:[
          {value:0, label:'None', description:'No additional functional loss due to pain.'},
          {value:10, label:'Mild', description:'Painful motion without significant functional loss.'},
          {value:20, label:'Moderate', description:'Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour.'},
        ]},
      { id:'radiculopathy', label:'Nerve Pain / Numbness Traveling Down the Arm (Radiculopathy)', description:'Nerve root involvement — numbness, tingling, weakness in arms',
        levels:[
          {value:0, label:'None', description:'No nerve pain/numbness traveling down the arm (radiculopathy).'},
          {value:20, label:'Mild', description:'Mild incomplete paralysis of affected nerve group.'},
          {value:30, label:'Moderate', description:'Moderate incomplete paralysis.'},
          {value:40, label:'Moderately Severe', description:'Moderately severe incomplete paralysis.'},
          {value:50, label:'Severe', description:'Severe incomplete paralysis with marked muscle shrinkage/wasting (atrophy).'},
          {value:70, label:'Complete', description:'Complete paralysis of affected nerve group.'},
        ]},
    ],
  },
  generic: {
    key: 'generic', label: 'Neck — General',
    note: 'General neck condition evaluation.',
    domains: [
      { id:'severity', label:'Overall Severity', description:'General severity of the neck condition',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Mild', description:'Mild impairment with occasional symptoms.'},
          {value:20, label:'Moderate', description:'Moderate impairment affecting daily activities.'},
          {value:30, label:'Severe', description:'Severe impairment with significant limitation.'},
          {value:50, label:'Very Severe', description:'Very severe impairment, near-constant symptoms.'},
        ]},
    ],
  },
};

const NECK_CONDITION_PROFILE = {
  'cervical strain':'cervical','cervical sprain':'cervical','cervical degenerative disc disease':'cervical',
  'cervical radiculopathy':'cervical','cervical stenosis':'cervical','herniated disc (cervical)':'cervical',
  'cervical spondylosis':'cervical','neck pain (cervicalgia)':'cervical','whiplash injury':'cervical',
};

function getNeckProfile(name){ return NECK_PROFILES[getNeckProfileKey(name)]; }
function getNeckProfileKey(name){ return NECK_CONDITION_PROFILE[name.toLowerCase()] || 'cervical'; }
function calculateNeckRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}

// ── HIP PROFILES (DC 5250-5255) ──────────────────────────────────────────────

const HIP_PROFILES = {
  rom: {
    key: 'rom', label: 'Hip Range of Motion (DC 5252/5253)',
    note: 'Rated based on limitation of flexion and extension of the thigh.',
    domains: [
      { id:'flexion', label:'Limitation of Bending (Flexion)', description:'Limitation of bending (flexion) of the thigh (DC 5252)',
        levels:[
          {value:0, label:'Normal', description:'Bending (flexion) greater than 45°.'},
          {value:10, label:'Mild', description:'Bending (flexion) limited to 45°.'},
          {value:20, label:'Moderate', description:'Bending (flexion) limited to 30°.'},
          {value:30, label:'Severe', description:'Bending (flexion) limited to 20°.'},
          {value:40, label:'Very Severe', description:'Bending (flexion) limited to 10°.'},
        ]},
      { id:'extension', label:'Limitation of Straightening (Extension)', description:'Limitation of straightening (extension) of the thigh (DC 5251)',
        levels:[
          {value:0, label:'Normal', description:'Straightening (extension) not limited to 5°.'},
          {value:10, label:'Mild', description:'Straightening (extension) limited to 5°.'},
        ]},
      { id:'abduction', label:'Limitation of Spreading/Moving Outward (Abduction)', description:'Limitation of spreading/moving outward (abduction), moving inward (adduction), or rotation (DC 5253)',
        levels:[
          {value:0, label:'Normal', description:'Can cross legs, no motion lost beyond 10°.'},
          {value:10, label:'Mild', description:'Cannot cross legs or cannot toe-out more than 15°.'},
          {value:20, label:'Moderate', description:'Motion lost beyond 10°.'},
        ]},
    ],
  },
  replacement: {
    key: 'replacement', label: 'Hip Replacement (DC 5054)',
    note: 'Following prosthetic replacement. Minimum 30% rating following implantation. 100% for 1 year following.',
    domains: [
      { id:'status', label:'Replacement Status', description:'Current functional status after hip replacement',
        levels:[
          {value:30, label:'Minimum', description:'Prosthetic replacement with no significant residuals.'},
          {value:50, label:'Moderate', description:'Moderately severe residuals of weakness, pain, or limitation of motion.'},
          {value:70, label:'Severe', description:'Markedly severe residual weakness, pain, or limitation of motion.'},
          {value:90, label:'Very Severe', description:'Painful motion or weakness requiring assistive devices.'},
          {value:100, label:'1-Year Post-Op', description:'For 1 year following implantation of prosthesis.'},
        ]},
    ],
  },
  generic: {
    key: 'generic', label: 'Hip — General',
    note: 'General hip condition evaluation.',
    domains: [
      { id:'severity', label:'Overall Severity', description:'General severity of the hip condition',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Mild', description:'Mild impairment with occasional symptoms.'},
          {value:20, label:'Moderate', description:'Moderate impairment affecting daily activities.'},
          {value:30, label:'Severe', description:'Severe impairment with significant limitation.'},
          {value:50, label:'Very Severe', description:'Very severe impairment.'},
        ]},
    ],
  },
};

const HIP_CONDITION_PROFILE = {
  'hip osteoarthritis':'rom','degenerative joint disease - hip':'rom','hip labral tear':'rom',
  'hip bursitis (trochanteric)':'rom','hip impingement (femoroacetabular)':'rom',
  'avascular necrosis (hip)':'rom','hip fracture residuals':'rom',
  'total hip replacement':'replacement','hip replacement':'replacement',
};

function getHipProfile(name){ return HIP_PROFILES[getHipProfileKey(name)]; }
function getHipProfileKey(name){ return HIP_CONDITION_PROFILE[name.toLowerCase()] || 'rom'; }
function calculateHipRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}

// ── ELBOW PROFILES (DC 5205-5213) ────────────────────────────────────────────

const ELBOW_PROFILES = {
  rom: {
    key: 'rom', label: 'Elbow Range of Motion (DC 5206/5207)',
    note: 'Rated based on limitation of flexion and extension of the forearm.',
    domains: [
      { id:'flexion', label:'Limitation of Bending (Flexion)', description:'Limitation of bending (flexion) of the forearm (DC 5206)',
        levels:[
          {value:0, label:'Normal', description:'Bending (flexion) greater than 100°.'},
          {value:10, label:'Mild', description:'Bending (flexion) limited to 100°.'},
          {value:20, label:'Moderate', description:'Bending (flexion) limited to 90°.'},
          {value:30, label:'Severe', description:'Bending (flexion) limited to 70°.'},
          {value:40, label:'Very Severe', description:'Bending (flexion) limited to 55°.'},
          {value:50, label:'Extreme', description:'Bending (flexion) limited to 45°.'},
        ]},
      { id:'extension', label:'Limitation of Straightening (Extension)', description:'Limitation of straightening (extension) of the forearm (DC 5207)',
        levels:[
          {value:0, label:'Normal', description:'Straightening (extension) not limited.'},
          {value:10, label:'Mild', description:'Straightening (extension) limited to 45° or 60°.'},
          {value:20, label:'Moderate', description:'Straightening (extension) limited to 75°.'},
          {value:30, label:'Severe', description:'Straightening (extension) limited to 90°.'},
          {value:40, label:'Very Severe', description:'Straightening (extension) limited to 100°.'},
          {value:50, label:'Extreme', description:'Straightening (extension) limited to 110°.'},
        ]},
      { id:'pronation', label:'Rotating Palm Down/Up (Pronation/Supination)', description:'Limitation of rotating palm down (pronation) or rotating palm up (supination) (DC 5213)',
        levels:[
          {value:0, label:'Normal', description:'No limitation.'},
          {value:10, label:'Mild', description:'Rotating palm up (supination) limited to 30° or less.'},
          {value:20, label:'Moderate', description:'Rotating palm down (pronation) limited beyond last quarter of arc; hand does not approach full rotation.'},
          {value:30, label:'Severe', description:'Rotating palm down (pronation) lost beyond middle of arc.'},
        ]},
    ],
  },
  generic: {
    key: 'generic', label: 'Elbow — General',
    note: 'General elbow/forearm condition evaluation.',
    domains: [
      { id:'severity', label:'Overall Severity', description:'General severity of the elbow condition',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Mild', description:'Mild impairment.'},
          {value:20, label:'Moderate', description:'Moderate impairment.'},
          {value:30, label:'Severe', description:'Severe impairment.'},
          {value:50, label:'Very Severe', description:'Very severe impairment.'},
        ]},
    ],
  },
};

const ELBOW_CONDITION_PROFILE = {
  'tennis elbow (lateral epicondylitis)':'rom','golfer\'s elbow (medial epicondylitis)':'rom',
  'cubital tunnel syndrome':'rom','elbow bursitis (olecranon)':'rom',
  'limited rom - elbow':'rom','elbow instability':'rom','elbow fracture residuals':'rom',
  'elbow arthritis':'rom','radial head fracture':'rom',
};

function getElbowProfile(name){ return ELBOW_PROFILES[getElbowProfileKey(name)]; }
function getElbowProfileKey(name){ return ELBOW_CONDITION_PROFILE[name.toLowerCase()] || 'rom'; }
function calculateElbowRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}

// ── WRIST/HAND PROFILES (DC 5214/5215/5220-5230) ────────────────────────────

const WRIST_PROFILES = {
  rom: {
    key: 'rom', label: 'Wrist Range of Motion (DC 5215)',
    note: 'Rated based on limitation of motion of the wrist.',
    domains: [
      { id:'dorsiflexion', label:'Bending Wrist Back (Dorsiflexion)', description:'Limitation of bending the wrist back (dorsiflexion/extension) of the wrist (DC 5215)',
        levels:[
          {value:0, label:'Normal', description:'Wrist bends back (dorsiflexion) greater than 15°.'},
          {value:10, label:'Mild', description:'Wrist bends back (dorsiflexion) less than 15°.'},
        ]},
      { id:'palmarflexion', label:'Bending Wrist Forward (Palmar Flexion)', description:'Limitation of bending the wrist forward (palmar flexion)',
        levels:[
          {value:0, label:'Normal', description:'Bending wrist forward (palmar flexion) not limited in line with forearm.'},
          {value:10, label:'Mild', description:'Bending wrist forward (palmar flexion) limited in line with forearm.'},
        ]},
      { id:'ankylosis', label:'Wrist Frozen/Locked (Ankylosis)', description:'Wrist joint is frozen/locked and cannot move (ankylosis of the wrist, DC 5214)',
        levels:[
          {value:0, label:'None', description:'Wrist is not frozen/locked (no ankylosis).'},
          {value:20, label:'Favorable', description:'Wrist frozen/locked (ankylosis) in 20° to 30° bent-back position (minor).'},
          {value:30, label:'Any Other', description:'Wrist frozen/locked (ankylosis) in any other position except favorable (minor).'},
          {value:40, label:'Unfavorable', description:'Wrist frozen/locked in an unfavorable position (ankylosis) in any degree of forward bend, or with side-to-side deviation (minor).'},
        ]},
    ],
  },
  carpal: {
    key: 'carpal', label: 'Carpal Tunnel (DC 8515)',
    note: 'Median nerve impairment rated under DC 8515.',
    domains: [
      { id:'nerve', label:'Median Nerve Impairment', description:'Severity of median nerve (carpal tunnel) paralysis',
        levels:[
          {value:0, label:'Normal', description:'No impairment.'},
          {value:10, label:'Mild', description:'Mild incomplete paralysis (minor hand).'},
          {value:20, label:'Moderate', description:'Moderate incomplete paralysis.'},
          {value:40, label:'Severe', description:'Severe incomplete paralysis.'},
          {value:60, label:'Complete', description:'Complete paralysis — hand inclined to ulnar side, can\'t make a fist.'},
        ]},
    ],
  },
  finger: {
    key: 'finger', label: 'Finger/Hand (DC 5216-5230)',
    note: 'Individual finger frozen/locked joint (ankylosis) or limitation.',
    domains: [
      { id:'severity', label:'Finger/Hand Severity', description:'Overall severity of finger or hand impairment',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Mild', description:'Mild limitation of one or more fingers.'},
          {value:20, label:'Moderate', description:'Moderate limitation, one finger frozen/locked (ankylosis).'},
          {value:30, label:'Severe', description:'Multiple fingers frozen/locked (ankylosis) or significant grip loss.'},
          {value:40, label:'Very Severe', description:'Loss of use of hand or multiple finger amputations.'},
        ]},
    ],
  },
  generic: {
    key: 'generic', label: 'Wrist/Hand — General',
    note: 'General wrist/hand condition evaluation.',
    domains: [
      { id:'severity', label:'Overall Severity', description:'General severity of the wrist/hand condition',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Mild', description:'Mild impairment.'},
          {value:20, label:'Moderate', description:'Moderate impairment.'},
          {value:30, label:'Severe', description:'Severe impairment.'},
          {value:50, label:'Very Severe', description:'Very severe impairment.'},
        ]},
    ],
  },
};

const WRIST_CONDITION_PROFILE = {
  'carpal tunnel syndrome':'carpal','limited rom - wrist':'rom',
  'de quervain\'s tenosynovitis':'rom','trigger finger':'finger',
  'wrist fracture residuals':'rom','wrist tendinitis':'rom','ganglion cyst':'generic',
  'grip strength loss':'finger','wrist instability':'rom','wrist arthritis':'rom',
};

function getWristProfile(name){ return WRIST_PROFILES[getWristProfileKey(name)]; }
function getWristProfileKey(name){ return WRIST_CONDITION_PROFILE[name.toLowerCase()] || 'rom'; }
function calculateWristRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}

// ── ANKLE/FOOT PROFILES (DC 5270-5284) ───────────────────────────────────────

const ANKLE_PROFILES = {
  rom: {
    key: 'rom', label: 'Ankle Range of Motion (DC 5271)',
    note: 'Rated based on limitation of motion of the ankle.',
    domains: [
      { id:'motion', label:'Limitation of Motion', description:'Limited motion of the ankle (DC 5271)',
        levels:[
          {value:0, label:'Normal', description:'No significant limitation.'},
          {value:10, label:'Moderate', description:'Moderate limitation of motion.'},
          {value:20, label:'Marked', description:'Marked limitation of motion.'},
        ]},
      { id:'ankylosis', label:'Joint Frozen/Locked (Ankylosis)', description:'Ankle joint is frozen/locked and cannot move (ankylosis of the ankle, DC 5270)',
        levels:[
          {value:0, label:'None', description:'Ankle is not frozen/locked (no ankylosis).'},
          {value:20, label:'Foot pointed down (plantar flexion) <30°', description:'Ankle frozen/locked (ankylosis) with foot pointing down (plantar flexion) less than 30°.'},
          {value:30, label:'Foot pointed down 30-40°', description:'Ankle frozen/locked (ankylosis) with foot pointing down (plantar flexion) between 30° and 40°, or with foot pulled up (dorsiflexion) between 0° and 10°.'},
          {value:40, label:'Unfavorable', description:'Ankle frozen/locked (ankylosis) with foot pointing down (plantar flexion) at more than 40°, or foot pulled up (dorsiflexion) at more than 10°, or with outward/inward deformity.'},
        ]},
    ],
  },
  instability: {
    key: 'instability', label: 'Ankle Instability (DC 5271)',
    note: 'Chronic ankle instability or recurrent partial dislocation (subluxation).',
    domains: [
      { id:'severity', label:'Instability Severity', description:'Severity of ankle instability',
        levels:[
          {value:0, label:'None', description:'No instability.'},
          {value:10, label:'Moderate', description:'Moderate instability with occasional giving way.'},
          {value:20, label:'Marked', description:'Marked instability, frequent giving way.'},
        ]},
    ],
  },
  flatfoot: {
    key: 'flatfoot', label: 'Flatfoot (DC 5276)',
    note: 'Acquired flatfoot (pes planus).',
    domains: [
      { id:'severity', label:'Flatfoot Severity', description:'Severity of acquired flatfoot',
        levels:[
          {value:0, label:'Mild', description:'Symptoms relieved by built-up shoe or arch support.'},
          {value:10, label:'Moderate', description:'Weight-bearing line over or toward the big toe, inward bowing of the Achilles tendon. One or both feet.'},
          {value:20, label:'Severe (Unilateral)', description:'Clear evidence of marked deformity, pain when the foot is moved or used, swelling, thick calluses. One foot.'},
          {value:30, label:'Severe (Bilateral)', description:'Severe flatfoot in both feet — marked deformity, pain when the foot is moved or used, swelling, thick calluses.'},
          {value:50, label:'Pronounced', description:'Pronounced; marked inward rolling of the foot (pronation), extreme tenderness of the bottom of the foot, not improved by orthopedic shoes/appliances.'},
        ]},
    ],
  },
  plantar: {
    key: 'plantar', label: 'Plantar Fasciitis',
    note: 'Rated by analogy, commonly under DC 5276 or 5284.',
    domains: [
      { id:'severity', label:'Plantar Fasciitis Severity', description:'Overall severity of plantar fasciitis',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Moderate', description:'Pain with prolonged standing/walking, relieved with rest.'},
          {value:20, label:'Moderately Severe', description:'Pain with most weight-bearing, some activity limitation.'},
          {value:30, label:'Severe', description:'Severe pain limiting most activities.'},
        ]},
    ],
  },
  generic: {
    key: 'generic', label: 'Ankle/Foot — General',
    note: 'General ankle/foot condition evaluation.',
    domains: [
      { id:'severity', label:'Overall Severity', description:'General severity of the ankle/foot condition',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Mild', description:'Mild impairment.'},
          {value:20, label:'Moderate', description:'Moderate impairment.'},
          {value:30, label:'Severe', description:'Severe impairment.'},
          {value:50, label:'Very Severe', description:'Very severe impairment.'},
        ]},
    ],
  },
};

const ANKLE_CONDITION_PROFILE = {
  'limited rom - ankle':'rom','ankle instability':'instability','ankle sprain (chronic)':'instability',
  'flatfoot (pes planus)':'flatfoot','plantar fasciitis':'plantar','achilles tendinitis':'rom',
  'heel spurs':'plantar','ankle fracture residuals':'rom','ankle arthritis':'rom',
  'morton\'s neuroma':'generic','bunion (hallux valgus)':'generic','hammer toe':'generic',
};

function getAnkleProfile(name){ return ANKLE_PROFILES[getAnkleProfileKey(name)]; }
function getAnkleProfileKey(name){ return ANKLE_CONDITION_PROFILE[name.toLowerCase()] || 'rom'; }
function calculateAnkleRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}

// ── CHEST/LUNG PROFILES (DC 6600-6847) ───────────────────────────────────────

const CHEST_PROFILES = {
  respiratory: {
    key: 'respiratory', label: 'Respiratory (DC 6600-6604)',
    note: 'Rated based on lung/breathing capacity tests (pulmonary function tests, PFT) and clinical findings.',
    domains: [
      { id:'pft', label:'Lung/Breathing Capacity', description:'Breathing test score (FEV-1)/FVC ratio or breathing test score (FEV-1) percent predicted',
        levels:[
          {value:0, label:'Normal', description:'Breathing test score (FEV-1) greater than 80% predicted; FEV-1/FVC greater than 80%.'},
          {value:10, label:'Mild', description:'Breathing test score (FEV-1) of 71-80% predicted, or FEV-1/FVC of 71-80%.'},
          {value:30, label:'Moderate', description:'Breathing test score (FEV-1) of 56-70% predicted, or FEV-1/FVC of 56-70%.'},
          {value:60, label:'Severe', description:'Breathing test score (FEV-1) of 40-55% predicted, or FEV-1/FVC of 40-55%.'},
          {value:100, label:'Very Severe', description:'Breathing test score (FEV-1) less than 40% predicted, or FEV-1/FVC less than 40%.'},
        ]},
      { id:'oxygen', label:'Oxygen Dependence', description:'Requirement for outpatient oxygen therapy',
        levels:[
          {value:0, label:'None', description:'No supplemental oxygen needed.'},
          {value:60, label:'Intermittent', description:'Requires intermittent outpatient oxygen therapy.'},
          {value:100, label:'Continuous', description:'Requires continuous outpatient oxygen therapy.'},
        ]},
    ],
  },
  apnea: {
    key: 'apnea', label: 'Sleep Apnea (DC 6847)',
    note: 'Rated under DC 6847 for obstructive, central, or mixed sleep apnea.',
    domains: [
      { id:'severity', label:'Sleep Apnea Severity', description:'Severity of sleep apnea and treatment required',
        levels:[
          {value:0, label:'Asymptomatic', description:'Asymptomatic but with documented sleep disorder breathing.'},
          {value:30, label:'Mild', description:'Persistent excessive daytime sleepiness (hypersomnolence).'},
          {value:50, label:'Moderate', description:'Requires use of breathing assistance device such as CPAP.'},
          {value:100, label:'Severe', description:'Chronic respiratory failure with carbon dioxide retention or heart failure from lung disease (cor pulmonale), or requires a breathing tube (tracheostomy).'},
        ]},
    ],
  },
  asthma: {
    key: 'asthma', label: 'Bronchial Asthma (DC 6602)',
    note: 'Rated based on FEV-1 results, medication requirements, and frequency of exacerbations.',
    domains: [
      { id:'pft', label:'Lung/Breathing Capacity (FEV-1)', description:'Breathing test score (FEV-1) percent predicted from lung/breathing capacity testing',
        levels:[
          {value:0, label:'Normal (>80%)', description:'Breathing test score (FEV-1) greater than 80% predicted.'},
          {value:10, label:'71-80% predicted', description:'Breathing test score (FEV-1) of 71-80% predicted.'},
          {value:30, label:'56-70% predicted', description:'Breathing test score (FEV-1) of 56-70% predicted.'},
          {value:60, label:'40-55% predicted', description:'Breathing test score (FEV-1) of 40-55% predicted; or at least monthly visits to physician for exacerbations; or intermittent courses of systemic corticosteroids.'},
          {value:100, label:'<40% predicted', description:'Breathing test score (FEV-1) less than 40% predicted; or more than one attack per week with episodes of respiratory failure; or daily use of systemic high-dose corticosteroids or immuno-suppressive medications.'},
        ]},
      { id:'medication', label:'Medication Level', description:'Current asthma treatment tier',
        levels:[
          {value:0, label:'No daily medication', description:'Intermittent use of bronchodilator only.'},
          {value:10, label:'Daily inhaled bronchodilator', description:'Daily use of inhaled bronchodilator therapy.'},
          {value:30, label:'Daily inhaled corticosteroid', description:'Daily inhalational anti-inflammatory medication (inhaled corticosteroid like Flovent, QVAR, Pulmicort).'},
          {value:60, label:'High-dose inhaled + intermittent oral steroids', description:'High-dose inhaled corticosteroid plus intermittent systemic (oral) corticosteroid courses (prednisone bursts).'},
          {value:100, label:'Daily systemic corticosteroids or immuno-suppressive', description:'Requires daily use of systemic high-dose corticosteroids or immuno-suppressive medications.'},
        ]},
      { id:'attacks', label:'Exacerbation Frequency', description:'How often asthma attacks require medical intervention',
        levels:[
          {value:0, label:'Rare', description:'Attacks less than once per month; no ER visits.'},
          {value:10, label:'Monthly symptoms', description:'Symptoms requiring inhaler use several times per month.'},
          {value:30, label:'Monthly physician visits', description:'At least monthly visits to a physician for required care of exacerbations.'},
          {value:60, label:'Intermittent systemic steroids', description:'Requires intermittent courses of systemic corticosteroids (steroid bursts multiple times per year).'},
          {value:100, label:'Weekly attacks / respiratory failure', description:'More than one attack per week with episodes of respiratory failure; or requires immuno-suppressive therapy.'},
        ]},
    ],
  },
  generic: {
    key: 'generic', label: 'Chest/Lung — General',
    note: 'General chest/lung condition evaluation.',
    domains: [
      { id:'severity', label:'Overall Severity', description:'General severity of the chest/lung condition',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Mild', description:'Mild impairment.'},
          {value:30, label:'Moderate', description:'Moderate impairment.'},
          {value:60, label:'Severe', description:'Severe impairment.'},
          {value:100, label:'Total', description:'Total impairment.'},
        ]},
    ],
  },
};

const CHEST_CONDITION_PROFILE = {
  'asthma, bronchial':'asthma','chronic obstructive pulmonary disease':'respiratory',
  'bronchitis':'respiratory','restrictive lung disease':'respiratory',
  'sleep apnea syndromes (obstructive, central, mixed)':'apnea','costochondritis':'generic',
  'pulmonary embolism residuals':'respiratory',
};

function getChestProfile(name){ return CHEST_PROFILES[getChestProfileKey(name)]; }
function getChestProfileKey(name){ return CHEST_CONDITION_PROFILE[name.toLowerCase()] || 'generic'; }
function calculateChestRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}

// ── ABDOMEN/PELVIS PROFILES (DC 7200-7354) ───────────────────────────────────

const ABDOMEN_PROFILES = {
  digestive: {
    key: 'digestive', label: 'Digestive (DC 7301-7354)',
    note: 'Rated based on severity, frequency, and treatment response of digestive conditions.',
    domains: [
      { id:'severity', label:'Condition Severity', description:'Overall severity and impact on daily function',
        levels:[
          {value:0, label:'None', description:'No significant symptoms.'},
          {value:10, label:'Mild', description:'Mild symptoms manageable with diet or OTC medication.'},
          {value:30, label:'Moderate', description:'Moderate symptoms requiring prescription medication; some weight loss or nutritional deficiency.'},
          {value:60, label:'Severe', description:'Severe and frequent symptoms; material weight loss; requires continuous medication.'},
          {value:100, label:'Total', description:'Pronounced symptoms causing marked malnutrition and health impairment.'},
        ]},
      { id:'frequency', label:'Symptom Frequency', description:'How often symptoms occur',
        levels:[
          {value:0, label:'Rare', description:'Symptoms occur rarely, long periods of remission.'},
          {value:10, label:'Occasional', description:'Symptoms several times per month.'},
          {value:20, label:'Frequent', description:'Symptoms occur weekly or more.'},
          {value:30, label:'Near-Constant', description:'Nearly constant symptoms affecting most daily activities.'},
        ]},
    ],
  },
  genitourinary: {
    key: 'genitourinary', label: 'Genitourinary (DC 7500-7542)',
    note: 'Rated based on renal function, voiding dysfunction, or specific condition criteria.',
    domains: [
      { id:'voiding', label:'Voiding Dysfunction', description:'Frequency, urgency, or incontinence',
        levels:[
          {value:0, label:'Normal', description:'Normal voiding function.'},
          {value:10, label:'Mild', description:'Daytime voiding interval 1-2 hours, or awakening to void 2 times per night.'},
          {value:20, label:'Moderate', description:'Daytime voiding interval <1 hour, or awakening to void 3-4 times per night.'},
          {value:40, label:'Severe', description:'Requiring absorbent materials that must be changed 2-4 times per day.'},
          {value:60, label:'Very Severe', description:'Requiring absorbent materials changed more than 4 times per day, or use of appliance.'},
        ]},
    ],
  },
  generic: {
    key: 'generic', label: 'Abdomen — General',
    note: 'General abdominal/pelvic condition evaluation.',
    domains: [
      { id:'severity', label:'Overall Severity', description:'General severity of the condition',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Mild', description:'Mild impairment.'},
          {value:20, label:'Moderate', description:'Moderate impairment.'},
          {value:30, label:'Severe', description:'Severe impairment.'},
          {value:50, label:'Very Severe', description:'Very severe impairment.'},
        ]},
    ],
  },
};

const ABDOMEN_CONDITION_PROFILE = {
  'gerd':'digestive','gastroesophageal reflux disease':'digestive','ibs':'digestive',
  'irritable bowel syndrome':'digestive','hiatal hernia':'digestive',
  'crohn\'s disease':'digestive','ulcerative colitis':'digestive',
  'bladder dysfunction':'genitourinary','erectile dysfunction':'genitourinary',
  'kidney stones':'genitourinary',
};

function getAbdomenProfile(name){ return ABDOMEN_PROFILES[getAbdomenProfileKey(name)]; }
function getAbdomenProfileKey(name){ return ABDOMEN_CONDITION_PROFILE[name.toLowerCase()] || 'generic'; }
function calculateAbdomenRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}

// ── LEG (THIGH/SHIN/CALF) PROFILES (DC 5311-5315 — Muscle Groups) ───────────

const LEG_PROFILES = {
  muscle: {
    key: 'muscle', label: 'Muscle Injury (DC 5311-5315)',
    note: 'Rated based on muscle group injury severity — function of movement, strength, fatigue.',
    domains: [
      { id:'severity', label:'Muscle Injury Severity', description:'Key signs: loss of power, weakness, getting tired more easily, pain, difficulty with coordination, unsteady movement',
        levels:[
          {value:0, label:'Slight', description:'Simple wound, no surgical cleaning of the wound needed (debridement), no lasting impairment.'},
          {value:10, label:'Moderate', description:'Through-and-through or deep penetrating wound; hospitalized and treated; consistent complaints on exam.'},
          {value:20, label:'Moderately Severe', description:'Wound required surgical cleaning (debridement); prolonged infection or tissue breakdown; scarring between muscles; loss of deep tissue, muscle substance, or normal firm resistance.'},
          {value:30, label:'Severe', description:'Shattering bone fracture or bone broken into fragments (comminuted fracture); extensive surgical wound cleaning; prolonged infection; ragged, sunken, stuck-down scars; loss of deep tissue or muscle substance; soft, flabby muscles in wound area.'},
        ]},
    ],
  },
  neuropathy: {
    key: 'neuropathy', label: 'Peripheral Neuropathy (DC 8520/8521)',
    note: 'Sciatic or peroneal nerve involvement rated under DC 8520/8521.',
    domains: [
      { id:'nerve', label:'Nerve Impairment', description:'Severity of nerve damage (peripheral neuropathy) causing numbness, tingling, or weakness',
        levels:[
          {value:0, label:'Normal', description:'No nerve damage (neuropathy).'},
          {value:10, label:'Mild', description:'Mild incomplete paralysis.'},
          {value:20, label:'Moderate', description:'Moderate incomplete paralysis.'},
          {value:40, label:'Moderately Severe', description:'Moderately severe incomplete paralysis.'},
          {value:60, label:'Severe', description:'Severe incomplete paralysis with marked muscle shrinkage/wasting (atrophy).'},
          {value:80, label:'Complete', description:'Complete paralysis — foot dangles, no active movement possible.'},
        ]},
    ],
  },
  generic: {
    key: 'generic', label: 'Leg — General',
    note: 'General thigh/shin/calf condition evaluation.',
    domains: [
      { id:'severity', label:'Overall Severity', description:'General severity of the leg condition',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Mild', description:'Mild impairment.'},
          {value:20, label:'Moderate', description:'Moderate impairment.'},
          {value:30, label:'Severe', description:'Severe impairment.'},
          {value:50, label:'Very Severe', description:'Very severe impairment.'},
        ]},
    ],
  },
};

const LEG_CONDITION_PROFILE = {
  'shin splints (mtss)':'muscle','muscle strain (thigh)':'muscle','muscle strain (calf)':'muscle',
  'muscle atrophy':'muscle','peripheral neuropathy (lower)':'neuropathy',
  'sciatic nerve involvement':'neuropathy','lower extremity numbness / tingling':'neuropathy',
  'deep vein thrombosis':'generic','varicose veins':'generic',
  'compartment syndrome':'muscle',
};

function getLegProfile(name){ return LEG_PROFILES[getLegProfileKey(name)]; }
function getLegProfileKey(name){ return LEG_CONDITION_PROFILE[name.toLowerCase()] || 'generic'; }
function calculateLegRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}
// ── MAP, PINS, SIDEBAR, TABS ──

let injuries=[], pendingPin=null, curSide='front', curBody='male';


function buildSidebar(){
  const groups = curSide==='front' ? GROUPS_FRONT : GROUPS_BACK;
  let h='';
  groups.forEach(([g,keys])=>{
    h+=`<div class="sb-head">${g}</div>`;
    keys.forEach(k=>{
      const label = SIDEBAR_ITEMS[k] || k;
      h+=`<div class="sb-item" id="si-${k}" onclick="quickSelect('${k}')">
            <span class="sb-name">${label}</span>
            <span class="badge b0" id="bd-${k}">+</span>
          </div>`;
    });
  });
  document.getElementById('sb-list').innerHTML=h;
  updateBadges();
}

// ── VIEW CONTROLS ──────────────────────────────────────────────────────────
function updateView(){
  ['mf','mb','ff','fb'].forEach(id=>{
    const el=document.getElementById('view-'+id);
    el.classList.add('hidden');
    el.style.display='none';
  });
  const id=(curBody==='male'?'m':'f')+(curSide==='front'?'f':'b');
  const active=document.getElementById('view-'+id);
  active.classList.remove('hidden');
  active.style.display='';
}
function setSide(s){
  curSide=s;
  document.getElementById('btn-front').classList.toggle('active',s==='front');
  document.getElementById('btn-back').classList.toggle('active',s==='back');
  updateView(); buildSidebar();
}
function setBody(b){
  curBody=b;
  document.getElementById('btn-male').classList.toggle('active',b==='male');
  document.getElementById('btn-female').classList.toggle('active',b==='female');
  updateView();
}

// ── PIN PLACEMENT MODE ───────────────────────────────────────────────────
// When a quick-select item is chosen, user must click the body map to place the pin.
let _pinPlaceMode = null; // null = off, {key, label} = waiting for click

function enterPinPlaceMode(key, label, fromPanel){
  _pinPlaceMode = {key, label, fromPanel: !!fromPanel};
  // Add overlay + highlight
  document.body.classList.add('pin-placing');
  document.querySelectorAll('.body-wrap').forEach(el => el.classList.add('pin-place-mode'));
  // Show a fixed top banner
  let prompt = document.getElementById('pin-place-prompt');
  if(!prompt){
    prompt = document.createElement('div');
    prompt.id = 'pin-place-prompt';
    prompt.className = 'pin-place-prompt';
    document.body.appendChild(prompt);
  }
  prompt.innerHTML = '<span>Click the body map to place: <strong>' + label + '</strong></span>' +
    '<button onclick="cancelPinPlaceMode()">Cancel</button>';
  prompt.classList.remove('hidden');
}

function cancelPinPlaceMode(){
  _pinPlaceMode = null;
  document.body.classList.remove('pin-placing');
  document.querySelectorAll('.body-wrap').forEach(el => el.classList.remove('pin-place-mode'));
  const prompt = document.getElementById('pin-place-prompt');
  if(prompt) prompt.classList.add('hidden');
}

// ── CLICK ON BODY IMAGE ────────────────────────────────────────────────────
function bodyClicked(e,wrap){
  const r=wrap.getBoundingClientRect();
  const x=parseFloat(((e.clientX-r.left)/r.width*100).toFixed(1));
  const y=parseFloat(((e.clientY-r.top)/r.height*100).toFixed(1));

  if(_pinPlaceMode){
    // Placing a quick-select pin at the clicked location
    const {key, label, fromPanel} = _pinPlaceMode;
    cancelPinPlaceMode();
    pendingPin={x,y,side:curSide,body:curBody,key,label};

    if(fromPanel){
      // Coming from evaluation panel — info already entered, auto-create pin
      _autoCreatePinFromPanel(pendingPin);
      return;
    }
    dropPreviewPin(pendingPin);
    openForm(label, key);
    return;
  }

  // Free-click custom pin
  pendingPin={x,y,side:curSide,body:curBody,key:'custom',label:''};
  dropPreviewPin(pendingPin);
  openForm('Custom Pin','custom');
}

function quickSelect(key){
  // Mental health opens the dedicated evaluation panel
  if(key==='mental'){ openMentalHealthPanel(); return; }

  // Head & Face opens the head evaluation panel
  const HEAD_KEYS = ['headFace','head','leftEar','rightEar','leftEye','rightEye','nose','jaw'];
  if(HEAD_KEYS.includes(key)){ openHeadPanel(key); return; }

  // Direct region key (from simplified sidebar)
  if(typeof BP_REGISTRY !== 'undefined' && BP_REGISTRY[key]){
    openBPPanel(key); return;
  }

  // Pin key → find matching region (backward compat)
  if(typeof BP_REGISTRY !== 'undefined'){
    for(const [regionId, cfg] of Object.entries(BP_REGISTRY)){
      if(cfg.sideKeys[key]){ openBPPanel(regionId, key); return; }
    }
  }

  // All other body parts → enter pin placement mode
  const pins=curSide==='front'?FRONT_PINS:BACK_PINS;
  const allPins=Object.assign({},pins,MENTAL_PINS);
  let label='Other / Unlisted';
  if(key==='other'){ label='Other / Unlisted'; }
  else if(allPins[key]){ label=allPins[key].label; }
  enterPinPlaceMode(key, label);
}


// injuryNumber defined above

// cancelForm defined above with modal logic

// ── DROP PIN ON MAP ────────────────────────────────────────────────────────
function dropPreviewPin(pin){
  removePreviewPin(); // clear any existing preview
  const suffix=(pin.body==='male'?'m':'f')+(pin.side==='front'?'f':'b');
  const layer=document.getElementById('pins-'+suffix);
  if(!layer) return;
  const p=document.createElement('div');
  p.className='pin pin-preview'; p.id='pin-preview';
  p.style.left=pin.x+'%'; p.style.top=pin.y+'%';
  p.style.pointerEvents='none';
  p.style.opacity='0.6';
  p.innerHTML=`<div class="pin-head" style="background:#64748b;"><div class="dot"></div></div>
    <div class="pin-tip" style="opacity:1;background:#64748b;">${pin.label}</div>`;
  layer.appendChild(p);
  // Switch to correct view so user can see the preview pin
  setSide(pin.side); setBody(pin.body);
}
function removePreviewPin(){
  const el=document.getElementById('pin-preview');
  if(el) el.remove();
}
// Returns chronological index (1-based) for an injury
function injuryNumber(id){
  const sorted=[...injuries].sort((a,b)=>new Date(a.date)-new Date(b.date)||a.id-b.id);
  const idx=sorted.findIndex(i=>i.id===id);
  return idx>=0?idx+1:'?';
}

// Re-render all pin numbers after any add/delete (order may change)
function refreshPinNumbers(){
  injuries.forEach(inj=>{
    const el=document.getElementById('pin-'+inj.id);
    if(!el) return;
    const numEl=el.querySelector('.pin-num');
    if(numEl) numEl.textContent=injuryNumber(inj.id);
  });
}

function makeDraggable(el, inj){
  let dragging=false, didDrag=false, startX, startY, origLeft, origTop, wrap;

  // Prevent click from bubbling to body-wrap (which would trigger bodyClicked)
  el.addEventListener('click', e=>{ e.stopPropagation(); });

  el.addEventListener('mousedown', e=>{
    if(e.target.classList.contains('pin-del')) return;
    e.preventDefault(); e.stopPropagation();
    dragging=true; didDrag=false;
    wrap=el.closest('.body-wrap');
    const rect=wrap.getBoundingClientRect();
    startX=e.clientX; startY=e.clientY;
    origLeft=inj.pin.x; origTop=inj.pin.y;
    el.classList.add('dragging');
    document.body.style.userSelect='none';
  });

  document.addEventListener('mousemove', e=>{
    if(!dragging) return;
    const rect=wrap.getBoundingClientRect();
    const dx=(e.clientX-startX)/rect.width*100;
    const dy=(e.clientY-startY)/rect.height*100;
    if(Math.abs(dx)>1||Math.abs(dy)>1) didDrag=true;
    const newX=Math.max(0,Math.min(100,origLeft+dx));
    const newY=Math.max(0,Math.min(100,origTop+dy));
    el.style.left=newX+'%';
    el.style.top=newY+'%';
    inj.pin.x=parseFloat(newX.toFixed(1));
    inj.pin.y=parseFloat(newY.toFixed(1));
  });

  document.addEventListener('mouseup', e=>{
    if(!dragging) return;
    dragging=false;
    el.classList.remove('dragging');
    document.body.style.userSelect='';
    if(!didDrag) editInjury(inj.id);
  });

  // Touch support
  el.addEventListener('touchstart', e=>{
    if(e.target.classList.contains('pin-del')) return;
    e.preventDefault();
    const t=e.touches[0];
    dragging=true; didDrag=false;
    wrap=el.closest('.body-wrap');
    startX=t.clientX; startY=t.clientY;
    origLeft=inj.pin.x; origTop=inj.pin.y;
    el.classList.add('dragging');
  },{passive:false});

  document.addEventListener('touchmove', e=>{
    if(!dragging) return;
    e.preventDefault();
    const t=e.touches[0];
    const rect=wrap.getBoundingClientRect();
    const dx=(t.clientX-startX)/rect.width*100;
    const dy=(t.clientY-startY)/rect.height*100;
    if(Math.abs(dx)>1||Math.abs(dy)>1) didDrag=true;
    const newX=Math.max(0,Math.min(100,origLeft+dx));
    const newY=Math.max(0,Math.min(100,origTop+dy));
    el.style.left=newX+'%';
    el.style.top=newY+'%';
    inj.pin.x=parseFloat(newX.toFixed(1));
    inj.pin.y=parseFloat(newY.toFixed(1));
  },{passive:false});

  document.addEventListener('touchend', ()=>{
    if(!dragging) return;
    dragging=false;
    el.classList.remove('dragging');
    if(!didDrag) editInjury(inj.id);
  });
}

function dropPin(inj){
  const{x,y,side,body}=inj.pin;
  const suffix=(body==='male'?'m':'f')+(side==='front'?'f':'b');
  const layer=document.getElementById('pins-'+suffix);
  if(!layer) return;
  const num=injuryNumber(inj.id);
  const sev=inj.severity;
  const tip=(inj.label+(inj.event?' · '+inj.event:'')).slice(0,32);
  const p=document.createElement('div');
  p.className=`pin pin-${sev}`; p.id=`pin-${inj.id}`;
  p.style.left=x+'%'; p.style.top=y+'%';
  p.innerHTML=`<div class="pin-head"><span class="pin-num">${num}</span></div>
    <div class="pin-tip">#${num} · ${tip}</div>
    <button class="pin-del" onclick="deleteInjury(${inj.id},event)" title="Remove">×</button>`;
  layer.appendChild(p);
  makeDraggable(p, inj);
}

function removePin(id){const el=document.getElementById('pin-'+id);if(el)el.remove();}

// ── BADGES ────────────────────────────────────────────────────────────────
function updateBadges(){
  // Reset all badges
  document.querySelectorAll('.badge').forEach(b=>{
    if(b.id.startsWith('bd-')){b.className='badge b0';b.textContent='+';}
  });
  document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('has'));

  // Mental health (include MST mental health conditions in count)
  const mhConds = window._mentalHealthConditions||[];
  const _mstMHNames = new Set(['ptsd','major depressive disorder','generalized anxiety disorder','panic disorder','adjustment disorder','insomnia / sleep disturbance','substance use disorder','eating disorder','somatic symptom disorder','other condition related to mst']);
  const mstMHCount = (window._mstData && window._mstData.conditions) ? window._mstData.conditions.filter(c => _mstMHNames.has(c.name.toLowerCase())).length : 0;
  const mstMHMaxR = (window._mstData && window._mstData.conditions) ? Math.max(0, ...window._mstData.conditions.filter(c => _mstMHNames.has(c.name.toLowerCase())).map(c => c.rating||0)) : 0;
  const totalMH = mhConds.length + mstMHCount;
  if(totalMH > 0){
    const maxR = Math.max(...mhConds.map(c=>c.effectiveRating||0), mstMHMaxR);
    const sev = maxR>=70?'severe':maxR>=30?'moderate':maxR>0?'mild':'custom';
    const b=document.getElementById('bd-mental'), si=document.getElementById('si-mental');
    if(b){b.className='badge b-'+sev;b.textContent=totalMH;}
    if(si) si.classList.add('has');
  }

  // Head & Face
  const hdConds = window._headConditions||[];
  if(hdConds.length){
    const maxR = Math.max(...hdConds.map(c=>c.effectiveRating||0));
    const sev = maxR>=70?'severe':maxR>=30?'moderate':maxR>0?'mild':'custom';
    const b=document.getElementById('bd-headFace'), si=document.getElementById('si-headFace');
    if(b){b.className='badge b-'+sev;b.textContent=hdConds.length;}
    if(si) si.classList.add('has');
  }

  // BP regions
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.entries(BP_REGISTRY).forEach(([regionId, cfg]) => {
      const conds = window[cfg.stateKey]||[];
      if(!conds.length) return;
      const maxR = Math.max(...conds.map(c=>c.effectiveRating||0));
      const sev = maxR>=70?'severe':maxR>=30?'moderate':maxR>0?'mild':'custom';
      const b=document.getElementById('bd-'+regionId), si=document.getElementById('si-'+regionId);
      if(b){b.className='badge b-'+sev;b.textContent=conds.length;}
      if(si) si.classList.add('has');
    });
  }
}

function updateCount(){
  const physCount = injuries.filter(i=>i.date).length;
  const mhCount = (window._mentalHealthConditions||[]).filter(c=>c.date).length;
  const hdCount = (window._headConditions||[]).filter(c=>c.date).length;
  let bpCount = 0;
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      bpCount += (window[cfg.stateKey]||[]).filter(c=>c.date).length;
    });
  }
  const total = physCount + mhCount + hdCount + bpCount;
  document.getElementById('tl-tab').textContent=total?`Timeline (${total})`:'Timeline';
}

// ── TABS ──────────────────────────────────────────────────────────────────
function showTab(id,btn){
  // Close evaluation panels when switching tabs
  if(typeof _mhPanelOpen !== 'undefined' && _mhPanelOpen) closeMentalHealthPanel();
  if(typeof _headPanelOpen !== 'undefined' && _headPanelOpen) closeHeadPanel();
  if(typeof _bpPanelOpen !== 'undefined' && _bpPanelOpen) closeBPPanel(_bpPanelOpen);

  document.querySelectorAll('[id^="tab-"]').forEach(t=>t.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+id).classList.remove('hidden');
  if(btn) btn.classList.add('active');
  if(id==='timeline') renderTimeline();
  if(id==='secondary') renderSecondary();
  if(id==='rating') renderRating();
  if(id==='special') renderSpecial();
  if(id==='statement' && typeof renderStatement==='function') renderStatement();
  updateCount();
}

// Auto-create interactive pin from evaluation panel (data lives in panel state)
function _autoCreatePinFromPanel(pin){
  const stampPin = {x:pin.x, y:pin.y, side:pin.side, body:pin.body};

  // Stamp pin coords onto evaluation conditions
  if(pin.key === 'mental'){
    (window._mentalHealthConditions||[]).forEach(c => { c.pin = {...stampPin}; });
  } else if(pin.key === 'headFace' || pin.key === 'head'){
    (window._headConditions||[]).forEach(c => { c.pin = {...stampPin}; });
  } else if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      if(cfg.sideKeys[pin.key]){
        (window[cfg.stateKey]||[]).forEach(c => { c.pin = {...stampPin}; });
      }
    });
  }

  // Place fully interactive pin on the map (not in injuries array)
  const suffix = (pin.body==='male'?'m':'f') + (pin.side==='front'?'f':'b');
  const layer = document.getElementById('pins-' + suffix);
  if(layer){
    const pinId = 'pin-panel-' + pin.key;
    // Remove existing panel pin for this key (avoid duplicates)
    const existing = document.getElementById(pinId);
    if(existing) existing.remove();

    const p = document.createElement('div');
    p.className = 'pin pin-moderate';
    p.id = pinId;
    p.style.left = pin.x + '%';
    p.style.top = pin.y + '%';
    p.innerHTML = '<div class="pin-head"><span class="pin-num" style="font-size:7px;">&#9733;</span></div>' +
      '<div class="pin-tip">' + pin.label + '</div>' +
      '<button class="pin-del" onclick="_removePanelPin(\'' + pin.key + '\',event)" title="Remove">&times;</button>';
    layer.appendChild(p);
    _makePanelPinDraggable(p, pin.key, stampPin);
  }

  pendingPin = null;
  updateBadges(); updateCount(); renderTimeline();
}

// Make a panel-created pin draggable and clickable
function _makePanelPinDraggable(el, panelKey, pinData){
  let dragging=false, didDrag=false, startX, startY, origLeft, origTop, wrap;

  el.addEventListener('click', e=>{ e.stopPropagation(); });

  el.addEventListener('mousedown', e=>{
    if(e.target.classList.contains('pin-del')) return;
    e.preventDefault(); e.stopPropagation();
    dragging=true; didDrag=false;
    wrap=el.closest('.body-wrap');
    startX=e.clientX; startY=e.clientY;
    origLeft=pinData.x; origTop=pinData.y;
    el.classList.add('dragging');
    document.body.style.userSelect='none';
  });

  document.addEventListener('mousemove', e=>{
    if(!dragging) return;
    const rect=wrap.getBoundingClientRect();
    const dx=(e.clientX-startX)/rect.width*100;
    const dy=(e.clientY-startY)/rect.height*100;
    if(Math.abs(dx)>1||Math.abs(dy)>1) didDrag=true;
    const newX=Math.max(0,Math.min(100,origLeft+dx));
    const newY=Math.max(0,Math.min(100,origTop+dy));
    el.style.left=newX+'%';
    el.style.top=newY+'%';
    pinData.x=parseFloat(newX.toFixed(1));
    pinData.y=parseFloat(newY.toFixed(1));
  });

  document.addEventListener('mouseup', e=>{
    if(!dragging) return;
    dragging=false;
    el.classList.remove('dragging');
    document.body.style.userSelect='';
    _updatePanelConditionPins(panelKey, pinData);
    if(!didDrag) _openPanelForKey(panelKey);
  });

  // Touch support
  el.addEventListener('touchstart', e=>{
    if(e.target.classList.contains('pin-del')) return;
    e.preventDefault();
    const t=e.touches[0];
    dragging=true; didDrag=false;
    wrap=el.closest('.body-wrap');
    startX=t.clientX; startY=t.clientY;
    origLeft=pinData.x; origTop=pinData.y;
    el.classList.add('dragging');
  },{passive:false});

  document.addEventListener('touchmove', e=>{
    if(!dragging) return;
    e.preventDefault();
    const t=e.touches[0];
    const rect=wrap.getBoundingClientRect();
    const dx=(t.clientX-startX)/rect.width*100;
    const dy=(t.clientY-startY)/rect.height*100;
    if(Math.abs(dx)>1||Math.abs(dy)>1) didDrag=true;
    const newX=Math.max(0,Math.min(100,origLeft+dx));
    const newY=Math.max(0,Math.min(100,origTop+dy));
    el.style.left=newX+'%';
    el.style.top=newY+'%';
    pinData.x=parseFloat(newX.toFixed(1));
    pinData.y=parseFloat(newY.toFixed(1));
  },{passive:false});

  document.addEventListener('touchend', ()=>{
    if(!dragging) return;
    dragging=false;
    el.classList.remove('dragging');
    _updatePanelConditionPins(panelKey, pinData);
    if(!didDrag) _openPanelForKey(panelKey);
  });
}

// Update pin coordinates on all conditions associated with a panel key
function _updatePanelConditionPins(key, pinData){
  const stamp = {x:pinData.x, y:pinData.y, side:pinData.side, body:pinData.body};
  if(key === 'mental'){
    (window._mentalHealthConditions||[]).forEach(c => { c.pin = {...stamp}; });
  } else if(key === 'headFace' || key === 'head'){
    (window._headConditions||[]).forEach(c => { c.pin = {...stamp}; });
  } else if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      if(cfg.sideKeys[key] || cfg.id === key){
        (window[cfg.stateKey]||[]).forEach(c => { c.pin = {...stamp}; });
      }
    });
  }
}

// Open the relevant evaluation panel when a panel pin is clicked
function _openPanelForKey(key){
  if(key === 'mental') { openMentalHealthPanel(); return; }
  if(key === 'headFace' || key === 'head') { openHeadPanel(key); return; }
  if(typeof BP_REGISTRY !== 'undefined'){
    if(BP_REGISTRY[key]) { openBPPanel(key); return; }
    for(const [regionId, cfg] of Object.entries(BP_REGISTRY)){
      if(cfg.sideKeys[key]){ openBPPanel(regionId, key); return; }
    }
  }
}

// Remove a panel pin and clear pin data from associated conditions
function _removePanelPin(key, e){
  if(e){ e.stopPropagation(); e.preventDefault(); }
  const el = document.getElementById('pin-panel-' + key);
  if(el) el.remove();
  // Clear pin data from conditions
  if(key === 'mental'){
    (window._mentalHealthConditions||[]).forEach(c => { c.pin = null; });
  } else if(key === 'headFace' || key === 'head'){
    (window._headConditions||[]).forEach(c => { c.pin = null; });
  } else if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      if(cfg.sideKeys[key] || cfg.id === key){
        (window[cfg.stateKey]||[]).forEach(c => { c.pin = null; });
      }
    });
  }
  updateBadges(); updateCount();
}

function deleteInjury(id,e){
  if(e){e.stopPropagation();e.preventDefault();}
  const inj=injuries.find(i=>i.id===id);
  const name=inj?inj.label:'this injury';
  if(!confirm('Delete "'+name+'" and all its secondary conditions?')) return;
  injuries=injuries.filter(i=>i.id!==id);
  removePin(id); updateBadges(); updateCount(); renderTimeline(); refreshPinNumbers();
}

// ── FORM / MODAL LOGIC ──

let editingId = null; // null = new injury, number = editing existing
let _pendingImpacts = []; // temporary impacts while form is open

function openModal(){
  document.getElementById('form-modal').classList.remove('hidden');
  document.body.style.overflow='hidden';
}
function closeModal(){
  document.getElementById('form-modal').classList.add('hidden');
  document.body.style.overflow='';
}
function modalBgClick(e){
  if(e.target===document.getElementById('form-modal')) cancelForm();
}

function openForm(label, key){
  editingId = null;
  _pendingImpacts = [];
  const isCustom = key==='custom';
  document.getElementById('ftitle').textContent = isCustom ? 'Log Injury — Custom Pin' : `Log Injury — ${label}`;
  document.getElementById('fsub').textContent = isCustom ? 'Select an area and condition, then fill in the details.' : 'Complete the fields below.';

  // Area + condition selectors (shown for custom pins)
  document.getElementById('body-area-field').classList.toggle('hidden', !isCustom);
  document.getElementById('condition-field').classList.add('hidden');
  document.getElementById('custom-label-field').classList.add('hidden');
  document.getElementById('f-body-area').value='';
  document.getElementById('f-condition').innerHTML='<option value="">— Select condition —</option>';
  document.getElementById('f-condition-custom').classList.add('hidden');
  document.getElementById('f-condition-custom').value='';
  document.getElementById('f-custom-label').value='';

  ['f-date','f-loc','f-event','f-desc','f-wit','f-clinic'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('f-sev').value=key==='other'?'custom':'moderate';
  document.getElementById('f-med').value='';
  document.getElementById('cf').style.display='none';
  document.getElementById('f-still-seen').checked=false;
  document.getElementById('f-impact').value='';
  document.getElementById('f-impact-custom').value='';
  document.getElementById('save-btn').textContent='Save Injury';
  renderImpactChips();
  openModal();
}

// ── BODY AREA → CONDITION DROPDOWN ──

function onBodyAreaChange(area){
  const condField = document.getElementById('condition-field');
  const condSelect = document.getElementById('f-condition');
  const condCustom = document.getElementById('f-condition-custom');
  condCustom.classList.add('hidden');
  condCustom.value='';

  if(!area){
    condField.classList.add('hidden');
    document.getElementById('custom-label-field').classList.add('hidden');
    return;
  }

  // Mental Health & Head/Face → close form, open dedicated panel
  if(area === 'mental'){
    removePreviewPin(); pendingPin = null;
    closeModal();
    openMentalHealthPanel();
    return;
  }
  if(area === 'head'){
    removePreviewPin(); pendingPin = null;
    closeModal();
    openHeadPanel('headFace');
    return;
  }

  // Body part panels (knee, back, shoulder, etc.)
  if(typeof BP_REGISTRY !== 'undefined' && BP_REGISTRY[area]){
    removePreviewPin(); pendingPin = null;
    closeModal();
    openBPPanel(area, Object.keys(BP_REGISTRY[area].sideKeys)[0]);
    return;
  }

  // Populate condition dropdown from VA_AREA_CONDITIONS
  const conditions = (typeof VA_AREA_CONDITIONS!=='undefined' && VA_AREA_CONDITIONS[area]) || [];
  let h='<option value="">— Select condition —</option>';
  conditions.forEach(name=>{
    h+=`<option value="${name.replace(/"/g,'&quot;')}">${name}</option>`;
  });
  h+='<option value="__custom__">Other / Custom...</option>';
  condSelect.innerHTML=h;
  condField.classList.remove('hidden');
  document.getElementById('custom-label-field').classList.add('hidden');

  // Update preview pin label and title
  if(pendingPin){
    pendingPin.key = area;
  }
}

function onConditionChange(val){
  const condCustom = document.getElementById('f-condition-custom');
  if(val==='__custom__'){
    condCustom.classList.remove('hidden');
    condCustom.focus();
    document.getElementById('custom-label-field').classList.remove('hidden');
  } else {
    condCustom.classList.add('hidden');
    condCustom.value='';
    document.getElementById('custom-label-field').classList.add('hidden');
  }

  // Update preview pin with condition name
  if(pendingPin && val && val!=='__custom__'){
    pendingPin.label = val;
    const previewEl = document.getElementById('pin-preview');
    if(previewEl){
      const tip = previewEl.querySelector('.pin-tip');
      if(tip) tip.textContent = val;
    }
    document.getElementById('ftitle').textContent = `Log Injury — ${val}`;
  }
}

// Attach onchange to condition select (called from HTML via inline, but also set up here)
document.addEventListener('DOMContentLoaded', ()=>{
  const condSel = document.getElementById('f-condition');
  if(condSel) condSel.addEventListener('change', function(){ onConditionChange(this.value); });
});

function editInjury(id){
  const inj = injuries.find(i=>i.id===id);
  if(!inj) return;
  editingId = id;
  _pendingImpacts = [...(inj.functionalImpacts||[])];
  document.getElementById('ftitle').textContent = `Edit Injury — ${inj.label}`;
  document.getElementById('fsub').textContent = 'Update the details below.';

  // Show area + condition for editing
  document.getElementById('body-area-field').classList.remove('hidden');
  const group = getGroupForKey(inj.key);
  document.getElementById('f-body-area').value = group;
  document.getElementById('f-body-area').dataset.originalGroup = group;

  // Populate condition dropdown for this area
  onBodyAreaChange(group);
  // Try to select the matching condition
  const condSelect = document.getElementById('f-condition');
  const matchOpt = Array.from(condSelect.options).find(o=>o.value===inj.label);
  if(matchOpt){
    condSelect.value = inj.label;
  } else {
    condSelect.value = '__custom__';
    document.getElementById('f-condition-custom').classList.remove('hidden');
    document.getElementById('f-condition-custom').value = inj.label;
  }

  document.getElementById('custom-label-field').classList.remove('hidden');
  document.getElementById('f-custom-label').value = inj.label;
  document.getElementById('f-date').value = inj.date||'';
  document.getElementById('f-sev').value = inj.severity||'moderate';
  document.getElementById('f-loc').value = inj.location||'';
  document.getElementById('f-event').value = inj.event||'';
  document.getElementById('f-desc').value = inj.description||'';
  document.getElementById('f-med').value = inj.medicalCare||'';
  document.getElementById('f-clinic').value = inj.clinicName||'';
  document.getElementById('cf').style.display = inj.medicalCare==='yes'?'flex':'none';
  document.getElementById('f-wit').value = inj.witnesses||'';
  document.getElementById('f-still-seen').checked = !!inj.stillBeingSeen;
  document.getElementById('f-impact').value='';
  document.getElementById('f-impact-custom').value='';
  document.getElementById('save-btn').textContent='Update Injury';
  renderImpactChips();
  openModal();
}

function saveInjury(){
  const date=document.getElementById('f-date').value;
  if(!date){alert('Please select a date.');return;}

  if(editingId !== null){
    // EDIT MODE — update existing injury
    const inj = injuries.find(i=>i.id===editingId);
    if(!inj) return;

    // Resolve label from condition or custom
    const resolvedLabel = getResolvedLabel(inj.label);
    if(!resolvedLabel){
      highlightMissingCondition();
      return;
    }

    inj.label = resolvedLabel;
    inj.date = date;
    inj.severity = document.getElementById('f-sev').value;
    inj.location = document.getElementById('f-loc').value;
    inj.event = document.getElementById('f-event').value;
    inj.description = document.getElementById('f-desc').value;
    inj.medicalCare = document.getElementById('f-med').value;
    inj.clinicName = document.getElementById('f-clinic').value;
    inj.witnesses = document.getElementById('f-wit').value;
    inj.stillBeingSeen = document.getElementById('f-still-seen').checked;
    inj.functionalImpacts = [..._pendingImpacts];
    // Update body area key
    const newArea = document.getElementById('f-body-area').value;
    const origGroup = document.getElementById('f-body-area').dataset.originalGroup;
    if(newArea && newArea!==origGroup) inj.key = newArea;
    inj.pin.label = resolvedLabel;
    // Update pin on map
    const pinEl = document.getElementById('pin-'+inj.id);
    if(pinEl){
      pinEl.className=`pin pin-${inj.severity}`;
      const tip=(inj.label+(inj.event?' · '+inj.event:'')).slice(0,32);
      pinEl.querySelector('.pin-tip').textContent=`#${injuryNumber(inj.id)} · ${tip}`;
    }
    editingId = null;
    _pendingImpacts = [];
    closeModal();
    updateBadges(); updateCount(); refreshPinNumbers(); renderTimeline();
    return;
  }

  // NEW INJURY MODE
  if(!pendingPin){alert('No pin placed. Click the body map or Quick Select first.');return;}
  const isCustom = pendingPin.key==='custom';

  // For custom pins, require area + condition selection
  if(isCustom){
    const area = document.getElementById('f-body-area').value;
    if(!area){
      document.getElementById('f-body-area').focus();
      document.getElementById('f-body-area').style.borderColor='var(--severe)';
      return;
    }
    document.getElementById('f-body-area').style.borderColor='';
    pendingPin.key = area;
  }

  const resolvedLabel = isCustom ? getResolvedLabel('') : pendingPin.label;
  if(isCustom && !resolvedLabel){
    highlightMissingCondition();
    return;
  }
  const finalLabel = resolvedLabel || pendingPin.label;

  const sev=document.getElementById('f-sev').value;
  const inj={
    id:Date.now(),
    key:pendingPin.key,
    label:finalLabel,
    date, severity:sev,
    location:document.getElementById('f-loc').value,
    event:document.getElementById('f-event').value,
    description:document.getElementById('f-desc').value,
    medicalCare:document.getElementById('f-med').value,
    clinicName:document.getElementById('f-clinic').value,
    witnesses:document.getElementById('f-wit').value,
    stillBeingSeen:document.getElementById('f-still-seen').checked,
    functionalImpacts:[..._pendingImpacts],
    pin:{...pendingPin, label:finalLabel},
  };
  injuries.push(inj);
  removePreviewPin();
  dropPin(inj);

  // Stamp date and pin info onto MH/Head conditions so they appear on timeline
  if(pendingPin.key === 'mental'){
    (window._mentalHealthConditions||[]).forEach(c => {
      if(!c.date) c.date = date;
      if(!c.pin) c.pin = {x:inj.pin.x, y:inj.pin.y, side:inj.pin.side, body:inj.pin.body};
    });
  }
  if(pendingPin.key === 'headFace'){
    (window._headConditions||[]).forEach(c => {
      if(!c.date) c.date = date;
      if(!c.pin) c.pin = {x:inj.pin.x, y:inj.pin.y, side:inj.pin.side, body:inj.pin.body};
    });
  }

  // Stamp date/pin onto body part conditions (knee, back, shoulder, etc.)
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      // Match if the pin key belongs to this body part's side keys
      if(cfg.sideKeys[pendingPin.key]){
        (window[cfg.stateKey]||[]).forEach(c => {
          if(!c.date) c.date = date;
          if(!c.pin) c.pin = {x:inj.pin.x, y:inj.pin.y, side:inj.pin.side, body:inj.pin.body};
        });
      }
    });
  }

  updateBadges(); updateCount(); refreshPinNumbers();
  pendingPin=null;
  _pendingImpacts = [];
  closeModal();
}

// Resolve the label from condition dropdown or custom input
function getResolvedLabel(fallback){
  const condSelect = document.getElementById('f-condition');
  const condVal = condSelect ? condSelect.value : '';
  const condCustom = document.getElementById('f-condition-custom').value.trim();
  const customLabel = document.getElementById('f-custom-label').value.trim();

  // Priority: custom label override > custom condition input > condition dropdown > fallback
  if(customLabel) return customLabel;
  if(condVal==='__custom__') return condCustom || '';
  if(condVal) return condVal;
  return fallback || '';
}

function highlightMissingCondition(){
  const condSelect = document.getElementById('f-condition');
  const condVal = condSelect ? condSelect.value : '';
  if(condVal==='__custom__'){
    const inp = document.getElementById('f-condition-custom');
    inp.focus();
    inp.style.borderColor='var(--severe)';
    inp.placeholder='Please enter a condition name';
  } else {
    condSelect.focus();
    condSelect.style.borderColor='var(--severe)';
  }
}

function cancelForm(){
  if(editingId === null) removePreviewPin();
  pendingPin=null; editingId=null;
  _pendingImpacts = [];
  document.getElementById('f-custom-label').style.borderColor='';
  closeModal();
}

// ── FUNCTIONAL IMPACT CHIPS ──

function renderImpactChips(){
  const c = document.getElementById('fi-chips');
  if(!_pendingImpacts.length){
    c.innerHTML='<span style="font-size:11px;color:var(--muted);font-style:italic;">No limitations added</span>';
    return;
  }
  c.innerHTML = _pendingImpacts.map(fi=>
    `<span class="sc-chip" style="background:rgba(200,16,46,.1);color:var(--red2);border:1px solid rgba(200,16,46,.2);">
      <span>${fi}</span>
      <span class="sc-rm" style="color:var(--red);" onclick="removeImpact('${fi.replace(/'/g,"\\'")}')">×</span>
    </span>`
  ).join('');
}

function addImpactFromSelect(sel){
  const val = sel.value;
  if(!val) return;
  if(!_pendingImpacts.includes(val)) _pendingImpacts.push(val);
  sel.value='';
  renderImpactChips();
}

function addCustomImpact(){
  const input = document.getElementById('f-impact-custom');
  const val = input.value.trim();
  if(!val) return;
  if(!_pendingImpacts.includes(val)) _pendingImpacts.push(val);
  input.value='';
  renderImpactChips();
}

function removeImpact(label){
  _pendingImpacts = _pendingImpacts.filter(fi=>fi!==label);
  renderImpactChips();
}

// ── EXPORT MENU ──

function toggleExportMenu(){
  document.getElementById('export-menu').classList.toggle('hidden');
}
function closeExportMenu(){
  document.getElementById('export-menu').classList.add('hidden');
}
// Close menu when clicking outside
document.addEventListener('click', e=>{
  const wrap = document.getElementById('export-wrap');
  if(wrap && !wrap.contains(e.target)) closeExportMenu();
});
// ── MENTAL HEALTH EVALUATION PANEL ──────────────────────────────────────────

window._mentalHealthConditions = [];
let _mhPanelOpen = false;
let _mhSearch = '';

// ── OPEN / CLOSE ────────────────────────────────────────────────────────────

function openMentalHealthPanel() {
  const panel = document.getElementById('mental-health-panel');
  const bodyPanel = document.querySelector('.body-panel');
  const sidebar = document.getElementById('sidebar');
  if (bodyPanel) bodyPanel.classList.add('hidden');
  if (sidebar) sidebar.classList.add('hidden');
  panel.classList.remove('hidden');
  _mhPanelOpen = true;
  renderMentalPanel();
}

function closeMentalHealthPanel() {
  const panel = document.getElementById('mental-health-panel');
  const bodyPanel = document.querySelector('.body-panel');
  const sidebar = document.getElementById('sidebar');
  panel.classList.add('hidden');
  if (bodyPanel) bodyPanel.classList.remove('hidden');
  if (sidebar) sidebar.classList.remove('hidden');
  _mhPanelOpen = false;
}

function placeMentalHealthPin() {
  const highest = getMHHighestCondition();
  const label = highest ? highest.condition : 'Mental Health';
  closeMentalHealthPanel();
  enterPinPlaceMode('mental', label, true);
}

// ── CONDITION MANAGEMENT ────────────────────────────────────────────────────

function addMentalCondition(name) {
  if (window._mentalHealthConditions.find(c => c.condition === name)) return;
  const domains = {};
  MH_DOMAINS.forEach(d => { domains[d.id] = { level: 'none', frequency: 'less25' }; });
  window._mentalHealthConditions.push(Object.assign({
    id: Date.now(),
    condition: name,
    domains: domains,
    calculatedRating: 0,
    manualOverride: null,
    effectiveRating: 0
  }, _condInfoDefaults()));
  renderMentalPanel();
}

function removeMentalCondition(id) {
  window._mentalHealthConditions = window._mentalHealthConditions.filter(c => c.id !== id);
  renderMentalPanel();
  if (typeof renderRating === 'function') renderRating();
}

function toggleMentalCondition(name) {
  const existing = window._mentalHealthConditions.find(c => c.condition === name);
  if (existing) removeMentalCondition(existing.id);
  else addMentalCondition(name);
}

// ── DOMAIN UPDATES ──────────────────────────────────────────────────────────

function updateMHDomain(condId, domainId, level) {
  const cond = window._mentalHealthConditions.find(c => c.id === condId);
  if (!cond) return;
  cond.domains[domainId].level = level;
  if (level === 'none') cond.domains[domainId].frequency = 'less25';
  recalcMHRating(cond);
  renderMentalPanel();
  if (typeof renderRating === 'function') renderRating();
}

function updateMHFrequency(condId, domainId, freq) {
  const cond = window._mentalHealthConditions.find(c => c.id === condId);
  if (!cond) return;
  cond.domains[domainId].frequency = freq;
  recalcMHRating(cond);
  renderMentalPanel();
  if (typeof renderRating === 'function') renderRating();
}

function setMHOverride(condId, value) {
  const cond = window._mentalHealthConditions.find(c => c.id === condId);
  if (!cond) return;
  if (value === '' || value === null) {
    cond.manualOverride = null;
    cond.effectiveRating = cond.calculatedRating;
  } else {
    cond.manualOverride = parseInt(value);
    cond.effectiveRating = cond.manualOverride;
  }
  renderMentalPanel();
  if (typeof renderRating === 'function') renderRating();
}

function toggleMHOverride(condId, checked) {
  const cond = window._mentalHealthConditions.find(c => c.id === condId);
  if (!cond) return;
  if (checked) {
    cond.manualOverride = cond.calculatedRating;
    cond.effectiveRating = cond.manualOverride;
  } else {
    cond.manualOverride = null;
    cond.effectiveRating = cond.calculatedRating;
  }
  renderMentalPanel();
  if (typeof renderRating === 'function') renderRating();
}

function recalcMHRating(cond) {
  cond.calculatedRating = calculateMHRating(cond.domains);
  if (cond.manualOverride === null) {
    cond.effectiveRating = cond.calculatedRating;
  }
}

// ── GET HIGHEST RATING (for combined VA calc) ───────────────────────────────

function getMHHighestRating() {
  const conds = window._mentalHealthConditions;
  if (!conds.length) return null;
  let highest = 0;
  conds.forEach(c => { if (c.effectiveRating > highest) highest = c.effectiveRating; });
  return highest;
}

function getMHHighestCondition() {
  const conds = window._mentalHealthConditions;
  if (!conds.length) return null;
  let best = conds[0];
  conds.forEach(c => { if (c.effectiveRating > best.effectiveRating) best = c; });
  return best;
}

// ── TOGGLE EVAL CARD ────────────────────────────────────────────────────────

function toggleMHEvalCard(condId) {
  const body = document.getElementById('mh-eval-body-' + condId);
  if (body) body.classList.toggle('collapsed');
}

// ── SEARCH ──────────────────────────────────────────────────────────────────

function onMHSearch(val) {
  _mhSearch = val.toLowerCase();
  renderConditionList();
}

function renderConditionList() {
  const list = document.getElementById('mh-cond-list');
  if (!list) return;
  const selected = new Set(window._mentalHealthConditions.map(c => c.condition));
  const filtered = VA_MENTAL.filter(name => {
    if(!_mhSearch) return true;
    const examples = (typeof MH_EXAMPLES !== 'undefined' && MH_EXAMPLES[name]) || '';
    return name.toLowerCase().includes(_mhSearch) || examples.toLowerCase().includes(_mhSearch);
  });
  let h = '';
  filtered.forEach(name => {
    const checked = selected.has(name);
    const cond = window._mentalHealthConditions.find(c => c.condition === name);
    const badge = cond ? `<span class="mh-cond-badge mh-rate-${cond.effectiveRating}">${cond.effectiveRating}%</span>` : '';
    const examples = (typeof MH_EXAMPLES !== 'undefined' && MH_EXAMPLES[name]) || '';
    const exHtml = examples ? `<span class="mh-cond-examples">e.g. ${examples}</span>` : '';
    h += `<div class="mh-cond-item${checked ? ' selected' : ''}" onclick="toggleMentalCondition('${name.replace(/'/g, "\\'")}')">
      <input type="checkbox" ${checked ? 'checked' : ''} onclick="event.stopPropagation();toggleMentalCondition('${name.replace(/'/g, "\\'")}')">
      <span class="mh-cond-label">${name}${exHtml}</span>
      ${badge}
    </div>`;
  });
  if (!filtered.length) h = '<div style="padding:14px;color:var(--muted);font-size:12px;text-align:center;">No conditions match your search.</div>';
  list.innerHTML = h;
}

// ── RENDER PANEL ────────────────────────────────────────────────────────────

function renderMentalPanel() {
  const panel = document.getElementById('mental-health-panel');
  if (!panel) return;

  const conds = window._mentalHealthConditions;
  const highest = getMHHighestCondition();

  let h = '';

  // Header
  h += `<div class="mh-header">
    <span class="mh-title">Mental Health Evaluation</span>
    <button class="mh-back" onclick="closeMentalHealthPanel()">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>
      Back to Map
    </button>
  </div>`;

  h += '<div class="mh-body">';

  // Info banner
  h += `<div class="mh-info">
    <strong>VA Single Rating Rule:</strong> The VA rates all mental health conditions under one combined rating using the General Rating Formula for Mental Disorders.
    If you have multiple conditions, the <strong>highest evaluated rating</strong> will be used as your single mental health disability rating.
  </div>`;

  // Search
  h += `<div class="mh-search">
    <svg class="mh-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
    <input type="text" placeholder="Search conditions..." value="${_mhSearch}" oninput="onMHSearch(this.value)">
  </div>`;

  // Condition checklist
  h += '<div class="mh-cond-list" id="mh-cond-list"></div>';

  // Selected conditions evaluation
  if (conds.length) {
    h += `<div class="mh-section-title">Evaluations (${conds.length} condition${conds.length > 1 ? 's' : ''})</div>`;

    conds.forEach(cond => {
      const isHighest = highest && cond.id === highest.id && conds.length > 1;
      const rateClass = 'mh-rate-' + cond.effectiveRating;
      const overrideActive = cond.manualOverride !== null;

      h += `<div class="mh-eval-card${isHighest ? ' mh-highest' : ''}">`;

      // Header
      h += `<div class="mh-eval-header" onclick="toggleMHEvalCard(${cond.id})">
        <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
          <span class="mh-eval-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cond.condition}</span>
          ${isHighest ? '<span class="mh-highest-tag">Highest Rating</span>' : ''}
          ${overrideActive ? '<span class="mh-override-tag">Manual</span>' : ''}
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="mh-eval-rating ${rateClass}">${cond.effectiveRating}%</span>
          <button class="mh-remove" onclick="event.stopPropagation();removeMentalCondition(${cond.id})" title="Remove condition">&times;</button>
        </div>
      </div>`;

      // Body (domains)
      h += `<div class="mh-eval-body" id="mh-eval-body-${cond.id}">`;

      // Service info fields
      h += _condInfoHTML('mh', cond);

      // Domain cards
      MH_DOMAINS.forEach(domain => {
        const dv = cond.domains[domain.id];
        const currentLevel = dv.level;
        const currentFreq = dv.frequency;
        const exampleText = domain.examples[currentLevel] || '';

        h += `<div class="mh-domain">
          <div class="mh-domain-header">
            <div class="mh-domain-label">${domain.label}</div>
            <div class="mh-domain-desc">${domain.description}</div>
          </div>`;

        // Level buttons
        h += '<div class="mh-levels">';
        MH_IMPAIRMENT_LEVELS.forEach(lv => {
          const isActive = currentLevel === lv;
          h += `<button class="mh-level-btn${isActive ? ' active-' + lv : ''}"
            onclick="updateMHDomain(${cond.id},'${domain.id}','${lv}')">${MH_IMPAIRMENT_LABELS[lv]}</button>`;
        });
        h += '</div>';

        // Frequency (only if impairment > none)
        if (currentLevel !== 'none') {
          h += `<div class="mh-freq">
            <span class="mh-freq-label">How often?</span>
            <button class="mh-freq-btn${currentFreq === 'less25' ? ' active' : ''}"
              onclick="updateMHFrequency(${cond.id},'${domain.id}','less25')">Less than 25% of time</button>
            <button class="mh-freq-btn${currentFreq === '25plus' ? ' active' : ''}"
              onclick="updateMHFrequency(${cond.id},'${domain.id}','25plus')">25% or more</button>
          </div>`;
        }

        // Example
        h += `<div class="mh-example">${exampleText}</div>`;
        h += '</div>';
      });

      // Calculated rating display
      h += `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(10,35,87,.04);border-radius:6px;">
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--navy);font-family:var(--fh);text-transform:uppercase;letter-spacing:.5px;">Calculated Rating</div>
          <div style="font-size:24px;font-weight:800;font-family:var(--fm);color:var(--navy);">${cond.calculatedRating}%</div>
        </div>
      </div>`;

      // Manual override
      h += `<div class="mh-override">
        <label>
          <input type="checkbox" ${overrideActive ? 'checked' : ''} onchange="toggleMHOverride(${cond.id},this.checked)">
          Manual Override
        </label>`;
      if (overrideActive) {
        h += `<select onchange="setMHOverride(${cond.id},this.value)">`;
        [0, 10, 30, 50, 70, 100].forEach(v => {
          h += `<option value="${v}"${v === cond.manualOverride ? ' selected' : ''}>${v}%</option>`;
        });
        h += '</select>';
      }
      h += '</div>';

      h += '</div>'; // eval-body
      h += '</div>'; // eval-card
    });

    // Combined rating display
    const highestRating = getMHHighestRating();
    h += `<div class="mh-combined">
      <div class="mh-combined-label">Your Mental Health Rating</div>
      <div class="mh-combined-value">${highestRating}%</div>
      <div class="mh-combined-note">${conds.length > 1
        ? 'Highest of ' + conds.length + ' evaluated conditions (VA single-rating rule)'
        : 'Based on your evaluation above'}</div>
    </div>`;

  } else {
    h += `<div class="mh-empty">
      <div style="font-size:28px;margin-bottom:8px;">&#9881;</div>
      <strong>Select conditions above to begin evaluation</strong><br>
      Check one or more conditions, then rate how each affects you across 5 functional domains.<br>
      The VA uses these domains to determine your mental health disability rating.
    </div>`;
  }

  // Place Pin / Done buttons
  h += '<div class="mh-done-wrap">';
  if(conds.length){
    h += '<button class="mh-done-btn" onclick="placeMentalHealthPin()">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z"/></svg>' +
      ' Place Pin on Map' +
    '</button>' +
    '<div style="font-size:11px;color:var(--muted);text-align:center;margin-top:6px;">Click to return to the map and place a pin for this condition.</div>';
  }
  h += '<button class="mh-back-btn" onclick="closeMentalHealthPanel()" style="margin-top:8px;">' +
    'Back to Map (no pin)' +
  '</button>';
  h += '</div>';

  h += '</div>'; // mh-body
  panel.innerHTML = h;

  // Render condition list separately (preserves search state)
  renderConditionList();
}
// ── HEAD & FACE EVALUATION PANEL ─────────────────────────────────────────────

window._headConditions = [];
let _headPanelOpen = false;
let _headSearch = '';
let _headPinKey = 'headFace'; // which pin was clicked to open

// ── OPEN / CLOSE ─────────────────────────────────────────────────────────────

function openHeadPanel(pinKey) {
  _headPinKey = pinKey || 'headFace';
  const panel = document.getElementById('head-panel');
  const bodyPanel = document.querySelector('.body-panel');
  const sidebar = document.getElementById('sidebar');
  if (bodyPanel) bodyPanel.classList.add('hidden');
  if (sidebar) sidebar.classList.add('hidden');
  panel.classList.remove('hidden');
  _headPanelOpen = true;
  renderHeadPanel();
}

function closeHeadPanel() {
  const panel = document.getElementById('head-panel');
  const bodyPanel = document.querySelector('.body-panel');
  const sidebar = document.getElementById('sidebar');
  panel.classList.add('hidden');
  if (bodyPanel) bodyPanel.classList.remove('hidden');
  if (sidebar) sidebar.classList.remove('hidden');
  _headPanelOpen = false;
}

function placeHeadPin() {
  const conds = window._headConditions;
  const label = conds.length ? conds[0].condition : 'Head & Face';
  closeHeadPanel();
  enterPinPlaceMode('headFace', label, true);
}

// ── CONDITION MANAGEMENT ─────────────────────────────────────────────────────

function addHeadCondition(name) {
  if (window._headConditions.find(c => c.condition === name)) return;
  const profileKey = getHeadProfileKey(name);
  const profile = HEAD_PROFILES[profileKey];
  const domains = {};
  profile.domains.forEach(d => { domains[d.id] = 0; });
  window._headConditions.push(Object.assign({
    id: Date.now(),
    condition: name,
    profile: profileKey,
    domains: domains,
    calculatedRating: 0,
    manualOverride: null,
    effectiveRating: 0,
    extremity: 'none',
  }, _condInfoDefaults()));
  renderHeadPanel();
}

function removeHeadCondition(id) {
  window._headConditions = window._headConditions.filter(c => c.id !== id);
  renderHeadPanel();
  if (typeof renderRating === 'function') renderRating();
}

function toggleHeadCondition(name) {
  const existing = window._headConditions.find(c => c.condition === name);
  if (existing) removeHeadCondition(existing.id);
  else addHeadCondition(name);
}

// ── DOMAIN UPDATES ───────────────────────────────────────────────────────────

function updateHeadDomain(condId, domainId, value) {
  const cond = window._headConditions.find(c => c.id === condId);
  if (!cond) return;
  cond.domains[domainId] = parseInt(value);
  recalcHeadRating(cond);
  renderHeadPanel();
  if (typeof renderRating === 'function') renderRating();
}

function setHeadOverride(condId, value) {
  const cond = window._headConditions.find(c => c.id === condId);
  if (!cond) return;
  if (value === '' || value === null) {
    cond.manualOverride = null;
    cond.effectiveRating = cond.calculatedRating;
  } else {
    cond.manualOverride = parseInt(value);
    cond.effectiveRating = cond.manualOverride;
  }
  renderHeadPanel();
  if (typeof renderRating === 'function') renderRating();
}

function toggleHeadOverride(condId, checked) {
  const cond = window._headConditions.find(c => c.id === condId);
  if (!cond) return;
  if (checked) {
    cond.manualOverride = cond.calculatedRating;
    cond.effectiveRating = cond.manualOverride;
  } else {
    cond.manualOverride = null;
    cond.effectiveRating = cond.calculatedRating;
  }
  renderHeadPanel();
  if (typeof renderRating === 'function') renderRating();
}

function recalcHeadRating(cond) {
  cond.calculatedRating = calculateHeadRating(cond.domains);
  if (cond.manualOverride === null) {
    cond.effectiveRating = cond.calculatedRating;
  }
}

// ── TOGGLE EVAL CARD ─────────────────────────────────────────────────────────

function toggleHeadEvalCard(condId) {
  const body = document.getElementById('hd-eval-body-' + condId);
  if (body) body.classList.toggle('collapsed');
}

// ── SEARCH ───────────────────────────────────────────────────────────────────

function onHeadSearch(val) {
  _headSearch = val.toLowerCase();
  renderHeadConditionList();
}

function renderHeadConditionList() {
  const list = document.getElementById('hd-cond-list');
  if (!list) return;
  const selected = new Set(window._headConditions.map(c => c.condition));
  const filtered = VA_HEAD.filter(name => !_headSearch || name.toLowerCase().includes(_headSearch));
  let h = '';
  filtered.forEach(name => {
    const checked = selected.has(name);
    const cond = window._headConditions.find(c => c.condition === name);
    const badge = cond ? '<span class="mh-cond-badge mh-rate-' + cond.effectiveRating + '">' + cond.effectiveRating + '%</span>' : '';
    const escaped = name.replace(/'/g, "\\'");
    h += '<div class="mh-cond-item' + (checked ? ' selected' : '') + '" onclick="toggleHeadCondition(\'' + escaped + '\')">' +
      '<input type="checkbox" ' + (checked ? 'checked' : '') + ' onclick="event.stopPropagation();toggleHeadCondition(\'' + escaped + '\')">' +
      '<span class="mh-cond-label">' + name + '</span>' +
      badge +
    '</div>';
  });
  if (!filtered.length) h = '<div style="padding:14px;color:var(--muted);font-size:12px;text-align:center;">No conditions match your search.</div>';
  list.innerHTML = h;
}

// ── RENDER PANEL ─────────────────────────────────────────────────────────────

function renderHeadPanel() {
  const panel = document.getElementById('head-panel');
  if (!panel) return;

  const conds = window._headConditions;
  let h = '';

  // Header
  h += '<div class="mh-header">' +
    '<span class="mh-title">Head & Face Evaluation</span>' +
    '<button class="mh-back" onclick="closeHeadPanel()">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>' +
      ' Back to Map' +
    '</button>' +
  '</div>';

  h += '<div class="mh-body">';

  // Info banner
  h += '<div class="mh-info">' +
    '<strong>Each condition rated separately:</strong> Unlike mental health, physical head/face conditions are each rated independently under their own diagnostic code. ' +
    'Each rating contributes separately to your combined VA disability rating.' +
  '</div>';

  // Search
  h += '<div class="mh-search">' +
    '<svg class="mh-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
    '<input type="text" placeholder="Search conditions..." value="' + _headSearch + '" oninput="onHeadSearch(this.value)">' +
  '</div>';

  // Condition checklist
  h += '<div class="mh-cond-list" id="hd-cond-list"></div>';

  // Selected conditions evaluation
  if (conds.length) {
    h += '<div class="mh-section-title">Evaluations (' + conds.length + ' condition' + (conds.length > 1 ? 's' : '') + ')</div>';

    conds.forEach(cond => {
      const profile = HEAD_PROFILES[cond.profile] || HEAD_PROFILES.generic;
      const rateClass = 'mh-rate-' + cond.effectiveRating;
      const overrideActive = cond.manualOverride !== null;

      h += '<div class="mh-eval-card">';

      // Card header
      h += '<div class="mh-eval-header" onclick="toggleHeadEvalCard(' + cond.id + ')">' +
        '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">' +
          '<span class="mh-eval-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + cond.condition + '</span>' +
          '<span style="font-size:9px;font-weight:600;font-family:var(--fh);color:var(--muted);background:var(--bg);border:1px solid var(--border);padding:1px 6px;border-radius:3px;">' + profile.label.split('(')[0].trim() + '</span>' +
          (overrideActive ? '<span class="mh-override-tag">Manual</span>' : '') +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span class="mh-eval-rating ' + rateClass + '">' + cond.effectiveRating + '%</span>' +
          '<button class="mh-remove" onclick="event.stopPropagation();removeHeadCondition(' + cond.id + ')" title="Remove condition">&times;</button>' +
        '</div>' +
      '</div>';

      // Card body (domains)
      h += '<div class="mh-eval-body" id="hd-eval-body-' + cond.id + '">';

      // Service info fields
      h += _condInfoHTML('head', cond);

      // Profile note
      if (profile.note) {
        h += '<div style="padding:8px 12px;margin-bottom:10px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;font-size:11px;color:#92400e;">' + profile.note + '</div>';
      }

      // Domain cards
      profile.domains.forEach(domain => {
        const currentValue = cond.domains[domain.id] || 0;

        h += '<div class="mh-domain">' +
          '<div class="mh-domain-header">' +
            '<div class="mh-domain-label">' + domain.label + '</div>' +
            '<div class="mh-domain-desc">' + domain.description + '</div>' +
          '</div>';

        // Level buttons — physical conditions use specific value levels
        h += '<div class="hd-levels">';
        domain.levels.forEach(lv => {
          const isActive = currentValue === lv.value;
          h += '<button class="hd-level-btn' + (isActive ? ' hd-active' : '') + '"' +
            ' onclick="updateHeadDomain(' + cond.id + ',\'' + domain.id + '\',' + lv.value + ')"' +
            ' title="' + (lv.description || '').replace(/"/g, '&quot;') + '">' +
            '<span class="hd-level-val">' + lv.value + '%</span>' +
            '<span class="hd-level-label">' + lv.label + '</span>' +
          '</button>';
        });
        h += '</div>';

        // Show description for selected level
        const selectedLevel = domain.levels.find(lv => lv.value === currentValue);
        if (selectedLevel && selectedLevel.description && currentValue > 0) {
          h += '<div class="mh-example">' + selectedLevel.description + '</div>';
        }

        h += '</div>'; // domain
      });

      // Calculated rating display
      h += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(10,35,87,.04);border-radius:6px;">' +
        '<div>' +
          '<div style="font-size:11px;font-weight:700;color:var(--navy);font-family:var(--fh);text-transform:uppercase;letter-spacing:.5px;">Calculated Rating</div>' +
          '<div style="font-size:24px;font-weight:800;font-family:var(--fm);color:var(--navy);">' + cond.calculatedRating + '%</div>' +
        '</div>' +
      '</div>';

      // Manual override
      h += '<div class="mh-override">' +
        '<label>' +
          '<input type="checkbox" ' + (overrideActive ? 'checked' : '') + ' onchange="toggleHeadOverride(' + cond.id + ',this.checked)">' +
          ' Manual Override' +
        '</label>';
      if (overrideActive) {
        h += '<select onchange="setHeadOverride(' + cond.id + ',this.value)">';
        [0,10,20,30,40,50,60,70,80,90,100].forEach(v => {
          h += '<option value="' + v + '"' + (v === cond.manualOverride ? ' selected' : '') + '>' + v + '%</option>';
        });
        h += '</select>';
      }
      h += '</div>';

      h += '</div>'; // eval-body
      h += '</div>'; // eval-card
    });

    // Summary — all ratings
    h += '<div class="mh-combined" style="background:linear-gradient(135deg,#0a2357 0%,#1d4ed8 100%);">' +
      '<div class="mh-combined-label">Head & Face Ratings</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px;">';
    conds.forEach(c => {
      h += '<div style="background:rgba(255,255,255,.15);border-radius:6px;padding:6px 12px;text-align:center;">' +
        '<div style="font-size:10px;color:rgba(255,255,255,.7);white-space:nowrap;max-width:120px;overflow:hidden;text-overflow:ellipsis;">' + c.condition + '</div>' +
        '<div style="font-size:20px;font-weight:800;font-family:var(--fm);color:#fff;">' + c.effectiveRating + '%</div>' +
      '</div>';
    });
    h += '</div>' +
      '<div class="mh-combined-note" style="margin-top:8px;">Each condition contributes separately to your combined VA rating</div>' +
    '</div>';

  } else {
    h += '<div class="mh-empty">' +
      '<div style="font-size:28px;margin-bottom:8px;">&#129504;</div>' +
      '<strong>Select conditions above to begin evaluation</strong><br>' +
      'Check one or more conditions, then rate each using VA diagnostic criteria.<br>' +
      'Head & face conditions include TBI, migraines, hearing, vision, TMJ, and more.' +
    '</div>';
  }

  // Place Pin / Done buttons
  h += '<div class="mh-done-wrap">';
  if(conds.length){
    h += '<button class="mh-done-btn" onclick="placeHeadPin()">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z"/></svg>' +
      ' Place Pin on Map' +
    '</button>' +
    '<div style="font-size:11px;color:var(--muted);text-align:center;margin-top:6px;">Click to return to the map and place a pin for this condition.</div>';
  }
  h += '<button class="mh-back-btn" onclick="closeHeadPanel()" style="margin-top:8px;">' +
    'Back to Map (no pin)' +
  '</button>';
  h += '</div>';

  h += '</div>'; // mh-body
  panel.innerHTML = h;

  // Render condition list separately (preserves search state)
  // Use setTimeout to ensure DOM is ready after innerHTML assignment
  setTimeout(()=> renderHeadConditionList(), 0);
}
// ── BODY PART EVALUATION PANELS (Knee, Back/Spine, Shoulder, etc.) ──────────
// Reusable panel system for physical body part evaluations

// Registry of body part configs
const BP_REGISTRY = {
  knee: {
    id: 'knee', title: 'Knee Evaluation', stateKey: '_kneeConditions',
    panelId: 'knee-panel', conditions: 'knee', // key in VA_AREA_CONDITIONS
    profiles: ()=>KNEE_PROFILES, profileMap: ()=>KNEE_CONDITION_PROFILE,
    getProfile: getKneeProfile, getProfileKey: getKneeProfileKey,
    calcRating: calculateKneeRating,
    sideKeys: {leftKnee:'Left',rightKnee:'Right'},
    extremityMap: {leftKnee:'LL',rightKnee:'RL'},
    note: 'Knee conditions can be rated for how far it bends, whether it gives out, and cartilage damage — each rated separately. All contribute to your combined VA rating.',
  },
  back: {
    id: 'back', title: 'Back & Spine Evaluation', stateKey: '_backConditions',
    panelId: 'back-panel', conditions: 'back',
    profiles: ()=>SPINE_PROFILES, profileMap: ()=>SPINE_CONDITION_PROFILE,
    getProfile: getSpineProfile, getProfileKey: getSpineProfileKey,
    calcRating: calculateSpineRating,
    sideKeys: {upperBack:'Upper',spine:'Mid',lowerBack:'Lower'},
    extremityMap: {},
    note: 'Back conditions are rated based on how far you can bend and move your spine. Nerve pain that shoots down your legs (radiculopathy/sciatica) is rated as a separate condition.',
  },
  shoulder: {
    id: 'shoulder', title: 'Shoulder Evaluation', stateKey: '_shoulderConditions',
    panelId: 'shoulder-panel', conditions: 'shoulder',
    profiles: ()=>SHOULDER_PROFILES, profileMap: ()=>SHOULDER_CONDITION_PROFILE,
    getProfile: getShoulderProfile, getProfileKey: getShoulderProfileKey,
    calcRating: calculateShoulderRating,
    sideKeys: {leftShoulder:'Left',rightShoulder:'Right'},
    extremityMap: {leftShoulder:'LU',rightShoulder:'RU'},
    note: 'Shoulder conditions are rated on how far you can raise and move your arm, whether it dislocates or slips, and any bone or joint damage.',
  },
  neck: {
    id: 'neck', title: 'Neck Evaluation', stateKey: '_neckConditions',
    panelId: 'neck-panel', conditions: 'neck',
    profiles: ()=>NECK_PROFILES, profileMap: ()=>NECK_CONDITION_PROFILE,
    getProfile: getNeckProfile, getProfileKey: getNeckProfileKey,
    calcRating: calculateNeckRating,
    sideKeys: {neck:'Neck'},
    extremityMap: {},
    note: 'Neck conditions are rated on how far you can turn and tilt your head. Nerve pain, numbness, or tingling that travels down your arms (radiculopathy) is rated as a separate condition.',
  },
  hip: {
    id: 'hip', title: 'Hip Evaluation', stateKey: '_hipConditions',
    panelId: 'hip-panel', conditions: 'hip',
    profiles: ()=>HIP_PROFILES, profileMap: ()=>HIP_CONDITION_PROFILE,
    getProfile: getHipProfile, getProfileKey: getHipProfileKey,
    calcRating: calculateHipRating,
    sideKeys: {leftHip:'Left',rightHip:'Right'},
    extremityMap: {leftHip:'LL',rightHip:'RL'},
    note: 'Hip conditions are rated on how far you can bend, straighten, and spread your leg. The worse your movement limitation, the higher the rating.',
  },
  elbow: {
    id: 'elbow', title: 'Elbow / Forearm Evaluation', stateKey: '_elbowConditions',
    panelId: 'elbow-panel', conditions: 'elbow',
    profiles: ()=>ELBOW_PROFILES, profileMap: ()=>ELBOW_CONDITION_PROFILE,
    getProfile: getElbowProfile, getProfileKey: getElbowProfileKey,
    calcRating: calculateElbowRating,
    sideKeys: {leftElbow:'Left',rightElbow:'Right',leftForearm:'Left Forearm',rightForearm:'Right Forearm'},
    extremityMap: {leftElbow:'LU',rightElbow:'RU',leftForearm:'LU',rightForearm:'RU'},
    note: 'Elbow and forearm conditions are rated on how far you can bend, straighten, and rotate your arm (like turning a doorknob or screwdriver).',
  },
  wrist_hand: {
    id: 'wrist_hand', title: 'Wrist / Hand Evaluation', stateKey: '_wristConditions',
    panelId: 'wrist-panel', conditions: 'wrist_hand',
    profiles: ()=>WRIST_PROFILES, profileMap: ()=>WRIST_CONDITION_PROFILE,
    getProfile: getWristProfile, getProfileKey: getWristProfileKey,
    calcRating: calculateWristRating,
    sideKeys: {leftWrist:'Left Wrist',rightWrist:'Right Wrist',leftHand:'Left Hand',rightHand:'Right Hand'},
    extremityMap: {leftWrist:'LU',rightWrist:'RU',leftHand:'LU',rightHand:'RU'},
    note: 'Wrist and hand conditions are rated on how well you can move your wrist, grip strength, nerve problems (like carpal tunnel causing numbness/tingling), and finger function.',
  },
  ankle_foot: {
    id: 'ankle_foot', title: 'Ankle / Foot Evaluation', stateKey: '_ankleConditions',
    panelId: 'ankle-panel', conditions: 'ankle_foot',
    profiles: ()=>ANKLE_PROFILES, profileMap: ()=>ANKLE_CONDITION_PROFILE,
    getProfile: getAnkleProfile, getProfileKey: getAnkleProfileKey,
    calcRating: calculateAnkleRating,
    sideKeys: {leftAnkle:'Left Ankle',rightAnkle:'Right Ankle',leftFoot:'Left Foot',rightFoot:'Right Foot'},
    extremityMap: {leftAnkle:'LL',rightAnkle:'RL',leftFoot:'LL',rightFoot:'RL'},
    note: 'Ankle and foot conditions are rated on how far you can move your ankle, whether it gives out, flat feet, and heel/arch pain (plantar fasciitis).',
  },
  chest: {
    id: 'chest', title: 'Chest / Lungs Evaluation', stateKey: '_chestConditions',
    panelId: 'chest-panel', conditions: 'chest',
    profiles: ()=>CHEST_PROFILES, profileMap: ()=>CHEST_CONDITION_PROFILE,
    getProfile: getChestProfile, getProfileKey: getChestProfileKey,
    calcRating: calculateChestRating,
    sideKeys: {chest:'Chest',leftLung:'Left Lung',rightLung:'Right Lung'},
    extremityMap: {},
    note: 'Breathing conditions are rated on how well your lungs work (based on breathing tests) and whether you need oxygen or inhalers.',
  },
  abdomen: {
    id: 'abdomen', title: 'Abdomen / Pelvis Evaluation', stateKey: '_abdomenConditions',
    panelId: 'abdomen-panel', conditions: 'abdomen',
    profiles: ()=>ABDOMEN_PROFILES, profileMap: ()=>ABDOMEN_CONDITION_PROFILE,
    getProfile: getAbdomenProfile, getProfileKey: getAbdomenProfileKey,
    calcRating: calculateAbdomenRating,
    sideKeys: {abdomen:'Abdomen',pelvis:'Pelvis'},
    extremityMap: {},
    note: 'Stomach, digestive, bladder, and pelvic conditions are rated on how often symptoms occur, how severe they are, and what treatment you need.',
  },
  leg: {
    id: 'leg', title: 'Thigh / Shin / Calf Evaluation', stateKey: '_legConditions',
    panelId: 'leg-panel', conditions: 'leg',
    profiles: ()=>LEG_PROFILES, profileMap: ()=>LEG_CONDITION_PROFILE,
    getProfile: getLegProfile, getProfileKey: getLegProfileKey,
    calcRating: calculateLegRating,
    sideKeys: {leftThigh:'Left Thigh',rightThigh:'Right Thigh',leftShin:'Left Shin',rightShin:'Right Shin',leftHamstring:'Left Hamstring',rightHamstring:'Right Hamstring',leftCalf:'Left Calf',rightCalf:'Right Calf'},
    extremityMap: {leftThigh:'LL',rightThigh:'RL',leftShin:'LL',rightShin:'RL',leftHamstring:'LL',rightHamstring:'RL',leftCalf:'LL',rightCalf:'RL'},
    note: 'Leg muscle injuries are rated based on how badly the muscle is damaged and how it affects your strength and movement. Nerve damage causing numbness or weakness (neuropathy) is rated as a separate condition.',
  },
  systemic: {
    id: 'systemic', title: 'Other / Systemic Evaluation', stateKey: '_systemicConditions',
    panelId: 'systemic-panel', conditions: 'systemic',
    profiles: ()=>SYSTEMIC_PROFILES_ALL, profileMap: ()=>SYSTEMIC_CONDITION_PROFILE,
    getProfile: getSystemicProfile, getProfileKey: getSystemicProfileKey,
    calcRating: calculateSystemicRating,
    sideKeys: {systemic:'Overall'},
    extremityMap: {},
    note: 'Whole-body conditions like diabetes, thyroid problems, skin conditions, immune system disorders, and chronic pain are evaluated here. These are conditions that affect your overall health rather than one specific body part.',
  },
};

// State
let _bpPanelOpen = null; // which region is open, or null
let _bpSearch = '';
let _bpPinKey = '';

// Initialize state arrays
Object.values(BP_REGISTRY).forEach(cfg => {
  if(!window[cfg.stateKey]) window[cfg.stateKey] = [];
});

// ── BILATERAL HELPERS ──────────────────────────────────────────────────────

function _hasBilateralSides(regionId){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return false;
  const entries = Object.entries(cfg.sideKeys);
  return entries.some(([k])=>k.toLowerCase().startsWith('left')) &&
         entries.some(([k])=>k.toLowerCase().startsWith('right'));
}

function _getOppositeSideKey(regionId, pinKey){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return null;
  const keys = Object.keys(cfg.sideKeys);
  const lower = pinKey.toLowerCase();
  if(lower.startsWith('left')){
    const suffix = pinKey.substring(4);
    return keys.find(k => k.toLowerCase() === 'right' + suffix.toLowerCase()) || null;
  }
  if(lower.startsWith('right')){
    const suffix = pinKey.substring(5);
    return keys.find(k => k.toLowerCase() === 'left' + suffix.toLowerCase()) || null;
  }
  return null;
}

function _getBilateralBodyName(regionId){
  const map = {
    knee:'knees', shoulder:'shoulders', hip:'hips',
    elbow:'elbows', wrist_hand:'wrists/hands',
    ankle_foot:'ankles/feet', leg:'legs'
  };
  return map[regionId] || regionId;
}

// ── BILATERAL PROMPT ──
let _bilateralPromptCb = null;

function _showBilateralPrompt(regionId, condName, onAnswer){
  const bodyName = _getBilateralBodyName(regionId);
  _bilateralPromptCb = onAnswer;
  let el = document.getElementById('bilateral-prompt');
  if(el) el.remove();
  el = document.createElement('div');
  el.id = 'bilateral-prompt';
  el.className = 'bilateral-overlay';
  el.innerHTML =
    '<div class="bilateral-dialog">' +
      '<div class="bilateral-dialog-icon">&#9878;</div>' +
      '<div class="bilateral-dialog-title">Do you experience this in both ' + bodyName + '?</div>' +
      '<div class="bilateral-dialog-cond">' + condName + '</div>' +
      '<div class="bilateral-dialog-desc">' +
        'If yes, the same condition and evaluation will apply to both sides. ' +
        'The VA bilateral factor (10%) will be included in your combined rating. ' +
        'You can adjust either side individually later if needed.' +
      '</div>' +
      '<div class="bilateral-dialog-btns">' +
        '<button class="bilateral-btn bilateral-btn-yes" onclick="_onBilateralAnswer(true)">Yes, both ' + bodyName + '</button>' +
        '<button class="bilateral-btn bilateral-btn-no" onclick="_onBilateralAnswer(false)">No, just this side</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(el);
}

function _onBilateralAnswer(both){
  const el = document.getElementById('bilateral-prompt');
  if(el) el.remove();
  if(_bilateralPromptCb){
    _bilateralPromptCb(both);
    _bilateralPromptCb = null;
  }
}

function unlinkBilateral(regionId, condId){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  const conds = window[cfg.stateKey];
  const cond = conds.find(c=>c.id===condId);
  if(!cond) return;
  if(cond.bilateralPairId){
    const pair = conds.find(c=>c.id===cond.bilateralPairId);
    if(pair){ pair.bilateralLinked = false; pair.bilateralPairId = null; pair.bilateralSource = false; }
  }
  cond.bilateralLinked = false;
  cond.bilateralPairId = null;
  cond.bilateralSource = false;
  renderBPPanel(regionId);
}

// ── OPEN / CLOSE ────────────────────────────────────────────────────────────

function switchBPSide(regionId, key){
  _bpPinKey = key;
  renderBPPanel(regionId);
}

function openBPPanel(regionId, pinKey){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  _bpPanelOpen = regionId;
  _bpPinKey = pinKey || Object.keys(cfg.sideKeys)[0] || '';
  _bpSearch = '';
  const panel = document.getElementById(cfg.panelId);
  const bodyPanel = document.querySelector('.body-panel');
  const sidebar = document.getElementById('sidebar');
  if(bodyPanel) bodyPanel.classList.add('hidden');
  if(sidebar) sidebar.classList.add('hidden');
  panel.classList.remove('hidden');
  renderBPPanel(regionId);
}

function closeBPPanel(regionId){
  const cfg = BP_REGISTRY[regionId || _bpPanelOpen];
  if(!cfg) return;
  const panel = document.getElementById(cfg.panelId);
  const bodyPanel = document.querySelector('.body-panel');
  const sidebar = document.getElementById('sidebar');
  if(panel) panel.classList.add('hidden');
  if(bodyPanel) bodyPanel.classList.remove('hidden');
  if(sidebar) sidebar.classList.remove('hidden');
  _bpPanelOpen = null;
}

function placeBPPin(regionId){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  const conds = window[cfg.stateKey] || [];
  const label = conds.length ? conds[0].condition : cfg.title;
  // Determine the pin key — use the original clicked key or first sideKey (not 'both')
  const key = (_bpPinKey && _bpPinKey !== 'both') ? _bpPinKey : Object.keys(cfg.sideKeys)[0] || regionId;
  closeBPPanel(regionId);
  enterPinPlaceMode(key, label, true);
}

// ── CONDITION MANAGEMENT ────────────────────────────────────────────────────

function _addBPCondSide(regionId, name, pinKey){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  const conds = window[cfg.stateKey];
  const ext = cfg.extremityMap[pinKey] || 'none';
  if(conds.find(c=>c.condition===name && c.extremity===ext)) return;
  const profileKey = cfg.getProfileKey(name);
  const profile = cfg.profiles()[profileKey];
  const domains = {};
  profile.domains.forEach(d => { domains[d.id] = 0; });
  conds.push(Object.assign({
    id: Date.now() + Math.random(),
    condition: name,
    profile: profileKey,
    domains: domains,
    calculatedRating: 0,
    manualOverride: null,
    effectiveRating: 0,
    extremity: ext,
    sideLabel: cfg.sideKeys[pinKey] || '',
  }, _condInfoDefaults()));
}

function addBPCondition(regionId, name){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  if(_bpPinKey === 'both'){
    const sides = Object.entries(cfg.sideKeys);
    const leftKey = sides.find(([k])=>k.toLowerCase().startsWith('left'));
    const rightKey = sides.find(([k])=>k.toLowerCase().startsWith('right'));
    if(leftKey) _addBPCondSide(regionId, name, leftKey[0]);
    if(rightKey) _addBPCondSide(regionId, name, rightKey[0]);
  } else {
    _addBPCondSide(regionId, name, _bpPinKey);
  }
  renderBPPanel(regionId);
}

function removeBPCondition(regionId, id){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  // Unlink bilateral pair if removing one side
  const removing = window[cfg.stateKey].find(c=>c.id===id);
  if(removing && removing.bilateralPairId){
    const pair = window[cfg.stateKey].find(c=>c.id===removing.bilateralPairId);
    if(pair){ pair.bilateralLinked = false; pair.bilateralPairId = null; pair.bilateralSource = false; }
  }
  window[cfg.stateKey] = window[cfg.stateKey].filter(c=>c.id!==id);
  renderBPPanel(regionId);
  if(typeof renderRating==='function') renderRating();
}

function toggleBPCondition(regionId, name){
  const cfg = BP_REGISTRY[regionId];
  const conds = window[cfg.stateKey];
  if(_bpPinKey === 'both'){
    const existing = conds.filter(c=>c.condition===name);
    if(existing.length){
      existing.forEach(c=>{ window[cfg.stateKey] = window[cfg.stateKey].filter(x=>x.id!==c.id); });
      renderBPPanel(regionId);
      if(typeof renderRating==='function') renderRating();
    } else {
      addBPCondition(regionId, name);
    }
    return;
  }
  const ext = cfg.extremityMap[_bpPinKey] || 'none';
  const existing = conds.find(c=>c.condition===name && c.extremity===ext);
  if(existing){
    removeBPCondition(regionId, existing.id);
  } else {
    // Check for bilateral potential — ask user if this affects both sides
    if(_hasBilateralSides(regionId) && _bpPinKey !== 'both'){
      const oppositeKey = _getOppositeSideKey(regionId, _bpPinKey);
      if(oppositeKey){
        const oppositeExt = cfg.extremityMap[oppositeKey] || 'none';
        const existsOnOther = conds.find(c=>c.condition===name && c.extremity===oppositeExt);
        if(!existsOnOther){
          // Capture state for async callback
          const capturedPinKey = _bpPinKey;
          _showBilateralPrompt(regionId, name, function(both){
            if(both){
              _addBPCondSide(regionId, name, capturedPinKey);
              _addBPCondSide(regionId, name, oppositeKey);
              // Link the bilateral pair
              const updatedConds = window[cfg.stateKey];
              const ext1 = cfg.extremityMap[capturedPinKey] || 'none';
              const ext2 = cfg.extremityMap[oppositeKey] || 'none';
              const c1 = updatedConds.find(c=>c.condition===name && c.extremity===ext1);
              const c2 = updatedConds.find(c=>c.condition===name && c.extremity===ext2);
              if(c1 && c2){
                c1.bilateralPairId = c2.id;
                c2.bilateralPairId = c1.id;
                c1.bilateralLinked = true;
                c2.bilateralLinked = true;
                c1.bilateralSource = true;  // source = side user is evaluating
                c2.bilateralSource = false; // target = auto-synced from source
              }
            } else {
              _addBPCondSide(regionId, name, capturedPinKey);
            }
            renderBPPanel(regionId);
          });
          return;
        }
      }
    }
    addBPCondition(regionId, name);
  }
}

// ── DOMAIN UPDATES ──────────────────────────────────────────────────────────

function updateBPDomain(regionId, condId, domainId, value){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  const conds = window[cfg.stateKey];
  const cond = conds.find(c=>c.id===condId);
  if(!cond) return;
  cond.domains[domainId] = parseInt(value);
  cond.calculatedRating = cfg.calcRating(cond.domains);
  if(cond.manualOverride===null) cond.effectiveRating = cond.calculatedRating;

  // Bilateral sync: source → target auto-syncs; editing target unlinks
  if(cond.bilateralLinked && cond.bilateralPairId){
    const pair = conds.find(c=>c.id===cond.bilateralPairId);
    if(pair && pair.bilateralLinked){
      if(cond.bilateralSource){
        // Source side changed → sync to target
        pair.domains[domainId] = parseInt(value);
        pair.calculatedRating = cfg.calcRating(pair.domains);
        if(pair.manualOverride===null) pair.effectiveRating = pair.calculatedRating;
      } else {
        // Target side was manually edited → unlink both
        cond.bilateralLinked = false; cond.bilateralPairId = null; cond.bilateralSource = false;
        pair.bilateralLinked = false; pair.bilateralPairId = null; pair.bilateralSource = false;
      }
    }
  }

  renderBPPanel(regionId);
  if(typeof renderRating==='function') renderRating();
}

function setBPOverride(regionId, condId, value){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  const conds = window[cfg.stateKey];
  const cond = conds.find(c=>c.id===condId);
  if(!cond) return;
  if(value===''||value===null){
    cond.manualOverride = null;
    cond.effectiveRating = cond.calculatedRating;
  } else {
    cond.manualOverride = parseInt(value);
    cond.effectiveRating = cond.manualOverride;
  }
  // Bilateral sync for overrides
  if(cond.bilateralLinked && cond.bilateralSource && cond.bilateralPairId){
    const pair = conds.find(c=>c.id===cond.bilateralPairId);
    if(pair && pair.bilateralLinked){
      if(value===''||value===null){
        pair.manualOverride = null;
        pair.effectiveRating = pair.calculatedRating;
      } else {
        pair.manualOverride = parseInt(value);
        pair.effectiveRating = pair.manualOverride;
      }
    }
  }
  renderBPPanel(regionId);
  if(typeof renderRating==='function') renderRating();
}

function toggleBPOverride(regionId, condId, checked){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  const conds = window[cfg.stateKey];
  const cond = conds.find(c=>c.id===condId);
  if(!cond) return;
  if(checked){
    cond.manualOverride = cond.calculatedRating;
    cond.effectiveRating = cond.manualOverride;
  } else {
    cond.manualOverride = null;
    cond.effectiveRating = cond.calculatedRating;
  }
  // Bilateral sync for override toggle
  if(cond.bilateralLinked && cond.bilateralSource && cond.bilateralPairId){
    const pair = conds.find(c=>c.id===cond.bilateralPairId);
    if(pair && pair.bilateralLinked){
      if(checked){
        pair.manualOverride = pair.calculatedRating;
        pair.effectiveRating = pair.manualOverride;
      } else {
        pair.manualOverride = null;
        pair.effectiveRating = pair.calculatedRating;
      }
    }
  }
  renderBPPanel(regionId);
  if(typeof renderRating==='function') renderRating();
}

// ── SEARCH ──────────────────────────────────────────────────────────────────

function onBPSearch(regionId, val){
  _bpSearch = val.toLowerCase();
  renderBPCondList(regionId);
}

function renderBPCondList(regionId){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  const list = document.getElementById('bp-cond-list-'+regionId);
  if(!list) return;
  const conditions = VA_AREA_CONDITIONS[cfg.conditions] || [];
  const conds = window[cfg.stateKey];
  // Side-aware checked state
  const selected = new Set();
  if(_bpPinKey === 'both'){
    const sides = Object.entries(cfg.sideKeys);
    const lk = sides.find(([k])=>k.toLowerCase().startsWith('left'));
    const rk = sides.find(([k])=>k.toLowerCase().startsWith('right'));
    if(lk && rk){
      const le = cfg.extremityMap[lk[0]]||'none', re = cfg.extremityMap[rk[0]]||'none';
      conditions.forEach(n=>{ if(conds.some(c=>c.condition===n&&c.extremity===le)&&conds.some(c=>c.condition===n&&c.extremity===re)) selected.add(n); });
    } else { conds.forEach(c=>selected.add(c.condition)); }
  } else {
    const ext = cfg.extremityMap[_bpPinKey]||'none';
    conds.filter(c=>c.extremity===ext).forEach(c=>selected.add(c.condition));
  }
  const filtered = conditions.filter(name => {
    if(!_bpSearch) return true;
    const examples = (typeof PHYS_EXAMPLES !== 'undefined' && PHYS_EXAMPLES[name]) || '';
    return name.toLowerCase().includes(_bpSearch) || examples.toLowerCase().includes(_bpSearch);
  });
  let h = '';
  filtered.forEach(name => {
    const checked = selected.has(name);
    const cond = window[cfg.stateKey].find(c=>c.condition===name);
    const badge = cond ? '<span class="mh-cond-badge mh-rate-'+cond.effectiveRating+'">'+cond.effectiveRating+'%</span>' : '';
    const examples = (typeof PHYS_EXAMPLES !== 'undefined' && PHYS_EXAMPLES[name]) || '';
    const exHtml = examples ? '<span class="mh-cond-examples">e.g. '+examples+'</span>' : '';
    const escaped = name.replace(/'/g,"\\'");
    h += '<div class="mh-cond-item'+(checked?' selected':'')+'" onclick="toggleBPCondition(\''+regionId+'\',\''+escaped+'\')">' +
      '<input type="checkbox" '+(checked?'checked':'')+' onclick="event.stopPropagation();toggleBPCondition(\''+regionId+'\',\''+escaped+'\')">' +
      '<span class="mh-cond-label">'+name+exHtml+'</span>' +
      badge +
    '</div>';
  });
  if(!filtered.length) h = '<div style="padding:14px;color:var(--muted);font-size:12px;text-align:center;">No conditions match your search.</div>';
  list.innerHTML = h;
}

// ── RENDER PANEL ────────────────────────────────────────────────────────────

function renderBPPanel(regionId){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return;
  const panel = document.getElementById(cfg.panelId);
  if(!panel) return;

  const conds = window[cfg.stateKey];
  let h = '';

  // Header
  h += '<div class="mh-header">' +
    '<span class="mh-title">'+cfg.title+'</span>' +
    '<button class="mh-back" onclick="closeBPPanel(\''+regionId+'\')">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>' +
      ' Back to Map' +
    '</button>' +
  '</div>';

  h += '<div class="mh-body">';

  // Info banner
  h += '<div class="mh-info"><strong>'+cfg.title+':</strong> '+cfg.note+' <span class="tip" data-tip="Select your conditions below, then answer the questions for each one. The app will estimate a VA rating based on your answers. You can also manually override any rating if you already know your actual VA percentage.">?</span></div>';

  // Side tabs (bilateral body parts)
  const _sideEntries = Object.entries(cfg.sideKeys);
  const _hasLeft = _sideEntries.some(([k])=>k.toLowerCase().startsWith('left'));
  const _hasRight = _sideEntries.some(([k])=>k.toLowerCase().startsWith('right'));
  const _showSideTabs = _sideEntries.length > 1 && Object.keys(cfg.extremityMap).length > 0 && _hasLeft && _hasRight;
  if(_showSideTabs){
    h += '<div class="bp-side-tabs">';
    _sideEntries.forEach(([key, label]) => {
      h += '<button class="bp-side-tab'+(_bpPinKey===key?' active':'')+'" onclick="switchBPSide(\''+regionId+'\',\''+key+'\')">'+label+'</button>';
    });
    // "Both Sides" tab removed — bilateral is now handled per-condition via the "Do you experience this in both?" prompt
    h += '</div>';
  } else if(_sideEntries.length > 1){
    // Non-bilateral multi-option (e.g. back: Upper/Mid/Lower)
    h += '<div class="bp-side-tabs">';
    _sideEntries.forEach(([key, label]) => {
      h += '<button class="bp-side-tab'+(_bpPinKey===key?' active':'')+'" onclick="switchBPSide(\''+regionId+'\',\''+key+'\')">'+label+'</button>';
    });
    h += '</div>';
  }

  // Search
  h += '<div class="mh-search">' +
    '<svg class="mh-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
    '<input type="text" placeholder="Search conditions..." value="'+_bpSearch+'" oninput="onBPSearch(\''+regionId+'\',this.value)">' +
  '</div>';

  // Condition checklist
  h += '<div class="mh-cond-list" id="bp-cond-list-'+regionId+'"></div>';

  // Evaluations
  if(conds.length){
    h += '<div class="mh-section-title">Evaluations ('+conds.length+' condition'+(conds.length>1?'s':'')+')</div>';

    conds.forEach(cond => {
      const profile = cfg.profiles()[cond.profile] || cfg.profiles().generic;
      const overrideActive = cond.manualOverride !== null;
      const extLabel = cond.sideLabel ? ' ('+cond.sideLabel+')' : (cond.extremity !== 'none' ? ' ['+cond.extremity+']' : '');
      const bilateralBadge = cond.bilateralLinked ?
        '<span class="bilateral-badge">Bilateral &#128279;</span>' +
        '<button class="bilateral-unlink" onclick="event.stopPropagation();unlinkBilateral(\''+regionId+'\','+cond.id+')" title="Unlink — evaluate sides independently">Unlink</button>'
        : '';

      h += '<div class="mh-eval-card">';

      // Card header
      h += '<div class="mh-eval-header" onclick="document.getElementById(\'bp-eval-'+cond.id+'\').classList.toggle(\'collapsed\')">' +
        '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">' +
          '<span class="mh-eval-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+cond.condition+extLabel+'</span>' +
          '<span style="font-size:9px;font-weight:600;font-family:var(--fh);color:var(--muted);background:var(--bg);border:1px solid var(--border);padding:1px 6px;border-radius:3px;">'+profile.label.split('(')[0].trim()+'</span>' +
          bilateralBadge +
          (overrideActive ? '<span class="mh-override-tag">Manual</span>' : '') +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span class="mh-eval-rating mh-rate-'+cond.effectiveRating+'">'+cond.effectiveRating+'%</span>' +
          '<button class="mh-remove" onclick="event.stopPropagation();removeBPCondition(\''+regionId+'\','+cond.id+')" title="Remove">&times;</button>' +
        '</div>' +
      '</div>';

      // Card body
      h += '<div class="mh-eval-body" id="bp-eval-'+cond.id+'">';

      if(profile.note){
        h += '<div style="padding:8px 12px;margin-bottom:10px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;font-size:11px;color:#92400e;">'+profile.note+'</div>';
      }

      // Service info fields
      h += _condInfoHTML(regionId, cond);

      // Domains
      profile.domains.forEach(domain => {
        const currentValue = cond.domains[domain.id] || 0;
        h += '<div class="mh-domain">' +
          '<div class="mh-domain-header">' +
            '<div class="mh-domain-label">'+domain.label+'</div>' +
            '<div class="mh-domain-desc">'+domain.description+'</div>' +
          '</div>';

        h += '<div class="hd-levels">';
        domain.levels.forEach(lv => {
          const isActive = currentValue === lv.value;
          h += '<button class="hd-level-btn'+(isActive?' hd-active':'')+'"' +
            ' onclick="updateBPDomain(\''+regionId+'\','+cond.id+',\''+domain.id+'\','+lv.value+')"' +
            ' title="'+(lv.description||'').replace(/"/g,'&quot;')+'">' +
            '<span class="hd-level-val">'+lv.value+'%</span>' +
            '<span class="hd-level-label">'+lv.label+'</span>' +
          '</button>';
        });
        h += '</div>';

        const selectedLevel = domain.levels.find(lv=>lv.value===currentValue);
        if(selectedLevel && selectedLevel.description && currentValue>0){
          h += '<div class="mh-example">'+selectedLevel.description+'</div>';
        }

        h += '</div>';
      });

      // Calculated rating
      h += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(10,35,87,.04);border-radius:6px;">' +
        '<div>' +
          '<div style="font-size:11px;font-weight:700;color:var(--navy);font-family:var(--fh);text-transform:uppercase;letter-spacing:.5px;">Calculated Rating <span class="tip" data-tip="This is the app\'s estimate based on your answers. The actual VA rating may differ — a VA examiner will review your medical evidence and may rate higher or lower. Use this as a guide, not a guarantee.">?</span></div>' +
          '<div style="font-size:24px;font-weight:800;font-family:var(--fm);color:var(--navy);">'+cond.calculatedRating+'%</div>' +
        '</div>' +
      '</div>';

      // Override
      h += '<div class="mh-override">' +
        '<label><input type="checkbox" '+(overrideActive?'checked':'')+' onchange="toggleBPOverride(\''+regionId+'\','+cond.id+',this.checked)"> Manual Override <span class="tip" data-tip="Use this if you already know your VA rating for this condition (from a previous decision letter) or if you want to enter a specific number instead of the calculated estimate.">?</span></label>';
      if(overrideActive){
        h += '<select onchange="setBPOverride(\''+regionId+'\','+cond.id+',this.value)">';
        [0,10,20,30,40,50,60,70,80,90,100].forEach(v => {
          h += '<option value="'+v+'"'+(v===cond.manualOverride?' selected':'')+'>'+v+'%</option>';
        });
        h += '</select>';
      }
      h += '</div>';

      h += '</div>'; // eval-body
      h += '</div>'; // eval-card
    });

    // Summary
    h += '<div class="mh-combined" style="background:linear-gradient(135deg,#0a2357 0%,#1d4ed8 100%);">' +
      '<div class="mh-combined-label">'+cfg.title+' Ratings</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px;">';
    conds.forEach(c => {
      h += '<div style="background:rgba(255,255,255,.15);border-radius:6px;padding:6px 12px;text-align:center;">' +
        '<div style="font-size:10px;color:rgba(255,255,255,.7);white-space:nowrap;max-width:120px;overflow:hidden;text-overflow:ellipsis;">'+c.condition+'</div>' +
        '<div style="font-size:20px;font-weight:800;font-family:var(--fm);color:#fff;">'+c.effectiveRating+'%</div>' +
      '</div>';
    });
    h += '</div>' +
      '<div class="mh-combined-note" style="margin-top:8px;">Each condition contributes separately to your combined VA rating <span class="tip" data-tip="Unlike mental health (which uses one rating for everything), physical conditions each get their own rating. They\'re then combined using VA math — not simply added together." style="background:rgba(255,255,255,.25);color:#fff;">?</span></div>' +
    '</div>';

  } else {
    h += '<div class="mh-empty">' +
      '<div style="font-size:28px;margin-bottom:8px;">&#128161;</div>' +
      '<strong>Select conditions above to begin evaluation</strong><br>' +
      'Check one or more conditions, then rate each using VA diagnostic criteria.' +
    '</div>';
  }

  // Place Pin / Done
  h += '<div class="mh-done-wrap">';
  if(conds.length){
    h += '<button class="mh-done-btn" onclick="placeBPPin(\''+regionId+'\')">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z"/></svg>' +
      ' Place Pin on Map' +
    '</button>' +
    '<div style="font-size:11px;color:var(--muted);text-align:center;margin-top:6px;">Click to return to the map and place a pin for this condition.</div>';
  }
  h += '<button class="mh-back-btn" onclick="closeBPPanel(\''+regionId+'\')" style="margin-top:8px;">Back to Map (no pin)</button>';
  h += '</div>';

  h += '</div>'; // mh-body
  panel.innerHTML = h;
  setTimeout(()=>renderBPCondList(regionId), 0);
}
// ── SEVERITY & SECONDARY — UNIFIED CLAIM MAP ──

// Track which eval panels are expanded
let _sevOpen = {};

// Per-claim secondary add state: { claimId: { area, side } }
let _secAddState = {};

// ── COMMON SECONDARY CONDITIONS MAP ──────────────────────────────────────────
// Maps primary conditions → most commonly filed secondary claims (official VA names)
// Used to show "Veterans commonly also claim these" suggestions

const COMMON_SECONDARIES = {
  // ── HEARING ──
  'Tinnitus, recurrent': [
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Generalized anxiety disorder', dc:'DC 9400'},
    {name:'Hearing impairment (hearing loss)', dc:'DC 6100'},
  ],
  'Hearing impairment (hearing loss)': [
    {name:'Tinnitus, recurrent', dc:'DC 6260'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Generalized anxiety disorder', dc:'DC 9400'},
  ],

  // ── HEAD & FACE ──
  'Migraine headaches': [
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Generalized anxiety disorder', dc:'DC 9400'},
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Cervical strain / sprain', dc:'DC 5237'},
    {name:'Sleep apnea', dc:'DC 6847'},
  ],
  'Residuals of Traumatic Brain Injury (TBI)': [
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Posttraumatic stress disorder', dc:'DC 9411'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Cognitive disorder', dc:'DC 8045'},
    {name:'Vertigo / Dizziness', dc:'DC 6204'},
    {name:'Tinnitus, recurrent', dc:'DC 6260'},
    {name:'Vision impairment', dc:'DC 6066'},
  ],
  'Temporomandibular disorder (TMD)': [
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Tinnitus, recurrent', dc:'DC 6260'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'Sinusitis, chronic': [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Rhinitis, allergic or vasomotor', dc:'DC 6522'},
  ],
  'Rhinitis, allergic or vasomotor': [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Sinusitis, chronic', dc:'DC 6510'},
    {name:'Migraine headaches', dc:'DC 8100'},
  ],

  // ── MENTAL HEALTH ──
  'Posttraumatic stress disorder': [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Hypertension', dc:'DC 7101'},
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Temporomandibular disorder (TMD)', dc:'DC 9905'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
    {name:'Irritable bowel syndrome (IBS)', dc:'DC 7319'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'Major depressive disorder': [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Chronic fatigue syndrome', dc:'DC 6354'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
    {name:'Fibromyalgia', dc:'DC 5025'},
    {name:'GERD / acid reflux', dc:'DC 7346'},
  ],
  'Generalized anxiety disorder': [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Hypertension', dc:'DC 7101'},
    {name:'Irritable bowel syndrome (IBS)', dc:'DC 7319'},
    {name:'Temporomandibular disorder (TMD)', dc:'DC 9905'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
  ],
  'Persistent depressive disorder (dysthymia)': [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Chronic fatigue syndrome', dc:'DC 6354'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
  ],
  'Panic disorder and/or agoraphobia': [
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Hypertension', dc:'DC 7101'},
    {name:'Irritable bowel syndrome (IBS)', dc:'DC 7319'},
  ],
  'Bipolar disorder': [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Hypertension', dc:'DC 7101'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
  ],

  // ── KNEE ──
  'Knee osteoarthritis': [
    {name:'Hip osteoarthritis', dc:'DC 5003'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'ACL tear / reconstruction': [
    {name:'Meniscus tear', dc:'DC 5258'},
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
    {name:'Hip osteoarthritis', dc:'DC 5003'},
  ],
  'Meniscus tear': [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Knee instability', dc:'DC 5257'},
    {name:'Hip osteoarthritis', dc:'DC 5003'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
  ],
  'Knee instability': [
    {name:'Meniscus tear', dc:'DC 5258'},
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Hip osteoarthritis', dc:'DC 5003'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
  ],
  'Patellofemoral syndrome': [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Hip osteoarthritis', dc:'DC 5003'},
  ],
  'Patellar tendinitis': [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Hip osteoarthritis', dc:'DC 5003'},
  ],

  // ── BACK & SPINE ──
  'Lumbar strain / sprain': [
    {name:'Lumbar radiculopathy / sciatica', dc:'DC 8520'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
    {name:'Bladder condition', dc:'DC 7542'},
    {name:'Hip osteoarthritis', dc:'DC 5252'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'Lumbar disc herniation': [
    {name:'Lumbar radiculopathy / sciatica', dc:'DC 8520'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
    {name:'Bladder condition', dc:'DC 7542'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'Lumbar radiculopathy / sciatica': [
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
    {name:'Bladder condition', dc:'DC 7542'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'Degenerative disc disease (lumbar)': [
    {name:'Lumbar radiculopathy / sciatica', dc:'DC 8520'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
    {name:'Hip osteoarthritis', dc:'DC 5252'},
  ],
  'Spinal stenosis (lumbar)': [
    {name:'Lumbar radiculopathy / sciatica', dc:'DC 8520'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'Bladder condition', dc:'DC 7542'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
  ],
  'Thoracic strain': [
    {name:'Cervical strain / sprain', dc:'DC 5237'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],

  // ── SHOULDER ──
  'Rotator cuff tear / tendinopathy': [
    {name:'Cervical strain / sprain', dc:'DC 5237'},
    {name:'Peripheral neuropathy', dc:'DC 8510'},
    {name:'Shoulder arthritis', dc:'DC 5003'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'Shoulder impingement': [
    {name:'Cervical strain / sprain', dc:'DC 5237'},
    {name:'Shoulder arthritis', dc:'DC 5003'},
    {name:'Peripheral neuropathy', dc:'DC 8510'},
  ],
  'Frozen shoulder (adhesive capsulitis)': [
    {name:'Cervical strain / sprain', dc:'DC 5237'},
    {name:'Shoulder arthritis', dc:'DC 5003'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'Shoulder instability / dislocation': [
    {name:'Labral tear (SLAP)', dc:'DC 5203'},
    {name:'Shoulder arthritis', dc:'DC 5003'},
    {name:'Cervical strain / sprain', dc:'DC 5237'},
  ],
  'Shoulder arthritis': [
    {name:'Cervical strain / sprain', dc:'DC 5237'},
    {name:'Peripheral neuropathy', dc:'DC 8510'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],

  // ── NECK ──
  'Cervical strain / sprain': [
    {name:'Cervical radiculopathy', dc:'DC 8510'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Shoulder impingement', dc:'DC 5201'},
    {name:'Peripheral neuropathy', dc:'DC 8515'},
    {name:'Thoracic strain', dc:'DC 5237'},
  ],
  'Cervical radiculopathy': [
    {name:'Carpal tunnel syndrome', dc:'DC 8515'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Shoulder impingement', dc:'DC 5201'},
    {name:'Cervical disc disease (DDD)', dc:'DC 5242'},
  ],
  'Cervical disc disease (DDD)': [
    {name:'Cervical radiculopathy', dc:'DC 8510'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Peripheral neuropathy', dc:'DC 8515'},
    {name:'Shoulder impingement', dc:'DC 5201'},
  ],

  // ── ANKLE & FOOT ──
  'Ankle sprain (chronic)': [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Hip osteoarthritis', dc:'DC 5252'},
  ],
  'Ankle instability': [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Hip osteoarthritis', dc:'DC 5252'},
  ],
  'Plantar fasciitis': [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Hip osteoarthritis', dc:'DC 5252'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
    {name:'Ankle sprain (chronic)', dc:'DC 5271'},
    {name:'Achilles tendinitis / rupture', dc:'DC 5024'},
  ],
  'Flat feet (pes planus)': [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Hip osteoarthritis', dc:'DC 5252'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Achilles tendinitis / rupture', dc:'DC 5024'},
  ],
  'Achilles tendinitis / rupture': [
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Ankle instability', dc:'DC 5271'},
  ],

  // ── HIP ──
  'Hip osteoarthritis': [
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Lumbar radiculopathy / sciatica', dc:'DC 8520'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'Hip labral tear': [
    {name:'Hip osteoarthritis', dc:'DC 5003'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
    {name:'Knee osteoarthritis', dc:'DC 5003'},
  ],
  'Hip bursitis (trochanteric)': [
    {name:'Hip osteoarthritis', dc:'DC 5003'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
    {name:'Knee osteoarthritis', dc:'DC 5003'},
  ],

  // ── ELBOW / FOREARM ──
  'Lateral epicondylitis (tennis elbow)': [
    {name:'Carpal tunnel syndrome', dc:'DC 8515'},
    {name:'Shoulder impingement', dc:'DC 5201'},
    {name:'Cervical strain / sprain', dc:'DC 5237'},
  ],
  'Cubital tunnel syndrome': [
    {name:'Carpal tunnel syndrome', dc:'DC 8515'},
    {name:'Cervical radiculopathy', dc:'DC 8510'},
    {name:'Peripheral neuropathy', dc:'DC 8516'},
  ],

  // ── WRIST / HAND ──
  'Carpal tunnel syndrome': [
    {name:'Cervical strain / sprain', dc:'DC 5237'},
    {name:'Cubital tunnel syndrome', dc:'DC 8516'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Wrist arthritis', dc:'DC 5215'},
  ],
  'De Quervain\'s tenosynovitis': [
    {name:'Carpal tunnel syndrome', dc:'DC 8515'},
    {name:'Wrist arthritis', dc:'DC 5215'},
  ],
  'Trigger finger': [
    {name:'Carpal tunnel syndrome', dc:'DC 8515'},
    {name:'Hand arthritis', dc:'DC 5003'},
  ],

  // ── CHEST / LUNGS ──
  'Sleep apnea': [
    {name:'Hypertension', dc:'DC 7101'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Chronic fatigue syndrome', dc:'DC 6354'},
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
  ],
  'Asthma': [
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Rhinitis, allergic or vasomotor', dc:'DC 6522'},
    {name:'Sinusitis, chronic', dc:'DC 6510'},
    {name:'Sleep apnea', dc:'DC 6847'},
  ],
  'COPD / chronic bronchitis': [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Hypertension', dc:'DC 7101'},
  ],

  // ── ABDOMEN / GI ──
  'GERD / acid reflux': [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Asthma', dc:'DC 6602'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Irritable bowel syndrome (IBS)', dc:'DC 7319'},
  ],
  'Irritable bowel syndrome (IBS)': [
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Generalized anxiety disorder', dc:'DC 9400'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Chronic fatigue syndrome', dc:'DC 6354'},
  ],
  'Hiatal hernia': [
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Asthma', dc:'DC 6602'},
  ],

  // ── SYSTEMIC ──
  'Diabetes mellitus, Type 2': [
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
    {name:'Hypertension', dc:'DC 7101'},
    {name:'Diabetic retinopathy', dc:'DC 6006'},
    {name:'Kidney stones', dc:'DC 7541'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'Diabetes mellitus': [
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
    {name:'Hypertension', dc:'DC 7101'},
    {name:'Diabetic retinopathy', dc:'DC 6006'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  'Hypertension': [
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
    {name:'Vision impairment', dc:'DC 6066'},
  ],
  'Dermatitis or eczema': [
    {name:'Scar(s), unstable or painful', dc:'DC 7804'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Generalized anxiety disorder', dc:'DC 9400'},
    {name:'Sleep apnea', dc:'DC 6847'},
  ],
  'Fibromyalgia': [
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Chronic fatigue syndrome', dc:'DC 6354'},
    {name:'Irritable bowel syndrome (IBS)', dc:'DC 7319'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Sleep apnea', dc:'DC 6847'},
  ],
  'Chronic fatigue syndrome': [
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Fibromyalgia', dc:'DC 5025'},
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Migraine headaches', dc:'DC 8100'},
  ],
  'Erectile dysfunction': [
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Generalized anxiety disorder', dc:'DC 9400'},
  ],
  'Peripheral neuropathy': [
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Knee osteoarthritis', dc:'DC 5003'},
  ],
  'Psoriasis': [
    {name:'Psoriatic arthritis', dc:'DC 5009'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Generalized anxiety disorder', dc:'DC 9400'},
  ],
  'Rheumatoid arthritis': [
    {name:'Carpal tunnel syndrome', dc:'DC 8515'},
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Chronic fatigue syndrome', dc:'DC 6354'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
  ],

  // ── LEG ──
  'Shin splints (MTSS)': [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Flat feet (pes planus)', dc:'DC 5276'},
  ],
  'Stress fracture (tibia / fibula)': [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
  ],
};

// ── CATEGORY DEFAULTS (fallback when no exact match) ──
const _CATEGORY_SECONDARIES = {
  knee: [
    {name:'Hip osteoarthritis', dc:'DC 5003'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
  ],
  back: [
    {name:'Lumbar radiculopathy / sciatica', dc:'DC 8520'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
    {name:'Hip osteoarthritis', dc:'DC 5252'},
  ],
  shoulder: [
    {name:'Cervical strain / sprain', dc:'DC 5237'},
    {name:'Peripheral neuropathy', dc:'DC 8510'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  neck: [
    {name:'Cervical radiculopathy', dc:'DC 8510'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Shoulder impingement', dc:'DC 5201'},
  ],
  hip: [
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
  ],
  ankle_foot: [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Hip osteoarthritis', dc:'DC 5252'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
  ],
  elbow: [
    {name:'Carpal tunnel syndrome', dc:'DC 8515'},
    {name:'Shoulder impingement', dc:'DC 5201'},
    {name:'Cervical strain / sprain', dc:'DC 5237'},
  ],
  wrist_hand: [
    {name:'Cervical strain / sprain', dc:'DC 5237'},
    {name:'Carpal tunnel syndrome', dc:'DC 8515'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  leg: [
    {name:'Knee osteoarthritis', dc:'DC 5003'},
    {name:'Plantar fasciitis', dc:'DC 5276'},
    {name:'Lumbar strain / sprain', dc:'DC 5237'},
  ],
  chest: [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  abdomen: [
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Irritable bowel syndrome (IBS)', dc:'DC 7319'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  head: [
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'Tinnitus, recurrent', dc:'DC 6260'},
    {name:'Major depressive disorder', dc:'DC 9434'},
  ],
  mental: [
    {name:'Sleep apnea', dc:'DC 6847'},
    {name:'Migraine headaches', dc:'DC 8100'},
    {name:'GERD / acid reflux', dc:'DC 7346'},
    {name:'Hypertension', dc:'DC 7101'},
    {name:'Erectile dysfunction', dc:'DC 7522'},
  ],
  systemic: [
    {name:'Major depressive disorder', dc:'DC 9434'},
    {name:'Peripheral neuropathy', dc:'DC 8520'},
    {name:'Chronic fatigue syndrome', dc:'DC 6354'},
  ],
};

// Look up common secondaries for a condition, with category fallback
function getCommonSecondaries(conditionName, groupKey){
  // 1. Exact match
  if(COMMON_SECONDARIES[conditionName]) return COMMON_SECONDARIES[conditionName];
  // 2. Case-insensitive match
  const lower = conditionName.toLowerCase();
  const exactKey = Object.keys(COMMON_SECONDARIES).find(k => k.toLowerCase() === lower);
  if(exactKey) return COMMON_SECONDARIES[exactKey];
  // 3. Partial keyword match (e.g. "Other knee condition" → knee category)
  const partialKey = Object.keys(COMMON_SECONDARIES).find(k => {
    const kl = k.toLowerCase();
    return lower.includes(kl) || kl.includes(lower);
  });
  if(partialKey) return COMMON_SECONDARIES[partialKey];
  // 4. Category fallback
  if(groupKey && _CATEGORY_SECONDARIES[groupKey]) return _CATEGORY_SECONDARIES[groupKey];
  return null;
}

// ── SECONDARY PROFILE DETECTION ──
// Determines the right questionnaire for any secondary condition name
function _getSecProfile(name){
  const lower = name.toLowerCase();
  // Check if it's a mental health condition
  const mhNames = new Set((typeof VA_MENTAL !== 'undefined' ? VA_MENTAL : []).map(n=>n.toLowerCase()));
  const mhSecNames = new Set((typeof MENTAL_SECONDARIES !== 'undefined' ? MENTAL_SECONDARIES : []).map(n=>n.toLowerCase()));
  if(mhNames.has(lower) || mhSecNames.has(lower)){
    return { type: 'mh' };
  }
  // Check systemic profiles (fibro, CFS, diabetes, skin, etc.)
  if(typeof SYSTEMIC_CONDITION_PROFILE !== 'undefined' && SYSTEMIC_CONDITION_PROFILE[name]){
    const key = SYSTEMIC_CONDITION_PROFILE[name];
    const profile = typeof SYSTEMIC_PROFILES_ALL !== 'undefined' ? SYSTEMIC_PROFILES_ALL[key] : null;
    if(profile) return { type: 'systemic', profile: profile, key: key };
  }
  // Check head profiles
  if(typeof HEAD_CONDITION_PROFILE !== 'undefined' && HEAD_CONDITION_PROFILE[name]){
    const key = HEAD_CONDITION_PROFILE[name];
    const profile = typeof HEAD_PROFILES !== 'undefined' ? HEAD_PROFILES[key] : null;
    if(profile) return { type: 'head', profile: profile, key: key };
  }
  // Default to physical
  return { type: 'physical' };
}

function _initDomainsForProfile(secProfile){
  const domains = {};
  if(secProfile.type === 'mh'){
    MH_DOMAINS.forEach(d => { domains[d.id] = { level: 'none', frequency: 'less25' }; });
  } else if(secProfile.type === 'systemic' || secProfile.type === 'head'){
    secProfile.profile.domains.forEach(d => { domains[d.id] = 0; });
  } else {
    PHYSICAL_PROFILE.domains.forEach(d => { domains[d.id] = 0; });
  }
  return domains;
}

function _calcRatingForProfile(secProfile, domains){
  if(secProfile.type === 'mh'){
    return typeof calculateMHRating === 'function' ? calculateMHRating(domains) : 0;
  }
  // All others use max value
  let m = 0;
  Object.values(domains).forEach(v => { if(typeof v === 'number' && v > m) m = v; });
  return m;
}

function onSecAreaChange(claimId, area){
  if(!_secAddState[claimId]) _secAddState[claimId] = {};
  _secAddState[claimId].area = area;
  _secAddState[claimId].side = '';
  renderSecondary();
}

function onSecSideChange(claimId, side){
  if(!_secAddState[claimId]) _secAddState[claimId] = {};
  _secAddState[claimId].side = side;
  renderSecondary();
}

function addSecFromDropdown(claimId, name){
  if(!name) return;
  if(!_secAddState[claimId]) _secAddState[claimId] = {};
  _secAddState[claimId].pendingSec = name;
  // Detect the right profile and init domains accordingly
  const secProfile = _getSecProfile(name);
  _secAddState[claimId].pendingSecProfile = secProfile;
  _secAddState[claimId].pendingDomains = _initDomainsForProfile(secProfile);
  renderSecondary();
}

function updatePendingSecDomain(claimId, domainId, value){
  if(!_secAddState[claimId]) return;
  const secProfile = _secAddState[claimId].pendingSecProfile;
  if(secProfile && secProfile.type === 'mh'){
    // MH domains use {level, frequency} format
    if(!_secAddState[claimId].pendingDomains[domainId]) _secAddState[claimId].pendingDomains[domainId] = {level:'none',frequency:'less25'};
    _secAddState[claimId].pendingDomains[domainId].level = value;
    if(value === 'none') _secAddState[claimId].pendingDomains[domainId].frequency = 'less25';
  } else {
    _secAddState[claimId].pendingDomains[domainId] = parseInt(value);
  }
  renderSecondary();
}

function updatePendingSecFreq(claimId, domainId, freq){
  if(!_secAddState[claimId]) return;
  if(!_secAddState[claimId].pendingDomains[domainId]) return;
  _secAddState[claimId].pendingDomains[domainId].frequency = freq;
  renderSecondary();
}

function submitPendingSec(claimId){
  const st = _secAddState[claimId];
  if(!st || !st.pendingSec) return;
  const ref = getClaimRef(claimId);
  if(!ref) return;
  if(!ref.secondaries) ref.secondaries = [];
  if(!ref.secondaryEvals) ref.secondaryEvals = {};
  if(!ref.secondaryRatings) ref.secondaryRatings = {};
  if(!ref.secondaryExtremities) ref.secondaryExtremities = {};

  const name = st.pendingSec;
  const secProfile = st.pendingSecProfile || _getSecProfile(name);
  const rating = _calcRatingForProfile(secProfile, st.pendingDomains);
  const area = st.area || '';
  const side = st.side || '';

  // Bilateral: create TWO entries (left + right) with proper extremity codes
  if(side === 'both' && area && typeof BP_REGISTRY !== 'undefined' && BP_REGISTRY[area]){
    const cfg = BP_REGISTRY[area];
    const sides = Object.entries(cfg.sideKeys);
    const leftKey = sides.find(([k])=>k.toLowerCase().startsWith('left'));
    const rightKey = sides.find(([k])=>k.toLowerCase().startsWith('right'));
    if(leftKey && rightKey){
      const leftName = name + ' (Left)';
      const rightName = name + ' (Right)';
      // Add left entry
      if(!ref.secondaries.includes(leftName)) ref.secondaries.push(leftName);
      ref.secondaryEvals[leftName] = { domains: {...st.pendingDomains}, rating: rating };
      ref.secondaryRatings[leftName] = rating;
      ref.secondaryExtremities[leftName] = cfg.extremityMap[leftKey[0]] || 'none';
      // Add right entry
      if(!ref.secondaries.includes(rightName)) ref.secondaries.push(rightName);
      ref.secondaryEvals[rightName] = { domains: {...st.pendingDomains}, rating: rating };
      ref.secondaryRatings[rightName] = rating;
      ref.secondaryExtremities[rightName] = cfg.extremityMap[rightKey[0]] || 'none';
    }
  } else {
    // Single side or non-bilateral area
    if(!ref.secondaries.includes(name)) ref.secondaries.push(name);
    ref.secondaryEvals[name] = { domains: {...st.pendingDomains}, rating: rating };
    ref.secondaryRatings[name] = rating;
    // Store extremity if a specific side was selected
    if(side && area && typeof BP_REGISTRY !== 'undefined' && BP_REGISTRY[area]){
      ref.secondaryExtremities[name] = BP_REGISTRY[area].extremityMap[side] || 'none';
    }
  }

  // Clear pending state
  delete st.pendingSec;
  delete st.pendingDomains;
  renderSecondary();
  if(typeof renderRating === 'function') renderRating();
}

function cancelPendingSec(claimId){
  if(_secAddState[claimId]){
    delete _secAddState[claimId].pendingSec;
    delete _secAddState[claimId].pendingDomains;
  }
  renderSecondary();
}

function deleteClaimFromSev(claimId){
  const type = getClaimType(claimId);
  const rawId = parseFloat(claimId.split('-').slice(1).join('-'));

  if(type === 'inj'){
    const inj = injuries.find(i=>i.id===rawId);
    const name = inj ? inj.label : 'this injury';
    if(!confirm('Delete "'+name+'"?')) return;
    injuries = injuries.filter(i=>i.id!==rawId);
    removePin(rawId);
  } else if(type === 'mh'){
    const c = (window._mentalHealthConditions||[]).find(c=>c.id===rawId);
    if(!confirm('Delete "' + (c?c.condition:'this condition') + '"?')) return;
    window._mentalHealthConditions = (window._mentalHealthConditions||[]).filter(c=>c.id!==rawId);
  } else if(type === 'hd'){
    const c = (window._headConditions||[]).find(c=>c.id===rawId);
    if(!confirm('Delete "' + (c?c.condition:'this condition') + '"?')) return;
    window._headConditions = (window._headConditions||[]).filter(c=>c.id!==rawId);
  } else if(type === 'bp'){
    if(typeof BP_REGISTRY !== 'undefined'){
      for(const cfg of Object.values(BP_REGISTRY)){
        const arr = window[cfg.stateKey] || [];
        const found = arr.find(c=>c.id===rawId);
        if(found){
          if(!confirm('Delete "' + found.condition + '"?')) return;
          window[cfg.stateKey] = arr.filter(c=>c.id!==rawId);
          break;
        }
      }
    }
  }
  if(typeof updateBadges === 'function') updateBadges();
  if(typeof updateCount === 'function') updateCount();
  if(typeof renderTimeline === 'function') renderTimeline();
  renderSecondary();
  if(typeof renderRating === 'function') renderRating();
}

function renderSecondaryAddDropdowns(claimId, group){
  const st = _secAddState[claimId] || {};
  const area = st.area || '';
  const side = st.side || '';
  const ref = getClaimRef(claimId);
  const secs = ref?.secondaries || [];
  const condName = ref?.condition || ref?.label || '';

  // If there's a pending secondary being rated, show the questionnaire instead
  if(st.pendingSec){
    return renderPendingSecEval(claimId, st);
  }

  let h = '';

  // ── "Veterans commonly also claim" suggestions ──
  const suggestions = getCommonSecondaries(condName, group);
  if(suggestions && suggestions.length){
    const available = suggestions.filter(s => !secs.includes(s.name));
    if(available.length){
      h += '<div class="cr-suggest">';
      h += '<div class="cr-suggest-title">Veterans commonly also claim with ' +
        '<strong>' + condName + '</strong>:</div>';
      h += '<div class="cr-suggest-chips">';
      available.forEach(s => {
        const escaped = s.name.replace(/'/g,"\\'").replace(/"/g,'&quot;');
        h += '<button class="cr-suggest-chip" onclick="addSecFromDropdown(\''+claimId+'\',\''+escaped+'\')" title="'+s.dc+'">' +
          '<span class="cr-suggest-plus">+</span> ' + s.name +
          '<span class="cr-suggest-dc">' + s.dc + '</span>' +
        '</button>';
      });
      h += '</div></div>';
    }
  }

  // Body Part dropdown
  h += '<div class="cr-add-row" style="margin-top:6px;">';
  h += '<label class="cr-add-lbl">Body Part</label>';
  h += '<select class="cr-add-select-wide" onchange="onSecAreaChange(\''+claimId+'\',this.value)">';
  h += '<option value="">— Select body part —</option>';
  h += '<option value="mental"' + (area==='mental'?' selected':'') + '>Mental Health</option>';
  h += '<option value="head"' + (area==='head'?' selected':'') + '>Head & Face</option>';
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.entries(BP_REGISTRY).forEach(([id, cfg]) => {
      h += '<option value="'+id+'"' + (area===id?' selected':'') + '>'+cfg.title.replace(' Evaluation','')+'</option>';
    });
  }
  h += '</select></div>';

  // Side dropdown (bilateral BP parts)
  if(area && area !== 'mental' && area !== 'head'){
    const cfg = typeof BP_REGISTRY!=='undefined' ? BP_REGISTRY[area] : null;
    if(cfg){
      const sideEntries = Object.entries(cfg.sideKeys);
      if(sideEntries.length > 1){
        const hasLeft = sideEntries.some(([k])=>k.toLowerCase().startsWith('left'));
        const hasRight = sideEntries.some(([k])=>k.toLowerCase().startsWith('right'));
        h += '<div class="cr-add-row">';
        h += '<label class="cr-add-lbl">' + (hasLeft&&hasRight ? 'Side' : 'Location') + '</label>';
        h += '<select class="cr-add-select-wide" onchange="onSecSideChange(\''+claimId+'\',this.value)">';
        h += '<option value="">— Select —</option>';
        sideEntries.forEach(([key, label]) => {
          h += '<option value="'+key+'"' + (side===key?' selected':'') + '>'+label+'</option>';
        });
        if(hasLeft && hasRight){
          h += '<option value="both"' + (side==='both'?' selected':'') + '>Both / Bilateral</option>';
        }
        h += '</select></div>';
      }
    }
  }

  // Condition dropdown
  if(area){
    let condList = [];
    if(SECONDARY_MAP && SECONDARY_MAP[area]) condList = SECONDARY_MAP[area];
    else if(area === 'mental') condList = [...(VA_MENTAL || []), ...(MENTAL_SECONDARIES || [])];
    else if(area === 'head') condList = VA_HEAD || [];
    else condList = (VA_AREA_CONDITIONS && VA_AREA_CONDITIONS[area]) || [];

    const available = condList.filter(n => !secs.includes(n));
    if(available.length){
      h += '<div class="cr-add-row">';
      h += '<label class="cr-add-lbl">Condition</label>';
      h += '<select class="cr-add-select-wide" onchange="addSecFromDropdown(\''+claimId+'\',this.value);this.value=\'\';">';
      h += '<option value="">— Select condition —</option>';
      available.forEach(name => {
        const ex = (typeof MH_EXAMPLES !== 'undefined' && MH_EXAMPLES[name]) || (typeof PHYS_EXAMPLES !== 'undefined' && PHYS_EXAMPLES[name]) || '';
        const display = ex ? name + ' (e.g. ' + ex + ')' : name;
        h += '<option value="'+name.replace(/"/g,'&quot;')+'">'+display+'</option>';
      });
      h += '</select></div>';
    }
  }

  return h;
}

function renderPendingSecEval(claimId, st){
  const domains = st.pendingDomains || {};
  const secProfile = st.pendingSecProfile || _getSecProfile(st.pendingSec);
  const rating = _calcRatingForProfile(secProfile, domains);

  let h = '<div class="cr-pending-sec">';
  h += '<div class="cr-pending-head">' +
    '<span class="cr-pending-name">' + st.pendingSec + '</span>' +
    '<span class="cr-rating-badge" style="background:#e0e7ff;color:#3730a3;border:1px solid #c7d2fe;">' + rating + '%</span>' +
  '</div>';

  h += '<div class="cr-eval cr-eval-sub">';

  if(secProfile.type === 'mh'){
    // Mental health questionnaire with levels + frequency + examples
    h += '<div class="cr-eval-note">Rate each functional domain (VA mental health criteria):</div>';
    MH_DOMAINS.forEach(domain => {
      const dv = domains[domain.id] || {level:'none',frequency:'less25'};
      const currentLevel = dv.level || 'none';
      const currentFreq = dv.frequency || 'less25';

      h += '<div class="cr-domain">';
      h += '<div class="cr-domain-head">' +
        '<div class="cr-domain-label">' + domain.label + '</div>' +
        '<div class="cr-domain-desc">' + domain.description + '</div>' +
      '</div>';

      // Level buttons
      h += '<div class="cr-levels">';
      MH_IMPAIRMENT_LEVELS.forEach(lv => {
        const isActive = currentLevel === lv;
        h += '<button class="cr-lv-btn' + (isActive ? ' cr-lv-active-'+lv : '') + '"' +
          ' onclick="updatePendingSecDomain(\'' + claimId + '\',\'' + domain.id + '\',\'' + lv + '\')">' +
          MH_IMPAIRMENT_LABELS[lv] + '</button>';
      });
      h += '</div>';

      // Frequency
      if(currentLevel !== 'none'){
        h += '<div class="cr-freq">' +
          '<span class="cr-freq-label">How often?</span>' +
          '<button class="cr-freq-btn' + (currentFreq==='less25'?' cr-freq-active':'') + '"' +
            ' onclick="updatePendingSecFreq(\'' + claimId + '\',\'' + domain.id + '\',\'less25\')">Less than 25%</button>' +
          '<button class="cr-freq-btn' + (currentFreq==='25plus'?' cr-freq-active':'') + '"' +
            ' onclick="updatePendingSecFreq(\'' + claimId + '\',\'' + domain.id + '\',\'25plus\')">25% or more</button>' +
        '</div>';
      }

      // Example text
      const exampleText = domain.examples ? (domain.examples[currentLevel] || '') : '';
      if(exampleText){
        h += '<div class="cr-example">' + exampleText + '</div>';
      }

      h += '</div>';
    });

  } else {
    // Systemic, head, or physical profile — use domain levels
    const profileDomains = (secProfile.type === 'systemic' || secProfile.type === 'head')
      ? secProfile.profile.domains
      : PHYSICAL_PROFILE.domains;
    const noteText = (secProfile.type === 'systemic' || secProfile.type === 'head') && secProfile.profile.note
      ? secProfile.profile.note : '';
    h += '<div class="cr-eval-note">Rate this secondary condition:</div>';
    if(noteText){
      h += '<div class="cr-profile-note">' + noteText + '</div>';
    }
    profileDomains.forEach(domain => {
      const currentValue = domains[domain.id] || 0;
      h += '<div class="cr-domain">';
      h += '<div class="cr-domain-head">' +
        '<div class="cr-domain-label">' + domain.label + '</div>' +
        '<div class="cr-domain-desc">' + domain.description + '</div>' +
      '</div>';
      h += '<div class="cr-hd-levels">';
      domain.levels.forEach(lv => {
        const isActive = currentValue === lv.value;
        h += '<button class="cr-hd-btn' + (isActive ? ' cr-hd-active' : '') + '"' +
          ' onclick="updatePendingSecDomain(\'' + claimId + '\',\'' + domain.id + '\',' + lv.value + ')"' +
          ' title="' + (lv.description||'').replace(/"/g,'&quot;') + '">' +
          '<span class="cr-hd-val">' + lv.value + '%</span>' +
          '<span class="cr-hd-lbl">' + lv.label + '</span>' +
        '</button>';
      });
      h += '</div>';
      const selectedLevel = domain.levels.find(lv => lv.value === currentValue);
      if(selectedLevel && selectedLevel.description && currentValue > 0){
        h += '<div class="cr-example">' + selectedLevel.description + '</div>';
      }
      h += '</div>';
    });
  }

  h += '</div>';

  h += '<div class="cr-pending-actions">' +
    '<button class="cr-pending-submit" onclick="submitPendingSec(\'' + claimId + '\')">Add Secondary (' + rating + '%)</button>' +
    '<button class="cr-pending-cancel" onclick="cancelPendingSec(\'' + claimId + '\')">Cancel</button>' +
  '</div>';
  h += '</div>';
  return h;
}

function toggleSevPanel(id){
  _sevOpen[id] = !_sevOpen[id];
  renderSecondary();
}

// ── GATHER ALL CLAIMS ──

function gatherAllClaims(){
  const claims = [];

  // Physical injuries from map (skip panel-managed keys — those are in their own state arrays)
  const _pk = _getPanelKeys();
  const sorted = [...injuries].sort((a,b)=>new Date(a.date)-new Date(b.date)||a.id-b.id);
  sorted.filter(i => !_pk.has(i.key)).forEach(i => {
    // Initialize evaluation state if not present
    if(!i.evalDomains){
      i.evalDomains = {};
      PHYSICAL_PROFILE.domains.forEach(d => { i.evalDomains[d.id] = 0; });
    }
    if(typeof i.rating === 'undefined') i.rating = 0;
    claims.push({
      type:'injury', id:'inj-'+i.id, rawId:i.id,
      label:i.label, date:i.date||'', key:i.key,
      group:getGroupForKey(i.key),
      rating:i.rating, severity:i.severity,
      ref:i
    });
  });

  // Mental health evaluated conditions
  (window._mentalHealthConditions||[]).forEach(c => {
    if(!c.secondaries) c.secondaries = [];
    claims.push({
      type:'mental', id:'mh-'+c.id, rawId:c.id,
      label:c.condition, date:'', key:'mental', group:'mental',
      rating:c.effectiveRating,
      severity:c.effectiveRating>=70?'severe':c.effectiveRating>=30?'moderate':c.effectiveRating>0?'mild':'custom',
      ref:c
    });
  });

  // Head/face evaluated conditions
  (window._headConditions||[]).forEach(c => {
    if(!c.secondaries) c.secondaries = [];
    claims.push({
      type:'head', id:'hd-'+c.id, rawId:c.id,
      label:c.condition, date:'', key:'headFace', group:'head',
      rating:c.effectiveRating,
      severity:c.effectiveRating>=70?'severe':c.effectiveRating>=30?'moderate':c.effectiveRating>0?'mild':'custom',
      ref:c
    });
  });

  // Body part evaluated conditions (knee, back, shoulder, etc.)
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      (window[cfg.stateKey]||[]).forEach(c => {
        if(!c.secondaries) c.secondaries = [];
        claims.push({
          type:cfg.id, id:'bp-'+c.id, rawId:c.id,
          label:c.condition, date:'', key:cfg.id, group:cfg.id,
          rating:c.effectiveRating,
          severity:c.effectiveRating>=70?'severe':c.effectiveRating>=30?'moderate':c.effectiveRating>0?'mild':'custom',
          ref:c
        });
      });
    });
  }

  return claims;
}

// ── GET CLAIM REF ──

function getClaimRef(claimId){
  const parts = claimId.split('-');
  const type = parts[0];
  const rawId = parseFloat(parts.slice(1).join('-'));
  if(type==='inj') return injuries.find(i=>i.id===rawId);
  if(type==='mh') return (window._mentalHealthConditions||[]).find(c=>c.id===rawId);
  if(type==='hd') return (window._headConditions||[]).find(c=>c.id===rawId);
  if(type==='bp'){
    // Search all BP registries
    if(typeof BP_REGISTRY !== 'undefined'){
      for(const cfg of Object.values(BP_REGISTRY)){
        const found = (window[cfg.stateKey]||[]).find(c=>c.id===rawId);
        if(found) return found;
      }
    }
  }
  return null;
}

function getClaimType(claimId){ return claimId.split('-')[0]; }

// ── UPDATE DOMAIN VALUE ──

function updateClaimDomain(claimId, domainId, value){
  value = parseInt(value);
  const type = getClaimType(claimId);
  const ref = getClaimRef(claimId);
  if(!ref) return;

  if(type === 'mh'){
    // MH uses {level, frequency} format — map value back to level
    const lvMap = {0:'none',10:'mild',30:'moderate',50:'moderate',70:'severe',100:'total'};
    ref.domains[domainId].level = lvMap[value] || 'none';
    if(value === 0) ref.domains[domainId].frequency = 'less25';
    recalcMHRating(ref);
  } else if(type === 'hd'){
    ref.domains[domainId] = value;
    recalcHeadRating(ref);
  } else if(type === 'bp'){
    // Body part evaluated condition
    ref.domains[domainId] = value;
    const bpCfg = typeof BP_REGISTRY!=='undefined' ? Object.values(BP_REGISTRY).find(cfg => (window[cfg.stateKey]||[]).includes(ref)) : null;
    if(bpCfg){
      ref.calculatedRating = bpCfg.calcRating(ref.domains);
      if(ref.manualOverride === null) ref.effectiveRating = ref.calculatedRating;
    }
  } else {
    // Physical injury
    ref.evalDomains[domainId] = value;
    ref.rating = calculatePhysicalRating(ref.evalDomains);
    ref.severity = ref.rating>=70?'severe':ref.rating>=30?'moderate':ref.rating>0?'mild':'custom';
    const pinEl = document.getElementById('pin-'+ref.id);
    if(pinEl) pinEl.className = 'pin pin-'+ref.severity;
    updateBadges();
  }
  renderSecondary();
  if(typeof renderRating === 'function') renderRating();
}

// MH frequency update
function updateClaimFreq(claimId, domainId, freq){
  const ref = getClaimRef(claimId);
  if(!ref || !ref.domains || !ref.domains[domainId]) return;
  ref.domains[domainId].frequency = freq;
  recalcMHRating(ref);
  renderSecondary();
  if(typeof renderRating === 'function') renderRating();
}

// MH level update (uses the original level names)
function updateClaimMHLevel(claimId, domainId, level){
  const ref = getClaimRef(claimId);
  if(!ref || !ref.domains || !ref.domains[domainId]) return;
  ref.domains[domainId].level = level;
  if(level === 'none') ref.domains[domainId].frequency = 'less25';
  recalcMHRating(ref);
  renderSecondary();
  if(typeof renderRating === 'function') renderRating();
}

// ── SECONDARY RATING (inline eval for secondaries) ──

function initSecondaryEval(ref, secName){
  if(!ref.secondaryEvals) ref.secondaryEvals = {};
  if(!ref.secondaryEvals[secName]){
    const secProfile = _getSecProfile(secName);
    ref.secondaryEvals[secName] = { domains: _initDomainsForProfile(secProfile), rating: 0, profileType: secProfile.type };
  }
  return ref.secondaryEvals[secName];
}

function updateSecDomain(claimId, secIdx, domainId, value){
  const ref = getClaimRef(claimId);
  if(!ref) return;
  const secs = ref.secondaries || [];
  const secName = secs[secIdx];
  if(!secName) return;
  const eval_ = initSecondaryEval(ref, secName);
  const secProfile = _getSecProfile(secName);
  if(secProfile.type === 'mh'){
    if(!eval_.domains[domainId]) eval_.domains[domainId] = {level:'none',frequency:'less25'};
    eval_.domains[domainId].level = value;
    if(value === 'none') eval_.domains[domainId].frequency = 'less25';
    eval_.rating = _calcRatingForProfile(secProfile, eval_.domains);
  } else {
    eval_.domains[domainId] = parseInt(value);
    eval_.rating = _calcRatingForProfile(secProfile, eval_.domains);
  }
  if(!ref.secondaryRatings) ref.secondaryRatings = {};
  ref.secondaryRatings[secName] = eval_.rating;
  renderSecondary();
  if(typeof renderRating === 'function') renderRating();
}

function updateSecFreq(claimId, secIdx, domainId, freq){
  const ref = getClaimRef(claimId);
  if(!ref) return;
  const secs = ref.secondaries || [];
  const secName = secs[secIdx];
  if(!secName) return;
  const eval_ = initSecondaryEval(ref, secName);
  if(eval_.domains[domainId]) eval_.domains[domainId].frequency = freq;
  const secProfile = _getSecProfile(secName);
  eval_.rating = _calcRatingForProfile(secProfile, eval_.domains);
  if(!ref.secondaryRatings) ref.secondaryRatings = {};
  ref.secondaryRatings[secName] = eval_.rating;
  renderSecondary();
  if(typeof renderRating === 'function') renderRating();
}

// ── RENDER INLINE QUESTIONNAIRE ──

function renderInlineEval(claimId, claim){
  const type = claim.type;
  const ref = claim.ref;
  let h = '<div class="cr-eval">';

  if(type === 'mental'){
    // MH: render 5 domains with level buttons + frequency
    h += '<div class="cr-eval-note">Rate each functional domain (VA 8787 criteria):</div>';
    MH_DOMAINS.forEach(domain => {
      const dv = ref.domains[domain.id];
      const currentLevel = dv.level;
      const currentFreq = dv.frequency;
      h += renderMHDomainCard(claimId, domain, currentLevel, currentFreq);
    });
    h += '<div class="cr-calc-rating">Calculated: <strong>' + ref.calculatedRating + '%</strong></div>';

  } else if(type === 'head'){
    // Head: render profile-specific domains
    const profile = HEAD_PROFILES[ref.profile] || HEAD_PROFILES.generic;
    h += '<div class="cr-eval-note">Rate using ' + profile.label + ' criteria:</div>';
    if(profile.note){
      h += '<div class="cr-profile-note">' + profile.note + '</div>';
    }
    profile.domains.forEach(domain => {
      const currentValue = ref.domains[domain.id] || 0;
      h += renderHeadDomainCard(claimId, domain, currentValue);
    });
    h += '<div class="cr-calc-rating">Calculated: <strong>' + ref.calculatedRating + '%</strong></div>';

  } else if(typeof BP_REGISTRY !== 'undefined' && Object.values(BP_REGISTRY).some(cfg => (window[cfg.stateKey]||[]).includes(ref))){
    // Body part evaluated condition — use its profile-based domains
    const bpCfg = Object.values(BP_REGISTRY).find(cfg => (window[cfg.stateKey]||[]).includes(ref));
    const profile = bpCfg.profiles()[ref.profile] || bpCfg.profiles().generic;
    h += '<div class="cr-eval-note">Rate using ' + profile.label + ' criteria:</div>';
    if(profile.note){
      h += '<div class="cr-profile-note">' + profile.note + '</div>';
    }
    profile.domains.forEach(domain => {
      const currentValue = ref.domains[domain.id] || 0;
      h += renderHeadDomainCard(claimId, domain, currentValue);
    });
    h += '<div class="cr-calc-rating">Calculated: <strong>' + ref.calculatedRating + '%</strong></div>';

  } else {
    // Physical: render generic profile
    h += '<div class="cr-eval-note">Rate each area based on your condition:</div>';
    PHYSICAL_PROFILE.domains.forEach(domain => {
      const currentValue = (ref.evalDomains && ref.evalDomains[domain.id]) || 0;
      h += renderPhysDomainCard(claimId, domain, currentValue);
    });
    h += '<div class="cr-calc-rating">Calculated: <strong>' + (ref.rating||0) + '%</strong></div>';
  }

  h += '</div>';
  return h;
}

// Secondary inline eval — uses the right profile for the condition
function renderSecondaryEval(claimId, secIdx, secName, ref){
  const eval_ = initSecondaryEval(ref, secName);
  const secProfile = _getSecProfile(secName);
  let h = '<div class="cr-eval cr-eval-sub">';

  if(secProfile.type === 'mh'){
    h += '<div class="cr-eval-note">Rate each functional domain (VA mental health criteria):</div>';
    MH_DOMAINS.forEach(domain => {
      const dv = eval_.domains[domain.id] || {level:'none',frequency:'less25'};
      const currentLevel = dv.level || 'none';
      const currentFreq = dv.frequency || 'less25';

      h += '<div class="cr-domain">';
      h += '<div class="cr-domain-head">' +
        '<div class="cr-domain-label">' + domain.label + '</div>' +
        '<div class="cr-domain-desc">' + domain.description + '</div>' +
      '</div>';

      h += '<div class="cr-levels">';
      MH_IMPAIRMENT_LEVELS.forEach(lv => {
        const isActive = currentLevel === lv;
        h += '<button class="cr-lv-btn' + (isActive ? ' cr-lv-active-'+lv : '') + '"' +
          ' onclick="updateSecDomain(\'' + claimId + '\',' + secIdx + ',\'' + domain.id + '\',\'' + lv + '\')">' +
          MH_IMPAIRMENT_LABELS[lv] + '</button>';
      });
      h += '</div>';

      if(currentLevel !== 'none'){
        h += '<div class="cr-freq">' +
          '<span class="cr-freq-label">How often?</span>' +
          '<button class="cr-freq-btn' + (currentFreq==='less25'?' cr-freq-active':'') + '"' +
            ' onclick="updateSecFreq(\'' + claimId + '\',' + secIdx + ',\'' + domain.id + '\',\'less25\')">Less than 25%</button>' +
          '<button class="cr-freq-btn' + (currentFreq==='25plus'?' cr-freq-active':'') + '"' +
            ' onclick="updateSecFreq(\'' + claimId + '\',' + secIdx + ',\'' + domain.id + '\',\'25plus\')">25% or more</button>' +
        '</div>';
      }

      const exampleText = domain.examples ? (domain.examples[currentLevel] || '') : '';
      if(exampleText){
        h += '<div class="cr-example">' + exampleText + '</div>';
      }

      h += '</div>';
    });
  } else {
    const profileDomains = (secProfile.type === 'systemic' || secProfile.type === 'head')
      ? secProfile.profile.domains
      : PHYSICAL_PROFILE.domains;
    const noteText = (secProfile.type === 'systemic' || secProfile.type === 'head') && secProfile.profile.note
      ? secProfile.profile.note : '';
    h += '<div class="cr-eval-note">Rate secondary condition severity:</div>';
    if(noteText){
      h += '<div class="cr-profile-note">' + noteText + '</div>';
    }
    profileDomains.forEach(domain => {
      const currentValue = eval_.domains[domain.id] || 0;
      h += renderPhysDomainCardSec(claimId, secIdx, domain, currentValue);
    });
  }

  h += '<div class="cr-calc-rating">Calculated: <strong>' + (eval_.rating||0) + '%</strong></div>';
  h += '</div>';
  return h;
}

// ── DOMAIN CARD RENDERERS ──

function renderMHDomainCard(claimId, domain, currentLevel, currentFreq){
  let h = '<div class="cr-domain">';
  h += '<div class="cr-domain-head">' +
    '<div class="cr-domain-label">' + domain.label + '</div>' +
    '<div class="cr-domain-desc">' + domain.description + '</div>' +
  '</div>';

  // Level buttons
  h += '<div class="cr-levels">';
  MH_IMPAIRMENT_LEVELS.forEach(lv => {
    const isActive = currentLevel === lv;
    h += '<button class="cr-lv-btn' + (isActive ? ' cr-lv-active-'+lv : '') + '"' +
      ' onclick="updateClaimMHLevel(\'' + claimId + '\',\'' + domain.id + '\',\'' + lv + '\')">' +
      MH_IMPAIRMENT_LABELS[lv] + '</button>';
  });
  h += '</div>';

  // Frequency (if impairment > none)
  if(currentLevel !== 'none'){
    h += '<div class="cr-freq">' +
      '<span class="cr-freq-label">How often?</span>' +
      '<button class="cr-freq-btn' + (currentFreq==='less25'?' cr-freq-active':'') + '"' +
        ' onclick="updateClaimFreq(\'' + claimId + '\',\'' + domain.id + '\',\'less25\')">Less than 25%</button>' +
      '<button class="cr-freq-btn' + (currentFreq==='25plus'?' cr-freq-active':'') + '"' +
        ' onclick="updateClaimFreq(\'' + claimId + '\',\'' + domain.id + '\',\'25plus\')">25% or more</button>' +
    '</div>';
  }

  // Example text
  const exampleText = domain.examples[currentLevel] || '';
  if(exampleText){
    h += '<div class="cr-example">' + exampleText + '</div>';
  }

  h += '</div>';
  return h;
}

function renderHeadDomainCard(claimId, domain, currentValue){
  let h = '<div class="cr-domain">';
  h += '<div class="cr-domain-head">' +
    '<div class="cr-domain-label">' + domain.label + '</div>' +
    '<div class="cr-domain-desc">' + domain.description + '</div>' +
  '</div>';

  h += '<div class="cr-hd-levels">';
  domain.levels.forEach(lv => {
    const isActive = currentValue === lv.value;
    h += '<button class="cr-hd-btn' + (isActive ? ' cr-hd-active' : '') + '"' +
      ' onclick="updateClaimDomain(\'' + claimId + '\',\'' + domain.id + '\',' + lv.value + ')"' +
      ' title="' + (lv.description||'').replace(/"/g,'&quot;') + '">' +
      '<span class="cr-hd-val">' + lv.value + '%</span>' +
      '<span class="cr-hd-lbl">' + lv.label + '</span>' +
    '</button>';
  });
  h += '</div>';

  const selectedLevel = domain.levels.find(lv => lv.value === currentValue);
  if(selectedLevel && selectedLevel.description && currentValue > 0){
    h += '<div class="cr-example">' + selectedLevel.description + '</div>';
  }

  h += '</div>';
  return h;
}

function renderPhysDomainCard(claimId, domain, currentValue){
  let h = '<div class="cr-domain">';
  h += '<div class="cr-domain-head">' +
    '<div class="cr-domain-label">' + domain.label + '</div>' +
    '<div class="cr-domain-desc">' + domain.description + '</div>' +
  '</div>';

  h += '<div class="cr-hd-levels">';
  domain.levels.forEach(lv => {
    const isActive = currentValue === lv.value;
    h += '<button class="cr-hd-btn' + (isActive ? ' cr-hd-active' : '') + '"' +
      ' onclick="updateClaimDomain(\'' + claimId + '\',\'' + domain.id + '\',' + lv.value + ')"' +
      ' title="' + (lv.description||'').replace(/"/g,'&quot;') + '">' +
      '<span class="cr-hd-val">' + lv.value + '%</span>' +
      '<span class="cr-hd-lbl">' + lv.label + '</span>' +
    '</button>';
  });
  h += '</div>';

  const selectedLevel = domain.levels.find(lv => lv.value === currentValue);
  if(selectedLevel && selectedLevel.description && currentValue > 0){
    h += '<div class="cr-example">' + selectedLevel.description + '</div>';
  }

  h += '</div>';
  return h;
}

function renderPhysDomainCardSec(claimId, secIdx, domain, currentValue){
  let h = '<div class="cr-domain">';
  h += '<div class="cr-domain-head">' +
    '<div class="cr-domain-label">' + domain.label + '</div>' +
    '<div class="cr-domain-desc">' + domain.description + '</div>' +
  '</div>';

  h += '<div class="cr-hd-levels">';
  domain.levels.forEach(lv => {
    const isActive = currentValue === lv.value;
    h += '<button class="cr-hd-btn' + (isActive ? ' cr-hd-active' : '') + '"' +
      ' onclick="updateSecDomain(\'' + claimId + '\',' + secIdx + ',\'' + domain.id + '\',' + lv.value + ')"' +
      ' title="' + (lv.description||'').replace(/"/g,'&quot;') + '">' +
      '<span class="cr-hd-val">' + lv.value + '%</span>' +
      '<span class="cr-hd-lbl">' + lv.label + '</span>' +
    '</button>';
  });
  h += '</div>';

  const selectedLevel = domain.levels.find(lv => lv.value === currentValue);
  if(selectedLevel && selectedLevel.description && currentValue > 0){
    h += '<div class="cr-example">' + selectedLevel.description + '</div>';
  }

  h += '</div>';
  return h;
}

// ── GROUP LABEL MAP ──
const GROUP_LABELS = {
  head:'Head & Face', mental:'Mental Health', neck:'Neck', shoulder:'Shoulder',
  back:'Back & Spine', chest:'Chest / Lungs', abdomen:'Abdomen / Pelvis',
  hip:'Hip', elbow:'Elbow / Forearm', wrist_hand:'Wrist / Hand',
  knee:'Knee', leg:'Thigh / Shin / Calf', ankle_foot:'Ankle / Foot', systemic:'Other / Systemic', other:'Other'
};

// ── RENDER UNIFIED CLAIM MAP (Grouped by Body Area) ──

function renderSecondary(){
  const c = document.getElementById('sc-list');
  const claims = gatherAllClaims();

  if(!claims.length){
    c.innerHTML = '<div class="empty">No claims yet.<br>Add injuries from the Primary Map tab, or evaluate conditions from the Quick Select sidebar.</div>';
    updateSecondaryCount();
    return;
  }

  // Group claims by body area
  const grouped = {};
  claims.forEach(claim => {
    const g = claim.group || 'other';
    if(!grouped[g]) grouped[g] = [];
    grouped[g].push(claim);
  });

  // Render order: follow a logical body order
  const groupOrder = ['head','mental','neck','shoulder','back','chest','abdomen','hip','elbow','wrist_hand','knee','leg','ankle_foot','systemic','other'];
  const sortedGroups = Object.keys(grouped).sort((a,b) => {
    const ai = groupOrder.indexOf(a); const bi = groupOrder.indexOf(b);
    return (ai===-1?99:ai) - (bi===-1?99:bi);
  });

  let html = '<div class="cr-tree">';

  sortedGroups.forEach(groupKey => {
    const groupClaims = grouped[groupKey];
    const groupLabel = GROUP_LABELS[groupKey] || groupKey.replace(/_/g,' / ');
    const groupOpen = _sevOpen['grp-'+groupKey] !== false; // default open
    const claimCount = groupClaims.length;
    const secCount = groupClaims.reduce((n,cl)=>(n+(cl.ref.secondaries||[]).length),0);

    // Body area section header
    html += '<div class="cr-body-group">';
    html += '<div class="cr-group-head" onclick="_sevOpen[\'grp-'+groupKey+'\']='+(groupOpen?'false':'true')+';renderSecondary();">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span class="cr-group-arrow">'+(groupOpen?'▼':'▶')+'</span>' +
        '<span class="cr-group-title">'+groupLabel+'</span>' +
        '<span class="cr-group-count">'+claimCount+' condition'+(claimCount!==1?'s':'')+(secCount?' · '+secCount+' secondary':'')+'</span>' +
      '</div>' +
    '</div>';

    if(!groupOpen){
      html += '</div>';
      return;
    }

    // Claims within this body area
    html += '<div class="cr-group-body">';

    groupClaims.forEach(claim => {
      const displayRating = claim.type==='inj' ? (claim.ref.rating||0) : claim.rating;
      const sev = displayRating>=70?'severe':displayRating>=30?'moderate':displayRating>0?'mild':'custom';
      const sc = SC[sev]||SC.custom;
      const sbg = SBG[sev]||SBG.custom;
      const sbd = SBD[sev]||SBD.custom;
      const sevOpen = _sevOpen[claim.id];
      const ref = claim.ref;
      const group = claim.group;

      // Condition card
      html += '<div class="cr-primary">';

      // Header
      html += '<div class="cr-primary-head">' +
        '<div class="cr-primary-info">' +
          '<span class="cr-dot" style="background:'+sc+';"></span>' +
          '<div class="cr-primary-name">' + claim.label + '</div>' +
          (claim.date ? '<span class="cr-date">' + claim.date + '</span>' : '') +
        '</div>' +
        '<div class="cr-primary-actions">' +
          '<span class="cr-rating-badge" style="background:'+sbg+';color:'+sc+';border:1px solid '+sbd+';">' + displayRating + '%</span>' +
          '<button class="cr-toggle' + (sevOpen ? ' cr-toggle-open' : '') + '" onclick="toggleSevPanel(\'' + claim.id + '\')">' +
            (sevOpen ? '▲ Close' : '▼ Rate') +
          '</button>' +
          '<button class="cr-del-btn" onclick="deleteClaimFromSev(\'' + claim.id + '\')" title="Delete condition">&times;</button>' +
        '</div>' +
      '</div>';

      // Inline evaluation (expanded)
      if(sevOpen){
        html += '<div class="cr-sev-panel">';
        html += renderInlineEval(claim.id, claim);
        html += '</div>';
      }

      // Secondaries
      const secs = ref.secondaries || [];
      const secRatings = ref.secondaryRatings || {};

      if(secs.length){
        html += '<div class="cr-secondaries">';
        secs.forEach((s, si) => {
          const secRating = secRatings[s] || 0;
          const secSev = secRating>=70?'severe':secRating>=30?'moderate':secRating>0?'mild':'custom';
          const ssc = SC[secSev]||SC.custom;
          const ssbg = SBG[secSev]||SBG.custom;
          const ssbd = SBD[secSev]||SBD.custom;
          const secSevOpen = _sevOpen[claim.id+'-sec-'+si];

          html += '<div class="cr-secondary">';
          html += '<div class="cr-sec-head">' +
            '<div class="cr-sec-info">' +
              '<span class="cr-sec-line"></span>' +
              '<span class="cr-sec-dot" style="background:'+ssc+';"></span>' +
              '<span class="cr-sec-name">' + s + '</span>' +
            '</div>' +
            '<div class="cr-sec-actions">' +
              '<span class="cr-rating-badge cr-rating-sm" style="background:'+ssbg+';color:'+ssc+';border:1px solid '+ssbd+';">' + secRating + '%</span>' +
              '<button class="cr-toggle cr-toggle-sm' + (secSevOpen ? ' cr-toggle-open' : '') + '" onclick="toggleSevPanel(\'' + claim.id + '-sec-' + si + '\')">' +
                (secSevOpen ? '▲' : '▼ Rate') +
              '</button>' +
              '<button class="cr-sec-rm" onclick="removeSecondary(\'' + claim.id + '\',' + si + ')">&times;</button>' +
            '</div>' +
          '</div>';

          if(secSevOpen){
            html += renderSecondaryEval(claim.id, si, s, ref);
          }

          html += '</div>';
        });
        html += '</div>';
      }

      // Add secondary — body part → condition flow
      html += '<div class="cr-add-sec">';
      html += renderSecondaryAddDropdowns(claim.id, group);
      // Custom text input
      html += '<div class="cr-custom-row">' +
        '<input type="text" class="cr-custom-input" id="cr-custom-' + claim.id + '" placeholder="Custom secondary...">' +
        '<button class="cr-custom-btn" onclick="addCustomSecondary(\'' + claim.id + '\')">Add</button>' +
      '</div>';
      html += '</div>';

      html += '</div>'; // cr-primary
    });

    html += '</div>'; // cr-group-body
    html += '</div>'; // cr-body-group
  });

  html += '</div>';
  c.innerHTML = html;
  updateSecondaryCount();
}

// ── ADD / REMOVE ──

function addSecondary(claimId, selectEl){
  const val = selectEl.value; if(!val) return;
  const ref = getClaimRef(claimId); if(!ref) return;
  if(!ref.secondaries) ref.secondaries = [];
  if(!ref.secondaries.includes(val)) ref.secondaries.push(val);
  renderSecondary();
}

function addCustomSecondary(claimId){
  const input = document.getElementById('cr-custom-'+claimId);
  const val = input ? input.value.trim() : ''; if(!val) return;
  const ref = getClaimRef(claimId); if(!ref) return;
  if(ref.secondaries && ref.secondaries.includes(val)) return;
  // Show questionnaire for custom secondary too
  addSecFromDropdown(claimId, val);
}

function removeSecondary(claimId, secIdx){
  const ref = getClaimRef(claimId); if(!ref||!ref.secondaries) return;
  const removed = ref.secondaries.splice(secIdx, 1)[0];
  if(removed && ref.secondaryEvals) delete ref.secondaryEvals[removed];
  if(removed && ref.secondaryRatings) delete ref.secondaryRatings[removed];
  renderSecondary();
}

// Vocational add/remove (shared with special.js)
function addVocSecondary(selectEl){
  const val = selectEl.value; if(!val) return;
  if(!window._vocSecondaries) window._vocSecondaries = [];
  if(!window._vocSecondaries.includes(val)) window._vocSecondaries.push(val);
  if(typeof renderSpecial==='function') renderSpecial();
}
function removeVocSecondary(condition){
  window._vocSecondaries = (window._vocSecondaries||[]).filter(s=>s!==condition);
  if(typeof renderSpecial==='function') renderSpecial();
}

function updateSecondaryCount(){
  const claims = gatherAllClaims();
  const totalSec = claims.reduce((n,c)=>n+(c.ref.secondaries?.length||0),0);
  document.getElementById('sc-tab').textContent = totalSec ? 'Severity & Secondary ('+totalSec+')' : 'Severity & Secondary';
}
// ── EVIDENCE GAP FLAGS ──

const GAP_FIELDS = [
  { key:'description', label:'Description / Notes' },
  { key:'event',       label:'Service Event' },
  { key:'medicalCare', label:'Medical Evidence', check: v => v==='yes' },
  { key:'location',    label:'Installation / Location' },
  { key:'clinicName',  label:'Clinic Name', condition: i => i.medicalCare==='yes' },
];

function getGaps(inj){
  const missing=[];
  GAP_FIELDS.forEach(f=>{
    // Skip conditional fields when condition isn't met
    if(f.condition && !f.condition(inj)) return;
    const val = inj[f.key];
    const present = f.check ? f.check(val) : (val && val.trim && val.trim()!=='');
    if(!present) missing.push(f.label);
  });
  return missing;
}

function gapStatus(inj){
  const gaps = getGaps(inj);
  if(gaps.length===0) return { status:'complete', color:'var(--mild)', bg:'#f0fdf4', border:'#bbf7d0', label:'Complete', gaps };
  return { status:'incomplete', color:'var(--moderate)', bg:'#fffbeb', border:'#fde68a', label:'Needs Evidence ('+gaps.length+')', gaps };
}

function renderGapBar(inj){
  const g = gapStatus(inj);
  let html = `<div class="gap-bar" style="background:${g.bg};border:1px solid ${g.border};border-radius:5px;padding:5px 9px;margin-top:6px;font-size:11px;">
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:${g.gaps.length?'4':'0'}px;">
      <span style="width:8px;height:8px;border-radius:50%;background:${g.color};flex-shrink:0;"></span>
      <span style="font-weight:700;color:${g.color};font-family:var(--fh);text-transform:uppercase;letter-spacing:.5px;font-size:10px;">${g.label}</span>
    </div>`;
  if(g.gaps.length){
    html += `<div style="display:flex;flex-wrap:wrap;gap:4px;">`;
    g.gaps.forEach(m=>{
      html += `<span style="background:rgba(217,119,6,.12);color:#92400e;font-size:10px;font-weight:600;padding:1px 7px;border-radius:3px;font-family:var(--fm);">${m}</span>`;
    });
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}
// ── TIMELINE TAB ──

function gatherTimelineEntries(){
  const entries = [];

  // Physical injuries (skip panel-managed keys — those have their own entries below)
  const _pk = _getPanelKeys();
  injuries.filter(i => !_pk.has(i.key)).forEach(i => {
    if(!i.date) return;
    entries.push({
      type:'injury', id:i.id, label:i.label, date:i.date,
      severity:i.severity, location:i.location||'', event:i.event||'',
      description:i.description||'', medicalCare:i.medicalCare||'',
      clinicName:i.clinicName||'', witnesses:i.witnesses||'',
      functionalImpacts:i.functionalImpacts||[], secondaries:i.secondaries||[],
      pin:i.pin, ref:i
    });
  });

  // Mental health conditions
  (window._mentalHealthConditions||[]).forEach(c => {
    if(!c.date) return;
    const sev = c.effectiveRating>=70?'severe':c.effectiveRating>=30?'moderate':c.effectiveRating>0?'mild':'custom';
    entries.push({
      type:'mental', id:'mh-'+c.id, label:c.condition, date:c.date,
      severity:sev, location:c.location||'', event:c.event||'',
      description:c.description||('Mental Health — ' + c.effectiveRating + '% rating'),
      medicalCare:c.medicalCare||'', clinicName:c.clinicName||'', witnesses:c.witnesses||'',
      functionalImpacts:[], secondaries:c.secondaries||[],
      pin:c.pin||null, ref:c
    });
  });

  // Head & Face conditions
  (window._headConditions||[]).forEach(c => {
    if(!c.date) return;
    const sev = c.effectiveRating>=70?'severe':c.effectiveRating>=30?'moderate':c.effectiveRating>0?'mild':'custom';
    entries.push({
      type:'head', id:'hd-'+c.id, label:c.condition, date:c.date,
      severity:sev, location:c.location||'', event:c.event||'',
      description:c.description||('Head & Face — ' + c.effectiveRating + '% rating'),
      medicalCare:c.medicalCare||'', clinicName:c.clinicName||'', witnesses:c.witnesses||'',
      functionalImpacts:[], secondaries:c.secondaries||[],
      pin:c.pin||null, ref:c
    });
  });

  // Body part evaluated conditions (knee, back, shoulder, etc.)
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      (window[cfg.stateKey]||[]).forEach(c => {
        if(!c.date) return;
        const sev = c.effectiveRating>=70?'severe':c.effectiveRating>=30?'moderate':c.effectiveRating>0?'mild':'custom';
        entries.push({
          type:cfg.id, id:'bp-'+c.id, label:c.condition, date:c.date,
          severity:sev, location:c.location||'', event:c.event||'',
          description:c.description||(cfg.title+' — '+c.effectiveRating+'% rating'),
          medicalCare:c.medicalCare||'', clinicName:c.clinicName||'', witnesses:c.witnesses||'',
          functionalImpacts:[], secondaries:c.secondaries||[],
          pin:c.pin||null, ref:c
        });
      });
    });
  }

  // Sort by date then id
  entries.sort((a,b)=>new Date(a.date)-new Date(b.date)||(a.id>b.id?1:-1));
  return entries;
}

function renderTimeline(){
  const c=document.getElementById('tl-list');
  const entries = gatherTimelineEntries();

  const _hasSpecials = typeof SPECIAL_CLAIM_TYPES !== 'undefined' && window._specialClaims && SPECIAL_CLAIM_TYPES.some(item => window._specialClaims[item.id]);
  if(!entries.length && !_hasSpecials){
    c.innerHTML='<div class="empty">No injuries or conditions logged yet.<br>Click the body map or use Quick Select to begin.<br><span style="font-size:11px;color:var(--muted);">Items require a date to appear on the timeline.</span></div>';
    return;
  }

  const years=[...new Set(entries.map(e=>e.date?.slice(0,4)).filter(Boolean))];
  c.innerHTML=years.map(yr=>`
    <div class="yr-lbl">${yr}</div>
    ${entries.filter(e=>e.date?.startsWith(yr)).map(e=>{
      const isPhysical = e.type==='injury';
      const bpCfg = typeof BP_REGISTRY!=='undefined' ? BP_REGISTRY[e.type] : null;
      const num = isPhysical ? injuryNumber(e.ref.id) : (e.type==='mental' ? 'MH' : e.type==='head' ? 'HD' : (bpCfg ? bpCfg.id.slice(0,2).toUpperCase() : 'BP'));
      const sc=SC[e.severity]||SC.custom;
      const sbg=SBG[e.severity]||SBG.custom;
      const sbd=SBD[e.severity]||SBD.custom;
      const stxt=e.severity==='custom'?'Other':e.severity;
      const typeTag = e.type==='mental' ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:#7c3aed;background:#f5f3ff;border:1px solid #ddd6fe;padding:1px 5px;border-radius:3px;">Mental Health</span>' :
                      e.type==='head' ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:var(--navy);background:#eff3ff;border:1px solid #bfdbfe;padding:1px 5px;border-radius:3px;">Head & Face</span>' :
                      bpCfg ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:#047857;background:#ecfdf5;border:1px solid #a7f3d0;padding:1px 5px;border-radius:3px;">'+bpCfg.title+'</span>' : '';
      const editBtn = isPhysical ? `<button class="edit-btn" onclick="editInjury(${e.ref.id})" title="Edit">&#9998;</button>` : '';
      const delBtn = isPhysical ? `<button class="del" onclick="deleteInjury(${e.ref.id})">×</button>` : '';
      const pinInfo = e.pin ? `<span style="font-size:10px;color:var(--muted);font-family:var(--fm);">${e.pin.body||''} · ${e.pin.side||''}</span>` : '';

      return`<div class="ic ${e.severity}">
        <div style="flex:1">
          <div class="ic-title">
            <span style="display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:50%;background:${sc};color:#fff;font-size:${isPhysical?'11':'8'}px;font-weight:800;font-family:var(--fm);flex-shrink:0;padding:0 4px;">${num}</span>
            ${e.label}
            <span class="stag" style="background:${sbg};color:${sc};border:1px solid ${sbd};">${stxt}</span>
            ${typeTag}
            ${pinInfo}
          </div>
          <div class="ic-meta">${e.date}${e.location?' · '+e.location:''}${e.event?' · '+e.event:''}</div>
          ${e.description?`<div class="ic-desc">"${e.description}"</div>`:''}
          ${e.medicalCare==='yes'?`<div class="ic-med">&#10003; Medical care${e.clinicName?' — '+e.clinicName:' received'}</div>`:''}
          ${e.witnesses?`<div style="color:var(--muted);font-size:11px;margin-top:3px;">Witnesses: ${e.witnesses}</div>`:''}
          ${e.functionalImpacts?.length?`<div style="margin-top:6px;padding:6px 8px;background:rgba(200,16,46,.06);border-radius:6px;border:1px solid rgba(200,16,46,.15);">
            <div style="font-size:10px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Daily Life Impact</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;">${e.functionalImpacts.map(fi=>'<span style="background:rgba(200,16,46,.1);color:var(--red2);font-size:10px;font-weight:600;padding:2px 7px;border-radius:3px;font-family:var(--fm);">'+fi+'</span>').join('')}</div>
          </div>`:''}
          ${e.secondaries?.length?`<div style="margin-top:6px;padding:6px 8px;background:#e0e7ff;border-radius:6px;border:1px solid #c7d2fe;">
            <div style="font-size:10px;font-weight:700;color:#3730a3;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Secondary Conditions</div>
            ${e.secondaries.map(s=>'<div style="font-size:11px;color:#3730a3;padding:1px 0;">• '+s+'</div>').join('')}
          </div>`:''}
          ${isPhysical ? renderGapBar(e.ref) : ''}
        </div>
        ${delBtn}
        ${editBtn}
      </div>`;
    }).join('')}
  `).join('');

  // Special claims & notification banners
  if(typeof SPECIAL_CLAIM_TYPES !== 'undefined' && window._specialClaims){
    const NOTIF_IDS = new Set(['combat','pow','agent_orange','gulf_war','burn_pit']);
    const activeSpecials = SPECIAL_CLAIM_TYPES.filter(item => window._specialClaims[item.id]);
    if(activeSpecials.length){
      let spHtml = '<div style="margin-top:20px;">';
      spHtml += '<div class="yr-lbl" style="color:#b45309;">Special Claims & Entitlements</div>';
      activeSpecials.forEach(item => {
        const isNotif = NOTIF_IDS.has(item.id);
        if(isNotif){
          spHtml += '<div style="background:#fffbeb;border:1px solid #fde68a;border-left:4px solid #b45309;border-radius:0 6px 6px 0;padding:10px 14px;font-size:12px;color:#92400e;line-height:1.5;margin-bottom:8px;">' +
            '<strong>' + item.label + '</strong> applies to this claim.<br>' +
            '<span style="font-size:11px;">' + item.description + '</span>' +
          '</div>';
        } else {
          spHtml += '<div class="ic custom" style="border-left:3px solid #b45309;">' +
            '<div style="flex:1">' +
              '<div class="ic-title">' +
                '<span style="display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:50%;background:#b45309;color:#fff;font-size:8px;font-weight:800;font-family:var(--fm);flex-shrink:0;padding:0 4px;">SP</span> ' +
                item.label +
                ' <span style="font-size:9px;font-weight:700;font-family:var(--fh);color:#b45309;background:#fffbeb;border:1px solid #fde68a;padding:1px 5px;border-radius:3px;">Special Entitlement</span>' +
              '</div>' +
              '<div style="font-size:11px;color:var(--muted);margin-top:3px;line-height:1.4;">' + item.description + '</div>' +
            '</div>' +
          '</div>';
        }
      });
      spHtml += '</div>';
      c.innerHTML += spHtml;
    }
  }
}
// ── RATING CALCULATOR TAB ──

// ── SUGGESTED RATINGS ──
// Common VA disability ratings by condition name (lowercase match)
const SUGGESTED_RATINGS = {
  // Musculoskeletal
  'tinnitus': 10, 'tinnitus, recurrent': 10,
  'limited rom - knee': 10, 'limited rom - ankle': 10,
  'limited rom - shoulder': 20, 'limited rom - hip': 10,
  'limited rom - elbow': 10, 'limited rom - wrist': 10,
  'limited rom - cervical spine': 20, 'limited rom - thoracolumbar spine': 20,
  'degenerative joint disease - knee': 10, 'degenerative joint disease - hip': 10,
  'degenerative joint disease - ankle': 10,
  'degenerative disc disease (cervical)': 20, 'degenerative disc disease (lumbar)': 20,
  'plantar fasciitis': 10, 'flatfoot (pes planus)': 10,
  'rotator cuff tendinopathy': 20, 'frozen shoulder (adhesive capsulitis)': 20,
  'carpal tunnel syndrome': 10, 'meniscal tear': 10,
  'patellar tendinitis': 10, 'shin splints (mtss)': 10,
  'costochondritis': 10, 'ankle instability': 10,
  'hip labral tear': 10, 'shoulder instability': 20,
  'cubital tunnel syndrome': 10, 'tennis elbow (lateral epicondylitis)': 10,
  'baker\'s cyst': 0, 'instability / giving way': 10,
  'trigger finger': 10, 'de quervain\'s tenosynovitis': 10,
  'abnormal gait': 0, 'leg length discrepancy': 0,

  // Spine
  'cervical radiculopathy': 20, 'lumbar radiculopathy': 20,
  'sciatica': 20, 'ivds - cervical': 20, 'ivds - lumbar': 20,

  // Head / Neurological
  'migraine headaches': 30, 'migraine': 30,
  'tbi residuals': 40, 'residuals of traumatic brain injury (tbi)': 40,
  'tmj disorder': 10, 'vertigo / dizziness': 10,
  'cognitive disorder': 30, 'vision impairment': 10,

  // Mental Health — common ratings
  'anxiety': 30, 'generalized anxiety disorder': 30,
  'depression due to chronic pain': 30, 'major depressive disorder': 50,
  'ptsd': 50, 'ptsd (related to injury)': 50, 'posttraumatic stress disorder': 50,
  'insomnia': 0, 'insomnia / sleep disturbance': 0, 'adjustment disorder': 30,
  'tbi': 40, 'depression': 30,
  'chronic adjustment disorder': 30, 'somatic symptom disorder': 30,
  'bipolar disorder': 50, 'panic disorder and/or agoraphobia': 30,
  'persistent depressive disorder (dysthymia)': 30,
  'obsessive compulsive disorder': 30,

  // Respiratory
  'sleep apnea syndromes (obstructive, central, mixed)': 50,
  'asthma, bronchial': 30, 'chronic obstructive pulmonary disease': 30,

  // Cardiovascular
  'hypertensive vascular disease (hypertension and isolated systolic hypertension)': 10,

  // Digestive
  'gerd': 10, 'gastroesophageal reflux disease': 10,
  'ibs': 10, 'irritable bowel syndrome': 10,

  // Genitourinary
  'erectile dysfunction': 0, 'bladder dysfunction': 20,

  // Skin
  'scarring': 10,

  // Other
  'hearing impairment (hearing loss)': 10,
  'peripheral neuropathy (lower)': 10, 'peripheral neuropathy (upper)': 10,
  'upper extremity numbness / tingling': 10, 'lower extremity numbness / tingling': 10,
  'chronic fatigue': 10, 'grip strength loss': 10,
  'nerve damage (upper extremity)': 20, 'sciatic nerve involvement': 20,
  'muscle atrophy': 10,
};

function getSuggestedRating(conditionName){
  if(!conditionName) return null;
  const key = conditionName.toLowerCase().trim();
  if(SUGGESTED_RATINGS.hasOwnProperty(key)) return SUGGESTED_RATINGS[key];
  // Partial match
  for(const [k,v] of Object.entries(SUGGESTED_RATINGS)){
    if(key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

// ── BILATERAL EXTREMITY DETECTION ──
// Map pin keys to extremity type
const KEY_TO_EXTREMITY = {
  leftShoulder:'LU', rightShoulder:'RU',
  leftElbow:'LU', rightElbow:'RU',
  leftForearm:'LU', rightForearm:'RU',
  leftWrist:'LU', rightWrist:'RU',
  leftHand:'LU', rightHand:'RU',
  leftHip:'LL', rightHip:'RL',
  leftThigh:'LL', rightThigh:'RL',
  leftKnee:'LL', rightKnee:'RL',
  leftShin:'LL', rightShin:'RL',
  leftHamstring:'LL', rightHamstring:'RL',
  leftCalf:'LL', rightCalf:'RL',
  leftAnkle:'LL', rightAnkle:'RL',
  leftFoot:'LL', rightFoot:'RL',
};

function getExtremity(pinKey){
  return KEY_TO_EXTREMITY[pinKey] || 'none';
}

// ── COMBINED RATING MATH (38 CFR 4.25) ──
function combineVARatings(ratings){
  if(!ratings.length) return 0;
  if(ratings.length===1) return ratings[0];
  const sorted = [...ratings].sort((a,b)=>b-a);
  let combined = sorted[0];
  for(let i=1; i<sorted.length; i++){
    combined = combined + (sorted[i]/100) * (100 - combined);
  }
  return combined;
}

// ── RATING STATE ──
// Each entry: {id, name, rating, extremity, type:'primary'|'secondary', parentId?}
let _ratingItems = [];
let _mhSecondaryDisplay = []; // MH conditions appearing as secondaries (display-only, not in combined calc)

function buildRatingItems(){
  _ratingItems = [];
  _mhSecondaryDisplay = [];

  // Build a set of MH condition names to prevent double-counting
  // MH conditions selected as secondaries should NOT add a separate rating line —
  // they're already covered by the single MH rating from the MH panel
  const mhNames = new Set((typeof VA_MENTAL !== 'undefined' ? VA_MENTAL : []).map(n=>n.toLowerCase()));
  const mhSecondaryNames = new Set((typeof MENTAL_SECONDARIES !== 'undefined' ? MENTAL_SECONDARIES : []).map(n=>n.toLowerCase()));

  // Skip injuries whose keys are managed by evaluation panels
  const _pk = _getPanelKeys();
  const sorted = [...injuries].filter(i => !_pk.has(i.key)).sort((a,b)=>new Date(a.date)-new Date(b.date)||a.id-b.id);
  sorted.forEach(inj => {
    const ext = getExtremity(inj.key);
    const suggested = getSuggestedRating(inj.label);
    _ratingItems.push({
      id: 'p-'+inj.id,
      injId: inj.id,
      name: inj.label,
      rating: inj._assignedRating !== undefined ? inj._assignedRating : (suggested !== null ? suggested : 10),
      extremity: ext,
      type: 'primary',
      suggested: suggested,
    });
    // Secondary conditions — skip MH conditions (they go through the MH panel)
    if(inj.secondaries && inj.secondaries.length){
      const injSecExtremities = inj.secondaryExtremities || {};
      inj.secondaries.forEach((sec, si) => {
        const secLower = sec.toLowerCase();
        // MH secondaries go to the MH display section, not into the combined calc
        if(mhNames.has(secLower) || mhSecondaryNames.has(secLower)){
          const secSuggested = getSuggestedRating(sec);
          const evalRating = (inj.secondaryRatings && inj.secondaryRatings[sec] !== undefined) ? inj.secondaryRatings[sec] :
                             (inj._secondaryRatings && inj._secondaryRatings[si] !== undefined) ? inj._secondaryRatings[si] :
                             (secSuggested !== null ? secSuggested : 0);
          _mhSecondaryDisplay.push({ name: sec, rating: evalRating, parentName: inj.label });
          return;
        }

        const secSuggested = getSuggestedRating(sec);
        const secId = 's-'+inj.id+'-'+si;
        const existing = inj._secondaryRatings && inj._secondaryRatings[si];
        _ratingItems.push({
          id: secId,
          injId: inj.id,
          secIndex: si,
          name: sec,
          rating: existing !== undefined ? existing : (secSuggested !== null ? secSuggested : 10),
          extremity: injSecExtremities[sec] || 'none',
          type: 'secondary',
          parentId: inj.id,
          suggested: secSuggested,
        });
      });
    }
  });
  // (Vocational/war-related conditions moved to Special Claims tab — not rated here)

  // Helper: push secondaries from any condition ref into _ratingItems
  function _pushSecondaries(parentId, ref){
    const secs = ref.secondaries || [];
    const secRatings = ref.secondaryRatings || {};
    const secExtremities = ref.secondaryExtremities || {};
    secs.forEach((sec, si) => {
      const secLower = sec.toLowerCase();
      if(mhNames.has(secLower) || mhSecondaryNames.has(secLower)){
        const secSuggested = getSuggestedRating(sec);
        const rating = secRatings[sec] || (secSuggested !== null ? secSuggested : 0);
        _mhSecondaryDisplay.push({ name: sec, rating: rating, parentName: ref.condition || '' });
        return;
      }
      const secSuggested = getSuggestedRating(sec);
      const rating = secRatings[sec] || (secSuggested !== null ? secSuggested : 10);
      _ratingItems.push({
        id: 'es-' + parentId + '-' + si,
        name: sec,
        rating: rating,
        extremity: secExtremities[sec] || 'none',
        type: 'secondary',
        parentId: parentId,
        suggested: secSuggested,
        _evalRef: ref,
        _secName: sec,
      });
    });
  }

  // Head & Face conditions (each rated separately)
  const headConds = window._headConditions || [];
  headConds.forEach((cond, ci) => {
    if(cond.effectiveRating > 0){
      _ratingItems.push({
        id: 'hd-' + cond.id,
        name: cond.condition,
        rating: cond.effectiveRating,
        extremity: cond.extremity || 'none',
        type: 'head',
        suggested: cond.calculatedRating,
      });
    }
    _pushSecondaries('hd-' + cond.id, cond);
  });

  // Body part evaluated conditions (knee, back, shoulder, etc.)
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      const bpConds = window[cfg.stateKey] || [];
      bpConds.forEach(cond => {
        if(cond.effectiveRating > 0){
          _ratingItems.push({
            id: 'bp-' + cond.id,
            name: cond.condition,
            rating: cond.effectiveRating,
            extremity: cond.extremity || 'none',
            type: cfg.id,
            suggested: cond.calculatedRating,
          });
        }
        _pushSecondaries('bp-' + cond.id, cond);
      });
    });
  }

  // Mental health conditions — VA single rating rule:
  // ALL mental health diagnoses (from MH panel + MST) get ONE combined rating (the highest).
  const mhConds = window._mentalHealthConditions || [];
  const mstData = window._mstData || { conditions: [], privacyShield: true };

  // MST conditions that are mental health diagnoses participate in the MH single-rating pool
  const _MST_MH_NAMES = new Set([
    'ptsd','major depressive disorder','generalized anxiety disorder',
    'panic disorder','adjustment disorder','insomnia / sleep disturbance',
    'substance use disorder','eating disorder','somatic symptom disorder',
    'other condition related to mst'
  ]);

  // Build unified pool of all MH ratings (panel + MST)
  const _mhPool = [];
  mhConds.forEach(c => {
    _mhPool.push({ rating: c.effectiveRating, name: c.condition, source:'mh', ref:c, suggested: c.calculatedRating });
  });
  if(mstData.conditions && mstData.conditions.length){
    mstData.conditions.forEach((cond, i) => {
      if(_MST_MH_NAMES.has(cond.name.toLowerCase())){
        const displayName = mstData.privacyShield ? 'Private Condition (MST)' : cond.name;
        _mhPool.push({ rating: cond.rating, name: displayName, _realName: cond.name, source:'mst', index:i, isMSTPrivate: mstData.privacyShield });
      }
    });
  }

  // Apply single highest MH rating across all sources
  if(_mhPool.length){
    const highest = _mhPool.reduce((best, item) => item.rating > best.rating ? item : best, _mhPool[0]);
    if(highest.rating > 0){
      _ratingItems.push({
        id: highest.source === 'mh' ? 'mh-' + highest.ref.id : 'mst-mh-' + highest.index,
        name: 'Mental Health (' + highest.name + ')',
        rating: highest.rating,
        extremity: 'none',
        type: 'mental',
        suggested: highest.suggested || null,
        isMSTPrivate: highest.isMSTPrivate || false,
      });
    }
    // MH secondaries from panel conditions
    mhConds.forEach(c => _pushSecondaries('mh-' + c.id, c));
    // MH secondaries from MST mental health conditions
    if(mstData.conditions && mstData.conditions.length){
      mstData.conditions.forEach((cond, i) => {
        if(_MST_MH_NAMES.has(cond.name.toLowerCase()) && cond.secondaries && cond.secondaries.length){
          cond.secondaries.forEach((sec, j) => {
            if(sec.rating > 0){
              _ratingItems.push({
                id: 'mst-mh-' + i + '-sec-' + j,
                name: mstData.privacyShield ? 'Private Secondary' : sec.name + ' (secondary to ' + cond.name + ')',
                _realName: sec.name + ' (secondary to ' + cond.name + ')',
                rating: sec.rating,
                extremity: 'none',
                type: 'secondary',
                isMSTPrivate: mstData.privacyShield,
              });
            }
          });
        }
      });
    }
  }

  // MST non-mental-health conditions (physical symptoms) remain as separate rating items
  if(mstData.conditions && mstData.conditions.length){
    mstData.conditions.forEach((cond, i) => {
      if(!_MST_MH_NAMES.has(cond.name.toLowerCase())){
        if(cond.rating > 0){
          _ratingItems.push({
            id: 'mst-' + i,
            name: mstData.privacyShield ? 'Private Condition' : cond.name,
            _realName: cond.name,
            rating: cond.rating,
            extremity: 'none',
            type: 'mst',
            isMSTPrivate: mstData.privacyShield,
          });
        }
        if(cond.secondaries && cond.secondaries.length){
          cond.secondaries.forEach((sec, j) => {
            if(sec.rating > 0){
              _ratingItems.push({
                id: 'mst-' + i + '-sec-' + j,
                name: mstData.privacyShield ? 'Private Secondary' : sec.name + ' (secondary to ' + cond.name + ')',
                _realName: sec.name + ' (secondary to ' + cond.name + ')',
                rating: sec.rating,
                extremity: 'none',
                type: 'mst',
                isMSTPrivate: mstData.privacyShield,
              });
            }
          });
        }
      }
    });
  }
}

function saveRatingToInjury(itemId, rating){
  const item = _ratingItems.find(r=>r.id===itemId);
  if(!item) return;
  item.rating = rating;
  if(item.type==='primary'){
    const inj = injuries.find(i=>i.id===item.injId);
    if(inj) inj._assignedRating = rating;
  } else if(item.type==='secondary'){
    // Eval-panel secondaries (es-*) store on the condition ref
    if(item._evalRef && item._secName){
      if(!item._evalRef.secondaryRatings) item._evalRef.secondaryRatings = {};
      item._evalRef.secondaryRatings[item._secName] = rating;
    } else {
      // Physical injury secondaries
      const inj = injuries.find(i=>i.id===item.injId);
      if(inj){
        if(!inj._secondaryRatings) inj._secondaryRatings = {};
        inj._secondaryRatings[item.secIndex] = rating;
      }
    }
  } else if(item.type==='vocational'){
    const vi = parseInt(item.id.replace('v-',''));
    if(!window._vocRatings) window._vocRatings = {};
    window._vocRatings[vi] = rating;
  }
}

// ── PYRAMIDING & DUPLICATION DETECTION (38 CFR 4.14) ──
// Pairs of conditions that commonly share symptoms and should not be rated separately
const PYRAMIDING_RISKS = [
  // Knee
  ['Knee osteoarthritis', 'Chondromalacia patella', 'Both are cartilage problems in the knee. The VA usually treats these as the same condition and won\'t rate both.'],
  ['Knee osteoarthritis', 'Patellofemoral syndrome', 'Kneecap pain (patellofemoral) and arthritis cause similar symptoms. The VA may consider these the same disability.'],
  ['Rotator cuff tear / tendinopathy', 'Shoulder impingement', 'Shoulder impingement is often caused by a rotator cuff problem. The VA may see these as the same issue.'],
  // Back
  ['Lumbar strain / sprain', 'Degenerative disc disease (lumbar)', 'Both are rated based on how far you can bend your back. The VA uses the same rating criteria for both, so rating them separately is not allowed.'],
  ['Lumbar disc herniation', 'Intervertebral disc syndrome (IVDS)', 'A herniated disc is a type of disc syndrome (IVDS). These are usually the same condition described two ways.'],
  ['Degenerative disc disease (lumbar)', 'Intervertebral disc syndrome (IVDS)', 'Degenerative disc disease and disc syndrome (IVDS) often describe the same problem. The VA rates the spine under one formula.'],
  // Neck
  ['Cervical strain / sprain', 'Cervical disc disease (DDD)', 'Both are rated on how far you can move your neck. Rating both separately is not allowed because they use the same criteria.'],
  // Hip
  ['Hip osteoarthritis', 'Hip impingement (FAI)', 'Hip impingement often leads to arthritis over time. The VA may treat these as the same disability.'],
  // Ankle/Foot
  ['Plantar fasciitis', 'Heel spurs', 'Heel spurs and heel/arch pain (plantar fasciitis) usually go together. The VA often considers them the same condition.'],
  ['Flat feet (pes planus)', 'Plantar fasciitis', 'Flat feet and heel/arch pain cause similar foot problems. The VA may rate these together instead of separately.'],
  // Elbow
  ['Lateral epicondylitis (tennis elbow)', 'Elbow arthritis', 'If both are causing the same elbow pain and stiffness, the VA may consider this the same disability.'],
];

function _detectRatingWarnings(){
  const warnings = [];
  // Get all rated conditions from all sources
  const allConds = [];

  // From evaluation panels
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      (window[cfg.stateKey]||[]).forEach(c => {
        if(c.effectiveRating > 0){
          allConds.push({ name: c.condition, extremity: c.extremity||'none', source: cfg.id });
        }
      });
    });
  }

  // From injuries (_ratingItems)
  _ratingItems.forEach(item => {
    if(item.rating > 0){
      allConds.push({ name: item.name, extremity: item.extremity||'none', source: 'injury' });
    }
  });

  // 1. Duplicate detection — same condition name + same extremity from different sources
  const seen = {};
  allConds.forEach(c => {
    const key = c.name.toLowerCase() + '|' + c.extremity;
    if(!seen[key]) seen[key] = [];
    seen[key].push(c);
  });
  Object.entries(seen).forEach(([key, items]) => {
    if(items.length > 1){
      warnings.push({
        type: 'duplicate',
        title: 'Possible Duplicate',
        condition: items[0].name,
        message: '"' + items[0].name + '" appears to be rated ' + items.length + ' times on the same side. The VA will not rate the same condition twice.',
      });
    }
  });

  // 2. Pyramiding detection — check known overlapping pairs on the same extremity
  PYRAMIDING_RISKS.forEach(([condA, condB, reason]) => {
    const aLower = condA.toLowerCase();
    const bLower = condB.toLowerCase();
    allConds.forEach(c1 => {
      if(c1.name.toLowerCase() !== aLower) return;
      allConds.forEach(c2 => {
        if(c2.name.toLowerCase() !== bLower) return;
        // Same extremity (or both 'none' for non-extremity conditions)
        if(c1.extremity === c2.extremity){
          // Avoid duplicate warnings
          const warnKey = [aLower, bLower, c1.extremity].sort().join('|');
          if(!warnings.find(w => w._key === warnKey)){
            warnings.push({
              type: 'pyramiding',
              title: 'Possible Pyramiding (38 CFR 4.14)',
              condition: condA + ' + ' + condB,
              message: reason,
              _key: warnKey,
            });
          }
        }
      });
    });
  });

  return warnings;
}

// ── CALCULATE ──
function calculateVARating(){
  const items = _ratingItems.filter(r=>r.rating > 0);
  if(!items.length) return { combined:0, rounded:0, items:[], breakdown:'', bilateral:false, bilateralFactor:0 };

  const upperLeft = items.filter(d=>d.extremity==='LU');
  const upperRight = items.filter(d=>d.extremity==='RU');
  const lowerLeft = items.filter(d=>d.extremity==='LL');
  const lowerRight = items.filter(d=>d.extremity==='RL');
  const nonBilateral = items.filter(d=>d.extremity==='none');

  const hasUpperBil = upperLeft.length>0 && upperRight.length>0;
  const hasLowerBil = lowerLeft.length>0 && lowerRight.length>0;

  // Track {rating, name} pairs so breakdown can show condition names
  let bilateralEntries = [];   // {rating, name}
  let nonBilateralEntries = nonBilateral.map(d=>({rating:d.rating, name:d.name}));
  let bilateralFactorTotal = 0;
  let log = '';

  log += 'STEP-BY-STEP VA COMBINED RATING\n';
  log += '='.repeat(44) + '\n\n';

  // List all items
  log += 'RATED CONDITIONS:\n';
  log += '-'.repeat(44) + '\n';
  items.forEach((d,i)=>{
    const tag = d.extremity!=='none' ? ` [${d.extremity}]` : '';
    const typeTag = d.type==='secondary' ? ' (Secondary)' : d.type==='vocational' ? ' (Vocational)' : '';
    log += `  ${i+1}. ${d.rating}% — ${d.name}${tag}${typeTag}\n`;
  });
  log += '\n';

  if(hasUpperBil){
    const ur = [...upperLeft, ...upperRight];
    const uRatings = ur.map(d=>d.rating);
    const c = combineVARatings(uRatings);
    const bf = c * 0.10;
    const wb = c + bf;
    log += 'UPPER BILATERAL (38 CFR 4.26):\n';
    log += '-'.repeat(44) + '\n';
    ur.forEach(d=>{ log += `  ${d.rating}% — ${d.name} [${d.extremity}]\n`; });
    log += `  Combined: ${c.toFixed(2)}%\n`;
    log += `  Bilateral factor (10%): +${bf.toFixed(2)}%\n`;
    log += `  With factor: ${wb.toFixed(2)}% → ${Math.round(wb)}%\n\n`;
    bilateralEntries.push({rating:Math.round(wb), name:'Upper Bilateral (' + ur.map(d=>d.name).join(' + ') + ')'});
    bilateralFactorTotal += bf;
  } else {
    [...upperLeft, ...upperRight].forEach(d=>nonBilateralEntries.push({rating:d.rating, name:d.name}));
  }

  if(hasLowerBil){
    const lr = [...lowerLeft, ...lowerRight];
    const lRatings = lr.map(d=>d.rating);
    const c = combineVARatings(lRatings);
    const bf = c * 0.10;
    const wb = c + bf;
    log += 'LOWER BILATERAL (38 CFR 4.26):\n';
    log += '-'.repeat(44) + '\n';
    lr.forEach(d=>{ log += `  ${d.rating}% — ${d.name} [${d.extremity}]\n`; });
    log += `  Combined: ${c.toFixed(2)}%\n`;
    log += `  Bilateral factor (10%): +${bf.toFixed(2)}%\n`;
    log += `  With factor: ${wb.toFixed(2)}% → ${Math.round(wb)}%\n\n`;
    bilateralEntries.push({rating:Math.round(wb), name:'Lower Bilateral (' + lr.map(d=>d.name).join(' + ') + ')'});
    bilateralFactorTotal += bf;
  } else {
    [...lowerLeft, ...lowerRight].forEach(d=>nonBilateralEntries.push({rating:d.rating, name:d.name}));
  }

  const allEntries = [...bilateralEntries, ...nonBilateralEntries].sort((a,b)=>b.rating-a.rating);
  log += 'COMBINED RATINGS (38 CFR 4.25):\n';
  log += '-'.repeat(44) + '\n';
  log += `Sorted: ${allEntries.map(e=>e.rating+'% '+e.name).join(', ')}\n\n`;

  if(!allEntries.length){
    return { combined:0, rounded:0, items, breakdown:log, bilateral:false, bilateralFactor:0, steps:[] };
  }

  let combined = allEntries[0].rating;
  const steps = [{name:allEntries[0].name, rating:allEntries[0].rating, running:combined}];
  log += `Start with highest: ${allEntries[0].rating}% (${allEntries[0].name})\n`;
  for(let i=1; i<allEntries.length; i++){
    const rem = 100 - combined;
    const add = (allEntries[i].rating/100) * rem;
    combined += add;
    steps.push({name:allEntries[i].name, rating:allEntries[i].rating, add:add, running:combined});
    log += `  + ${allEntries[i].rating}% (${allEntries[i].name}) of ${rem.toFixed(2)} remaining = ${add.toFixed(2)}\n`;
    log += `  = ${combined.toFixed(2)}%\n`;
  }

  const whole = Math.round(combined);
  const final10 = Math.round(whole/10)*10;
  log += '\n' + '-'.repeat(44) + '\n';
  log += `Exact: ${combined.toFixed(2)}%\n`;
  log += `Rounded to whole: ${whole}%\n`;
  log += `Final (nearest 10): ${final10}%\n`;
  if(bilateralFactorTotal>0) log += `Bilateral factor contributed: ${bilateralFactorTotal.toFixed(2)}%\n`;

  return {
    combined: combined,
    rounded: final10,
    items: items,
    breakdown: log,
    bilateral: hasUpperBil || hasLowerBil,
    bilateralFactor: bilateralFactorTotal,
    steps: steps,
  };
}

// ── RENDER ──
const _EXT_TIPS = {
  LU:'Left Upper (left arm/shoulder)',RU:'Right Upper (right arm/shoulder)',
  LL:'Left Lower (left leg/knee/ankle)',RL:'Right Lower (right leg/knee/ankle)',
};
function _extTip(ext){ return _EXT_TIPS[ext] ? ' <span class="tip" data-tip="'+_EXT_TIPS[ext]+' — Used for bilateral factor calculation. Paired extremities (both sides) get a 10% bonus.">?</span>' : ''; }

function renderRating(){
  const c = document.getElementById('rc-list');
  buildRatingItems();

  const hasBPConds = typeof BP_REGISTRY!=='undefined' && Object.values(BP_REGISTRY).some(cfg=>(window[cfg.stateKey]||[]).length>0);
  if(!_ratingItems.length && !(window._mentalHealthConditions && window._mentalHealthConditions.length) && !(window._headConditions && window._headConditions.length) && !hasBPConds){
    c.innerHTML = '<div class="empty">No injuries logged yet.<br>Add injuries from the Body Map tab to calculate your combined VA rating.</div>';
    updateRatingCount();
    return;
  }

  let html = '';

  // Pyramiding / duplication warnings
  const _warnings = _detectRatingWarnings();
  if(_warnings.length){
    html += '<div class="rc-warnings">';
    _warnings.forEach(w => {
      const icon = w.type === 'duplicate' ? '&#9888;' : '&#9878;';
      const cls = w.type === 'duplicate' ? 'rc-warn-dup' : 'rc-warn-pyr';
      html += '<div class="rc-warning ' + cls + '">' +
        '<div class="rc-warning-header">' + icon + ' ' + w.title + '</div>' +
        '<div class="rc-warning-cond">' + w.condition + '</div>' +
        '<div class="rc-warning-msg">' + w.message + '</div>' +
      '</div>';
    });
    html += '</div>';
  }

  // Info box
  html += `<div class="rc-info">
    <strong>How VA combined ratings work</strong> <span class="tip" data-tip="The VA doesn't just add your percentages together. Each rating is applied to what's left of your 'whole person.' Think of it like this: if you're 50% disabled, you have 50% of a whole person left. Your next rating only applies to that remaining 50%.">?</span>: Ratings are not added together. Each rating is applied to the remaining "whole person" percentage.
    Example: 50% + 30% = 50 + (30% &times; 50 remaining) = 65%, rounded to 70%.
    Bilateral factor <span class="tip" data-tip="If the same type of condition affects both sides of your body (e.g., both knees, both shoulders), the VA adds a 10% bonus to those conditions before combining them with your other ratings.">?</span> (10%) is auto-applied when paired extremities are both rated.
  </div>`;

  // Primary injuries section
  const primaries = _ratingItems.filter(r=>r.type==='primary');
  const secondaries = _ratingItems.filter(r=>r.type==='secondary');

  if(primaries.length){
    html += '<div class="rc-section-title">Primary Conditions <span class="tip" data-tip="These are your main service-connected injuries — conditions directly caused by something that happened during your military service.">?</span></div>';
    primaries.forEach(item => {
      const inj = injuries.find(i=>i.id===item.injId);
      const num = inj ? injuryNumber(inj.id) : '?';
      const sc = inj ? (SC[inj.severity]||SC.custom) : SC.custom;
      const sugTxt = item.suggested!==null ? `<span class="rc-suggest" title="Common VA rating for this condition">Suggested: ${item.suggested}%</span>` : '';
      const secs = secondaries.filter(s=>s.parentId===item.injId);
      const extTag = item.extremity !== 'none' ? `<span class="rc-ext-tag">${item.extremity}${_extTip(item.extremity)}</span>` : '';

      html += `<div class="rc-card">
        <div class="rc-card-header">
          <span class="rc-num" style="background:${sc};">${num}</span>
          <span class="rc-name">${item.name}</span>
          ${extTag}
          ${sugTxt}
          <span class="rc-pct-box">
            <input type="number" min="0" max="100" step="10" value="${item.rating}" onchange="onRatingChange('${item.id}',this.value)" class="rc-pct-input" title="Override rating %">
            <span class="rc-pct-sign">%</span>
          </span>
        </div>`;

      // Nested secondary conditions
      if(secs.length){
        html += '<div class="rc-secs">';
        secs.forEach(sec => {
          const secSugTxt = sec.suggested!==null ? `<span class="rc-suggest">Suggested: ${sec.suggested}%</span>` : '';
          const secExtTag = sec.extremity && sec.extremity !== 'none' ? `<span class="rc-ext-tag">${sec.extremity}</span>` : '';
          html += `<div class="rc-sec-item">
            <div class="rc-sec-header">
              <span class="rc-sec-dot">&#8627;</span>
              <span class="rc-sec-name">${sec.name}</span>
              ${secExtTag}
              ${secSugTxt}
              <span class="rc-pct-box">
                <input type="number" min="0" max="100" step="10" value="${sec.rating}" onchange="onRatingChange('${sec.id}',this.value)" class="rc-pct-input" title="Override rating %">
                <span class="rc-pct-sign">%</span>
              </span>
            </div>
          </div>`;
        });
        html += '</div>';
      }
      html += '</div>';
    });
  }

  // Helper: render secondaries nested under a parent card
  function _renderEvalSecs(parentId){
    const secs = secondaries.filter(s=>s.parentId===parentId);
    if(!secs.length) return '';
    let sh = '<div class="rc-secs">';
    secs.forEach(sec => {
      const secSugTxt = sec.suggested!==null ? '<span class="rc-suggest">Suggested: '+sec.suggested+'%</span>' : '';
      const secExtTag = sec.extremity && sec.extremity !== 'none' ? '<span class="rc-ext-tag">'+sec.extremity+'</span>' : '';
      sh += '<div class="rc-sec-item"><div class="rc-sec-header">' +
        '<span class="rc-sec-dot">&#8627;</span>' +
        '<span class="rc-sec-name">'+sec.name+'</span>' +
        secExtTag +
        secSugTxt +
        '<span class="rc-pct-box"><input type="number" min="0" max="100" step="10" value="'+sec.rating+'" onchange="onRatingChange(\''+sec.id+'\',this.value)" class="rc-pct-input" title="Override rating %"><span class="rc-pct-sign">%</span></span>' +
      '</div></div>';
    });
    sh += '</div>';
    return sh;
  }

  // Head & Face section
  const hdItems = _ratingItems.filter(r=>r.type==='head');
  const hdConds = window._headConditions || [];
  if(hdConds.length){
    html += '<div class="rc-section-title" style="margin-top:20px;">Head & Face Conditions</div>';
    html += '<div class="rc-info" style="margin-bottom:10px;font-size:11px;">Each head/face condition is rated independently under its own diagnostic code.</div>';
    hdConds.forEach(cond => {
      const profile = HEAD_PROFILES[cond.profile] || HEAD_PROFILES.generic;
      const profileLabel = profile.label.split('(')[0].trim();
      const domainSummary = profile.domains.map(d => {
        const v = cond.domains[d.id];
        if(!v) return null;
        const lv = d.levels.find(l => l.value === v);
        return lv ? d.label.split(':').pop().trim() + ': ' + v + '%' : null;
      }).filter(Boolean).join(', ') || 'Not evaluated';
      const inRating = hdItems.some(r => r.id === 'hd-' + cond.id);

      html += '<div class="rc-card" style="border-left:3px solid ' + (inRating ? 'var(--navy)' : 'var(--border)') + ';">' +
        '<div class="rc-card-header">' +
          '<span class="rc-num" style="background:var(--navy);">&#129504;</span>' +
          '<span class="rc-name">' + cond.condition + '</span>' +
          '<span style="font-size:9px;font-weight:600;font-family:var(--fh);color:var(--muted);background:var(--bg);border:1px solid var(--border);padding:2px 6px;border-radius:3px;">' + profileLabel + '</span>' +
          (cond.manualOverride !== null ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:#7c3aed;background:#f5f3ff;border:1px solid #ddd6fe;padding:2px 6px;border-radius:3px;text-transform:uppercase;letter-spacing:.5px;">Manual</span>' : '') +
          '<span class="rc-pct-box"><input type="number" min="0" max="100" step="10" value="' + cond.effectiveRating + '" onchange="onEvalRatingChange(\'head\',' + cond.id + ',this.value)" class="rc-pct-input" title="Override rating %"><span class="rc-pct-sign">%</span></span>' +
        '</div>' +
        '<div style="padding:8px 16px 12px;font-size:12px;color:var(--muted);">' +
          '<div>' + domainSummary + '</div>' +
          '<div style="margin-top:4px;font-weight:700;font-family:var(--fm);color:var(--navy);">' +
            cond.effectiveRating + '%' + (cond.manualOverride !== null ? ' (override)' : '') +
            (cond.calculatedRating !== cond.effectiveRating ? ' <span style="color:var(--muted);font-weight:400;">(calculated: ' + cond.calculatedRating + '%)</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
      html += _renderEvalSecs('hd-' + cond.id);
    });
  }

  // Body part evaluated sections (Knee, Back, Shoulder, etc.)
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      const bpConds = window[cfg.stateKey] || [];
      if(!bpConds.length) return;
      const bpItems = _ratingItems.filter(r=>r.type===cfg.id);
      html += '<div class="rc-section-title" style="margin-top:20px;">'+cfg.title+'</div>';
      html += '<div class="rc-info" style="margin-bottom:10px;font-size:11px;">'+cfg.note+'</div>';
      bpConds.forEach(cond => {
        const profile = cfg.profiles()[cond.profile] || cfg.profiles().generic;
        const profileLabel = profile.label.split('(')[0].trim();
        const domainSummary = profile.domains.map(d => {
          const v = cond.domains[d.id];
          if(!v) return null;
          return d.label.split(':').pop().trim() + ': ' + v + '%';
        }).filter(Boolean).join(', ') || 'Not evaluated';
        const inRating = bpItems.some(r => r.id === 'bp-' + cond.id);
        const extTag = cond.extremity && cond.extremity !== 'none' ? '<span class="rc-ext-tag">'+cond.extremity+'</span>' : '';

        html += '<div class="rc-card" style="border-left:3px solid ' + (inRating ? 'var(--navy)' : 'var(--border)') + ';">' +
          '<div class="rc-card-header">' +
            '<span class="rc-num" style="background:var(--navy);">&#9881;</span>' +
            '<span class="rc-name">' + cond.condition + '</span>' +
            extTag +
            '<span style="font-size:9px;font-weight:600;font-family:var(--fh);color:var(--muted);background:var(--bg);border:1px solid var(--border);padding:2px 6px;border-radius:3px;">' + profileLabel + '</span>' +
            (cond.manualOverride !== null ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:#7c3aed;background:#f5f3ff;border:1px solid #ddd6fe;padding:2px 6px;border-radius:3px;text-transform:uppercase;letter-spacing:.5px;">Manual</span>' : '') +
            '<span class="rc-pct-box"><input type="number" min="0" max="100" step="10" value="' + cond.effectiveRating + '" onchange="onEvalRatingChange(\'' + cfg.id + '\',' + cond.id + ',this.value)" class="rc-pct-input" title="Override rating %"><span class="rc-pct-sign">%</span></span>' +
          '</div>' +
          '<div style="padding:8px 16px 12px;font-size:12px;color:var(--muted);">' +
            '<div>' + domainSummary + '</div>' +
            '<div style="margin-top:4px;font-weight:700;font-family:var(--fm);color:var(--navy);">' +
              cond.effectiveRating + '%' + (cond.manualOverride !== null ? ' (override)' : '') +
              (cond.calculatedRating !== cond.effectiveRating ? ' <span style="color:var(--muted);font-weight:400;">(calculated: ' + cond.calculatedRating + '%)</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
        html += _renderEvalSecs('bp-' + cond.id);
      });
    });
  }

  // Mental health section
  const mhItems = _ratingItems.filter(r=>r.type==='mental');
  const mhConds = window._mentalHealthConditions || [];
  // Collect MST MH conditions for display in the MH section
  const _mstMHDisplay = [];
  const _mstPrivate = window._mstData && window._mstData.privacyShield;
  const _MST_MH_NAMES_RENDER = new Set([
    'ptsd','major depressive disorder','generalized anxiety disorder',
    'panic disorder','adjustment disorder','insomnia / sleep disturbance',
    'substance use disorder','eating disorder','somatic symptom disorder',
    'other condition related to mst'
  ]);
  if(window._mstData && window._mstData.conditions){
    window._mstData.conditions.forEach((cond, i) => {
      if(_MST_MH_NAMES_RENDER.has(cond.name.toLowerCase())){
        _mstMHDisplay.push({ name: _mstPrivate ? 'Private Condition (MST)' : cond.name, rating: cond.rating, index: i, isMST: true });
      }
    });
  }

  if(mhConds.length || _mhSecondaryDisplay.length || _mstMHDisplay.length){
    html += '<div class="rc-section-title" style="margin-top:20px;">Mental Health (VA Single Rating) <span class="tip" data-tip="Unlike physical conditions, the VA gives you ONE rating for all mental health conditions combined. Even if you have PTSD, depression, and anxiety, they all fall under one mental health rating — your highest evaluated condition becomes that rating. This includes MST-caused mental health conditions.">?</span></div>';
    html += `<div class="rc-info" style="margin-bottom:10px;font-size:11px;">
      The VA rates all mental health conditions under one combined rating. The highest evaluated rating (${mhItems.length ? mhItems[0].rating + '%' : '0%'}) is used.
      <br>Mental health secondaries are absorbed into this single rating and not double-counted.
      ${_mstMHDisplay.length ? '<br><strong>MST-caused mental health conditions</strong> are included in this pool per VA rules.' : ''}
    </div>`;
    mhConds.forEach(cond => {
      const isHighest = mhItems.length && mhItems[0].id === 'mh-' + cond.id;
      const borderColor = isHighest ? 'var(--red)' : 'var(--border)';
      const domainSummary = MH_DOMAINS.map(d => {
        const lv = cond.domains[d.id].level;
        return lv !== 'none' ? d.label.split(' ')[0] + ': ' + MH_IMPAIRMENT_LABELS[lv] : null;
      }).filter(Boolean).join(', ') || 'Not evaluated';

      html += `<div class="rc-card" style="border-left:3px solid ${borderColor};">
        <div class="rc-card-header">
          <span class="rc-num" style="background:var(--navy);">&#9881;</span>
          <span class="rc-name">${cond.condition}</span>
          ${isHighest ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:var(--red);background:#fef2f2;border:1px solid #fecaca;padding:2px 6px;border-radius:3px;text-transform:uppercase;letter-spacing:.5px;">Active Rating</span>' : ''}
          ${cond.manualOverride !== null ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:#7c3aed;background:#f5f3ff;border:1px solid #ddd6fe;padding:2px 6px;border-radius:3px;text-transform:uppercase;letter-spacing:.5px;">Manual</span>' : ''}
          <span class="rc-pct-box"><input type="number" min="0" max="100" step="10" value="${cond.effectiveRating}" onchange="onEvalRatingChange('mental',${cond.id},this.value)" class="rc-pct-input" title="Override rating %"><span class="rc-pct-sign">%</span></span>
        </div>
        <div style="padding:8px 16px 12px;font-size:12px;color:var(--muted);">
          <div>${domainSummary}</div>
          <div style="margin-top:4px;font-weight:700;font-family:var(--fm);color:var(--navy);">
            ${cond.effectiveRating}%${cond.manualOverride !== null ? ' (override)' : ''}
            ${cond.calculatedRating !== cond.effectiveRating ? ' <span style="color:var(--muted);font-weight:400;">(calculated: ' + cond.calculatedRating + '%)</span>' : ''}
          </div>
        </div>
      </div>`;
      html += _renderEvalSecs('mh-' + cond.id);
    });

    // MST mental health conditions shown in this section
    if(_mstMHDisplay.length){
      html += '<div style="margin-top:12px;font-size:11px;font-weight:700;font-family:var(--fh);color:var(--muted);text-transform:uppercase;letter-spacing:.5px;padding:0 4px;">MST-Caused Mental Health Conditions</div>';
      _mstMHDisplay.forEach(mstCond => {
        const isHighest = mhItems.length && (mhItems[0].id === 'mst-mh-' + mstCond.index);
        const borderColor = isHighest ? 'var(--red)' : (_mstPrivate ? '#6b7280' : 'var(--border)');
        html += '<div class="rc-card" style="border-left:3px solid ' + borderColor + ';">' +
          '<div class="rc-card-header">' +
            '<span class="rc-num" style="background:' + (_mstPrivate ? '#6b7280' : 'var(--navy)') + ';">' + (_mstPrivate ? '&#128274;' : '&#9878;') + '</span>' +
            '<span class="rc-name">' + escapeHTML(mstCond.name) + '</span>' +
            (isHighest ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:var(--red);background:#fef2f2;border:1px solid #fecaca;padding:2px 6px;border-radius:3px;text-transform:uppercase;letter-spacing:.5px;">Active Rating</span>' : '') +
            '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:#7c3aed;background:#f5f3ff;border:1px solid #ddd6fe;padding:2px 6px;border-radius:3px;text-transform:uppercase;letter-spacing:.5px;">MST</span>' +
            '<span class="rc-pct-box"><span style="font-size:13px;font-weight:700;font-family:var(--fm);color:var(--navy);">' + mstCond.rating + '%</span></span>' +
          '</div>' +
          '<div style="padding:4px 16px 8px;font-size:11px;color:var(--muted);font-style:italic;">Included in single MH rating per VA rules. Managed in Special Claims &gt; MST.</div>' +
        '</div>';
      });
    }

    // MH conditions appearing as secondaries to other claims
    if(_mhSecondaryDisplay.length){
      html += '<div style="margin-top:12px;font-size:11px;font-weight:700;font-family:var(--fh);color:var(--muted);text-transform:uppercase;letter-spacing:.5px;padding:0 4px;">Mental Health Secondaries</div>';
      _mhSecondaryDisplay.forEach(sec => {
        html += '<div class="rc-card" style="border-left:3px solid var(--border);">' +
          '<div class="rc-card-header">' +
            '<span class="rc-sec-dot">&#8627;</span>' +
            '<span class="rc-name">' + escapeHTML(sec.name) + '</span>' +
            '<span style="font-size:9px;font-weight:600;font-family:var(--fh);color:var(--muted);background:var(--bg);border:1px solid var(--border);padding:2px 6px;border-radius:3px;">Secondary to ' + escapeHTML(sec.parentName) + '</span>' +
            '<span class="rc-pct-box"><span style="font-size:13px;font-weight:700;font-family:var(--fm);color:var(--navy);">' + sec.rating + '%</span></span>' +
          '</div>' +
          '<div style="padding:4px 16px 8px;font-size:11px;color:var(--muted);font-style:italic;">Absorbed into single MH rating per VA rules — not double-counted in combined calculation.</div>' +
        '</div>';
      });
    }
  }

  // MST non-mental-health conditions (physical symptoms from MST)
  const mstItems = _ratingItems.filter(r=>r.type==='mst');
  if(mstItems.length){
    html += '<div class="rc-section-title" style="margin-top:20px;">' +
      (_mstPrivate ? '&#128274; MST Physical Conditions' : 'MST-Related Physical Conditions') +
    '</div>';
    if(_mstPrivate){
      html += '<div class="rc-info" style="margin-bottom:10px;font-size:11px;">Privacy Shield is ON. Details are hidden. Go to Special Claims to manage.</div>';
    } else {
      html += '<div class="rc-info" style="margin-bottom:10px;font-size:11px;">Physical conditions caused by MST. These are rated separately (not under the mental health single rating).</div>';
    }
    mstItems.forEach(item => {
      html += '<div class="rc-card" style="border-left:3px solid ' + (_mstPrivate ? '#6b7280' : 'var(--navy)') + ';">' +
        '<div class="rc-card-header">' +
          '<span class="rc-num" style="background:' + (_mstPrivate ? '#6b7280' : 'var(--navy)') + ';">' + (_mstPrivate ? '&#128274;' : '&#9878;') + '</span>' +
          '<span class="rc-name">' + escapeHTML(item.name) + '</span>' +
          '<span class="rc-pct-box"><span style="font-size:13px;font-weight:700;font-family:var(--fm);color:var(--navy);">' + item.rating + '%</span></span>' +
        '</div>' +
      '</div>';
    });
  }

  // Special Claims & Entitlements
  const _hasSpecials = (typeof SPECIAL_CLAIM_TYPES !== 'undefined' && window._specialClaims &&
    SPECIAL_CLAIM_TYPES.some(item => window._specialClaims[item.id]));
  const _hasSmcSels = (window._smcSelections || []).length > 0;
  const _hasPresumptive = typeof PRESUMPTIVE_CLAIMS !== 'undefined' &&
    PRESUMPTIVE_CLAIMS.some(c => window._presumptiveData && window._presumptiveData[c.id] && window._presumptiveData[c.id].selected);

  if(_hasSpecials || _hasSmcSels || _hasPresumptive){
    html += '<div class="rc-section-title" style="margin-top:20px;">Special Claims & Entitlements <span class="tip" data-tip="These are separate from your disability percentage. SMC payments, presumptive connections, and other entitlements don\'t change your combined rating number — but they can significantly increase your total monthly compensation.">?</span></div>';
    html += '<div class="rc-info" style="margin-bottom:10px;font-size:11px;">These represent special entitlements or circumstances. They do not contribute to the combined percentage rating but may affect total compensation.</div>';

    // SMC selections
    if(_hasSmcSels){
      const smcLevelsRef = typeof SMC_LEVELS !== 'undefined' ? SMC_LEVELS : [];
      (window._smcSelections||[]).forEach(id => {
        const smc = smcLevelsRef.find(s => s.id === id);
        if(!smc) return;
        html += '<div class="rc-card" style="border-left:3px solid var(--navy);">' +
          '<div class="rc-card-header">' +
            '<span class="rc-num" style="background:var(--navy);">&#9733;</span>' +
            '<span class="rc-name">' + escapeHTML(smc.label) + '</span>' +
            '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:var(--navy);background:#eff6ff;border:1px solid #bfdbfe;padding:2px 6px;border-radius:3px;text-transform:uppercase;letter-spacing:.5px;">Extra Payment</span>' +
          '</div>' +
        '</div>';
      });
    }

    // Presumptive service connection
    if(_hasPresumptive){
      const presClaimsRef = typeof PRESUMPTIVE_CLAIMS !== 'undefined' ? PRESUMPTIVE_CLAIMS : [];
      presClaimsRef.forEach(claim => {
        const d = window._presumptiveData[claim.id];
        if(!d || !d.selected) return;
        const details = claim.fields.map(f => d[f.id] ? f.label + ' ' + d[f.id] : null).filter(Boolean).join(' · ');
        html += '<div style="background:#ecfdf5;border:1px solid #a7f3d0;border-left:4px solid #047857;border-radius:0 6px 6px 0;padding:10px 14px;font-size:12px;color:#047857;line-height:1.5;margin-bottom:8px;">' +
          '<strong>' + escapeHTML(claim.label) + '</strong> — presumptive service connection applies.' +
          (details ? '<br><span style="font-size:11px;color:#065f46;">' + escapeHTML(details) + '</span>' : '') +
        '</div>';
      });
    }

    // Physical loss & trauma claims
    if(_hasSpecials){
      SPECIAL_CLAIM_TYPES.filter(item => window._specialClaims[item.id]).forEach(item => {
        html += '<div class="rc-card" style="border-left:3px solid #b45309;">' +
          '<div class="rc-card-header">' +
            '<span class="rc-num" style="background:#b45309;">&#9733;</span>' +
            '<span class="rc-name">' + escapeHTML(item.label) + '</span>' +
            '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:#b45309;background:#fffbeb;border:1px solid #fde68a;padding:2px 6px;border-radius:3px;text-transform:uppercase;letter-spacing:.5px;">Entitlement</span>' +
          '</div>' +
        '</div>';
      });
    }
  }

  // Vocational conditions
  if((window._vocSecondaries||[]).length){
    html += '<div class="rc-section-title" style="margin-top:20px;">Vocational Implications</div>';
    html += '<div class="rc-card" style="border-left:3px solid #b45309;">' +
      '<div style="padding:10px 16px;display:flex;flex-wrap:wrap;gap:6px;">';
    (window._vocSecondaries||[]).forEach(s => {
      html += '<span style="font-size:11px;font-weight:600;padding:3px 8px;border-radius:4px;background:#fffbeb;color:#92400e;border:1px solid #fde68a;">' + escapeHTML(s) + '</span>';
    });
    html += '</div>';
    if(window._vocNotes){
      html += '<div style="padding:4px 16px 10px;font-size:11px;color:var(--muted);font-style:italic;">' + escapeHTML(window._vocNotes) + '</div>';
    }
    html += '</div>';
  }

  // Calculate results
  const result = calculateVARating();

  // Results section
  html += `<div class="rc-results">
    <div class="rc-results-header">Combined VA Disability Rating <span class="tip tip-left" data-tip="This is your estimated combined rating based on the conditions you've entered. The actual VA rating may differ based on your C&P exam and the rater's judgment.">?</span></div>
    <div class="rc-results-big">${result.rounded}%</div>
    <div class="rc-results-exact">Exact: ${result.combined.toFixed(2)}% <span class="tip" data-tip="The VA rounds your exact combined number to the nearest 10%. If it ends in 5 or higher, it rounds up. So 65% rounds to 70%, but 64% rounds to 60%. This rounding can make a big difference in your monthly payment.">?</span></div>
    ${result.bilateral ? `<div class="rc-results-bil">
      <strong>Bilateral factor applied (+${result.bilateralFactor.toFixed(2)}%)</strong> <span class="tip" data-tip="Both sides of paired body parts (both knees, both shoulders, both ankles, etc.) are affected. The VA adds a 10% bonus to those conditions before combining. This is 38 CFR 4.26.">?</span><br>
      <span style="font-size:10px;">Conditions affecting both paired extremities receive a 10% bonus on their combined value before merging with other ratings.</span>
    </div>` : ''}
  </div>`;

  // Step-by-step breakdown (always visible)
  if(result.steps && result.steps.length){
    html += '<div class="rc-steps-wrap">';
    html += '<div class="rc-steps-title">Step-by-Step Calculation <span class="tip" data-tip="This shows exactly how the VA math works for your conditions. It starts with your highest-rated condition and applies each remaining one to what\'s left of the \'whole person.\' This is the same formula the VA uses (38 CFR 4.25).">?</span></div>';
    result.steps.forEach((step, i) => {
      if(i === 0){
        html += '<div class="rc-step">' +
          '<div class="rc-step-label">Start with highest</div>' +
          '<div class="rc-step-detail">' +
            '<span class="rc-step-name">' + escapeHTML(step.name) + '</span>' +
            '<span class="rc-step-pct">' + step.rating + '%</span>' +
          '</div>' +
          '<div class="rc-step-running">= ' + step.running.toFixed(2) + '%</div>' +
        '</div>';
      } else {
        const prevRunning = step.running - step.add;
        const remaining = 100 - prevRunning;
        html += '<div class="rc-step">' +
          '<div class="rc-step-detail">' +
            '<span class="rc-step-plus">+</span>' +
            '<span class="rc-step-name">' + escapeHTML(step.name) + '</span>' +
            '<span class="rc-step-pct">' + step.rating + '%</span>' +
            '<span class="rc-step-math">of ' + remaining.toFixed(1) + ' remaining = +' + step.add.toFixed(2) + '</span>' +
          '</div>' +
          '<div class="rc-step-running">= ' + step.running.toFixed(2) + '%</div>' +
        '</div>';
      }
    });
    html += '<div class="rc-step rc-step-final">' +
      '<div class="rc-step-detail">' +
        '<span class="rc-step-name">Exact combined</span>' +
        '<span class="rc-step-pct">' + result.combined.toFixed(2) + '%</span>' +
      '</div>' +
      '<div class="rc-step-detail" style="margin-top:2px;">' +
        '<span class="rc-step-name">Rounded to nearest 10</span>' +
        '<span class="rc-step-pct" style="font-size:16px;color:var(--navy);">' + result.rounded + '%</span>' +
      '</div>' +
    '</div>';
    if(result.bilateral){
      html += '<div style="font-size:11px;color:#7c3aed;padding:8px 0;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:6px;padding:8px 12px;margin-top:4px;">' +
        '<strong>Bilateral factor: +' + result.bilateralFactor.toFixed(2) + '%</strong><br>' +
        '<span style="font-size:10px;color:#6b21a8;">The same condition on both sides of paired extremities (arms or legs) receives a 10% bonus per 38 CFR 4.26.</span>' +
      '</div>';
    }
    html += '</div>';
  }

  c.innerHTML = html;
  updateRatingCount();
}

function escapeHTML(str){
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function onRatingChange(itemId, val){
  saveRatingToInjury(itemId, parseInt(val));
  renderRating();
}

function onEvalRatingChange(type, condId, val){
  const v = parseInt(val) || 0;
  if(type === 'mental'){
    const cond = (window._mentalHealthConditions||[]).find(c=>c.id===condId);
    if(cond){ cond.manualOverride = v; cond.effectiveRating = v; }
  } else if(type === 'head'){
    const cond = (window._headConditions||[]).find(c=>c.id===condId);
    if(cond){ cond.manualOverride = v; cond.effectiveRating = v; }
  } else if(typeof BP_REGISTRY !== 'undefined'){
    const cfg = BP_REGISTRY[type];
    if(cfg){
      const cond = (window[cfg.stateKey]||[]).find(c=>c.id===condId);
      if(cond){ cond.manualOverride = v; cond.effectiveRating = v; }
    }
  }
  renderRating();
}

// Extremity is now auto-detected from pin key — no manual UI needed

function updateRatingCount(){
  const el = document.getElementById('rc-tab');
  if(!el) return;
  const result = calculateVARating();
  el.textContent = result.rounded > 0 ? `Rating (${result.rounded}%)` : 'Rating';
}

// ── EXPORT HELPERS ──
function getRatingBreakdown(){
  buildRatingItems();
  return calculateVARating();
}
// ── SPECIAL CLAIMS TAB ──
// Vocational, War-Related, SMC, and other special entitlements

// ── STATE ──
if(!window._vocSecondaries) window._vocSecondaries = [];
if(!window._vocNotes) window._vocNotes = '';
if(!window._specialClaims) window._specialClaims = {};
if(!window._smcSelections) window._smcSelections = [];
if(!window._presumptiveData) window._presumptiveData = {};
if(!window._mstData) window._mstData = {
  privacyShield: true,  // default ON — hides MST details across the app
  conditions: [],       // [{name, rating, secondaries: [{name, rating}]}]
  notes: '',
  evidence: {},         // {buddy: false, behavioral: false, ...}
};

const MST_CONDITIONS = [
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
];

const MST_EVIDENCE_TYPES = [
  { id: 'buddy', label: 'Buddy statement(s) from someone you told' },
  { id: 'behavioral', label: 'Behavioral changes in service records (performance drop, discipline issues, etc.)' },
  { id: 'police', label: 'Police or military police report' },
  { id: 'counseling', label: 'Counseling or therapy records' },
  { id: 'medical', label: 'Medical records showing treatment' },
  { id: 'performance', label: 'Performance evaluations showing decline after the event' },
  { id: 'transfer', label: 'Transfer, duty change, or reassignment requests' },
  { id: 'pregnancy', label: 'Pregnancy or STI testing records' },
  { id: 'journal', label: 'Personal journal or diary entries' },
  { id: 'other', label: 'Other supporting evidence' },
];

// Common secondary conditions that can develop from MST-caused conditions
const MST_SECONDARY_SUGGESTIONS = {
  'PTSD': ['Sleep Apnea', 'Migraines', 'Hypertension', 'Bruxism (Teeth Grinding)', 'Tinnitus', 'GERD / Acid Reflux', 'Erectile Dysfunction', 'Weight Gain / Obesity'],
  'Major Depressive Disorder': ['Sleep Apnea', 'Migraines', 'Weight Gain / Obesity', 'Chronic Fatigue', 'Erectile Dysfunction', 'Fibromyalgia'],
  'Generalized Anxiety Disorder': ['Migraines', 'Hypertension', 'GERD / Acid Reflux', 'Irritable Bowel Syndrome', 'Bruxism (Teeth Grinding)'],
  'Panic Disorder': ['Migraines', 'Hypertension', 'GERD / Acid Reflux', 'Chest Pain (Non-cardiac)'],
  'Insomnia / Sleep Disturbance': ['Sleep Apnea', 'Chronic Fatigue', 'Migraines', 'Weight Gain / Obesity'],
  'Substance Use Disorder': ['Liver Disease', 'Peripheral Neuropathy', 'GERD / Acid Reflux', 'Hypertension'],
  'Eating Disorder': ['GERD / Acid Reflux', 'Dental Conditions', 'Malnutrition-related Conditions'],
  '_default': ['Sleep Apnea', 'Migraines', 'Hypertension', 'Chronic Fatigue', 'GERD / Acid Reflux', 'Erectile Dysfunction'],
};

// ── SMC LEVELS ──
// Extra monthly payments on top of regular disability — NOT percentage ratings.
const SMC_LEVELS = [
  { id: 'smc_k', label: 'SMC-K: Loss of Body Part',
    description: 'You\'ve lost (or lost the use of) a body part — a reproductive organ, one hand, one foot, both buttocks, a breast, or sight in one eye. This extra payment gets added on top of your regular disability check. You can receive more than one SMC-K if multiple body parts are affected. Also commonly awarded with erectile dysfunction (ED) ratings.' },
  { id: 'smc_l', label: 'SMC-L: Aid & Attendance',
    description: 'You need someone to help you with everyday tasks — bathing, getting dressed, eating, or using the bathroom — because of your service-connected disabilities. Also applies if you are bedridden or blind from service-connected conditions. You do NOT need a 100% rating to qualify — you just need to show you need daily help.' },
  { id: 'smc_l_half', label: 'SMC-L\u00BD: Aid & Attendance + Body Part Loss',
    description: 'You already qualify for Aid & Attendance (SMC-L) AND you\'ve also lost or lost the use of a hand, foot, or eye on top of that. This bumps your payment higher because you have both the daily help need AND a physical loss.' },
  { id: 'smc_m', label: 'SMC-M: Higher Level of Care',
    description: 'You need more help than a regular caregiver can provide — like skilled nursing or someone with medical training. This is for veterans whose daily care needs go beyond what family or a basic aide can handle.' },
  { id: 'smc_m_half', label: 'SMC-M\u00BD: Higher Care + Additional Loss',
    description: 'You qualify for the higher level of care (SMC-M) AND have additional body part losses on top of your care needs. A step up from M because of the combined severity.' },
  { id: 'smc_n', label: 'SMC-N: Multiple Losses + Aid & Attendance',
    description: 'You need Aid & Attendance AND have lost or lost use of multiple body parts — such as two hands, two feet, one of each, or a combination with blindness. The payment is higher because of the combined effect of multiple losses plus needing daily help.' },
  { id: 'smc_n_half', label: 'SMC-N\u00BD: Severe Multiple Losses',
    description: 'You have losses and care needs that go beyond N level. Multiple severe body part losses plus Aid & Attendance needs that are especially impactful.' },
  { id: 'smc_o', label: 'SMC-O: Maximum Regular SMC',
    description: 'The highest regular SMC level. This is for veterans with multiple severe body part losses or conditions so severe they require the most intensive ongoing care. This is rare and reserved for the most seriously disabled veterans.' },
  { id: 'smc_r1', label: 'SMC-R.1: Higher A&A (TBI / Severe Conditions)',
    description: 'You need regular daily help specifically because of a traumatic brain injury (TBI) or conditions so severe that standard Aid & Attendance isn\'t enough. This level recognizes that some conditions require a higher, more specialized type of daily assistance.' },
  { id: 'smc_r2', label: 'SMC-R.2: Hospitalization / Nursing Home Level',
    description: 'You need ongoing hospitalization or nursing home-level care because of your service-connected conditions. This is the highest SMC payment level — for veterans who essentially need institutional-level medical care on a permanent basis.' },
  { id: 'smc_s', label: 'SMC-S: Housebound',
    description: 'One of your conditions is rated at 100% AND your other conditions combine to at least 60% on their own (without the 100% condition). OR your disabilities physically keep you confined to your home and immediate area. This is extra money on top of your 100% rating.' },
];

// ── PRESUMPTIVE SERVICE CONNECTION ──
// Shortcuts where the VA automatically assumes your condition is service-connected.
const PRESUMPTIVE_CLAIMS = [
  { id: 'pow', label: 'Prisoner of War (POW)',
    description: 'If you were a prisoner of war, the VA automatically assumes certain conditions were caused by your time in captivity — you don\'t have to prove the connection yourself. This includes PTSD, anxiety, arthritis, heart disease, stroke, liver disease, and more, depending on how long you were held. You still need a current diagnosis from a doctor, but the hardest part (proving it\'s connected to service) is done for you.',
    fields: [
      { id: 'dates', label: 'When were you held?', placeholder: 'e.g., Mar 1968 - Jan 1969' },
      { id: 'location', label: 'Where were you held?', placeholder: 'e.g., Hanoi, Vietnam' },
      { id: 'duration', label: 'How long?', placeholder: 'e.g., 10 months' },
      { id: 'conditions', label: 'Conditions you believe are related', placeholder: 'e.g., PTSD, arthritis, heart disease' },
    ]},
  { id: 'agent_orange', label: 'Agent Orange / Herbicide Exposure',
    description: 'If you served somewhere the military used Agent Orange or other herbicides, certain conditions are automatically connected to your service — no need to prove the chemicals caused your illness. The VA just needs to know you were there. Covered conditions include Type 2 diabetes, heart disease, Parkinson\'s, bladder cancer, prostate cancer, lung cancer, and more. You still need a current diagnosis, but you skip proving the connection.',
    fields: [
      { id: 'dates', label: 'When did you serve there?', placeholder: 'e.g., Jun 1967 - Aug 1968' },
      { id: 'location', label: 'Where did you serve?', placeholder: 'e.g., Da Nang, Vietnam / Korat RTAFB, Thailand' },
      { id: 'unit', label: 'Unit (optional)', placeholder: 'e.g., 1st Infantry Division' },
      { id: 'conditions', label: 'Conditions you believe are related', placeholder: 'e.g., Type 2 diabetes, prostate cancer' },
    ]},
  { id: 'gulf_war', label: 'Gulf War / Southwest Asia Illness',
    description: 'If you served in Southwest Asia (Iraq, Kuwait, Saudi Arabia, etc.) from 1990 to now, you may qualify even WITHOUT a specific diagnosis. Unexplained symptoms lasting 6+ months can count on their own — things like constant fatigue, joint pain, headaches, stomach problems, skin issues, or trouble breathing. The VA rates these based on how often they happen and how much they affect your daily life.',
    fields: [
      { id: 'dates', label: 'When did you serve there?', placeholder: 'e.g., Jan 1991 - May 1991' },
      { id: 'location', label: 'Where did you serve?', placeholder: 'e.g., Kuwait, Saudi Arabia' },
      { id: 'unit', label: 'Unit (optional)', placeholder: 'e.g., 3rd Armored Division' },
      { id: 'symptoms', label: 'Unexplained symptoms you experience', placeholder: 'e.g., chronic fatigue, joint pain, headaches' },
    ]},
  { id: 'burn_pit', label: 'Burn Pit / PACT Act Exposure',
    description: 'The PACT Act (2022) made it so the VA automatically connects certain cancers and breathing problems to burn pit and toxic exposure — you don\'t have to prove the link yourself. This covers post-9/11 veterans who served near burn pits in Iraq, Afghanistan, and other locations. Even if you don\'t have a condition yet, you can enroll in VA healthcare just for being exposed. Covered conditions include various cancers and respiratory diseases.',
    fields: [
      { id: 'dates', label: 'When did you serve there?', placeholder: 'e.g., Mar 2004 - Feb 2005' },
      { id: 'location', label: 'Where did you serve?', placeholder: 'e.g., Balad Air Base, Iraq' },
      { id: 'unit', label: 'Unit (optional)', placeholder: 'e.g., 332nd Air Expeditionary Wing' },
      { id: 'exposure', label: 'What were you exposed to?', placeholder: 'e.g., burn pits, oil well fires, depleted uranium' },
      { id: 'conditions', label: 'Conditions you believe are related', placeholder: 'e.g., chronic bronchitis, sinusitis' },
    ]},
];

// ── REMAINING SPECIAL CLAIM TYPES ──
// Physical loss and trauma-based claims (still use checkbox UI)
const SPECIAL_CLAIM_TYPES = [
  { id: 'loss_extremity', label: 'Loss of Use of Extremity',
    description: '"Loss of use" means your hand, foot, or limb basically doesn\'t work anymore — even if it\'s still physically attached. If you\'d be just as well off with a prosthetic, the VA considers it "lost." This gets rated at the same level as if the limb was actually amputated, and often qualifies you for extra SMC payments on top.',
    category: 'Physical Loss & Paired Organs' },
  { id: 'loss_paired', label: 'Loss of Paired Organ',
    description: 'When both sides of a paired body part are affected (both eyes, both ears, both kidneys, both hands, etc.), special rules can increase your compensation — even if only ONE side was damaged in service. For example: if your left eye was hurt in service and your right eye later loses vision from something else, the VA may pay you as if both were service-connected.',
    category: 'Physical Loss & Paired Organs' },
  { id: 'mst', label: 'Military Sexual Trauma (MST)',
    description: 'MST is NOT rated on its own — it\'s a pathway to claim conditions CAUSED by the trauma (PTSD, depression, anxiety, physical issues). Those conditions get rated at normal percentages. The big difference: you do NOT need to have reported the assault during service. The VA accepts buddy statements, behavior changes, counseling records, performance drops, and other indirect evidence. Both men and women can file. The VA provides free MST treatment regardless of rating or discharge status.',
    category: 'Trauma-Based Claims' },
];

const VOCATIONAL_CONDITIONS = [
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
];

function renderSpecial(){
  const c = document.getElementById('sp-list');
  if(!c) return;
  let html = '';

  // ── 1. VOCATIONAL CONDITIONS ──
  html += '<div class="sp-section">';
  html += '<div class="sp-section-title">Vocational Conditions <span class="tip" data-tip="These document how your disabilities affect your ability to hold a job. This is important evidence if your conditions prevent you from working or limit the kind of work you can do.">?</span></div>';
  html += '<div class="sp-section-desc">Document how your service-connected conditions affect your ability to work.</div>';

  const vocSecs = window._vocSecondaries || [];
  if(vocSecs.length){
    html += '<div class="sp-chips">';
    vocSecs.forEach(s => {
      html += '<span class="sc-chip"><span>' + s + '</span><span class="sc-rm" onclick="removeVocSecondary(\'' + s.replace(/'/g,"\\'") + '\')">×</span></span>';
    });
    html += '</div>';
  }

  html += '<select class="cr-add-select" onchange="addVocSecondary(this)" style="margin-top:8px;">' +
    '<option value="">+ Add vocational condition...</option>';
  VOCATIONAL_CONDITIONS.forEach(s => {
    if(!vocSecs.includes(s)) html += '<option value="' + s + '">' + s + '</option>';
  });
  html += '</select>';
  html += '<div class="cr-custom-row" style="margin-top:8px;">' +
    '<input type="text" class="cr-custom-input" id="sp-custom-voc" placeholder="Custom vocational condition...">' +
    '<button class="cr-custom-btn" onclick="addCustomVocSpecial()">Add</button>' +
  '</div>';

  html += '<div style="margin-top:12px;">' +
    '<label style="font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.5px;font-family:var(--fh);">Vocational Notes</label>' +
    '<textarea id="sp-voc-notes" placeholder="Document how service-connected conditions affect employment..." ' +
    'style="width:100%;min-height:60px;margin-top:4px;padding:10px;border-radius:8px;border:1px solid var(--border);font-family:var(--fm);font-size:12px;resize:vertical;" ' +
    'onchange="window._vocNotes=this.value">' + (window._vocNotes||'') + '</textarea>' +
  '</div>';
  html += '</div>';

  // ── 2. EXTRA MONTHLY PAYMENTS (SMC) ──
  html += '<div class="sp-section">';
  html += '<div class="sp-section-title">Extra Monthly Payments (SMC) <span class="tip" data-tip="SMC is completely separate from your disability percentage. Even a veteran rated at 0% can receive SMC-K. These are fixed dollar amounts the VA adds to your check each month for specific situations like losing a body part or needing daily help.">?</span></div>';
  html += '<div class="sp-section-desc">Special Monthly Compensation is extra money added on top of your regular disability check. These are NOT percentage ratings — they are flat payments for specific situations. Select any that apply.</div>';

  // Selected SMC cards
  if(window._smcSelections.length){
    html += '<div class="smc-cards">';
    window._smcSelections.forEach(id => {
      const smc = SMC_LEVELS.find(s => s.id === id);
      if(!smc) return;
      html += '<div class="smc-card">' +
        '<div class="smc-card-head">' +
          '<span class="smc-card-label">' + smc.label + '</span>' +
          '<button class="smc-rm" onclick="event.stopPropagation();removeSMCLevel(\'' + id + '\')" title="Remove">&times;</button>' +
        '</div>' +
        '<div class="smc-card-desc">' + smc.description + '</div>' +
      '</div>';
    });
    html += '</div>';
  }

  // Dropdown to add
  const availableSMC = SMC_LEVELS.filter(s => !window._smcSelections.includes(s.id));
  if(availableSMC.length){
    html += '<select class="cr-add-select" onchange="addSMCLevel(this)" style="margin-top:8px;">' +
      '<option value="">+ Add SMC level...</option>';
    availableSMC.forEach(s => {
      html += '<option value="' + s.id + '">' + s.label + '</option>';
    });
    html += '</select>';
  }
  html += '</div>';

  // ── 3. PRESUMPTIVE SERVICE CONNECTION ──
  html += '<div class="sp-section">';
  html += '<div class="sp-section-title">Presumptive Service Connection <span class="tip" data-tip="Normally you have to prove your condition was caused by military service — that\'s the hardest part of a VA claim. With presumptive conditions, the VA skips that step. You just need a current diagnosis and proof you served in the right place/time. The VA does the rest.">?</span></div>';
  html += '<div class="sp-section-desc">These are shortcuts — if you served in certain places or situations, the VA automatically assumes your conditions were caused by your service. You don\'t have to prove the connection yourself. Check any that apply and enter your service details.</div>';

  PRESUMPTIVE_CLAIMS.forEach(claim => {
    const data = window._presumptiveData[claim.id] || {};
    const checked = data.selected || false;
    html += '<div class="sp-claim' + (checked ? ' sp-claim-active' : '') + '" onclick="togglePresumptive(\'' + claim.id + '\')">' +
      '<div class="sp-claim-head">' +
        '<input type="checkbox" ' + (checked ? 'checked' : '') + ' onclick="event.stopPropagation();togglePresumptive(\'' + claim.id + '\')">' +
        '<span class="sp-claim-label">' + claim.label + '</span>' +
      '</div>' +
      '<div class="sp-claim-desc">' + claim.description + '</div>' +
    '</div>';

    // Expanded service details when checked
    if(checked){
      html += '<div class="presumptive-details" onclick="event.stopPropagation()">';
      html += '<div class="presumptive-details-title">Your Service Details</div>';
      claim.fields.forEach(f => {
        const val = (data[f.id] || '').replace(/"/g, '&quot;');
        html += '<div class="presumptive-field">' +
          '<label class="presumptive-field-label">' + f.label + '</label>' +
          '<input type="text" class="presumptive-field-input" ' +
            'value="' + val + '" ' +
            'placeholder="' + f.placeholder + '" ' +
            'onchange="updatePresumptiveField(\'' + claim.id + '\',\'' + f.id + '\',this.value)" ' +
            'onclick="event.stopPropagation()">' +
        '</div>';
      });
      html += '</div>';
    }
  });
  html += '</div>';

  // ── 4. PHYSICAL LOSS & PAIRED ORGANS ──
  const physItems = SPECIAL_CLAIM_TYPES.filter(s => s.category === 'Physical Loss & Paired Organs');
  if(physItems.length){
    html += '<div class="sp-section">';
    html += '<div class="sp-section-title">Physical Loss & Paired Organs <span class="tip" data-tip="\'Loss of use\' doesn\'t mean the limb was amputated — it means it basically doesn\'t work anymore. If you\'d be just as well off with a prosthetic, the VA considers it lost. \'Paired organs\' means both sides (both eyes, both kidneys, etc.) — special rules kick in when both are affected.">?</span></div>';
    html += '<div class="sp-section-desc">Special rules for when you\'ve lost the use of a body part or when both sides of a paired organ are affected.</div>';
    physItems.forEach(item => {
      const checked = window._specialClaims[item.id] || false;
      html += '<div class="sp-claim' + (checked ? ' sp-claim-active' : '') + '" onclick="toggleSpecialClaim(\'' + item.id + '\')">' +
        '<div class="sp-claim-head">' +
          '<input type="checkbox" ' + (checked ? 'checked' : '') + ' onclick="event.stopPropagation();toggleSpecialClaim(\'' + item.id + '\')">' +
          '<span class="sp-claim-label">' + item.label + '</span>' +
        '</div>' +
        '<div class="sp-claim-desc">' + item.description + '</div>' +
      '</div>';
    });
    html += '</div>';
  }

  // ── 5. TRAUMA-BASED CLAIMS (MST) ──
  const traumaItems = SPECIAL_CLAIM_TYPES.filter(s => s.category === 'Trauma-Based Claims');
  if(traumaItems.length){
    html += '<div class="sp-section">';
    html += '<div class="sp-section-title">Trauma-Based Claims <span class="tip" data-tip="These claims have special evidence rules because the VA understands that certain experiences are hard to document. You don\'t need a police report or official record — the VA accepts indirect evidence like behavior changes, buddy statements, and counseling records.">?</span></div>';
    html += '<div class="sp-section-desc">Special claim pathways with relaxed evidence rules for sensitive experiences.</div>';
    traumaItems.forEach(item => {
      const checked = window._specialClaims[item.id] || false;
      html += '<div class="sp-claim' + (checked ? ' sp-claim-active' : '') + '" onclick="toggleSpecialClaim(\'' + item.id + '\')">' +
        '<div class="sp-claim-head">' +
          '<input type="checkbox" ' + (checked ? 'checked' : '') + ' onclick="event.stopPropagation();toggleSpecialClaim(\'' + item.id + '\')">' +
          '<span class="sp-claim-label">' + item.label + '</span>' +
        '</div>' +
        '<div class="sp-claim-desc">' + item.description + '</div>' +
      '</div>';

      if(item.id === 'mst' && checked){
        html += _renderMSTSection();
      }
    });
    html += '</div>';
  }

  c.innerHTML = html;
  updateSpecialCount();
}

function toggleSpecialClaim(id){
  window._specialClaims[id] = !window._specialClaims[id];
  renderSpecial();
  if(typeof renderTimeline === 'function') renderTimeline();
  if(typeof renderRating === 'function') renderRating();
}

// ── SMC HELPERS ──
function addSMCLevel(select){
  const id = select.value;
  if(!id) return;
  if(!window._smcSelections.includes(id)){
    window._smcSelections.push(id);
  }
  renderSpecial();
}

function removeSMCLevel(id){
  window._smcSelections = window._smcSelections.filter(s => s !== id);
  renderSpecial();
}

// ── PRESUMPTIVE HELPERS ──
function togglePresumptive(id){
  if(!window._presumptiveData[id]) window._presumptiveData[id] = {};
  window._presumptiveData[id].selected = !window._presumptiveData[id].selected;
  renderSpecial();
}

function updatePresumptiveField(claimId, fieldId, value){
  if(!window._presumptiveData[claimId]) window._presumptiveData[claimId] = { selected: true };
  window._presumptiveData[claimId][fieldId] = value;
}

function addCustomVocSpecial(){
  const input = document.getElementById('sp-custom-voc');
  const val = input ? input.value.trim() : ''; if(!val) return;
  if(!window._vocSecondaries.includes(val)) window._vocSecondaries.push(val);
  renderSpecial();
}

function updateSpecialCount(){
  const el = document.getElementById('sp-tab');
  if(!el) return;
  const vocCount = (window._vocSecondaries||[]).length;
  const specCount = Object.values(window._specialClaims||{}).filter(Boolean).length;
  const smcCount = (window._smcSelections||[]).length;
  const presumCount = Object.values(window._presumptiveData||{}).filter(d => d.selected).length;
  const mstConds = window._mstData.conditions||[];
  const mstCondCount = mstConds.length;
  const mstSecCount = mstConds.reduce((sum,c) => sum + (c.secondaries ? c.secondaries.length : 0), 0);
  const total = vocCount + specCount + smcCount + presumCount + mstCondCount + mstSecCount;
  el.textContent = total ? 'Special Claims (' + total + ')' : 'Special Claims';
}

// ── MST (MILITARY SEXUAL TRAUMA) SECTION ────────────────────────────────────

function _renderMSTSection(){
  const mst = window._mstData;
  let h = '';

  h += '<div class="mst-section" onclick="event.stopPropagation()">';

  // Privacy Shield toggle
  h += '<div class="mst-privacy-bar">' +
    '<div class="mst-privacy-left">' +
      '<span class="mst-privacy-icon">' + (mst.privacyShield ? '&#128274;' : '&#128275;') + '</span>' +
      '<div>' +
        '<div class="mst-privacy-label">Privacy Shield <span class="tip" data-tip="When Privacy Shield is ON, all MST-related condition names are replaced with \'Private Condition\' throughout the entire app — in the rating tab, timeline, and all exports (PDF, CSV, TXT). Only the percentage is visible. Turn it off if you want condition names shown." style="background:rgba(255,255,255,.2);color:#fff;">?</span></div>' +
        '<div class="mst-privacy-desc">' +
          (mst.privacyShield
            ? 'ON — MST details are hidden throughout the app. Conditions show as "Private Condition" in ratings, timeline, and exports.'
            : 'OFF — MST details are visible throughout the app. Toggle on to hide sensitive information.') +
        '</div>' +
      '</div>' +
    '</div>' +
    '<label class="mst-toggle">' +
      '<input type="checkbox" ' + (mst.privacyShield ? 'checked' : '') + ' onchange="toggleMSTPrivacy()">' +
      '<span class="mst-toggle-slider"></span>' +
    '</label>' +
  '</div>';

  // Conditions caused by MST — suggestion chips
  h += '<div class="mst-subsection">';
  h += '<div class="mst-subsection-title">Conditions Caused by MST <span class="tip" data-tip="MST itself is not rated — the conditions it caused are what get rated. Mental health conditions (PTSD, depression, anxiety) are rated under the VA single mental health rating. Physical conditions are rated separately.">?</span></div>';

  // Suggestion chips for available conditions
  const availableConds = MST_CONDITIONS.filter(name => !mst.conditions.find(c => c.name === name));
  if(availableConds.length){
    h += '<div class="cr-suggest">';
    h += '<div class="cr-suggest-title">Common conditions caused by MST:</div>';
    h += '<div class="cr-suggest-chips">';
    availableConds.forEach(name => {
      const escaped = name.replace(/'/g,"\\'").replace(/"/g,'&quot;');
      h += '<button class="cr-suggest-chip" onclick="addMSTConditionChip(\'' + escaped + '\')">' +
        '<span class="cr-suggest-plus">+</span> ' + name +
      '</button>';
    });
    h += '</div></div>';
  }

  // Current conditions as cards (same pattern as Severity & Secondary tab)
  mst.conditions.forEach((cond, i) => {
    if(!cond.secondaries) cond.secondaries = [];
    const displayName = mst.privacyShield ? 'Private Condition' : cond.name;
    const sevColor = cond.rating>=70?'#dc2626':cond.rating>=30?'#d97706':cond.rating>0?'#16a34a':'#7c3aed';
    const sevBg = cond.rating>=70?'#fef2f2':cond.rating>=30?'#fffbeb':cond.rating>0?'#f0fdf4':'#f5f3ff';
    const sevBd = cond.rating>=70?'#fecaca':cond.rating>=30?'#fde68a':cond.rating>0?'#bbf7d0':'#ddd6fe';

    h += '<div class="cr-primary" style="margin-top:10px;">';

    // Card header
    h += '<div class="cr-primary-head">' +
      '<div class="cr-primary-info">' +
        '<span class="cr-dot" style="background:' + sevColor + ';"></span>' +
        (mst.privacyShield ? '<span class="mst-lock-icon">&#128274;</span> ' : '') +
        '<div class="cr-primary-name">' + displayName + '</div>' +
      '</div>' +
      '<div class="cr-primary-actions">' +
        '<span class="cr-rating-badge" style="background:' + sevBg + ';color:' + sevColor + ';border:1px solid ' + sevBd + ';">' + cond.rating + '%</span>' +
        '<select style="padding:4px 6px;border-radius:5px;border:1px solid var(--border);font-family:var(--fm);font-size:11px;color:var(--navy);cursor:pointer;" onchange="updateMSTCondRating(' + i + ',this.value)" onclick="event.stopPropagation()">';
    [0,10,20,30,40,50,60,70,80,100].forEach(v => {
      h += '<option value="'+v+'"'+(v===cond.rating?' selected':'')+'>'+v+'%</option>';
    });
    h += '</select>' +
        '<button class="cr-sec-rm" onclick="removeMSTCondition(' + i + ')" title="Remove">&times;</button>' +
      '</div>' +
    '</div>';

    // Secondary suggestion chips for this condition
    const suggestions = MST_SECONDARY_SUGGESTIONS[cond.name] || MST_SECONDARY_SUGGESTIONS['_default'];
    const availableSecs = suggestions.filter(s => !(cond.secondaries||[]).find(x => x.name === s));

    // Current secondaries
    if(cond.secondaries.length){
      h += '<div class="cr-secondaries">';
      cond.secondaries.forEach((sec, j) => {
        const secDisplay = mst.privacyShield ? 'Private Secondary' : sec.name;
        const secColor = sec.rating>=70?'#dc2626':sec.rating>=30?'#d97706':sec.rating>0?'#16a34a':'#7c3aed';
        const secBg = sec.rating>=70?'#fef2f2':sec.rating>=30?'#fffbeb':sec.rating>0?'#f0fdf4':'#f5f3ff';
        const secBd = sec.rating>=70?'#fecaca':sec.rating>=30?'#fde68a':sec.rating>0?'#bbf7d0':'#ddd6fe';
        h += '<div class="cr-secondary">' +
          '<div class="cr-sec-head">' +
            '<div class="cr-sec-info">' +
              '<span class="cr-sec-line"></span>' +
              '<span class="cr-sec-dot" style="background:' + secColor + ';"></span>' +
              '<span class="cr-sec-name">' + (mst.privacyShield ? '<span class="mst-lock-icon">&#128274;</span> ' : '') + secDisplay + '</span>' +
            '</div>' +
            '<div class="cr-sec-actions">' +
              '<span class="cr-rating-badge cr-rating-sm" style="background:' + secBg + ';color:' + secColor + ';border:1px solid ' + secBd + ';">' + sec.rating + '%</span>' +
              '<select style="padding:3px 5px;border-radius:4px;border:1px solid var(--border);font-family:var(--fm);font-size:10px;color:var(--navy);cursor:pointer;" onchange="updateMSTSecondaryRating('+i+','+j+',this.value)" onclick="event.stopPropagation()">';
        [0,10,20,30,40,50,60,70,80,100].forEach(v => {
          h += '<option value="'+v+'"'+(v===sec.rating?' selected':'')+'>'+v+'%</option>';
        });
        h += '</select>' +
              '<button class="cr-sec-rm" onclick="removeMSTSecondary('+i+','+j+')">&times;</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      });
      h += '</div>';
    }

    // Add secondary section — suggestion chips + custom input
    h += '<div class="cr-add-sec">';
    if(availableSecs.length){
      h += '<div class="cr-suggest">';
      h += '<div class="cr-suggest-title">Veterans commonly also claim with <strong>' + displayName + '</strong>:</div>';
      h += '<div class="cr-suggest-chips">';
      availableSecs.forEach(name => {
        const escaped = name.replace(/'/g,"\\'").replace(/"/g,'&quot;');
        h += '<button class="cr-suggest-chip" onclick="addMSTSecondaryChip('+i+',\'' + escaped + '\')">' +
          '<span class="cr-suggest-plus">+</span> ' + name +
        '</button>';
      });
      h += '</div></div>';
    }
    h += '<div class="cr-custom-row">' +
      '<input type="text" class="cr-custom-input" id="mst-sec-custom-'+i+'" placeholder="Custom secondary...">' +
      '<button class="cr-custom-btn" onclick="addCustomMSTSecondary('+i+')">Add</button>' +
    '</div>';
    h += '</div>';

    h += '</div>'; // cr-primary
  });

  // Custom condition input
  h += '<div class="cr-custom-row" style="margin-top:10px;">' +
    '<input type="text" class="cr-custom-input" id="mst-custom-cond" placeholder="Other condition not listed...">' +
    '<button class="cr-custom-btn" onclick="addCustomMSTCondition()">Add</button>' +
  '</div>';
  h += '</div>';

  // Evidence checklist
  h += '<div class="mst-subsection">';
  h += '<div class="mst-subsection-title">Evidence You Have <span class="tip" data-tip="The VA uses a lower evidence standard for MST claims. You do NOT need a police report or to have reported it during service. Even one piece of indirect evidence — like a buddy statement, a drop in performance reviews, or counseling records — can support your claim.">?</span></div>';
  h += '<div class="mst-subsection-desc">Check any evidence you have or can obtain. The VA has relaxed evidence rules for MST — you do NOT need all of these. Even one can support your claim.</div>';

  MST_EVIDENCE_TYPES.forEach(ev => {
    const checked = mst.evidence[ev.id] || false;
    h += '<label class="mst-evidence-item' + (checked ? ' mst-evidence-checked' : '') + '">' +
      '<input type="checkbox" ' + (checked ? 'checked' : '') + ' onchange="toggleMSTEvidence(\'' + ev.id + '\')">' +
      '<span>' + ev.label + '</span>' +
    '</label>';
  });
  h += '</div>';

  // Private notes
  h += '<div class="mst-subsection">';
  h += '<div class="mst-subsection-title">Private Notes ' + (mst.privacyShield ? '<span class="mst-lock-icon">&#128274;</span>' : '') + '</div>';
  h += '<div class="mst-subsection-desc">For your personal reference only. ' +
    (mst.privacyShield ? 'These notes are hidden when Privacy Shield is on and will not appear in exports.' : 'Turn on Privacy Shield to hide these notes from exports.') + '</div>';
  h += '<textarea id="mst-notes" placeholder="Your private notes..." ' +
    'style="width:100%;min-height:80px;padding:10px;border-radius:8px;border:1px solid var(--border);font-family:var(--fm);font-size:12px;resize:vertical;" ' +
    'onchange="window._mstData.notes=this.value">' + (mst.notes||'') + '</textarea>';
  h += '</div>';

  // Reminder
  h += '<div class="mst-reminder">' +
    '<strong>Remember:</strong> The VA provides free MST-related treatment to ALL veterans — regardless of discharge status, disability rating, or whether you\'ve filed a claim. ' +
    'You can contact the VA MST coordinator at any VA medical center or call the Veterans Crisis Line at <strong>988</strong> (press 1).' +
  '</div>';

  h += '</div>'; // mst-section
  return h;
}

function toggleMSTPrivacy(){
  window._mstData.privacyShield = !window._mstData.privacyShield;
  renderSpecial();
  if(typeof renderRating === 'function') renderRating();
}

function addMSTConditionChip(name){
  if(!name) return;
  if(window._mstData.conditions.find(c=>c.name===name)) return;
  const suggested = (typeof getSuggestedRating === 'function') ? getSuggestedRating(name) : null;
  window._mstData.conditions.push({ name: name, rating: suggested !== null ? suggested : 30, secondaries: [] });
  renderSpecial();
  if(typeof renderRating === 'function') renderRating();
  if(typeof updateBadges === 'function') updateBadges();
}

function addMSTSecondaryChip(condIndex, name){
  if(!name) return;
  const cond = window._mstData.conditions[condIndex];
  if(!cond) return;
  if(!cond.secondaries) cond.secondaries = [];
  if(!cond.secondaries.find(s=>s.name===name)){
    cond.secondaries.push({ name: name, rating: 10 });
  }
  renderSpecial();
  if(typeof renderRating === 'function') renderRating();
}

// Legacy dropdown support
function addMSTCondition(select){
  const name = select.value;
  if(!name) return;
  addMSTConditionChip(name);
}

function addCustomMSTCondition(){
  const input = document.getElementById('mst-custom-cond');
  const val = input ? input.value.trim() : '';
  if(!val) return;
  if(!window._mstData.conditions.find(c=>c.name===val)){
    window._mstData.conditions.push({ name: val, rating: 30 });
  }
  renderSpecial();
  if(typeof renderRating === 'function') renderRating();
}

function removeMSTCondition(index){
  window._mstData.conditions.splice(index, 1);
  renderSpecial();
  if(typeof renderRating === 'function') renderRating();
  if(typeof updateBadges === 'function') updateBadges();
}

function updateMSTCondRating(index, value){
  window._mstData.conditions[index].rating = parseInt(value);
  if(typeof renderRating === 'function') renderRating();
}

function addMSTSecondary(condIndex, select){
  const name = select.value;
  if(!name) return;
  const cond = window._mstData.conditions[condIndex];
  if(!cond) return;
  if(!cond.secondaries) cond.secondaries = [];
  if(!cond.secondaries.find(s=>s.name===name)){
    cond.secondaries.push({ name: name, rating: 10 });
  }
  renderSpecial();
  if(typeof renderRating === 'function') renderRating();
}

function addCustomMSTSecondary(condIndex){
  const input = document.getElementById('mst-sec-custom-' + condIndex);
  const val = input ? input.value.trim() : '';
  if(!val) return;
  const cond = window._mstData.conditions[condIndex];
  if(!cond) return;
  if(!cond.secondaries) cond.secondaries = [];
  if(!cond.secondaries.find(s=>s.name===val)){
    cond.secondaries.push({ name: val, rating: 10 });
  }
  renderSpecial();
  if(typeof renderRating === 'function') renderRating();
}

function removeMSTSecondary(condIndex, secIndex){
  const cond = window._mstData.conditions[condIndex];
  if(!cond || !cond.secondaries) return;
  cond.secondaries.splice(secIndex, 1);
  renderSpecial();
  if(typeof renderRating === 'function') renderRating();
}

function updateMSTSecondaryRating(condIndex, secIndex, value){
  const cond = window._mstData.conditions[condIndex];
  if(!cond || !cond.secondaries) return;
  cond.secondaries[secIndex].rating = parseInt(value);
  if(typeof renderRating === 'function') renderRating();
}

function toggleMSTEvidence(id){
  window._mstData.evidence[id] = !window._mstData.evidence[id];
  renderSpecial();
}
// ── PERSONAL STATEMENT TAB ──

if(!window._personalStatement) window._personalStatement = '';

function renderStatement(){
  const c = document.getElementById('ps-content');
  if(!c) return;

  // Gather all conditions for the reference sidebar
  const _pk = _getPanelKeys();
  const allConds = [];

  // Physical injuries (non-panel)
  injuries.filter(i => !_pk.has(i.key)).forEach(i => {
    allConds.push({ name: i.label, type: 'Primary', rating: i._assignedRating, date: i.date });
  });

  // Mental health
  (window._mentalHealthConditions||[]).forEach(c => {
    allConds.push({ name: c.condition, type: 'Mental Health', rating: c.effectiveRating, date: c.date });
  });

  // Head & Face
  (window._headConditions||[]).forEach(c => {
    allConds.push({ name: c.condition, type: 'Head & Face', rating: c.effectiveRating, date: c.date });
  });

  // Body part evaluated
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      (window[cfg.stateKey]||[]).forEach(c => {
        allConds.push({ name: c.condition, type: cfg.title, rating: c.effectiveRating, date: c.date, extremity: c.extremity });
      });
    });
  }

  // Secondaries from all sources
  const secSet = new Set();
  injuries.forEach(i => { (i.secondaries||[]).forEach(s => secSet.add(s)); });
  (window._mentalHealthConditions||[]).forEach(c => { (c.secondaries||[]).forEach(s => secSet.add(s)); });
  (window._headConditions||[]).forEach(c => { (c.secondaries||[]).forEach(s => secSet.add(s)); });
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      (window[cfg.stateKey]||[]).forEach(c => { (c.secondaries||[]).forEach(s => secSet.add(s)); });
    });
  }

  // Special claims
  const specials = [];
  if(typeof SPECIAL_CLAIM_TYPES !== 'undefined' && window._specialClaims){
    SPECIAL_CLAIM_TYPES.forEach(item => {
      if(window._specialClaims[item.id]) specials.push(item.label);
    });
  }

  let html = '<div class="ps-layout">';

  // Main writing area
  html += '<div class="ps-main">';

  // Formatting toolbar
  html += '<div class="ps-toolbar">' +
    '<button onclick="psCmd(\'bold\')" title="Bold"><b>B</b></button>' +
    '<button onclick="psCmd(\'italic\')" title="Italic"><i>I</i></button>' +
    '<button onclick="psCmd(\'underline\')" title="Underline"><u>U</u></button>' +
    '<div class="ps-sep"></div>' +
    '<button onclick="psCmd(\'insertUnorderedList\')" title="Bullet List">&#8226; List</button>' +
    '<button onclick="psCmd(\'insertOrderedList\')" title="Numbered List">1. List</button>' +
    '<div class="ps-sep"></div>' +
    '<button onclick="psCmd(\'indent\')" title="Indent">&#8677; Indent</button>' +
    '<button onclick="psCmd(\'outdent\')" title="Outdent">&#8676; Outdent</button>' +
    '<div class="ps-sep"></div>' +
    '<button onclick="psCmd(\'removeFormat\')" title="Clear Formatting">Clear</button>' +
  '</div>';

  // Editable area
  const placeholder = window._personalStatement ? '' : ' data-placeholder="true"';
  const content = window._personalStatement || '<p style="color:var(--muted);">Write your personal statement here...</p>' +
    '<p style="color:var(--muted);font-size:12px;"><br>Example:<br><br>' +
    'During my service at [base], I injured my [body part] while [activity]. ' +
    'Since then, the pain has gotten worse and I now have difficulty [daily activities]. ' +
    'I was treated at [clinic] and continue to receive care for this condition.<br><br>' +
    'This condition has also caused [secondary condition], which affects my ability to [impact]...</p>';

  html += '<div id="ps-editor" class="ps-editor" contenteditable="true" ' +
    'oninput="psSave()"' + placeholder + '>' + content + '</div>';

  html += '<div class="ps-hint">This statement is included in your export. Write in your own words — there is no wrong way to describe your experience.</div>';
  html += '</div>';

  // Reference sidebar
  html += '<div class="ps-sidebar">';
  html += '<div class="ps-sidebar-title">Your Conditions</div>';
  html += '<div class="ps-sidebar-desc">Reference list of everything you\'ve logged. Click a condition to insert its name into your statement.</div>';

  if(allConds.length){
    html += '<div class="ps-ref-section">Primary & Evaluated</div>';
    allConds.forEach(c => {
      const ext = c.extremity && c.extremity !== 'none' ? ' [' + c.extremity + ']' : '';
      const ratingTxt = c.rating !== undefined && c.rating !== null ? ' — ' + c.rating + '%' : '';
      const escaped = (c.name + ext).replace(/'/g,"\\'").replace(/"/g,'&quot;');
      html += '<div class="ps-ref-item" onclick="psInsert(\'' + escaped + '\')" title="Click to insert">' +
        '<span class="ps-ref-name">' + c.name + ext + '</span>' +
        '<span class="ps-ref-type">' + c.type + ratingTxt + '</span>' +
      '</div>';
    });
  }

  if(secSet.size){
    html += '<div class="ps-ref-section">Secondary Conditions</div>';
    secSet.forEach(s => {
      const escaped = s.replace(/'/g,"\\'").replace(/"/g,'&quot;');
      html += '<div class="ps-ref-item" onclick="psInsert(\'' + escaped + '\')" title="Click to insert">' +
        '<span class="ps-ref-name">' + s + '</span>' +
        '<span class="ps-ref-type">Secondary</span>' +
      '</div>';
    });
  }

  if(specials.length){
    html += '<div class="ps-ref-section">Special Claims</div>';
    specials.forEach(s => {
      const escaped = s.replace(/'/g,"\\'").replace(/"/g,'&quot;');
      html += '<div class="ps-ref-item" onclick="psInsert(\'' + escaped + '\')" title="Click to insert">' +
        '<span class="ps-ref-name">' + s + '</span>' +
        '<span class="ps-ref-type">Special</span>' +
      '</div>';
    });
  }

  if(!allConds.length && !secSet.size && !specials.length){
    html += '<div style="padding:16px;color:var(--muted);font-size:12px;text-align:center;">No conditions logged yet.<br>Add conditions from the Body Map tab.</div>';
  }

  html += '</div>'; // ps-sidebar
  html += '</div>'; // ps-layout

  c.innerHTML = html;

  // Clear placeholder on first focus
  const editor = document.getElementById('ps-editor');
  if(editor && editor.hasAttribute('data-placeholder')){
    editor.addEventListener('focus', function _clear(){
      if(editor.hasAttribute('data-placeholder')){
        editor.innerHTML = '';
        editor.removeAttribute('data-placeholder');
      }
      editor.removeEventListener('focus', _clear);
    }, {once: true});
  }
}

function psCmd(command){
  document.execCommand(command, false, null);
  document.getElementById('ps-editor')?.focus();
}

function psSave(){
  const editor = document.getElementById('ps-editor');
  if(editor) window._personalStatement = editor.innerHTML;
}

function psInsert(text){
  const editor = document.getElementById('ps-editor');
  if(!editor) return;
  // Clear placeholder if present
  if(editor.hasAttribute('data-placeholder')){
    editor.innerHTML = '';
    editor.removeAttribute('data-placeholder');
  }
  editor.focus();
  document.execCommand('insertText', false, text);
  psSave();
}
// ── EXPORT FUNCTIONS ──

// ── PDF / PRINT SUMMARY ──
function exportSummary(){
  const hasBPExport = typeof BP_REGISTRY!=='undefined' && Object.values(BP_REGISTRY).some(cfg=>(window[cfg.stateKey]||[]).length>0);
  const _pk = _getPanelKeys();
  const filteredInj = injuries.filter(i => !_pk.has(i.key));
  if(!filteredInj.length && !(window._mentalHealthConditions && window._mentalHealthConditions.length) && !(window._headConditions && window._headConditions.length) && !hasBPExport){alert('No injuries to export.');return;}
  const sorted=[...filteredInj].sort((a,b)=>new Date(a.date)-new Date(b.date));

  // Gather all conditions across every source for summary stats
  const _mhAll = window._mentalHealthConditions || [];
  const _hdAll = window._headConditions || [];
  const _bpAll = typeof BP_REGISTRY!=='undefined' ? Object.values(BP_REGISTRY).flatMap(cfg => window[cfg.stateKey] || []) : [];
  const _allEvalConds = [..._mhAll, ..._hdAll, ..._bpAll];
  const _totalConditions = filteredInj.length + _allEvalConds.length;
  const _totalMedical = filteredInj.filter(i=>i.medicalCare==='yes').length + _allEvalConds.filter(c=>c.medicalCare==='yes').length;
  const _bodyAreaSet = new Set(filteredInj.map(i=>i.key));
  if(_mhAll.length) _bodyAreaSet.add('mental');
  if(_hdAll.length) _bodyAreaSet.add('head');
  if(typeof BP_REGISTRY!=='undefined') Object.values(BP_REGISTRY).forEach(cfg => { if((window[cfg.stateKey]||[]).length) _bodyAreaSet.add(cfg.id); });
  const _totalAreas = _bodyAreaSet.size;
  const _evalIncomplete = _allEvalConds.filter(c => typeof gapStatus==='function' && gapStatus(c).status==='incomplete').length;

  const views = [
    {body:'male',  side:'front'},
    {body:'male',  side:'back'},
    {body:'female',side:'front'},
    {body:'female',side:'back'},
  ];

  // Collect ALL pins from every source (injuries + evaluation panels)
  const _allExportPins = [];
  filteredInj.forEach(i => {
    if(i.pin) _allExportPins.push({ x:i.pin.x, y:i.pin.y, side:i.pin.side, body:i.pin.body, label:i.label, severity:i.severity, date:i.date });
  });
  const _evalSources = [...(window._mentalHealthConditions||[]), ...(window._headConditions||[])];
  if(typeof BP_REGISTRY!=='undefined') Object.values(BP_REGISTRY).forEach(cfg => { _evalSources.push(...(window[cfg.stateKey]||[])); });
  _evalSources.forEach(c => {
    if(c.pin) _allExportPins.push({ x:c.pin.x, y:c.pin.y, side:c.pin.side, body:c.pin.body, label:c.condition||c.label||'Condition', severity:'moderate', date:c.date||'' });
  });
  _allExportPins.sort((a,b)=>new Date(a.date||0)-new Date(b.date||0));

  function buildDiagramHTML(body, side){
    const suffix=(body==='male'?'m':'f')+(side==='front'?'f':'b');
    const viewEl = document.getElementById('view-'+suffix);
    if(!viewEl) return '';
    const imgEl = viewEl.querySelector('img');
    if(!imgEl) return '';
    const imgSrc = imgEl.src;
    const viewPins = _allExportPins.filter(p=>p.body===body && p.side===side);
    if(!viewPins.length) return '';

    const pinDots = viewPins.map((p,idx)=>{
      const c = SC[p.severity]||SC.custom;
      const num = _allExportPins.indexOf(p)+1;
      return `<div style="position:absolute;left:${p.x}%;top:${p.y}%;transform:translate(-50%,-100%);z-index:2;">
        <div style="width:20px;height:20px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${c};box-shadow:0 2px 5px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;">
          <span style="transform:rotate(45deg);color:#fff;font-size:9px;font-weight:800;font-family:monospace;">${num}</span>
        </div>
        <div style="position:absolute;bottom:calc(100% + 2px);left:50%;transform:translateX(-50%);background:#1a2332;color:#fff;font-size:9px;font-weight:600;padding:2px 6px;border-radius:3px;white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis;">#${num} · ${p.label.slice(0,18)}</div>
      </div>`;
    }).join('');

    return `<div style="margin-bottom:28px;break-inside:avoid;">
      <div style="font-size:12px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-family:monospace;">${body} — ${side} view (${viewPins.length} condition${viewPins.length>1?'s':''})</div>
      <div style="position:relative;display:inline-block;width:220px;">
        <img src="${imgSrc}" style="width:440px;max-width:none;clip-path:${side==='front'?'inset(0 50% 0 0)':'inset(0 0 0 50%)'};${side==='back'?'margin-left:-220px;':''}display:block;">
        <div style="position:absolute;top:0;left:0;width:100%;height:100%;">${pinDots}</div>
      </div>
    </div>`;
  }

  const diagrams = views
    .filter(v=>_allExportPins.some(p=>p.body===v.body&&p.side===v.side))
    .map(v=>buildDiagramHTML(v.body,v.side))
    .join('');

  // Evidence gap summary
  const incomplete = sorted.filter(i=>gapStatus(i).status==='incomplete');
  const gapSummary = incomplete.length ? `
  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px 16px;margin-bottom:16px;">
    <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:8px;">${incomplete.length} of ${sorted.length} injuries need additional evidence</div>
    ${incomplete.map(i=>{
      const g = gapStatus(i);
      const num = sorted.indexOf(i)+1;
      return `<div style="font-size:11px;color:#92400e;padding:2px 0;"><strong>#${num} ${i.label}:</strong> Missing — ${g.gaps.join(', ')}</div>`;
    }).join('')}
  </div>` : `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#166534;font-weight:600;">All injuries have complete evidence records.</div>`;

  // Build per-injury detail cards
  const detailCards = sorted.map((i,idx)=>{
    const num = idx+1;
    const sc = SC[i.severity]||SC.custom;
    const sbg = SBG[i.severity]||SBG.custom;
    const sbd = SBD[i.severity]||SBD.custom;
    const stxt = i.severity==='custom'?'Other':i.severity;
    const g = gapStatus(i);

    let card = `<div class="detail-card" style="break-inside:avoid;">
      <div class="dc-header">
        <span class="dc-num" style="background:${sc};">${num}</span>
        <span class="dc-label">${i.label}</span>
        <span class="dc-sev" style="background:${sbg};color:${sc};border:1px solid ${sbd};">${stxt}</span>
        <span class="dc-status" style="background:${g.status==='complete'?'#f0fdf4':'#fffbeb'};color:${g.status==='complete'?'#166534':'#92400e'};border:1px solid ${g.status==='complete'?'#bbf7d0':'#fde68a'};">${g.label}</span>
      </div>
      <div class="dc-grid">
        <div class="dc-field"><span class="dc-key">Date</span><span class="dc-val">${i.date||'—'}</span></div>
        <div class="dc-field"><span class="dc-key">Body</span><span class="dc-val">${i.pin.body} / ${i.pin.side}</span></div>
        <div class="dc-field"><span class="dc-key">Installation</span><span class="dc-val">${i.location||'—'}</span></div>
        <div class="dc-field"><span class="dc-key">Event / Duty</span><span class="dc-val">${i.event||'—'}</span></div>
        <div class="dc-field"><span class="dc-key">Medical Care</span><span class="dc-val">${i.medicalCare==='yes'?(i.clinicName||'Yes'):'No'}</span></div>
        <div class="dc-field"><span class="dc-key">Witnesses</span><span class="dc-val">${i.witnesses||'—'}</span></div>
        <div class="dc-field"><span class="dc-key">Still Being Seen</span><span class="dc-val">${i.stillBeingSeen?'Yes':'No'}</span></div>
      </div>`;

    if(i.description){
      card += `<div class="dc-desc"><span class="dc-key">Description</span><div style="margin-top:2px;font-style:italic;color:#4b5563;">"${i.description}"</div></div>`;
    }

    if(i.secondaries?.length){
      card += `<div class="dc-section">
        <span class="dc-section-title" style="color:#3730a3;border-color:#c7d2fe;">Secondary Conditions</span>
        <div class="dc-tags">${i.secondaries.map(s=>`<span class="dc-tag" style="background:#e0e7ff;color:#3730a3;border:1px solid #c7d2fe;">${s}</span>`).join('')}</div>
      </div>`;
    }

    if(i.functionalImpacts?.length){
      card += `<div class="dc-section">
        <span class="dc-section-title" style="color:#991b1b;border-color:#fecaca;">Daily Life Impact</span>
        <div class="dc-tags">${i.functionalImpacts.map(fi=>`<span class="dc-tag" style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca;">${fi}</span>`).join('')}</div>
      </div>`;
    }

    if(g.gaps.length){
      card += `<div class="dc-section">
        <span class="dc-section-title" style="color:#92400e;border-color:#fde68a;">Missing Evidence</span>
        <div class="dc-tags">${g.gaps.map(m=>`<span class="dc-tag" style="background:#fffbeb;color:#92400e;border:1px solid #fde68a;">${m}</span>`).join('')}</div>
      </div>`;
    }

    if(i.secondaryNotes){
      card += `<div class="dc-desc"><span class="dc-key">Notes</span><div style="margin-top:2px;color:#4b5563;">${i.secondaryNotes}</div></div>`;
    }

    card += `</div>`;
    return card;
  }).join('');

  // Quick reference table
  const quickRef = sorted.map((i,idx)=>`<tr>
    <td style="font-weight:800;color:${SC[i.severity]||SC.custom};font-family:monospace;text-align:center;">${idx+1}</td>
    <td>${i.date||'—'}</td><td>${i.label}</td>
    <td style="color:${SC[i.severity]||SC.custom};font-weight:700;font-size:11px;text-transform:uppercase;">${i.severity==='custom'?'Other':i.severity}</td>
    <td>${i.location||'—'}</td>
    <td>${i.medicalCare==='yes'?'Yes':'No'}</td>
    <td>${i.secondaries?.length||0}</td>
    <td style="color:${gapStatus(i).status==='complete'?'#166534':'#92400e'};font-weight:600;font-size:10px;">${gapStatus(i).status==='complete'?'Complete':'Incomplete'}</td>
  </tr>`).join('');

  const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>VA Injury Summary</title>
<style>
body{font-family:Arial,sans-serif;margin:40px;font-size:13px;color:#111;}
h1{color:#1d4ed8;font-size:22px;margin:0 0 4px;}
.sub{color:#888;font-size:10px;margin-bottom:18px;font-family:monospace;}
.disc{background:#fffbeb;border-left:4px solid #fbbf24;padding:10px 14px;border-radius:4px;margin-bottom:18px;font-size:11px;color:#92400e;}
.stats{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;}
.stat{background:#eff3ff;border:1px solid #bfdbfe;border-radius:7px;padding:9px 16px;}
.sn{font-size:22px;font-weight:700;color:#1d4ed8;}.sl{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;font-family:monospace;}
.section-title{font-size:14px;font-weight:700;color:#1a2332;border-bottom:2px solid #1d4ed8;padding-bottom:6px;margin:24px 0 16px;text-transform:uppercase;letter-spacing:1px;font-family:monospace;}
.diagrams{display:flex;gap:32px;flex-wrap:wrap;margin-bottom:28px;}
table{width:100%;border-collapse:collapse;}
th{background:#1d4ed8;color:#fff;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;font-family:monospace;}
td{padding:8px 10px;border-bottom:1px solid #e0e7ff;vertical-align:top;}
tr:nth-child(even) td{background:#f8faff;}
.footer{margin-top:20px;font-size:10px;color:#aaa;font-family:monospace;border-top:1px solid #eee;padding-top:10px;display:flex;justify-content:space-between;}
@media print{button{display:none;} .detail-card{break-inside:avoid;}}

/* Detail Cards */
.detail-card{border:1px solid #d1d5db;border-radius:8px;padding:16px;margin-bottom:14px;background:#fff;page-break-inside:avoid;}
.dc-header{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid #e5e7eb;}
.dc-num{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;color:#fff;font-size:12px;font-weight:800;font-family:monospace;flex-shrink:0;}
.dc-label{font-size:16px;font-weight:700;color:#1a2332;}
.dc-sev{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;padding:3px 8px;border-radius:3px;font-family:monospace;}
.dc-status{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;padding:3px 8px;border-radius:3px;font-family:monospace;}
.dc-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 20px;margin-bottom:8px;}
.dc-field{display:flex;gap:6px;font-size:12px;}
.dc-key{font-weight:700;color:#6b7280;text-transform:uppercase;font-size:10px;letter-spacing:.5px;font-family:monospace;min-width:100px;flex-shrink:0;}
.dc-val{color:#111;}
.dc-desc{margin-top:8px;font-size:12px;}
.dc-section{margin-top:8px;}
.dc-section-title{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;font-family:monospace;margin-bottom:4px;padding-bottom:3px;border-bottom:1px solid;}
.dc-tags{display:flex;flex-wrap:wrap;gap:4px;}
.dc-tag{font-size:10px;font-weight:600;padding:2px 8px;border-radius:3px;font-family:monospace;}
</style></head><body>
<h1>Injury Documentation Summary</h1>
<div class="sub">Generated ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div>
<div class="disc"><strong>Notice:</strong> This records personal injury notes only. It does not determine VA eligibility or guarantee claim approval.</div>
<div class="stats">
  <div class="stat"><div class="sn">${_totalConditions}</div><div class="sl">Total Conditions</div></div>
  <div class="stat"><div class="sn">${_totalMedical}</div><div class="sl">Medical Visits</div></div>
  <div class="stat"><div class="sn">${_totalAreas}</div><div class="sl">Body Areas</div></div>
  <div class="stat"><div class="sn">${incomplete.length + _evalIncomplete}</div><div class="sl">Needs Evidence</div></div>
  ${(function(){ const r=getRatingBreakdown(); return r.rounded>0?'<div class="stat" style="border:2px solid #1d4ed8;"><div class="sn">'+r.rounded+'%</div><div class="sl">Combined Rating</div></div>':''; })()}
</div>

<div class="section-title">Body Diagram</div>
<div class="diagrams">${diagrams}</div>

<div class="section-title">Evidence Gap Summary</div>
${gapSummary}

<div class="section-title">Quick Reference</div>
<table><thead><tr><th>#</th><th>Date</th><th>Body Area</th><th>Severity</th><th>Installation</th><th>Medical</th><th>Secondary</th><th>Evidence</th></tr></thead>
<tbody>${quickRef}</tbody></table>

<div class="section-title">Detailed Injury Reports</div>
${detailCards}

${(function(){
  const mh = window._mentalHealthConditions || [];
  if(!mh.length) return '';
  const highest = mh.reduce((b,c)=>c.effectiveRating>b.effectiveRating?c:b, mh[0]);
  let h = '<div class="section-title">Mental Health Evaluation (VA 8787)</div>';
  h += '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:#1e40af;"><strong>VA Single Rating Rule:</strong> All mental health conditions receive one combined rating. The highest evaluated rating is used.</div>';
  mh.forEach(c => {
    const isH = c.id === highest.id && mh.length > 1;
    const domains = (typeof MH_DOMAINS !== 'undefined' ? MH_DOMAINS : []).map(d => {
      const lv = c.domains[d.id] ? c.domains[d.id].level : 'none';
      return lv !== 'none' ? d.label + ': ' + lv : null;
    }).filter(Boolean).join(', ') || 'Not evaluated';
    h += '<div style="border:1px solid #d1d5db;border-radius:6px;padding:12px 16px;margin-bottom:8px;'+(isH?'border-left:3px solid #c8102e;':'')+'">';
    h += '<div style="font-weight:700;font-size:13px;color:#0a2357;">'+c.condition+(isH?' <span style="color:#c8102e;font-size:10px;">(ACTIVE RATING)</span>':'')+'</div>';
    h += '<div style="font-size:11px;color:#6b7280;margin-top:2px;">'+(c.date||'No date')+(c.location?' &middot; '+c.location:'')+(c.event?' &middot; '+c.event:'')+'</div>';
    if(c.description) h += '<div style="font-size:11px;color:#4b5563;font-style:italic;margin-top:2px;">&ldquo;'+c.description+'&rdquo;</div>';
    if(c.medicalCare==='yes') h += '<div style="font-size:11px;color:#166534;margin-top:2px;">&#10003; Medical care'+(c.clinicName?' &mdash; '+c.clinicName:'')+'</div>';
    if(c.witnesses) h += '<div style="font-size:11px;color:#6b7280;margin-top:1px;">Witnesses: '+c.witnesses+'</div>';
    h += '<div style="font-size:11px;color:#6b7280;margin-top:4px;">Domains: '+domains+'</div>';
    h += '<div style="font-size:14px;font-weight:800;color:#0a2357;font-family:monospace;margin-top:4px;">'+c.effectiveRating+'%'+(c.manualOverride!==null?' (manual override)':'')+'</div>';
    h += '</div>';
  });
  h += '<div style="text-align:center;margin:16px 0;padding:12px;border:2px solid #0a2357;border-radius:8px;"><div style="font-size:10px;font-weight:700;color:#0a2357;text-transform:uppercase;letter-spacing:1px;">Mental Health Rating</div><div style="font-size:36px;font-weight:800;color:#0a2357;font-family:monospace;">'+highest.effectiveRating+'%</div></div>';
  return h;
})()}

${(function(){
  const hd = window._headConditions || [];
  if(!hd.length) return '';
  let h = '<div class="section-title">Head & Face Evaluation (VA 8787)</div>';
  h += '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:#1e40af;"><strong>Separate Ratings:</strong> Each head/face condition is rated independently under its own diagnostic code.</div>';
  hd.forEach(c => {
    const profile = (typeof HEAD_PROFILES !== 'undefined' ? HEAD_PROFILES[c.profile] : null) || {label:'',domains:[]};
    const profileLabel = profile.label ? profile.label.split('(')[0].trim() : '';
    const domains = profile.domains.map(d => {
      const v = c.domains[d.id];
      if(!v) return null;
      const lv = d.levels ? d.levels.find(l => l.value === v) : null;
      return lv ? d.label + ': ' + lv.label : null;
    }).filter(Boolean).join(', ') || 'Not evaluated';
    h += '<div style="border:1px solid #d1d5db;border-radius:6px;padding:12px 16px;margin-bottom:8px;border-left:3px solid #0a2357;">';
    h += '<div style="font-weight:700;font-size:13px;color:#0a2357;">'+c.condition+' <span style="font-size:10px;color:#6b7280;font-weight:400;">'+profileLabel+'</span></div>';
    h += '<div style="font-size:11px;color:#6b7280;margin-top:2px;">'+(c.date||'No date')+(c.location?' &middot; '+c.location:'')+(c.event?' &middot; '+c.event:'')+'</div>';
    if(c.description) h += '<div style="font-size:11px;color:#4b5563;font-style:italic;margin-top:2px;">&ldquo;'+c.description+'&rdquo;</div>';
    if(c.medicalCare==='yes') h += '<div style="font-size:11px;color:#166534;margin-top:2px;">&#10003; Medical care'+(c.clinicName?' &mdash; '+c.clinicName:'')+'</div>';
    if(c.witnesses) h += '<div style="font-size:11px;color:#6b7280;margin-top:1px;">Witnesses: '+c.witnesses+'</div>';
    h += '<div style="font-size:11px;color:#6b7280;margin-top:4px;">'+domains+'</div>';
    h += '<div style="font-size:14px;font-weight:800;color:#0a2357;font-family:monospace;margin-top:4px;">'+c.effectiveRating+'%'+(c.manualOverride!==null?' (manual override)':'')+'</div>';
    h += '</div>';
  });
  return h;
})()}

${(function(){
  if(typeof BP_REGISTRY === 'undefined') return '';
  let h = '';
  Object.values(BP_REGISTRY).forEach(cfg => {
    const bpConds = window[cfg.stateKey] || [];
    if(!bpConds.length) return;
    h += '<div class="section-title">' + cfg.title + ' (VA 8787)</div>';
    h += '<div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:#047857;">' + cfg.note + '</div>';
    bpConds.forEach(c => {
      const profile = cfg.profiles()[c.profile] || cfg.profiles().generic;
      const profileLabel = profile.label ? profile.label.split('(')[0].trim() : '';
      const domains = profile.domains.map(d => {
        const v = c.domains[d.id];
        if(!v) return null;
        return d.label.split(':').pop().trim() + ': ' + v + '%';
      }).filter(Boolean).join(', ') || 'Not evaluated';
      const extLabel = c.extremity && c.extremity !== 'none' ? ' [' + c.extremity + ']' : '';
      h += '<div style="border:1px solid #d1d5db;border-radius:6px;padding:12px 16px;margin-bottom:8px;border-left:3px solid #047857;">';
      h += '<div style="font-weight:700;font-size:13px;color:#0a2357;">' + c.condition + extLabel + ' <span style="font-size:10px;color:#6b7280;font-weight:400;">' + profileLabel + '</span></div>';
      h += '<div style="font-size:11px;color:#6b7280;margin-top:2px;">' + (c.date||'No date') + (c.location?' &middot; '+c.location:'') + (c.event?' &middot; '+c.event:'') + '</div>';
      if(c.description) h += '<div style="font-size:11px;color:#4b5563;font-style:italic;margin-top:2px;">&ldquo;'+c.description+'&rdquo;</div>';
      if(c.medicalCare==='yes') h += '<div style="font-size:11px;color:#166534;margin-top:2px;">&#10003; Medical care'+(c.clinicName?' &mdash; '+c.clinicName:'')+'</div>';
      if(c.witnesses) h += '<div style="font-size:11px;color:#6b7280;margin-top:1px;">Witnesses: '+c.witnesses+'</div>';
      h += '<div style="font-size:11px;color:#6b7280;margin-top:4px;">' + domains + '</div>';
      h += '<div style="font-size:14px;font-weight:800;color:#0a2357;font-family:monospace;margin-top:4px;">' + c.effectiveRating + '%' + (c.manualOverride !== null ? ' (manual override)' : '') + '</div>';
      h += '</div>';
    });
  });
  return h;
})()}

${window._personalStatement?'<div class="section-title">Personal Statement</div><div style="border:1px solid #d1d5db;border-radius:8px;padding:16px 20px;font-size:13px;line-height:1.7;color:#111;page-break-inside:avoid;">'+window._personalStatement+'</div>':''}

${(window._vocSecondaries||[]).length?`
<div class="section-title">Vocational Conditions</div>
<ul style="font-size:12px;line-height:1.8;">${window._vocSecondaries.map(s=>'<li>'+s+'</li>').join('')}</ul>
${window._vocNotes?'<div style="margin-top:8px;padding:8px 12px;background:#f8f9fa;border-left:3px solid #0a2357;border-radius:4px;font-size:12px;"><strong>Notes:</strong> '+window._vocNotes+'</div>':''}`:''}

${(function(){
  const smcSels = window._smcSelections || [];
  if(!smcSels.length) return '';
  const smcLevels = typeof SMC_LEVELS !== 'undefined' ? SMC_LEVELS : [];
  let h = '<div class="section-title">Special Monthly Compensation (SMC)</div>';
  h += '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:#1e40af;">These are extra flat payments on top of your regular disability check — NOT percentage ratings.</div>';
  smcSels.forEach(id => {
    const smc = smcLevels.find(s => s.id === id);
    if(!smc) return;
    h += '<div style="border:1px solid #d1d5db;border-radius:6px;padding:10px 14px;margin-bottom:6px;border-left:3px solid #0a2357;">';
    h += '<div style="font-weight:700;color:#0a2357;font-size:13px;">'+smc.label+'</div>';
    h += '<div style="font-size:11px;color:#4b5563;margin-top:4px;line-height:1.5;">'+smc.description+'</div>';
    h += '</div>';
  });
  return h;
})()}

${(function(){
  const presData = window._presumptiveData || {};
  const presClaims = typeof PRESUMPTIVE_CLAIMS !== 'undefined' ? PRESUMPTIVE_CLAIMS : [];
  const active = presClaims.filter(c => presData[c.id] && presData[c.id].selected);
  if(!active.length) return '';
  let h = '<div class="section-title">Presumptive Service Connection</div>';
  h += '<div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:#047857;">Conditions automatically presumed service-connected based on where/when you served.</div>';
  active.forEach(claim => {
    const d = presData[claim.id];
    h += '<div style="border:1px solid #d1d5db;border-radius:6px;padding:10px 14px;margin-bottom:6px;border-left:3px solid #047857;">';
    h += '<div style="font-weight:700;color:#0a2357;font-size:13px;">'+claim.label+'</div>';
    claim.fields.forEach(f => {
      const val = d[f.id] || '';
      if(val) h += '<div style="font-size:11px;margin-top:3px;"><strong style="color:#6b7280;">'+f.label+'</strong> '+val+'</div>';
    });
    h += '</div>';
  });
  return h;
})()}

${(function(){
  const mst = window._mstData || { conditions:[], privacyShield:true };
  if(!mst.conditions.length) return '';
  let h = '<div class="section-title">MST-Related Conditions</div>';
  if(mst.privacyShield){
    h += '<div style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:6px;padding:12px 16px;margin-bottom:14px;font-size:12px;color:#334155;"><strong>&#128274; Privacy Shield Active</strong> — Condition details have been withheld for privacy.</div>';
    mst.conditions.forEach((c,i) => {
      h += '<div style="border:1px solid #d1d5db;border-radius:6px;padding:10px 14px;margin-bottom:6px;border-left:3px solid #6b7280;">';
      h += '<span style="font-weight:700;color:#6b7280;">&#128274; Private Condition</span>';
      h += '<span style="float:right;font-weight:800;font-family:monospace;color:#6b7280;">'+c.rating+'%</span>';
      if(c.secondaries && c.secondaries.length){
        c.secondaries.forEach(s => {
          h += '<div style="margin-top:4px;padding-left:16px;font-size:11px;color:#6b7280;">&#8627; Private Secondary — '+s.rating+'%</div>';
        });
      }
      h += '</div>';
    });
  } else {
    mst.conditions.forEach(c => {
      h += '<div style="border:1px solid #d1d5db;border-radius:6px;padding:10px 14px;margin-bottom:6px;border-left:3px solid #0a2357;">';
      h += '<span style="font-weight:700;color:#0a2357;">'+c.name+'</span>';
      h += '<span style="float:right;font-weight:800;font-family:monospace;color:#0a2357;">'+c.rating+'%</span>';
      if(c.secondaries && c.secondaries.length){
        c.secondaries.forEach(s => {
          h += '<div style="margin-top:4px;padding-left:16px;font-size:11px;color:#4b5563;">&#8627; '+s.name+' (secondary) — '+s.rating+'%</div>';
        });
      }
      h += '</div>';
    });
  }
  return h;
})()}

${(function(){
  const r=getRatingBreakdown();
  if(r.rounded<=0) return '';
  let h='<div class="section-title">VA Disability Rating Estimate</div>';
  h+='<div style="text-align:center;margin-bottom:16px;">';
  h+='<div style="font-size:48px;font-weight:800;color:#1d4ed8;font-family:monospace;">'+r.rounded+'%</div>';
  h+='<div style="font-size:12px;color:#888;font-family:monospace;">Exact: '+r.combined.toFixed(2)+'%</div>';
  if(r.bilateral) h+='<div style="color:#7c3aed;font-size:12px;font-weight:600;margin-top:4px;">Bilateral factor: +'+r.bilateralFactor.toFixed(2)+'%</div>';
  h+='</div>';
  h+='<div style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:16px;font-family:monospace;font-size:11px;line-height:1.7;white-space:pre-wrap;page-break-inside:avoid;">'+r.breakdown.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div>';
  return h;
})()}

<div class="footer">
  <span>Print (Ctrl+P / Cmd+P) to save as PDF</span>
  <span>&copy; K. Dimond. All Rights Reserved.</span>
</div>
</body></html>`);
  w.document.close();
}

// ── CSV EXPORT ──
function exportCSV(){
  const _pk2 = _getPanelKeys();
  const filteredInj2 = injuries.filter(i => !_pk2.has(i.key));
  if(!filteredInj2.length && !(window._mentalHealthConditions||[]).length && !(window._headConditions||[]).length){alert('No injuries to export.');return;}
  const sorted=[...filteredInj2].sort((a,b)=>new Date(a.date)-new Date(b.date));

  const esc = v => {
    const s = String(v||'').replace(/"/g,'""');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? '"'+s+'"' : s;
  };

  const ratingResult = getRatingBreakdown();
  const headers = ['#','Date','Body Area','Severity','Assigned Rating %','Body','Side','Installation','Event','Description','Medical Care','Clinic','Witnesses','Secondary Conditions','Daily Life Impact','Evidence Status','Missing Evidence','Still Being Seen','Notes'];
  const csvRows = [headers.join(',')];

  sorted.forEach((i,idx)=>{
    const g = gapStatus(i);
    const assignedRating = i._assignedRating !== undefined ? i._assignedRating + '%' : '';
    const row = [
      idx+1,
      i.date||'',
      i.label,
      i.severity==='custom'?'Other':i.severity,
      assignedRating,
      i.pin.body,
      i.pin.side,
      i.location||'',
      i.event||'',
      i.description||'',
      i.medicalCare==='yes'?'Yes':'No',
      i.clinicName||'',
      i.witnesses||'',
      (i.secondaries||[]).join('; '),
      (i.functionalImpacts||[]).join('; '),
      g.status==='complete'?'Complete':'Needs Evidence',
      g.gaps.join('; '),
      i.stillBeingSeen?'Yes':'No',
      i.secondaryNotes||''
    ];
    csvRows.push(row.map(esc).join(','));
  });

  // Mental health conditions
  const mhConds = window._mentalHealthConditions || [];
  if(mhConds.length){
    csvRows.push('');
    csvRows.push(esc('MENTAL HEALTH EVALUATION'));
    csvRows.push(['Condition','Date','Location','Event','Description','Medical Care','Clinic','Witnesses','Cognition','Interpersonal','Task Completion','Navigating Environments','Self-Care','Calculated Rating','Effective Rating','Override'].join(','));
    mhConds.forEach(c => {
      const row = [
        c.condition,
        c.date||'', c.location||'', c.event||'', c.description||'',
        c.medicalCare==='yes'?'Yes':'No', c.clinicName||'', c.witnesses||'',
        c.domains.cognition.level + (c.domains.cognition.level !== 'none' ? ' (' + c.domains.cognition.frequency + ')' : ''),
        c.domains.interpersonal.level + (c.domains.interpersonal.level !== 'none' ? ' (' + c.domains.interpersonal.frequency + ')' : ''),
        c.domains.taskCompletion.level + (c.domains.taskCompletion.level !== 'none' ? ' (' + c.domains.taskCompletion.frequency + ')' : ''),
        c.domains.environments.level + (c.domains.environments.level !== 'none' ? ' (' + c.domains.environments.frequency + ')' : ''),
        c.domains.selfCare.level + (c.domains.selfCare.level !== 'none' ? ' (' + c.domains.selfCare.frequency + ')' : ''),
        c.calculatedRating + '%',
        c.effectiveRating + '%',
        c.manualOverride !== null ? 'Yes' : 'No'
      ];
      csvRows.push(row.map(esc).join(','));
    });
  }

  // Head & Face conditions
  const hdConds = window._headConditions || [];
  if(hdConds.length){
    csvRows.push('');
    csvRows.push(esc('HEAD & FACE EVALUATION'));
    csvRows.push(['Condition','Date','Location','Event','Description','Medical Care','Clinic','Witnesses','Profile','Domain Values','Calculated Rating','Effective Rating','Override'].join(','));
    hdConds.forEach(c => {
      const profile = (typeof HEAD_PROFILES !== 'undefined' ? HEAD_PROFILES[c.profile] : null) || {label:'',domains:[]};
      const domainStr = profile.domains.map(d => {
        const v = c.domains[d.id];
        const lv = d.levels ? d.levels.find(l => l.value === v) : null;
        return d.label.split(':').pop().trim() + '=' + (lv ? lv.label : v + '%');
      }).join('; ');
      const row = [
        c.condition,
        c.date||'', c.location||'', c.event||'', c.description||'',
        c.medicalCare==='yes'?'Yes':'No', c.clinicName||'', c.witnesses||'',
        profile.label || c.profile,
        domainStr,
        c.calculatedRating + '%',
        c.effectiveRating + '%',
        c.manualOverride !== null ? 'Yes' : 'No'
      ];
      csvRows.push(row.map(esc).join(','));
    });
  }

  // Body part evaluated conditions
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      const bpConds = window[cfg.stateKey] || [];
      if(!bpConds.length) return;
      csvRows.push('');
      csvRows.push(esc(cfg.title.toUpperCase() + ' EVALUATION'));
      csvRows.push(['Condition','Date','Location','Event','Description','Medical Care','Clinic','Witnesses','Profile','Extremity','Domain Values','Calculated Rating','Effective Rating','Override'].join(','));
      bpConds.forEach(c => {
        const profile = cfg.profiles()[c.profile] || cfg.profiles().generic;
        const domainStr = profile.domains.map(d => {
          const v = c.domains[d.id];
          const lv = d.levels ? d.levels.find(l => l.value === v) : null;
          return d.label.split(':').pop().trim() + '=' + (lv ? lv.label : v + '%');
        }).join('; ');
        csvRows.push([
          c.condition,
          c.date||'', c.location||'', c.event||'', c.description||'',
          c.medicalCare==='yes'?'Yes':'No', c.clinicName||'', c.witnesses||'',
          profile.label || c.profile,
          c.extremity || 'none',
          domainStr,
          c.calculatedRating + '%',
          c.effectiveRating + '%',
          c.manualOverride !== null ? 'Yes' : 'No'
        ].map(esc).join(','));
      });
    });
  }

  // SMC selections
  const smcCSV = window._smcSelections || [];
  if(smcCSV.length){
    csvRows.push('');
    csvRows.push(esc('SPECIAL MONTHLY COMPENSATION (SMC)'));
    csvRows.push(['SMC Level','Description'].join(','));
    const smcLevelsCSV = typeof SMC_LEVELS !== 'undefined' ? SMC_LEVELS : [];
    smcCSV.forEach(id => {
      const smc = smcLevelsCSV.find(s => s.id === id);
      if(smc) csvRows.push([esc(smc.label), esc(smc.description)].join(','));
    });
  }

  // Presumptive service connection
  const presCSV = window._presumptiveData || {};
  const presClaimsCSV = typeof PRESUMPTIVE_CLAIMS !== 'undefined' ? PRESUMPTIVE_CLAIMS : [];
  const activePresCSV = presClaimsCSV.filter(c => presCSV[c.id] && presCSV[c.id].selected);
  if(activePresCSV.length){
    csvRows.push('');
    csvRows.push(esc('PRESUMPTIVE SERVICE CONNECTION'));
    activePresCSV.forEach(claim => {
      const d = presCSV[claim.id];
      csvRows.push(esc(claim.label));
      claim.fields.forEach(f => {
        const val = d[f.id] || '';
        if(val) csvRows.push(esc('  ' + f.label + ' ' + val));
      });
    });
  }

  // MST conditions
  const mstCSV = window._mstData || { conditions:[], privacyShield:true };
  if(mstCSV.conditions.length){
    csvRows.push('');
    csvRows.push(esc('MST-RELATED CONDITIONS' + (mstCSV.privacyShield ? ' (PRIVACY SHIELD ACTIVE)' : '')));
    csvRows.push(['Condition','Rating','Secondary Conditions'].join(','));
    mstCSV.conditions.forEach(c => {
      const name = mstCSV.privacyShield ? 'Private Condition' : c.name;
      const secs = (c.secondaries||[]).map(s =>
        mstCSV.privacyShield ? 'Private Secondary ('+s.rating+'%)' : s.name+' ('+s.rating+'%)'
      ).join('; ');
      csvRows.push([esc(name), c.rating+'%', esc(secs)].join(','));
    });
  }

  // Rating summary row
  if(ratingResult.rounded>0){
    csvRows.push('');
    csvRows.push(esc('COMBINED VA DISABILITY RATING: '+ratingResult.rounded+'%'));
    csvRows.push(esc('Exact: '+ratingResult.combined.toFixed(2)+'%'));
    if(ratingResult.bilateral) csvRows.push(esc('Bilateral factor: +'+ratingResult.bilateralFactor.toFixed(2)+'%'));
    csvRows.push('');
    csvRows.push(esc('STEP-BY-STEP CALCULATION'));
    ratingResult.breakdown.split('\n').forEach(line=>{
      csvRows.push(esc(line));
    });
  }

  const blob = new Blob([csvRows.join('\r\n')], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'injury-report-'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── TXT EXPORT ──
function exportTXT(){
  const _pk3 = _getPanelKeys();
  const filteredInj3 = injuries.filter(i => !_pk3.has(i.key));
  if(!filteredInj3.length && !(window._mentalHealthConditions||[]).length && !(window._headConditions||[]).length){alert('No injuries to export.');return;}
  const sorted=[...filteredInj3].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const line = '='.repeat(60);
  const dash = '-'.repeat(40);
  let txt = '';

  txt += line + '\n';
  txt += '  INJURY DOCUMENTATION SUMMARY\n';
  txt += '  Generated: ' + new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) + '\n';
  txt += line + '\n\n';

  txt += 'NOTICE: This records personal injury notes only.\n';
  txt += 'It does not determine VA eligibility or guarantee claim approval.\n\n';

  // Stats — count all condition sources
  const incomplete = sorted.filter(i=>gapStatus(i).status==='incomplete');
  const _mhT = window._mentalHealthConditions || [];
  const _hdT = window._headConditions || [];
  const _bpT = typeof BP_REGISTRY!=='undefined' ? Object.values(BP_REGISTRY).flatMap(cfg => window[cfg.stateKey] || []) : [];
  const _allEvT = [..._mhT, ..._hdT, ..._bpT];
  const _totT = filteredInj3.length + _allEvT.length;
  const _medT = filteredInj3.filter(i=>i.medicalCare==='yes').length + _allEvT.filter(c=>c.medicalCare==='yes').length;
  const _areaSetT = new Set(filteredInj3.map(i=>i.key));
  if(_mhT.length) _areaSetT.add('mental');
  if(_hdT.length) _areaSetT.add('head');
  if(typeof BP_REGISTRY!=='undefined') Object.values(BP_REGISTRY).forEach(cfg => { if((window[cfg.stateKey]||[]).length) _areaSetT.add(cfg.id); });
  const _evIncT = _allEvT.filter(c => typeof gapStatus==='function' && gapStatus(c).status==='incomplete').length;
  txt += 'SUMMARY\n' + dash + '\n';
  txt += '  Total Conditions:  ' + _totT + '\n';
  txt += '  Medical Visits:    ' + _medT + '\n';
  txt += '  Body Areas:        ' + _areaSetT.size + '\n';
  txt += '  Needs Evidence:    ' + (incomplete.length + _evIncT) + '\n';
  const txtRating = getRatingBreakdown();
  if(txtRating.rounded>0){
    txt += '  Combined Rating:   ' + txtRating.rounded + '%\n';
  }
  txt += '\n';

  // Evidence gap summary
  if(incomplete.length){
    txt += 'EVIDENCE GAPS\n' + dash + '\n';
    incomplete.forEach(i=>{
      const g = gapStatus(i);
      txt += '  #' + (sorted.indexOf(i)+1) + ' ' + i.label + '\n';
      txt += '     Missing: ' + g.gaps.join(', ') + '\n';
    });
    txt += '\n';
  }

  // Each injury
  txt += 'INJURY DETAILS\n' + line + '\n\n';
  sorted.forEach((i,idx)=>{
    const g = gapStatus(i);
    txt += '#' + (idx+1) + '  ' + i.label + '\n';
    txt += dash + '\n';
    txt += '  Date:           ' + (i.date||'—') + '\n';
    txt += '  Severity:       ' + (i.severity==='custom'?'Other':i.severity) + '\n';
    txt += '  Body:           ' + i.pin.body + ' / ' + i.pin.side + '\n';
    txt += '  Installation:   ' + (i.location||'—') + '\n';
    txt += '  Event:          ' + (i.event||'—') + '\n';
    txt += '  Description:    ' + (i.description||'—') + '\n';
    txt += '  Medical Care:   ' + (i.medicalCare==='yes'?(i.clinicName||'Yes'):'No') + '\n';
    txt += '  Witnesses:      ' + (i.witnesses||'—') + '\n';
    txt += '  Still Seen:     ' + (i.stillBeingSeen?'Yes':'No') + '\n';
    txt += '  Evidence:       ' + g.label + '\n';
    if(g.gaps.length) txt += '  Missing:        ' + g.gaps.join(', ') + '\n';
    if(i.functionalImpacts?.length){
      txt += '  Daily Impact:   ' + i.functionalImpacts.join(', ') + '\n';
    }
    if(i.secondaries?.length){
      txt += '  Secondary:      ' + i.secondaries.join(', ') + '\n';
    }
    if(i.secondaryNotes) txt += '  Notes:          ' + i.secondaryNotes + '\n';
    txt += '\n';
  });

  // Mental health
  const mhCondsT = window._mentalHealthConditions || [];
  if(mhCondsT.length){
    const mhHighest = mhCondsT.reduce((b,c)=>c.effectiveRating>b.effectiveRating?c:b, mhCondsT[0]);
    txt += 'MENTAL HEALTH EVALUATION (VA 8787)\n' + line + '\n\n';
    txt += 'Note: VA rates all mental health conditions under one combined rating.\n';
    txt += 'Highest rating used: ' + mhHighest.effectiveRating + '% (' + mhHighest.condition + ')\n\n';
    mhCondsT.forEach(c => {
      txt += '  ' + c.condition + (c.id === mhHighest.id && mhCondsT.length > 1 ? ' [ACTIVE RATING]' : '') + '\n';
      txt += '  ' + dash + '\n';
      txt += '    Date:           ' + (c.date||'—') + '\n';
      if(c.location) txt += '    Location:       ' + c.location + '\n';
      if(c.event) txt += '    Event:          ' + c.event + '\n';
      if(c.description) txt += '    Description:    ' + c.description + '\n';
      if(c.medicalCare==='yes') txt += '    Medical Care:   ' + (c.clinicName||'Yes') + '\n';
      if(c.witnesses) txt += '    Witnesses:      ' + c.witnesses + '\n';
      (typeof MH_DOMAINS !== 'undefined' ? MH_DOMAINS : []).forEach(d => {
        const dv = c.domains[d.id];
        if(dv && dv.level !== 'none'){
          txt += '    ' + d.label + ': ' + dv.level + ' (' + (dv.frequency === '25plus' ? '25%+ of time' : '<25% of time') + ')\n';
        }
      });
      txt += '    Rating: ' + c.effectiveRating + '%' + (c.manualOverride !== null ? ' (manual override)' : '') + '\n\n';
    });
  }

  // Head & Face
  const hdCondsT = window._headConditions || [];
  if(hdCondsT.length){
    txt += 'HEAD & FACE EVALUATION (VA 8787)\n' + line + '\n\n';
    txt += 'Note: Each head/face condition is rated independently.\n\n';
    hdCondsT.forEach(c => {
      const profile = (typeof HEAD_PROFILES !== 'undefined' ? HEAD_PROFILES[c.profile] : null) || {label:'',domains:[]};
      txt += '  ' + c.condition + ' [' + (profile.label || c.profile) + ']\n';
      txt += '  ' + dash + '\n';
      txt += '    Date:           ' + (c.date||'—') + '\n';
      if(c.location) txt += '    Location:       ' + c.location + '\n';
      if(c.event) txt += '    Event:          ' + c.event + '\n';
      if(c.description) txt += '    Description:    ' + c.description + '\n';
      if(c.medicalCare==='yes') txt += '    Medical Care:   ' + (c.clinicName||'Yes') + '\n';
      if(c.witnesses) txt += '    Witnesses:      ' + c.witnesses + '\n';
      profile.domains.forEach(d => {
        const v = c.domains[d.id];
        if(v > 0){
          const lv = d.levels ? d.levels.find(l => l.value === v) : null;
          txt += '    ' + d.label + ': ' + (lv ? lv.label : v + '%') + '\n';
        }
      });
      txt += '    Rating: ' + c.effectiveRating + '%' + (c.manualOverride !== null ? ' (manual override)' : '') + '\n\n';
    });
  }

  // Body part evaluated conditions
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      const bpConds = window[cfg.stateKey] || [];
      if(!bpConds.length) return;
      txt += cfg.title.toUpperCase() + ' EVALUATION (VA 8787)\n' + line + '\n\n';
      txt += 'Note: ' + cfg.note + '\n\n';
      bpConds.forEach(c => {
        const profile = cfg.profiles()[c.profile] || cfg.profiles().generic;
        const extLabel = c.extremity && c.extremity !== 'none' ? ' [' + c.extremity + ']' : '';
        txt += '  ' + c.condition + extLabel + ' [' + (profile.label || c.profile) + ']\n';
        txt += '  ' + dash + '\n';
        txt += '    Date:           ' + (c.date||'—') + '\n';
        if(c.location) txt += '    Location:       ' + c.location + '\n';
        if(c.event) txt += '    Event:          ' + c.event + '\n';
        if(c.description) txt += '    Description:    ' + c.description + '\n';
        if(c.medicalCare==='yes') txt += '    Medical Care:   ' + (c.clinicName||'Yes') + '\n';
        if(c.witnesses) txt += '    Witnesses:      ' + c.witnesses + '\n';
        profile.domains.forEach(d => {
          const v = c.domains[d.id];
          if(v > 0){
            const lv = d.levels ? d.levels.find(l => l.value === v) : null;
            txt += '    ' + d.label + ': ' + (lv ? lv.label : v + '%') + '\n';
          }
        });
        txt += '    Rating: ' + c.effectiveRating + '%' + (c.manualOverride !== null ? ' (manual override)' : '') + '\n\n';
      });
    });
  }

  // Personal statement
  if(window._personalStatement){
    txt += 'PERSONAL STATEMENT\n' + line + '\n\n';
    // Strip HTML tags for plain text
    const _tmpDiv = document.createElement('div');
    _tmpDiv.innerHTML = window._personalStatement;
    txt += (_tmpDiv.textContent || _tmpDiv.innerText || '').trim() + '\n\n';
  }

  // Vocational
  const vocSecs = window._vocSecondaries||[];
  if(vocSecs.length){
    txt += 'VOCATIONAL CONDITIONS\n' + dash + '\n';
    vocSecs.forEach(s=>{ txt += '  - ' + s + '\n'; });
    if(window._vocNotes) txt += '\n  Notes: ' + window._vocNotes + '\n';
    txt += '\n';
  }

  // SMC selections
  const smcTXT = window._smcSelections || [];
  if(smcTXT.length){
    const smcLevelsTXT = typeof SMC_LEVELS !== 'undefined' ? SMC_LEVELS : [];
    txt += 'SPECIAL MONTHLY COMPENSATION (SMC)\n' + line + '\n\n';
    txt += 'These are extra flat payments — NOT percentage ratings.\n\n';
    smcTXT.forEach(id => {
      const smc = smcLevelsTXT.find(s => s.id === id);
      if(smc) txt += '  ' + smc.label + '\n';
    });
    txt += '\n';
  }

  // Presumptive service connection
  const presTXT = window._presumptiveData || {};
  const presClaimsTXT = typeof PRESUMPTIVE_CLAIMS !== 'undefined' ? PRESUMPTIVE_CLAIMS : [];
  const activePresTXT = presClaimsTXT.filter(c => presTXT[c.id] && presTXT[c.id].selected);
  if(activePresTXT.length){
    txt += 'PRESUMPTIVE SERVICE CONNECTION\n' + line + '\n\n';
    activePresTXT.forEach(claim => {
      const d = presTXT[claim.id];
      txt += '  ' + claim.label + '\n';
      txt += '  ' + dash + '\n';
      claim.fields.forEach(f => {
        const val = d[f.id] || '';
        if(val) txt += '    ' + f.label + ' ' + val + '\n';
      });
      txt += '\n';
    });
  }

  // MST conditions
  const mstTXT = window._mstData || { conditions:[], privacyShield:true };
  if(mstTXT.conditions.length){
    txt += 'MST-RELATED CONDITIONS\n' + line + '\n\n';
    if(mstTXT.privacyShield){
      txt += 'Privacy Shield Active — condition details withheld.\n\n';
      mstTXT.conditions.forEach((c,i) => {
        txt += '  Private Condition — ' + c.rating + '%\n';
        if(c.secondaries && c.secondaries.length){
          c.secondaries.forEach(s => {
            txt += '    > Private Secondary — ' + s.rating + '%\n';
          });
        }
      });
    } else {
      mstTXT.conditions.forEach(c => {
        txt += '  ' + c.name + ' — ' + c.rating + '%\n';
        if(c.secondaries && c.secondaries.length){
          c.secondaries.forEach(s => {
            txt += '    > ' + s.name + ' (secondary) — ' + s.rating + '%\n';
          });
        }
      });
    }
    txt += '\n';
  }

  // Rating breakdown
  if(txtRating.rounded>0){
    txt += 'VA DISABILITY RATING ESTIMATE\n' + line + '\n\n';
    txt += txtRating.breakdown + '\n\n';
  }

  txt += line + '\n';
  txt += '(c) K. Dimond. All Rights Reserved.\n';

  const blob = new Blob([txt], {type:'text/plain;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'injury-report-'+new Date().toISOString().slice(0,10)+'.txt';
  a.click();
  URL.revokeObjectURL(url);
}
// ── CSV IMPORT ──

// Build a label→pinKey lookup from FRONT_PINS and BACK_PINS
// Maps lowercase label to {key, x, y, side, body}
const _LABEL_TO_PIN = {};
function _buildLabelMap(){
  // Front pins (default to male front)
  Object.entries(FRONT_PINS).forEach(([key,info])=>{
    _LABEL_TO_PIN[info.label.toLowerCase()] = {key, x:info.x, y:info.y, side:'front', body:'male'};
  });
  // Back-only pins (upperBack, spine, lowerBack, glutes, hamstrings, calves)
  Object.entries(BACK_PINS).forEach(([key,info])=>{
    const lbl = info.label.toLowerCase();
    if(!_LABEL_TO_PIN[lbl]){
      _LABEL_TO_PIN[lbl] = {key, x:info.x, y:info.y, side:'back', body:'male'};
    }
  });
  // Add common aliases
  const aliases = {
    'head':'head', 'tmj':'jaw', 'jaw':'jaw',
    'left ear':'leftEar', 'right ear':'rightEar',
    'left eye':'leftEye', 'right eye':'rightEye',
    'neck':'neck', 'cervical':'neck',
    'left shoulder':'leftShoulder', 'right shoulder':'rightShoulder',
    'chest':'chest', 'left lung':'leftLung', 'right lung':'rightLung',
    'abdomen':'abdomen', 'stomach':'abdomen',
    'pelvis':'pelvis', 'groin':'pelvis', 'pelvis / groin':'pelvis',
    'left elbow':'leftElbow', 'right elbow':'rightElbow',
    'left forearm':'leftForearm', 'right forearm':'rightForearm',
    'left wrist':'leftWrist', 'right wrist':'rightWrist',
    'left hand':'leftHand', 'right hand':'rightHand',
    'left hip':'leftHip', 'right hip':'rightHip',
    'left thigh':'leftThigh', 'right thigh':'rightThigh',
    'left knee':'leftKnee', 'right knee':'rightKnee',
    'left shin':'leftShin', 'right shin':'rightShin',
    'left ankle':'leftAnkle', 'right ankle':'rightAnkle',
    'left foot':'leftFoot', 'right foot':'rightFoot',
    'upper back':'upperBack', 'spine':'spine',
    'lower back':'lowerBack', 'lumbar':'lowerBack',
    'glutes':'glutes', 'buttocks':'glutes',
    'left hamstring':'leftHamstring', 'right hamstring':'rightHamstring',
    'left calf':'leftCalf', 'right calf':'rightCalf',
    // Group-level aliases
    'back':'lowerBack', 'shoulder':'leftShoulder', 'knee':'leftKnee',
    'ankle':'leftAnkle', 'foot':'leftFoot', 'elbow':'leftElbow',
    'wrist':'leftWrist', 'hand':'leftHand', 'hip':'leftHip',
    'shin':'leftShin', 'thigh':'leftThigh', 'lung':'leftLung',
    'ear':'leftEar', 'eye':'leftEye',
  };
  Object.entries(aliases).forEach(([alias, key])=>{
    if(_LABEL_TO_PIN[alias]) return; // don't overwrite exact matches
    const pin = FRONT_PINS[key] || BACK_PINS[key];
    if(!pin) return;
    const side = BACK_PINS[key] && !FRONT_PINS[key] ? 'back' : 'front';
    _LABEL_TO_PIN[alias] = {key, x:pin.x, y:pin.y, side, body:'male'};
  });
}
_buildLabelMap();

function resolvePin(label, body, side){
  // Try exact label match first
  const lbl = (label||'').toLowerCase().trim();
  const match = _LABEL_TO_PIN[lbl];
  if(match){
    return {
      key: match.key,
      x: match.x,
      y: match.y,
      side: side || match.side,
      body: body || match.body,
      label: label
    };
  }
  // Fallback: center of body
  return {
    key: 'custom',
    x: 52, y: 45,
    side: side || 'front',
    body: body || 'male',
    label: label
  };
}

// ── SANITIZER ──
function _sanitize(str){
  if(!str) return '';
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

// ── CSV PARSER ──
function parseCSV(text){
  const rows = [];
  let current = '';
  let inQuotes = false;
  const lines = text.split('\n');

  for(let line of lines){
    if(inQuotes){
      current += '\n' + line;
    } else {
      current = line;
    }
    // Count unescaped quotes
    const quoteCount = (current.match(/"/g)||[]).length;
    inQuotes = quoteCount % 2 !== 0;
    if(!inQuotes){
      rows.push(parseCSVRow(current));
      current = '';
    }
  }
  return rows;
}

function parseCSVRow(line){
  const cells = [];
  let current = '';
  let inQuotes = false;
  for(let i=0; i<line.length; i++){
    const ch = line[i];
    if(inQuotes){
      if(ch==='"' && line[i+1]==='"'){ current+='"'; i++; }
      else if(ch==='"'){ inQuotes=false; }
      else { current+=ch; }
    } else {
      if(ch==='"'){ inQuotes=true; }
      else if(ch===','){ cells.push(current.trim()); current=''; }
      else { current+=ch; }
    }
  }
  cells.push(current.trim().replace(/\r$/,''));
  return cells;
}

// ── IMPORT LOGIC ──
function openImportModal(){
  document.getElementById('import-modal').classList.remove('hidden');
  document.body.style.overflow='hidden';
  document.getElementById('import-file').value='';
  document.getElementById('import-preview').innerHTML='';
  document.getElementById('import-status').textContent='';
  document.getElementById('import-confirm-btn').classList.add('hidden');
}

function closeImportModal(){
  document.getElementById('import-modal').classList.add('hidden');
  document.body.style.overflow='';
}

let _importData = null;

function handleImportFile(input){
  const file = input.files[0];
  if(!file) return;
  const status = document.getElementById('import-status');
  const preview = document.getElementById('import-preview');

  if(!file.name.endsWith('.csv')){
    status.textContent = 'Please select a .csv file.';
    status.style.color = 'var(--red)';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e){
    const rows = parseCSV(e.target.result);
    if(rows.length < 2){
      status.textContent = 'File is empty or has no data rows.';
      status.style.color = 'var(--red)';
      return;
    }

    const headers = rows[0].map(h=>h.toLowerCase().trim());
    const dataRows = rows.slice(1).filter(r=>r.some(c=>c.trim()));

    // Map columns
    const colMap = {
      label:    findCol(headers, ['body area','label','injury','area','name']),
      date:     findCol(headers, ['date','date of injury','incident date']),
      severity: findCol(headers, ['severity','sev']),
      location: findCol(headers, ['installation','location','base','post']),
      event:    findCol(headers, ['event','training event','duty','incident']),
      desc:     findCol(headers, ['description','notes','desc','details']),
      medical:  findCol(headers, ['medical','medical care','medical care received']),
      clinic:   findCol(headers, ['clinic','hospital','clinic / hospital']),
      witnesses:findCol(headers, ['witnesses','witness']),
      body:     findCol(headers, ['body','body type']),
      side:     findCol(headers, ['side','view']),
      secondary:findCol(headers, ['secondary','secondary conditions']),
      impacts:  findCol(headers, ['impact','daily impact','daily life impact','functional impact']),
    };

    if(colMap.label===-1 && colMap.date===-1){
      status.textContent = 'Could not find "Body Area" or "Date" columns. Please use the template.';
      status.style.color = 'var(--red)';
      return;
    }

    // Build preview
    const mapped = dataRows.map(r=>({
      label:     _sanitize(r[colMap.label]||'Unknown'),
      date:      _sanitize(r[colMap.date]||''),
      severity:  normSeverity(r[colMap.severity]),
      location:  _sanitize(r[colMap.location]||''),
      event:     _sanitize(r[colMap.event]||''),
      desc:      _sanitize(r[colMap.desc]||''),
      medical:   normMedical(r[colMap.medical]),
      clinic:    _sanitize(r[colMap.clinic]||''),
      witnesses: _sanitize(r[colMap.witnesses]||''),
      body:      normBody(r[colMap.body]),
      side:      normSide(r[colMap.side]),
      secondary: (r[colMap.secondary]||'').split(';').map(s=>_sanitize(s.trim())).filter(Boolean),
      impacts:   (r[colMap.impacts]||'').split(';').map(s=>_sanitize(s.trim())).filter(Boolean),
    }));

    _importData = mapped;

    // Show preview
    const found = [];
    if(colMap.label>=0) found.push('Body Area');
    if(colMap.date>=0) found.push('Date');
    if(colMap.severity>=0) found.push('Severity');
    if(colMap.location>=0) found.push('Installation');
    if(colMap.event>=0) found.push('Event');
    if(colMap.desc>=0) found.push('Description');
    if(colMap.medical>=0) found.push('Medical');
    if(colMap.clinic>=0) found.push('Clinic');
    if(colMap.witnesses>=0) found.push('Witnesses');
    if(colMap.secondary>=0) found.push('Secondary');
    if(colMap.impacts>=0) found.push('Impacts');

    status.textContent = `Found ${mapped.length} injuries. Matched columns: ${found.join(', ')}`;
    status.style.color = 'var(--mild)';

    let ph = `<table style="width:100%;border-collapse:collapse;font-size:11px;margin-top:8px;">
      <thead><tr style="background:var(--navy);color:#fff;">
        <th style="padding:6px 8px;text-align:left;font-family:var(--fh);font-size:10px;text-transform:uppercase;letter-spacing:.5px;">#</th>
        <th style="padding:6px 8px;text-align:left;font-family:var(--fh);font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Body Area</th>
        <th style="padding:6px 8px;text-align:left;font-family:var(--fh);font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Date</th>
        <th style="padding:6px 8px;text-align:left;font-family:var(--fh);font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Severity</th>
        <th style="padding:6px 8px;text-align:left;font-family:var(--fh);font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Pin</th>
      </tr></thead><tbody>`;
    mapped.forEach((m,idx)=>{
      const pin = resolvePin(m.label, m.body, m.side);
      const pinOk = pin.key!=='custom';
      ph += `<tr style="border-bottom:1px solid var(--border);${idx%2?'background:var(--surface2)':''}">
        <td style="padding:5px 8px;font-family:var(--fm);font-weight:700;">${idx+1}</td>
        <td style="padding:5px 8px;">${m.label}</td>
        <td style="padding:5px 8px;font-family:var(--fm);">${m.date||'—'}</td>
        <td style="padding:5px 8px;text-transform:capitalize;">${m.severity}</td>
        <td style="padding:5px 8px;color:${pinOk?'var(--mild)':'var(--moderate)'};">${pinOk?'Matched':'Manual'}</td>
      </tr>`;
    });
    ph += '</tbody></table>';
    preview.innerHTML = ph;
    document.getElementById('import-confirm-btn').classList.remove('hidden');
  };
  reader.readAsText(file);
}

function confirmImport(){
  if(!_importData||!_importData.length) return;

  let imported = 0;
  _importData.forEach(m=>{
    const pin = resolvePin(m.label, m.body, m.side);
    const inj = {
      id: Date.now() + imported,
      key: pin.key,
      label: m.label,
      date: m.date,
      severity: m.severity,
      location: m.location,
      event: m.event,
      description: m.desc,
      medicalCare: m.medical,
      clinicName: m.clinic,
      witnesses: m.witnesses,
      stillBeingSeen: false,
      functionalImpacts: m.impacts,
      secondaries: m.secondary,
      pin: {x:pin.x, y:pin.y, side:pin.side, body:pin.body, label:m.label},
    };
    injuries.push(inj);
    dropPin(inj);
    imported++;
  });

  updateBadges(); updateCount(); refreshPinNumbers();
  _importData = null;
  closeImportModal();
  alert(`Imported ${imported} injuries successfully.`);
}

// ── TEMPLATE DOWNLOAD ──
function downloadTemplate(){
  const headers = ['Body Area','Date','Severity','Installation','Event','Description','Medical Care','Clinic','Witnesses','Body','Side','Secondary Conditions','Daily Life Impact'];
  const example = ['Right Knee','2020-03-15','severe','Fort Hood','Ruck march','Twisted knee during 12-mile ruck','Yes','Battalion Aid Station','SSG Smith','male','front','Limited ROM - knee; Degenerative joint disease','Cannot stand for long periods; Difficulty with stairs'];
  const csv = headers.join(',') + '\r\n' + example.map(v=>v.includes(',')?'"'+v+'"':v).join(',') + '\r\n';

  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'injury-import-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── HELPERS ──
function findCol(headers, names){
  for(const name of names){
    const idx = headers.indexOf(name.toLowerCase());
    if(idx>=0) return idx;
  }
  return -1;
}

function normSeverity(val){
  if(!val) return 'moderate';
  const v = val.toLowerCase().trim();
  if(v==='mild') return 'mild';
  if(v==='severe') return 'severe';
  if(v==='moderate') return 'moderate';
  if(v==='other'||v==='custom'||v==='unknown') return 'custom';
  return 'moderate';
}

function normMedical(val){
  if(!val) return '';
  const v = val.toLowerCase().trim();
  if(v==='yes'||v==='y'||v==='true'||v==='1') return 'yes';
  if(v==='no'||v==='n'||v==='false'||v==='0') return 'no';
  return '';
}

function normBody(val){
  if(!val) return 'male';
  const v = val.toLowerCase().trim();
  return v==='female'||v==='f' ? 'female' : 'male';
}

function normSide(val){
  if(!val) return 'front';
  const v = val.toLowerCase().trim();
  return v==='back'||v==='b'||v==='rear' ? 'back' : 'front';
}
