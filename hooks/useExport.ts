'use client'

import { useTracker } from './useTrackerStore'
import { getRatingBreakdown } from '../lib/va/rating'

export function useExport() {
  const { state } = useTracker()

  function exportCSV() {
    const { injuries, mentalHealthConditions, headConditions, bpConditions } = state
    const rows: string[][] = []

    // Header
    rows.push(['Type', 'Condition', 'Side/Location', 'Rating %', 'Date', 'Installation', 'Event / Cause', 'Medical Care', 'Clinic'])

    for (const inj of injuries) {
      rows.push(['Physical', inj.label, '', String(inj._assignedRating ?? ''), inj.date, inj.installation, inj.event, inj.medicalCare, inj.clinicName])
      for (const sec of inj.secondaries) {
        const r = (inj.secondaryRatings ?? {})[sec] ?? ''
        rows.push(['  Secondary', sec, '', String(r), '', '', '', '', ''])
      }
    }

    for (const c of mentalHealthConditions) {
      rows.push(['Mental Health', c.condition, '', String(c.effectiveRating), c.date, c.installation, c.event, c.medicalCare, c.clinicName])
    }

    for (const c of headConditions) {
      rows.push(['Head/Face', c.condition, '', String(c.effectiveRating), c.date, c.installation, c.event, c.medicalCare, c.clinicName])
    }

    for (const [, conds] of Object.entries(bpConditions)) {
      for (const c of conds) {
        rows.push(['Body Part', c.condition, c.sideLabel, String(c.effectiveRating), c.date, c.installation, c.event, c.medicalCare, c.clinicName])
      }
    }

    const csv = rows.map(r => r.map(cell => `"${(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    downloadBlob(csv, 'va-claim-tracker.csv', 'text/csv')
  }

  function exportTXT() {
    const { injuries, mentalHealthConditions, headConditions, bpConditions, personalStatement, vocSecondaries, smcSelections } = state
    const result = getRatingBreakdown(state)
    const lines: string[] = []

    lines.push('VA CLAIM DOCUMENTATION')
    lines.push('='.repeat(60))
    lines.push(`Generated: ${new Date().toLocaleDateString()}`)
    lines.push('')

    lines.push('COMBINED RATING ESTIMATE')
    lines.push('-'.repeat(40))
    lines.push(`  Combined Rating: ${result.rounded}% (exact: ${result.combined.toFixed(1)}%)`)
    if (result.bilateral) lines.push(`  Bilateral factor applied (+${result.bilateralFactor.toFixed(1)}%)`)
    lines.push('')

    if (injuries.length > 0) {
      lines.push('PHYSICAL INJURIES')
      lines.push('-'.repeat(40))
      for (const inj of injuries) {
        lines.push(`  ${inj.label} [${inj.severity.toUpperCase()}]${inj._assignedRating != null ? ` — ${inj._assignedRating}%` : ''}`)
        if (inj.date) lines.push(`    Date: ${inj.date}`)
        if (inj.installation) lines.push(`    Installation: ${inj.installation}`)
        if (inj.event) lines.push(`    Event: ${inj.event}`)
        if (inj.description) lines.push(`    Description: ${inj.description}`)
        if (inj.medicalCare === 'yes' && inj.clinicName) lines.push(`    Medical Care: ${inj.clinicName}`)
        if (inj.secondaries.length > 0) {
          lines.push(`    Secondary conditions:`)
          for (const sec of inj.secondaries) {
            const r = (inj.secondaryRatings ?? {})[sec]
            lines.push(`      • ${sec}${r != null ? ` — ${r}%` : ''}`)
          }
        }
        lines.push('')
      }
    }

    const allMH = mentalHealthConditions
    if (allMH.length > 0) {
      lines.push('MENTAL HEALTH CONDITIONS')
      lines.push('-'.repeat(40))
      for (const c of allMH) {
        lines.push(`  ${c.condition} — ${c.effectiveRating}%${c.manualOverride !== null ? ' (manual)' : ''}`)
        if (c.event) lines.push(`    Event: ${c.event}`)
      }
      lines.push('')
    }

    const allHead = headConditions
    if (allHead.length > 0) {
      lines.push('HEAD / FACE CONDITIONS')
      lines.push('-'.repeat(40))
      for (const c of allHead) {
        lines.push(`  ${c.condition} — ${c.effectiveRating}%`)
      }
      lines.push('')
    }

    const bpAll = Object.entries(bpConditions).flatMap(([, conds]) => conds)
    if (bpAll.length > 0) {
      lines.push('BODY PART CONDITIONS')
      lines.push('-'.repeat(40))
      for (const c of bpAll) {
        lines.push(`  ${c.condition} (${c.sideLabel || 'N/A'}) — ${c.effectiveRating}%`)
      }
      lines.push('')
    }

    if (vocSecondaries.length > 0) {
      lines.push('VOCATIONAL LIMITATIONS')
      lines.push('-'.repeat(40))
      for (const v of vocSecondaries) lines.push(`  • ${v}`)
      lines.push('')
    }

    if (smcSelections.length > 0) {
      lines.push('SPECIAL MONTHLY COMPENSATION (SMC)')
      lines.push('-'.repeat(40))
      for (const s of smcSelections) lines.push(`  • ${s}`)
      lines.push('')
    }

    if (personalStatement.trim()) {
      lines.push('PERSONAL STATEMENT')
      lines.push('-'.repeat(40))
      lines.push(personalStatement)
      lines.push('')
    }

    lines.push('='.repeat(60))
    lines.push('DISCLAIMER: This document is for personal documentation purposes only.')
    lines.push('It does not constitute legal or medical advice.')

    downloadBlob(lines.join('\n'), 'va-claim-tracker.txt', 'text/plain')
  }

  function exportPDF() {
    const { injuries, mentalHealthConditions, headConditions, bpConditions, personalStatement } = state
    const result = getRatingBreakdown(state)

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>VA Claim Documentation</title>
<style>
  body { font-family: 'Courier New', monospace; font-size: 12px; color: #0a1628; margin: 0; padding: 30px; }
  h1 { font-size: 20px; text-align: center; border-bottom: 3px solid #c8102e; padding-bottom: 10px; }
  h2 { font-size: 14px; border-bottom: 1px solid #d8dde8; padding-bottom: 4px; margin-top: 22px; color: #0a2357; }
  .rating-big { text-align: center; font-size: 48px; font-weight: 800; color: #0a2357; margin: 16px 0; }
  .condition { margin-bottom: 10px; padding: 8px 10px; border: 1px solid #d8dde8; border-radius: 4px; }
  .condition strong { color: #0a2357; }
  .badge { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 700; }
  .mild { background: #f0fdf4; color: #16a34a; }
  .moderate { background: #fffbeb; color: #d97706; }
  .severe { background: #fef2f2; color: #c8102e; }
  .disclaimer { margin-top: 30px; padding: 10px; border: 1px solid #f0c080; background: #fff8f0; font-size: 11px; color: #7a4a00; }
  @media print { body { padding: 0 } }
</style>
</head>
<body>
<h1>VA Claim Documentation</h1>
<p style="text-align:center;color:#5a6782">Generated: ${new Date().toLocaleDateString()}</p>

<h2>Combined Rating Estimate</h2>
<div class="rating-big">${result.rounded}%</div>
<p style="text-align:center;color:#5a6782">Exact: ${result.combined.toFixed(1)}% → rounded to nearest 10%${result.bilateral ? ` (bilateral factor applied)` : ''}</p>

${injuries.length > 0 ? `<h2>Physical Injuries</h2>
${injuries.map(inj => `
<div class="condition">
  <strong>${inj.label}</strong> <span class="badge ${inj.severity}">${inj.severity}</span>${inj._assignedRating != null ? ` — <strong>${inj._assignedRating}%</strong>` : ''}<br>
  ${inj.date ? `<span style="color:#5a6782">Date: ${inj.date}</span><br>` : ''}
  ${inj.installation ? `<span style="color:#5a6782">Installation: ${inj.installation}</span><br>` : ''}
  ${inj.event ? `<em>${inj.event}</em><br>` : ''}
  ${inj.secondaries.length > 0 ? `<div style="margin-left:12px;color:#5a6782">Secondaries: ${inj.secondaries.join(', ')}</div>` : ''}
</div>`).join('')}` : ''}

${mentalHealthConditions.length > 0 ? `<h2>Mental Health Conditions</h2>
${mentalHealthConditions.map(c => `<div class="condition"><strong>${c.condition}</strong> — ${c.effectiveRating}%</div>`).join('')}` : ''}

${headConditions.length > 0 ? `<h2>Head / Face Conditions</h2>
${headConditions.map(c => `<div class="condition"><strong>${c.condition}</strong> — ${c.effectiveRating}%</div>`).join('')}` : ''}

${Object.values(bpConditions).flat().length > 0 ? `<h2>Body Part Conditions</h2>
${Object.values(bpConditions).flat().map(c => `<div class="condition"><strong>${c.condition}</strong> (${c.sideLabel}) — ${c.effectiveRating}%</div>`).join('')}` : ''}

${personalStatement.trim() ? `<h2>Personal Statement</h2>
<div style="white-space:pre-wrap;font-size:12px;line-height:1.6">${personalStatement.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : ''}

<div class="disclaimer">
  <strong>Disclaimer:</strong> This document is for personal documentation purposes only.
  It does not constitute legal or medical advice. Always consult a VSO or accredited VA attorney.
</div>
</body>
</html>`

    const win = window.open('', '_blank')
    if (win) {
      win.document.write(html)
      win.document.close()
      setTimeout(() => win.print(), 500)
    }
  }

  return { exportPDF, exportCSV, exportTXT }
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
