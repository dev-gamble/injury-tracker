// ── DATA CONSTANTS ── Pin coordinates, groups, secondary condition maps

// Severity-color class for a rating badge. The .mh-rate-* scale in styles.css
// is defined per decade, but combining separate diagnostic codes within one
// joint (38 CFR 4.25 — knee, hip, elbow) yields intermediate values like 19 or
// 44, which would land on a class that doesn't exist and render uncolored.
// Snap to the nearest decade for the COLOR only; the displayed % stays exact.
function _rateClass(rating){
  const v = Math.max(0, Math.min(100, Math.round((Number(rating) || 0) / 10) * 10));
  return 'mh-rate-' + v;
}

const MENTAL_PINS = {"mental": {"label": "Mental Health", "x": 52, "y": 10}};
const HEAD_PINS = {"headFace": {"label": "Head & Face", "x": 52, "y": 17}};
// NOTE: The front view is a mirror — the body's LEFT side is on the VIEWER'S RIGHT
// (map.js draws the RIGHT label on the viewer's left). Left-side pins therefore
// use the higher x values, matching the on-map side labels.
const FRONT_PINS = {"head": {"label": "Head", "x": 52, "y": 17}, "leftEar": {"label": "Left Ear", "x": 73, "y": 17}, "rightEar": {"label": "Right Ear", "x": 30, "y": 17}, "leftEye": {"label": "Left Eye", "x": 63, "y": 14}, "rightEye": {"label": "Right Eye", "x": 40, "y": 14}, "nose": {"label": "Nose", "x": 52, "y": 16}, "jaw": {"label": "Jaw / TMJ", "x": 52, "y": 22}, "neck": {"label": "Neck", "x": 52, "y": 25}, "leftShoulder": {"label": "Left Shoulder", "x": 80, "y": 30}, "rightShoulder": {"label": "Right Shoulder", "x": 21, "y": 30}, "chest": {"label": "Chest", "x": 52, "y": 34}, "leftLung": {"label": "Left Lung", "x": 68, "y": 34}, "rightLung": {"label": "Right Lung", "x": 35, "y": 34}, "abdomen": {"label": "Abdomen", "x": 52, "y": 46}, "leftElbow": {"label": "Left Elbow", "x": 83, "y": 42}, "rightElbow": {"label": "Right Elbow", "x": 19, "y": 42}, "leftForearm": {"label": "Left Forearm", "x": 88, "y": 49}, "rightForearm": {"label": "Right Forearm", "x": 13, "y": 49}, "leftWrist": {"label": "Left Wrist", "x": 90, "y": 54}, "rightWrist": {"label": "Right Wrist", "x": 10, "y": 54}, "leftHand": {"label": "Left Hand", "x": 87, "y": 57}, "rightHand": {"label": "Right Hand", "x": 14, "y": 57}, "leftHip": {"label": "Left Hip", "x": 63, "y": 54}, "rightHip": {"label": "Right Hip", "x": 37, "y": 54}, "pelvis": {"label": "Pelvis / Groin", "x": 52, "y": 55}, "leftThigh": {"label": "Left Thigh", "x": 62, "y": 63}, "rightThigh": {"label": "Right Thigh", "x": 38, "y": 63}, "leftKnee": {"label": "Left Knee", "x": 62, "y": 70}, "rightKnee": {"label": "Right Knee", "x": 38, "y": 70}, "leftShin": {"label": "Left Shin", "x": 62, "y": 77}, "rightShin": {"label": "Right Shin", "x": 38, "y": 77}, "leftAnkle": {"label": "Left Ankle", "x": 62, "y": 84}, "rightAnkle": {"label": "Right Ankle", "x": 38, "y": 84}, "leftFoot": {"label": "Left Foot", "x": 62, "y": 87}, "rightFoot": {"label": "Right Foot", "x": 37, "y": 87}};
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

// Injuries whose key is panel-managed are hidden anchors — their real data
// lives in the panel's own state array and renders from there. Records logged
// through a CUSTOM PIN also carry a panel key (every area in the form's
// dropdown is panel-managed), but they are ordinary injuries with their own
// user-typed details, so they must stay visible. Every consumer of the
// injuries array (timeline, rating, exports, statement, secondary) filters
// through here.
function _nonPanelInjuries(list){
  const pk = _getPanelKeys();
  return (list || []).filter(i => i.customPin || !pk.has(i.key));
}

// Returns default info field values for new conditions
function _condInfoDefaults(){ return {date:'',location:'',event:'',description:'',medicalCare:'',clinicName:'',witnesses:'',stillBeingSeen:false}; }

// Attach scroll-bottom detection to condition lists (hides "Scroll for more" hint)
function _initCondListScroll(listEl){
  if(!listEl) return;
  listEl.classList.remove('scrolled-bottom');
  const check = () => {
    if(listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 10){
      listEl.classList.add('scrolled-bottom');
    } else {
      listEl.classList.remove('scrolled-bottom');
    }
  };
  // The list element outlives its own innerHTML: every re-render calls back in
  // here on the SAME node — once per keystroke while searching — so binding
  // unconditionally stacks up handlers that all fire on every scroll. Bind once;
  // a genuinely new element (full panel re-render) arrives without the flag.
  if(!listEl._condScrollBound){
    listEl.addEventListener('scroll', check);
    listEl._condScrollBound = true;
  }
  // If content doesn't overflow, hide hint immediately
  setTimeout(check, 50);
}

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
  "Degenerative disc disease (cervical)": "neck pain, stiffness, osteoarthritis of spine",
  "Degenerative disc disease (lumbar)": "lower back pain, stiffness, osteoarthritis of spine",
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
  "Acute stress disorder","Unspecified trauma and stressor related disorder",
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
    "Migraine headaches","TBI residuals","Temporomandibular disorder (TMD)","Tinnitus",
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
  "Deviated nasal septum",
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
          { value: 10, label: 'Hearing loss and/or ringing (tinnitus)', description: 'Difficulty hearing conversations or sounds, and/or ringing, buzzing, or hissing in one or both ears. Note: Tinnitus is rated separately under DC 6260 (use the Tinnitus profile to claim it) — hearing loss and tinnitus CAN both be rated on the same ear.' },
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
        { value: 10, label: '20/50–20/100 in one eye (other 20/40)', description: 'Mild impairment in one eye; other eye normal' },
        { value: 20, label: '20/200 in one eye (other 20/40)', description: 'Legal-blindness-level impairment in one eye; other eye normal' },
        { value: 30, label: '10/200–5/200 or light perception only in one eye (other 20/40), or 20/70 both eyes', description: 'Functional blindness in one eye with normal other eye, or moderate impairment in both eyes' },
        { value: 40, label: 'Anatomical loss of one eye (other 20/40)', description: 'One eye removed or destroyed; other eye normal' },
        { value: 50, label: '20/100 both eyes', description: 'Significant impairment in both eyes' },
        { value: 70, label: '20/200 both eyes', description: 'Legal blindness in both eyes' },
        { value: 90, label: '10/200 both eyes', description: 'Near-total vision loss in both eyes' },
        { value: 100, label: '5/200 both eyes, light perception only in both eyes, or anatomical loss of both eyes', description: 'Profound bilateral visual impairment or total blindness; review for Special Monthly Compensation.' },
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
          {value:10, label:'Controlled by medication or brief flare-ups', description:'Symptoms wax and wane with flare-ups bad enough to keep you in bed for at least 1 but less than 2 weeks total per year; or symptoms controlled by continuous medication.'},
          {value:20, label:'Nearly constant, activities reduced by up to 25%', description:'Symptoms nearly constant and restrict routine daily activities by less than 25 percent of the pre-illness level; or flare-ups bad enough to keep you in bed for at least 2 but less than 4 weeks total per year.'},
          {value:40, label:'Nearly constant, activities down to 50-75% of normal', description:'Symptoms nearly constant and restrict routine daily activities to 50 to 75 percent of the pre-illness level; or flare-ups bad enough to keep you in bed for at least 4 but less than 6 weeks total per year.'},
          {value:60, label:'Nearly constant, activities below 50% of normal', description:'Symptoms nearly constant and restrict routine daily activities to less than 50 percent of the pre-illness level; or flare-ups bad enough to keep you in bed for at least 6 weeks total per year.'},
          {value:100, label:'Almost completely restricted', description:'Symptoms nearly constant and so severe that routine daily activities are restricted almost completely, occasionally precluding self-care.'},
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
          {value:40, label:'1 in last 6 months or 2 in last year', description:'At least 1 major seizure in the last 6 months; or 2 in the last year.'},
          {value:60, label:'Averaging 1 every 4 months', description:'Averaging at least 1 major seizure in 4 months over the last year.'},
          {value:80, label:'Averaging 1 every 3 months', description:'Averaging at least 1 major seizure in 3 months over the last year.'},
          {value:100, label:'Averaging 1 per month', description:'Averaging at least 1 major seizure per month over the last year.'},
        ]
      },
      { id: 'minor', label: 'Minor Seizures (Petit Mal / Absence)',
        description: 'Absence seizures (brief staring spells), sudden muscle jerks (myoclonic jerks), or other minor seizure activity',
        levels: [
          {value:0, label:'No minor seizures', description:'No documented minor seizures.'},
          {value:10, label:'Confirmed diagnosis with seizure history', description:'A confirmed diagnosis of epilepsy with a history of seizures (minimum rating; also applies when continuous medication is required for control).'},
          {value:20, label:'2+ minor seizures in last 6 months', description:'At least 2 minor seizures in the last 6 months.'},
          {value:40, label:'5-8 minor seizures per week', description:'Averaging 5 to 8 minor seizures weekly.'},
          {value:60, label:'9-10 minor seizures per week', description:'Averaging 9 to 10 minor seizures weekly.'},
          {value:80, label:'More than 10 minor seizures per week', description:'Averaging more than 10 minor seizures weekly.'},
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
          {value:60, label:'2+ digital ulcers', description:'Two or more digital ulcers and a history of characteristic attacks.'},
          {value:100, label:'2+ digital ulcers plus autoamputation of one or more digits', description:'Two or more digital ulcers with autoamputation of one or more digits and a history of characteristic attacks.'},
        ]
      }
    ]
  }
};
const RAYNAUDS_CONDITION_PROFILE = { 'Raynaud\'s syndrome': 'raynauds', 'Raynaud\'s phenomenon': 'raynauds' };
function getRaynaudsProfile(cond){ return RAYNAUDS_PROFILES[RAYNAUDS_CONDITION_PROFILE[cond] || 'raynauds']; }
function getRaynaudsProfileKey(cond){ return RAYNAUDS_CONDITION_PROFILE[cond] || 'raynauds'; }
function calculateRaynaudsRating(dv){ let m=0; Object.values(dv).forEach(v=>{if(typeof v==='number'&&v>m)m=v;}); return m; }

// 12. GERD (DC 7206 — esophageal stricture criteria since the May 19, 2024
// digestive-system revision; the old DC 7346 symptom criteria no longer apply)
const ESOPHAGEAL_STRICTURE_LEVELS = [
  {value:0, label:'Reflux symptoms without stricture', description:'Heartburn/regurgitation with or without medication, no documented esophageal stricture. Rated 0% under the 2024 criteria, but still establishes service connection.'},
  {value:10, label:'Stricture controlled by daily medication', description:'Documented history of esophageal stricture(s) requiring daily medication to control difficulty swallowing (dysphagia), otherwise asymptomatic.'},
  {value:30, label:'Stricture requiring dilation up to 2 times/year', description:'Documented esophageal stricture(s) causing dysphagia, requiring dilatation no more than 2 times per year.'},
  {value:50, label:'Stricture requiring dilation 3+ times/year', description:'Recurrent or refractory esophageal stricture causing dysphagia and requiring dilatation 3 or more times per year, dilatation with steroid injection, or an esophageal stent.'},
  {value:80, label:'Refractory with aspiration / weight loss, treated with surgery or PEG tube', description:'Recurrent or refractory stricture causing dysphagia and documented by imaging or endoscopy, with at least one of aspiration, undernutrition, or substantial weight loss, AND treated with surgical correction of the stricture(s) or a percutaneous esophago-gastrointestinal (PEG) feeding tube. Dysphagia, a qualifying complication, and the specified treatment are all required.'},
];
const GERD_PROFILES = {
  gerd: {
    label: 'GERD (DC 7206)',
    note: 'Since the VA\'s May 2024 digestive update, GERD is rated under DC 7206 based on esophageal stricture (narrowing) and swallowing difficulty. GERD without a stricture is generally 0% — still worth claiming, since it establishes service connection for future worsening and secondaries.',
    domains: [
      { id: 'severity', label: 'Esophageal Involvement',
        description: 'Documented stricture (narrowing) and swallowing difficulty per DC 7206',
        levels: ESOPHAGEAL_STRICTURE_LEVELS,
      }
    ]
  },
  hiatal: {
    label: 'Hiatal / Paraesophageal Hernia (DC 7346 → DC 7203)',
    note: 'Under the VA\'s May 2024 digestive schedule, hiatal and paraesophageal hernias are evaluated as esophageal stricture under DC 7203. The evaluation is based on documented narrowing, dysphagia, and required treatment.',
    domains: [
      { id: 'severity', label: 'Esophageal Involvement',
        description: 'Documented stricture (narrowing) and swallowing difficulty under DC 7346, evaluated using DC 7203',
        levels: ESOPHAGEAL_STRICTURE_LEVELS,
      }
    ]
  }
};
const GERD_CONDITION_PROFILE = {
  'GERD / acid reflux': 'gerd', 'GERD': 'gerd',
  'Hiatal hernia': 'hiatal', 'Hiatal hernia and paraesophageal hernia': 'hiatal',
};
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
          {value:0, label:'Erectile dysfunction present', description:'Loss of erectile power; rated 0% but eligible for Special Monthly Compensation (SMC-K) for loss of use of a creative organ (~$140/month additional, adjusted annually). Record SMC-K in the Special Claims tab.'},
          {value:20, label:'Penile deformity with loss of erectile power', description:'Deformity of the penis with loss of erectile power.'},
          {value:30, label:'Removal of half or more of penis', description:'Removal of half or more of the penis.'},
        ]
      },
      { id: 'organ', label: 'Loss of Creative Organ',
        description: 'Loss or removal of a creative organ (testicle, ovary)',
        levels: [
          {value:0, label:'No removal (loss of use = SMC-K)', description:'No removal of a creative organ. If you have LOSS OF USE, the schedular rating stays 0% but you qualify for Special Monthly Compensation (SMC-K, ~$140/month, adjusted annually) — record it in the Special Claims tab.'},
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
          {value:10, label:'Symptomatic after removal', description:'Symptomatic residuals following semilunar cartilage removal (DC 5259).'},
          {value:20, label:'Dislocated with locking',  description:'Dislocated semilunar cartilage with frequent episodes of locking, pain, and swelling from fluid in the joint (effusion) (DC 5258).'},
        ]
      }
    ]
  },
  replacement: {
    label: 'Knee Replacement (DC 5055)',
    domains: [
      { id: 'replacement', label: 'Prosthetic Knee Status',
        description: 'Current status after total knee replacement surgery.',
        levels: [
          {value:30,  label:'Intermediate residuals — analogous evaluation 30%', description:'Intermediate weakness, pain, or limitation of motion that produces a 30% analogous evaluation under DC 5256 (ankylosis), DC 5261 (limitation of extension), or DC 5262 (tibia/fibula impairment). This is also the minimum rating following a total knee replacement.'},
          {value:40,  label:'Intermediate residuals — analogous evaluation 40%', description:'Intermediate weakness, pain, or limitation of motion that produces a 40% analogous evaluation under DC 5256, DC 5261, or DC 5262.'},
          {value:50,  label:'Intermediate residuals — analogous evaluation 50%', description:'Intermediate weakness, pain, or limitation of motion that produces a 50% analogous evaluation under DC 5256 or DC 5261.'},
          {value:60,  label:'Chronic severe residuals / analogous evaluation 60%', description:'Chronic residuals consisting of severe painful motion or weakness in the affected extremity, or intermediate residuals producing a 60% analogous evaluation under DC 5256.'},
          {value:100, label:'Within 4 months of surgery', description:'100% rating for 4 months following implantation or resurfacing of the knee joint prosthesis, after the initial convalescence period under 38 CFR 4.30 (criteria revised February 2021).'},
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
  // Limited flexion (DC 5260) and limited extension (DC 5261) are SEPARATE
  // ratable disabilities on the same knee (VAOPGCPREC 9-2004) — combine them
  // per 38 CFR 4.25 rather than taking the higher of the two.
  const flex = typeof domainValues.flexion === 'number' ? domainValues.flexion : 0;
  const ext = typeof domainValues.extension === 'number' ? domainValues.extension : 0;
  if(flex > 0 && ext > 0){
    const hi = Math.max(flex, ext), lo = Math.min(flex, ext);
    return Math.round(hi + (lo/100) * (100 - hi));
  }
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
  // The spine % is the musculoskeletal rating (ROM/pain, DC 5237 etc.). The
  // radiculopathy domain is a SEPARATE peripheral-nerve rating (DC 8520) that
  // affects the legs — it is emitted as its own line item and must NOT inflate
  // the back percentage here (see BP_REGISTRY.back.nerveSplit).
  let maxVal = 0;
  Object.entries(domainValues).forEach(([k,v]) => { if(k!=='radiculopathy' && typeof v==='number' && v>maxVal) maxVal=v; });
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
          {value:10, label:'Mildly limited',           description:'Overhead reach slightly limited but functional above shoulder level.'},
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
          {value:20, label:'Infrequent dislocation or moderate deformity', description:'Recurrent dislocation with infrequent episodes and guarding only at shoulder level; or malunion of humerus with moderate deformity.'},
          {value:30, label:'Frequent dislocation or marked deformity',    description:'Recurrent dislocation with frequent episodes and guarding of all arm movements; or malunion of humerus with marked deformity.'},
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
  // The neck % is the musculoskeletal rating (ROM/pain, DC 5237). Cervical
  // radiculopathy is a SEPARATE peripheral-nerve rating (DC 8510-8513) affecting
  // the arms — emitted as its own line item, not folded into the neck percentage
  // here (see BP_REGISTRY.neck.nerveSplit).
  let maxVal = 0;
  Object.entries(domainValues).forEach(([k,v]) => { if(k!=='radiculopathy' && typeof v==='number' && v>maxVal) maxVal=v; });
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
    note: 'Following prosthetic replacement. Minimum 30% rating following implantation. 100% for 4 months following surgery (criteria revised February 2021).',
    domains: [
      { id:'status', label:'Replacement Status', description:'Current functional status after hip replacement',
        levels:[
          {value:30, label:'Minimum', description:'Prosthetic replacement with no significant residuals.'},
          {value:50, label:'Moderate', description:'Moderately severe residuals of weakness, pain, or limitation of motion.'},
          {value:70, label:'Severe', description:'Markedly severe residual weakness, pain, or limitation of motion.'},
          {value:90, label:'Very Severe', description:'Painful motion or weakness such as to require the use of crutches.'},
          {value:100, label:'4-Month Post-Op', description:'For 4 months following implantation or resurfacing of the hip prosthesis, after the initial convalescence period under 38 CFR 4.30.'},
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
  'hip impingement (fai)':'rom',
  'avascular necrosis (hip)':'rom','avascular necrosis of hip':'rom',
  'hip fracture residuals':'rom','hip fracture':'rom',
  // 'Hip replacement (total)' is the actual picker name — DC 5054 profile
  'hip replacement (total)':'replacement',
  'total hip replacement':'replacement','hip replacement':'replacement',
};

function getHipProfile(name){ return HIP_PROFILES[getHipProfileKey(name)]; }
function getHipProfileKey(name){ return HIP_CONDITION_PROFILE[name.toLowerCase()] || 'rom'; }
// Combine multiple independent disability ratings per 38 CFR 4.25 (each successive
// rating applies to the remaining "efficiency"). Order-independent; returns a
// single rounded value. combine([]) = 0, combine([n]) = n.
function _combine425(values){
  const vals = values.filter(v => typeof v==='number' && v>0).sort((a,b)=>b-a);
  let combined = 0;
  vals.forEach(v => { combined = combined + (v/100)*(100 - combined); });
  return Math.round(combined);
}
function calculateHipRating(domainValues){
  // Limitation of flexion (DC 5252), extension (DC 5251), and abduction/adduction/
  // rotation (DC 5253) of the thigh are SEPARATE ratable disabilities on the same
  // hip — combine them per 38 CFR 4.25 rather than taking only the highest.
  return _combine425(Object.values(domainValues));
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
  // Limitation of flexion (DC 5206), extension (DC 5207), and pronation/supination
  // (DC 5213) of the forearm are SEPARATE ratable disabilities on the same elbow —
  // combine them per 38 CFR 4.25 rather than taking only the highest.
  return _combine425(Object.values(domainValues));
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
          {value:20, label:'Severe (one foot)', description:'Clear evidence of marked deformity, pain when the foot is moved or used, swelling, thick calluses. One foot.'},
          {value:30, label:'Severe (both feet) or Pronounced (one foot)', description:'Severe flatfoot in both feet; OR pronounced flatfoot in one foot — marked inward rolling (pronation), extreme tenderness of the sole, not improved by orthopedic shoes/appliances.'},
          {value:50, label:'Pronounced (both feet)', description:'Pronounced flatfoot in both feet; marked pronation, extreme tenderness of the sole, marked inward displacement and severe spasm of the Achilles tendon, not improved by orthopedic shoes/appliances.'},
        ]},
    ],
  },
  plantar: {
    key: 'plantar', label: 'Plantar Fasciitis (DC 5269)',
    note: 'Plantar fasciitis has its own diagnostic code, DC 5269, since February 2021.',
    domains: [
      { id:'severity', label:'Plantar Fasciitis Severity', description:'Response to treatment per DC 5269',
        levels:[
          {value:0, label:'None', description:'No significant impairment.'},
          {value:10, label:'Improved by treatment', description:'Symptoms relieved or improved by treatment (orthotics, therapy, medication, or surgery).'},
          {value:20, label:'No relief despite treatment (one foot)', description:'Symptoms not relieved by both non-surgical and surgical treatment. One foot.'},
          {value:30, label:'No relief despite treatment (both feet)', description:'Symptoms not relieved by both non-surgical and surgical treatment. Both feet.'},
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
  // 'Flat feet (pes planus)' is the actual picker name — DC 5276 profile
  'flat feet (pes planus)':'flatfoot',
  'flatfoot (pes planus)':'flatfoot','plantar fasciitis':'plantar',
  'achilles tendinitis':'rom','achilles tendinitis / rupture':'rom',
  'heel spurs':'plantar','ankle fracture residuals':'rom','ankle fracture':'rom','ankle arthritis':'rom',
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
          {value:0, label:'No medication needed', description:'No asthma medication required.'},
          {value:10, label:'Intermittent bronchodilator', description:'Intermittent (as-needed) inhalational or oral bronchodilator therapy (e.g., rescue inhaler).'},
          {value:30, label:'Daily bronchodilator or inhaled corticosteroid', description:'Daily inhalational or oral bronchodilator therapy; or inhalational anti-inflammatory medication (inhaled corticosteroid like Flovent, QVAR, Pulmicort).'},
          {value:60, label:'Intermittent oral steroid courses', description:'Intermittent (at least three per year) courses of systemic (oral or injected) corticosteroids (prednisone bursts).'},
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
  // Keys MUST be the lowercased picker names from VA_AREA_CONDITIONS.chest
  'asthma':'asthma',
  'copd / chronic bronchitis':'respiratory',
  'pulmonary embolism':'respiratory',
  'restrictive lung disease':'respiratory',
  'sleep apnea':'apnea',
  'pleural effusion':'respiratory',
  'pneumothorax':'respiratory',
  'chronic cough':'respiratory',
  'costochondritis':'generic',
  // Legacy aliases (older saves / imports)
  'asthma, bronchial':'asthma','chronic obstructive pulmonary disease':'respiratory',
  'bronchitis':'respiratory',
  'sleep apnea syndromes (obstructive, central, mixed)':'apnea',
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
          {value:10, label:'Mild', description:'Daytime voiding interval 2-3 hours, or awakening to void 2 times per night.'},
          {value:20, label:'Moderate', description:'Daytime voiding interval 1-2 hours, or awakening to void 3-4 times per night; or absorbent materials changed less than 2 times per day.'},
          {value:40, label:'Severe', description:'Daytime voiding interval under 1 hour, or awakening to void 5+ times per night; or absorbent materials changed 2-4 times per day.'},
          {value:60, label:'Very Severe', description:'Requiring absorbent materials changed more than 4 times per day, or use of an appliance.'},
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
  // GERD picked through the Abdomen panel must use the same DC 7206 stricture
  // criteria (80% max) as the systemic panel — the generic digestive scale
  // tops out at 100% on symptom criteria that no longer apply to GERD.
  gerd: { key: 'gerd', ...GERD_PROFILES.gerd },
  hiatal: { key: 'hiatal', ...GERD_PROFILES.hiatal },
};

const ABDOMEN_CONDITION_PROFILE = {
  // Keys MUST be the lowercased picker names from VA_AREA_CONDITIONS.abdomen
  'gerd / acid reflux':'gerd',
  'irritable bowel syndrome (ibs)':'digestive',
  'peptic ulcer disease':'digestive',
  'gallbladder disease':'digestive',
  'liver condition':'digestive',
  'bladder condition':'genitourinary',
  'hiatal hernia':'hiatal',
  'crohn\'s disease':'digestive','ulcerative colitis':'digestive',
  'kidney stones':'genitourinary',
  // Legacy aliases (older saves / imports)
  'gerd':'gerd','gastroesophageal reflux disease':'gerd','ibs':'digestive',
  'irritable bowel syndrome':'digestive',
  'bladder dysfunction':'genitourinary','erectile dysfunction':'genitourinary',
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
  // Keys MUST be the lowercased picker names from VA_AREA_CONDITIONS.leg
  'shin splints (mtss)':'muscle',
  'hamstring strain':'muscle','quadriceps strain':'muscle','calf strain / tear':'muscle',
  'muscle atrophy':'muscle','compartment syndrome':'muscle',
  'peripheral neuropathy':'neuropathy',
  'deep vein thrombosis (dvt)':'generic','varicose veins':'generic',
  // Legacy aliases (older saves / imports)
  'muscle strain (thigh)':'muscle','muscle strain (calf)':'muscle',
  'peripheral neuropathy (lower)':'neuropathy',
  'sciatic nerve involvement':'neuropathy','lower extremity numbness / tingling':'neuropathy',
  'deep vein thrombosis':'generic',
};

function getLegProfile(name){ return LEG_PROFILES[getLegProfileKey(name)]; }
function getLegProfileKey(name){ return LEG_CONDITION_PROFILE[name.toLowerCase()] || 'generic'; }
function calculateLegRating(domainValues){
  let maxVal = 0;
  Object.values(domainValues).forEach(v => { if(typeof v==='number' && v>maxVal) maxVal=v; });
  return maxVal;
}
