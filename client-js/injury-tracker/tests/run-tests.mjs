#!/usr/bin/env node
// Dependency-free fixture tests for the ENDEX tracker's save migration and
// injury-visibility rules. The tracker files are plain browser scripts, so we
// load them (in index.html order) into a vm sandbox with minimal DOM stubs.
//
//   node client-js/injury-tracker/tests/run-tests.mjs   (or: npm run test:tracker)
//
// Covers the v1/v2 → v3 migration (_migrateState), injury visibility, rating
// routing, restore normalization, timeline interpolation, and rating profiles.
// DOMParser-based sanitizer behavior and interactive flows still need a browser
// smoke test.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const JS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'js');
// Subset of index.html's script order needed by the logic under test
const FILES = ['data.js', 'map.js', 'bodypart.js', 'secondary.js', 'timeline.js', 'rating.js', 'import.js', 'save.js'];

// ── Sandbox with minimal browser stubs ──────────────────────────────────────
const el = () => ({
  innerHTML: '', textContent: '',
  style: {}, classList: { add() {}, remove() {}, toggle() {} },
  setAttribute() {}, appendChild() {}, remove() {}, addEventListener() {},
  querySelector: () => null, querySelectorAll: () => [],
});
const elements = new Map();
const sandbox = {
  window: { addEventListener() {}, scrollY: 0, scrollTo() {} },
  document: {
    getElementById: (id) => elements.get(id) || null,
    addEventListener() {},
    createElement: el,
    querySelectorAll: () => [],
    body: el(),
  },
  console, setTimeout, clearTimeout,
  navigator: {},
  alert() {}, confirm: () => true,
  renderGapBar: () => '',
  crypto: { getRandomValues: (a) => a, subtle: {} },
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// Top-level const/let in a vm script are lexical (not attached to the global),
// so bundle every file plus an export epilogue into ONE script.
const bundle = FILES.map((f) => fs.readFileSync(path.join(JS_DIR, f), 'utf8')).join('\n;\n');
const epilogue = `
;__exports.migrateState = _migrateState;
__exports.nonPanelInjuries = _nonPanelInjuries;
__exports.escapeHTML = escapeHTML;
__exports.VACLAIM_VERSION = VACLAIM_VERSION;
__exports.calculateKneeRating = calculateKneeRating;
__exports.calculateSpineRating = calculateSpineRating;
__exports.normalizeRestoredState = _normalizeRestoredState;
function __resetFixture(primary, mental){
  injuries = primary || [];
  window._mentalHealthConditions = mental || [];
  window._headConditions = [];
  window._mstData = { privacyShield: true, conditions: [], notes: '', evidence: {} };
  window._specialClaims = {};
  window._smcSelections = [];
  window._presumptiveData = {};
  Object.values(BP_REGISTRY).forEach(cfg => { window[cfg.stateKey] = []; });
}
__exports.prepareMigrateNormalize = function(state){
  const prepared = _prepareRestoredState(state);
  const review = _migrateState(prepared);
  return { state:_normalizeRestoredState(prepared), review };
};
__exports.ratingItemsFor = function(primary, mental){
  __resetFixture(primary, mental);
  buildRatingItems();
  return _ratingItems.map(item => ({ id:item.id, name:item.name, rating:item.rating, type:item.type }));
};
__exports.timelineHTMLFor = function(primary, bodyParts){
  __resetFixture(primary, []);
  Object.entries(bodyParts || {}).forEach(([regionId, records]) => {
    window[BP_REGISTRY[regionId].stateKey] = records;
  });
  renderTimeline();
  return document.getElementById('tl-list').innerHTML;
};
__exports.ratingHTMLFor = function(primary){
  __resetFixture(primary, []);
  renderRating();
  return document.getElementById('rc-list').innerHTML;
};
__exports.secondaryHTMLFor = function(primary){
  __resetFixture(primary, []);
  renderSecondary();
  return document.getElementById('sc-list').innerHTML;
};
__exports.pendingSecondaryHTMLFor = function(name){
  return renderPendingSecEval('inj-1', {
    pendingSec:name,
    pendingSecProfile:{ type:'physical' },
    pendingDomains:{},
  });
};
__exports.kneeReplacementLevels = KNEE_PROFILES.replacement.domains[0].levels;
__exports.gerdProfiles = GERD_PROFILES;
__exports.abdomenProfileKey = getAbdomenProfileKey;
__exports.visionLevels = HEAD_PROFILES.vision.domains[0].levels;
`;
sandbox.__exports = {};
vm.runInContext(bundle + epilogue, sandbox, { filename: 'tracker-bundle.js' });
const T = sandbox.__exports;

// ── Tiny runner ─────────────────────────────────────────────────────────────
let passed = 0;
const failures = [];
function test(name, fn) {
  try { fn(); passed++; console.log('  ok   ' + name); }
  catch (e) { failures.push(name); console.error('  FAIL ' + name + '\n       ' + e.message); }
}
function eq(actual, expected, what) {
  if (actual !== expected) {
    throw new Error((what || 'value') + ': expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
  }
}

// Fixture helper — a minimal body-part condition as bodypart.js creates them
function cond(name, profile, domains, rating) {
  return {
    id: 1, condition: name, profile, domains,
    calculatedRating: rating, effectiveRating: rating, manualOverride: null,
  };
}

console.log('migration: v1 → v3');

test('meniscus 10 swaps to 20 and the rating is recalculated', () => {
  const c = cond('Meniscus tear', 'meniscus', { meniscus: 10 }, 10);
  const state = { version: 1, bodyPartConditions: { knee: [c] } };
  T.migrateState(state);
  eq(c.domains.meniscus, 20, 'domain value');
  eq(c.calculatedRating, T.calculateKneeRating({ meniscus: 20 }), 'calculatedRating');
  eq(c.effectiveRating, c.calculatedRating, 'effectiveRating');
  eq(state.version, T.VACLAIM_VERSION, 'state.version');
});

test('v1 spine rating no longer includes radiculopathy (double-count fix)', () => {
  // v1 stored the all-domain max, so radiculopathy 40 → spine 40. The nerve is
  // now its own line item; the stored spine % must drop it on migration.
  const c = cond('Lumbar radiculopathy / sciatica', 'thoracolumbar', { radiculopathy: 40 }, 40);
  const state = { version: 1, bodyPartConditions: { back: [c] } };
  T.migrateState(state);
  eq(c.domains.radiculopathy, 40, 'radiculopathy answer survives');
  eq(c.calculatedRating, T.calculateSpineRating(c.domains), 'calculatedRating');
  eq(c.calculatedRating, 0, 'spine % excludes radiculopathy');
});

test('v1 GERD 10/30 (old DC 7346 answers) are cleared and flagged', () => {
  const c = cond('GERD / acid reflux', 'gerd', { severity: 30 }, 30);
  const state = { version: 1, bodyPartConditions: { systemic: [c] } };
  const review = T.migrateState(state);
  eq(c.domains.severity, 0, 'severity cleared');
  eq(c.calculatedRating, 0, 'rating recalculated');
  eq(review.includes('GERD / acid reflux'), true, 'flagged for re-review');
});

test('v1 knee replacement 100% (old 1-year criterion) is cleared and flagged', () => {
  const c = cond('Knee replacement (total)', 'replacement', { replacement: 100 }, 100);
  const state = { version: 1, bodyPartConditions: { knee: [c] } };
  const review = T.migrateState(state);
  eq(c.domains.replacement, 0, 'answer cleared');
  eq(review.includes('Knee replacement (total)'), true, 'flagged');
});

test('v1 hip replacement stored on the rom profile is remapped and cleared', () => {
  const c = cond('Hip replacement (total)', 'rom', { flexion: 20, extension: 10 }, 28);
  const state = { version: 1, bodyPartConditions: { hip: [c] } };
  const review = T.migrateState(state);
  eq(c.profile, 'replacement', 'profile re-derived');
  eq(Object.keys(c.domains).length, 0, 'old-scale answers cleared');
  eq(c.calculatedRating, 0, 'rating recalculated');
  eq(review.includes('Hip replacement (total)'), true, 'flagged');
});

test('v1 abdomen GERD on the generic digestive profile is remapped and cleared', () => {
  const c = cond('GERD / acid reflux', 'digestive', { severity: 60, frequency: 20 }, 60);
  const state = { version: 1, bodyPartConditions: { abdomen: [c] } };
  const review = T.migrateState(state);
  eq(c.profile, 'gerd', 'profile re-derived to DC 7206');
  eq(Object.keys(c.domains).length, 0, 'old-scale answers cleared');
  eq(review.includes('GERD / acid reflux'), true, 'flagged');
});

console.log('migration: v2 → v3');

test('v2 meniscus values are NOT swapped again, but ratings are recalculated', () => {
  // The defective v2 build swapped values but kept the stale rating (10)
  const c = cond('Meniscus tear', 'meniscus', { meniscus: 20 }, 10);
  const state = { version: 2, bodyPartConditions: { knee: [c] } };
  T.migrateState(state);
  eq(c.domains.meniscus, 20, 'no double swap');
  eq(c.calculatedRating, T.calculateKneeRating({ meniscus: 20 }), 'stale rating fixed');
});

test('v2 GERD 10/30 answers (given under the new criteria) are kept', () => {
  const c = cond('GERD / acid reflux', 'gerd', { severity: 30 }, 30);
  const state = { version: 2, bodyPartConditions: { systemic: [c] } };
  T.migrateState(state);
  eq(c.domains.severity, 30, 'new-scale answer survives');
});

test('v2 GERD 50/80 answers given under looser wording are cleared and flagged', () => {
  [50, 80].forEach(value => {
    const c = cond('GERD / acid reflux', 'gerd', { severity:value }, value);
    const state = { version:2, bodyPartConditions:{ systemic:[c] } };
    const review = T.migrateState(state);
    eq(c.domains.severity, 0, value + '% answer cleared');
    eq(review.includes('GERD / acid reflux'), true, value + '% answer flagged');
  });
});

test('v2 systemic hiatal answers are relabeled to DC 7203 without being cleared', () => {
  const c = cond('Hiatal hernia', 'gerd', { severity: 30 }, 30);
  const state = { version: 2, bodyPartConditions: { systemic: [c] } };
  const review = T.migrateState(state);
  eq(c.profile, 'hiatal', 'profile corrected');
  eq(c.domains.severity, 30, 'equivalent stricture answer survives');
  eq(review.includes('Hiatal hernia'), false, 'no unnecessary re-review');
});

test('v2 hip replacement 100% is still cleared (v2 build also said 1 year)', () => {
  const c = cond('Hip replacement (total)', 'replacement', { status: 100 }, 100);
  const state = { version: 2, bodyPartConditions: { hip: [c] } };
  const review = T.migrateState(state);
  eq(c.domains.status, 0, 'answer cleared');
  eq(review.includes('Hip replacement (total)'), true, 'flagged');
});

test('legacy panel-keyed injuries are stamped visible (custom-pin/import records)', () => {
  const inj = { id: 5, key: 'knee', label: 'Knee strain', date: '2024-01-01' };
  const plain = { id: 6, key: 'other', label: 'Scar', date: '2024-01-02' };
  const state = { version: 2, injuries: [inj, plain], bodyPartConditions: {} };
  T.migrateState(state);
  eq(inj.customPin, true, 'panel-keyed record stamped');
  eq(plain.customPin, undefined, 'non-panel record untouched');
  const visible = T.nonPanelInjuries(state.injuries);
  eq(visible.length, 2, 'both visible after migration');
});

console.log('migration: v3 no-op');

test('v3 files are returned untouched', () => {
  const c = cond('Meniscus tear', 'meniscus', { meniscus: 20 }, 999); // sentinel rating
  const inj = { id: 5, key: 'knee', label: 'X' };
  const state = { version: 3, injuries: [inj], bodyPartConditions: { knee: [c] } };
  const review = T.migrateState(state);
  eq(review.length, 0, 'no re-review items');
  eq(c.calculatedRating, 999, 'no recalc on current-version files');
  eq(inj.customPin, undefined, 'no stamping on current-version files');
});

console.log('visibility & escaping');

test('_nonPanelInjuries hides panel anchors but keeps customPin records', () => {
  const list = [
    { id: 1, key: 'knee', label: 'hidden anchor' },
    { id: 2, key: 'knee', label: 'custom pin', customPin: true },
    { id: 3, key: 'other', label: 'ordinary' },
  ];
  const visible = T.nonPanelInjuries(list).map((i) => i.id);
  eq(JSON.stringify(visible), JSON.stringify([2, 3]), 'visible ids');
});

test("escapeHTML escapes &, <, >, \", ' and coerces null", () => {
  eq(T.escapeHTML('a"b\'c<d>e&f'), 'a&quot;b&#39;c&lt;d&gt;e&amp;f', 'all five chars');
  eq(T.escapeHTML(null), '', 'null');
});

console.log('rating routing & restore hardening');

test('custom-pin mental diagnoses collapse into one highest MH rating', () => {
  const items = T.ratingItemsFor([
    { id: 11, key: 'mental', label: 'Posttraumatic stress disorder', customPin: true, _assignedRating: 50 },
    { id: 12, key: 'mental', label: 'Major depressive disorder', customPin: true, _assignedRating: 30 },
  ], []);
  eq(items.length, 1, 'rating item count');
  eq(items[0].type, 'mental', 'rating item type');
  eq(items[0].rating, 50, 'single highest rating');
  eq(items[0].id, 'mh-pin-11', 'winning custom pin id');
});

test('custom-pin and panel copies of a mental diagnosis do not double-count', () => {
  const panel = {
    id: 21, condition: 'Posttraumatic stress disorder', domains: {},
    calculatedRating: 30, effectiveRating: 30, manualOverride: 30,
  };
  const items = T.ratingItemsFor([
    { id: 22, key: 'mental', label: 'Posttraumatic stress disorder', customPin: true, _assignedRating: 50 },
  ], [panel]);
  eq(items.length, 1, 'rating item count');
  eq(items[0].type, 'mental', 'rating item type');
  eq(items[0].rating, 50, 'single highest rating');
});

test('restore normalization constrains ids, severity, dates, and condition text', () => {
  const state = {
    version: 3,
    injuries: [{ id:'1);alert(1);//', label:'Knee', severity:'custom\"><img src=x>', date:'not-a-date' }],
    mentalHealthConditions: [{ id:'bad', condition:'<img src=x onerror=alert(1)>', domains:{} }],
    headConditions: [],
    bodyPartConditions: { knee: [{ id:'bad', condition:'Knee bursitis', profile:'generic', domains:{severity:20} }] },
  };
  T.normalizeRestoredState(state);
  eq(Number.isSafeInteger(state.injuries[0].id), true, 'injury id');
  eq(state.injuries[0].severity, 'custom', 'severity enum');
  eq(state.injuries[0].date, '', 'invalid date cleared');
  eq(state.mentalHealthConditions[0].condition.includes('<'), false, 'condition markup neutralized');
  const conditionIds = [state.mentalHealthConditions[0].id, state.bodyPartConditions.knee[0].id];
  eq(new Set(conditionIds).size, 2, 'condition ids globally unique');
  eq(conditionIds.every(Number.isSafeInteger), true, 'condition ids numeric');
});

test('restore preserves fractional body-part ids, bilateral pairs, and radSide both', () => {
  const leftId = 1700000000000.25;
  const rightId = 1700000000000.75;
  const state = {
    version:3,
    bodyPartConditions:{ back:[
      {
        id:leftId, condition:'Lumbar radiculopathy / sciatica', profile:'thoracolumbar',
        domains:{radiculopathy:40}, calculatedRating:0, effectiveRating:0,
        extremity:'LL', sideLabel:'', radSide:'both', bilateralLinked:true,
        bilateralPairId:rightId,
      },
      {
        id:rightId, condition:'Lumbar radiculopathy / sciatica', profile:'thoracolumbar',
        domains:{radiculopathy:40}, calculatedRating:0, effectiveRating:0,
        extremity:'RL', sideLabel:'', radSide:'RL', bilateralLinked:true,
        bilateralPairId:leftId,
      },
    ]},
  };
  T.normalizeRestoredState(state);
  const [left, right] = state.bodyPartConditions.back;
  eq(left.id, leftId, 'left fractional id');
  eq(right.id, rightId, 'right fractional id');
  eq(left.bilateralPairId, rightId, 'left pair reference');
  eq(right.bilateralPairId, leftId, 'right pair reference');
  eq(left.radSide, 'both', 'bilateral nerve side');
});

test('restore normalizes legacy main-era CSV date formats without data loss', () => {
  const state = {
    version:3,
    injuries:[
      {id:1, label:'A', date:'6/12/2019'},
      {id:2, label:'B', date:'July 7, 2026'},
      {id:3, label:'C', date:'not a date'},
    ],
  };
  T.normalizeRestoredState(state);
  eq(state.injuries[0].date, '2019-06-12', 'slash date');
  eq(state.injuries[1].date, '2026-07-07', 'month-name date');
  eq(state.injuries[2].date, '', 'unparseable date');
});

test('restore pipeline preserves migration re-review detection before normalization', () => {
  const c = cond('Major depressive disorder', '', {
    cognition: { level:'removed-level', frequency:'invalid-frequency' },
  }, 70);
  const result = T.prepareMigrateNormalize({ version:1, mentalHealthConditions:[c], bodyPartConditions:{} });
  eq(result.review.includes('Major depressive disorder'), true, 'orphaned answer flagged');
  eq(result.state.mentalHealthConditions[0].domains.cognition.level, 'none', 'invalid level cleared');
  eq(result.state.mentalHealthConditions[0].domains.cognition.frequency, 'less25', 'invalid frequency cleared');
});

test('timeline interpolation rejects malicious severity and handler ids', () => {
  elements.set('tl-list', el());
  const html = T.timelineHTMLFor([{
    id:'1);alert(1);//', key:'other', label:'Safe label', date:'2024-01-01',
    severity:'custom\"><img src=x onerror=alert(1)>', customPin:true,
  }]);
  eq(html.includes('<img'), false, 'no injected element');
  eq(html.includes('class="ic custom"'), true, 'severity fell back to custom');
  eq(html.includes('editInjury(0)'), true, 'handler id fell back to safe integer');
  eq(html.includes('editInjury(1);alert'), false, 'raw handler payload absent');
});

test('timeline actions preserve finite fractional body-part ids', () => {
  elements.set('tl-list', el());
  const id = 1700000000000.5;
  const html = T.timelineHTMLFor([], { knee:[{
    id, condition:'Knee bursitis', date:'2024-02-03', effectiveRating:20,
    domains:{severity:20}, profile:'generic', secondaries:[],
  }] });
  eq(html.includes("deleteEvalFromTimeline('knee'," + id + ')'), true, 'fractional delete id');
  eq(html.includes("deleteEvalFromTimeline('knee',0)"), false, 'not coerced to zero');
});

test('rating and secondary renderers escape restored labels and secondary names', () => {
  const primary = [{
    id:41, key:'other', customPin:true, date:'2024-01-01', severity:'mild',
    label:'<img src=x onerror=alert(1)>',
    secondaries:['<svg onload=alert(2)>'],
    secondaryRatings:{'<svg onload=alert(2)>':30},
  }];
  elements.set('rc-list', el());
  elements.set('rc-tab', el());
  const ratingHTML = T.ratingHTMLFor(primary);
  eq(ratingHTML.includes('<img'), false, 'rating primary escaped');
  eq(ratingHTML.includes('<svg'), false, 'rating secondary escaped');
  eq(ratingHTML.includes('&lt;img'), true, 'rating retains safe text');

  elements.set('sc-list', el());
  elements.set('sc-tab', el());
  const secondaryHTML = T.secondaryHTMLFor(primary);
  eq(secondaryHTML.includes('<img'), false, 'secondary primary escaped');
  eq(secondaryHTML.includes('<svg'), false, 'secondary name escaped');
  eq(secondaryHTML.includes('&lt;img'), true, 'secondary retains safe text');

  const pendingHTML = T.pendingSecondaryHTMLFor('<img src=x onerror=alert(3)>');
  eq(pendingHTML.includes('<img'), false, 'pending secondary name escaped');
  eq(pendingHTML.includes('&lt;img'), true, 'pending secondary retains safe text');
});

console.log('rating criteria');

test('knee replacement intermediate residuals expose 30, 40, and 50 percent outcomes', () => {
  const values = T.kneeReplacementLevels.map(level => level.value);
  eq(JSON.stringify(values), JSON.stringify([30,40,50,60,100]), 'replacement levels');
});

test('hiatal hernia uses DC 7346 to 7203 identity and upper levels require dysphagia', () => {
  eq(T.abdomenProfileKey('Hiatal hernia'), 'hiatal', 'abdomen profile key');
  eq(T.gerdProfiles.hiatal.label.includes('DC 7346'), true, 'hiatal diagnostic code');
  eq(T.gerdProfiles.hiatal.label.includes('DC 7203'), true, 'analogous diagnostic code');
  const levels = T.gerdProfiles.gerd.domains[0].levels;
  eq(levels.find(level => level.value === 50).description.includes('dysphagia'), true, '50% dysphagia requirement');
  eq(levels.find(level => level.value === 80).description.includes('Dysphagia'), true, '80% dysphagia requirement');
});

test('vision anchors map 10/200 to 90% and 5/200 to 100%', () => {
  eq(T.visionLevels.find(level => level.value === 90).label.includes('10/200 both eyes'), true, '90% anchor');
  eq(T.visionLevels.find(level => level.value === 100).label.includes('5/200 both eyes'), true, '100% anchor');
});

// ── Summary ─────────────────────────────────────────────────────────────────
console.log('\n' + passed + ' passed, ' + failures.length + ' failed');
if (failures.length) process.exit(1);
