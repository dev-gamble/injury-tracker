// ── SAVE / LOAD PROJECT (.endexclaim encrypted files; legacy .vaclaim also accepted) ──

const VACLAIM_MAGIC = new Uint8Array([0x56, 0x41, 0x43, 0x4C]); // "VACL"
const VACLAIM_VERSION = 1;
const PBKDF2_ITERATIONS = 600000;

// ── CRYPTO HELPERS ──

async function _deriveKey(password, salt){
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function _encryptState(jsonString, password){
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await _deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(jsonString));
  // Format: [VACL 4B][version 1B][salt 16B][iv 12B][ciphertext NB]
  const header = new Uint8Array(4 + 1 + 16 + 12);
  header.set(VACLAIM_MAGIC, 0);
  header[4] = VACLAIM_VERSION;
  header.set(salt, 5);
  header.set(iv, 21);
  const result = new Uint8Array(header.length + ciphertext.byteLength);
  result.set(header, 0);
  result.set(new Uint8Array(ciphertext), header.length);
  return result.buffer;
}

async function _decryptState(arrayBuffer, password){
  const data = new Uint8Array(arrayBuffer);
  // Verify magic
  if(data.length < 33 || data[0]!==0x56 || data[1]!==0x41 || data[2]!==0x43 || data[3]!==0x4C){
    throw new Error('NOT_VACLAIM');
  }
  const version = data[4];
  if(version > VACLAIM_VERSION) throw new Error('NEWER_VERSION');
  const salt = data.slice(5, 21);
  const iv = data.slice(21, 33);
  const ciphertext = data.slice(33);
  const key = await _deriveKey(password, salt);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(plaintext);
}

// ── STATE COLLECTION ──

function _collectAllState(){
  const state = {
    version: VACLAIM_VERSION,
    savedAt: new Date().toISOString(),
    userId: window._userId || '',
    injuries: injuries || [],
    mentalHealthConditions: window._mentalHealthConditions || [],
    headConditions: window._headConditions || [],
    personalStatement: window._personalStatement || '',
    vocSecondaries: window._vocSecondaries || [],
    vocNotes: window._vocNotes || '',
    specialClaims: window._specialClaims || {},
    smcSelections: window._smcSelections || [],
    presumptiveData: window._presumptiveData || {},
    mstData: window._mstData || null,
    mapView: { side: curSide, body: curBody },
  };
  // Body part conditions — iterate BP_REGISTRY for all stateKeys
  state.bodyPartConditions = {};
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.entries(BP_REGISTRY).forEach(([regionId, cfg]) => {
      state.bodyPartConditions[regionId] = window[cfg.stateKey] || [];
    });
  }
  return state;
}

function _isStateEmpty(){
  if((injuries || []).length > 0) return false;
  if((window._mentalHealthConditions || []).length > 0) return false;
  if((window._headConditions || []).length > 0) return false;
  if(typeof BP_REGISTRY !== 'undefined'){
    for(const cfg of Object.values(BP_REGISTRY)){
      if((window[cfg.stateKey] || []).length > 0) return false;
    }
  }
  return true;
}

// ── STATE RESTORATION ──

function _restoreAllState(state){
  // User ID
  window._userId = state.userId || '';
  const uidField = document.getElementById('user-id-field');
  if(uidField) uidField.value = window._userId;

  // Injuries
  injuries = state.injuries || [];

  // Mental health
  window._mentalHealthConditions = state.mentalHealthConditions || [];

  // Head
  window._headConditions = state.headConditions || [];

  // Body part conditions
  if(state.bodyPartConditions && typeof BP_REGISTRY !== 'undefined'){
    Object.entries(BP_REGISTRY).forEach(([regionId, cfg]) => {
      window[cfg.stateKey] = state.bodyPartConditions[regionId] || [];
    });
  }

  // Personal statement
  window._personalStatement = state.personalStatement || '';

  // Vocational
  window._vocSecondaries = state.vocSecondaries || [];
  window._vocNotes = state.vocNotes || '';

  // Special claims
  window._specialClaims = state.specialClaims || {};
  window._smcSelections = state.smcSelections || [];
  window._presumptiveData = state.presumptiveData || {};
  window._mstData = state.mstData || null;

  // Map view
  if(state.mapView){
    curSide = state.mapView.side || 'front';
    curBody = state.mapView.body || 'male';
  }

  // ── Re-render everything ──
  _restorePins();
  if(typeof updateView === 'function') updateView();
  if(typeof updateBadges === 'function') updateBadges();
  if(typeof updateCount === 'function') updateCount();
  if(typeof buildSidebar === 'function') buildSidebar();
  if(typeof renderTimeline === 'function') renderTimeline();
  if(typeof renderSecondary === 'function') renderSecondary();
  if(typeof renderRating === 'function') renderRating();
  if(typeof renderSpecial === 'function') renderSpecial();
  if(typeof renderStatement === 'function') renderStatement();
}

function _restorePins(){
  // Clear all pin layers
  ['pins-mf','pins-mb','pins-ff','pins-fb'].forEach(id => {
    const layer = document.getElementById(id);
    if(layer) layer.innerHTML = '';
  });

  // Re-drop injury pins
  injuries.forEach(inj => {
    if(inj.pin && inj.pin.x !== undefined){
      if(typeof dropPin === 'function') dropPin(inj);
    }
  });

  // Re-drop condition pins (mental, head, body parts)
  const condSources = [
    ...(window._mentalHealthConditions || []),
    ...(window._headConditions || []),
  ];
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.values(BP_REGISTRY).forEach(cfg => {
      condSources.push(...(window[cfg.stateKey] || []));
    });
  }
  condSources.forEach(cond => {
    if(!cond.pin || cond.pin.x === undefined) return;
    const { x, y, side, body } = cond.pin;
    const suffix = (body === 'male' ? 'm' : 'f') + (side === 'front' ? 'f' : 'b');
    const layer = document.getElementById('pins-' + suffix);
    if(!layer) return;
    const pinId = 'pin-cond-' + cond.id;
    const existing = document.getElementById(pinId);
    if(existing) existing.remove();
    const p = document.createElement('div');
    p.className = 'pin pin-single';
    p.id = pinId;
    p.style.left = x + '%';
    p.style.top = y + '%';
    const label = cond.condition || cond.label || '';
    p.innerHTML = '<div class="pin-head"><span class="pin-num" style="font-size:7px;">&#9733;</span></div>' +
      '<div class="pin-tip">' + label + '</div>' +
      '<button class="pin-del" onclick="_removeCondPin(' + cond.id + ',event)" title="Remove">&times;</button>';
    layer.appendChild(p);
    if(typeof _makeCondPinDraggable === 'function') _makeCondPinDraggable(p, cond);
  });

  if(typeof refreshPinNumbers === 'function') refreshPinNumbers();
}

// ── TOAST HELPER ──
// Success toast: bottom-right card matching the access-gate upgrade-toast
// layout, but in a green "success" tone with a checkmark icon and a green
// countdown bar. Accepts either a plain string (legacy) or { title, copy,
// eyebrow } for richer messages.

function _showToast(input){
  var opts = (typeof input === 'string') ? { title: input } : (input || {});
  var title = opts.title || '';
  var copy = opts.copy || '';
  var eyebrow = opts.eyebrow || 'Success';

  var existing = document.getElementById('endex-success-toast');
  if(existing) existing.remove();

  _ensureSuccessToastStyles();

  var t = document.createElement('div');
  t.id = 'endex-success-toast';
  t.className = 'endex-success-toast';
  t.setAttribute('role', 'status');
  t.setAttribute('aria-live', 'polite');

  var inner = document.createElement('div');
  inner.className = 'endex-success-toast__inner';

  inner.innerHTML = ''
    + '<svg class="endex-success-toast__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">'
    +   '<circle cx="7" cy="7" r="5.6" stroke="currentColor" stroke-width="1.3"/>'
    +   '<path d="M4.6 7.2l1.7 1.7 3.1-3.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
    + '</svg>';

  var body = document.createElement('div');
  body.className = 'endex-success-toast__body';

  var eb = document.createElement('div');
  eb.className = 'endex-success-toast__eyebrow';
  eb.textContent = eyebrow;
  body.appendChild(eb);

  var ti = document.createElement('div');
  ti.className = 'endex-success-toast__title';
  ti.textContent = title;
  body.appendChild(ti);

  if(copy){
    var co = document.createElement('div');
    co.className = 'endex-success-toast__copy';
    co.textContent = copy;
    body.appendChild(co);
  }

  inner.appendChild(body);
  t.appendChild(inner);

  var timer = document.createElement('div');
  timer.className = 'endex-success-toast__timer';
  timer.setAttribute('aria-hidden', 'true');
  t.appendChild(timer);

  document.body.appendChild(t);
  requestAnimationFrame(function(){ t.classList.add('is-in'); });

  setTimeout(function(){
    if(!t.parentNode) return;
    t.classList.remove('is-in');
    t.classList.add('is-out');
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 240);
  }, 3500);
}

function _ensureSuccessToastStyles(){
  if(document.getElementById('endex-success-toast-styles')) return;
  var s = document.createElement('style');
  s.id = 'endex-success-toast-styles';
  s.textContent = [
    '.endex-success-toast{',
    '  position:fixed; right:24px; bottom:24px; z-index:9999;',
    '  width:320px; background:#ffffff;',
    '  border:1px solid #d8dde8; border-top:3px solid #0a2357; border-left:2px solid #2d7a4f;',
    '  border-radius:4px; overflow:hidden;',
    '  box-shadow:0 8px 24px rgba(10,35,87,.14), 0 2px 6px rgba(10,35,87,.08);',
    '  font-family:"Open Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;',
    '  color:#0a1628;',
    '  opacity:0; transform:translateY(12px);',
    '  transition:opacity 280ms cubic-bezier(.2,.8,.2,1), transform 280ms cubic-bezier(.2,.8,.2,1);',
    '}',
    '.endex-success-toast.is-in{ opacity:1; transform:translateY(0); }',
    '.endex-success-toast.is-out{ opacity:0; transform:translateY(6px); transition-duration:240ms; }',
    '.endex-success-toast__inner{',
    '  display:flex; gap:11px; align-items:flex-start;',
    '  padding:13px 16px 12px 14px;',
    '}',
    '.endex-success-toast__icon{',
    '  flex:0 0 auto; margin-top:3px; color:#2d7a4f;',
    '}',
    '.endex-success-toast__body{ min-width:0; }',
    '.endex-success-toast__eyebrow{',
    '  font-family:"Oswald","Open Sans",Arial,sans-serif;',
    '  font-size:9.5px; font-weight:700; letter-spacing:2.5px;',
    '  text-transform:uppercase; color:#2d7a4f; line-height:1;',
    '  margin-bottom:6px;',
    '}',
    '.endex-success-toast__title{',
    '  font-family:"Oswald","Open Sans",Arial,sans-serif;',
    '  font-size:14px; font-weight:600; letter-spacing:.4px;',
    '  text-transform:uppercase; color:#0a2357; line-height:1.2;',
    '  margin-bottom:4px;',
    '}',
    '.endex-success-toast__copy{',
    '  font-size:12px; line-height:1.45; color:#5a6782;',
    '}',
    '.endex-success-toast__timer{',
    '  height:1px; background:#2d7a4f; transform-origin:left center;',
    '  animation:endex-success-toast-timer 3500ms linear forwards;',
    '}',
    '@keyframes endex-success-toast-timer{',
    '  from{ transform:scaleX(1); }',
    '  to{ transform:scaleX(0); }',
    '}',
    '@media (prefers-reduced-motion: reduce){',
    '  .endex-success-toast{ transition:opacity 120ms linear; transform:none; }',
    '  .endex-success-toast.is-in{ transform:none; }',
    '  .endex-success-toast.is-out{ transform:none; }',
    '  .endex-success-toast__timer{ animation:none; background:transparent; }',
    '}'
  ].join('\n');
  document.head.appendChild(s);
}

// ── SAVE PROJECT UI ──

const ENDEXCLAIM_EXT = '.endexclaim';

// Build the default filename: YYYYMMDD-<Name>-Endex<####>
function _buildDefaultFilename(){
  const d = new Date();
  const yyyymmdd = d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  const rawName = (window._userId || '').trim();
  const namePart = _sanitizeNamePart(rawName) || 'Untitled';
  const rand4 = String(Math.floor(1000 + Math.random() * 9000));
  return yyyymmdd + '-' + namePart + '-Endex' + rand4;
}

// Keep filename-safe chars only; collapse whitespace to nothing so the slot stays one token
function _sanitizeNamePart(s){
  return s.replace(/[^A-Za-z0-9_-]+/g, '');
}

// Strip anything the OS would reject in a filename + any trailing extension the user typed
function _sanitizeFilename(s){
  let out = (s || '').trim().replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ');
  // Remove trailing known extension so we can re-append the canonical one
  out = out.replace(/\.(endexclaim|vaclaim)$/i, '');
  return out || _buildDefaultFilename();
}

function saveProject(){
  if(typeof _requireAccess === 'function' && !_requireAccess()) return;
  if(!crypto.subtle){
    alert('Your browser does not support encryption. Please use HTTPS or a modern browser.');
    return;
  }
  _openSaveModal();
}

function _openSaveModal(){
  if(typeof _requireAccess === 'function' && !_requireAccess()) return;
  let modal = document.getElementById('save-modal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'save-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.onclick = function(e){ if(e.target === modal) closeSaveModal(); };
  modal.innerHTML = `
    <div class="modal-panel" style="max-width:480px;" onclick="event.stopPropagation()">
      <div class="modal-header">
        <span>Save Project</span>
        <button class="modal-close" onclick="closeSaveModal()">&times;</button>
      </div>
      <div class="modal-body" style="gap:12px;">
        <div style="background:#fef3c7;border:1px solid #f59e0b;border-left:4px solid #f59e0b;border-radius:6px;padding:12px 14px;font-size:12px;color:#92400e;line-height:1.5;">
          <strong style="display:block;margin-bottom:4px;font-size:13px;color:#78350f;">Your password cannot be recovered.</strong>
          If you forget this password, the saved file <strong>cannot be opened</strong>. There is no way to reset or retrieve it. Write it down and keep it somewhere safe.
        </div>
        <div style="background:#eff6ff;border:1px solid #3b82f6;border-left:4px solid #3b82f6;border-radius:6px;padding:12px 14px;font-size:12px;color:#1e40af;line-height:1.5;">
          <strong style="display:block;margin-bottom:4px;font-size:13px;">Sharing with a VSO or attorney?</strong>
          If you plan to share this file with your Veterans Service Organization, attorney, or legal representative, use a <strong>different password</strong> than your personal accounts. Send the password separately from the file — never in the same email or message.
        </div>
        <div>
          <label for="save-filename" style="font-size:12px;font-weight:700;font-family:var(--fh);color:var(--navy);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:4px;">Filename</label>
          <div style="display:flex;align-items:stretch;border:1px solid var(--border);border-radius:6px;overflow:hidden;background:var(--surface);">
            <input type="text" id="save-filename" value="${_buildDefaultFilename()}" style="flex:1;padding:8px 10px;border:none;outline:none;font-family:var(--fd);font-size:14px;background:transparent;" spellcheck="false">
            <span style="padding:8px 10px;font-family:var(--fd);font-size:13px;color:var(--muted);background:#f1f5f9;border-left:1px solid var(--border);white-space:nowrap;">${ENDEXCLAIM_EXT}</span>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px;">Default: <code style="font-family:var(--fd);">YYYYMMDD-Name-Endex####</code>. Edit freely — the extension is added for you.</div>
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;font-family:var(--fh);color:var(--navy);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:4px;">Password</label>
          <input type="password" id="save-pw" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-family:var(--fd);font-size:14px;" placeholder="Enter a password" autocomplete="new-password">
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;font-family:var(--fh);color:var(--navy);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:4px;">Confirm Password</label>
          <input type="password" id="save-pw-confirm" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-family:var(--fd);font-size:14px;" placeholder="Re-enter password" autocomplete="new-password">
        </div>
        <div id="save-error" style="color:#dc2626;font-size:12px;font-weight:600;display:none;"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
          <button onclick="closeSaveModal()" style="padding:8px 16px;border:1px solid var(--border);border-radius:6px;background:var(--surface);cursor:pointer;font-family:var(--fh);font-size:12px;font-weight:600;color:var(--muted);">Cancel</button>
          <button onclick="_doSave()" id="save-btn" style="padding:8px 20px;border:none;border-radius:6px;background:var(--navy);color:#fff;cursor:pointer;font-family:var(--fh);font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;">Save &amp; Download</button>
        </div>
      </div>
    </div>`;
  modal.classList.remove('hidden');
  setTimeout(() => document.getElementById('save-pw').focus(), 100);
}

function closeSaveModal(){
  const modal = document.getElementById('save-modal');
  if(modal) modal.classList.add('hidden');
}

async function _doSave(){
  if(typeof _requireAccess === 'function' && !_requireAccess()) return;
  const pw = document.getElementById('save-pw').value;
  const pwConfirm = document.getElementById('save-pw-confirm').value;
  const errEl = document.getElementById('save-error');
  errEl.style.display = 'none';

  if(!pw){
    errEl.textContent = 'Please enter a password.';
    errEl.style.display = 'block';
    return;
  }
  if(pw.length < 6){
    errEl.textContent = 'Password must be at least 6 characters.';
    errEl.style.display = 'block';
    return;
  }
  if(pw !== pwConfirm){
    errEl.textContent = 'Passwords do not match.';
    errEl.style.display = 'block';
    return;
  }

  // Warn if saving empty state
  if(_isStateEmpty()){
    if(!confirm('No conditions have been added yet. Save an empty project?')) return;
  }

  const btn = document.getElementById('save-btn');
  btn.textContent = 'Encrypting...';
  btn.disabled = true;

  try {
    const state = _collectAllState();
    const json = JSON.stringify(state);
    const encrypted = await _encryptState(json, pw);
    const blob = new Blob([encrypted], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const rawName = document.getElementById('save-filename').value;
    const filename = _sanitizeFilename(rawName) + ENDEXCLAIM_EXT;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeSaveModal();
    _showToast({ title: 'Project saved', copy: 'Keep the file and password safe.' });
  } catch(e){
    errEl.textContent = 'Encryption failed: ' + e.message;
    errEl.style.display = 'block';
  } finally {
    btn.textContent = 'Save & Download';
    btn.disabled = false;
  }
}

// ── LOAD PROJECT UI ──

function loadProject(){
  if(typeof _requireAccess === 'function' && !_requireAccess()) return;
  if(!crypto.subtle){
    alert('Your browser does not support encryption. Please use HTTPS or a modern browser.');
    return;
  }
  _openLoadModal();
}

function _openLoadModal(){
  if(typeof _requireAccess === 'function' && !_requireAccess()) return;
  let modal = document.getElementById('load-modal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'load-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.onclick = function(e){ if(e.target === modal) closeLoadModal(); };
  modal.innerHTML = `
    <div class="modal-panel" style="max-width:480px;" onclick="event.stopPropagation()">
      <div class="modal-header">
        <span>Load Project</span>
        <button class="modal-close" onclick="closeLoadModal()">&times;</button>
      </div>
      <div class="modal-body" style="gap:12px;">
        <div style="background:#fef3c7;border:1px solid #f59e0b;border-left:4px solid #f59e0b;border-radius:6px;padding:12px 14px;font-size:12px;color:#92400e;line-height:1.5;">
          <strong style="display:block;margin-bottom:4px;">This will replace all current data.</strong>
          Any unsaved work in the app will be overwritten. If you have current work you want to keep, save it first before loading a different file.
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;font-family:var(--fh);color:var(--navy);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:4px;">Select File</label>
          <input type="file" id="load-file" accept=".endexclaim,.vaclaim" style="width:100%;padding:6px 0;font-family:var(--fd);font-size:13px;">
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;font-family:var(--fh);color:var(--navy);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:4px;">Password</label>
          <input type="password" id="load-pw" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-family:var(--fd);font-size:14px;" placeholder="Enter file password" autocomplete="current-password">
        </div>
        <div id="load-error" style="color:#dc2626;font-size:12px;font-weight:600;display:none;"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
          <button onclick="closeLoadModal()" style="padding:8px 16px;border:1px solid var(--border);border-radius:6px;background:var(--surface);cursor:pointer;font-family:var(--fh);font-size:12px;font-weight:600;color:var(--muted);">Cancel</button>
          <button onclick="_doLoad()" id="load-btn" style="padding:8px 20px;border:none;border-radius:6px;background:var(--navy);color:#fff;cursor:pointer;font-family:var(--fh);font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;">Open &amp; Load</button>
        </div>
      </div>
    </div>`;
  modal.classList.remove('hidden');
}

function closeLoadModal(){
  const modal = document.getElementById('load-modal');
  if(modal) modal.classList.add('hidden');
}

async function _doLoad(){
  if(typeof _requireAccess === 'function' && !_requireAccess()) return;
  const fileInput = document.getElementById('load-file');
  const pw = document.getElementById('load-pw').value;
  const errEl = document.getElementById('load-error');
  errEl.style.display = 'none';

  if(!fileInput.files.length){
    errEl.textContent = 'Please select an Endex claim file.';
    errEl.style.display = 'block';
    return;
  }
  if(!pw){
    errEl.textContent = 'Please enter the password.';
    errEl.style.display = 'block';
    return;
  }

  const btn = document.getElementById('load-btn');
  btn.textContent = 'Decrypting...';
  btn.disabled = true;

  try {
    const file = fileInput.files[0];
    const arrayBuffer = await file.arrayBuffer();
    let jsonString;
    try {
      jsonString = await _decryptState(arrayBuffer, pw);
    } catch(e){
      if(e.message === 'NOT_VACLAIM'){
        errEl.textContent = 'This is not a valid Endex claim file.';
      } else if(e.message === 'NEWER_VERSION'){
        errEl.textContent = 'This file was saved with a newer version of the app. Please update.';
      } else {
        errEl.textContent = 'Wrong password or corrupted file.';
      }
      errEl.style.display = 'block';
      return;
    }

    const state = JSON.parse(jsonString);

    // Confirm before overwriting
    const savedDate = state.savedAt ? state.savedAt.slice(0, 10) : 'unknown date';
    if(!confirm('Load project saved on ' + savedDate + '?\n\nThis will replace all current work.')){
      return;
    }

    _restoreAllState(state);
    closeLoadModal();
    _showToast({ title: 'Project loaded', copy: 'Your saved entries are ready to edit.' });

  } catch(e){
    errEl.textContent = 'Failed to load: ' + e.message;
    errEl.style.display = 'block';
  } finally {
    btn.textContent = 'Open & Load';
    btn.disabled = false;
  }
}

// ── UNSAVED WORK WARNING ──

window.addEventListener('beforeunload', function(e){
  // The sign-out modal already warns about losing data — don't double-prompt.
  if(window.__signingOut) return;
  const hasData = (injuries || []).length > 0 ||
    (window._mentalHealthConditions || []).length > 0 ||
    (window._headConditions || []).length > 0;
  if(hasData){
    e.preventDefault();
    e.returnValue = '';
  }
});
