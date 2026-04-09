'use client'

interface ConditionInfoFields {
  date: string
  installation: string
  event: string
  description: string
  medicalCare: 'yes' | 'no' | ''
  clinicName: string
  witnesses: string
  stillBeingSeen?: boolean
}

interface ConditionInfoFormProps {
  values: ConditionInfoFields
  onChange: (updates: Partial<ConditionInfoFields>) => void
}

export function ConditionInfoForm({ values, onChange }: ConditionInfoFormProps) {
  return (
    <div className="cond-info-fields">
      <div className="cond-info-row">
        <span className="cond-info-lbl">Date</span>
        <input
          type="date"
          className="cond-info-input"
          value={values.date}
          onChange={e => onChange({ date: e.target.value })}
        />
        <span className="cond-info-req">approx OK</span>
      </div>
      <div className="cond-info-row">
        <span className="cond-info-lbl">Installation</span>
        <input
          type="text"
          className="cond-info-input"
          placeholder="e.g. Camp Pendleton, CA"
          value={values.installation}
          onChange={e => onChange({ installation: e.target.value })}
        />
      </div>
      <div className="cond-info-row">
        <span className="cond-info-lbl">Event / Cause</span>
        <input
          type="text"
          className="cond-info-input"
          placeholder="Brief description of how it happened"
          value={values.event}
          onChange={e => onChange({ event: e.target.value })}
        />
      </div>
      <div className="cond-info-row">
        <span className="cond-info-lbl">Description</span>
        <input
          type="text"
          className="cond-info-input"
          placeholder="Symptoms, limitations, impact..."
          value={values.description}
          onChange={e => onChange({ description: e.target.value })}
        />
      </div>
      <div className="cond-info-row">
        <span className="cond-info-lbl">Medical Care</span>
        <select
          className="cond-info-select"
          value={values.medicalCare}
          onChange={e => onChange({ medicalCare: e.target.value as 'yes' | 'no' | '' })}
        >
          <option value="">Select...</option>
          <option value="yes">Yes — received care</option>
          <option value="no">No — did not seek care</option>
        </select>
      </div>
      {values.medicalCare === 'yes' && (
        <div className="cond-info-row">
          <span className="cond-info-lbl">Clinic / MTF</span>
          <input
            type="text"
            className="cond-info-input"
            placeholder="Clinic or hospital name"
            value={values.clinicName}
            onChange={e => onChange({ clinicName: e.target.value })}
          />
        </div>
      )}
      <div className="cond-info-row">
        <span className="cond-info-lbl">Witnesses</span>
        <input
          type="text"
          className="cond-info-input"
          placeholder="Names of anyone who witnessed"
          value={values.witnesses}
          onChange={e => onChange({ witnesses: e.target.value })}
        />
      </div>
      {'stillBeingSeen' in values && (
        <div className="cond-info-row">
          <span className="cond-info-lbl">Still Being Seen</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <input
              type="checkbox"
              checked={!!values.stillBeingSeen}
              onChange={e => onChange({ stillBeingSeen: e.target.checked })}
            />
            Currently receiving treatment
          </label>
        </div>
      )}
    </div>
  )
}
