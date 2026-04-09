'use client'

import type { EvalDomain, DomainLevel, MHImpairmentLevel, MHFrequency } from '../../../lib/va/types'

// ── Generic discrete-level domain (body parts, head) ──────────────────────

interface DomainRatingRowProps {
  domain: EvalDomain
  value: number
  onChange: (value: number) => void
}

export function DomainRatingRow({ domain, value, onChange }: DomainRatingRowProps) {
  if (!domain.levels) return null

  return (
    <div className="cr-domain">
      <div className="cr-domain-head">
        <div className="cr-domain-label">{domain.label}</div>
        {domain.description && <div className="cr-domain-desc">{domain.description}</div>}
      </div>
      <div className="cr-hd-levels">
        {domain.levels.map((level: DomainLevel) => {
          const isActive = value === level.value
          return (
            <button
              key={level.value}
              className={`cr-hd-btn${isActive ? ' cr-hd-active' : ''}`}
              onClick={() => onChange(level.value)}
            >
              <span className="cr-hd-val">{level.value}%</span>
              <span className="cr-hd-lbl">{level.label}{level.description ? ` — ${level.description}` : ''}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Mental health domain (level + frequency) ───────────────────────────────

const MH_LEVELS: { value: MHImpairmentLevel; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Mod' },
  { value: 'severe', label: 'Severe' },
  { value: 'total', label: 'Total' },
]

const MH_FREQS: { value: MHFrequency; label: string }[] = [
  { value: 'less25', label: '<25%' },
  { value: 'less50', label: '<50%' },
  { value: 'more50', label: '>50%' },
  { value: 'always', label: 'Always' },
]

interface MHDomainRowProps {
  domain: EvalDomain
  level: MHImpairmentLevel
  frequency: MHFrequency
  onLevelChange: (level: MHImpairmentLevel) => void
  onFreqChange: (freq: MHFrequency) => void
}

export function MHDomainRow({ domain, level, frequency, onLevelChange, onFreqChange }: MHDomainRowProps) {
  return (
    <div className="cr-domain">
      <div className="cr-domain-head">
        <div className="cr-domain-label">{domain.label}</div>
        {domain.description && <div className="cr-domain-desc">{domain.description}</div>}
      </div>
      <div className="cr-levels">
        {MH_LEVELS.map(l => (
          <button
            key={l.value}
            className={`cr-lv-btn${level === l.value ? ` cr-lv-active-${l.value}` : ''}`}
            onClick={() => onLevelChange(l.value)}
          >
            {l.label}
          </button>
        ))}
      </div>
      {level !== 'none' && (
        <div className="cr-freq">
          <span className="cr-freq-label">Frequency:</span>
          {MH_FREQS.map(f => (
            <button
              key={f.value}
              className={`cr-freq-btn${frequency === f.value ? ' cr-freq-active' : ''}`}
              onClick={() => onFreqChange(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
