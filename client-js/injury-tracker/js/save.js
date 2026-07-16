// ── SAVE / LOAD PROJECT (.endexclaim encrypted files; legacy .vaclaim also accepted) ──

const VACLAIM_MAGIC = new Uint8Array([0x56, 0x41, 0x43, 0x4C]); // "VACL"
// v2: knee meniscus 10/20 were mapped to the wrong diagnostic codes, and GERD
// moved from DC 7346 to the VA's 2024 DC 7206 criteria. See _migrateState.
// v3: v2 builds saved stale/double-counted ratings (recalc was gated on
// orphaned values only), used incomplete GERD 50/80 wording, described the
// knee/hip replacement 100% as a 1-year criterion (current DC 5054/5055 is
// 4 months), and left some conditions on obsolete profile mappings.
const VACLAIM_VERSION = 3;
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
  // Everything else _collectAllState persists also counts as work
  if(window._mstData && (window._mstData.conditions || []).length > 0) return false;
  if((window._smcSelections || []).length > 0) return false;
  if((window._vocSecondaries || []).length > 0) return false;
  if((window._vocNotes || '').trim() !== '') return false;
  // Personal statement stores editor innerHTML — strip tags before checking
  if((window._personalStatement || '').replace(/<[^>]*>/g, '').trim() !== '') return false;
  if(window._specialClaims && Object.values(window._specialClaims).some(Boolean)) return false;
  if(window._presumptiveData && Object.values(window._presumptiveData).some(d => d && d.selected)) return false;
  return true;
}

// ── SAVE MIGRATIONS ──
//
// A save file stores the ANSWER the user picked for each domain — a number, or a
// level/frequency pair — but not the criterion that answer meant. So whenever a
// domain's levels change, every existing save silently starts rendering a
// different medical answer than the veteran actually gave. Bump VACLAIM_VERSION
// and fix the old data here.
//
// Returns the names of conditions the user must re-answer (criteria changed so
// much that the old answer can't be translated), so the caller can tell them.

// Panels whose domains are numeric values chosen from a `levels` list (body-part
// and head). A stored value matching no level is an answer to a deleted question:
// clear it, recompute, and name the condition for re-review.
function _sweepLeveledDomains(conds, profileFor, calcRating, needsReview){
  (conds || []).forEach(cond => {
    if(!cond || !cond.domains) return;
    const profile = profileFor(cond);
    if(!profile || !profile.domains) return;
    let orphaned = false;
    profile.domains.forEach(d => {
      if(!d.levels) return; // free-numeric domain — nothing to match against
      const v = cond.domains[d.id];
      if(v === undefined || v === 0) return;
      if(d.levels.some(l => l.value === v)) return;
      cond.domains[d.id] = 0;
      orphaned = true;
    });
    if(!orphaned) return;
    cond.calculatedRating = calcRating(cond);
    if(cond.manualOverride === null || cond.manualOverride === undefined){
      cond.effectiveRating = cond.calculatedRating;
    }
    if(!needsReview.includes(cond.condition)) needsReview.push(cond.condition);
  });
}

// Mental health domains hold {level, frequency} strings keyed by MH_DOMAINS id,
// so its orphans look different from the numeric panels'. Three shapes to fix:
// a domain that no longer exists, a level/frequency that no longer exists, and —
// the direction that actually bites — a domain that has since been ADDED, which
// an older save simply doesn't have. Renderers walk MH_DOMAINS and index into
// cond.domains, so a missing entry is a crash, not a blank. Fill it in.
//
// The valid levels come from MH_IMPAIRMENT_LEVELS in data.js — never a copy of
// it. A stale duplicate here would do the exact damage this function exists to
// prevent: add a level to the panel, and the sweep would call every veteran who
// picked it "invalid" and quietly reset their answer to none.
const _MH_FREQUENCIES = ['less25', '25plus']; // the pair calculateMHRating branches on
const _mhDomainDefault = () => ({ level: 'none', frequency: 'less25' });
function _sweepMHDomains(conds, needsReview){
  if(typeof MH_DOMAINS === 'undefined' || typeof calculateMHRating !== 'function') return;
  if(typeof MH_IMPAIRMENT_LEVELS === 'undefined') return;
  const knownIds = new Set(MH_DOMAINS.map(d => d.id));
  (conds || []).forEach(cond => {
    if(!cond) return;
    if(!cond.domains) cond.domains = {};
    let orphaned = false;

    // Answers to questions that no longer exist.
    Object.keys(cond.domains).forEach(id => {
      if(!knownIds.has(id)){ delete cond.domains[id]; orphaned = true; return; }
      const d = cond.domains[id];
      if(!d || typeof d !== 'object'){
        cond.domains[id] = _mhDomainDefault();
        orphaned = true;
        return;
      }
      if(!MH_IMPAIRMENT_LEVELS.includes(d.level)){ d.level = 'none'; orphaned = true; }
      if(!_MH_FREQUENCIES.includes(d.frequency)){ d.frequency = 'less25'; orphaned = true; }
    });

    // Questions the save predates. Not a re-review item — the user was never
    // asked — but it must exist or the rating tab throws on render.
    MH_DOMAINS.forEach(d => {
      if(!cond.domains[d.id]) cond.domains[d.id] = _mhDomainDefault();
    });

    if(!orphaned) return;
    cond.calculatedRating = calculateMHRating(cond.domains);
    if(cond.manualOverride === null || cond.manualOverride === undefined){
      cond.effectiveRating = cond.calculatedRating;
    }
    if(!needsReview.includes(cond.condition)) needsReview.push(cond.condition);
  });
}

function _migrateState(state){
  const from = state.version || 1;
  if(from >= VACLAIM_VERSION) return [];
  const bpConds = state.bodyPartConditions || {};
  const needsReview = [];

  // v1 → v2: knee meniscus had DC 5258 and DC 5259 backwards (dislocation with
  // locking is the 20% code, symptomatic removal the 10%). The criteria are the
  // same, only the values were reversed — so swap them and the user's ANSWER
  // survives. Their % changes, because the old one was wrong (the recalculation
  // pass at the bottom of this function applies the new %).
  if(from < 2){
    (bpConds.knee || []).forEach(c => {
      if(!c || !c.domains) return;
      if(c.domains.meniscus === 10) c.domains.meniscus = 20;
      else if(c.domains.meniscus === 20) c.domains.meniscus = 10;
    });

    // GERD moved from DC 7346 symptom criteria to DC 7206 stricture criteria.
    // The old 10/30 answers share numeric values with the new scale but answer
    // a DIFFERENT question ("persistently recurrent symptoms" is not "stricture
    // requiring dilation"), so the leveled sweep below can't catch them — the
    // values still look valid. Clear them and flag for re-review, same as the
    // orphaned 60.
    (bpConds.systemic || []).forEach(c => {
      if(!c || !c.domains || c.profile !== 'gerd') return;
      if(c.domains.severity === 10 || c.domains.severity === 30){
        c.domains.severity = 0;
        if(!needsReview.includes(c.condition)) needsReview.push(c.condition);
      }
    });

  }

  // v2 → v3 (also applies to v1 files passing through)
  if(from < 3){
    // v2 introduced the new esophageal-stricture schedule, but its 50% wording
    // omitted dysphagia and its 80% wording treated the complication/treatment
    // list as alternatives. The corrected criteria require dysphagia at both
    // levels and require BOTH a qualifying complication and surgery/PEG at 80%.
    // Keeping either old answer would silently assert facts the veteran was
    // never asked to confirm, so clear and flag it for re-review.
    ['systemic','abdomen'].forEach(regionId => {
      (bpConds[regionId] || []).forEach(c => {
        if(!c || !c.domains || c.profile !== 'gerd') return;
        if(c.domains.severity === 50 || c.domains.severity === 80){
          c.domains.severity = 0;
          if(!needsReview.includes(c.condition)) needsReview.push(c.condition);
        }
      });
    });

    // Knee (DC 5055) and hip (DC 5054) replacement 100% criteria changed from
    // "within 1 year of surgery" to the current 4-month post-op window — every
    // v1 AND v2 build presented the 1-year wording. Same trap as GERD: 100 is
    // still a valid level, so an old "within a year" answer would silently
    // assert a 4-month criterion the veteran may no longer meet. Clear and
    // flag for re-review.
    (bpConds.knee || []).forEach(c => {
      if(!c || !c.domains || c.domains.replacement !== 100) return;
      c.domains.replacement = 0;
      if(!needsReview.includes(c.condition)) needsReview.push(c.condition);
    });
    (bpConds.hip || []).forEach(c => {
      if(!c || !c.domains || c.profile !== 'replacement' || c.domains.status !== 100) return;
      c.domains.status = 0;
      if(!needsReview.includes(c.condition)) needsReview.push(c.condition);
    });

    // Old builds saved custom-pin and CSV-imported records without the
    // customPin flag, so their panel-managed keys got them silently hidden
    // from the timeline, rating, exports, and statement. No code has ever
    // created a legitimate hidden "anchor" injury — every panel-keyed entry
    // in the injuries array is a real user record. Stamp them visible.
    if(typeof _getPanelKeys === 'function'){
      const _pk = _getPanelKeys();
      (state.injuries || []).forEach(i => {
        if(i && _pk.has(i.key) && !i.customPin) i.customPin = true;
      });
    }

    // Profile-map changes are invisible to the domain sweep: a condition keeps
    // the profile key derived from its name at CREATION, so when a picker name
    // is remapped ('Hip replacement (total)' rom→replacement, abdomen GERD
    // digestive→gerd) old records keep answering the wrong questionnaire —
    // and their stale domain values would still feed calcRating. Re-derive the
    // profile from the condition name; if it changed, the old answers belong
    // to another scale — clear and flag.
    if(typeof BP_REGISTRY !== 'undefined'){
      Object.entries(BP_REGISTRY).forEach(([regionId, cfg]) => {
        (bpConds[regionId] || []).forEach(c => {
          if(!c || !c.condition || !c.profile) return;
          const want = cfg.getProfileKey(c.condition);
          if(want && want !== c.profile){
            // DC 7203 and DC 7206 use the same stricture domain/value scale.
            // A v2 systemic hiatal-hernia answer was medically usable even
            // though the UI displayed the GERD code, so relabel it without
            // discarding the veteran's answer. Abdomen's old generic digestive
            // profile is not equivalent and still follows the clear/flag path.
            const equivalentHiatalScale = regionId === 'systemic' && c.profile === 'gerd' && want === 'hiatal';
            c.profile = want;
            if(equivalentHiatalScale) return;
            c.domains = {};
            if(!needsReview.includes(c.condition)) needsReview.push(c.condition);
          }
        });
      });
    }
  }

  // Sweep every panel for answers to questions that no longer exist. GERD's move
  // from DC 7346 (symptom severity) to DC 7206 (esophageal stricture) in v2 is
  // the case in point: the old 60% has no counterpart under criteria that ask
  // something different, and guessing a replacement would put words in the
  // veteran's mouth. Clear it and flag the condition so they can answer the new
  // question themselves. Left alone, an orphaned value highlights no button yet
  // still drives the rating.
  //
  // This runs for EVERY panel, not just the ones that changed this version — so
  // whoever next revises a rating scale gets the protection for free, as long as
  // they bump VACLAIM_VERSION.
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.entries(BP_REGISTRY).forEach(([regionId, cfg]) => {
      const profiles = cfg.profiles() || {};
      _sweepLeveledDomains(
        bpConds[regionId],
        cond => profiles[cond.profile] || profiles.generic,
        cond => cfg.calcRating(cond.domains),
        needsReview
      );
    });
  }
  // Head & face stores the same numeric domain values against the same
  // level-list shape, so it sweeps identically.
  if(typeof HEAD_PROFILES !== 'undefined' && typeof calculateHeadRating === 'function'){
    _sweepLeveledDomains(
      state.headConditions,
      cond => HEAD_PROFILES[cond.profile] || HEAD_PROFILES.generic,
      cond => calculateHeadRating(cond.domains),
      needsReview
    );
  }
  // Mental health is the odd one out: its domains hold {level, frequency} strings
  // rather than numbers, so an orphan looks different and needs its own check.
  _sweepMHDomains(state.mentalHealthConditions, needsReview);

  // Recalculate EVERY stored rating under the current calc functions. The
  // sweeps above only recompute conditions with orphaned values, but a
  // migration can change what a surviving value scores: the meniscus swap
  // changes the answer's %, and the v1 spine/neck calc folded radiculopathy
  // into the joint % that rating.js now ALSO emits as its own nerve line —
  // keeping the stored value would count the same nerve twice. Manual
  // overrides are the user's own judgment; leave effectiveRating to them.
  const _recalc = (conds, calc) => (conds || []).forEach(cond => {
    if(!cond || !cond.domains) return;
    cond.calculatedRating = calc(cond);
    if(cond.manualOverride === null || cond.manualOverride === undefined){
      cond.effectiveRating = cond.calculatedRating;
    }
  });
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.entries(BP_REGISTRY).forEach(([regionId, cfg]) => {
      _recalc(bpConds[regionId], cond => cfg.calcRating(cond.domains));
    });
  }
  if(typeof HEAD_PROFILES !== 'undefined' && typeof calculateHeadRating === 'function'){
    _recalc(state.headConditions, cond => calculateHeadRating(cond.domains));
  }
  if(typeof calculateMHRating === 'function'){
    _recalc(state.mentalHealthConditions, cond => calculateMHRating(cond.domains));
  }

  state.version = VACLAIM_VERSION;
  return needsReview;
}

// ── STATE RESTORATION ──

const _RESTORE_SEVERITIES = new Set(['mild','moderate','severe','custom']);
const _RESTORE_EXTREMITIES = new Set(['none','LU','RU','LL','RL']);
const _RESTORE_RAD_SIDES = new Set(['','LU','RU','LL','RL','both']);

function _isRestoreRecord(value){
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function _restoreString(value){
  return typeof value === 'string' ? value : '';
}

function _restoreDisplayText(value){
  // Condition names are rendered as text by several legacy innerHTML builders.
  // They originate from fixed picker lists, so angle brackets are never valid
  // data; neutralize them here as a backstop for shared/tampered project files.
  return _restoreString(value).replace(/</g, '‹').replace(/>/g, '›');
}

function _restoreDate(value){
  const date = _restoreString(value);
  // Main-era CSV imports persisted the raw cell, including M/D/YYYY and
  // "Month D, YYYY". Reuse the importer's coercion before enforcing the ISO
  // shape required by <input type=date> and timeline year grouping.
  const normalized = typeof normDate === 'function' ? normDate(date) : date;
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : '';
}

function _restoreNumber(value, fallback){
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function _restoreRating(value, fallback){
  return Math.max(0, Math.min(100, _restoreNumber(value, fallback)));
}

function _restoreStringList(value){
  return Array.isArray(value) ? value.filter(v => typeof v === 'string') : [];
}

function _restoreNumberMap(value){
  const out = {};
  if(!_isRestoreRecord(value)) return out;
  Object.entries(value).forEach(([key, raw]) => {
    const n = _restoreNumber(raw, NaN);
    if(Number.isFinite(n)) out[key] = Math.max(0, Math.min(100, n));
  });
  return out;
}

function _restoreStringMap(value){
  const out = {};
  if(!_isRestoreRecord(value)) return out;
  Object.entries(value).forEach(([key, raw]) => {
    if(typeof raw === 'string') out[key] = raw;
  });
  return out;
}

function _restoreNumericDomains(value){
  const out = {};
  if(!_isRestoreRecord(value)) return out;
  Object.entries(value).forEach(([key, raw]) => {
    if(!/^[A-Za-z0-9_-]{1,64}$/.test(key)) return;
    const n = _restoreNumber(raw, NaN);
    if(Number.isFinite(n)) out[key] = n;
  });
  return out;
}

function _restoreMentalDomains(value){
  const source = _isRestoreRecord(value) ? value : {};
  const out = {};
  if(typeof MH_DOMAINS === 'undefined') return out;
  const levels = typeof MH_IMPAIRMENT_LEVELS !== 'undefined' ? MH_IMPAIRMENT_LEVELS : [];
  MH_DOMAINS.forEach(domain => {
    const raw = _isRestoreRecord(source[domain.id]) ? source[domain.id] : {};
    out[domain.id] = {
      level: levels.includes(raw.level) ? raw.level : 'none',
      frequency: _MH_FREQUENCIES.includes(raw.frequency) ? raw.frequency : 'less25',
    };
  });
  return out;
}

function _restorePin(value){
  if(!_isRestoreRecord(value)) return null;
  const x = _restoreNumber(value.x, NaN);
  const y = _restoreNumber(value.y, NaN);
  if(!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return {
    ...value,
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
    side: value.side === 'back' ? 'back' : 'front',
    body: value.body === 'female' ? 'female' : 'male',
    key: _restoreString(value.key),
    label: _restoreString(value.label),
  };
}

function _makeRestoreIdAllocator(lists){
  const reserved = new Set();
  lists.forEach(list => (Array.isArray(list) ? list : []).forEach(record => {
    if(!_isRestoreRecord(record)) return;
    const n = typeof record.id === 'number' ? record.id :
      (typeof record.id === 'string' && /^\d+$/.test(record.id) ? Number(record.id) : NaN);
    if(Number.isFinite(n) && n > 0) reserved.add(n);
  }));
  const used = new Set();
  let nextId = 1;
  return function(rawId){
    const n = typeof rawId === 'number' ? rawId :
      (typeof rawId === 'string' && /^\d+$/.test(rawId) ? Number(rawId) : NaN);
    if(Number.isFinite(n) && n > 0 && !used.has(n)){
      used.add(n);
      return n;
    }
    while(reserved.has(nextId) || used.has(nextId)) nextId++;
    const id = nextId++;
    used.add(id);
    return id;
  };
}

function _restoreCommonRecord(raw, id){
  const record = { ...raw, id };
  record.date = _restoreDate(raw.date);
  record.location = _restoreString(raw.location);
  record.event = _restoreString(raw.event);
  record.description = _restoreString(raw.description);
  record.medicalCare = raw.medicalCare === 'yes' ? 'yes' : (raw.medicalCare === 'no' ? 'no' : '');
  record.clinicName = _restoreString(raw.clinicName);
  record.witnesses = _restoreString(raw.witnesses);
  record.stillBeingSeen = !!raw.stillBeingSeen;
  record.secondaries = _restoreStringList(raw.secondaries);
  record.secondaryRatings = _restoreNumberMap(raw.secondaryRatings);
  record._secondaryRatings = _restoreNumberMap(raw._secondaryRatings);
  record.secondaryExtremities = _restoreStringMap(raw.secondaryExtremities);
  record.pin = _restorePin(raw.pin);
  return record;
}

function _restoreInjury(raw, id){
  const record = _restoreCommonRecord(raw, id);
  record.label = _restoreString(raw.label);
  record.key = _restoreString(raw.key);
  record.severity = _RESTORE_SEVERITIES.has(raw.severity) ? raw.severity : 'custom';
  record.functionalImpacts = _restoreStringList(raw.functionalImpacts);
  record.customPin = !!raw.customPin;
  if(raw._assignedRating !== undefined) record._assignedRating = _restoreRating(raw._assignedRating, 0);
  return record;
}

function _restoreCondition(raw, id, domainKind){
  const record = _restoreCommonRecord(raw, id);
  record.condition = _restoreDisplayText(raw.condition) || 'Unknown condition';
  record.domains = domainKind === 'mental' ? _restoreMentalDomains(raw.domains) : _restoreNumericDomains(raw.domains);
  record.calculatedRating = _restoreRating(raw.calculatedRating, 0);
  record.manualOverride = raw.manualOverride === null || raw.manualOverride === undefined
    ? null : _restoreRating(raw.manualOverride, 0);
  record.effectiveRating = record.manualOverride === null
    ? _restoreRating(raw.effectiveRating, record.calculatedRating)
    : record.manualOverride;
  record.extremity = _RESTORE_EXTREMITIES.has(raw.extremity) ? raw.extremity : 'none';
  record.sideLabel = _restoreDisplayText(raw.sideLabel);
  record.profile = _restoreString(raw.profile);
  record.radSide = _RESTORE_RAD_SIDES.has(raw.radSide) ? raw.radSide : '';
  record.bilateralLinked = !!raw.bilateralLinked;
  record.bilateralSource = !!raw.bilateralSource;
  const pairId = Number(raw.bilateralPairId);
  record.bilateralPairId = Number.isFinite(pairId) && pairId > 0 ? pairId : null;
  record._committed = !!raw._committed;
  record._wasCommitted = !!raw._wasCommitted;
  return record;
}

function _prepareRestoredState(input){
  const state = _isRestoreRecord(input) ? input : {};
  state.version = Number.isSafeInteger(Number(state.version)) ? Number(state.version) : 1;
  state.injuries = (Array.isArray(state.injuries) ? state.injuries : []).filter(_isRestoreRecord);
  state.mentalHealthConditions = (Array.isArray(state.mentalHealthConditions) ? state.mentalHealthConditions : [])
    .filter(_isRestoreRecord)
    .map(record => ({ ...record, condition: _restoreString(record.condition), domains: _isRestoreRecord(record.domains) ? record.domains : {} }));
  state.headConditions = (Array.isArray(state.headConditions) ? state.headConditions : [])
    .filter(_isRestoreRecord)
    .map(record => ({ ...record, condition: _restoreString(record.condition), profile: _restoreString(record.profile), domains: _isRestoreRecord(record.domains) ? record.domains : {} }));
  const sourceBodyParts = _isRestoreRecord(state.bodyPartConditions) ? state.bodyPartConditions : {};
  state.bodyPartConditions = {};
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.keys(BP_REGISTRY).forEach(regionId => {
      state.bodyPartConditions[regionId] = (Array.isArray(sourceBodyParts[regionId]) ? sourceBodyParts[regionId] : [])
        .filter(_isRestoreRecord)
        .map(record => ({ ...record, condition: _restoreString(record.condition), profile: _restoreString(record.profile), domains: _isRestoreRecord(record.domains) ? record.domains : {} }));
    });
  }
  return state;
}

function _restoreMSTData(value){
  const source = _isRestoreRecord(value) ? value : {};
  const evidence = {};
  if(_isRestoreRecord(source.evidence)){
    Object.entries(source.evidence).forEach(([key, selected]) => {
      if(/^[A-Za-z0-9_-]{1,64}$/.test(key)) evidence[key] = !!selected;
    });
  }
  const conditions = (Array.isArray(source.conditions) ? source.conditions : [])
    .filter(_isRestoreRecord)
    .map(condition => ({
      name: _restoreDisplayText(condition.name) || 'Unknown condition',
      rating: _restoreRating(condition.rating, 0),
      secondaries: (Array.isArray(condition.secondaries) ? condition.secondaries : [])
        .filter(_isRestoreRecord)
        .map(secondary => ({
          name: _restoreDisplayText(secondary.name) || 'Unknown secondary',
          rating: _restoreRating(secondary.rating, 0),
        })),
    }));
  return {
    privacyShield: source.privacyShield !== false,
    conditions,
    notes: _restoreDisplayText(source.notes),
    evidence,
  };
}

function _normalizeRestoredState(input){
  const state = _isRestoreRecord(input) ? input : {};
  state.version = Number.isSafeInteger(Number(state.version)) ? Number(state.version) : 1;
  state.savedAt = _restoreString(state.savedAt);
  state.userId = _restoreString(state.userId);
  state.personalStatement = _restoreString(state.personalStatement);

  const rawInjuries = Array.isArray(state.injuries) ? state.injuries : [];
  const nextInjuryId = _makeRestoreIdAllocator([rawInjuries]);
  state.injuries = rawInjuries
    .filter(_isRestoreRecord)
    .map(raw => _restoreInjury(raw, nextInjuryId(raw.id)));

  const bodyPartConditions = _isRestoreRecord(state.bodyPartConditions) ? state.bodyPartConditions : {};
  const rawMental = Array.isArray(state.mentalHealthConditions) ? state.mentalHealthConditions : [];
  const rawHead = Array.isArray(state.headConditions) ? state.headConditions : [];
  const rawBodyLists = [];
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.keys(BP_REGISTRY).forEach(regionId => {
      rawBodyLists.push(Array.isArray(bodyPartConditions[regionId]) ? bodyPartConditions[regionId] : []);
    });
  }
  const nextConditionId = _makeRestoreIdAllocator([rawMental, rawHead, ...rawBodyLists]);
  state.mentalHealthConditions = rawMental
    .filter(_isRestoreRecord)
    .map(raw => _restoreCondition(raw, nextConditionId(raw.id), 'mental'));
  state.headConditions = rawHead
    .filter(_isRestoreRecord)
    .map(raw => {
      const record = _restoreCondition(raw, nextConditionId(raw.id), 'numeric');
      if(typeof HEAD_PROFILES !== 'undefined' && !HEAD_PROFILES[record.profile]) record.profile = 'generic';
      return record;
    });

  state.bodyPartConditions = {};
  if(typeof BP_REGISTRY !== 'undefined'){
    Object.entries(BP_REGISTRY).forEach(([regionId, cfg], index) => {
      const profiles = cfg.profiles() || {};
      state.bodyPartConditions[regionId] = rawBodyLists[index]
        .filter(_isRestoreRecord)
        .map(raw => {
          const record = _restoreCondition(raw, nextConditionId(raw.id), 'numeric');
          if(!profiles[record.profile]) record.profile = cfg.getProfileKey(record.condition) || 'generic';
          if(!profiles[record.profile]) record.profile = profiles.generic ? 'generic' : Object.keys(profiles)[0];
          const allowedSides = new Set(Object.values(cfg.sideKeys || {}));
          if(record.sideLabel && !allowedSides.has(record.sideLabel)) record.sideLabel = '';
          return record;
        });
    });
  }

  state.vocSecondaries = _restoreStringList(state.vocSecondaries);
  state.vocNotes = _restoreString(state.vocNotes);
  state.specialClaims = _isRestoreRecord(state.specialClaims) ? state.specialClaims : {};
  state.smcSelections = _restoreStringList(state.smcSelections);
  state.presumptiveData = _isRestoreRecord(state.presumptiveData) ? state.presumptiveData : {};
  state.mstData = _restoreMSTData(state.mstData);
  state.mapView = _isRestoreRecord(state.mapView) ? {
    side: state.mapView.side === 'back' ? 'back' : 'front',
    body: state.mapView.body === 'female' ? 'female' : 'male',
  } : { side: 'front', body: 'male' };
  return state;
}

function _restoreAllState(state){
  // First make only the container shapes safe enough for migration. Full
  // normalization happens afterwards so migration can still detect orphaned
  // answers and tell the veteran which conditions require re-review.
  state = _prepareRestoredState(state);
  const needsReview = _migrateState(state);
  state = _normalizeRestoredState(state);
  if(needsReview.length){
    // Don't let a rating criteria change quietly rewrite someone's claim.
    setTimeout(() => _showToast(
      'Rating criteria changed — please re-answer: ' + needsReview.join(', '),
      '#c2410c'
    ), 600);
  }
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

  // Personal statement — rich HTML rendered into the contenteditable editor
  // and the report window. Sanitize on restore so markup smuggled into a save
  // file can't execute in the app when the statement tab renders.
  window._personalStatement = typeof _sanitizeRichHTML === 'function'
    ? _sanitizeRichHTML(state.personalStatement || '')
    : (state.personalStatement || '');

  // Vocational
  window._vocSecondaries = state.vocSecondaries || [];
  window._vocNotes = state.vocNotes || '';

  // Special claims
  window._specialClaims = state.specialClaims || {};
  window._smcSelections = state.smcSelections || [];
  window._presumptiveData = state.presumptiveData || {};
  // Legacy saves (pre-MST) have no mstData — use the safe default shape,
  // never null (renderSpecial dereferences .privacyShield/.conditions)
  window._mstData = state.mstData || { privacyShield: true, conditions: [], notes: '', evidence: {} };

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
    const _cid = Number(cond.id); // ids reach onclick markup — never trust a loaded file's shape
    if(!Number.isFinite(_cid)) return;
    const pinId = 'pin-cond-' + _cid;
    const existing = document.getElementById(pinId);
    if(existing) existing.remove();
    const p = document.createElement('div');
    p.className = 'pin pin-single';
    p.id = pinId;
    p.style.left = x + '%';
    p.style.top = y + '%';
    const label = cond.condition || cond.label || '';
    const _pe = typeof escapeHTML === 'function' ? escapeHTML : (s => s);
    p.innerHTML = '<div class="pin-head"><span class="pin-num" style="font-size:7px;">&#9733;</span></div>' +
      '<div class="pin-tip">' + _pe(label) + '</div>' +
      '<button class="pin-del" onclick="_removeCondPin(' + _cid + ',event)" title="Remove">&times;</button>';
    layer.appendChild(p);
    if(typeof _makeCondPinDraggable === 'function') _makeCondPinDraggable(p, cond);
  });

  if(typeof refreshPinNumbers === 'function') refreshPinNumbers();
}

// ── TOAST HELPER ──

function _showToast(message, color){
  const toast = document.createElement('div');
  // Save/load/migration feedback is often the only confirmation the user gets,
  // so it has to reach screen readers too — a bare styled div announces nothing.
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:'+(color||'#059669')+';color:#fff;padding:12px 24px;border-radius:8px;font-family:var(--fh);font-size:14px;font-weight:700;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.2);max-width:min(90vw,520px);text-align:center;';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
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
          <button onclick="_doSave()" id="save-project-btn" style="padding:8px 20px;border:none;border-radius:6px;background:var(--navy);color:#fff;cursor:pointer;font-family:var(--fh);font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;">Save &amp; Download</button>
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

  // NOTE: 'save-project-btn', not 'save-btn' — the injury form in index.html
  // owns id="save-btn" and getElementById would return that one instead
  const btn = document.getElementById('save-project-btn');
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
    _showToast('Project saved. Keep the file and password safe.');
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
    const savedDate = typeof state.savedAt === 'string' && /^\d{4}-\d{2}-\d{2}/.test(state.savedAt)
      ? state.savedAt.slice(0, 10) : 'unknown date';
    if(!confirm('Load project saved on ' + savedDate + '?\n\nThis will replace all current work.')){
      return;
    }

    _restoreAllState(state);
    closeLoadModal();
    _showToast('Project loaded successfully');

  } catch(e){
    errEl.textContent = 'Failed to load: ' + e.message;
    errEl.style.display = 'block';
  } finally {
    btn.textContent = 'Open & Load';
    btn.disabled = false;
  }
}

// ── UNSAVED WORK WARNING ──
// _isStateEmpty covers everything the app persists: injuries, MH/head/body-part
// panels, MST, special claims, SMC, presumptives, vocational, personal statement.

window.addEventListener('beforeunload', function(e){
  // The sign-out modal (server-injected, sets window.__signingOut on submit)
  // already warns that local data will be erased — a second native "Leave site?"
  // dialog on top of it lets the user cancel a sign-out they just confirmed.
  if(window.__signingOut) return;
  if(!_isStateEmpty()){
    e.preventDefault();
    e.returnValue = '';
  }
});
