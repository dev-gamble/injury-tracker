'use client'

import { useState, useEffect } from 'react'
import type { Injury, PlacedPin, Severity } from '../../../lib/va/types'
import { useTracker, nextId } from '../../../hooks/useTrackerStore'

interface InjuryFormModalProps {
  /** When set, we're editing an existing injury. When null, we're adding a new one. */
  injury: Injury | null
  /** The pin placement for a new injury (from body click). Null when editing. */
  initialPin: PlacedPin | null
  /** Body part label from the sidebar click or pin key */
  initialLabel?: string
  onClose: () => void
}

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
  { value: 'custom', label: 'Custom' },
]

const EMPTY_FORM = {
  label: '',
  severity: 'mild' as Severity,
  date: '',
  installation: '',
  event: '',
  description: '',
  medicalCare: '' as 'yes' | 'no' | '',
  clinicName: '',
  witnesses: '',
  notes: '',
  dailyImpact: '',
}

export function InjuryFormModal({ injury, initialPin, initialLabel, onClose }: InjuryFormModalProps) {
  const { dispatch } = useTracker()

  const [form, setForm] = useState(() => {
    if (injury) {
      return {
        label: injury.label,
        severity: injury.severity,
        date: injury.date,
        installation: injury.installation,
        event: injury.event,
        description: injury.description,
        medicalCare: injury.medicalCare,
        clinicName: injury.clinicName,
        witnesses: injury.witnesses,
        notes: injury.notes,
        dailyImpact: injury.dailyImpact,
      }
    }
    return { ...EMPTY_FORM, label: initialLabel ?? '' }
  })

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleSubmit() {
    if (!form.label.trim()) return

    if (injury) {
      dispatch({ type: 'UPDATE_INJURY', id: injury.id, updates: { ...form } })
    } else {
      const newInjury: Injury = {
        id: nextId(),
        key: '',
        ...form,
        secondaries: [],
        pin: initialPin,
      }
      dispatch({ type: 'ADD_INJURY', injury: newInjury })
    }
    onClose()
  }

  // Trap focus in modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-panel">
        <div className="modal-header">
          <div>
            <div className="ftitle">{injury ? 'Edit Injury' : 'Log New Injury'}</div>
            <div className="fsub">
              {injury ? 'Update details for this injury' : 'Record the details of this service-connected injury'}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Label */}
          <div className="field">
            <label>Injury / Condition Name</label>
            <input
              type="text"
              value={form.label}
              onChange={e => update('label', e.target.value)}
              placeholder="e.g. Left Knee Pain, Lower Back Strain"
              autoFocus
            />
          </div>

          {/* Severity */}
          <div className="field">
            <label>Severity</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {SEVERITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('severity', opt.value)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    border: `2px solid ${form.severity === opt.value ? `var(--${opt.value})` : 'var(--border)'}`,
                    borderRadius: 4,
                    background: form.severity === opt.value ? `var(--${opt.value})20` : 'var(--surface)',
                    color: form.severity === opt.value ? `var(--${opt.value})` : 'var(--muted)',
                    fontFamily: 'var(--fh)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '.3px',
                    transition: 'all .12s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="fgrid">
            <div className="field">
              <label>Date of Injury</label>
              <input type="date" value={form.date} onChange={e => update('date', e.target.value)} />
            </div>
            <div className="field">
              <label>Installation / Location</label>
              <input
                type="text"
                value={form.installation}
                onChange={e => update('installation', e.target.value)}
                placeholder="e.g. Camp Pendleton, CA"
              />
            </div>
          </div>

          <div className="field">
            <label>How it happened (event / cause)</label>
            <input
              type="text"
              value={form.event}
              onChange={e => update('event', e.target.value)}
              placeholder="Brief description of incident"
            />
          </div>

          <div className="field">
            <label>Symptoms / Description</label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe pain, range of motion loss, functional impact..."
              rows={3}
            />
          </div>

          <div className="fgrid">
            <div className="field">
              <label>Medical Care Received?</label>
              <select value={form.medicalCare} onChange={e => update('medicalCare', e.target.value as 'yes' | 'no' | '')}>
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {form.medicalCare === 'yes' && (
              <div className="field">
                <label>Clinic / MTF Name</label>
                <input
                  type="text"
                  value={form.clinicName}
                  onChange={e => update('clinicName', e.target.value)}
                  placeholder="e.g. Naval Hospital Camp Pendleton"
                />
              </div>
            )}
          </div>

          <div className="field">
            <label>Witnesses</label>
            <input
              type="text"
              value={form.witnesses}
              onChange={e => update('witnesses', e.target.value)}
              placeholder="Names of anyone who witnessed the incident"
            />
          </div>

          <div className="field">
            <label>Daily Impact</label>
            <textarea
              value={form.dailyImpact}
              onChange={e => update('dailyImpact', e.target.value)}
              placeholder="How does this affect your daily life, sleep, work, activities?"
              rows={2}
            />
          </div>

          <div className="field">
            <label>Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Any other relevant information"
              rows={2}
            />
          </div>

          <div className="form-actions">
            <button className="btn-p" onClick={handleSubmit} disabled={!form.label.trim()}>
              {injury ? 'Save Changes' : 'Add Injury'}
            </button>
            <button className="btn-s" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
