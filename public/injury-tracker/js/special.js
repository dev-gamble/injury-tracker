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
