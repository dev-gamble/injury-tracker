// ── MENTAL HEALTH EVALUATION PANEL ──────────────────────────────────────────

window._mentalHealthConditions = [];
let _mhPanelOpen = false;
let _mhSearch = '';

// ── OPEN / CLOSE ────────────────────────────────────────────────────────────

function openMentalHealthPanel() {
  // MH is multi-select — don't mark committed, show all selections
  const panel = document.getElementById('mental-health-panel');
  const bodyPanel = document.querySelector('.body-panel');
  const sidebar = document.getElementById('sidebar');
  if (bodyPanel) bodyPanel.classList.add('hidden');
  if (sidebar) sidebar.classList.add('hidden');
  panel.classList.remove('hidden');
  _mhPanelOpen = true;
  renderMentalPanel();
}

function closeMentalHealthPanel() {
  const panel = document.getElementById('mental-health-panel');
  const bodyPanel = document.querySelector('.body-panel');
  const sidebar = document.getElementById('sidebar');
  panel.classList.add('hidden');
  if (bodyPanel) bodyPanel.classList.remove('hidden');
  if (sidebar) sidebar.classList.remove('hidden');
  _mhPanelOpen = false;
}

function placeMentalHealthPin() {
  const highest = getMHHighestCondition();
  const label = highest ? highest.condition : 'Mental Health';
  closeMentalHealthPanel();
  enterPinPlaceMode('mental', label, true);
}

// ── CONDITION MANAGEMENT ────────────────────────────────────────────────────

function addMentalCondition(name) {
  if (window._mentalHealthConditions.find(c => c.condition === name)) return;
  const domains = {};
  MH_DOMAINS.forEach(d => { domains[d.id] = { level: 'none', frequency: 'less25' }; });
  window._mentalHealthConditions.push(Object.assign({
    id: Date.now(),
    condition: name,
    domains: domains,
    calculatedRating: 0,
    manualOverride: null,
    effectiveRating: 0
  }, _condInfoDefaults()));
  renderConditionList();
  renderMHEvalRegion();
}

function removeMentalCondition(id) {
  if(typeof _removeCondPinIfExists === 'function') _removeCondPinIfExists(id);
  window._mentalHealthConditions = window._mentalHealthConditions.filter(c => c.id !== id);
  renderConditionList();
  renderMHEvalRegion();
  if (typeof renderRating === 'function') renderRating();
}

function toggleMentalCondition(name) {
  const existing = window._mentalHealthConditions.find(c => c.condition === name);
  if (existing) removeMentalCondition(existing.id);
  else addMentalCondition(name);
}

// ── DOMAIN UPDATES ──────────────────────────────────────────────────────────

function updateMHDomain(condId, domainId, level) {
  const cond = window._mentalHealthConditions.find(c => c.id === condId);
  if (!cond) return;
  cond.domains[domainId].level = level;
  if (level === 'none') cond.domains[domainId].frequency = 'less25';
  recalcMHRating(cond);
  renderConditionList();
  renderMHEvalRegion();
  if (typeof renderRating === 'function') renderRating();
}

function updateMHFrequency(condId, domainId, freq) {
  const cond = window._mentalHealthConditions.find(c => c.id === condId);
  if (!cond) return;
  cond.domains[domainId].frequency = freq;
  recalcMHRating(cond);
  renderConditionList();
  renderMHEvalRegion();
  if (typeof renderRating === 'function') renderRating();
}

function setMHOverride(condId, value) {
  const cond = window._mentalHealthConditions.find(c => c.id === condId);
  if (!cond) return;
  if (value === '' || value === null) {
    cond.manualOverride = null;
    cond.effectiveRating = cond.calculatedRating;
  } else {
    cond.manualOverride = parseInt(value);
    cond.effectiveRating = cond.manualOverride;
  }
  renderConditionList();
  renderMHEvalRegion();
  if (typeof renderRating === 'function') renderRating();
}

function toggleMHOverride(condId, checked) {
  const cond = window._mentalHealthConditions.find(c => c.id === condId);
  if (!cond) return;
  if (checked) {
    cond.manualOverride = cond.calculatedRating;
    cond.effectiveRating = cond.manualOverride;
  } else {
    cond.manualOverride = null;
    cond.effectiveRating = cond.calculatedRating;
  }
  renderConditionList();
  renderMHEvalRegion();
  if (typeof renderRating === 'function') renderRating();
}

function recalcMHRating(cond) {
  cond.calculatedRating = calculateMHRating(cond.domains);
  if (cond.manualOverride === null) {
    cond.effectiveRating = cond.calculatedRating;
  }
}

// ── GET HIGHEST RATING (for combined VA calc) ───────────────────────────────

function getMHHighestRating() {
  const conds = window._mentalHealthConditions;
  if (!conds.length) return null;
  let highest = 0;
  conds.forEach(c => { if (c.effectiveRating > highest) highest = c.effectiveRating; });
  return highest;
}

function getMHHighestCondition() {
  const conds = window._mentalHealthConditions;
  if (!conds.length) return null;
  let best = conds[0];
  conds.forEach(c => { if (c.effectiveRating > best.effectiveRating) best = c; });
  return best;
}

// ── TOGGLE EVAL CARD ────────────────────────────────────────────────────────

function toggleMHEvalCard(condId) {
  const body = document.getElementById('mh-eval-body-' + condId);
  if (body) body.classList.toggle('collapsed');
}

// ── SEARCH ──────────────────────────────────────────────────────────────────

function onMHSearch(val) {
  _mhSearch = val.toLowerCase();
  renderConditionList();
}

function renderConditionList() {
  const list = document.getElementById('mh-cond-list');
  if (!list) return;
  const selected = new Set(window._mentalHealthConditions.map(c => c.condition));
  const filtered = VA_MENTAL.filter(name => {
    if(!_mhSearch) return true;
    const examples = (typeof MH_EXAMPLES !== 'undefined' && MH_EXAMPLES[name]) || '';
    return name.toLowerCase().includes(_mhSearch) || examples.toLowerCase().includes(_mhSearch);
  });
  let h = '';
  filtered.forEach(name => {
    const checked = selected.has(name);
    const cond = window._mentalHealthConditions.find(c => c.condition === name);
    const badge = cond ? `<span class="mh-cond-badge ${_rateClass(cond.effectiveRating)}">${cond.effectiveRating}%</span>` : '';
    const examples = (typeof MH_EXAMPLES !== 'undefined' && MH_EXAMPLES[name]) || '';
    const exHtml = examples ? `<span class="mh-cond-examples">e.g. ${examples}</span>` : '';
    const escapedName = name.replace(/"/g, '&quot;').replace(/'/g, "&#39;");
    const safeName = name.replace(/'/g, "\\'");
    h += `<div class="mh-cond-item${checked ? ' selected' : ''}" data-cond-name="${escapedName}" onclick="toggleMentalCondition('${safeName}')">
      <input type="checkbox" ${checked ? 'checked' : ''} onclick="event.stopPropagation();toggleMentalCondition('${safeName}')">
      <span class="mh-cond-label">${name}${exHtml}</span>
      ${badge}
    </div>`;
  });
  if (!filtered.length) h = '<div style="padding:14px;color:var(--muted);font-size:12px;text-align:center;">No conditions match your search.</div>';
  list.innerHTML = h;
  if(typeof _initCondListScroll === 'function') _initCondListScroll(list);
}

// ── RENDER PANEL ────────────────────────────────────────────────────────────

function renderMentalPanel() {
  const panel = document.getElementById('mental-health-panel');
  if (!panel) return;

  let h = '';

  // Header
  h += `<div class="mh-header">
    <span class="mh-title">Mental Health Evaluation</span>
    <button class="mh-back" onclick="closeMentalHealthPanel()">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>
      Back to Map
    </button>
  </div>`;

  h += '<div class="mh-body">';

  // Info banner
  h += `<div class="mh-info">
    <strong>VA Single Rating Rule:</strong> The VA rates all mental health conditions under one combined rating using the General Rating Formula for Mental Disorders.
    If you have multiple conditions, the <strong>highest evaluated rating</strong> will be used as your single mental health disability rating.
  </div>`;

  // Search
  h += `<div class="mh-search">
    <svg class="mh-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
    <input type="text" placeholder="Search conditions..." value="${_mhSearch}" oninput="onMHSearch(this.value)">
  </div>`;

  // Condition checklist
  h += '<div class="mh-cond-list" id="mh-cond-list"></div>';

  // Dynamic eval region — re-rendered on its own without rebuilding the panel
  // or the cond-list above. Keeps the user's scroll/search state intact.
  h += '<div id="mh-eval-region">' + _buildMHEvalRegionHTML() + '</div>';

  h += '</div>'; // mh-body
  const _scrollTop = panel.scrollTop;
  panel.innerHTML = h;
  panel.scrollTop = _scrollTop;

  renderConditionList();
  panel.scrollTop = _scrollTop;
  // Sidebar badges live behind this overlay — keep them current as the user
  // adds and rates conditions instead of waiting for a pin to be placed
  if(typeof updateBadges === 'function') updateBadges();
  if(typeof updateCount === 'function') updateCount();
}

// Build the HTML for the evaluation region (everything below the cond-list).
// Split out so toggling a condition can update only this region instead of
// rebuilding the panel — that's what kept the cond-list scroll position alive.
function _buildMHEvalRegionHTML() {
  const conds = window._mentalHealthConditions;
  const highest = getMHHighestCondition();
  let h = '';

  if (conds.length) {
    h += `<div class="mh-section-title">Evaluations (${conds.length} condition${conds.length > 1 ? 's' : ''})</div>`;

    conds.forEach(cond => {
      const isHighest = highest && cond.id === highest.id && conds.length > 1;
      const rateClass = _rateClass(cond.effectiveRating);
      const overrideActive = cond.manualOverride !== null;

      h += `<div class="mh-eval-card${isHighest ? ' mh-highest' : ''}">`;
      h += `<div class="mh-eval-header" onclick="toggleMHEvalCard(${cond.id})">
        <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
          <span class="mh-eval-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cond.condition}</span>
          ${isHighest ? '<span class="mh-highest-tag">Highest Rating</span>' : ''}
          ${overrideActive ? '<span class="mh-override-tag">Manual</span>' : ''}
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="mh-eval-rating ${rateClass}">${cond.effectiveRating}%</span>
          <button class="mh-remove" onclick="event.stopPropagation();removeMentalCondition(${cond.id})" title="Remove condition">&times;</button>
        </div>
      </div>`;
      h += `<div class="mh-eval-body" id="mh-eval-body-${cond.id}">`;
      h += _condInfoHTML('mh', cond);

      MH_DOMAINS.forEach(domain => {
        const dv = cond.domains[domain.id];
        const currentLevel = dv.level;
        const currentFreq = dv.frequency;
        const exampleText = domain.examples[currentLevel] || '';

        h += `<div class="mh-domain">
          <div class="mh-domain-header">
            <div class="mh-domain-label">${domain.label}</div>
            <div class="mh-domain-desc">${domain.description}</div>
          </div>`;
        h += '<div class="mh-levels">';
        MH_IMPAIRMENT_LEVELS.forEach(lv => {
          const isActive = currentLevel === lv;
          h += `<button class="mh-level-btn${isActive ? ' active-' + lv : ''}"
            onclick="updateMHDomain(${cond.id},'${domain.id}','${lv}')">${MH_IMPAIRMENT_LABELS[lv]}</button>`;
        });
        h += '</div>';
        if (currentLevel !== 'none') {
          h += `<div class="mh-freq">
            <span class="mh-freq-label">How often?</span>
            <button class="mh-freq-btn${currentFreq === 'less25' ? ' active' : ''}"
              onclick="updateMHFrequency(${cond.id},'${domain.id}','less25')">Less than 25% of time</button>
            <button class="mh-freq-btn${currentFreq === '25plus' ? ' active' : ''}"
              onclick="updateMHFrequency(${cond.id},'${domain.id}','25plus')">25% or more</button>
          </div>`;
        }
        h += `<div class="mh-example">${exampleText}</div>`;
        h += '</div>';
      });

      h += `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(10,35,87,.04);border-radius:6px;">
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--navy);font-family:var(--fh);text-transform:uppercase;letter-spacing:.5px;">Calculated Rating</div>
          <div style="font-size:24px;font-weight:800;font-family:var(--fm);color:var(--navy);">${cond.calculatedRating}%</div>
        </div>
      </div>`;
      h += `<div class="mh-override">
        <label>
          <input type="checkbox" ${overrideActive ? 'checked' : ''} onchange="toggleMHOverride(${cond.id},this.checked)">
          Manual Override
        </label>`;
      if (overrideActive) {
        h += `<select onchange="setMHOverride(${cond.id},this.value)">`;
        [0, 10, 30, 50, 70, 100].forEach(v => {
          h += `<option value="${v}"${v === cond.manualOverride ? ' selected' : ''}>${v}%</option>`;
        });
        h += '</select>';
      }
      h += '</div>';
      h += '</div>'; // eval-body
      h += '</div>'; // eval-card
    });

    const highestRating = getMHHighestRating();
    h += `<div class="mh-combined">
      <div class="mh-combined-label">Your Mental Health Rating</div>
      <div class="mh-combined-value">${highestRating}%</div>
      <div class="mh-combined-note">${conds.length > 1
        ? 'Highest of ' + conds.length + ' evaluated conditions (VA single-rating rule)'
        : 'Based on your evaluation above'}</div>
      <div class="mh-combined-note" style="margin-top:6px;">Estimate only — these five domains follow the VA's <strong>proposed</strong> updated mental-health criteria, which are not yet in effect. Today the VA rates under the General Rating Formula for Mental Disorders (38 CFR 4.130), based on your overall social and occupational impairment, so your actual rating may differ.</div>
    </div>`;
  } else {
    h += `<div class="mh-empty">
      <div style="font-size:28px;margin-bottom:8px;">&#9881;</div>
      <strong>Select conditions above to begin evaluation</strong><br>
      Check one or more conditions, then rate how each affects you across 5 functional domains.<br>
      These domains follow the VA's proposed updated mental-health criteria and give a realistic estimate — today the VA rates under the General Rating Formula for Mental Disorders (38 CFR 4.130), based on your overall social and occupational impairment.
    </div>`;
  }

  h += '<div class="mh-done-wrap">';
  if (conds.length) {
    h += '<button class="mh-done-btn" onclick="placeMentalHealthPin()">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z"/></svg>' +
      ' Place Pin on Map' +
    '</button>' +
    '<div style="font-size:11px;color:var(--muted);text-align:center;margin-top:6px;">Click to return to the map and place a pin for this condition.</div>';
  }
  h += '<button class="mh-back-btn" onclick="closeMentalHealthPanel()" style="margin-top:8px;">' +
    'Back to Map (no pin)' +
  '</button>';
  h += '</div>';

  return h;
}

// Render only the section below the cond-list. Falls back to a full panel
// render if the region doesn't exist yet (e.g., first open).
function renderMHEvalRegion() {
  const region = document.getElementById('mh-eval-region');
  if (!region) { renderMentalPanel(); return; }
  region.innerHTML = _buildMHEvalRegionHTML();
  if(typeof updateBadges === 'function') updateBadges();
  if(typeof updateCount === 'function') updateCount();
}
