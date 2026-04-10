"use client"

import { useState, useEffect, useCallback } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { VA_AREA_CONDITIONS, FUNCTIONAL_IMPACTS, BP_PANEL_AREAS } from '../data/conditions'
import type { Injury } from '../types'

const AREA_OPTIONS = [
  { value: 'head', label: 'Head / Face / Eyes / Ears' },
  { value: 'mental', label: 'Mental Health' },
  { value: 'neck', label: 'Neck' },
  { value: 'shoulder', label: 'Shoulder' },
  { value: 'back', label: 'Back / Spine' },
  { value: 'chest', label: 'Chest / Lungs' },
  { value: 'abdomen', label: 'Abdomen / Pelvis' },
  { value: 'hip', label: 'Hip' },
  { value: 'elbow', label: 'Elbow / Forearm' },
  { value: 'wrist_hand', label: 'Wrist / Hand' },
  { value: 'knee', label: 'Knee' },
  { value: 'leg', label: 'Thigh / Shin / Calf' },
  { value: 'ankle_foot', label: 'Ankle / Foot' },
]

interface FormState {
  area: string
  condition: string
  conditionCustom: string
  customLabel: string
  date: string
  severity: string
  location: string
  event: string
  description: string
  medicalCare: string
  clinicName: string
  witnesses: string
  stillBeingSeen: boolean
  impacts: string[]
}

const DEFAULT_FORM: FormState = {
  area: '',
  condition: '',
  conditionCustom: '',
  customLabel: '',
  date: '',
  severity: 'moderate',
  location: '',
  event: '',
  description: '',
  medicalCare: '',
  clinicName: '',
  witnesses: '',
  stillBeingSeen: false,
  impacts: [],
}

function ImpactChips({ impacts, onRemove }: { impacts: string[]; onRemove: (v: string) => void }) {
  if (!impacts.length) {
    return (
      <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>No limitations added</span>
    )
  }
  return (
    <>
      {impacts.map((fi) => (
        <span
          key={fi}
          className="sc-chip"
          style={{ background: 'rgba(200,16,46,.1)', color: 'var(--red2)', border: '1px solid rgba(200,16,46,.2)' }}
        >
          <span>{fi}</span>
          <span
            className="sc-rm"
            style={{ color: 'var(--red)', cursor: 'pointer' }}
            onClick={() => onRemove(fi)}
          >
            ×
          </span>
        </span>
      ))}
    </>
  )
}

export function InjuryModal() {
  const injuries = useInjuryStore((s) => s.injuries)
  const editingId = useInjuryStore((s) => s.ui.editingId)
  const pendingPin = useInjuryStore((s) => s.ui.pendingPin)
  const setEditingId = useInjuryStore((s) => s.setEditingId)
  const setPendingPin = useInjuryStore((s) => s.setPendingPin)
  const setActivePanel = useInjuryStore((s) => s.setActivePanel)
  const addInjury = useInjuryStore((s) => s.addInjury)
  const updateInjury = useInjuryStore((s) => s.updateInjury)

  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [customImpactInput, setCustomImpactInput] = useState('')
  const [condError, setCondError] = useState(false)
  const [areaError, setAreaError] = useState(false)

  const isOpen = editingId !== null || pendingPin !== null
  const isEditing = editingId !== null
  const isCustomPin = pendingPin?.key === 'custom'

  // Populate form when editing
  useEffect(() => {
    if (editingId === null) return
    const inj = injuries.find((i) => i.id === editingId)
    if (!inj) return
    setForm({
      area: inj.key,
      condition: inj.label,
      conditionCustom: '',
      customLabel: inj.label,
      date: inj.date ?? '',
      severity: inj.severity ?? 'moderate',
      location: inj.location ?? '',
      event: inj.event ?? '',
      description: inj.description ?? '',
      medicalCare: inj.medicalCare ?? '',
      clinicName: inj.clinicName ?? '',
      witnesses: inj.witnesses ?? '',
      stillBeingSeen: !!inj.stillBeingSeen,
      impacts: [...(inj.functionalImpacts ?? [])],
    })
    setCondError(false)
    setAreaError(false)
  }, [editingId, injuries])

  // Reset form when opening for new pin
  useEffect(() => {
    if (pendingPin === null || editingId !== null) return
    setForm({
      ...DEFAULT_FORM,
      area: isCustomPin ? '' : pendingPin.key,
      condition: isCustomPin ? '' : pendingPin.label,
      severity: pendingPin.key === 'other' ? 'custom' : 'moderate',
    })
    setCondError(false)
    setAreaError(false)
  }, [pendingPin, editingId, isCustomPin])

  const set = useCallback((patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch })), [])

  const handleAreaChange = useCallback((area: string) => {
    setAreaError(false)
    // Areas that open an eval panel instead of the form
    if (area && BP_PANEL_AREAS.has(area)) {
      if (area === 'mental') {
        setPendingPin(null)
        setEditingId(null)
        setActivePanel('mental')
        return
      }
      if (area === 'head') {
        setPendingPin(null)
        setEditingId(null)
        setActivePanel('head')
        return
      }
      // Other BP areas
      setPendingPin(null)
      setEditingId(null)
      setActivePanel(area as never)
      return
    }
    set({ area, condition: '', conditionCustom: '' })
  }, [set, setActivePanel, setEditingId, setPendingPin])

  const resolveLabel = useCallback((): string => {
    if (form.customLabel.trim()) return form.customLabel.trim()
    if (form.condition === '__custom__') return form.conditionCustom.trim()
    if (form.condition) return form.condition
    return ''
  }, [form])

  const handleSave = useCallback(() => {
    if (!form.date) { alert('Please select a date.'); return }

    if (isEditing) {
      const inj = injuries.find((i) => i.id === editingId)
      if (!inj) return
      const label = resolveLabel() || inj.label
      updateInjury(editingId!, {
        label,
        date: form.date,
        severity: form.severity as Injury['severity'],
        location: form.location,
        event: form.event,
        description: form.description,
        medicalCare: form.medicalCare as Injury['medicalCare'],
        clinicName: form.clinicName,
        witnesses: form.witnesses,
        stillBeingSeen: form.stillBeingSeen,
        functionalImpacts: [...form.impacts],
        key: form.area || inj.key,
        pin: { ...inj.pin, label },
      })
      setEditingId(null)
      return
    }

    // New injury
    if (!pendingPin) { alert('No pin placed. Click the body map or Quick Select first.'); return }

    if (isCustomPin && !form.area) {
      setAreaError(true)
      return
    }

    const label = resolveLabel() || pendingPin.label
    if (!label) {
      setCondError(true)
      return
    }

    const inj: Injury = {
      id: Date.now(),
      key: isCustomPin ? form.area : pendingPin.key,
      label,
      date: form.date,
      severity: form.severity as Injury['severity'],
      location: form.location,
      event: form.event,
      description: form.description,
      medicalCare: form.medicalCare as Injury['medicalCare'],
      clinicName: form.clinicName,
      witnesses: form.witnesses,
      stillBeingSeen: form.stillBeingSeen,
      functionalImpacts: [...form.impacts],
      pin: { x: pendingPin.x, y: pendingPin.y, side: pendingPin.side, body: pendingPin.body, label },
    }
    addInjury(inj)
    setPendingPin(null)
  }, [form, isEditing, isCustomPin, editingId, pendingPin, injuries, resolveLabel, updateInjury, addInjury, setEditingId, setPendingPin])

  const handleCancel = useCallback(() => {
    setPendingPin(null)
    setEditingId(null)
    setCondError(false)
    setAreaError(false)
  }, [setEditingId, setPendingPin])

  const addImpact = useCallback((val: string) => {
    if (!val || form.impacts.includes(val)) return
    set({ impacts: [...form.impacts, val] })
  }, [form.impacts, set])

  const removeImpact = useCallback((val: string) => {
    set({ impacts: form.impacts.filter((i) => i !== val) })
  }, [form.impacts, set])

  const areaConditions = form.area ? (VA_AREA_CONDITIONS[form.area] ?? []) : []

  const title = isEditing
    ? `Edit Injury — ${injuries.find((i) => i.id === editingId)?.label ?? ''}`
    : isCustomPin ? 'Log Injury — Custom Pin'
    : `Log Injury — ${pendingPin?.label ?? ''}`

  const subtitle = isEditing
    ? 'Update the details below.'
    : isCustomPin ? 'Select an area and condition, then fill in the details.'
    : 'Complete the fields below.'

  if (!isOpen) return null

  return (
    <div
      id="form-modal"
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) handleCancel() }}
    >
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="ftitle">{title}</div>
            <div className="fsub">{subtitle}</div>
          </div>
          <button className="modal-close" onClick={handleCancel}>×</button>
        </div>

        <div className="modal-body">
          {/* Body Area (shown for custom pins and editing) */}
          {(isCustomPin || isEditing) && (
            <div
              className="field"
              style={{ background: 'var(--al)', border: '1px solid rgba(29,78,216,.2)', borderRadius: 8, padding: '12px 14px', gap: 6 }}
            >
              <label style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>
                Body Area Affected <span style={{ color: 'var(--severe)' }}>*</span>
              </label>
              <select
                value={form.area}
                onChange={(e) => handleAreaChange(e.target.value)}
                style={areaError ? { borderColor: 'var(--severe)' } : undefined}
              >
                <option value="">— Select area —</option>
                {AREA_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {areaError && <span style={{ fontSize: 11, color: 'var(--severe)' }}>Please select a body area</span>}
            </div>
          )}

          {/* Condition dropdown (shown when area selected for custom, or always for non-custom) */}
          {(areaConditions.length > 0 || (isEditing && form.area)) && (
            <div
              className="field"
              style={{ background: 'var(--al)', border: '1px solid rgba(29,78,216,.2)', borderRadius: 8, padding: '12px 14px', gap: 6 }}
            >
              <label style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>
                Primary Condition <span style={{ color: 'var(--severe)' }}>*</span>
              </label>
              <select
                value={form.condition}
                onChange={(e) => {
                  setCondError(false)
                  set({ condition: e.target.value, conditionCustom: '' })
                }}
                style={condError && !form.condition ? { borderColor: 'var(--severe)' } : undefined}
              >
                <option value="">— Select condition —</option>
                {areaConditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__custom__">Other / Custom...</option>
              </select>
              {form.condition === '__custom__' && (
                <input
                  type="text"
                  value={form.conditionCustom}
                  onChange={(e) => { setCondError(false); set({ conditionCustom: e.target.value }) }}
                  placeholder="Enter custom condition name..."
                  style={{ marginTop: 4, ...(condError && !form.conditionCustom ? { borderColor: 'var(--severe)' } : {}) }}
                />
              )}
            </div>
          )}

          {/* Pin label override */}
          {(isEditing || (isCustomPin && form.condition)) && (
            <div
              className="field"
              style={{ background: 'var(--al)', border: '1px solid rgba(29,78,216,.2)', borderRadius: 8, padding: '12px 14px', gap: 6 }}
            >
              <label style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>Pin Label</label>
              <input
                type="text"
                value={form.customLabel}
                onChange={(e) => set({ customLabel: e.target.value })}
                placeholder="e.g. Left ear ringing, jaw pain, burn scar on forearm..."
              />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Override the condition name shown on the pin (optional).</span>
            </div>
          )}

          {/* Date */}
          <div className="field">
            <label>Date of Injury</label>
            <input type="date" value={form.date} onChange={(e) => set({ date: e.target.value })} />
          </div>

          {/* Location */}
          <div className="field">
            <label>Location / Installation</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set({ location: e.target.value })}
              placeholder="e.g. Fort Hood, Camp Pendleton, FOB Salerno"
            />
          </div>

          {/* Event */}
          <div className="field">
            <label>Training Event / Duty</label>
            <input
              type="text"
              value={form.event}
              onChange={(e) => set({ event: e.target.value })}
              placeholder="e.g. Ruck march, obstacle course, motor pool"
            />
          </div>

          {/* Description */}
          <div className="field">
            <label>Description / Notes</label>
            <textarea
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="Describe the injury, symptoms, or any additional context..."
            />
          </div>

          {/* Medical care + clinic + still being seen */}
          <div className="fgrid">
            <div className="field">
              <label>Medical Care Received</label>
              <select value={form.medicalCare} onChange={(e) => set({ medicalCare: e.target.value })}>
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {form.medicalCare === 'yes' && (
              <div className="field">
                <label>Clinic / Hospital</label>
                <input
                  type="text"
                  value={form.clinicName}
                  onChange={(e) => set({ clinicName: e.target.value })}
                  placeholder="e.g. Battalion Aid Station"
                />
              </div>
            )}
            <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="f-still-seen"
                checked={form.stillBeingSeen}
                onChange={(e) => set({ stillBeingSeen: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: 'var(--red)', cursor: 'pointer' }}
              />
              <label
                htmlFor="f-still-seen"
                style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, color: 'var(--navy)', letterSpacing: '.5px', fontFamily: 'var(--fh)', cursor: 'pointer', margin: 0 }}
              >
                Still being seen?
              </label>
            </div>
          </div>

          {/* Witnesses */}
          <div className="field">
            <label>Witnesses (Optional)</label>
            <input
              type="text"
              value={form.witnesses}
              onChange={(e) => set({ witnesses: e.target.value })}
              placeholder="e.g. Squad leader, medic, buddy"
            />
          </div>

          {/* Functional Impact chips */}
          <div className="field">
            <label>Daily Life Impact</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, minHeight: 24, marginBottom: 4 }}>
              <ImpactChips impacts={form.impacts} onRemove={removeImpact} />
            </div>
            <select
              value=""
              onChange={(e) => { addImpact(e.target.value); e.target.value = '' }}
            >
              <option value="">+ Add a functional limitation...</option>
              {FUNCTIONAL_IMPACTS.map((fi) => (
                <option key={fi} value={fi}>{fi}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input
                type="text"
                value={customImpactInput}
                onChange={(e) => setCustomImpactInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { addImpact(customImpactInput); setCustomImpactInput('') }
                }}
                placeholder="Other limitation..."
                style={{ flex: 1, padding: '7px 10px', borderRadius: 4, border: '1px solid var(--border2)', fontSize: 13, fontFamily: 'var(--fd)' }}
              />
              <button
                type="button"
                onClick={() => { addImpact(customImpactInput); setCustomImpactInput('') }}
                style={{ padding: '7px 12px', borderRadius: 4, border: 'none', background: 'var(--navy)', color: '#fff', fontFamily: 'var(--fh)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', cursor: 'pointer' }}
              >
                Add
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-p" onClick={handleSave}>
              {isEditing ? 'Update Injury' : 'Save Injury'}
            </button>
            <button className="btn-s" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
