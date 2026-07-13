// ── EXPORT FUNCTIONS ──

// HTML-escape user-entered text before interpolating it into generated
// report markup — otherwise "<brace>"-style text vanishes into the HTML
// parser, and imported CSV text could inject live markup.
function _xh(s){
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── PDF / PRINT SUMMARY ──
function exportSummary(){
  if(typeof _requireAccess === 'function' && !_requireAccess()) return;
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
        <div style="position:absolute;bottom:calc(100% + 2px);left:50%;transform:translateX(-50%);background:#1a2332;color:#fff;font-size:9px;font-weight:600;padding:2px 6px;border-radius:3px;white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis;">#${num} · ${_xh(p.label.slice(0,18))}</div>
      </div>`;
    }).join('');

    return `<div style="margin-bottom:28px;break-inside:avoid;">
      <div style="font-size:12px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-family:monospace;">${body} — ${side} view (${viewPins.length} condition${viewPins.length>1?'s':''})</div>
      <div style="position:relative;display:inline-block;width:220px;">
        <img src="${imgSrc}" style="width:100%;display:block;">
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
      return `<div style="font-size:11px;color:#92400e;padding:2px 0;"><strong>#${num} ${_xh(i.label)}:</strong> Missing — ${g.gaps.join(', ')}</div>`;
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
        <span class="dc-label">${_xh(i.label)}</span>
        <span class="dc-sev" style="background:${sbg};color:${sc};border:1px solid ${sbd};">${stxt}</span>
        <span class="dc-status" style="background:${g.status==='complete'?'#f0fdf4':'#fffbeb'};color:${g.status==='complete'?'#166534':'#92400e'};border:1px solid ${g.status==='complete'?'#bbf7d0':'#fde68a'};">${g.label}</span>
      </div>
      <div class="dc-grid">
        <div class="dc-field"><span class="dc-key">Date</span><span class="dc-val">${_xh(i.date)||'—'}</span></div>
        <div class="dc-field"><span class="dc-key">Body</span><span class="dc-val">${i.pin.body} / ${i.pin.side}</span></div>
        <div class="dc-field"><span class="dc-key">Installation</span><span class="dc-val">${_xh(i.location)||'—'}</span></div>
        <div class="dc-field"><span class="dc-key">Event / Duty</span><span class="dc-val">${_xh(i.event)||'—'}</span></div>
        <div class="dc-field"><span class="dc-key">Medical Care</span><span class="dc-val">${i.medicalCare==='yes'?(_xh(i.clinicName)||'Yes'):'No'}</span></div>
        <div class="dc-field"><span class="dc-key">Witnesses</span><span class="dc-val">${_xh(i.witnesses)||'—'}</span></div>
        <div class="dc-field"><span class="dc-key">Still Being Seen</span><span class="dc-val">${i.stillBeingSeen?'Yes':'No'}</span></div>
      </div>`;

    if(i.description){
      card += `<div class="dc-desc"><span class="dc-key">Description</span><div style="margin-top:2px;font-style:italic;color:#4b5563;">"${_xh(i.description)}"</div></div>`;
    }

    if(i.secondaries?.length){
      card += `<div class="dc-section">
        <span class="dc-section-title" style="color:#3730a3;border-color:#c7d2fe;">Secondary Conditions</span>
        <div class="dc-tags">${i.secondaries.map(s=>`<span class="dc-tag" style="background:#e0e7ff;color:#3730a3;border:1px solid #c7d2fe;">${_xh(s)}</span>`).join('')}</div>
      </div>`;
    }

    if(i.functionalImpacts?.length){
      card += `<div class="dc-section">
        <span class="dc-section-title" style="color:#991b1b;border-color:#fecaca;">Daily Life Impact</span>
        <div class="dc-tags">${i.functionalImpacts.map(fi=>`<span class="dc-tag" style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca;">${_xh(fi)}</span>`).join('')}</div>
      </div>`;
    }

    if(g.gaps.length){
      card += `<div class="dc-section">
        <span class="dc-section-title" style="color:#92400e;border-color:#fde68a;">Missing Evidence</span>
        <div class="dc-tags">${g.gaps.map(m=>`<span class="dc-tag" style="background:#fffbeb;color:#92400e;border:1px solid #fde68a;">${m}</span>`).join('')}</div>
      </div>`;
    }

    if(i.secondaryNotes){
      card += `<div class="dc-desc"><span class="dc-key">Notes</span><div style="margin-top:2px;color:#4b5563;">${_xh(i.secondaryNotes)}</div></div>`;
    }

    card += `</div>`;
    return card;
  }).join('');

  // Quick reference table
  const quickRef = sorted.map((i,idx)=>`<tr>
    <td style="font-weight:800;color:${SC[i.severity]||SC.custom};font-family:monospace;text-align:center;">${idx+1}</td>
    <td>${_xh(i.date)||'—'}</td><td>${_xh(i.label)}</td>
    <td style="color:${SC[i.severity]||SC.custom};font-weight:700;font-size:11px;text-transform:uppercase;">${i.severity==='custom'?'Other':i.severity}</td>
    <td>${_xh(i.location)||'—'}</td>
    <td>${i.medicalCare==='yes'?'Yes':'No'}</td>
    <td>${i.secondaries?.length||0}</td>
    <td style="color:${gapStatus(i).status==='complete'?'#166534':'#92400e'};font-weight:600;font-size:10px;">${gapStatus(i).status==='complete'?'Complete':'Incomplete'}</td>
  </tr>`).join('');

  const w=window.open('','_blank');
  if(!w){alert('Your browser blocked the report window. Please allow pop-ups for this page and try again.');return;}
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ENDEX — Service Impact Index</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Rajdhani:wght@600&family=Oswald:wght@600;700&display=swap" rel="stylesheet">
<style>
body{font-family:Arial,sans-serif;margin:40px;font-size:13px;color:#111;}
.sub{color:#888;font-size:10px;margin-bottom:18px;font-family:monospace;}

/* Brand header */
.report-header{border-bottom:3px solid #0a2357;padding-bottom:18px;margin-bottom:22px;}
.brand-lockup{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.brand-word{font-family:'Teko','Arial Narrow',sans-serif;font-size:44px;font-weight:700;letter-spacing:6px;line-height:1;color:#0a2357;}
.brand-x{color:#c8102e;}
.brand-sub{font-family:'Rajdhani','Arial Narrow',sans-serif;font-size:11px;font-weight:600;color:#6b7280;letter-spacing:2.5px;text-transform:uppercase;margin-top:3px;}
.report-title{font-family:'Oswald','Arial Narrow',sans-serif;font-size:16px;font-weight:600;color:#0a2357;letter-spacing:2px;text-transform:uppercase;margin:2px 0 4px;}
.prepared-for{font-size:13px;font-weight:700;color:#1a2332;margin:6px 0 2px;font-family:monospace;}
.report-meta{color:#6b7280;font-size:10px;font-family:monospace;}

.disc{background:#fffbeb;border-left:4px solid #fbbf24;padding:10px 14px;border-radius:4px;margin-bottom:18px;font-size:11px;color:#92400e;}
.stats{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;}
.stat{background:#f5f7fc;border:1px solid #c7d2fe;border-radius:7px;padding:9px 16px;}
.sn{font-size:22px;font-weight:700;color:#0a2357;}.sl{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;font-family:monospace;}
.section-title{font-size:14px;font-weight:700;color:#1a2332;border-bottom:2px solid #0a2357;padding-bottom:6px;margin:24px 0 16px;text-transform:uppercase;letter-spacing:1px;font-family:monospace;}
.diagrams{display:flex;gap:32px;flex-wrap:wrap;margin-bottom:28px;}
table{width:100%;border-collapse:collapse;}
th{background:#0a2357;color:#fff;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;font-family:monospace;letter-spacing:.5px;}
td{padding:8px 10px;border-bottom:1px solid #e0e7ff;vertical-align:top;}
tr:nth-child(even) td{background:#f8faff;}
.footer{margin-top:20px;font-size:10px;color:#aaa;font-family:monospace;border-top:1px solid #eee;padding-top:10px;display:flex;justify-content:space-between;}
@media print{button{display:none;} .detail-card{break-inside:avoid;} .report-header{break-after:avoid;}}

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
<div class="report-header">
  <div class="brand-lockup">
    <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="4" fill="#0a2357"/>
      <circle cx="18" cy="18" r="11" fill="rgba(255,255,255,0.12)" stroke="#fff" stroke-width="2"/>
      <path d="M9 9L27 27M27 9L9 27" stroke="#c8102e" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
    <div>
      <div class="brand-word">ENDE<span class="brand-x">X</span></div>
      <div class="brand-sub">Disability Claim Index</div>
    </div>
  </div>
  <div class="report-title">Service Impact Report</div>
  ${window._userId ? '<div class="prepared-for">Prepared for: ' + window._userId.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>' : ''}
  <div class="report-meta">Generated ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div>
</div>
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
    h += '<div style="font-weight:700;font-size:13px;color:#0a2357;">'+_xh(c.condition)+(isH?' <span style="color:#c8102e;font-size:10px;">(ACTIVE RATING)</span>':'')+'</div>';
    h += '<div style="font-size:11px;color:#6b7280;margin-top:2px;">'+_xh(c.date||'No date')+(c.location?' &middot; '+_xh(c.location):'')+(c.event?' &middot; '+_xh(c.event):'')+'</div>';
    if(c.description) h += '<div style="font-size:11px;color:#4b5563;font-style:italic;margin-top:2px;">&ldquo;'+_xh(c.description)+'&rdquo;</div>';
    if(c.medicalCare==='yes') h += '<div style="font-size:11px;color:#166534;margin-top:2px;">&#10003; Medical care'+(c.clinicName?' &mdash; '+_xh(c.clinicName):'')+'</div>';
    if(c.witnesses) h += '<div style="font-size:11px;color:#6b7280;margin-top:1px;">Witnesses: '+_xh(c.witnesses)+'</div>';
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
    h += '<div style="font-weight:700;font-size:13px;color:#0a2357;">'+_xh(c.condition)+' <span style="font-size:10px;color:#6b7280;font-weight:400;">'+profileLabel+'</span></div>';
    h += '<div style="font-size:11px;color:#6b7280;margin-top:2px;">'+_xh(c.date||'No date')+(c.location?' &middot; '+_xh(c.location):'')+(c.event?' &middot; '+_xh(c.event):'')+'</div>';
    if(c.description) h += '<div style="font-size:11px;color:#4b5563;font-style:italic;margin-top:2px;">&ldquo;'+_xh(c.description)+'&rdquo;</div>';
    if(c.medicalCare==='yes') h += '<div style="font-size:11px;color:#166534;margin-top:2px;">&#10003; Medical care'+(c.clinicName?' &mdash; '+_xh(c.clinicName):'')+'</div>';
    if(c.witnesses) h += '<div style="font-size:11px;color:#6b7280;margin-top:1px;">Witnesses: '+_xh(c.witnesses)+'</div>';
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
        if(cfg.nerveSplit && d.id === cfg.nerveSplit.domainId) return null; // shown as its own line below
        const v = c.domains[d.id];
        if(!v) return null;
        return d.label.split(':').pop().trim() + ': ' + v + '%';
      }).filter(Boolean).join(', ') || 'Not evaluated';
      const extLabel = c.extremity && c.extremity !== 'none' ? ' [' + c.extremity + ']' : '';
      h += '<div style="border:1px solid #d1d5db;border-radius:6px;padding:12px 16px;margin-bottom:8px;border-left:3px solid #047857;">';
      h += '<div style="font-weight:700;font-size:13px;color:#0a2357;">' + _xh(c.condition) + extLabel + ' <span style="font-size:10px;color:#6b7280;font-weight:400;">' + profileLabel + '</span></div>';
      h += '<div style="font-size:11px;color:#6b7280;margin-top:2px;">' + _xh(c.date||'No date') + (c.location?' &middot; '+_xh(c.location):'') + (c.event?' &middot; '+_xh(c.event):'') + '</div>';
      if(c.description) h += '<div style="font-size:11px;color:#4b5563;font-style:italic;margin-top:2px;">&ldquo;'+_xh(c.description)+'&rdquo;</div>';
      if(c.medicalCare==='yes') h += '<div style="font-size:11px;color:#166534;margin-top:2px;">&#10003; Medical care'+(c.clinicName?' &mdash; '+_xh(c.clinicName):'')+'</div>';
      if(c.witnesses) h += '<div style="font-size:11px;color:#6b7280;margin-top:1px;">Witnesses: '+_xh(c.witnesses)+'</div>';
      h += '<div style="font-size:11px;color:#6b7280;margin-top:4px;">' + domains + '</div>';
      h += '<div style="font-size:14px;font-weight:800;color:#0a2357;font-family:monospace;margin-top:4px;">' + c.effectiveRating + '%' + (c.manualOverride !== null ? ' (manual override)' : '') + '</div>';
      // Separate peripheral-nerve (radiculopathy) rating line(s), rated apart from the joint %
      (typeof bpNerveItems === 'function' ? bpNerveItems(cfg, c) : []).forEach(ni => {
        const nExt = ni.extremity && ni.extremity !== 'none' ? ' [' + ni.extremity + ']' : '';
        h += '<div style="margin-top:6px;padding-top:6px;border-top:1px dashed #cbd5e1;font-size:12px;color:#0a2357;">' +
          '<span style="font-weight:700;">&#9889; ' + _xh(ni.name) + nExt + '</span> ' +
          '<span style="font-size:10px;color:#6b7280;">' + _xh(ni.dc) + ' &middot; rated separately</span> ' +
          '<span style="font-weight:800;font-family:monospace;">' + ni.rating + '%</span>' +
        '</div>';
      });
      h += '</div>';
    });
  });
  return h;
})()}

${window._personalStatement?'<div class="section-title">Personal Statement</div><div style="border:1px solid #d1d5db;border-radius:8px;padding:16px 20px;font-size:13px;line-height:1.7;color:#111;page-break-inside:avoid;">'+window._personalStatement+'</div>':''}

${(window._vocSecondaries||[]).length?`
<div class="section-title">Vocational Conditions</div>
<ul style="font-size:12px;line-height:1.8;">${window._vocSecondaries.map(s=>'<li>'+_xh(s)+'</li>').join('')}</ul>
${window._vocNotes?'<div style="margin-top:8px;padding:8px 12px;background:#f8f9fa;border-left:3px solid #0a2357;border-radius:4px;font-size:12px;"><strong>Notes:</strong> '+_xh(window._vocNotes)+'</div>':''}`:''}

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
  const pdfWarnings = typeof _detectRatingWarnings === 'function' ? _detectRatingWarnings() : [];
  h+='<div style="margin-top:16px;background:'+(pdfWarnings.length?'#fef3c7;border:1px solid #f59e0b;border-left:4px solid #f59e0b':'#f0fdf4;border:1px solid #86efac;border-left:4px solid #22c55e')+';border-radius:6px;padding:14px;page-break-inside:avoid;">';
  h+='<div style="font-weight:700;font-size:13px;color:'+(pdfWarnings.length?'#78350f':'#166534')+';margin-bottom:8px;">Pyramiding / Duplicate Review (38 CFR 4.14)</div>';
  if(pdfWarnings.length){
    h+='<div style="font-size:11px;color:#92400e;margin-bottom:10px;">The following conditions were flagged for possible overlap. This does not mean it IS pyramiding — discuss with your VSO or attorney.</div>';
    pdfWarnings.forEach(function(w){
      h+='<div style="padding:6px 0;border-top:1px solid #fde68a;font-size:11px;color:#78350f;">';
      h+='<strong>'+(w.type==='duplicate'?'Duplicate':'Possible Pyramiding')+':</strong> '+w.condition.replace(/&/g,'&amp;').replace(/</g,'&lt;');
      h+='<div style="color:#92400e;margin-top:2px;">'+w.message.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</div>';
      h+='</div>';
    });
  } else {
    h+='<div style="font-size:11px;color:#166534;">No pyramiding or duplicate conditions detected. All claimed conditions appear to use separate diagnostic codes and do not overlap.</div>';
  }
  h+='</div>';
  return h;
})()}

<div class="footer">
  <span>Print (Ctrl+P / Cmd+P) to save as PDF</span>
  <span>&copy; 2026 CG Web Lab, LLC. All rights reserved.</span>
</div>
</body></html>`);
  w.document.close();
}

// ── CSV EXPORT ──
function exportCSV(){
  if(typeof _requireAccess === 'function' && !_requireAccess()) return;
  const _pk2 = _getPanelKeys();
  const filteredInj2 = injuries.filter(i => !_pk2.has(i.key));
  const hasBPExport2 = typeof BP_REGISTRY!=='undefined' && Object.values(BP_REGISTRY).some(cfg=>(window[cfg.stateKey]||[]).length>0);
  if(!filteredInj2.length && !(window._mentalHealthConditions||[]).length && !(window._headConditions||[]).length && !hasBPExport2){alert('No injuries to export.');return;}
  const sorted=[...filteredInj2].sort((a,b)=>new Date(a.date)-new Date(b.date));

  const esc = v => {
    const s = String(v||'').replace(/"/g,'""');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? '"'+s+'"' : s;
  };

  const ratingResult = getRatingBreakdown();
  const headers = ['#','Date','Body Area','Severity','Assigned Rating %','Body','Side','Installation','Event','Description','Medical Care','Clinic','Witnesses','Secondary Conditions','Daily Life Impact','Evidence Status','Missing Evidence','Still Being Seen','Notes'];
  const csvRows = [];
  if(window._userId) csvRows.push('Prepared for:,' + esc(window._userId));
  // esc() the date — the long en-US format contains a comma that would split the cell
  csvRows.push('Generated:,' + esc(new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})));
  csvRows.push('');
  csvRows.push(headers.join(','));

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
          if(cfg.nerveSplit && d.id === cfg.nerveSplit.domainId) return null; // separate nerve row below
          const v = c.domains[d.id];
          const lv = d.levels ? d.levels.find(l => l.value === v) : null;
          return d.label.split(':').pop().trim() + '=' + (lv ? lv.label : v + '%');
        }).filter(Boolean).join('; ');
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
        // Separate peripheral-nerve (radiculopathy) rating — its own row/DC/extremity
        (typeof bpNerveItems === 'function' ? bpNerveItems(cfg, c) : []).forEach(ni => {
          csvRows.push([
            ni.name + ' (from ' + c.condition + ')',
            c.date||'', c.location||'', c.event||'', c.description||'',
            '', '', '',
            ni.dc + ' (rated separately)',
            ni.extremity,
            cfg.nerveSplit.domainId + '=' + ni.rating + '%',
            ni.rating + '%',
            ni.rating + '%',
            'No'
          ].map(esc).join(','));
        });
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

  // Vocational conditions
  const vocCSV = window._vocSecondaries || [];
  if(vocCSV.length){
    csvRows.push('');
    csvRows.push(esc('VOCATIONAL / EMPLOYMENT CONDITIONS'));
    csvRows.push(['Condition','Notes'].join(','));
    vocCSV.forEach(s => { csvRows.push([esc(s), ''].join(',')); });
    if(window._vocNotes) csvRows.push([esc('Notes'), esc(window._vocNotes)].join(','));
  }

  // Pyramiding / duplicate review (always included)
  const csvWarnings = typeof _detectRatingWarnings === 'function' ? _detectRatingWarnings() : [];
  csvRows.push('');
  csvRows.push(esc('PYRAMIDING / DUPLICATE REVIEW (38 CFR 4.14)'));
  if(csvWarnings.length){
    csvRows.push(esc('The following conditions were flagged for possible overlap. This does not mean it IS pyramiding. Discuss with your VSO or attorney.'));
    csvRows.push(['Type','Conditions','Explanation'].join(','));
    csvWarnings.forEach(w => {
      csvRows.push([esc(w.type === 'duplicate' ? 'Duplicate' : 'Possible Pyramiding'), esc(w.condition), esc(w.message)].join(','));
    });
  } else {
    csvRows.push(esc('No pyramiding or duplicate conditions detected. All claimed conditions appear to use separate diagnostic codes and do not overlap.'));
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
  if(typeof _requireAccess === 'function' && !_requireAccess()) return;
  const _pk3 = _getPanelKeys();
  const filteredInj3 = injuries.filter(i => !_pk3.has(i.key));
  const hasBPExport3 = typeof BP_REGISTRY!=='undefined' && Object.values(BP_REGISTRY).some(cfg=>(window[cfg.stateKey]||[]).length>0);
  if(!filteredInj3.length && !(window._mentalHealthConditions||[]).length && !(window._headConditions||[]).length && !hasBPExport3){alert('No injuries to export.');return;}
  const sorted=[...filteredInj3].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const line = '='.repeat(60);
  const dash = '-'.repeat(40);
  let txt = '';

  txt += line + '\n';
  txt += '  ENDEX — SERVICE IMPACT REPORT\n';
  if(window._userId) txt += '  Prepared for: ' + window._userId + '\n';
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
          if(cfg.nerveSplit && d.id === cfg.nerveSplit.domainId) return; // separate nerve line below
          const v = c.domains[d.id];
          if(v > 0){
            const lv = d.levels ? d.levels.find(l => l.value === v) : null;
            txt += '    ' + d.label + ': ' + (lv ? lv.label : v + '%') + '\n';
          }
        });
        txt += '    Rating: ' + c.effectiveRating + '%' + (c.manualOverride !== null ? ' (manual override)' : '') + '\n\n';
        // Separate peripheral-nerve (radiculopathy) rating line(s)
        (typeof bpNerveItems === 'function' ? bpNerveItems(cfg, c) : []).forEach(ni => {
          const nExt = ni.extremity && ni.extremity !== 'none' ? ' [' + ni.extremity + ']' : '';
          txt += '  ' + ni.name + nExt + ' [' + ni.dc + ' — rated separately]\n';
          txt += '    Rating: ' + ni.rating + '%\n\n';
        });
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

  // Pyramiding / duplicate review (always included)
  const txtWarnings = typeof _detectRatingWarnings === 'function' ? _detectRatingWarnings() : [];
  txt += 'PYRAMIDING / DUPLICATE REVIEW (38 CFR 4.14)\n' + line + '\n';
  if(txtWarnings.length){
    txt += 'The following conditions were flagged for possible overlap.\n';
    txt += 'This does NOT mean it IS pyramiding. Discuss with your VSO or attorney.\n\n';
    txtWarnings.forEach(function(w){
      txt += '  ' + (w.type === 'duplicate' ? '[DUPLICATE]' : '[POSSIBLE PYRAMIDING]') + '\n';
      txt += '  Conditions: ' + w.condition + '\n';
      txt += '  ' + w.message + '\n\n';
    });
  } else {
    txt += 'No pyramiding or duplicate conditions detected.\n';
    txt += 'All claimed conditions appear to use separate diagnostic codes\n';
    txt += 'and do not overlap.\n\n';
  }

  txt += line + '\n';
  txt += '(c) 2026 CG Web Lab, LLC. All rights reserved.\n';

  const blob = new Blob([txt], {type:'text/plain;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'injury-report-'+new Date().toISOString().slice(0,10)+'.txt';
  a.click();
  URL.revokeObjectURL(url);
}
