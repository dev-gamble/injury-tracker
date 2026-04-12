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
  headConds.forEach((cond) => {
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
  // ── KNEE ──
  // Names must match VA_AREA_CONDITIONS exactly
  ['Knee osteoarthritis', 'Chondromalacia patella', 'Both are cartilage problems in the knee. The VA usually treats these as the same condition and won\'t rate both.'],
  ['Knee osteoarthritis', 'Patellofemoral syndrome', 'Kneecap pain (patellofemoral) and arthritis cause similar symptoms. The VA may consider these the same disability.'],
  ['Chondromalacia patella', 'Patellofemoral syndrome', 'Both describe kneecap cartilage/pain issues. The VA rates them under the same criteria.'],
  ['Knee instability', 'ACL tear / reconstruction', 'ACL damage is a specific cause of knee instability. The VA may rate both under DC 5257 (instability), not separately.'],
  ['Knee instability', 'MCL / LCL sprain', 'Ligament sprains cause instability. The VA may consider these the same disability under DC 5257.'],

  // ── SHOULDER ──
  ['Rotator cuff tear / tendinopathy', 'Shoulder impingement', 'Shoulder impingement is often caused by a rotator cuff problem. The VA may see these as the same issue.'],
  ['Rotator cuff tear / tendinopathy', 'Shoulder arthritis', 'If the rotator cuff tear caused arthritis, the VA may rate only one since both limit the same shoulder motion.'],
  ['Shoulder impingement', 'Frozen shoulder (adhesive capsulitis)', 'Both limit shoulder range of motion. The VA rates shoulder conditions on ROM, so these may overlap.'],
  ['Shoulder instability / dislocation', 'Labral tear (SLAP)', 'A labral tear often causes instability. The VA may consider these the same disability.'],

  // ── BACK (LUMBAR / THORACOLUMBAR) ──
  ['Lumbar strain / sprain', 'Degenerative disc disease (lumbar)', 'Both are rated on thoracolumbar spine range of motion (DC 5237/5242). Only one rating is allowed per spinal segment.'],
  ['Lumbar strain / sprain', 'Lumbar disc herniation', 'Both affect the same spinal segment and use the same ROM rating criteria. Cannot be rated separately.'],
  ['Lumbar disc herniation', 'Intervertebral disc syndrome (IVDS)', 'A herniated disc is a type of IVDS. These are the same condition described two ways.'],
  ['Degenerative disc disease (lumbar)', 'Intervertebral disc syndrome (IVDS)', 'DDD and IVDS often describe the same problem. The VA rates the spine under one formula per segment.'],
  ['Degenerative disc disease (lumbar)', 'Lumbar disc herniation', 'Both are disc problems in the lumbar spine rated under the same criteria.'],
  ['Lumbar strain / sprain', 'Spinal stenosis (lumbar)', 'Both conditions are rated on thoracolumbar ROM. The VA rates one spinal segment under one code.'],
  ['Thoracic strain', 'Lumbar strain / sprain', 'The thoracolumbar spine is rated as ONE segment. You cannot get separate ratings for upper and lower back under the General Rating Formula.'],
  ['Degenerative disc disease (lumbar)', 'Spinal stenosis (lumbar)', 'Both are lumbar spine conditions rated under the same General Rating Formula.'],

  // ── NECK (CERVICAL) ──
  ['Cervical strain / sprain', 'Cervical disc disease (DDD)', 'Both are rated on cervical spine ROM (DC 5237/5242). Only one rating per spinal segment.'],
  ['Cervical strain / sprain', 'Cervical spinal stenosis', 'Both affect the cervical spine and use the same ROM rating formula. Cannot be rated separately.'],
  ['Cervical disc disease (DDD)', 'Cervical spinal stenosis', 'Both are cervical spine conditions rated under the same General Rating Formula for the spine.'],

  // ── HIP ──
  ['Hip osteoarthritis', 'Hip impingement (FAI)', 'Hip impingement often leads to arthritis over time. The VA may treat these as the same disability under DC 5003/5252.'],
  ['Hip osteoarthritis', 'Hip labral tear', 'If both limit the same hip motion, the VA may rate them as one disability.'],

  // ── ANKLE / FOOT ──
  ['Plantar fasciitis', 'Heel spurs', 'Heel spurs and plantar fasciitis usually go together. The VA often considers them the same condition.'],
  ['Flat feet (pes planus)', 'Plantar fasciitis', 'Flat feet and heel/arch pain cause similar foot problems. The VA may rate these together.'],
  ['Ankle instability', 'Ankle sprain (chronic)', 'Chronic ankle sprains and instability are often the same disability described differently.'],

  // ── ELBOW / WRIST ──
  ['Lateral epicondylitis (tennis elbow)', 'Elbow arthritis', 'If both cause the same elbow pain and stiffness, the VA may consider this one disability.'],
  ['Carpal tunnel syndrome', 'De Quervain\'s tenosynovitis', 'Both affect the wrist/hand. If symptoms overlap significantly, the VA may rate them together.'],

  // ── MENTAL HEALTH ──
  // ALL mental health conditions are rated under ONE rating (General Rating Formula for Mental Disorders, 38 CFR 4.130)
  ['Posttraumatic stress disorder', 'Major depressive disorder', 'The VA rates ALL mental health conditions under one combined rating (38 CFR 4.130). You cannot receive separate ratings for PTSD and depression.'],
  ['Posttraumatic stress disorder', 'Generalized anxiety disorder', 'All mental health conditions share one rating. PTSD and anxiety cannot be rated separately.'],
  ['Major depressive disorder', 'Generalized anxiety disorder', 'Depression and anxiety are rated under the same mental health formula. Only one combined MH rating is allowed.'],
  ['Posttraumatic stress disorder', 'Chronic adjustment disorder', 'All mental health conditions are rated together under one formula. Separate ratings are not allowed.'],
  ['Posttraumatic stress disorder', 'Panic disorder and/or agoraphobia', 'PTSD and panic disorder share the same rating criteria. Only one mental health rating is given.'],
  ['Major depressive disorder', 'Persistent depressive disorder (dysthymia)', 'MDD and dysthymia are both depressive disorders rated under the same formula. Cannot be rated separately.'],
  ['Posttraumatic stress disorder', 'Bipolar disorder', 'All mental health conditions share a single combined rating under 38 CFR 4.130. Separate ratings are not allowed.'],
  ['Posttraumatic stress disorder', 'Obsessive compulsive disorder', 'All mental health conditions share a single combined rating. OCD and PTSD cannot be rated separately.'],

  // ── HEAD ──
  ['Migraine headaches', 'Migraine', 'These are the same condition. Only one headache rating is allowed under DC 8100.'],
  ['Residuals of Traumatic Brain Injury (TBI)', 'Cognitive disorder', 'Cognitive problems are usually rated as TBI residuals. The VA won\'t rate them separately if caused by TBI.'],

  // ── RESPIRATORY ──
  ['Asthma', 'COPD / chronic bronchitis', 'The VA generally rates only one respiratory condition based on pulmonary function tests. Both use the same PFT criteria.'],

  // ── GI ──
  ['GERD / acid reflux', 'Hiatal hernia', 'GERD is often caused by a hiatal hernia. The VA rates both under DC 7346 and will not give separate ratings.'],

  // ── IMPORTANT: WHAT IS NOT PYRAMIDING ──
  // Radiculopathy (nerve pain) CAN be rated separately from the spine condition — musculoskeletal vs neurological
  // Knee instability (DC 5257) + knee limited ROM (DC 5260/5261) CAN both be rated on the same knee
  // Tinnitus + hearing loss CAN both be rated — different diagnostic codes
];

function _detectRatingWarnings(){
  const warnings = [];
  // Get all rated conditions from _ratingItems only (already contains all sources)
  const allConds = [];
  _ratingItems.forEach(item => {
    if(item.rating > 0){
      allConds.push({ name: item.name, extremity: item.extremity||'none', source: item.type||'unknown', id: item.id });
    }
  });

  // 1. Duplicate detection — same condition name + same extremity appearing multiple times
  // Skip mental health items (they're already consolidated into one rating by buildRatingItems)
  const seen = {};
  allConds.forEach(c => {
    if(c.source === 'mental') return; // MH already uses single-rating rule
    const key = c.name.toLowerCase() + '|' + c.extremity;
    if(!seen[key]) seen[key] = [];
    seen[key].push(c);
  });
  Object.entries(seen).forEach(([key, items]) => {
    if(items.length > 1){
      // Check these aren't just different IDs for the same condition
      const uniqueIds = new Set(items.map(i => i.id));
      if(uniqueIds.size > 1){
        warnings.push({
          type: 'duplicate',
          title: 'Possible Duplicate',
          condition: items[0].name,
          message: '"' + items[0].name + '" appears to be rated ' + items.length + ' times on the same side. The VA will not rate the same condition twice.',
        });
      }
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
  if(!items.length) return { combined:0, rounded:0, items:[], breakdown:'', bilateral:false, bilateralFactor:0, steps:[], bilateralGroups:[] };

  // ── 38 CFR 4.26 — BILATERAL FACTOR ──
  // Detect which extremity groups qualify for the bilateral factor.
  // The factor applies when BOTH sides of paired extremities have rated conditions.
  const upperLeft  = items.filter(d=>d.extremity==='LU');
  const upperRight = items.filter(d=>d.extremity==='RU');
  const lowerLeft  = items.filter(d=>d.extremity==='LL');
  const lowerRight = items.filter(d=>d.extremity==='RL');

  const hasUpperBil = upperLeft.length > 0 && upperRight.length > 0;
  const hasLowerBil = lowerLeft.length > 0 && lowerRight.length > 0;

  // ── OPTION A: Every condition is its own step. Bilateral bonus added at the end. ──
  // Sort ALL conditions highest to lowest — no grouping, no lumping.
  const allItems = [...items].sort((a,b)=>b.rating-a.rating);

  let log = '';
  log += 'STEP-BY-STEP VA COMBINED RATING\n';
  log += '='.repeat(44) + '\n\n';

  log += 'RATED CONDITIONS:\n';
  log += '-'.repeat(44) + '\n';
  allItems.forEach((d,i)=>{
    const tag = d.extremity!=='none' ? ` [${d.extremity}]` : '';
    const typeTag = d.type==='secondary' ? ' (Secondary)' : d.type==='vocational' ? ' (Vocational)' : '';
    log += `  ${i+1}. ${d.rating}% — ${d.name}${tag}${typeTag}\n`;
  });
  log += '\n';

  // Combine all conditions one by one using VA math (38 CFR 4.25)
  let combined = allItems[0].rating;
  const steps = [{name:allItems[0].name, rating:allItems[0].rating, running:combined, extremity:allItems[0].extremity}];
  log += `Start with highest: ${allItems[0].rating}% (${allItems[0].name})\n`;

  for(let i=1; i<allItems.length; i++){
    const rem = 100 - combined;
    const add = (allItems[i].rating/100) * rem;
    combined += add;
    steps.push({name:allItems[i].name, rating:allItems[i].rating, add:add, running:combined, extremity:allItems[i].extremity});
    log += `  + ${allItems[i].rating}% (${allItems[i].name}) of ${rem.toFixed(2)} remaining = ${add.toFixed(2)}\n`;
    log += `  = ${combined.toFixed(2)}%\n`;
  }

  log += `\nCombined before bilateral: ${combined.toFixed(2)}%\n`;

  // Now calculate and apply bilateral factor bonus
  let bilateralFactorTotal = 0;
  const bilateralGroups = []; // for UI display

  if(hasUpperBil){
    const group = [...upperLeft, ...upperRight];
    const groupRatings = group.map(d=>d.rating);
    const groupCombined = combineVARatings(groupRatings);
    const bf = groupCombined * 0.10;
    bilateralFactorTotal += bf;
    bilateralGroups.push({
      label: 'Upper Extremities (Arms/Shoulders)',
      conditions: group.map(d=>({name:d.name, rating:d.rating, ext:d.extremity})),
      groupCombined: groupCombined,
      bonus: bf,
    });
    log += `\nUPPER BILATERAL (38 CFR 4.26):\n`;
    group.forEach(d=>{ log += `  ${d.rating}% — ${d.name} [${d.extremity}]\n`; });
    log += `  Group combined: ${groupCombined.toFixed(2)}%\n`;
    log += `  10% bonus: ${groupCombined.toFixed(2)} × 0.10 = +${bf.toFixed(2)}%\n`;
  }

  if(hasLowerBil){
    const group = [...lowerLeft, ...lowerRight];
    const groupRatings = group.map(d=>d.rating);
    const groupCombined = combineVARatings(groupRatings);
    const bf = groupCombined * 0.10;
    bilateralFactorTotal += bf;
    bilateralGroups.push({
      label: 'Lower Extremities (Legs/Knees/Ankles)',
      conditions: group.map(d=>({name:d.name, rating:d.rating, ext:d.extremity})),
      groupCombined: groupCombined,
      bonus: bf,
    });
    log += `\nLOWER BILATERAL (38 CFR 4.26):\n`;
    group.forEach(d=>{ log += `  ${d.rating}% — ${d.name} [${d.extremity}]\n`; });
    log += `  Group combined: ${groupCombined.toFixed(2)}%\n`;
    log += `  10% bonus: ${groupCombined.toFixed(2)} × 0.10 = +${bf.toFixed(2)}%\n`;
  }

  // Add bilateral bonus to the combined total
  if(bilateralFactorTotal > 0){
    log += `\nTotal bilateral bonus: +${bilateralFactorTotal.toFixed(2)}%\n`;
    combined += bilateralFactorTotal;
    log += `Combined with bilateral: ${combined.toFixed(2)}%\n`;
    steps.push({name:'Bilateral Factor Bonus (38 CFR 4.26)', rating:null, add:bilateralFactorTotal, running:combined, isBilateralStep:true});
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
    bilateralGroups: bilateralGroups,
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
    html += '<div style="padding:10px 14px;font-size:11px;color:var(--navy);background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;margin-top:8px;line-height:1.6;">' +
      '<strong>What IS allowed separately:</strong> Radiculopathy (nerve pain down arm/leg) CAN be rated separately from the spine condition that caused it — the spine is musculoskeletal, the nerve is neurological. ' +
      'Similarly, instability (DC 5257) and limited ROM (DC 5260/5261) in the same knee CAN both be rated. A VSO can help you maximize your claim without pyramiding.' +
    '</div>';
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
    html += '<div class="rc-section-title" style="margin-top:20px;">Mental Health (VA Single Rating Rule) <span class="tip" data-tip="Under 38 CFR 4.130, the VA rates all mental health diagnoses under one combined General Rating Formula for Mental Disorders. You cannot receive separate ratings for each diagnosis.">?</span></div>';

    // Educational explainer for MH single rating
    const _mhDiagNames = mhConds.map(c=>c.condition);
    const _mstMHNames = _mstMHDisplay.map(c=>c.name);
    const _mhSecNames = _mhSecondaryDisplay.map(c=>c.name);
    const _allMHNames = [..._mhDiagNames, ..._mstMHNames, ..._mhSecNames];
    const _highestMHRating = mhItems.length ? mhItems[0].rating : 0;
    const _highestMHName = mhItems.length ? mhItems[0].name.replace(/^Mental Health \(/,'').replace(/\)$/,'') : '';

    html += '<div style="background:linear-gradient(135deg,#eff6ff 0%,#f5f3ff 100%);border:1px solid #c7d2fe;border-radius:10px;padding:14px 16px;margin-bottom:14px;font-size:12px;line-height:1.7;color:#1e3a5f;">';
    html += '<div style="font-size:13px;font-weight:800;font-family:var(--fh);color:var(--navy);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px;">Why one rating for all mental health?</div>';
    html += '<p style="margin:0 0 8px;">The VA treats <strong>all mental health conditions as one disability</strong> under 38 CFR 4.130. This means even if you have multiple diagnoses — ';
    if(_allMHNames.length > 1){
      html += _allMHNames.slice(0,-1).join(', ') + ' and ' + _allMHNames[_allMHNames.length-1];
    } else if(_allMHNames.length === 1){
      html += _allMHNames[0];
    } else {
      html += 'PTSD, depression, anxiety, etc.';
    }
    html += ' — they all share <strong>one combined rating</strong>, not separate ones.</p>';

    html += '<p style="margin:0 0 8px;"><strong>How it works:</strong> The VA uses the <em>General Rating Formula for Mental Disorders</em> which rates you based on how much your mental health symptoms — from ALL diagnoses combined — affect your social and occupational functioning. The rating reflects your overall level of impairment, not the number of diagnoses.</p>';

    html += '<div style="background:#fff;border:1px solid #ddd6fe;border-radius:8px;padding:10px 12px;margin:8px 0;">';
    html += '<div style="font-size:11px;font-weight:700;color:#7c3aed;font-family:var(--fh);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Your mental health rating</div>';
    if(_allMHNames.length > 1){
      html += '<div style="font-size:11px;margin-bottom:4px;">You have <strong>' + _allMHNames.length + ' mental health diagnoses</strong>. The VA evaluates them together:</div>';
      _allMHNames.forEach(n => {
        const isHighest = n === _highestMHName;
        html += '<div style="padding:2px 0;font-size:11px;">' + (isHighest ? '&#9733; ' : '&bull; ') + '<span' + (isHighest ? ' style="font-weight:700;color:var(--navy);"' : '') + '>' + n + '</span>' + (isHighest ? ' <span style="font-size:10px;color:var(--red);font-weight:700;">&larr; highest evaluated rating</span>' : '') + '</div>';
      });
      html += '<div style="margin-top:6px;font-size:12px;font-weight:700;color:var(--navy);">Combined MH rating: <span style="font-size:16px;">' + _highestMHRating + '%</span></div>';
      html += '<div style="font-size:10px;color:var(--muted);margin-top:2px;">The highest evaluated condition sets the overall mental health rating.</div>';
    } else if(_allMHNames.length === 1){
      html += '<div style="font-size:11px;">Single diagnosis: <strong>' + _allMHNames[0] + '</strong> at <strong>' + _highestMHRating + '%</strong></div>';
    } else {
      html += '<div style="font-size:11px;color:var(--muted);">No mental health conditions evaluated yet.</div>';
    }
    html += '</div>';

    html += '<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:8px 10px;margin-top:8px;font-size:11px;color:#92400e;line-height:1.5;">';
    html += '<strong>Good to know:</strong> Even though the VA only gives one MH rating, <em>list every diagnosis</em> on your claim. Each diagnosis is documented in your record and can support a higher single rating. ';
    html += 'If your PTSD alone rates at 50%, but adding depression and anxiety symptoms shows greater overall impairment, the combined picture could push you to 70%.';
    if(_mstMHNames.length){
      html += '<br><br><strong>MST note:</strong> Your MST-caused mental health condition' + (_mstMHNames.length > 1 ? 's' : '') + ' (' + _mstMHNames.join(', ') + ') ' + (_mstMHNames.length > 1 ? 'are' : 'is') + ' included in this single rating — not rated separately.';
    }
    if(_mhSecNames.length){
      html += '<br><br><strong>Secondaries:</strong> Mental health conditions claimed as secondary to a physical injury (' + _mhSecNames.join(', ') + ') are absorbed into this single MH rating. They won\'t be double-counted in your combined VA math.';
    }
    html += '</div>';
    html += '</div>';
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

  // Step-by-step breakdown (always visible) — show EVERY math operation
  if(result.steps && result.steps.length){
    html += '<div class="rc-steps-wrap">';
    html += '<div class="rc-steps-title">How VA Math Works — Your Calculation <span class="tip" data-tip="The VA doesn\'t simply add percentages together. Instead, each condition is applied to the remaining \'healthy\' portion of your body. This is called the \'whole person theory\' — 38 CFR 4.25.">?</span></div>';

    // Explain the concept first
    html += '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:11px;color:#1e40af;line-height:1.6;">' +
      '<strong>How it works:</strong> The VA starts with you as a "whole person" at 100%. Each condition takes away a percentage of what\'s left — not 100%. ' +
      'That\'s why a 50% + 30% does NOT equal 80%. The 30% is applied to the 50% of you that\'s still "healthy."' +
    '</div>';

    let stepNum = 0;
    result.steps.forEach((step, i) => {
      // Bilateral bonus step
      if(step.isBilateralStep){
        const prevRunning = step.running - step.add;
        stepNum++;
        html += '<div class="rc-step" style="border-left:3px solid #7c3aed;">' +
          '<div class="rc-step-label" style="font-size:10px;color:#7c3aed;text-transform:uppercase;letter-spacing:.5px;font-family:var(--fh);margin-bottom:2px;">Step ' + stepNum + ' — Bilateral Factor Bonus (38 CFR 4.26)</div>' +
          '<div style="font-size:11px;color:#374151;padding:4px 0 0;line-height:1.6;">' +
            'You have conditions on <strong>both sides</strong> of paired extremities, so the VA adds a 10% bonus.<br>' +
            'The bonus is calculated on the combined value of each bilateral group:' +
          '</div>';
        // Show each bilateral group breakdown
        if(result.bilateralGroups){
          result.bilateralGroups.forEach(g => {
            html += '<div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:6px;padding:8px 10px;margin:6px 0;font-size:11px;">' +
              '<div style="font-weight:700;color:#7c3aed;margin-bottom:4px;">' + g.label + '</div>';
            g.conditions.forEach(c => {
              html += '<div style="padding:1px 0;">&bull; ' + escapeHTML(c.name) + ' — ' + c.rating + '% [' + c.ext + ']</div>';
            });
            html += '<div style="margin-top:4px;font-family:var(--fm);background:#ede9fe;padding:2px 6px;border-radius:3px;display:inline-block;">' +
              'Group combined: ' + g.groupCombined.toFixed(2) + '% &times; 10% = <strong>+' + g.bonus.toFixed(2) + '%</strong>' +
            '</div>';
            html += '</div>';
          });
        }
        html += '<div style="font-size:11px;color:#374151;padding:4px 0 0;line-height:1.6;">' +
          '<span style="font-family:var(--fm);background:#f3f4f6;padding:2px 6px;border-radius:3px;display:inline-block;margin:3px 0;">' +
            'Previous ' + prevRunning.toFixed(2) + '% + ' + step.add.toFixed(2) + '% bonus = <strong>' + step.running.toFixed(2) + '%</strong>' +
          '</span>' +
        '</div>' +
        '<div class="rc-step-running">Combined so far: ' + step.running.toFixed(2) + '%</div>' +
        '</div>';
        return;
      }

      stepNum++;
      const extTag = step.extremity && step.extremity !== 'none' ? ' <span style="font-size:9px;font-weight:700;color:#7c3aed;background:#f5f3ff;border:1px solid #ddd6fe;padding:1px 5px;border-radius:3px;">' + step.extremity + '</span>' : '';

      if(i === 0){
        // First condition
        html += '<div class="rc-step">' +
          '<div class="rc-step-label" style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;font-family:var(--fh);margin-bottom:2px;">Step ' + stepNum + ' — Start with your highest-rated condition</div>' +
          '<div class="rc-step-detail">' +
            '<span class="rc-step-name">' + escapeHTML(step.name) + '</span>' + extTag +
            '<span class="rc-step-pct">' + step.rating + '%</span>' +
          '</div>' +
          '<div style="font-size:11px;color:#374151;padding:4px 0 2px;line-height:1.5;">' +
            'You start at <strong>100%</strong> healthy. This condition takes <strong>' + step.rating + '%</strong> away.' +
          '</div>' +
          '<div style="font-size:11px;color:#374151;padding:2px 0;line-height:1.5;">' +
            '100% &minus; ' + step.rating + '% = <strong>' + (100 - step.rating) + '% healthy remaining</strong>' +
          '</div>' +
          '<div class="rc-step-running">Combined so far: ' + step.running.toFixed(2) + '%</div>' +
        '</div>';
      } else {
        const prevRunning = step.running - step.add;
        const remaining = 100 - prevRunning;
        html += '<div class="rc-step">' +
          '<div class="rc-step-label" style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;font-family:var(--fh);margin-bottom:2px;">Step ' + stepNum + ' — Apply next condition</div>' +
          '<div class="rc-step-detail">' +
            '<span class="rc-step-plus">+</span>' +
            '<span class="rc-step-name">' + escapeHTML(step.name) + '</span>' + extTag +
            '<span class="rc-step-pct">' + step.rating + '%</span>' +
          '</div>' +
          '<div style="font-size:11px;color:#374151;padding:4px 0 0;line-height:1.6;">' +
            'After the previous step' + (i > 1 ? 's' : '') + ', you have <strong>' + remaining.toFixed(2) + '%</strong> healthy remaining.<br>' +
            'This condition is rated at <strong>' + step.rating + '%</strong>, but it only applies to the remaining healthy portion:<br>' +
            '<span style="font-family:var(--fm);background:#f3f4f6;padding:2px 6px;border-radius:3px;display:inline-block;margin:3px 0;">' +
              step.rating + '% &times; ' + remaining.toFixed(2) + '% = <strong>' + step.add.toFixed(2) + '%</strong> additional disability' +
            '</span><br>' +
            'Previous ' + prevRunning.toFixed(2) + '% + ' + step.add.toFixed(2) + '% = <strong>' + step.running.toFixed(2) + '%</strong>' +
          '</div>' +
          '<div class="rc-step-running">Combined so far: ' + step.running.toFixed(2) + '%</div>' +
        '</div>';
      }
    });

    // Final rounding explanation
    const whole = Math.round(result.combined);
    html += '<div class="rc-step rc-step-final">' +
      '<div class="rc-step-label" style="font-size:10px;color:var(--navy);text-transform:uppercase;letter-spacing:.5px;font-family:var(--fh);margin-bottom:4px;">Final — VA Rounding</div>' +
      '<div style="font-size:11px;color:#374151;line-height:1.6;margin-bottom:6px;">' +
        'The VA rounds your combined percentage in two steps:' +
      '</div>' +
      '<div style="font-size:12px;line-height:1.8;">' +
        '<div><strong>1.</strong> Exact combined: <span style="font-family:var(--fm);">' + result.combined.toFixed(2) + '%</span></div>' +
        '<div><strong>2.</strong> Round to nearest whole number: <span style="font-family:var(--fm);">' + result.combined.toFixed(2) + '% &rarr; ' + whole + '%</span></div>' +
        '<div><strong>3.</strong> Round to nearest 10%: <span style="font-family:var(--fm);font-weight:800;color:var(--navy);font-size:14px;">' + whole + '% &rarr; ' + result.rounded + '%</span>' +
          (whole % 10 >= 5 ? ' <span style="font-size:10px;color:var(--mild);">(rounded up because ' + (whole % 10) + ' &ge; 5)</span>' :
           whole % 10 > 0 ? ' <span style="font-size:10px;color:var(--moderate);">(rounded down because ' + (whole % 10) + ' &lt; 5)</span>' : '') +
        '</div>' +
      '</div>' +
      '<div style="margin-top:8px;padding:8px 12px;background:linear-gradient(135deg,#0a2357,#1d4ed8);border-radius:8px;text-align:center;">' +
        '<div style="font-size:10px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:1px;font-family:var(--fh);">Your Estimated VA Rating</div>' +
        '<div style="font-size:32px;font-weight:800;color:#fff;font-family:var(--fm);">' + result.rounded + '%</div>' +
      '</div>' +
    '</div>';

    if(result.bilateral){
      html += '<div style="font-size:11px;color:#7c3aed;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:6px;padding:10px 12px;margin-top:8px;line-height:1.6;">' +
        '<strong>Bilateral Factor Applied: +' + result.bilateralFactor.toFixed(2) + '%</strong><br>' +
        '<span style="font-size:10px;color:#6b21a8;">Per 38 CFR 4.26: When you have rated conditions on <strong>both sides</strong> of paired extremities (both arms/shoulders or both legs/knees/ankles), the VA groups ALL conditions on those extremities together, combines them, then adds a 10% bonus. ' +
        'The conditions don\'t have to be the same — a left knee problem and a right ankle problem both count because they\'re both lower extremities. This bonus is applied before your bilateral group enters the final combined calculation.</span>' +
      '</div>';
    }

    // Plain-English summary
    html += '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 12px;margin-top:8px;font-size:11px;color:#166534;line-height:1.6;">' +
      '<strong>In plain English:</strong> You have ' + result.items.length + ' rated condition' + (result.items.length > 1 ? 's' : '') + '. ';
    if(result.items.length === 1){
      html += 'With one condition, your rating is simply ' + result.rounded + '%.';
    } else {
      html += 'The VA combined them using "VA Math" — each condition is applied to the remaining healthy percentage, not simply added together. ';
      const simpleAdd = result.items.reduce((sum,i)=>sum+i.rating,0);
      if(simpleAdd !== result.rounded){
        html += 'If they were just added, it would be ' + simpleAdd + '%. But VA Math gives you <strong>' + result.rounded + '%</strong>.';
      }
    }
    html += '</div>';

    html += '</div>';
  }

  const _scrollY = window.scrollY;
  c.innerHTML = html;
  window.scrollTo(0, _scrollY);
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
