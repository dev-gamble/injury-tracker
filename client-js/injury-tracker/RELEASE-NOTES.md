# Veteran Injury Documentation & Claim Tool

## What It Does

A browser-based tool that helps veterans document, organize, and build their VA disability compensation claim. It walks them through logging every service-connected condition, evaluating severity using actual VA rating criteria, tracking secondary conditions, identifying evidence gaps, and generating exportable reports — all without needing a VSO or attorney to get started.

Runs entirely in-browser. No server, no login, no data leaves the device.

---

## Alpha Release — March 14, 2026

### Patch Notes (March 13–14)

**New: "Veterans Commonly Also Claim" Suggestions**
- When adding a secondary condition, clickable chip buttons now appear showing the most commonly filed secondary claims specific to that primary condition
- Each suggestion includes the official VA diagnostic code (DC code from 38 CFR Part 4)
- One click adds the secondary and opens the rating questionnaire
- 55+ primary conditions mapped to their most common secondaries (200+ total relationships)
- 14 body area category fallbacks so every condition gets relevant suggestions
- 4-tier smart lookup: exact match → case-insensitive → partial keyword → category fallback

**Updates & Fixes (March 13–14)**
- Mental health evaluation panel updates
- Head & face evaluation panel updates
- Timeline rendering improvements
- Evidence gap detection updates
- Body map and sidebar refinements
- Personal statement editor updates
- Export system updates (PDF/CSV/TXT)
- Rating calculator updates
- Special claims panel updates
- Body part evaluation panel updates
- Injury logging form updates
- Core data and condition list updates

---

## Complete Feature List

### 1. Interactive Body Map
- Male/female body diagrams with front/back views
- Click anywhere on the body to drop a custom pin
- Quick Select sidebar grouped by body region (shoulders, knees, back, etc.)
- Badge counters showing how many conditions per area
- Color-coded severity pins (green = mild, orange = moderate, red = severe, purple = custom)

### 2. Injury Logging Form
- Modal form for documenting each injury or condition
- Fields: date, location, event description, medical care, clinic name, witnesses
- Severity selection (mild / moderate / severe / custom)
- Functional impact chips tracking how the condition affects daily life
- Smart routing — selecting "Mental Health" or "Head & Face" auto-opens specialized panels

### 3. Mental Health Evaluations
- 30+ VA-recognized mental health diagnoses
- Domain-based rating: social functioning, occupational functioning, mood, anxiety, impulse control, reality testing, judgment, adaptive functioning
- Frequency modifiers (less than 25% through more than 75%)
- Auto-calculated VA rating with manual override

### 4. Head & Face Evaluations
- Specialized conditions: vision, hearing, TBI, TMD, sinusitis, rhinitis, neurological
- Condition-specific domain ratings
- Extremity selector (unilateral / bilateral)
- Auto-calculated ratings with override

### 5. Body Part Evaluation Panels
- 10 standardized panels: Knee, Back/Spine, Shoulder, Neck, Hip, Elbow, Wrist/Hand, Ankle/Foot, Chest/Lungs, Abdomen
- Condition-specific rating profiles (e.g., knee: ROM, instability, cartilage damage)
- Domain-based VA rating calculations
- Bilateral extremity detection (left/right)

### 6. Secondary Conditions
- Unified claim tree showing all primary conditions with their secondaries
- "Veterans commonly also claim" suggestion chips with DC codes
- Add/remove secondary conditions per primary
- Rating questionnaire for each secondary
- Pyramiding and duplication warnings

### 7. VA Rating Calculator
- Suggested ratings for 70+ common conditions using VA percentage tables
- Bilateral extremity detection with combined rating math
- Pin-to-extremity mapping (Left Upper, Right Lower, etc.)

### 8. Evidence Gap Detection
- Scans every logged condition for missing evidence fields
- Flags incomplete records with orange badges
- Shows exactly which fields are missing (description, event, medical care, clinic, etc.)
- Green badges for complete records

### 9. Timeline View
- Chronological display of all conditions sorted by date
- Grouped by year with color-coded severity badges
- Edit/delete controls per entry
- Shows functional impacts and secondary conditions

### 10. Personal Statement Editor
- Rich text editor with formatting toolbar (bold, italic, underline, lists)
- Reference sidebar with all logged conditions organized by type
- Click-to-insert condition names into the statement
- Example narrative with placeholders
- Auto-saves on input

### 11. Special Claims
- **Presumptive Service Connection** — POW, Agent Orange, Gulf War, Burn Pit / PACT Act (auto-connects without nexus proof)
- **SMC Levels (A through R.2)** — 11 tiers of Special Monthly Compensation
- **MST (Military Sexual Trauma)** — Privacy-shielded conditions with dedicated evidence types
- **Vocational Rehabilitation** — Secondary conditions from service-connected disabilities

### 12. Export System
- **PDF / Print** — Full summary with numbered body diagrams, pins, severity, and evidence gaps
- **CSV** — Spreadsheet export of all condition data
- **TXT** — Plain text report
- Summary statistics: total conditions, evidence completion %, body areas affected, incomplete evaluations

### 13. CSV Import
- Upload previously exported CSV to restore data
- Fuzzy label matching with 50+ aliases (e.g., "cervical" maps to neck)
- Auto-resolves pins from imported data

### 14. Core Data
- Official VA condition names per body area (VA_AREA_CONDITIONS)
- 30+ mental health diagnoses (VA_MENTAL)
- Head & face condition list (VA_HEAD)
- Secondary condition maps per body area (SECONDARY_MAP)
- 10 body part evaluation panel configs (BP_REGISTRY)
- Example symptoms for 100+ conditions

---

## Tech Stack
- Pure HTML / CSS / JavaScript — no frameworks, no server, no dependencies
- Runs entirely in-browser (all data stays on the device)
- Modular JS architecture (14 files)
- Also available as a single standalone HTML file
