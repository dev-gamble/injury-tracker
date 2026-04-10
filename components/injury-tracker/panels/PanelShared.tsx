"use client"

import { useCallback, type ReactNode } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'

// ── HOOK ──────────────────────────────────────────────────────────────────────

/** Returns a stable callback that exits the active panel and enters pin-placement mode. */
export function usePinPlacement(key: string, label: string) {
  const setActivePanel = useInjuryStore((s) => s.setActivePanel)
  const setPinPlaceMode = useInjuryStore((s) => s.setPinPlaceMode)
  return useCallback(() => {
    setActivePanel(null)
    setPinPlaceMode({ key, label, fromPanel: true })
    document.body.classList.add('pin-placing')
    document.querySelectorAll('.body-wrap').forEach((el) => el.classList.add('pin-place-mode'))
  }, [key, label, setActivePanel, setPinPlaceMode])
}

// ── PANEL SHELL ───────────────────────────────────────────────────────────────

interface PanelShellProps {
  id?: string
  title: string
  onBack: () => void
  children: ReactNode
}

/** Outer panel wrapper: sticky header with title + back button, scrollable body. */
export function PanelShell({ id, title, onBack, children }: PanelShellProps) {
  return (
    <div className="mental-panel" id={id}>
      <div className="mh-header">
        <span className="mh-title">{title}</span>
        <button className="mh-back" onClick={onBack}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7" />
          </svg>
          {' '}Back to Map
        </button>
      </div>
      <div className="mh-body">
        {children}
      </div>
    </div>
  )
}

// ── RATINGS SUMMARY BAND ──────────────────────────────────────────────────────

export interface RatingsItem {
  id: number
  label: string
  rating: number
}

interface RatingsSummaryBandProps {
  title: string
  items: RatingsItem[]
  note?: string
}

/** Blue gradient band showing per-condition ratings. Used by Head and BP panels. */
export function RatingsSummaryBand({
  title,
  items,
  note = 'Each condition contributes separately to your combined VA rating',
}: RatingsSummaryBandProps) {
  return (
    <div className="mh-combined" style={{ background: 'linear-gradient(135deg,#0a2357 0%,#1d4ed8 100%)' }}>
      <div className="mh-combined-label" style={{ color: '#fff' }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
        {items.map((item) => (
          <div key={item.id} style={{ background: 'rgba(255,255,255,.15)', borderRadius: 6, padding: '6px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.9)', whiteSpace: 'nowrap', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--fm)', color: '#fff' }}>
              {item.rating}%
            </div>
          </div>
        ))}
      </div>
      <div className="mh-combined-note" style={{ marginTop: 8, color: 'rgba(255,255,255,.85)' }}>
        {note}
      </div>
    </div>
  )
}

// ── PANEL ACTIONS ─────────────────────────────────────────────────────────────

interface PanelActionsProps {
  hasConditions: boolean
  onPlacePin: () => void
  onBack: () => void
}

/** Bottom action zone: "Place Pin on Map" (when conditions exist) + "Back to Map (no pin)". */
export function PanelActions({ hasConditions, onPlacePin, onBack }: PanelActionsProps) {
  return (
    <div className="mh-done-wrap">
      {hasConditions && (
        <>
          <button className="mh-done-btn" onClick={onPlacePin}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z" />
            </svg>
            {' '}Place Pin on Map
          </button>
          <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 6 }}>
            Click to return to the map and place a pin for this condition.
          </div>
        </>
      )}
      <button className="mh-back-btn" onClick={onBack} style={{ marginTop: 8 }}>
        Back to Map (no pin)
      </button>
    </div>
  )
}

// ── CALC RATING ROW ───────────────────────────────────────────────────────────

/** "Calculated Rating X%" display box inside eval cards. */
export function CalcRatingRow({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(10,35,87,.04)', borderRadius: 6 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--fh)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Calculated Rating
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--fm)', color: 'var(--navy)' }}>
          {value}%
        </div>
      </div>
    </div>
  )
}

// ── MANUAL OVERRIDE CONTROL ───────────────────────────────────────────────────

interface ManualOverrideControlProps {
  active: boolean
  value: number | null
  overrideValues: number[]
  onToggle: (checked: boolean) => void
  onChange: (v: string) => void
}

/** Override checkbox + select inside eval cards. */
export function ManualOverrideControl({ active, value, overrideValues, onToggle, onChange }: ManualOverrideControlProps) {
  return (
    <div className="mh-override">
      <label>
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => onToggle(e.target.checked)}
        />
        {' '}Manual Override
      </label>
      {active && (
        <select value={value ?? 0} onChange={(e) => onChange(e.target.value)}>
          {overrideValues.map((v) => (
            <option key={v} value={v}>{v}%</option>
          ))}
        </select>
      )}
    </div>
  )
}
