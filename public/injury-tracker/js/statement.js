// ── PERSONAL STATEMENT TAB ──

if(!window._personalStatement) window._personalStatement = '';

function renderStatement(){
  const c = document.getElementById('ps-content');
  if(!c) return;

  // Gather all conditions for the reference sidebar
  const _pk = _getPanelKeys();
  const allConds = [];

  // Physical injuries (non-panel)
  injuries.filter(i => !_pk.has(i.key)).forEach(i => {
    allConds.push({ name: i.label, type: 'Primary', rating: i._assignedRating, date: i.date });
  });

  // Mental health
  (window._mentalHealthConditions||[]).forEach(c => {
    allConds.push({ name: c.condition, type: 'Mental Health', rating: c.effectiveRating, date: c.date });
  });

  // Head & Face
  (window._headConditions||[]).forEach(c => {
    allConds.push({ name: c.condition, type: 'Head & Face', rating: c.effectiveRating, date: c.date });
  });

  // Body part evaluated
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      (window[cfg.stateKey]||[]).forEach(c => {
        allConds.push({ name: c.condition, type: cfg.title, rating: c.effectiveRating, date: c.date, extremity: c.extremity });
      });
    });
  }

  // Secondaries from all sources
  const secSet = new Set();
  injuries.forEach(i => { (i.secondaries||[]).forEach(s => secSet.add(s)); });
  (window._mentalHealthConditions||[]).forEach(c => { (c.secondaries||[]).forEach(s => secSet.add(s)); });
  (window._headConditions||[]).forEach(c => { (c.secondaries||[]).forEach(s => secSet.add(s)); });
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      (window[cfg.stateKey]||[]).forEach(c => { (c.secondaries||[]).forEach(s => secSet.add(s)); });
    });
  }

  // Special claims
  const specials = [];
  if(typeof SPECIAL_CLAIM_TYPES !== 'undefined' && window._specialClaims){
    SPECIAL_CLAIM_TYPES.forEach(item => {
      if(window._specialClaims[item.id]) specials.push(item.label);
    });
  }

  let html = '<div class="ps-layout">';

  // Main writing area
  html += '<div class="ps-main">';

  // Formatting toolbar
  html += '<div class="ps-toolbar">' +
    '<button onclick="psCmd(\'bold\')" title="Bold"><b>B</b></button>' +
    '<button onclick="psCmd(\'italic\')" title="Italic"><i>I</i></button>' +
    '<button onclick="psCmd(\'underline\')" title="Underline"><u>U</u></button>' +
    '<div class="ps-sep"></div>' +
    '<button onclick="psCmd(\'insertUnorderedList\')" title="Bullet List">&#8226; List</button>' +
    '<button onclick="psCmd(\'insertOrderedList\')" title="Numbered List">1. List</button>' +
    '<div class="ps-sep"></div>' +
    '<button onclick="psCmd(\'indent\')" title="Indent">&#8677; Indent</button>' +
    '<button onclick="psCmd(\'outdent\')" title="Outdent">&#8676; Outdent</button>' +
    '<div class="ps-sep"></div>' +
    '<button onclick="psCmd(\'removeFormat\')" title="Clear Formatting">Clear</button>' +
  '</div>';

  // Editable area
  const placeholder = window._personalStatement ? '' : ' data-placeholder="true"';
  const content = window._personalStatement || '<p style="color:var(--muted);">Write your personal statement here...</p>' +
    '<p style="color:var(--muted);font-size:12px;"><br>Example:<br><br>' +
    'During my service at [base], I injured my [body part] while [activity]. ' +
    'Since then, the pain has gotten worse and I now have difficulty [daily activities]. ' +
    'I was treated at [clinic] and continue to receive care for this condition.<br><br>' +
    'This condition has also caused [secondary condition], which affects my ability to [impact]...</p>';

  html += '<div id="ps-editor" class="ps-editor" contenteditable="true" ' +
    'oninput="psSave()"' + placeholder + '>' + content + '</div>';

  html += '<div class="ps-hint">This statement is included in your export. Write in your own words — there is no wrong way to describe your experience.</div>';
  html += '</div>';

  // Reference sidebar
  html += '<div class="ps-sidebar">';
  html += '<div class="ps-sidebar-title">Your Conditions</div>';
  html += '<div class="ps-sidebar-desc">Reference list of everything you\'ve logged. Click a condition to insert its name into your statement.</div>';

  if(allConds.length){
    html += '<div class="ps-ref-section">Primary & Evaluated</div>';
    allConds.forEach(c => {
      const ext = c.extremity && c.extremity !== 'none' ? ' [' + c.extremity + ']' : '';
      const ratingTxt = c.rating !== undefined && c.rating !== null ? ' — ' + c.rating + '%' : '';
      const escaped = (c.name + ext).replace(/'/g,"\\'").replace(/"/g,'&quot;');
      html += '<div class="ps-ref-item" onclick="psInsert(\'' + escaped + '\')" title="Click to insert">' +
        '<span class="ps-ref-name">' + c.name + ext + '</span>' +
        '<span class="ps-ref-type">' + c.type + ratingTxt + '</span>' +
      '</div>';
    });
  }

  if(secSet.size){
    html += '<div class="ps-ref-section">Secondary Conditions</div>';
    secSet.forEach(s => {
      const escaped = s.replace(/'/g,"\\'").replace(/"/g,'&quot;');
      html += '<div class="ps-ref-item" onclick="psInsert(\'' + escaped + '\')" title="Click to insert">' +
        '<span class="ps-ref-name">' + s + '</span>' +
        '<span class="ps-ref-type">Secondary</span>' +
      '</div>';
    });
  }

  if(specials.length){
    html += '<div class="ps-ref-section">Special Claims</div>';
    specials.forEach(s => {
      const escaped = s.replace(/'/g,"\\'").replace(/"/g,'&quot;');
      html += '<div class="ps-ref-item" onclick="psInsert(\'' + escaped + '\')" title="Click to insert">' +
        '<span class="ps-ref-name">' + s + '</span>' +
        '<span class="ps-ref-type">Special</span>' +
      '</div>';
    });
  }

  if(!allConds.length && !secSet.size && !specials.length){
    html += '<div style="padding:16px;color:var(--muted);font-size:12px;text-align:center;">No conditions logged yet.<br>Add conditions from the Body Map tab.</div>';
  }

  html += '</div>'; // ps-sidebar
  html += '</div>'; // ps-layout

  c.innerHTML = html;

  // Clear placeholder on first focus
  const editor = document.getElementById('ps-editor');
  if(editor && editor.hasAttribute('data-placeholder')){
    editor.addEventListener('focus', function _clear(){
      if(editor.hasAttribute('data-placeholder')){
        editor.innerHTML = '';
        editor.removeAttribute('data-placeholder');
      }
      editor.removeEventListener('focus', _clear);
    }, {once: true});
  }
}

function psCmd(command){
  document.execCommand(command, false, null);
  document.getElementById('ps-editor')?.focus();
}

function psSave(){
  const editor = document.getElementById('ps-editor');
  if(editor) window._personalStatement = editor.innerHTML;
}

function psInsert(text){
  const editor = document.getElementById('ps-editor');
  if(!editor) return;
  // Clear placeholder if present
  if(editor.hasAttribute('data-placeholder')){
    editor.innerHTML = '';
    editor.removeAttribute('data-placeholder');
  }
  editor.focus();
  document.execCommand('insertText', false, text);
  psSave();
}
