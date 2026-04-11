// ── EXPORT UTILITIES ──────────────────────────────────────────────────────────

import type { AppState, MHCondition, HeadCondition, BPCondition } from '../types'
import { gapStatus } from './gaps'
import { combineVARatings, roundVARating, getSuggestedRating, getExtremity } from './rating'
import { getPanelKeys } from '../data/bpMeta'
import { HEAD_PROFILES } from '../data/headData'
import { getBPProfile } from '../data/bpProfiles'
import { MH_DOMAINS } from '../data/mhData'

const MST_MH_NAMES = new Set([
  'ptsd', 'major depressive disorder', 'generalized anxiety disorder',
  'panic disorder', 'adjustment disorder', 'insomnia / sleep disturbance',
  'substance use disorder', 'eating disorder', 'somatic symptom disorder',
  'other condition related to mst',
])

const SMC_LABELS: Record<string, string> = {
  smc_k: 'SMC-K: Loss of Body Part',
  smc_l: 'SMC-L: Aid & Attendance',
  smc_l_half: 'SMC-L½: Aid & Attendance + Body Part Loss',
  smc_m: 'SMC-M: Higher Level of Care',
  smc_m_half: 'SMC-M½: Higher Care + Additional Loss',
  smc_n: 'SMC-N: Multiple Losses + Aid & Attendance',
  smc_n_half: 'SMC-N½: Severe Multiple Losses',
  smc_o: 'SMC-O: Maximum Regular SMC',
  smc_r1: 'SMC-R.1: Higher A&A (TBI / Severe Conditions)',
  smc_r2: 'SMC-R.2: Hospitalization / Nursing Home Level',
  smc_s: 'SMC-S: Housebound',
}

const PRESUMPTIVE_META: Record<string, { label: string; fields: Array<{ id: string; label: string }> }> = {
  pow: { label: 'Prisoner of War (POW)', fields: [
    { id: 'dates', label: 'When held' }, { id: 'location', label: 'Where held' },
    { id: 'duration', label: 'Duration' }, { id: 'conditions', label: 'Related conditions' },
  ]},
  agent_orange: { label: 'Agent Orange / Herbicide Exposure', fields: [
    { id: 'dates', label: 'Service dates' }, { id: 'location', label: 'Location' },
    { id: 'unit', label: 'Unit' }, { id: 'conditions', label: 'Related conditions' },
  ]},
  gulf_war: { label: 'Gulf War / Southwest Asia Illness', fields: [
    { id: 'dates', label: 'Service dates' }, { id: 'location', label: 'Location' },
    { id: 'unit', label: 'Unit' }, { id: 'symptoms', label: 'Unexplained symptoms' },
  ]},
  burn_pit: { label: 'Burn Pit / PACT Act Exposure', fields: [
    { id: 'dates', label: 'Service dates' }, { id: 'location', label: 'Location' },
    { id: 'unit', label: 'Unit' }, { id: 'exposure', label: 'Exposure type' },
    { id: 'conditions', label: 'Related conditions' },
  ]},
}

const PHYSICAL_LOSS_LABELS: Record<string, string> = {
  loss_extremity: 'Loss of Use of Extremity',
  loss_paired: 'Loss of Paired Organ',
}

const MST_EVIDENCE_LABELS: Record<string, string> = {
  buddy: 'Buddy statement(s)',
  behavioral: 'Behavioral changes in service records',
  police: 'Police or military police report',
  counseling: 'Counseling or therapy records',
  medical: 'Medical records showing treatment',
  performance: 'Performance evaluations showing decline',
  transfer: 'Transfer/duty change requests',
  pregnancy: 'Pregnancy or STI testing records',
  journal: 'Personal journal or diary entries',
  other: 'Other supporting evidence',
}

// ── HELPERS ────────────────────────────────────────────────────────────────────

function esc(v: unknown): string {
  const s = String(v ?? '').replace(/"/g, '""')
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s
}

function hesc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function pad(label: string, width = 18): string {
  return label.padEnd(width)
}

function downloadText(content: string, filename: string, type = 'text/plain') {
  const blob = new Blob([content], { type: `${type};charset=utf-8;` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Mirrors RatingTab's looksLikeMH — secondaries matching these are absorbed into MH, not rated separately
function looksLikeMH(name: string): boolean {
  const l = name.toLowerCase()
  return l.includes('ptsd') || l.includes('depression') || l.includes('anxiety') ||
    l.includes('disorder') || l.includes('insomnia') || l.includes('adjustment') ||
    l.includes('bipolar') || l.includes('panic') || l.includes('trauma')
}

/** Compute combined rating mirroring RatingTab logic: bilateral factor + suggested fallback + secondaries + overrides. */
function getCombinedRating(state: AppState): { combined: number; rounded: number } {
  const panelKeys = getPanelKeys()
  const ov = state.ratingOverrides
  const entries: { rating: number; extremity: string }[] = []

  // Non-panel primary injuries
  const sorted = [...state.injuries]
    .filter(i => !panelKeys.has(i.key))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id)

  sorted.forEach(i => {
    const itemId = `p-${i.id}`
    const suggested = getSuggestedRating(i.label)
    const r = ov[itemId] ?? ((i.rating != null && i.rating > 0) ? i.rating : (suggested ?? 10))
    if (r > 0) entries.push({ rating: r, extremity: getExtremity(i.key) })
    ;(i.secondaries ?? []).forEach((sec, si) => {
      if (looksLikeMH(sec)) return
      const secId = `s-${i.id}-${si}`
      const sr = ov[secId] ?? i.secondaryRatings?.[sec] ?? getSuggestedRating(sec) ?? 10
      if (sr > 0) entries.push({ rating: sr, extremity: 'none' })
    })
  })

  // Head conditions + their secondaries
  state.headConditions.forEach(c => {
    const itemId = `hd-${c.id}`
    const r = ov[itemId] ?? c.effectiveRating
    if (r > 0) entries.push({ rating: r, extremity: c.extremity ?? 'none' })
    ;(c.secondaries ?? []).forEach((sec, si) => {
      if (looksLikeMH(sec)) return
      const secId = `es-${itemId}-${si}`
      const sr = ov[secId] ?? c.secondaryRatings?.[sec] ?? getSuggestedRating(sec) ?? 10
      if (sr > 0) entries.push({ rating: sr, extremity: c.secondaryExtremities?.[sec] ?? 'none' })
    })
  })

  // Body part conditions + their secondaries (carry extremity for bilateral detection)
  Object.values(state.bpConditions).forEach(arr => {
    arr.forEach(c => {
      const itemId = `bp-${c.id}`
      const r = ov[itemId] ?? c.effectiveRating
      if (r > 0) entries.push({ rating: r, extremity: c.extremity ?? 'none' })
      ;(c.secondaries ?? []).forEach((sec, si) => {
        if (looksLikeMH(sec)) return
        const secId = `es-${itemId}-${si}`
        const sr = ov[secId] ?? c.secondaryRatings?.[sec] ?? getSuggestedRating(sec) ?? 10
        if (sr > 0) entries.push({ rating: sr, extremity: c.secondaryExtremities?.[sec] ?? 'none' })
      })
    })
  })

  // Mental health — highest only (VA single MH rule); apply override per condition
  const { mstData } = state.specialClaims
  const mhRatings = state.mentalConditions.map(c => ov[`mh-${c.id}`] ?? c.effectiveRating)
  mstData.conditions.forEach(c => { if (MST_MH_NAMES.has(c.name.toLowerCase()) && c.rating > 0) mhRatings.push(c.rating) })
  const highestMH = mhRatings.length ? Math.max(...mhRatings) : 0
  if (highestMH > 0) entries.push({ rating: highestMH, extremity: 'none' })

  // MH condition secondaries
  state.mentalConditions.forEach(c => {
    ;(c.secondaries ?? []).forEach((sec, si) => {
      if (looksLikeMH(sec)) return
      const secId = `es-mh-${c.id}-${si}`
      const sr = ov[secId] ?? c.secondaryRatings?.[sec] ?? getSuggestedRating(sec) ?? 10
      if (sr > 0) entries.push({ rating: sr, extremity: 'none' })
    })
  })

  // MST non-MH conditions + their secondaries
  mstData.conditions.forEach(c => {
    if (!MST_MH_NAMES.has(c.name.toLowerCase())) {
      if (c.rating > 0) entries.push({ rating: c.rating, extremity: 'none' })
      c.secondaries?.forEach(s => { if (s.rating > 0) entries.push({ rating: s.rating, extremity: 'none' }) })
    }
  })

  // Apply bilateral factor — 38 CFR 4.26
  const ul = entries.filter(e => e.extremity === 'LU')
  const ur = entries.filter(e => e.extremity === 'RU')
  const ll = entries.filter(e => e.extremity === 'LL')
  const lr = entries.filter(e => e.extremity === 'RL')
  const none = entries.filter(e => e.extremity === 'none')

  const finalRatings: number[] = none.map(e => e.rating)

  if (ul.length > 0 && ur.length > 0) {
    const c = combineVARatings([...ul, ...ur].map(e => e.rating))
    finalRatings.push(Math.round(c + c * 0.10))
  } else {
    ;[...ul, ...ur].forEach(e => finalRatings.push(e.rating))
  }

  if (ll.length > 0 && lr.length > 0) {
    const c = combineVARatings([...ll, ...lr].map(e => e.rating))
    finalRatings.push(Math.round(c + c * 0.10))
  } else {
    ;[...ll, ...lr].forEach(e => finalRatings.push(e.rating))
  }

  const combined = combineVARatings(finalRatings.filter(r => r > 0))
  return { combined, rounded: roundVARating(combined) }
}

// ── CSV EXPORT ────────────────────────────────────────────────────────────────

export function exportCSV(state: AppState): void {
  const panelKeys = getPanelKeys()
  const filteredInj = state.injuries.filter(i => !panelKeys.has(i.key))
  const hasData = filteredInj.length || state.mentalConditions.length || state.headConditions.length ||
    Object.values(state.bpConditions).some(a => a.length)
  if (!hasData) { alert('No injuries to export.'); return }

  const sorted = [...filteredInj].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const { combined, rounded } = getCombinedRating(state)
  const csvRows: string[] = []

  // Physical injuries
  const headers = ['#', 'Date', 'Body Area', 'Severity', 'Assigned Rating %', 'Body', 'Side',
    'Installation', 'Event', 'Description', 'Medical Care', 'Clinic', 'Witnesses',
    'Secondary Conditions', 'Daily Life Impact', 'Evidence Status', 'Missing Evidence',
    'Still Being Seen']
  csvRows.push(headers.join(','))

  sorted.forEach((inj, idx) => {
    const g = gapStatus(inj)
    const row = [
      idx + 1,
      inj.date || '',
      inj.label,
      inj.severity === 'custom' ? 'Other' : inj.severity,
      inj.rating != null ? `${inj.rating}%` : '',
      inj.pin.body,
      inj.pin.side,
      inj.location || '',
      inj.event || '',
      inj.description || '',
      inj.medicalCare === 'yes' ? 'Yes' : 'No',
      inj.clinicName || '',
      inj.witnesses || '',
      (inj.secondaries || []).join('; '),
      (inj.functionalImpacts || []).join('; '),
      g.status === 'complete' ? 'Complete' : 'Needs Evidence',
      g.gaps.join('; '),
      inj.stillBeingSeen ? 'Yes' : 'No',
    ]
    csvRows.push(row.map(esc).join(','))
  })

  // Mental health
  if (state.mentalConditions.length) {
    csvRows.push('')
    csvRows.push(esc('MENTAL HEALTH EVALUATION'))
    csvRows.push(['Condition', 'Date', 'Location', 'Event', 'Description', 'Medical Care', 'Clinic', 'Witnesses',
      'Cognition', 'Interpersonal', 'Task Completion', 'Navigating Environments', 'Self-Care',
      'Calculated Rating', 'Effective Rating', 'Override'].join(','))
    state.mentalConditions.forEach(c => {
      const dv = (id: string) => {
        const d = c.domains[id]
        return d ? d.level + (d.level !== 'none' ? ` (${d.frequency})` : '') : ''
      }
      const row = [
        c.condition, c.date || '', c.location || '', c.event || '', c.description || '',
        c.medicalCare === 'yes' ? 'Yes' : 'No', c.clinicName || '', c.witnesses || '',
        dv('cognition'), dv('interpersonal'), dv('taskCompletion'), dv('environments'), dv('selfCare'),
        `${c.calculatedRating}%`, `${c.effectiveRating}%`, c.manualOverride !== null ? 'Yes' : 'No',
      ]
      csvRows.push(row.map(esc).join(','))
    })
  }

  // Head & Face
  if (state.headConditions.length) {
    csvRows.push('')
    csvRows.push(esc('HEAD & FACE EVALUATION'))
    csvRows.push(['Condition', 'Date', 'Location', 'Event', 'Description', 'Medical Care', 'Clinic', 'Witnesses',
      'Profile', 'Domain Values', 'Calculated Rating', 'Effective Rating', 'Override'].join(','))
    state.headConditions.forEach(c => {
      const profile = HEAD_PROFILES[c.profile] || HEAD_PROFILES.generic
      const domainStr = profile?.domains.map(d => {
        const v = c.domains[d.id]
        const lv = d.levels?.find(l => l.value === v)
        return `${d.label.split(':').pop()?.trim()}=${lv ? lv.label : `${v}%`}`
      }).join('; ') || ''
      const row = [
        c.condition, c.date || '', c.location || '', c.event || '', c.description || '',
        c.medicalCare === 'yes' ? 'Yes' : 'No', c.clinicName || '', c.witnesses || '',
        profile?.label || c.profile, domainStr,
        `${c.calculatedRating}%`, `${c.effectiveRating}%`, c.manualOverride !== null ? 'Yes' : 'No',
      ]
      csvRows.push(row.map(esc).join(','))
    })
  }

  // Body part conditions
  Object.entries(state.bpConditions).forEach(([regionId, conds]) => {
    if (!conds.length) return
    csvRows.push('')
    csvRows.push(esc(`${regionId.toUpperCase().replace('_', ' / ')} EVALUATION`))
    csvRows.push(['Condition', 'Side', 'Date', 'Location', 'Event', 'Description', 'Medical Care', 'Clinic', 'Witnesses',
      'Profile', 'Extremity', 'Domain Values', 'Calculated Rating', 'Effective Rating', 'Override'].join(','))
    conds.forEach(c => {
      const profile = getBPProfile(regionId, c.condition)
      const domainStr = profile?.domains.map(d => {
        const v = c.domains[d.id]
        const lv = d.levels?.find(l => l.value === v)
        return `${d.label.split(':').pop()?.trim()}=${lv ? lv.label : `${v}%`}`
      }).join('; ') || ''
      const row = [
        c.condition, c.sideLabel || '', c.date || '', c.location || '', c.event || '', c.description || '',
        c.medicalCare === 'yes' ? 'Yes' : 'No', c.clinicName || '', c.witnesses || '',
        profile?.label || c.profile, c.extremity || 'none', domainStr,
        `${c.calculatedRating}%`, `${c.effectiveRating}%`, c.manualOverride !== null ? 'Yes' : 'No',
      ]
      csvRows.push(row.map(esc).join(','))
    })
  })

  // SMC
  const { smcSelections, vocSecondaries, vocNotes, claims, presumptiveData, mstData } = state.specialClaims
  if (smcSelections.length) {
    csvRows.push('')
    csvRows.push(esc('SPECIAL MONTHLY COMPENSATION (SMC)'))
    smcSelections.forEach(id => csvRows.push(esc(SMC_LABELS[id] || id)))
  }

  // Presumptive service connection
  const hasPresumptive = Object.values(presumptiveData).some(fields => Object.values(fields).some(v => v))
  if (hasPresumptive) {
    csvRows.push('')
    csvRows.push(esc('PRESUMPTIVE SERVICE CONNECTION'))
    Object.entries(presumptiveData).forEach(([claimId, fields]) => {
      const meta = PRESUMPTIVE_META[claimId]
      if (!meta || !Object.values(fields).some(v => v)) return
      csvRows.push(esc(meta.label))
      meta.fields.forEach(f => { if (fields[f.id]) csvRows.push([esc(f.label), esc(fields[f.id])].join(',')) })
    })
  }

  // Physical loss / paired organs
  const physicalLosses = Object.entries(claims)
    .filter(([id, fields]) => (id === 'loss_extremity' || id === 'loss_paired') && fields.selected === 'true')
    .map(([id]) => PHYSICAL_LOSS_LABELS[id] || id)
  if (physicalLosses.length) {
    csvRows.push('')
    csvRows.push(esc('PHYSICAL LOSS / PAIRED ORGANS'))
    physicalLosses.forEach(label => csvRows.push(esc(label)))
  }

  // Vocational impact
  if (vocSecondaries.length || vocNotes) {
    csvRows.push('')
    csvRows.push(esc('VOCATIONAL IMPACT'))
    vocSecondaries.forEach(v => csvRows.push(esc(v)))
    if (vocNotes) csvRows.push([esc('Notes'), esc(vocNotes)].join(','))
  }

  // MST
  if (mstData.conditions.length) {
    csvRows.push('')
    csvRows.push(esc(`MST-RELATED CONDITIONS${mstData.privacyShield ? ' (PRIVACY SHIELD ACTIVE)' : ''}`))
    csvRows.push(['Condition', 'Rating', 'Secondary Conditions'].join(','))
    mstData.conditions.forEach(c => {
      const name = mstData.privacyShield ? 'Private Condition' : c.name
      const secs = (c.secondaries || []).map(s =>
        mstData.privacyShield ? `Private Secondary (${s.rating}%)` : `${s.name} (${s.rating}%)`
      ).join('; ')
      csvRows.push([esc(name), `${c.rating}%`, esc(secs)].join(','))
    })
    const evidenceList = Object.entries(mstData.evidence).filter(([, v]) => v).map(([k]) => MST_EVIDENCE_LABELS[k] || k)
    if (evidenceList.length) csvRows.push([esc('Evidence'), esc(evidenceList.join('; '))].join(','))
    if (!mstData.privacyShield && mstData.notes) csvRows.push([esc('Private Notes'), esc(mstData.notes)].join(','))
  }

  // Rating summary
  if (rounded > 0) {
    csvRows.push('')
    csvRows.push(esc(`COMBINED VA DISABILITY RATING: ${rounded}%`))
    csvRows.push(esc(`Exact: ${combined.toFixed(2)}%`))
  }

  downloadText(csvRows.join('\r\n'), `injury-report-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv')
}

// ── TIMELINE BUILDER (shared by TXT + PDF) ───────────────────────────────────

interface TimelineItem {
  label: string
  type: string
  date: string
  location: string
  event: string
  rating?: number
}

function buildTimeline(state: AppState): TimelineItem[] {
  const panelKeys = getPanelKeys()
  const items: TimelineItem[] = []

  state.injuries
    .filter(i => !panelKeys.has(i.key) && i.date)
    .forEach(i => items.push({
      label: i.label, type: 'Injury', date: i.date,
      location: i.location || '', event: i.event || '',
      rating: i.rating ?? undefined,
    }))

  state.mentalConditions
    .filter(c => c.date)
    .forEach(c => items.push({
      label: c.condition, type: 'Mental Health', date: c.date,
      location: c.location || '', event: c.event || '',
      rating: c.effectiveRating || undefined,
    }))

  state.headConditions
    .filter(c => c.date)
    .forEach(c => items.push({
      label: c.condition, type: 'Head & Face', date: c.date,
      location: c.location || '', event: c.event || '',
      rating: c.effectiveRating || undefined,
    }))

  Object.entries(state.bpConditions).forEach(([region, conds]) =>
    conds.filter(c => c.date).forEach(c => items.push({
      label: c.condition, type: region.replace('_', ' / '), date: c.date,
      location: c.location || '', event: c.event || '',
      rating: c.effectiveRating || undefined,
    }))
  )

  return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// ── TXT EXPORT ────────────────────────────────────────────────────────────────

export function exportTXT(state: AppState): void {
  const panelKeys = getPanelKeys()
  const filteredInj = state.injuries.filter(i => !panelKeys.has(i.key))
  const hasData = filteredInj.length || state.mentalConditions.length || state.headConditions.length ||
    Object.values(state.bpConditions).some(a => a.length)
  if (!hasData) { alert('No injuries to export.'); return }

  const sorted = [...filteredInj].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const { combined, rounded } = getCombinedRating(state)

  const LINE = '='.repeat(60)
  const DASH = '-'.repeat(40)
  let txt = ''

  txt += `${LINE}\n  INJURY DOCUMENTATION SUMMARY\n`
  txt += `  Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`
  txt += `${LINE}\n\n`
  txt += `NOTICE: This records personal injury notes only.\nIt does not determine VA eligibility or guarantee claim approval.\n\n`

  // Stats
  const allEvalConds: Array<MHCondition | HeadCondition | BPCondition> = [
    ...state.mentalConditions,
    ...state.headConditions,
    ...Object.values(state.bpConditions).flat(),
  ]
  const totalConds = filteredInj.length + allEvalConds.length
  const totalMedical = filteredInj.filter(i => i.medicalCare === 'yes').length + allEvalConds.filter(c => c.medicalCare === 'yes').length
  const incomplete = sorted.filter(i => gapStatus(i).status === 'incomplete')

  txt += `SUMMARY\n${DASH}\n`
  txt += `  ${pad('Total Conditions:')} ${totalConds}\n`
  txt += `  ${pad('Medical Visits:')} ${totalMedical}\n`
  txt += `  ${pad('Needs Evidence:')} ${incomplete.length}\n`
  if (rounded > 0) txt += `  ${pad('Combined Rating:')} ${rounded}%\n`
  txt += '\n'

  // Evidence gaps
  if (incomplete.length) {
    txt += `EVIDENCE GAPS\n${DASH}\n`
    incomplete.forEach(inj => {
      const g = gapStatus(inj)
      txt += `  #${sorted.indexOf(inj) + 1} ${inj.label}\n`
      txt += `     Missing: ${g.gaps.join(', ')}\n`
    })
    txt += '\n'
  }

  // Chronological timeline
  const timelineItems = buildTimeline(state)
  if (timelineItems.length) {
    const years = [...new Set(timelineItems.map(i => i.date.slice(0, 4)))]
    txt += `CHRONOLOGICAL TIMELINE\n${LINE}\n\n`
    years.forEach(yr => {
      txt += `── ${yr} ${'─'.repeat(44)}\n`
      timelineItems.filter(i => i.date.startsWith(yr)).forEach(item => {
        const d = new Date(item.date)
        const datePart = isNaN(d.getTime()) ? item.date : d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
        const typePart = `[${item.type}]`
        const ratingPart = item.rating ? `${item.rating}%` : ''
        const contextParts = [ratingPart, item.location, item.event].filter(Boolean).join(' · ')
        txt += `  ${datePart.padEnd(7)}  ${item.label.padEnd(32)}  ${typePart.padEnd(18)}${contextParts ? `  — ${contextParts}` : ''}\n`
      })
      txt += '\n'
    })
  }

  // Injury details
  txt += `INJURY DETAILS\n${LINE}\n\n`
  sorted.forEach((inj, idx) => {
    const g = gapStatus(inj)
    txt += `#${idx + 1}  ${inj.label}\n${DASH}\n`
    txt += `  ${pad('Date:')} ${inj.date || '—'}\n`
    txt += `  ${pad('Severity:')} ${inj.severity === 'custom' ? 'Other' : inj.severity}\n`
    if (inj.rating != null) txt += `  ${pad('Rating:')} ${inj.rating}%\n`
    txt += `  ${pad('Body:')} ${inj.pin.body} / ${inj.pin.side}\n`
    txt += `  ${pad('Installation:')} ${inj.location || '—'}\n`
    txt += `  ${pad('Event:')} ${inj.event || '—'}\n`
    txt += `  ${pad('Description:')} ${inj.description || '—'}\n`
    txt += `  ${pad('Medical Care:')} ${inj.medicalCare === 'yes' ? (inj.clinicName || 'Yes') : 'No'}\n`
    txt += `  ${pad('Witnesses:')} ${inj.witnesses || '—'}\n`
    txt += `  ${pad('Still Seen:')} ${inj.stillBeingSeen ? 'Yes' : 'No'}\n`
    txt += `  ${pad('Evidence:')} ${g.label}\n`
    if (g.gaps.length) txt += `  ${pad('Missing:')} ${g.gaps.join(', ')}\n`
    if (inj.functionalImpacts?.length) txt += `  ${pad('Daily Impact:')} ${inj.functionalImpacts.join(', ')}\n`
    if (inj.secondaries?.length) {
      const secStr = inj.secondaries.map(s => {
        const r = inj.secondaryRatings?.[s]
        return r != null ? `${s} (${r}%)` : s
      }).join(', ')
      txt += `  ${pad('Secondary:')} ${secStr}\n`
    }
    txt += '\n'
  })

  // Mental health
  if (state.mentalConditions.length) {
    const mhHighest = state.mentalConditions.reduce((b, c) => c.effectiveRating > b.effectiveRating ? c : b, state.mentalConditions[0])
    txt += `MENTAL HEALTH EVALUATION (VA 8787)\n${LINE}\n\n`
    txt += `Note: VA rates all mental health conditions under one combined rating.\n`
    txt += `Highest rating used: ${mhHighest.effectiveRating}% (${mhHighest.condition})\n\n`
    state.mentalConditions.forEach(c => {
      const isActive = state.mentalConditions.length > 1 && c.id === mhHighest.id
      txt += `  ${c.condition}${isActive ? ' [ACTIVE RATING]' : ''}\n  ${DASH}\n`
      txt += `    ${pad('Date:')} ${c.date || '—'}\n`
      if (c.location) txt += `    ${pad('Location:')} ${c.location}\n`
      if (c.event) txt += `    ${pad('Event:')} ${c.event}\n`
      if (c.description) txt += `    ${pad('Description:')} ${c.description}\n`
      if (c.medicalCare === 'yes') txt += `    ${pad('Medical Care:')} ${c.clinicName || 'Yes'}\n`
      if (c.stillBeingSeen) txt += `    ${pad('Still Being Seen:')} Yes\n`
      MH_DOMAINS.forEach(d => {
        const dv = c.domains[d.id]
        if (dv && dv.level !== 'none') {
          txt += `    ${d.label}: ${dv.level} (${dv.frequency === '25plus' ? '25%+ of time' : '<25% of time'})\n`
        }
      })
      if (c.secondaries?.length) {
        const secStr = c.secondaries.map(s => {
          const r = c.secondaryRatings?.[s]
          return r != null ? `${s} (${r}%)` : s
        }).join(', ')
        txt += `    ${pad('Secondary:')} ${secStr}\n`
      }
      txt += `    Rating: ${c.effectiveRating}%${c.manualOverride !== null ? ` (manual override: ${c.manualOverride}%)` : ''}\n\n`
    })
  }

  // Head & Face
  if (state.headConditions.length) {
    txt += `HEAD & FACE EVALUATION\n${LINE}\n\n`
    state.headConditions.forEach(c => {
      const profile = HEAD_PROFILES[c.profile] || HEAD_PROFILES.generic
      txt += `  ${c.condition} [${profile?.label || c.profile}]\n  ${DASH}\n`
      txt += `    ${pad('Date:')} ${c.date || '—'}\n`
      if (c.location) txt += `    ${pad('Location:')} ${c.location}\n`
      if (c.event) txt += `    ${pad('Event:')} ${c.event}\n`
      if (c.description) txt += `    ${pad('Description:')} ${c.description}\n`
      if (c.medicalCare === 'yes') txt += `    ${pad('Medical Care:')} ${c.clinicName || 'Yes'}\n`
      if (c.stillBeingSeen) txt += `    ${pad('Still Being Seen:')} Yes\n`
      if (c.extremity && c.extremity !== 'none') txt += `    ${pad('Extremity:')} ${c.extremity}\n`
      profile?.domains.forEach(d => {
        const v = c.domains[d.id]
        if (v == null || v === 0) return
        const lv = d.levels?.find(l => l.value === v)
        txt += `    ${d.label}: ${lv ? lv.label : `${v}%`}\n`
      })
      if (c.secondaries?.length) {
        const secStr = c.secondaries.map(s => {
          const r = c.secondaryRatings?.[s]
          return r != null ? `${s} (${r}%)` : s
        }).join(', ')
        txt += `    ${pad('Secondary:')} ${secStr}\n`
      }
      txt += `    Rating: ${c.effectiveRating}%${c.manualOverride !== null ? ` (manual override: ${c.manualOverride}%)` : ''}\n\n`
    })
  }

  // Body part conditions
  Object.entries(state.bpConditions).forEach(([regionId, conds]) => {
    if (!conds.length) return
    txt += `${regionId.toUpperCase().replace('_', ' / ')} EVALUATION\n${LINE}\n\n`
    conds.forEach(c => {
      const bpProfile = getBPProfile(regionId, c.condition)
      txt += `  ${c.condition}${c.sideLabel ? ` (${c.sideLabel})` : ''}${bpProfile ? ` [${bpProfile.label}]` : ''}\n  ${DASH}\n`
      txt += `    ${pad('Date:')} ${c.date || '—'}\n`
      if (c.location) txt += `    ${pad('Location:')} ${c.location}\n`
      if (c.event) txt += `    ${pad('Event:')} ${c.event}\n`
      if (c.description) txt += `    ${pad('Description:')} ${c.description}\n`
      if (c.medicalCare === 'yes') txt += `    ${pad('Medical Care:')} ${c.clinicName || 'Yes'}\n`
      if (c.stillBeingSeen) txt += `    ${pad('Still Being Seen:')} Yes\n`
      if (c.extremity && c.extremity !== 'none') txt += `    ${pad('Extremity:')} ${c.extremity}\n`
      bpProfile?.domains.forEach(d => {
        const v = c.domains[d.id]
        if (v == null || v === 0) return
        const lv = d.levels?.find(l => l.value === v)
        txt += `    ${d.label}: ${lv ? lv.label : `${v}%`}\n`
      })
      if (c.secondaries?.length) {
        const secStr = c.secondaries.map(s => {
          const r = c.secondaryRatings?.[s]
          return r != null ? `${s} (${r}%)` : s
        }).join(', ')
        txt += `    ${pad('Secondary:')} ${secStr}\n`
      }
      txt += `    Rating: ${c.effectiveRating}%${c.manualOverride !== null ? ` (manual override: ${c.manualOverride}%)` : ''}\n\n`
    })
  })

  // Special Claims
  const sc2 = state.specialClaims
  const hasPresumptiveTXT = Object.values(sc2.presumptiveData).some(f => Object.values(f).some(v => v))
  const physLossesTXT = Object.entries(sc2.claims)
    .filter(([id, f]) => (id === 'loss_extremity' || id === 'loss_paired') && f.selected === 'true')
    .map(([id]) => PHYSICAL_LOSS_LABELS[id] || id)
  const mstEvidence = Object.entries(sc2.mstData.evidence).filter(([, v]) => v).map(([k]) => MST_EVIDENCE_LABELS[k] || k)
  const hasSpecialTXT = sc2.smcSelections.length || hasPresumptiveTXT || physLossesTXT.length ||
    sc2.vocSecondaries.length || sc2.vocNotes || sc2.mstData.conditions.length || mstEvidence.length

  if (hasSpecialTXT) {
    txt += `SPECIAL CLAIMS\n${LINE}\n\n`

    if (sc2.smcSelections.length) {
      txt += `Special Monthly Compensation (SMC)\n${DASH}\n`
      sc2.smcSelections.forEach(id => txt += `  - ${SMC_LABELS[id] || id}\n`)
      txt += '\n'
    }

    if (hasPresumptiveTXT) {
      txt += `Presumptive Service Connection\n${DASH}\n`
      Object.entries(sc2.presumptiveData).forEach(([claimId, fields]) => {
        const meta = PRESUMPTIVE_META[claimId]
        if (!meta || !Object.values(fields).some(v => v)) return
        txt += `  ${meta.label}\n`
        meta.fields.forEach(f => { if (fields[f.id]) txt += `    ${pad(f.label + ':')} ${fields[f.id]}\n` })
      })
      txt += '\n'
    }

    if (physLossesTXT.length) {
      txt += `Physical Loss / Paired Organs\n${DASH}\n`
      physLossesTXT.forEach(label => txt += `  - ${label}\n`)
      txt += '\n'
    }

    if (sc2.vocSecondaries.length || sc2.vocNotes) {
      txt += `Vocational Impact\n${DASH}\n`
      sc2.vocSecondaries.forEach(v => txt += `  - ${v}\n`)
      if (sc2.vocNotes) txt += `  ${pad('Notes:')} ${sc2.vocNotes}\n`
      txt += '\n'
    }

    if (sc2.mstData.conditions.length || mstEvidence.length) {
      txt += `MST-Related Conditions${sc2.mstData.privacyShield ? ' (Privacy Shield Active)' : ''}\n${DASH}\n`
      sc2.mstData.conditions.forEach(c => {
        const name = sc2.mstData.privacyShield ? 'Private Condition' : c.name
        txt += `  ${name}: ${c.rating}%\n`
        if (c.secondaries?.length) {
          c.secondaries.forEach(s => {
            const sname = sc2.mstData.privacyShield ? 'Private Secondary' : s.name
            txt += `    └ ${sname}: ${s.rating}%\n`
          })
        }
      })
      if (mstEvidence.length) txt += `  ${pad('Evidence:')} ${mstEvidence.join(', ')}\n`
      if (!sc2.mstData.privacyShield && sc2.mstData.notes) txt += `  ${pad('Private Notes:')} ${sc2.mstData.notes}\n`
      txt += '\n'
    }
  }

  // Personal statement
  if (state.personalStatement) {
    const text = state.personalStatement.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (text) {
      txt += `PERSONAL STATEMENT\n${LINE}\n\n${text}\n\n`
    }
  }

  // Rating summary
  if (rounded > 0) {
    txt += `COMBINED VA DISABILITY RATING\n${DASH}\n`
    txt += `  Combined: ${rounded}% (exact: ${combined.toFixed(2)}%)\n\n`
  }

  txt += `${LINE}\nGenerated by VA Claim Support Tool — for personal documentation only.\n${LINE}\n`

  downloadText(txt, `injury-report-${new Date().toISOString().slice(0, 10)}.txt`)
}

// ── SPECIAL CLAIMS HTML (shared by PDF export) ────────────────────────────────

function buildSpecialClaimsHTML(state: AppState): string {
  const sc = state.specialClaims
  const hasPresumptive = Object.values(sc.presumptiveData).some(f => Object.values(f).some(v => v))
  const physLosses = Object.entries(sc.claims)
    .filter(([id, f]) => (id === 'loss_extremity' || id === 'loss_paired') && f.selected === 'true')
    .map(([id]) => PHYSICAL_LOSS_LABELS[id] || id)
  const mstEvidence = Object.entries(sc.mstData.evidence).filter(([, v]) => v).map(([k]) => MST_EVIDENCE_LABELS[k] || k)
  const hasAny = sc.smcSelections.length || hasPresumptive || physLosses.length ||
    sc.vocSecondaries.length || sc.vocNotes || sc.mstData.conditions.length || mstEvidence.length
  if (!hasAny) return ''

  const tag = (label: string, value: string) =>
    `<span style="font-size:11px;padding:2px 8px;border-radius:3px;font-family:monospace;font-weight:600;background:#e0e7ff;color:#3730a3;border:1px solid #c7d2fe;margin:2px;">${hesc(label)}${value ? ': ' + hesc(value) : ''}</span>`

  let html = `<div class="section-title">Special Claims</div>`

  if (sc.smcSelections.length) {
    html += `<div class="detail-card"><div class="dc-header"><span class="dc-label">Special Monthly Compensation (SMC)</span></div><div style="display:flex;flex-wrap:wrap;gap:4px;padding:4px 0;">`
    sc.smcSelections.forEach(id => { html += tag(SMC_LABELS[id] || id, '') })
    html += `</div></div>`
  }

  if (hasPresumptive) {
    html += `<div class="detail-card"><div class="dc-header"><span class="dc-label">Presumptive Service Connection</span></div>`
    Object.entries(sc.presumptiveData).forEach(([claimId, fields]) => {
      const meta = PRESUMPTIVE_META[claimId]
      if (!meta || !Object.values(fields).some(v => v)) return
      html += `<div style="margin-bottom:10px;"><div style="font-size:12px;font-weight:700;color:#1a2332;margin-bottom:6px;">${meta.label}</div><div class="dc-grid">`
      meta.fields.forEach(f => {
        if (!fields[f.id]) return
        html += `<div class="dc-field"><span class="dc-key">${f.label}</span><span class="dc-val">${hesc(fields[f.id])}</span></div>`
      })
      html += `</div></div>`
    })
    html += `</div>`
  }

  if (physLosses.length) {
    html += `<div class="detail-card"><div class="dc-header"><span class="dc-label">Physical Loss / Paired Organs</span></div><div style="display:flex;flex-wrap:wrap;gap:4px;padding:4px 0;">`
    physLosses.forEach(label => { html += tag(label, '') })
    html += `</div></div>`
  }

  if (sc.vocSecondaries.length || sc.vocNotes) {
    html += `<div class="detail-card"><div class="dc-header"><span class="dc-label">Vocational Impact</span></div><div style="display:flex;flex-wrap:wrap;gap:4px;padding:4px 0;">`
    sc.vocSecondaries.forEach(v => { html += tag(v, '') })
    html += `</div>`
    if (sc.vocNotes) html += `<div class="dc-desc"><span class="dc-key">Notes</span><div style="margin-top:2px;font-style:italic;color:#4b5563;">"${hesc(sc.vocNotes)}"</div></div>`
    html += `</div>`
  }

  if (sc.mstData.conditions.length || mstEvidence.length) {
    const shield = sc.mstData.privacyShield
    html += `<div class="detail-card"><div class="dc-header"><span class="dc-label">MST-Related Conditions</span>${shield ? '<span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;padding:3px 8px;border-radius:3px;font-family:monospace;background:#fef2f2;color:#991b1b;border:1px solid #fecaca;">Privacy Shield Active</span>' : ''}</div>`
    if (sc.mstData.conditions.length) {
      html += `<div style="margin-bottom:8px;">`
      sc.mstData.conditions.forEach(c => {
        const name = shield ? 'Private Condition' : hesc(c.name)
        html += `<div style="font-size:12px;color:#1a2332;padding:2px 0;"><strong>${name}</strong>: ${c.rating}%</div>`
        c.secondaries?.forEach(s => {
          const sname = shield ? 'Private Secondary' : hesc(s.name)
          html += `<div style="font-size:11px;color:#4b5563;padding:1px 0 1px 16px;">└ ${sname}: ${s.rating}%</div>`
        })
      })
      html += `</div>`
    }
    if (mstEvidence.length) {
      html += `<div class="dc-section"><span class="dc-section-title" style="color:#1d4ed8;border-color:#bfdbfe;">Evidence on File</span><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">`
      mstEvidence.forEach(e => { html += `<span style="font-size:10px;padding:2px 8px;border-radius:3px;font-family:monospace;font-weight:600;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;">${e}</span>` })
      html += `</div></div>`
    }
    if (!shield && sc.mstData.notes) {
      html += `<div class="dc-desc"><span class="dc-key">Private Notes</span><div style="margin-top:2px;font-style:italic;color:#4b5563;">"${hesc(sc.mstData.notes)}"</div></div>`
    }
    html += `</div>`
  }

  return html
}

// ── PDF / PRINT SUMMARY ───────────────────────────────────────────────────────

export function exportSummary(state: AppState): void {
  const panelKeys = getPanelKeys()
  const filteredInj = state.injuries.filter(i => !panelKeys.has(i.key))
  const hasData = filteredInj.length || state.mentalConditions.length || state.headConditions.length ||
    Object.values(state.bpConditions).some(a => a.length)
  if (!hasData) { alert('No injuries to export.'); return }

  const sorted = [...filteredInj].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const { rounded } = getCombinedRating(state)
  const allEvalConds: Array<MHCondition | HeadCondition | BPCondition> = [
    ...state.mentalConditions,
    ...state.headConditions,
    ...Object.values(state.bpConditions).flat(),
  ]
  const totalConds = filteredInj.length + allEvalConds.length
  const totalMedical = filteredInj.filter(i => i.medicalCare === 'yes').length + allEvalConds.filter(c => c.medicalCare === 'yes').length
  const incomplete = sorted.filter(i => gapStatus(i).status === 'incomplete')

  const SEV_COLOR: Record<string, string> = {
    severe: '#dc2626', moderate: '#d97706', mild: '#16a34a', custom: '#6366f1'
  }
  const sc = (s: string) => SEV_COLOR[s] || SEV_COLOR.custom

  const detailCards = sorted.map((inj, idx) => {
    const g = gapStatus(inj)
    const c = sc(inj.severity)
    const stxt = inj.severity === 'custom' ? 'Other' : inj.severity
    let card = `<div class="detail-card">
      <div class="dc-header">
        <span class="dc-num" style="background:${c};">${idx + 1}</span>
        <span class="dc-label">${hesc(inj.label)}</span>
        <span class="dc-sev" style="color:${c};">${stxt}</span>
        ${inj.rating != null ? `<span class="dc-sev" style="color:#1d4ed8;">${inj.rating}%</span>` : ''}
        <span class="dc-status ${g.status === 'complete' ? 'dc-complete' : 'dc-incomplete'}">${g.label}</span>
      </div>
      <div class="dc-grid">
        <div class="dc-field"><span class="dc-key">Date</span><span class="dc-val">${hesc(inj.date) || '—'}</span></div>
        <div class="dc-field"><span class="dc-key">Body</span><span class="dc-val">${hesc(inj.pin.body)} / ${hesc(inj.pin.side)}</span></div>
        <div class="dc-field"><span class="dc-key">Installation</span><span class="dc-val">${hesc(inj.location) || '—'}</span></div>
        <div class="dc-field"><span class="dc-key">Event / Duty</span><span class="dc-val">${hesc(inj.event) || '—'}</span></div>
        <div class="dc-field"><span class="dc-key">Medical Care</span><span class="dc-val">${inj.medicalCare === 'yes' ? (hesc(inj.clinicName) || 'Yes') : 'No'}</span></div>
        <div class="dc-field"><span class="dc-key">Witnesses</span><span class="dc-val">${hesc(inj.witnesses) || '—'}</span></div>
        <div class="dc-field"><span class="dc-key">Still Being Seen</span><span class="dc-val">${inj.stillBeingSeen ? 'Yes' : 'No'}</span></div>
      </div>`
    if (inj.description) card += `<div class="dc-desc"><span class="dc-key">Description</span><div style="margin-top:2px;font-style:italic;color:#4b5563;">"${hesc(inj.description)}"</div></div>`
    if (inj.secondaries?.length) card += `<div class="dc-section"><span class="dc-section-title" style="color:#3730a3;border-color:#c7d2fe;">Secondary Conditions</span><div class="dc-tags">${inj.secondaries.map(s => `<span class="dc-tag" style="background:#e0e7ff;color:#3730a3;border:1px solid #c7d2fe;">${hesc(s)}</span>`).join('')}</div></div>`
    if (inj.functionalImpacts?.length) card += `<div class="dc-section"><span class="dc-section-title" style="color:#991b1b;border-color:#fecaca;">Daily Life Impact</span><div class="dc-tags">${inj.functionalImpacts.map(f => `<span class="dc-tag" style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca;">${hesc(f)}</span>`).join('')}</div></div>`
    if (g.gaps.length) card += `<div class="dc-section"><span class="dc-section-title" style="color:#92400e;border-color:#fde68a;">Missing Evidence</span><div class="dc-tags">${g.gaps.map(m => `<span class="dc-tag" style="background:#fffbeb;color:#92400e;border:1px solid #fde68a;">${m}</span>`).join('')}</div></div>`
    card += '</div>'
    return card
  }).join('')

  type EvalCond = {
    condition: string; sideLabel?: string; effectiveRating: number; manualOverride?: number | null
    date: string; location: string; medicalCare: '' | 'yes' | 'no'; clinicName: string; witnesses: string
    description: string; secondaries?: string[]; secondaryRatings?: Record<string, number>
    stillBeingSeen?: boolean; extremity?: string; profileLabel?: string; domainsHtml?: string
  }

  function evalCard(c: EvalCond, typeLabel: string, color: string): string {
    const overrideNote = c.manualOverride != null
      ? ` <span style="font-size:9px;font-weight:700;font-family:monospace;color:#92400e;background:#fffbeb;padding:2px 6px;border-radius:3px;border:1px solid #fde68a;">override: ${c.manualOverride}%</span>` : ''
    let card = `<div class="detail-card">
      <div class="dc-header">
        <span class="dc-label">${hesc(c.condition)}${c.sideLabel ? ` (${hesc(c.sideLabel)})` : ''}</span>
        ${c.profileLabel ? `<span class="dc-sev" style="color:#6b7280;">${hesc(c.profileLabel)}</span>` : ''}
        <span class="dc-sev" style="color:${color};">${typeLabel}</span>
        <span class="dc-sev" style="color:#1d4ed8;">${c.effectiveRating}%</span>${overrideNote}
      </div>
      <div class="dc-grid">
        <div class="dc-field"><span class="dc-key">Date</span><span class="dc-val">${hesc(c.date) || '—'}</span></div>
        <div class="dc-field"><span class="dc-key">Installation</span><span class="dc-val">${hesc(c.location) || '—'}</span></div>
        <div class="dc-field"><span class="dc-key">Medical Care</span><span class="dc-val">${c.medicalCare === 'yes' ? (hesc(c.clinicName) || 'Yes') : 'No'}</span></div>
        <div class="dc-field"><span class="dc-key">Witnesses</span><span class="dc-val">${hesc(c.witnesses) || '—'}</span></div>
        ${c.stillBeingSeen ? `<div class="dc-field"><span class="dc-key">Still Being Seen</span><span class="dc-val">Yes</span></div>` : ''}
        ${c.extremity && c.extremity !== 'none' ? `<div class="dc-field"><span class="dc-key">Extremity</span><span class="dc-val">${hesc(c.extremity)}</span></div>` : ''}
      </div>`
    if (c.description) card += `<div class="dc-desc"><span class="dc-key">Description</span><div style="margin-top:2px;font-style:italic;color:#4b5563;">"${hesc(c.description)}"</div></div>`
    if (c.domainsHtml) card += `<div class="dc-section"><span class="dc-section-title" style="color:#0f766e;border-color:#99f6e4;">Evaluation Domains</span>${c.domainsHtml}</div>`
    if (c.secondaries?.length) {
      const tags = c.secondaries.map(s => {
        const r = c.secondaryRatings?.[s]
        const label = r != null ? `${hesc(s)} (${r}%)` : hesc(s)
        return `<span class="dc-tag" style="background:#e0e7ff;color:#3730a3;border:1px solid #c7d2fe;">${label}</span>`
      }).join('')
      card += `<div class="dc-section"><span class="dc-section-title" style="color:#3730a3;border-color:#c7d2fe;">Secondary Conditions</span><div class="dc-tags">${tags}</div></div>`
    }
    card += '</div>'
    return card
  }

  const mhDomainsHtml = (c: typeof state.mentalConditions[0]) => {
    const parts = MH_DOMAINS.flatMap(d => {
      const dv = c.domains[d.id]
      if (!dv || dv.level === 'none') return []
      return [`<div style="font-size:11px;color:#1a2332;padding:1px 0;"><strong>${d.label.split(':').pop()?.trim()}:</strong> ${dv.level} (${dv.frequency === '25plus' ? '25%+ of time' : '<25% of time'})</div>`]
    }).join('')
    return parts ? `<div style="margin-top:4px;">${parts}</div>` : ''
  }

  const headDomainsHtml = (c: typeof state.headConditions[0]) => {
    const hProfile = HEAD_PROFILES[c.profile] || HEAD_PROFILES.generic
    const parts = (hProfile?.domains || []).flatMap(d => {
      const v = c.domains[d.id]
      if (v == null || v === 0) return []
      const lv = d.levels?.find(l => l.value === v)
      return [`<div style="font-size:11px;color:#1a2332;padding:1px 0;"><strong>${d.label}:</strong> ${lv ? lv.label : `${v}%`}</div>`]
    }).join('')
    return parts ? `<div style="margin-top:4px;">${parts}</div>` : ''
  }

  const bpDomainsHtml = (regionId: string, c: BPCondition) => {
    const bpProf = getBPProfile(regionId, c.condition)
    const parts = (bpProf?.domains || []).flatMap(d => {
      const v = c.domains[d.id]
      if (v == null || v === 0) return []
      const lv = d.levels?.find(l => l.value === v)
      return [`<div style="font-size:11px;color:#1a2332;padding:1px 0;"><strong>${d.label}:</strong> ${lv ? lv.label : `${v}%`}</div>`]
    }).join('')
    return parts ? `<div style="margin-top:4px;">${parts}</div>` : ''
  }

  const evalDetailCards = [
    ...state.mentalConditions.map(c => evalCard({ ...c, domainsHtml: mhDomainsHtml(c) }, 'Mental Health', '#7c3aed')),
    ...state.headConditions.map(c => {
      const hProf = HEAD_PROFILES[c.profile] || HEAD_PROFILES.generic
      return evalCard({ ...c, domainsHtml: headDomainsHtml(c), profileLabel: hProf?.label }, 'Head & Face', '#1d4ed8')
    }),
    ...Object.entries(state.bpConditions).flatMap(([region, conds]) =>
      conds.map(c => {
        const bpProf = getBPProfile(region, c.condition)
        return evalCard({ ...c, domainsHtml: bpDomainsHtml(region, c), profileLabel: bpProf?.label }, region.replace('_', ' / '), '#0f766e')
      })
    ),
  ].join('')

  const quickRef = [
    ...sorted.map((inj, idx) => `<tr>
      <td style="font-weight:800;color:${sc(inj.severity)};font-family:monospace;text-align:center;">${idx + 1}</td>
      <td>${hesc(inj.date) || '—'}</td><td>${hesc(inj.label)}</td>
      <td style="color:${sc(inj.severity)};font-weight:700;font-size:11px;text-transform:uppercase;">${inj.severity === 'custom' ? 'Other' : inj.severity}</td>
      <td>${hesc(inj.location) || '—'}</td>
      <td>${inj.medicalCare === 'yes' ? 'Yes' : 'No'}</td>
      <td>${(inj.secondaries || []).length}</td>
      <td style="color:${gapStatus(inj).status === 'complete' ? '#166534' : '#92400e'};font-weight:600;font-size:10px;">${gapStatus(inj).status === 'complete' ? 'Complete' : 'Incomplete'}</td>
    </tr>`),
    ...state.mentalConditions.map(c => `<tr>
      <td style="color:#7c3aed;font-family:monospace;text-align:center;font-weight:700;">MH</td>
      <td>${hesc(c.date) || '—'}</td><td>${hesc(c.condition)}</td>
      <td style="color:#7c3aed;font-weight:700;font-size:11px;text-transform:uppercase;">Mental Health</td>
      <td>${hesc(c.location) || '—'}</td>
      <td>${c.medicalCare === 'yes' ? 'Yes' : 'No'}</td>
      <td>${(c.secondaries || []).length}</td>
      <td style="color:#1d4ed8;font-weight:600;font-size:10px;">${c.effectiveRating}%</td>
    </tr>`),
    ...state.headConditions.map(c => `<tr>
      <td style="color:#1d4ed8;font-family:monospace;text-align:center;font-weight:700;">H</td>
      <td>${hesc(c.date) || '—'}</td><td>${hesc(c.condition)}</td>
      <td style="color:#1d4ed8;font-weight:700;font-size:11px;text-transform:uppercase;">Head / Face</td>
      <td>${hesc(c.location) || '—'}</td>
      <td>${c.medicalCare === 'yes' ? 'Yes' : 'No'}</td>
      <td>${(c.secondaries || []).length}</td>
      <td style="color:#1d4ed8;font-weight:600;font-size:10px;">${c.effectiveRating}%</td>
    </tr>`),
    ...Object.entries(state.bpConditions).flatMap(([region, conds]) =>
      conds.map(c => `<tr>
        <td style="color:#0f766e;font-family:monospace;text-align:center;font-weight:700;">BP</td>
        <td>${hesc(c.date) || '—'}</td><td>${hesc(c.condition)}${c.sideLabel ? ` (${hesc(c.sideLabel)})` : ''}</td>
        <td style="color:#0f766e;font-weight:700;font-size:11px;text-transform:uppercase;">${region.replace('_', ' / ')}</td>
        <td>${hesc(c.location) || '—'}</td>
        <td>${c.medicalCare === 'yes' ? 'Yes' : 'No'}</td>
        <td>${(c.secondaries || []).length}</td>
        <td style="color:#1d4ed8;font-weight:600;font-size:10px;">${c.effectiveRating}%</td>
      </tr>`)
    ),
  ].join('')

  const gapSummary = incomplete.length
    ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px 16px;margin-bottom:16px;">
        <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:8px;">${incomplete.length} of ${sorted.length} injuries need additional evidence</div>
        ${incomplete.map(inj => {
          const g = gapStatus(inj)
          return `<div style="font-size:11px;color:#92400e;padding:2px 0;"><strong>#${sorted.indexOf(inj) + 1} ${hesc(inj.label)}:</strong> Missing — ${g.gaps.join(', ')}</div>`
        }).join('')}
      </div>`
    : `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#166534;font-weight:600;">All injuries have complete evidence records.</div>`

  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>VA Injury Summary</title>
<style>
body{font-family:Arial,sans-serif;margin:40px;font-size:13px;color:#111;}
h1{color:#1d4ed8;font-size:22px;margin:0 0 4px;}
.sub{color:#888;font-size:10px;margin-bottom:18px;font-family:monospace;}
.disc{background:#fffbeb;border-left:4px solid #fbbf24;padding:10px 14px;border-radius:4px;margin-bottom:18px;font-size:11px;color:#92400e;}
.stats{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;}
.stat{background:#eff3ff;border:1px solid #bfdbfe;border-radius:7px;padding:9px 16px;}
.sn{font-size:22px;font-weight:700;color:#1d4ed8;}.sl{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;font-family:monospace;}
.section-title{font-size:14px;font-weight:700;color:#1a2332;border-bottom:2px solid #1d4ed8;padding-bottom:6px;margin:24px 0 16px;text-transform:uppercase;letter-spacing:1px;font-family:monospace;}
table{width:100%;border-collapse:collapse;}
th{background:#1d4ed8;color:#fff;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;font-family:monospace;}
td{padding:8px 10px;border-bottom:1px solid #e0e7ff;vertical-align:top;}
tr:nth-child(even) td{background:#f8faff;}
.footer{margin-top:20px;font-size:10px;color:#aaa;font-family:monospace;border-top:1px solid #eee;padding-top:10px;display:flex;justify-content:space-between;}
@media print{button{display:none;}.detail-card{break-inside:avoid;}}
.detail-card{border:1px solid #d1d5db;border-radius:8px;padding:16px;margin-bottom:14px;background:#fff;page-break-inside:avoid;}
.dc-header{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid #e5e7eb;}
.dc-num{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;color:#fff;font-size:12px;font-weight:800;font-family:monospace;flex-shrink:0;}
.dc-label{font-size:16px;font-weight:700;color:#1a2332;}
.dc-sev{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;padding:3px 8px;border-radius:3px;font-family:monospace;}
.dc-complete{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;padding:3px 8px;border-radius:3px;font-family:monospace;}
.dc-incomplete{background:#fffbeb;color:#92400e;border:1px solid #fde68a;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;padding:3px 8px;border-radius:3px;font-family:monospace;}
.dc-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 20px;margin-bottom:8px;}
.dc-field{display:flex;gap:6px;font-size:12px;}
.dc-key{font-weight:700;color:#6b7280;text-transform:uppercase;font-size:10px;letter-spacing:.5px;font-family:monospace;min-width:100px;flex-shrink:0;}
.dc-val{color:#111;}
.dc-desc{margin-top:8px;font-size:12px;}
.dc-section{margin-top:8px;}
.dc-section-title{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;font-family:monospace;margin-bottom:4px;padding-bottom:3px;border-bottom:1px solid;}
.dc-tags{display:flex;flex-wrap:wrap;gap:4px;}
.dc-tag{font-size:10px;font-weight:600;padding:2px 8px;border-radius:3px;font-family:monospace;}
</style></head><body>
<h1>Injury Documentation Summary</h1>
<div class="sub">Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
<div class="disc"><strong>Notice:</strong> This records personal injury notes only. It does not determine VA eligibility or guarantee claim approval.</div>
<div class="stats">
  <div class="stat"><div class="sn">${totalConds}</div><div class="sl">Total Conditions</div></div>
  <div class="stat"><div class="sn">${totalMedical}</div><div class="sl">Medical Visits</div></div>
  <div class="stat"><div class="sn">${incomplete.length}</div><div class="sl">Needs Evidence</div></div>
  ${rounded > 0 ? `<div class="stat" style="border:2px solid #1d4ed8;"><div class="sn">${rounded}%</div><div class="sl">Combined Rating</div></div>` : ''}
</div>
<div class="section-title">Evidence Gap Summary</div>
${gapSummary}
<div class="section-title">Quick Reference</div>
<table><thead><tr><th>#</th><th>Date</th><th>Body Area</th><th>Severity</th><th>Installation</th><th>Medical</th><th>Secondary</th><th>Evidence</th></tr></thead>
<tbody>${quickRef}</tbody></table>
${(() => {
    const tl = buildTimeline(state)
    if (!tl.length) return ''
    const years = [...new Set(tl.map(i => i.date.slice(0, 4)))]
    const TYPE_COLOR: Record<string, string> = {
      'Injury': '#1d4ed8', 'Mental Health': '#7c3aed', 'Head & Face': '#1d4ed8',
    }
    const rows = years.map(yr => {
      const yearRow = `<tr><td colspan="5" style="background:#f1f5f9;font-weight:700;font-family:monospace;font-size:11px;color:#475569;padding:6px 10px;border-bottom:2px solid #e2e8f0;">── ${yr}</td></tr>`
      const itemRows = tl.filter(i => i.date.startsWith(yr)).map(item => {
        const color = TYPE_COLOR[item.type] || '#0f766e'
        const context = [item.location, item.event].filter(Boolean).map(hesc).join(' · ')
        return `<tr>
          <td>${hesc(item.date)}</td>
          <td style="font-weight:600;">${hesc(item.label)}</td>
          <td style="color:${color};font-weight:700;font-size:10px;font-family:monospace;text-transform:uppercase;">${item.type}</td>
          <td style="color:#1d4ed8;font-weight:600;font-size:11px;">${item.rating ? item.rating + '%' : '—'}</td>
          <td style="color:#6b7280;font-size:11px;">${context || '—'}</td>
        </tr>`
      }).join('')
      return yearRow + itemRows
    }).join('')
    return `<div class="section-title">Chronological Timeline</div>
<table><thead><tr><th>Date</th><th>Condition</th><th>Type</th><th>Rating</th><th>Location / Event</th></tr></thead>
<tbody>${rows}</tbody></table>`
  })()}
<div class="section-title">Detailed Injury Reports</div>
${detailCards}${evalDetailCards}
${buildSpecialClaimsHTML(state)}
${(() => {
    const text = hesc((state.personalStatement || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    return text
      ? `<div class="section-title">Personal Statement</div>
         <div style="border:1px solid #d1d5db;border-radius:8px;padding:16px 20px;font-size:13px;line-height:1.7;color:#1a2332;white-space:pre-wrap;">${text}</div>`
      : ''
  })()}
<div class="footer">
  <span>VA Claim Support Tool — personal documentation only</span>
  <span>Generated ${new Date().toLocaleDateString()}</span>
</div>
<script>window.print();<\/script>
</body></html>`)
  w.document.close()
}
