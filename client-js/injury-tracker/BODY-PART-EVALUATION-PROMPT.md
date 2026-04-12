# Body Part Evaluation Panel — Implementation Prompt

Use this prompt to build a condition evaluation panel for any body part, following the same pattern established by Mental Health.

---

## The Pattern

We have an Injury Tracker app (vanilla JS, no framework) at `injury-tracker/`. It has a body map with clickable body parts in a sidebar. We already built a **Mental Health evaluation panel** that works like this:

1. Click "Mental Health" in sidebar → panel replaces body map area
2. Panel shows searchable checklist of all conditions for that area
3. User selects conditions → each gets a severity walkthrough based on VA 8787 criteria
4. Severity determination auto-calculates a disability rating %
5. Manual override available
6. Rating feeds into the Rating tab (combined VA rating calculator)

### Key files that already exist:
- `js/data.js` — Constants, pin definitions, condition lists (SECONDARY_MAP has conditions per body area), MH_DOMAINS, calculateMHRating()
- `js/mental.js` — Mental Health panel (USE THIS AS THE TEMPLATE)
- `js/map.js` — Body map, sidebar, tab switching. `quickSelect(key)` routes clicks. Mental health is intercepted with `if(key==='mental')`
- `js/rating.js` — VA combined rating calculator. Mental health integrates via `buildRatingItems()` and `renderRating()`
- `css/styles.css` — All styles. Mental health styles use `.mh-*` prefix
- `index.html` — Has `<div id="mental-health-panel">` container and `<script src="js/mental.js">`
- `js/export.js` — PDF/CSV/TXT exports include mental health section

---

## What to Build for: [BODY PART NAME]

### Step 1: Identify the body part's evaluation criteria from VA 8787

Each body system uses DIFFERENT evaluation criteria. Mental health uses 5 functional domains (Cognition, Interpersonal, Task Completion, Navigating Environments, Self-Care). Physical body parts use criteria specific to their system:

**Examples of body-part-specific criteria:**

| Body Part | Evaluation Criteria | Rating Basis |
|-----------|-------------------|--------------|
| **Knee** | Range of motion (flexion/extension), instability, locking/effusion, cartilage damage | ROM degrees, instability severity |
| **Shoulder** | Range of motion (flexion, abduction), ankylosis, impairment of humerus | ROM degrees, functional loss |
| **Back/Spine** | Range of motion (forward flexion, combined), IVDS incapacitating episodes, neurological | ROM degrees, episode duration |
| **Head** | TBI residuals (10 facets), migraine frequency, TMJ dysfunction | Facet levels, frequency |
| **Neck** | Same as spine + upper radiculopathy | ROM + nerve involvement |
| **Chest/Lungs** | PFT results (FEV-1, FVC), DLCO, oxygen therapy needs | Test percentages |
| **Abdomen** | Organ-specific: frequency of symptoms, need for medication, weight loss | Symptom frequency |
| **Hip** | Range of motion (flexion, extension, abduction), ankylosis, impairment of femur | ROM degrees |
| **Elbow** | Range of motion (flexion, extension, supination, pronation), impairment | ROM degrees |
| **Wrist/Hand** | Range of motion, grip strength, ankylosis, nerve involvement | ROM, function |
| **Ankle/Foot** | Range of motion, weight-bearing, flatfoot severity, plantar fasciitis | ROM, function |
| **Leg** | Nerve involvement, shortening, muscle injury grade | Length, nerve function |

**Read the 8787 evaluation data** at `VA Thing/extracted-eval.txt` to find the exact criteria for this body part. Search for the relevant diagnostic codes and rating schedules.

### Step 2: Define the evaluation domains for this body part

Create a constant similar to `MH_DOMAINS` but specific to this body part. For example, for the Knee:

```js
const KNEE_DOMAINS = [
  { id: 'flexion', label: 'Flexion (Bending)',
    description: 'How far the knee bends',
    levels: [
      { value: 0, label: 'Normal (140+ degrees)' },
      { value: 10, label: 'Limited to 45 degrees' },
      { value: 20, label: 'Limited to 30 degrees' },
      { value: 30, label: 'Limited to 15 degrees' },
    ]
  },
  { id: 'extension', label: 'Extension (Straightening)',
    description: 'How far the knee straightens',
    levels: [
      { value: 0, label: 'Normal (0 degrees)' },
      { value: 10, label: 'Limited to 10 degrees' },
      { value: 20, label: 'Limited to 15 degrees' },
      { value: 30, label: 'Limited to 20 degrees' },
      { value: 40, label: 'Limited to 30 degrees' },
      { value: 50, label: 'Limited to 45 degrees' },
    ]
  },
  { id: 'instability', label: 'Instability / Giving Way',
    description: 'Lateral instability or subluxation',
    levels: [
      { value: 0, label: 'None' },
      { value: 10, label: 'Slight' },
      { value: 20, label: 'Moderate' },
      { value: 30, label: 'Severe' },
    ]
  },
  // etc.
];
```

**Key difference from mental health:** Physical conditions often have MULTIPLE separately-rated criteria (e.g., knee flexion AND extension AND instability can each have their own rating). Mental health uses a single rating from combined domain assessment.

### Step 3: Create the evaluation module

Create `js/[bodypart].js` following the same structure as `js/mental.js`:

```
Core functions needed:
- window._[bodypart]Conditions = []     // State array
- open[BodyPart]Panel()                 // Hide body map, show panel
- close[BodyPart]Panel()                // Restore body map
- render[BodyPart]Panel()               // Generate full panel HTML
- add[BodyPart]Condition(name)          // Add condition to state
- remove[BodyPart]Condition(id)         // Remove condition
- toggle[BodyPart]Condition(name)       // Toggle selection
- update[BodyPart]Domain(condId, domainId, value)  // Update rating
- set[BodyPart]Override(condId, value)  // Manual override
- get[BodyPart]Ratings()               // Return ratings for combined calc
```

**Condition data structure:**
```js
{
  id: Date.now(),
  condition: "condition name from SECONDARY_MAP",
  domains: { /* body-part-specific evaluation values */ },
  calculatedRating: 0,
  manualOverride: null,
  effectiveRating: 0,
  extremity: 'none' | 'LU' | 'RU' | 'LL' | 'RL'  // physical parts need this!
}
```

### Step 4: Integrate into existing files

**`js/data.js`** — Add:
- `[BODYPART]_DOMAINS` constant with evaluation criteria
- `calculate[BodyPart]Rating(domainValues)` function
- The conditions list already exists in `SECONDARY_MAP.[group]`

**`js/map.js`** — In `quickSelect()`, add intercept:
```js
// Before the existing pin logic:
if(key==='leftKnee' || key==='rightKnee'){ openKneePanel(key); return; }
```
Note: For bilateral body parts (knees, shoulders, etc.), pass the `key` so the panel knows which side. The panel should track left/right and set the correct extremity code.

**`js/rating.js`** — In `buildRatingItems()`, add after mental health block:
```js
const [bp]Conds = window._[bodypart]Conditions || [];
[bp]Conds.forEach((cond, ci) => {
  _ratingItems.push({
    id: '[bp]-' + cond.id,
    name: cond.condition,
    rating: cond.effectiveRating,
    extremity: cond.extremity,  // IMPORTANT for bilateral factor
    type: '[bodypart]',
    suggested: cond.calculatedRating,
  });
});
```

**Unlike mental health**, physical conditions ARE rated separately (not single-highest). Each condition gets its own line in the combined rating.

**`index.html`** — Add:
- `<div id="[bodypart]-panel" class="[bp]-panel hidden"></div>` inside tab-map
- `<script src="js/[bodypart].js"></script>` in script loading order

**`css/styles.css`** — Can reuse most `.mh-*` styles. Consider extracting shared styles to `.eval-*` prefix and only adding body-part-specific overrides.

**`js/export.js`** — Add section for body part conditions in PDF, CSV, TXT exports.

### Step 5: Handle bilateral body parts

For paired body parts (left/right knee, shoulder, etc.):
- The panel needs to know which SIDE was clicked
- Store `extremity` on each condition ('LL'/'RL' for knees, 'LU'/'RU' for shoulders)
- This is critical for the bilateral factor in the VA combined rating calculation
- The panel header should show which side (e.g., "Left Knee Evaluation")
- Consider allowing both sides to be managed from the same panel with a side toggle

---

## Body Parts to Implement (in suggested order)

These map to the sidebar groups and SECONDARY_MAP keys:

| # | Sidebar Group | SECONDARY_MAP key | Pin keys | Bilateral? | Priority |
|---|--------------|-------------------|----------|-----------|----------|
| 1 | Head & Face | head | head, leftEar, rightEar, leftEye, rightEye, nose, jaw | Partial (ears, eyes) | High |
| 2 | Neck | neck | neck | No | High |
| 3 | Shoulders | shoulder | leftShoulder, rightShoulder | Yes | High |
| 4 | Back & Spine | back | upperBack, spine, lowerBack | No | High |
| 5 | Chest / Lungs | chest | chest, leftLung, rightLung | Partial (lungs) | Medium |
| 6 | Arms (Elbow) | elbow | leftElbow, rightElbow | Yes | Medium |
| 7 | Arms (Wrist/Hand) | wrist_hand | leftWrist, rightWrist, leftForearm, rightForearm, leftHand, rightHand | Yes | Medium |
| 8 | Abdomen | abdomen | abdomen, pelvis | No | Medium |
| 9 | Hips & Pelvis | hip | leftHip, rightHip | Yes | Medium |
| 10 | Legs (Knee) | knee | leftKnee, rightKnee | Yes | High |
| 11 | Legs (Shin/Thigh) | leg | leftThigh, rightThigh, leftShin, rightShin, etc. | Yes | Medium |
| 12 | Ankle/Foot | ankle_foot | leftAnkle, rightAnkle, leftFoot, rightFoot | Yes | Medium |

---

## Key Differences from Mental Health

| Aspect | Mental Health | Physical Body Parts |
|--------|-------------|-------------------|
| Rating rule | Single highest rating (VA combines all MH under one DC) | Each condition rated separately |
| Domains | 5 functional domains (same for all MH conditions) | Varies by body system (ROM, function, nerve, etc.) |
| Frequency | "Less than 25%" vs "25%+" of time | Usually not applicable (measured at exam) |
| Extremity | Always 'none' | Must track L/R for bilateral factor |
| Rating values | 0, 10, 30, 50, 70, 100 only | 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 |
| Educational text | Examples of daily life impact per level | ROM measurements, clinical descriptions |

---

## Refactoring Opportunity

After implementing 2-3 body parts, consider extracting shared code into `js/evaluation.js`:

```js
function createEvaluationPanel(config) {
  // config: { regionId, title, conditions, domains, ratingCalculator, stateKey, panelId }
  // Returns: { open, close, render, addCondition, removeCondition, ... }
}
```

This avoids duplicating the panel rendering, search, condition card, override, and export logic across 12+ files.

---

## Prompt Template

When asking to implement a specific body part, use:

> Implement the [BODY PART] evaluation panel following the same pattern as Mental Health (js/mental.js).
>
> 1. Read `VA Thing/extracted-eval.txt` to find the 8787 rating criteria for [BODY PART] conditions
> 2. The conditions list is already in `SECONDARY_MAP.[key]` in data.js
> 3. Create evaluation domains based on the 8787 criteria (ROM, function, severity levels, etc.)
> 4. Create `js/[bodypart].js` following the mental.js template
> 5. Add the domain constants and rating calculation to data.js
> 6. Intercept sidebar clicks in map.js quickSelect()
> 7. Integrate into rating.js buildRatingItems() — note: physical conditions are rated SEPARATELY (not single-highest like mental health)
> 8. [If bilateral]: Track left/right extremity for bilateral factor
> 9. Add to index.html (panel div + script tag)
> 10. Add styles to styles.css (reuse .mh-* patterns where possible)
> 11. Add to exports in export.js
