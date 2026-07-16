// ── CSV IMPORT ──

// Build a label→pinKey lookup from FRONT_PINS and BACK_PINS
// Maps lowercase label to {key, x, y, side, body}
const _LABEL_TO_PIN = {};
function _buildLabelMap(){
  // Front pins (default to male front)
  Object.entries(FRONT_PINS).forEach(([key,info])=>{
    _LABEL_TO_PIN[info.label.toLowerCase()] = {key, x:info.x, y:info.y, side:'front', body:'male'};
  });
  // Back-only pins (upperBack, spine, lowerBack, glutes, hamstrings, calves)
  Object.entries(BACK_PINS).forEach(([key,info])=>{
    const lbl = info.label.toLowerCase();
    if(!_LABEL_TO_PIN[lbl]){
      _LABEL_TO_PIN[lbl] = {key, x:info.x, y:info.y, side:'back', body:'male'};
    }
  });
  // Add common aliases
  const aliases = {
    'head':'head', 'tmj':'jaw', 'jaw':'jaw',
    'left ear':'leftEar', 'right ear':'rightEar',
    'left eye':'leftEye', 'right eye':'rightEye',
    'neck':'neck', 'cervical':'neck',
    'left shoulder':'leftShoulder', 'right shoulder':'rightShoulder',
    'chest':'chest', 'left lung':'leftLung', 'right lung':'rightLung',
    'abdomen':'abdomen', 'stomach':'abdomen',
    'pelvis':'pelvis', 'groin':'pelvis', 'pelvis / groin':'pelvis',
    'left elbow':'leftElbow', 'right elbow':'rightElbow',
    'left forearm':'leftForearm', 'right forearm':'rightForearm',
    'left wrist':'leftWrist', 'right wrist':'rightWrist',
    'left hand':'leftHand', 'right hand':'rightHand',
    'left hip':'leftHip', 'right hip':'rightHip',
    'left thigh':'leftThigh', 'right thigh':'rightThigh',
    'left knee':'leftKnee', 'right knee':'rightKnee',
    'left shin':'leftShin', 'right shin':'rightShin',
    'left ankle':'leftAnkle', 'right ankle':'rightAnkle',
    'left foot':'leftFoot', 'right foot':'rightFoot',
    'upper back':'upperBack', 'spine':'spine',
    'lower back':'lowerBack', 'lumbar':'lowerBack',
    'glutes':'glutes', 'buttocks':'glutes',
    'left hamstring':'leftHamstring', 'right hamstring':'rightHamstring',
    'left calf':'leftCalf', 'right calf':'rightCalf',
    // Group-level aliases
    'back':'lowerBack', 'shoulder':'leftShoulder', 'knee':'leftKnee',
    'ankle':'leftAnkle', 'foot':'leftFoot', 'elbow':'leftElbow',
    'wrist':'leftWrist', 'hand':'leftHand', 'hip':'leftHip',
    'shin':'leftShin', 'thigh':'leftThigh', 'lung':'leftLung',
    'ear':'leftEar', 'eye':'leftEye',
  };
  Object.entries(aliases).forEach(([alias, key])=>{
    if(_LABEL_TO_PIN[alias]) return; // don't overwrite exact matches
    const pin = FRONT_PINS[key] || BACK_PINS[key];
    if(!pin) return;
    const side = BACK_PINS[key] && !FRONT_PINS[key] ? 'back' : 'front';
    _LABEL_TO_PIN[alias] = {key, x:pin.x, y:pin.y, side, body:'male'};
  });
}
_buildLabelMap();

function resolvePin(label, body, side){
  // Try exact label match first
  const lbl = (label||'').toLowerCase().trim();
  const match = _LABEL_TO_PIN[lbl];
  if(match){
    return {
      key: match.key,
      x: match.x,
      y: match.y,
      side: side || match.side,
      body: body || match.body,
      label: label
    };
  }
  // Fallback: center of body
  return {
    key: 'custom',
    x: 52, y: 45,
    side: side || 'front',
    body: body || 'male',
    label: label
  };
}

// ── CSV PARSER ──
function parseCSV(text){
  const rows = [];
  let current = '';
  let inQuotes = false;
  const lines = text.split('\n');

  for(let line of lines){
    if(inQuotes){
      current += '\n' + line;
    } else {
      current = line;
    }
    // Count unescaped quotes
    const quoteCount = (current.match(/"/g)||[]).length;
    inQuotes = quoteCount % 2 !== 0;
    if(!inQuotes){
      rows.push(parseCSVRow(current));
      current = '';
    }
  }
  return rows;
}

function parseCSVRow(line){
  const cells = [];
  let current = '';
  let inQuotes = false;
  for(let i=0; i<line.length; i++){
    const ch = line[i];
    if(inQuotes){
      if(ch==='"' && line[i+1]==='"'){ current+='"'; i++; }
      else if(ch==='"'){ inQuotes=false; }
      else { current+=ch; }
    } else {
      if(ch==='"'){ inQuotes=true; }
      else if(ch===','){ cells.push(current.trim()); current=''; }
      else { current+=ch; }
    }
  }
  cells.push(current.trim().replace(/\r$/,''));
  return cells;
}

// ── IMPORT LOGIC ──
function openImportModal(){
  document.getElementById('import-modal').classList.remove('hidden');
  document.body.style.overflow='hidden';
  document.getElementById('import-file').value='';
  document.getElementById('import-preview').innerHTML='';
  document.getElementById('import-status').textContent='';
  document.getElementById('import-confirm-btn').classList.add('hidden');
}

function closeImportModal(){
  document.getElementById('import-modal').classList.add('hidden');
  document.body.style.overflow='';
}

let _importData = null;

function handleImportFile(input){
  const file = input.files[0];
  if(!file) return;
  const status = document.getElementById('import-status');
  const preview = document.getElementById('import-preview');

  if(!file.name.toLowerCase().endsWith('.csv')){
    status.textContent = 'Please select a .csv file.';
    status.style.color = 'var(--red)';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e){
    const rows = parseCSV(e.target.result);
    if(rows.length < 2){
      status.textContent = 'File is empty or has no data rows.';
      status.style.color = 'var(--red)';
      return;
    }

    // Locate the header row instead of assuming rows[0] — the app's own CSV
    // export writes "Prepared for:"/"Generated:" preamble rows above it
    let headerIdx = rows.findIndex(r => {
      const h = r.map(c=>c.toLowerCase().trim());
      return findCol(h, ['body area','label','injury','area','name']) >= 0 &&
             findCol(h, ['date','date of injury','incident date']) >= 0;
    });
    if(headerIdx === -1) headerIdx = 0;

    const headers = rows[headerIdx].map(h=>h.toLowerCase().trim());
    // Stop at the first section divider (the export appends MENTAL HEALTH /
    // RATING / PYRAMIDING sections after the injury rows — those aren't injuries).
    //
    // The structural signal is "blank row, then a row with only its first cell
    // filled": the export writes a blank row before every section header, and
    // injury rows are contiguous. Recognizing headers by their ALL-CAPS text
    // instead was both too eager — a hand-written "BROKEN ANKLE" row with no
    // other cells filled silently truncated the import from there on — and too
    // weak, since headers carrying digits or colons ("PYRAMIDING / DUPLICATE
    // REVIEW (38 CFR 4.14)") failed the character test and imported as injuries.
    let bodyRows = rows.slice(headerIdx+1);
    const _isBlankRow = r => !r.some(c => c.trim());
    const _isLabelOnlyRow = r => (r[0]||'').trim() && !r.slice(1).some(c => c.trim());
    const sectionIdx = bodyRows.findIndex((r, i) => i > 0 && _isBlankRow(bodyRows[i-1]) && _isLabelOnlyRow(r));
    if(sectionIdx > -1) bodyRows = bodyRows.slice(0, sectionIdx);
    const dataRows = bodyRows.filter(r=>r.some(c=>c.trim()));

    // Map columns
    const colMap = {
      label:    findCol(headers, ['body area','label','injury','area','name']),
      date:     findCol(headers, ['date','date of injury','incident date']),
      severity: findCol(headers, ['severity','sev']),
      location: findCol(headers, ['installation','location','base','post']),
      event:    findCol(headers, ['event','training event','duty','incident']),
      desc:     findCol(headers, ['description','notes','desc','details']),
      medical:  findCol(headers, ['medical','medical care','medical care received']),
      clinic:   findCol(headers, ['clinic','hospital','clinic / hospital']),
      witnesses:findCol(headers, ['witnesses','witness']),
      body:     findCol(headers, ['body','body type']),
      side:     findCol(headers, ['side','view']),
      secondary:findCol(headers, ['secondary','secondary conditions']),
      impacts:  findCol(headers, ['impact','daily impact','daily life impact','functional impact']),
    };

    if(colMap.label===-1 && colMap.date===-1){
      status.textContent = 'Could not find "Body Area" or "Date" columns. Please use the template.';
      status.style.color = 'var(--red)';
      return;
    }

    // Build preview
    const mapped = dataRows.map(r=>({
      label:     r[colMap.label]||'Unknown',
      date:      normDate(r[colMap.date]),
      severity:  normSeverity(r[colMap.severity]),
      location:  r[colMap.location]||'',
      event:     r[colMap.event]||'',
      desc:      r[colMap.desc]||'',
      medical:   normMedical(r[colMap.medical]),
      clinic:    r[colMap.clinic]||'',
      witnesses: r[colMap.witnesses]||'',
      body:      normBody(r[colMap.body]),
      side:      normSide(r[colMap.side]),
      secondary: (r[colMap.secondary]||'').split(';').map(s=>s.trim()).filter(Boolean),
      impacts:   (r[colMap.impacts]||'').split(';').map(s=>s.trim()).filter(Boolean),
    }));

    _importData = mapped;

    // Show preview
    const found = [];
    if(colMap.label>=0) found.push('Body Area');
    if(colMap.date>=0) found.push('Date');
    if(colMap.severity>=0) found.push('Severity');
    if(colMap.location>=0) found.push('Installation');
    if(colMap.event>=0) found.push('Event');
    if(colMap.desc>=0) found.push('Description');
    if(colMap.medical>=0) found.push('Medical');
    if(colMap.clinic>=0) found.push('Clinic');
    if(colMap.witnesses>=0) found.push('Witnesses');
    if(colMap.secondary>=0) found.push('Secondary');
    if(colMap.impacts>=0) found.push('Impacts');

    status.textContent = `Found ${mapped.length} injuries. Matched columns: ${found.join(', ')}`;
    status.style.color = 'var(--mild)';

    let ph = `<table style="width:100%;border-collapse:collapse;font-size:11px;margin-top:8px;">
      <thead><tr style="background:var(--navy);color:#fff;">
        <th style="padding:6px 8px;text-align:left;font-family:var(--fh);font-size:10px;text-transform:uppercase;letter-spacing:.5px;">#</th>
        <th style="padding:6px 8px;text-align:left;font-family:var(--fh);font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Body Area</th>
        <th style="padding:6px 8px;text-align:left;font-family:var(--fh);font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Date</th>
        <th style="padding:6px 8px;text-align:left;font-family:var(--fh);font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Severity</th>
        <th style="padding:6px 8px;text-align:left;font-family:var(--fh);font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Pin</th>
      </tr></thead><tbody>`;
    mapped.forEach((m,idx)=>{
      const pin = resolvePin(m.label, m.body, m.side);
      const pinOk = pin.key!=='custom';
      ph += `<tr style="border-bottom:1px solid var(--border);${idx%2?'background:var(--surface2)':''}">
        <td style="padding:5px 8px;font-family:var(--fm);font-weight:700;">${idx+1}</td>
        <td style="padding:5px 8px;">${typeof escapeHTML==='function'?escapeHTML(m.label):m.label}</td>
        <td style="padding:5px 8px;font-family:var(--fm);">${typeof escapeHTML==='function'?escapeHTML(m.date)||'—':(m.date||'—')}</td>
        <td style="padding:5px 8px;text-transform:capitalize;">${m.severity}</td>
        <td style="padding:5px 8px;color:${pinOk?'var(--mild)':'var(--moderate)'};">${pinOk?'Matched':'Manual'}</td>
      </tr>`;
    });
    ph += '</tbody></table>';
    preview.innerHTML = ph;
    document.getElementById('import-confirm-btn').classList.remove('hidden');
  };
  reader.readAsText(file);
}

function confirmImport(){
  if(!_importData||!_importData.length) return;

  let imported = 0;
  _importData.forEach(m=>{
    const pin = resolvePin(m.label, m.body, m.side);
    const inj = {
      id: Date.now() + imported,
      key: pin.key,
      // Matched pin keys (leftKnee, neck, ...) are panel-managed; imported rows
      // are ordinary injuries, so reuse the custom-pin visibility flag to keep
      // _nonPanelInjuries from hiding them everywhere.
      customPin: true,
      label: m.label,
      date: m.date,
      severity: m.severity,
      location: m.location,
      event: m.event,
      description: m.desc,
      medicalCare: m.medical,
      clinicName: m.clinic,
      witnesses: m.witnesses,
      stillBeingSeen: false,
      functionalImpacts: m.impacts,
      secondaries: m.secondary,
      pin: {x:pin.x, y:pin.y, side:pin.side, body:pin.body, label:m.label},
    };
    injuries.push(inj);
    dropPin(inj);
    imported++;
  });

  updateBadges(); updateCount(); refreshPinNumbers();
  _importData = null;
  closeImportModal();
  alert(`Imported ${imported} injuries successfully.`);
}

// ── TEMPLATE DOWNLOAD ──
function downloadTemplate(){
  const headers = ['Body Area','Date','Severity','Installation','Event','Description','Medical Care','Clinic','Witnesses','Body','Side','Secondary Conditions','Daily Life Impact'];
  const example = ['Right Knee','2020-03-15','severe','Fort Hood','Ruck march','Twisted knee during 12-mile ruck','Yes','Battalion Aid Station','SSG Smith','male','front','Limited ROM - knee; Degenerative joint disease','Cannot stand for long periods; Difficulty with stairs'];
  const csv = headers.join(',') + '\r\n' + example.map(v=>v.includes(',')?'"'+v+'"':v).join(',') + '\r\n';

  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'injury-import-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── HELPERS ──
function findCol(headers, names){
  for(const name of names){
    const idx = headers.indexOf(name.toLowerCase());
    if(idx>=0) return idx;
  }
  return -1;
}

function normSeverity(val){
  if(!val) return 'moderate';
  const v = val.toLowerCase().trim();
  if(v==='mild') return 'mild';
  if(v==='severe') return 'severe';
  if(v==='moderate') return 'moderate';
  if(v==='other'||v==='custom'||v==='unknown') return 'custom';
  return 'moderate';
}

function normMedical(val){
  if(!val) return '';
  const v = val.toLowerCase().trim();
  if(v==='yes'||v==='y'||v==='true'||v==='1') return 'yes';
  if(v==='no'||v==='n'||v==='false'||v==='0') return 'no';
  return '';
}

function normBody(val){
  if(!val) return 'male';
  const v = val.toLowerCase().trim();
  return v==='female'||v==='f' ? 'female' : 'male';
}

// Normalize imported dates to ISO YYYY-MM-DD — the timeline's year grouping and
// the edit form's <input type=date> both require it. Accepts YYYY-MM-DD,
// M/D/YYYY, M-D-YYYY, and "Month D, YYYY". Unparseable values pass through.
function normDate(val){
  const v = String(val||'').trim();
  if(!v) return '';
  let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(m) return m[1] + '-' + m[2].padStart(2,'0') + '-' + m[3].padStart(2,'0');
  m = v.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/); // M/D/YYYY (US)
  if(m) return m[3] + '-' + m[1].padStart(2,'0') + '-' + m[2].padStart(2,'0');
  m = v.match(/^([A-Za-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})$/); // July 7, 2026
  if(m){
    const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const mi = months.indexOf(m[1].slice(0,3).toLowerCase());
    if(mi >= 0) return m[3] + '-' + String(mi+1).padStart(2,'0') + '-' + m[2].padStart(2,'0');
  }
  return v; // unknown format — keep as-is rather than destroy data
}

function normSide(val){
  if(!val) return 'front';
  const v = val.toLowerCase().trim();
  return v==='back'||v==='b'||v==='rear' ? 'back' : 'front';
}
