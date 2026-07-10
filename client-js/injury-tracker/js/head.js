// ── HEAD & FACE EVALUATION PANEL ─────────────────────────────────────────────

window._headConditions = [];
let _headPanelOpen = false;
let _headSearch = '';
let _headPinKey = 'headFace'; // which pin was clicked to open

// ── OPEN / CLOSE ─────────────────────────────────────────────────────────────

function openHeadPanel(pinKey) {
  _headPinKey = pinKey || 'headFace';
  // Mark all existing conditions as committed — panel opens as fresh slate
  (window._headConditions||[]).forEach(c => { c._committed = true; });
  const panel = document.getElementById('head-panel');
  const bodyPanel = document.querySelector('.body-panel');
  const sidebar = document.getElementById('sidebar');
  if (bodyPanel) bodyPanel.classList.add('hidden');
  if (sidebar) sidebar.classList.add('hidden');
  panel.classList.remove('hidden');
  _headPanelOpen = true;
  renderHeadPanel();
}

function closeHeadPanel() {
  const panel = document.getElementById('head-panel');
  const bodyPanel = document.querySelector('.body-panel');
  const sidebar = document.getElementById('sidebar');
  panel.classList.add('hidden');
  if (bodyPanel) bodyPanel.classList.remove('hidden');
  if (sidebar) sidebar.classList.remove('hidden');
  _headPanelOpen = false;
}

function placeHeadPin() {
  const conds = window._headConditions;
  // Name the condition the user is actually placing a pin for — the first
  // NON-committed one (committed conditions are hidden from the panel)
  const active = conds.find(c => !c._committed);
  const label = active ? active.condition : (conds.length ? conds[0].condition : 'Head & Face');
  closeHeadPanel();
  enterPinPlaceMode('headFace', label, true);
}

// ── CONDITION MANAGEMENT ─────────────────────────────────────────────────────

function addHeadCondition(name) {
  // Never duplicate a condition — resurface a committed copy instead of
  // adding a second entry that would double-count in the combined rating
  const existing = window._headConditions.find(c => c.condition === name);
  if (existing) {
    if (existing._committed) { existing._committed = false; renderHeadConditionList(); renderHeadEvalRegion(); }
    return;
  }
  const profileKey = getHeadProfileKey(name);
  const profile = HEAD_PROFILES[profileKey];
  const domains = {};
  profile.domains.forEach(d => { domains[d.id] = 0; });
  window._headConditions.push(Object.assign({
    id: Date.now(),
    condition: name,
    profile: profileKey,
    domains: domains,
    calculatedRating: 0,
    manualOverride: null,
    effectiveRating: 0,
    extremity: 'none',
  }, _condInfoDefaults()));
  renderHeadConditionList();
  renderHeadEvalRegion();
}

function removeHeadCondition(id) {
  if(typeof _removeCondPinIfExists === 'function') _removeCondPinIfExists(id);
  window._headConditions = window._headConditions.filter(c => c.id !== id);
  renderHeadConditionList();
  renderHeadEvalRegion();
  if (typeof renderRating === 'function') renderRating();
}

function toggleHeadCondition(name) {
  // Single-select: only one non-committed condition at a time
  const uncommitted = window._headConditions.filter(c => !c._committed);
  const alreadySelected = uncommitted.find(c => c.condition === name);
  if(alreadySelected){
    removeHeadCondition(alreadySelected.id);
    return;
  }
  // Remove previous uncommitted selection
  uncommitted.forEach(c => removeHeadCondition(c.id));
  addHeadCondition(name);
}

// ── DOMAIN UPDATES ───────────────────────────────────────────────────────────

function updateHeadDomain(condId, domainId, value) {
  const cond = window._headConditions.find(c => c.id === condId);
  if (!cond) return;
  cond.domains[domainId] = parseInt(value);
  recalcHeadRating(cond);
  // Targeted DOM update — no full re-render, no scroll jump
  _patchHeadDomainButtons('hd-eval-body-'+condId, domainId, parseInt(value));
  _patchHeadRating(condId, cond.effectiveRating, cond.calculatedRating);
  // Refresh the cond-list so the rating badge reflects the new value.
  renderHeadConditionList();
  if (typeof renderRating === 'function') renderRating();
}

function _patchHeadDomainButtons(evalBodyId, domainId, newValue){
  const body = document.getElementById(evalBodyId);
  if(!body) return;
  body.querySelectorAll('.hd-level-btn').forEach(btn => {
    const onclick = btn.getAttribute('onclick') || '';
    if(onclick.indexOf("'"+domainId+"'") === -1) return;
    const match = onclick.match(/,\s*(\d+)\s*\)/);
    if(!match) return;
    if(parseInt(match[1]) === newValue) btn.classList.add('hd-active');
    else btn.classList.remove('hd-active');
  });
}

function _patchHeadRating(condId, effectiveRating, calculatedRating){
  const evalBody = document.getElementById('hd-eval-body-'+condId);
  if(!evalBody) return;
  const card = evalBody.closest('.mh-eval-card');
  if(!card) return;
  const badge = card.querySelector('.mh-eval-rating');
  if(badge){
    badge.textContent = effectiveRating + '%';
    badge.className = 'mh-eval-rating mh-rate-' + effectiveRating;
  }
  // The "Calculated Rating" box always shows the CALCULATED value, even under override
  const calcVal = evalBody.querySelector('.hd-calc-val');
  if(calcVal) calcVal.textContent = (calculatedRating !== undefined ? calculatedRating : effectiveRating) + '%';
}

function setHeadOverride(condId, value) {
  const cond = window._headConditions.find(c => c.id === condId);
  if (!cond) return;
  if (value === '' || value === null) {
    cond.manualOverride = null;
    cond.effectiveRating = cond.calculatedRating;
  } else {
    cond.manualOverride = parseInt(value);
    cond.effectiveRating = cond.manualOverride;
  }
  renderHeadConditionList();
  renderHeadEvalRegion();
  if (typeof renderRating === 'function') renderRating();
}

function toggleHeadOverride(condId, checked) {
  const cond = window._headConditions.find(c => c.id === condId);
  if (!cond) return;
  if (checked) {
    cond.manualOverride = cond.calculatedRating;
    cond.effectiveRating = cond.manualOverride;
  } else {
    cond.manualOverride = null;
    cond.effectiveRating = cond.calculatedRating;
  }
  renderHeadConditionList();
  renderHeadEvalRegion();
  if (typeof renderRating === 'function') renderRating();
}

function recalcHeadRating(cond) {
  cond.calculatedRating = calculateHeadRating(cond.domains);
  if (cond.manualOverride === null) {
    cond.effectiveRating = cond.calculatedRating;
  }
}

// ── TOGGLE EVAL CARD ─────────────────────────────────────────────────────────

function toggleHeadEvalCard(condId) {
  const body = document.getElementById('hd-eval-body-' + condId);
  if (body) body.classList.toggle('collapsed');
}

// ── SEARCH ───────────────────────────────────────────────────────────────────

function onHeadSearch(val) {
  _headSearch = val.toLowerCase();
  renderHeadConditionList();
}

function _buildHeadCondListHTML() {
  // Only show current session's selection — committed conditions are hidden (fresh slate)
  const currentCond = window._headConditions.find(c => !c._committed);
  const selected = new Set();
  if (currentCond) selected.add(currentCond.condition);

  const filtered = VA_HEAD.filter(name => !_headSearch || name.toLowerCase().includes(_headSearch));
  if (!filtered.length) return '<div style="padding:14px;color:var(--muted);font-size:12px;text-align:center;">No conditions match your search.</div>';
  return filtered.map(name => {
    const checked = selected.has(name);
    const badge = checked && currentCond ? '<span class="mh-cond-badge mh-rate-' + currentCond.effectiveRating + '">' + currentCond.effectiveRating + '%</span>' : '';
    const escaped = name.replace(/'/g, "\\'");
    const dataName = name.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    return '<div class="mh-cond-item' + (checked ? ' selected' : '') + '" data-cond-name="' + dataName + '" onclick="toggleHeadCondition(\'' + escaped + '\')">' +
      '<input type="radio" name="hd-cond" ' + (checked ? 'checked' : '') + ' onclick="event.stopPropagation();toggleHeadCondition(\'' + escaped + '\')">' +
      '<span class="mh-cond-label">' + name + '</span>' +
      badge +
    '</div>';
  }).join('');
}

function renderHeadConditionList() {
  const list = document.getElementById('hd-cond-list');
  if (!list) return;
  list.innerHTML = _buildHeadCondListHTML();
  if (typeof _initCondListScroll === 'function') _initCondListScroll(list);
}

// ── RENDER PANEL ─────────────────────────────────────────────────────────────

function renderHeadPanel() {
  const panel = document.getElementById('head-panel');
  if (!panel) return;

  let h = '';

  // Header
  h += '<div class="mh-header">' +
    '<span class="mh-title">Head & Face Evaluation</span>' +
    '<button class="mh-back" onclick="closeHeadPanel()">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>' +
      ' Back to Map' +
    '</button>' +
  '</div>';

  h += '<div class="mh-body">';

  // Info banner
  h += '<div class="mh-info">' +
    '<strong>Each condition rated separately:</strong> Unlike mental health, physical head/face conditions are each rated independently under their own diagnostic code. ' +
    'Each rating contributes separately to your combined VA disability rating.' +
  '</div>';

  // Search
  h += '<div class="mh-search">' +
    '<svg class="mh-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
    '<input type="text" placeholder="Search conditions..." value="' + _headSearch + '" oninput="onHeadSearch(this.value)">' +
  '</div>';

  // Condition checklist
  h += '<div class="mh-cond-list" id="hd-cond-list">' + _buildHeadCondListHTML() + '</div>';

  // Dynamic eval region — re-rendered on its own without rebuilding the panel
  // or the cond-list above. Keeps the user's scroll/search state intact.
  h += '<div id="hd-eval-region">' + _buildHeadEvalRegionHTML() + '</div>';

  h += '</div>'; // mh-body
  const _scrollTop = panel.scrollTop;
  panel.innerHTML = h;
  panel.scrollTop = _scrollTop;
}

// Build the HTML for the evaluation region (everything below the cond-list).
// Split out so updating a condition can re-render only this region instead of
// rebuilding the panel — that's what keeps the cond-list scroll/search state
// and hover from twitching on every click.
function _buildHeadEvalRegionHTML() {
  const conds = window._headConditions;
  let h = '';

  // Selected conditions evaluation — only current session (non-committed)
  const _visibleConds = conds.filter(c => !c._committed);
  if (_visibleConds.length) {
    h += '<div class="mh-section-title">Evaluations (' + _visibleConds.length + ' condition' + (_visibleConds.length > 1 ? 's' : '') + ')</div>';

    _visibleConds.forEach(cond => {
      const profile = HEAD_PROFILES[cond.profile] || HEAD_PROFILES.generic;
      const rateClass = 'mh-rate-' + cond.effectiveRating;
      const overrideActive = cond.manualOverride !== null;

      h += '<div class="mh-eval-card">';

      // Card header
      h += '<div class="mh-eval-header" onclick="toggleHeadEvalCard(' + cond.id + ')">' +
        '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">' +
          '<span class="mh-eval-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + cond.condition + '</span>' +
          '<span style="font-size:9px;font-weight:600;font-family:var(--fh);color:var(--muted);background:var(--bg);border:1px solid var(--border);padding:1px 6px;border-radius:3px;">' + profile.label.split('(')[0].trim() + '</span>' +
          (overrideActive ? '<span class="mh-override-tag">Manual</span>' : '') +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span class="mh-eval-rating ' + rateClass + '">' + cond.effectiveRating + '%</span>' +
          '<button class="mh-remove" onclick="event.stopPropagation();removeHeadCondition(' + cond.id + ')" title="Remove condition">&times;</button>' +
        '</div>' +
      '</div>';

      // Card body (domains)
      h += '<div class="mh-eval-body" id="hd-eval-body-' + cond.id + '">';

      // Service info fields
      h += _condInfoHTML('head', cond);

      // Profile note
      if (profile.note) {
        h += '<div style="padding:8px 12px;margin-bottom:10px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;font-size:11px;color:#92400e;">' + profile.note + '</div>';
      }

      // Domain cards
      profile.domains.forEach(domain => {
        const currentValue = cond.domains[domain.id] || 0;

        h += '<div class="mh-domain">' +
          '<div class="mh-domain-header">' +
            '<div class="mh-domain-label">' + domain.label + '</div>' +
            '<div class="mh-domain-desc">' + domain.description + '</div>' +
          '</div>';

        // Level buttons — physical conditions use specific value levels
        h += '<div class="hd-levels">';
        domain.levels.forEach(lv => {
          const isActive = currentValue === lv.value;
          h += '<button class="hd-level-btn' + (isActive ? ' hd-active' : '') + '"' +
            ' onclick="updateHeadDomain(' + cond.id + ',\'' + domain.id + '\',' + lv.value + ')">' +
            '<span class="hd-level-val">' + lv.value + '%</span>' +
            '<span class="hd-level-body">' +
              '<span class="hd-level-label">' + lv.label + '</span>' +
              (lv.description ? '<div class="hd-level-desc">' + lv.description + '</div>' : '') +
            '</span>' +
          '</button>';
        });
        h += '</div>';

        h += '</div>'; // domain
      });

      // Calculated rating display
      h += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(10,35,87,.04);border-radius:6px;">' +
        '<div>' +
          '<div style="font-size:11px;font-weight:700;color:var(--navy);font-family:var(--fh);text-transform:uppercase;letter-spacing:.5px;">Calculated Rating</div>' +
          '<div class="hd-calc-val" style="font-size:24px;font-weight:800;font-family:var(--fm);color:var(--navy);">' + cond.calculatedRating + '%</div>' +
        '</div>' +
      '</div>';

      // Manual override
      h += '<div class="mh-override">' +
        '<label>' +
          '<input type="checkbox" ' + (overrideActive ? 'checked' : '') + ' onchange="toggleHeadOverride(' + cond.id + ',this.checked)">' +
          ' Manual Override' +
        '</label>';
      if (overrideActive) {
        h += '<select onchange="setHeadOverride(' + cond.id + ',this.value)">';
        [0,10,20,30,40,50,60,70,80,90,100].forEach(v => {
          h += '<option value="' + v + '"' + (v === cond.manualOverride ? ' selected' : '') + '>' + v + '%</option>';
        });
        h += '</select>';
      }
      h += '</div>';

      h += '</div>'; // eval-body
      h += '</div>'; // eval-card
    });

    // Summary — current session only
    h += '<div class="mh-combined">' +
      '<div class="mh-combined-label">Head & Face Ratings</div>' +
      '<div class="mh-combined-tiles">';
    _visibleConds.forEach(c => {
      h += '<div class="mh-combined-tile">' +
        '<div class="mh-combined-tile-name">' + c.condition + '</div>' +
        '<div class="mh-combined-tile-val">' + c.effectiveRating + '%</div>' +
      '</div>';
    });
    h += '</div>' +
      '<div class="mh-combined-note">Each condition contributes separately to your combined VA rating</div>' +
    '</div>';

  } else {
    h += '<div class="mh-empty">' +
      '<div style="font-size:28px;margin-bottom:8px;">&#129504;</div>' +
      '<strong>Select conditions above to begin evaluation</strong><br>' +
      'Check one or more conditions, then rate each using VA diagnostic criteria.<br>' +
      'Head & face conditions include TBI, migraines, hearing, vision, TMJ, and more.' +
    '</div>';
  }

  // Place Pin / Done buttons
  h += '<div class="mh-done-wrap">';
  if(_visibleConds.length){
    h += '<button class="mh-done-btn" onclick="placeHeadPin()">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z"/></svg>' +
      ' Place Pin on Map' +
    '</button>' +
    '<div style="font-size:11px;color:var(--muted);text-align:center;margin-top:6px;">Click to return to the map and place a pin for this condition.</div>';
  }
  h += '<button class="mh-back-btn" onclick="closeHeadPanel()" style="margin-top:8px;">' +
    'Back to Map (no pin)' +
  '</button>';
  h += '</div>';

  return h;
}

// Render only the section below the cond-list. Falls back to a full panel
// render if the region doesn't exist yet (e.g., first open).
function renderHeadEvalRegion() {
  const region = document.getElementById('hd-eval-region');
  if (!region) { renderHeadPanel(); return; }
  region.innerHTML = _buildHeadEvalRegionHTML();
}
