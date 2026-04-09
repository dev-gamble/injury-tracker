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
