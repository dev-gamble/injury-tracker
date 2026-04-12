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
  if(!_bilateralPromptCb) return; // guard against double-click
  const cb = _bilateralPromptCb;
  _bilateralPromptCb = null;
  const el = document.getElementById('bilateral-prompt');
  if(el) el.remove();
  cb(both);
}

// Side selection popup — Left / Right / Both
let _sideSelectCb = null;
function _showSideSelectionPopup(regionId, condName, leftKey, rightKey, onAnswer){
  const bodyName = _getBilateralBodyName(regionId);
  _sideSelectCb = onAnswer;
  let el = document.getElementById('side-select-prompt');
  if(el) el.remove();
  el = document.createElement('div');
  el.id = 'side-select-prompt';
  el.className = 'bilateral-overlay';
  el.innerHTML =
    '<div class="bilateral-dialog">' +
      '<div class="bilateral-dialog-icon">&#9878;</div>' +
      '<div class="bilateral-dialog-title">Which side is affected?</div>' +
      '<div class="bilateral-dialog-cond">' + condName + '</div>' +
      '<div class="bilateral-dialog-desc">' +
        'Select which ' + bodyName + ' this condition affects. ' +
        'Choosing "Both" applies the bilateral factor (10% bonus) to your combined VA rating.' +
      '</div>' +
      '<div class="bilateral-dialog-btns" style="flex-direction:column;gap:8px;">' +
        '<button class="bilateral-btn bilateral-btn-no" style="flex:1;" onclick="_onSideSelect(\''+leftKey+'\',false)">Left</button>' +
        '<button class="bilateral-btn bilateral-btn-no" style="flex:1;" onclick="_onSideSelect(\''+rightKey+'\',false)">Right</button>' +
        '<button class="bilateral-btn bilateral-btn-yes" style="flex:1;" onclick="_onSideSelect(\'both\',true)">Both (Bilateral)</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(el);
}

function _onSideSelect(key, isBoth){
  if(!_sideSelectCb) return; // guard against double-click
  const cb = _sideSelectCb;
  _sideSelectCb = null;
  const el = document.getElementById('side-select-prompt');
  if(el) el.remove();
  cb(key, isBoth);
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
  // Mark all existing conditions as committed (from previous sessions)
  // so they are hidden from the fresh condition list
  (window[cfg.stateKey]||[]).forEach(c => { c._committed = true; });
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
  // Only block exact duplicate if there's already an uncommitted one (current session)
  if(conds.find(c=>c.condition===name && c.extremity===ext && !c._committed)) return;
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
  // Remove individual condition pin
  if(typeof _removeCondPinIfExists === 'function') _removeCondPinIfExists(id);
  window[cfg.stateKey] = window[cfg.stateKey].filter(c=>c.id!==id);
  renderBPPanel(regionId);
  if(typeof renderRating==='function') renderRating();
}

function toggleBPCondition(regionId, name){
  const cfg = BP_REGISTRY[regionId];
  const conds = window[cfg.stateKey];
  // Single-select: only one non-committed condition at a time
  // Remove any current non-committed condition before adding new one
  const uncommitted = conds.filter(c => !c._committed);
  const alreadySelected = uncommitted.find(c => c.condition === name);

  if(alreadySelected){
    // Deselect
    window[cfg.stateKey] = window[cfg.stateKey].filter(c => c.id !== alreadySelected.id);
    renderBPPanel(regionId);
    if(typeof renderRating==='function') renderRating();
    return;
  }

  // Remove previous uncommitted selection
  uncommitted.forEach(c => { window[cfg.stateKey] = window[cfg.stateKey].filter(x => x.id !== c.id); });

  // For bilateral panels, always ask Left / Right / Both via popup
  if(_hasBilateralSides(regionId)){
    const sides = Object.entries(cfg.sideKeys);
    const leftKey = sides.find(([k])=>k.toLowerCase().startsWith('left'));
    const rightKey = sides.find(([k])=>k.toLowerCase().startsWith('right'));
    if(leftKey && rightKey){
      _showSideSelectionPopup(regionId, name, leftKey[0], rightKey[0], function(chosenKey, isBoth){
        if(isBoth){
          _addBPCondSide(regionId, name, leftKey[0]);
          _addBPCondSide(regionId, name, rightKey[0]);
          const updatedConds = window[cfg.stateKey];
          const ext1 = cfg.extremityMap[leftKey[0]] || 'none';
          const ext2 = cfg.extremityMap[rightKey[0]] || 'none';
          const c1 = updatedConds.find(c=>c.condition===name && c.extremity===ext1 && !c._committed);
          const c2 = updatedConds.find(c=>c.condition===name && c.extremity===ext2 && !c._committed);
          if(c1 && c2){
            c1.bilateralPairId = c2.id; c2.bilateralPairId = c1.id;
            c1.bilateralLinked = true; c2.bilateralLinked = true;
            c1.bilateralSource = true; c2.bilateralSource = false;
          }
        } else {
          _bpPinKey = chosenKey;
          _addBPCondSide(regionId, name, chosenKey);
        }
        renderBPPanel(regionId);
      });
      return;
    }
  }
  addBPCondition(regionId, name);
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
  let needsFullRender = false;
  if(cond.bilateralLinked && cond.bilateralPairId){
    const pair = conds.find(c=>c.id===cond.bilateralPairId);
    if(pair && pair.bilateralLinked){
      if(cond.bilateralSource){
        pair.domains[domainId] = parseInt(value);
        pair.calculatedRating = cfg.calcRating(pair.domains);
        if(pair.manualOverride===null) pair.effectiveRating = pair.calculatedRating;
        needsFullRender = true; // need to update paired card
      } else {
        cond.bilateralLinked = false; cond.bilateralPairId = null; cond.bilateralSource = false;
        pair.bilateralLinked = false; pair.bilateralPairId = null; pair.bilateralSource = false;
        needsFullRender = true; // unlink changes UI
      }
    }
  }

  if(needsFullRender){
    renderBPPanel(regionId);
  } else {
    _patchDomainButtons('bp-eval-'+condId, domainId, parseInt(value));
    _patchRating(condId, cond.effectiveRating, cond.calculatedRating);
  }
  if(typeof renderRating==='function') renderRating();
}

// Targeted DOM updates — no re-render, no scroll jump
function _patchDomainButtons(evalBodyId, domainId, newValue){
  const body = document.getElementById(evalBodyId);
  if(!body) return;
  // Find all domain sections; match by the onclick handler containing the domainId
  body.querySelectorAll('.hd-level-btn').forEach(btn => {
    const onclick = btn.getAttribute('onclick') || '';
    if(onclick.indexOf("'"+domainId+"'") === -1) return;
    // Extract value from onclick: last numeric arg
    const match = onclick.match(/,\s*(\d+)\s*\)/);
    if(!match) return;
    const btnVal = parseInt(match[1]);
    if(btnVal === newValue){
      btn.classList.add('hd-active');
    } else {
      btn.classList.remove('hd-active');
    }
  });
}

function _patchRating(condId, effectiveRating){
  const evalBody = document.getElementById('bp-eval-'+condId);
  if(!evalBody) return;
  const card = evalBody.closest('.mh-eval-card');
  if(!card) return;
  const badge = card.querySelector('.mh-eval-rating');
  if(badge){
    badge.textContent = effectiveRating + '%';
    badge.className = 'mh-eval-rating mh-rate-' + effectiveRating;
  }
  const calcVal = evalBody.querySelector('.bp-calc-val');
  if(calcVal) calcVal.textContent = effectiveRating + '%';
  // Update the Place Pin button text with current rating
  const doneBtn = document.querySelector('.mh-done-btn');
  if(doneBtn){
    const cond = evalBody.closest('.mh-eval-card');
    const nameEl = cond ? cond.querySelector('.mh-eval-name') : null;
    const condName = nameEl ? nameEl.textContent : '';
    if(condName){
      doneBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z"/></svg>' +
        ' Place Pin for <strong>' + condName + ' — ' + effectiveRating + '%</strong>';
    }
  }
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

function _buildBPCondListHTML(regionId){
  const cfg = BP_REGISTRY[regionId];
  if(!cfg) return '';
  const conditions = VA_AREA_CONDITIONS[cfg.conditions] || [];
  const conds = window[cfg.stateKey];
  const currentCond = conds.find(c => !c._committed);
  const selected = new Set();
  if(currentCond) selected.add(currentCond.condition);

  const filtered = conditions.filter(name => {
    if(!_bpSearch) return true;
    const examples = (typeof PHYS_EXAMPLES !== 'undefined' && PHYS_EXAMPLES[name]) || '';
    return name.toLowerCase().includes(_bpSearch) || examples.toLowerCase().includes(_bpSearch);
  });
  if(!filtered.length) return '<div style="padding:14px;color:var(--muted);font-size:12px;text-align:center;">No conditions match your search.</div>';
  return filtered.map(name => {
    const checked = selected.has(name);
    const examples = (typeof PHYS_EXAMPLES !== 'undefined' && PHYS_EXAMPLES[name]) || '';
    const exHtml = examples ? '<span class="mh-cond-examples">e.g. '+examples+'</span>' : '';
    const escaped = name.replace(/'/g,"\\'");
    const badge = checked && currentCond ? '<span class="mh-cond-badge mh-rate-'+currentCond.effectiveRating+'">'+currentCond.effectiveRating+'%</span>' : '';
    return '<div class="mh-cond-item'+(checked?' selected':'')+'" onclick="toggleBPCondition(\''+regionId+'\',\''+escaped+'\')">' +
      '<input type="radio" name="bp-cond-'+regionId+'" '+(checked?'checked':'')+' onclick="event.stopPropagation();toggleBPCondition(\''+regionId+'\',\''+escaped+'\')">' +
      '<span class="mh-cond-label">'+name+exHtml+'</span>' +
      badge +
    '</div>';
  }).join('');
}

function renderBPCondList(regionId){
  const list = document.getElementById('bp-cond-list-'+regionId);
  if(!list) return;
  list.innerHTML = _buildBPCondListHTML(regionId);
  if(typeof _initCondListScroll === 'function') _initCondListScroll(list);
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

  // Non-bilateral multi-option panels (e.g. back: Upper/Mid/Lower, abdomen: Abdomen/Pelvis) show tabs
  const _sideEntries = Object.entries(cfg.sideKeys);
  const _hasLeft = _sideEntries.some(([k])=>k.toLowerCase().startsWith('left'));
  const _hasRight = _sideEntries.some(([k])=>k.toLowerCase().startsWith('right'));
  const _isBilateralPanel = _sideEntries.length > 1 && Object.keys(cfg.extremityMap).length > 0 && _hasLeft && _hasRight;
  if(!_isBilateralPanel && _sideEntries.length > 1){
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
  h += '<div class="mh-cond-list" id="bp-cond-list-'+regionId+'">'+_buildBPCondListHTML(regionId)+'</div>';

  // Evaluations — only show current session (non-committed) conditions
  const _visibleConds = conds.filter(c => !c._committed);
  if(_visibleConds.length){
    h += '<div class="mh-section-title">Evaluations ('+_visibleConds.length+' condition'+(_visibleConds.length>1?'s':'')+')</div>';

    _visibleConds.forEach(cond => {
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
            ' onclick="updateBPDomain(\''+regionId+'\','+cond.id+',\''+domain.id+'\','+lv.value+')">' +
            '<span class="hd-level-val">'+lv.value+'%</span>' +
            '<span class="hd-level-body">' +
              '<span class="hd-level-label">'+lv.label+'</span>' +
              (lv.description ? '<div class="hd-level-desc">'+lv.description+'</div>' : '') +
            '</span>' +
          '</button>';
        });
        h += '</div>';

        h += '</div>';
      });

      // Calculated rating
      h += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(10,35,87,.04);border-radius:6px;">' +
        '<div>' +
          '<div style="font-size:11px;font-weight:700;color:var(--navy);font-family:var(--fh);text-transform:uppercase;letter-spacing:.5px;">Calculated Rating <span class="tip" data-tip="This is the app\'s estimate based on your answers. The actual VA rating may differ — a VA examiner will review your medical evidence and may rate higher or lower. Use this as a guide, not a guarantee.">?</span></div>' +
          '<div class="bp-calc-val" style="font-size:24px;font-weight:800;font-family:var(--fm);color:var(--navy);">'+cond.calculatedRating+'%</div>' +
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

  } else {
    h += '<div class="mh-empty">' +
      '<div style="font-size:28px;margin-bottom:8px;">&#128161;</div>' +
      '<strong>Select a condition above to begin evaluation</strong><br>' +
      'Choose a condition, then rate it using VA diagnostic criteria.' +
    '</div>';
  }

  // Place Pin / Done
  h += '<div class="mh-done-wrap">';
  if(_visibleConds.length){
    const _pinCond = _visibleConds[0];
    const _hasRating = _pinCond.effectiveRating > 0;
    const _pinLabel = _hasRating
      ? _pinCond.condition + ' — ' + _pinCond.effectiveRating + '%'
      : _pinCond.condition + ' <span style="font-size:10px;opacity:.7;">(select a rating above)</span>';
    h += '<button class="mh-done-btn" onclick="placeBPPin(\''+regionId+'\')">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z"/></svg>' +
      ' Place Pin for <strong>' + _pinLabel + '</strong>' +
    '</button>' +
    '<div style="font-size:11px;color:var(--muted);text-align:center;margin-top:6px;">Click to return to the map and place a pin for this condition.</div>';
  }
  h += '<button class="mh-back-btn" onclick="closeBPPanel(\''+regionId+'\')" style="margin-top:8px;">Back to Map (no pin)</button>';
  h += '</div>';

  h += '</div>'; // mh-body
  const _scrollTop = panel.scrollTop;
  panel.innerHTML = h;
  panel.scrollTop = _scrollTop;
}
