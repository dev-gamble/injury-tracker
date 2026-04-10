import type { Injury } from '../types'

interface GapField {
  key: keyof Injury
  label: string
  check?: (v: unknown) => boolean
  condition?: (i: Injury) => boolean
}

const GAP_FIELDS: GapField[] = [
  { key: 'description', label: 'Description / Notes' },
  { key: 'event', label: 'Service Event' },
  { key: 'medicalCare', label: 'Medical Evidence', check: (v) => v === 'yes' },
  { key: 'location', label: 'Installation / Location' },
  { key: 'clinicName', label: 'Clinic Name', condition: (i) => i.medicalCare === 'yes' },
]

export function getGaps(inj: Injury): string[] {
  const missing: string[] = []
  GAP_FIELDS.forEach((f) => {
    if (f.condition && !f.condition(inj)) return
    const val = inj[f.key]
    const present = f.check
      ? f.check(val)
      : typeof val === 'string' && val.trim() !== ''
    if (!present) missing.push(f.label)
  })
  return missing
}

export interface GapStatus {
  status: 'complete' | 'incomplete'
  color: string
  bg: string
  border: string
  label: string
  gaps: string[]
}

export function gapStatus(inj: Injury): GapStatus {
  const gaps = getGaps(inj)
  if (gaps.length === 0) {
    return {
      status: 'complete',
      color: 'var(--mild)',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      label: 'Complete',
      gaps,
    }
  }
  return {
    status: 'incomplete',
    color: 'var(--moderate)',
    bg: '#fffbeb',
    border: '#fde68a',
    label: `Needs Evidence (${gaps.length})`,
    gaps,
  }
}
