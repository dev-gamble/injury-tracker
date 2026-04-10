"use client"

import type { CondInfo } from '../types'

interface CondInfoFieldsProps {
  cond: CondInfo
  onChange: (patch: Partial<CondInfo>) => void
}

export function CondInfoFields({ cond, onChange }: CondInfoFieldsProps) {
  return (
    <div className="cond-info-fields">
      <div className="cond-info-row">
        <label className="cond-info-lbl">
          Date <span style={{ color: 'var(--red)' }}>*</span>
        </label>
        <input
          type="date"
          className="cond-info-input"
          value={cond.date ?? ''}
          onChange={(e) => onChange({ date: e.target.value })}
        />
        {!cond.date && <span className="cond-info-req">Required for timeline</span>}
      </div>

      <div className="cond-info-row">
        <label className="cond-info-lbl">Location</label>
        <input
          type="text"
          className="cond-info-input"
          placeholder="Duty station, base, deployment..."
          value={cond.location ?? ''}
          onChange={(e) => onChange({ location: e.target.value })}
        />
      </div>

      <div className="cond-info-row">
        <label className="cond-info-lbl">Event / Cause</label>
        <input
          type="text"
          className="cond-info-input"
          placeholder="What happened..."
          value={cond.event ?? ''}
          onChange={(e) => onChange({ event: e.target.value })}
        />
      </div>

      <div className="cond-info-row">
        <label className="cond-info-lbl">Description</label>
        <input
          type="text"
          className="cond-info-input"
          placeholder="Brief description..."
          value={cond.description ?? ''}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div className="cond-info-row">
        <label className="cond-info-lbl">Medical Care</label>
        <select
          className="cond-info-select"
          value={cond.medicalCare ?? ''}
          onChange={(e) => onChange({ medicalCare: e.target.value as CondInfo['medicalCare'] })}
        >
          <option value="">—</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {cond.medicalCare === 'yes' && (
          <input
            type="text"
            className="cond-info-input"
            placeholder="Clinic / provider name"
            value={cond.clinicName ?? ''}
            onChange={(e) => onChange({ clinicName: e.target.value })}
            style={{ flex: 1 }}
          />
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 8, whiteSpace: 'nowrap', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={!!cond.stillBeingSeen}
            onChange={(e) => onChange({ stillBeingSeen: e.target.checked })}
            style={{ width: 14, height: 14, accentColor: 'var(--red)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--fh)', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.3px' }}>
            Still being seen
          </span>
        </label>
      </div>

      <div className="cond-info-row">
        <label className="cond-info-lbl">Witnesses</label>
        <input
          type="text"
          className="cond-info-input"
          placeholder="Names of witnesses (if any)"
          value={cond.witnesses ?? ''}
          onChange={(e) => onChange({ witnesses: e.target.value })}
        />
      </div>
    </div>
  )
}
