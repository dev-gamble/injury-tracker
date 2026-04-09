// ── EVIDENCE GAP FLAGS ──

const GAP_FIELDS = [
  { key:'description', label:'Description / Notes' },
  { key:'event',       label:'Service Event' },
  { key:'medicalCare', label:'Medical Evidence', check: v => v==='yes' },
  { key:'location',    label:'Installation / Location' },
  { key:'clinicName',  label:'Clinic Name', condition: i => i.medicalCare==='yes' },
];

function getGaps(inj){
  const missing=[];
  GAP_FIELDS.forEach(f=>{
    // Skip conditional fields when condition isn't met
    if(f.condition && !f.condition(inj)) return;
    const val = inj[f.key];
    const present = f.check ? f.check(val) : (val && val.trim && val.trim()!=='');
    if(!present) missing.push(f.label);
  });
  return missing;
}

function gapStatus(inj){
  const gaps = getGaps(inj);
  if(gaps.length===0) return { status:'complete', color:'var(--mild)', bg:'#f0fdf4', border:'#bbf7d0', label:'Complete', gaps };
  return { status:'incomplete', color:'var(--moderate)', bg:'#fffbeb', border:'#fde68a', label:'Needs Evidence ('+gaps.length+')', gaps };
}

function renderGapBar(inj){
  const g = gapStatus(inj);
  let html = `<div class="gap-bar" style="background:${g.bg};border:1px solid ${g.border};border-radius:5px;padding:5px 9px;margin-top:6px;font-size:11px;">
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:${g.gaps.length?'4':'0'}px;">
      <span style="width:8px;height:8px;border-radius:50%;background:${g.color};flex-shrink:0;"></span>
      <span style="font-weight:700;color:${g.color};font-family:var(--fh);text-transform:uppercase;letter-spacing:.5px;font-size:10px;">${g.label}</span>
    </div>`;
  if(g.gaps.length){
    html += `<div style="display:flex;flex-wrap:wrap;gap:4px;">`;
    g.gaps.forEach(m=>{
      html += `<span style="background:rgba(217,119,6,.12);color:#92400e;font-size:10px;font-weight:600;padding:1px 7px;border-radius:3px;font-family:var(--fm);">${m}</span>`;
    });
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}
