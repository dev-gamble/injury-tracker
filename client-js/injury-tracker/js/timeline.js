// ── TIMELINE TAB ──

function deleteEvalFromTimeline(type, id){
  if(type === 'mental'){
    const c = (window._mentalHealthConditions||[]).find(c=>c.id===id);
    if(!confirm('Delete "' + (c?c.condition:'this condition') + '"?')) return;
    if(typeof _removeCondPinIfExists==='function') _removeCondPinIfExists(id);
    window._mentalHealthConditions = (window._mentalHealthConditions||[]).filter(c=>c.id!==id);
  } else if(type === 'head'){
    const c = (window._headConditions||[]).find(c=>c.id===id);
    if(!confirm('Delete "' + (c?c.condition:'this condition') + '"?')) return;
    if(typeof _removeCondPinIfExists==='function') _removeCondPinIfExists(id);
    window._headConditions = (window._headConditions||[]).filter(c=>c.id!==id);
  } else if(typeof BP_REGISTRY !== 'undefined'){
    for(const [regionId, cfg] of Object.entries(BP_REGISTRY)){
      if(type === cfg.id || type === regionId){
        const arr = window[cfg.stateKey] || [];
        const found = arr.find(c=>c.id===id);
        if(found){
          if(!confirm('Delete "' + found.condition + '"?')) return;
          if(typeof _removeCondPinIfExists==='function') _removeCondPinIfExists(id);
          window[cfg.stateKey] = arr.filter(c=>c.id!==id);
        }
        break;
      }
    }
  }
  if(typeof updateBadges === 'function') updateBadges();
  if(typeof updateCount === 'function') updateCount();
  if(typeof renderRating === 'function') renderRating();
  if(typeof renderSecondary === 'function') renderSecondary();
  renderTimeline();
}

function gatherTimelineEntries(){
  const entries = [];

  // Physical injuries (skip panel-managed keys — those have their own entries below)
  _nonPanelInjuries(injuries).forEach(i => {
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
  // Every user-typed field (and anything restored from a save file) must be
  // escaped before landing in innerHTML — a shared project file is untrusted
  const _esc = typeof escapeHTML === 'function' ? escapeHTML : (s => s);

  const _hasSpecials = typeof SPECIAL_CLAIM_TYPES !== 'undefined' && window._specialClaims && SPECIAL_CLAIM_TYPES.some(item => window._specialClaims[item.id]);
  // Presumptive claims (Agent Orange, Gulf War, Burn Pit, POW…) live in
  // window._presumptiveData — gather them the same way the Rating tab does
  const _activePresumptives = (typeof PRESUMPTIVE_CLAIMS !== 'undefined' && window._presumptiveData) ?
    PRESUMPTIVE_CLAIMS.filter(cl => window._presumptiveData[cl.id] && window._presumptiveData[cl.id].selected) : [];
  if(!entries.length && !_hasSpecials && !_activePresumptives.length){
    c.innerHTML='<div class="empty">No injuries or conditions logged yet.<br>Click the body map or use Quick Select to begin.<br><span style="font-size:11px;color:var(--muted);">Items require a date to appear on the timeline.</span></div>';
    return;
  }

  const years=[...new Set(entries.map(e=>e.date?.slice(0,4)).filter(Boolean))];
  c.innerHTML=years.map(yr=>`
    <div class="yr-lbl">${_esc(yr)}</div>
    ${entries.filter(e=>e.date?.startsWith(yr)).map(e=>{
      const isPhysical = e.type==='injury';
      const bpCfg = typeof BP_REGISTRY!=='undefined' ? BP_REGISTRY[e.type] : null;
      const num = isPhysical ? injuryNumber(e.ref.id) : (e.type==='mental' ? 'MH' : e.type==='head' ? 'HD' : (bpCfg ? bpCfg.id.slice(0,2).toUpperCase() : 'BP'));
      const severity = Object.prototype.hasOwnProperty.call(SC, e.severity) ? e.severity : 'custom';
      const refId = Number(e.ref && e.ref.id);
      // Body-part conditions intentionally use Date.now() + Math.random() so
      // two bilateral records created in the same millisecond remain unique.
      // A finite number is safe to interpolate as a JS numeric literal; do not
      // narrow legitimate fractional ids to integers and turn actions into 0.
      const safeId = Number.isFinite(refId) && refId > 0 ? refId : 0;
      const sc=SC[severity];
      const sbg=SBG[severity];
      const sbd=SBD[severity];
      const stxt=severity==='custom'?'Other':severity;
      const typeTag = e.type==='mental' ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:#7c3aed;background:#f5f3ff;border:1px solid #ddd6fe;padding:1px 5px;border-radius:3px;">Mental Health</span>' :
                      e.type==='head' ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:var(--navy);background:#eff3ff;border:1px solid #bfdbfe;padding:1px 5px;border-radius:3px;">Head & Face</span>' :
                      bpCfg ? '<span style="font-size:9px;font-weight:700;font-family:var(--fh);color:#047857;background:#ecfdf5;border:1px solid #a7f3d0;padding:1px 5px;border-radius:3px;">'+bpCfg.title+'</span>' : '';
      const editBtn = isPhysical ? `<button class="edit-btn" onclick="editInjury(${safeId})" title="Edit">&#9998;</button>` : '';
      const delBtn = isPhysical
        ? `<button class="del" onclick="deleteInjury(${safeId})">×</button>`
        : `<button class="del" onclick="deleteEvalFromTimeline('${e.type}',${safeId})">×</button>`;
      const pinInfo = e.pin ? `<span style="font-size:10px;color:var(--muted);font-family:var(--fm);">${_esc(e.pin.body||'')} · ${_esc(e.pin.side||'')}</span>` : '';

      return`<div class="ic ${severity}">
        <div style="flex:1">
          <div class="ic-title">
            <span style="display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:50%;background:${sc};color:#fff;font-size:${isPhysical?'11':'8'}px;font-weight:800;font-family:var(--fm);flex-shrink:0;padding:0 4px;">${num}</span>
            ${_esc(e.label)}
            <span class="stag" style="background:${sbg};color:${sc};border:1px solid ${sbd};">${stxt}</span>
            ${typeTag}
            ${pinInfo}
          </div>
          <div class="ic-meta">${_esc(e.date)}${e.location?' · '+_esc(e.location):''}${e.event?' · '+_esc(e.event):''}</div>
          ${e.description?`<div class="ic-desc">"${_esc(e.description)}"</div>`:''}
          ${e.medicalCare==='yes'?`<div class="ic-med">&#10003; Medical care${e.clinicName?' — '+_esc(e.clinicName):' received'}</div>`:''}
          ${e.witnesses?`<div style="color:var(--muted);font-size:11px;margin-top:3px;">Witnesses: ${_esc(e.witnesses)}</div>`:''}
          ${e.functionalImpacts?.length?`<div style="margin-top:6px;padding:6px 8px;background:rgba(200,16,46,.06);border-radius:6px;border:1px solid rgba(200,16,46,.15);">
            <div style="font-size:10px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Daily Life Impact</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;">${e.functionalImpacts.map(fi=>'<span style="background:rgba(200,16,46,.1);color:var(--red2);font-size:10px;font-weight:600;padding:2px 7px;border-radius:3px;font-family:var(--fm);">'+_esc(fi)+'</span>').join('')}</div>
          </div>`:''}
          ${e.secondaries?.length?`<div style="margin-top:6px;padding:6px 8px;background:#e0e7ff;border-radius:6px;border:1px solid #c7d2fe;">
            <div style="font-size:10px;font-weight:700;color:#3730a3;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Secondary Conditions</div>
            ${e.secondaries.map(s=>'<div style="font-size:11px;color:#3730a3;padding:1px 0;">• '+_esc(s)+'</div>').join('')}
          </div>`:''}
          ${isPhysical ? renderGapBar(e.ref) : ''}
        </div>
        ${delBtn}
        ${editBtn}
      </div>`;
    }).join('')}
  `).join('');

  // Special claims & notification banners
  {
    const NOTIF_IDS = new Set(['combat','pow','agent_orange','gulf_war','burn_pit']);
    const activeSpecials = (typeof SPECIAL_CLAIM_TYPES !== 'undefined' && window._specialClaims) ?
      SPECIAL_CLAIM_TYPES.filter(item => window._specialClaims[item.id]) : [];
    if(activeSpecials.length || _activePresumptives.length){
      let spHtml = '<div style="margin-top:20px;">';
      spHtml += '<div class="yr-lbl" style="color:#b45309;">Special Claims & Entitlements</div>';
      // Presumptive claims — amber "applies to this claim" banners
      _activePresumptives.forEach(cl => {
        const d = window._presumptiveData[cl.id] || {};
        const details = (cl.fields||[]).map(f => d[f.id] ? f.label + ' ' + d[f.id] : null).filter(Boolean).join(' · ');
        spHtml += '<div style="background:#fffbeb;border:1px solid #fde68a;border-left:4px solid #b45309;border-radius:0 6px 6px 0;padding:10px 14px;font-size:12px;color:#92400e;line-height:1.5;margin-bottom:8px;">' +
          '<strong>' + cl.label + '</strong> — presumptive service connection applies to this claim.' +
          (details ? '<br><span style="font-size:11px;">' + _esc(details) + '</span>' : '') +
        '</div>';
      });
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
