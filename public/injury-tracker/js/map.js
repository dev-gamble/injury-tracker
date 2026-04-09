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

