"use client"

import { useState, useRef, useCallback } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { resolvePin } from '../data/pins'
import type { Injury } from '../types'

// ── CSV PARSER ─────────────────────────────────────────────────────────────────

function parseCSVRow(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++ }
      else if (ch === '"') { inQuotes = false }
      else { current += ch }
    } else {
      if (ch === '"') { inQuotes = true }
      else if (ch === ',') { cells.push(current.trim()); current = '' }
      else { current += ch }
    }
  }
  cells.push(current.trim().replace(/\r$/, ''))
  return cells
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let current = ''
  let inQuotes = false
  for (const line of text.split('\n')) {
    if (inQuotes) {
      current += '\n' + line
    } else {
      current = line
    }
    const quoteCount = (current.match(/"/g) ?? []).length
    inQuotes = quoteCount % 2 !== 0
    if (!inQuotes) {
      rows.push(parseCSVRow(current))
      current = ''
    }
  }
  return rows
}

function sanitizeText(v: unknown): string {
  return String(v ?? '').replace(/[<>"'&]/g, '')
}

function findCol(headers: string[], names: string[]): number {
  for (const name of names) {
    const idx = headers.indexOf(name.toLowerCase())
    if (idx >= 0) return idx
  }
  return -1
}

function normSeverity(val: string | undefined): Injury['severity'] {
  if (!val) return 'moderate'
  const v = val.toLowerCase().trim()
  if (v === 'mild') return 'mild'
  if (v === 'severe') return 'severe'
  if (v === 'moderate') return 'moderate'
  if (v === 'other' || v === 'custom' || v === 'unknown') return 'custom'
  return 'moderate'
}

function normMedical(val: string | undefined): Injury['medicalCare'] {
  if (!val) return ''
  const v = val.toLowerCase().trim()
  if (v === 'yes' || v === 'y' || v === 'true' || v === '1') return 'yes'
  if (v === 'no' || v === 'n' || v === 'false' || v === '0') return 'no'
  return ''
}

function normBody(val: string | undefined): 'male' | 'female' {
  if (!val) return 'male'
  return val.toLowerCase().trim() === 'female' || val.toLowerCase().trim() === 'f' ? 'female' : 'male'
}

function normSide(val: string | undefined): 'front' | 'back' {
  if (!val) return 'front'
  const v = val.toLowerCase().trim()
  return v === 'back' || v === 'b' || v === 'rear' ? 'back' : 'front'
}

// ── IMPORT STATE ───────────────────────────────────────────────────────────────

interface MappedRow {
  label: string
  date: string
  severity: Injury['severity']
  location: string
  event: string
  desc: string
  medical: Injury['medicalCare']
  clinic: string
  witnesses: string
  body: 'male' | 'female'
  side: 'front' | 'back'
  secondary: string[]
  impacts: string[]
}

// ── COMPONENT ──────────────────────────────────────────────────────────────────

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const addInjury = useInjuryStore((s) => s.addInjury)
  const fileRef = useRef<HTMLInputElement>(null)

  const [status, setStatus] = useState<{ text: string; color?: string } | null>(null)
  const [preview, setPreview] = useState<MappedRow[] | null>(null)

  const reset = useCallback(() => {
    if (fileRef.current) fileRef.current.value = ''
    setStatus(null)
    setPreview(null)
  }, [])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.csv')) {
      setStatus({ text: 'Please select a .csv file.', color: 'var(--red)' })
      setPreview(null)
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target?.result as string)
      if (rows.length < 2) {
        setStatus({ text: 'File is empty or has no data rows.', color: 'var(--red)' })
        setPreview(null)
        return
      }

      const headers = rows[0].map((h) => h.toLowerCase().trim())
      const dataRows = rows.slice(1).filter((r) => r.some((c) => c.trim()))

      const colMap = {
        label:     findCol(headers, ['body area', 'label', 'injury', 'area', 'name']),
        date:      findCol(headers, ['date', 'date of injury', 'incident date']),
        severity:  findCol(headers, ['severity', 'sev']),
        location:  findCol(headers, ['installation', 'location', 'base', 'post']),
        event:     findCol(headers, ['event', 'training event', 'duty', 'incident']),
        desc:      findCol(headers, ['description', 'notes', 'desc', 'details']),
        medical:   findCol(headers, ['medical', 'medical care', 'medical care received']),
        clinic:    findCol(headers, ['clinic', 'hospital', 'clinic / hospital']),
        witnesses: findCol(headers, ['witnesses', 'witness']),
        body:      findCol(headers, ['body', 'body type']),
        side:      findCol(headers, ['side', 'view']),
        secondary: findCol(headers, ['secondary', 'secondary conditions']),
        impacts:   findCol(headers, ['impact', 'daily impact', 'daily life impact', 'functional impact']),
      }

      if (colMap.label === -1 && colMap.date === -1) {
        setStatus({ text: 'Could not find "Body Area" or "Date" columns. Please use the template.', color: 'var(--red)' })
        setPreview(null)
        return
      }

      const mapped: MappedRow[] = dataRows.map((r) => ({
        label:     sanitizeText(r[colMap.label] ?? 'Unknown'),
        date:      r[colMap.date] ?? '',
        severity:  normSeverity(r[colMap.severity]),
        location:  sanitizeText(r[colMap.location] ?? ''),
        event:     sanitizeText(r[colMap.event] ?? ''),
        desc:      sanitizeText(r[colMap.desc] ?? ''),
        medical:   normMedical(r[colMap.medical]),
        clinic:    sanitizeText(r[colMap.clinic] ?? ''),
        witnesses: sanitizeText(r[colMap.witnesses] ?? ''),
        body:      normBody(r[colMap.body]),
        side:      normSide(r[colMap.side]),
        secondary: (r[colMap.secondary] ?? '').split(';').map((s) => sanitizeText(s.trim())).filter(Boolean),
        impacts:   (r[colMap.impacts] ?? '').split(';').map((s) => sanitizeText(s.trim())).filter(Boolean),
      }))

      const found: string[] = []
      if (colMap.label >= 0) found.push('Body Area')
      if (colMap.date >= 0) found.push('Date')
      if (colMap.severity >= 0) found.push('Severity')
      if (colMap.location >= 0) found.push('Installation')
      if (colMap.event >= 0) found.push('Event')
      if (colMap.desc >= 0) found.push('Description')
      if (colMap.medical >= 0) found.push('Medical')
      if (colMap.clinic >= 0) found.push('Clinic')
      if (colMap.witnesses >= 0) found.push('Witnesses')
      if (colMap.secondary >= 0) found.push('Secondary')
      if (colMap.impacts >= 0) found.push('Impacts')

      setPreview(mapped)
      setStatus({ text: `Found ${mapped.length} injuries. Matched columns: ${found.join(', ')}`, color: 'var(--mild)' })
    }
    reader.readAsText(file)
  }, [])

  const handleConfirm = useCallback(() => {
    if (!preview?.length) return
    preview.forEach((m, i) => {
      const pin = resolvePin(m.label, m.body, m.side)
      const inj: Injury = {
        id: Date.now() + i,
        key: pin.key,
        label: m.label,
        date: m.date,
        severity: m.severity,
        location: m.location,
        event: m.event,
        description: m.desc,
        medicalCare: m.medical,
        clinicName: m.clinic,
        witnesses: m.witnesses,
        stillBeingSeen: false,
        functionalImpacts: m.impacts,
        secondaries: m.secondary,
        pin: { x: pin.x, y: pin.y, side: pin.side, body: pin.body, label: m.label },
      }
      addInjury(inj)
    })
    alert(`Imported ${preview.length} injuries successfully.`)
    handleClose()
  }, [preview, addInjury, handleClose])

  const downloadTemplate = useCallback(() => {
    const headers = ['Body Area', 'Date', 'Severity', 'Installation', 'Event', 'Description', 'Medical Care', 'Clinic', 'Witnesses', 'Body', 'Side', 'Secondary Conditions', 'Daily Life Impact']
    const example = ['Right Knee', '2020-03-15', 'severe', 'Fort Hood', 'Ruck march', 'Twisted knee during 12-mile ruck', 'Yes', 'Battalion Aid Station', 'SSG Smith', 'male', 'front', 'Limited ROM - knee; Degenerative joint disease', 'Cannot stand for long periods; Difficulty with stairs']
    const csv = headers.join(',') + '\r\n' + example.map((v) => (v.includes(',') ? `"${v}"` : v)).join(',') + '\r\n'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'injury-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  if (!isOpen) return null

  return (
    <div
      id="import-modal"
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div>
            <div className="ftitle">Import from CSV</div>
            <div className="fsub">Upload a spreadsheet to bulk-import injuries.</div>
          </div>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn-s" onClick={downloadTemplate} style={{ fontSize: 11, padding: '8px 14px' }}>
              Download Template
            </button>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Use this template for the correct column format.</span>
          </div>

          <div className="field">
            <label>Select CSV File</label>
            <input
              type="file"
              ref={fileRef}
              accept=".csv"
              onChange={handleFile}
              style={{ fontSize: 13 }}
            />
          </div>

          {status && (
            <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--fh)', letterSpacing: '.3px', color: status.color }}>
              {status.text}
            </div>
          )}

          {preview && (
            <div style={{ maxHeight: 250, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginTop: 8 }}>
                <thead>
                  <tr style={{ background: 'var(--navy)', color: '#fff' }}>
                    {['#', 'Body Area', 'Date', 'Severity', 'Pin'].map((h) => (
                      <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontFamily: 'var(--fh)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((m, idx) => {
                    const pin = resolvePin(m.label, m.body, m.side)
                    const pinOk = pin.key !== 'custom'
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 ? 'var(--surface2)' : undefined }}>
                        <td style={{ padding: '5px 8px', fontFamily: 'var(--fm)', fontWeight: 700 }}>{idx + 1}</td>
                        <td style={{ padding: '5px 8px' }}>{m.label}</td>
                        <td style={{ padding: '5px 8px', fontFamily: 'var(--fm)' }}>{m.date || '—'}</td>
                        <td style={{ padding: '5px 8px', textTransform: 'capitalize' }}>{m.severity}</td>
                        <td style={{ padding: '5px 8px', color: pinOk ? 'var(--mild)' : 'var(--moderate)' }}>{pinOk ? 'Matched' : 'Manual'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="form-actions">
            {preview && (
              <button className="btn-p" onClick={handleConfirm}>
                Import Injuries
              </button>
            )}
            <button className="btn-s" onClick={handleClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
