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
