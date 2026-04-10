// ── EXPORT UTILITIES ──────────────────────────────────────────────────────────

import type { AppState, Injury, MHCondition, HeadCondition, BPCondition } from '../types'
import { gapStatus } from './gaps'
import { combineVARatings, roundVARating } from './rating'
import { getPanelKeys } from '../data/bpMeta'
import { HEAD_PROFILES } from '../data/headData'
import { getBPProfile } from '../data/bpProfiles'
import { MH_DOMAINS } from '../data/mhData'

// ── HELPERS ────────────────────────────────────────────────────────────────────

function esc(v: unknown): string {
  const s = String(v ?? '').replace(/"/g, '""')
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s
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

/** Compute a simplified combined rating from all effective ratings in the store. */
function getCombinedRating(state: AppState): { combined: number; rounded: number } {
  const panelKeys = getPanelKeys()
  const ratings: number[] = []

  state.injuries
    .filter(i => !panelKeys.has(i.key))
    .forEach(i => ratings.push(i.rating ?? 0))

  // MH: highest rating only (VA single MH rule)
  if (state.mentalConditions.length > 0) {
    const highest = Math.max(...state.mentalConditions.map(c => c.effectiveRating))
    if (highest > 0) ratings.push(highest)
  }

  state.headConditions.forEach(c => { if (c.effectiveRating > 0) ratings.push(c.effectiveRating) })

  Object.values(state.bpConditions).forEach(arr => {
    arr.forEach(c => { if (c.effectiveRating > 0) ratings.push(c.effectiveRating) })
  })

  const { mstData } = state.specialClaims
  mstData.conditions.forEach(c => { if (c.rating > 0) ratings.push(c.rating) })

  const combined = combineVARatings(ratings.filter(r => r > 0))
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
  const { smcSelections } = state.specialClaims
  if (smcSelections.length) {
    csvRows.push('')
    csvRows.push(esc('SPECIAL MONTHLY COMPENSATION (SMC)'))
    smcSelections.forEach(id => csvRows.push(esc(id)))
  }

  // MST
  const { mstData, presumptiveData } = state.specialClaims
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
  }

  // Rating summary
  if (rounded > 0) {
    csvRows.push('')
    csvRows.push(esc(`COMBINED VA DISABILITY RATING: ${rounded}%`))
    csvRows.push(esc(`Exact: ${combined.toFixed(2)}%`))
  }

  downloadText(csvRows.join('\r\n'), `injury-report-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv')
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
    if (inj.secondaries?.length) txt += `  ${pad('Secondary:')} ${inj.secondaries.join(', ')}\n`
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
      MH_DOMAINS.forEach(d => {
        const dv = c.domains[d.id]
        if (dv && dv.level !== 'none') {
          txt += `    ${d.label}: ${dv.level} (${dv.frequency === '25plus' ? '25%+ of time' : '<25% of time'})\n`
        }
      })
      txt += `    Rating: ${c.effectiveRating}%${c.manualOverride !== null ? ' (manual override)' : ''}\n\n`
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
      txt += `    Rating: ${c.effectiveRating}%${c.manualOverride !== null ? ' (manual override)' : ''}\n\n`
    })
  }

  // Body part conditions
  Object.entries(state.bpConditions).forEach(([regionId, conds]) => {
    if (!conds.length) return
    txt += `${regionId.toUpperCase().replace('_', ' / ')} EVALUATION\n${LINE}\n\n`
    conds.forEach(c => {
      txt += `  ${c.condition}${c.sideLabel ? ` (${c.sideLabel})` : ''}\n  ${DASH}\n`
      txt += `    ${pad('Date:')} ${c.date || '—'}\n`
      if (c.location) txt += `    ${pad('Location:')} ${c.location}\n`
      if (c.event) txt += `    ${pad('Event:')} ${c.event}\n`
      if (c.description) txt += `    ${pad('Description:')} ${c.description}\n`
      if (c.medicalCare === 'yes') txt += `    ${pad('Medical Care:')} ${c.clinicName || 'Yes'}\n`
      if (c.extremity && c.extremity !== 'none') txt += `    ${pad('Extremity:')} ${c.extremity}\n`
      if (c.secondaries?.length) txt += `    ${pad('Secondary:')} ${c.secondaries.join(', ')}\n`
      txt += `    Rating: ${c.effectiveRating}%${c.manualOverride !== null ? ' (manual override)' : ''}\n\n`
    })
  })

  // MST
  const { mstData } = state.specialClaims
  if (mstData.conditions.length) {
    txt += `MST-RELATED CONDITIONS${mstData.privacyShield ? ' (PRIVACY SHIELD ACTIVE)' : ''}\n${LINE}\n\n`
    mstData.conditions.forEach(c => {
      const name = mstData.privacyShield ? 'Private Condition' : c.name
      txt += `  ${name}: ${c.rating}%\n`
      if (c.secondaries?.length) {
        c.secondaries.forEach(s => {
          const sname = mstData.privacyShield ? 'Private Secondary' : s.name
          txt += `    └ ${sname}: ${s.rating}%\n`
        })
      }
    })
    txt += '\n'
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

// ── PDF / PRINT SUMMARY ───────────────────────────────────────────────────────

export function exportSummary(state: AppState): void {
  const panelKeys = getPanelKeys()
  const filteredInj = state.injuries.filter(i => !panelKeys.has(i.key))
  const hasData = filteredInj.length || state.mentalConditions.length || state.headConditions.length ||
    Object.values(state.bpConditions).some(a => a.length)
  if (!hasData) { alert('No injuries to export.'); return }

  const sorted = [...filteredInj].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const { combined, rounded } = getCombinedRating(state)
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
        <span class="dc-label">${inj.label}</span>
        <span class="dc-sev" style="color:${c};">${stxt}</span>
        ${inj.rating != null ? `<span class="dc-sev" style="color:#1d4ed8;">${inj.rating}%</span>` : ''}
        <span class="dc-status ${g.status === 'complete' ? 'dc-complete' : 'dc-incomplete'}">${g.label}</span>
      </div>
      <div class="dc-grid">
        <div class="dc-field"><span class="dc-key">Date</span><span class="dc-val">${inj.date || '—'}</span></div>
        <div class="dc-field"><span class="dc-key">Body</span><span class="dc-val">${inj.pin.body} / ${inj.pin.side}</span></div>
        <div class="dc-field"><span class="dc-key">Installation</span><span class="dc-val">${inj.location || '—'}</span></div>
        <div class="dc-field"><span class="dc-key">Event / Duty</span><span class="dc-val">${inj.event || '—'}</span></div>
        <div class="dc-field"><span class="dc-key">Medical Care</span><span class="dc-val">${inj.medicalCare === 'yes' ? (inj.clinicName || 'Yes') : 'No'}</span></div>
        <div class="dc-field"><span class="dc-key">Witnesses</span><span class="dc-val">${inj.witnesses || '—'}</span></div>
        <div class="dc-field"><span class="dc-key">Still Being Seen</span><span class="dc-val">${inj.stillBeingSeen ? 'Yes' : 'No'}</span></div>
      </div>`
    if (inj.description) card += `<div class="dc-desc"><span class="dc-key">Description</span><div style="margin-top:2px;font-style:italic;color:#4b5563;">"${inj.description}"</div></div>`
    if (inj.secondaries?.length) card += `<div class="dc-section"><span class="dc-section-title" style="color:#3730a3;border-color:#c7d2fe;">Secondary Conditions</span><div class="dc-tags">${inj.secondaries.map(s => `<span class="dc-tag" style="background:#e0e7ff;color:#3730a3;border:1px solid #c7d2fe;">${s}</span>`).join('')}</div></div>`
    if (inj.functionalImpacts?.length) card += `<div class="dc-section"><span class="dc-section-title" style="color:#991b1b;border-color:#fecaca;">Daily Life Impact</span><div class="dc-tags">${inj.functionalImpacts.map(f => `<span class="dc-tag" style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca;">${f}</span>`).join('')}</div></div>`
    if (g.gaps.length) card += `<div class="dc-section"><span class="dc-section-title" style="color:#92400e;border-color:#fde68a;">Missing Evidence</span><div class="dc-tags">${g.gaps.map(m => `<span class="dc-tag" style="background:#fffbeb;color:#92400e;border:1px solid #fde68a;">${m}</span>`).join('')}</div></div>`
    card += '</div>'
    return card
  }).join('')

  const quickRef = sorted.map((inj, idx) => `<tr>
    <td style="font-weight:800;color:${sc(inj.severity)};font-family:monospace;text-align:center;">${idx + 1}</td>
    <td>${inj.date || '—'}</td><td>${inj.label}</td>
    <td style="color:${sc(inj.severity)};font-weight:700;font-size:11px;text-transform:uppercase;">${inj.severity === 'custom' ? 'Other' : inj.severity}</td>
    <td>${inj.location || '—'}</td>
    <td>${inj.medicalCare === 'yes' ? 'Yes' : 'No'}</td>
    <td>${(inj.secondaries || []).length}</td>
    <td style="color:${gapStatus(inj).status === 'complete' ? '#166534' : '#92400e'};font-weight:600;font-size:10px;">${gapStatus(inj).status === 'complete' ? 'Complete' : 'Incomplete'}</td>
  </tr>`).join('')

  const gapSummary = incomplete.length
    ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px 16px;margin-bottom:16px;">
        <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:8px;">${incomplete.length} of ${sorted.length} injuries need additional evidence</div>
        ${incomplete.map(inj => {
          const g = gapStatus(inj)
          return `<div style="font-size:11px;color:#92400e;padding:2px 0;"><strong>#${sorted.indexOf(inj) + 1} ${inj.label}:</strong> Missing — ${g.gaps.join(', ')}</div>`
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
<div class="section-title">Detailed Injury Reports</div>
${detailCards}
<div class="footer">
  <span>VA Claim Support Tool — personal documentation only</span>
  <span>Generated ${new Date().toLocaleDateString()}</span>
</div>
<script>window.print();<\/script>
</body></html>`)
  w.document.close()
}
