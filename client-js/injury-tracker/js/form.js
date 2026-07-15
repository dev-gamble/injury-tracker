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
    document.getElementById('f-custom-label').value='';
    return;
  }

  // Panel redirects apply ONLY outside an active form session. When the
  // custom-pin form is open (pendingPin set) or an injury is being edited
  // (editingId set), redirecting would close the modal and silently discard
  // the placed pin and everything the user typed.
  const _formInUse = editingId !== null || (typeof pendingPin !== 'undefined' && pendingPin);
  if(!_formInUse){
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
  }

  // Populate condition dropdown from VA_AREA_CONDITIONS (mental/head use their
  // dedicated lists so the in-form flow still works for those areas)
  const conditions = area === 'mental' ? (typeof VA_MENTAL !== 'undefined' ? VA_MENTAL : []) :
                     area === 'head' ? (typeof VA_HEAD !== 'undefined' ? VA_HEAD : []) :
                     (typeof VA_AREA_CONDITIONS!=='undefined' && VA_AREA_CONDITIONS[area]) || [];
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
    // Clear the hidden field too — getResolvedLabel gives it top priority, so a
    // stale value here would silently override the newly selected condition
    document.getElementById('f-custom-label').value='';
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
    if(newArea && newArea!==origGroup){
      inj.key = newArea;
      // Every selectable area is panel-managed — without this flag the record
      // would vanish from timeline/rating/exports the moment its key changes
      inj.customPin = true;
    }
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
  // Check the origin flag, not just the key — onBodyAreaChange already
  // replaced 'custom' with the selected area by the time we get here
  const isCustom = pendingPin.key==='custom' || !!pendingPin.customPin;

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
    // Custom-pin records share panel-managed keys (every area in the dropdown
    // is one) but are ordinary injuries — this flag keeps _nonPanelInjuries
    // from hiding them in the timeline, rating, exports, and statement.
    customPin:isCustom,
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
    secondaries:[],
    secondaryRatings:{},
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
      // Match if the pin key belongs to this body part's side keys, or is the
      // region id itself (custom pins store the area/region id, not a side key)
      if(cfg.sideKeys[pendingPin.key] || cfg.id === pendingPin.key){
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
  if(typeof _showNextStepToast === 'function') _showNextStepToast();
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
  // Index-based removal + escaped label: quotes or angle brackets in user text
  // must not break the chip markup or its remove button
  const _e = typeof escapeHTML === 'function' ? escapeHTML : (s=>s);
  c.innerHTML = _pendingImpacts.map((fi,idx)=>
    `<span class="sc-chip" style="background:rgba(200,16,46,.1);color:var(--red2);border:1px solid rgba(200,16,46,.2);">
      <span>${_e(fi)}</span>
      <span class="sc-rm" style="color:var(--red);" onclick="removeImpact(${idx})">×</span>
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

function removeImpact(idx){
  _pendingImpacts.splice(idx, 1);
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
