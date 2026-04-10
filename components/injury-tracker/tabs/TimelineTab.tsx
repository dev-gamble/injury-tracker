"use client"

import { useInjuryStore } from '../store/useInjuryStore'
import { gapStatus } from '../utils/gaps'
import { getPanelKeys, BP_META } from '../data/bpMeta'
import { SEVERITY_COLOR, SEVERITY_BG, SEVERITY_BORDER } from '../data/pins'
import { ratingToSeverity } from '../utils/rating'
import type { Injury, MHCondition, HeadCondition, BPCondition, BPRegion } from '../types'

interface TimelineEntry {
  type: 'injury' | 'mental' | 'head' | BPRegion
  id: string | number
  label: string
  date: string
  severity: string
  location: string
  event: string
  description: string
  medicalCare: string
  clinicName: string
  witnesses: string
  functionalImpacts: string[]
  secondaries: string[]
  pin: { body?: string; side?: string } | null
  injRef?: Injury
}

function GapBar({ inj }: { inj: Injury }) {
  const g = gapStatus(inj)
  return (
    <div
      style={{
        background: g.bg,
        border: `1px solid ${g.border}`,
        borderRadius: 5,
        padding: '5px 9px',
        marginTop: 6,
        fontSize: 11,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: g.gaps.length ? 4 : 0 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: g.color, flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontWeight: 700, color: g.color, fontFamily: 'var(--fh)', textTransform: 'uppercase', letterSpacing: '.5px', fontSize: 10 }}>
          {g.label}
        </span>
      </div>
      {g.gaps.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {g.gaps.map((m) => (
            <span key={m} style={{ background: 'rgba(217,119,6,.12)', color: '#92400e', fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 3, fontFamily: 'var(--fm)' }}>
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function TypeTag({ type }: { type: string }) {
  if (type === 'mental') {
    return (
      <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--fh)', color: '#7c3aed', background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '1px 5px', borderRadius: 3 }}>
        Mental Health
      </span>
    )
  }
  if (type === 'head') {
    return (
      <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--fh)', color: 'var(--navy)', background: '#eff3ff', border: '1px solid #bfdbfe', padding: '1px 5px', borderRadius: 3 }}>
        Head &amp; Face
      </span>
    )
  }
  const bpMeta = BP_META[type as BPRegion]
  if (bpMeta) {
    return (
      <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--fh)', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1px 5px', borderRadius: 3 }}>
        {bpMeta.title}
      </span>
    )
  }
  return null
}

function EntryCard({ entry, onEdit, onDelete }: {
  entry: TimelineEntry
  onEdit?: () => void
  onDelete?: () => void
}) {
  const isPhysical = entry.type === 'injury'
  const sc = SEVERITY_COLOR[entry.severity] ?? SEVERITY_COLOR.custom
  const sbg = SEVERITY_BG[entry.severity] ?? SEVERITY_BG.custom
  const sbd = SEVERITY_BORDER[entry.severity] ?? SEVERITY_BORDER.custom
  const stxt = entry.severity === 'custom' ? 'Other' : entry.severity

  const numLabel = isPhysical
    ? String(entry.id).slice(-2)
    : entry.type === 'mental' ? 'MH'
    : entry.type === 'head' ? 'HD'
    : (BP_META[entry.type as BPRegion]?.abbr ?? 'BP')

  return (
    <div className={`ic ${entry.severity}`}>
      <div style={{ flex: 1 }}>
        <div className="ic-title">
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 22, height: 22, borderRadius: '50%', background: sc, color: '#fff',
            fontSize: isPhysical ? 11 : 8, fontWeight: 800, fontFamily: 'var(--fm)',
            flexShrink: 0, padding: '0 4px',
          }}>
            {numLabel}
          </span>
          {' '}{entry.label}{' '}
          <span className="stag" style={{ background: sbg, color: sc, border: `1px solid ${sbd}` }}>
            {stxt}
          </span>
          {' '}<TypeTag type={entry.type} />{' '}
          {entry.pin && (
            <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--fm)' }}>
              {entry.pin.body} · {entry.pin.side}
            </span>
          )}
        </div>

        <div className="ic-meta">
          {entry.date}
          {entry.location ? ` · ${entry.location}` : ''}
          {entry.event ? ` · ${entry.event}` : ''}
        </div>

        {entry.description && (
          <div className="ic-desc">&quot;{entry.description}&quot;</div>
        )}

        {entry.medicalCare === 'yes' && (
          <div className="ic-med">
            ✓ Medical care{entry.clinicName ? ` — ${entry.clinicName}` : ' received'}
          </div>
        )}

        {entry.witnesses && (
          <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 3 }}>
            Witnesses: {entry.witnesses}
          </div>
        )}

        {entry.functionalImpacts.length > 0 && (
          <div style={{ marginTop: 6, padding: '6px 8px', background: 'rgba(200,16,46,.06)', borderRadius: 6, border: '1px solid rgba(200,16,46,.15)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>Daily Life Impact</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {entry.functionalImpacts.map((fi) => (
                <span key={fi} style={{ background: 'rgba(200,16,46,.1)', color: 'var(--red2)', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 3, fontFamily: 'var(--fm)' }}>
                  {fi}
                </span>
              ))}
            </div>
          </div>
        )}

        {entry.secondaries.length > 0 && (
          <div style={{ marginTop: 6, padding: '6px 8px', background: '#e0e7ff', borderRadius: 6, border: '1px solid #c7d2fe' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#3730a3', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>Secondary Conditions</div>
            {entry.secondaries.map((s) => (
              <div key={s} style={{ fontSize: 11, color: '#3730a3', padding: '1px 0' }}>• {s}</div>
            ))}
          </div>
        )}

        {isPhysical && entry.injRef && <GapBar inj={entry.injRef} />}
      </div>

      {onDelete && (
        <button className="del" onClick={onDelete}>×</button>
      )}
      {onEdit && (
        <button className="edit-btn" onClick={onEdit} title="Edit">✏</button>
      )}
    </div>
  )
}

export function TimelineTab() {
  const injuries = useInjuryStore((s) => s.injuries)
  const mentalConditions = useInjuryStore((s) => s.mentalConditions)
  const headConditions = useInjuryStore((s) => s.headConditions)
  const bpConditions = useInjuryStore((s) => s.bpConditions)
  const specialClaims = useInjuryStore((s) => s.specialClaims)
  const setActiveTab = useInjuryStore((s) => s.setActiveTab)
  const removeInjury = useInjuryStore((s) => s.removeInjury)
  const setEditingId = useInjuryStore((s) => s.setEditingId)
  const activeTab = useInjuryStore((s) => s.ui.activeTab)

  // Gather timeline entries
  const panelKeys = getPanelKeys()
  const entries: TimelineEntry[] = []

  // Physical injuries
  injuries
    .filter((i) => !panelKeys.has(i.key) && i.date)
    .forEach((i) => {
      entries.push({
        type: 'injury',
        id: i.id,
        label: i.label,
        date: i.date,
        severity: i.severity,
        location: i.location ?? '',
        event: i.event ?? '',
        description: i.description ?? '',
        medicalCare: i.medicalCare ?? '',
        clinicName: i.clinicName ?? '',
        witnesses: i.witnesses ?? '',
        functionalImpacts: i.functionalImpacts ?? [],
        secondaries: i.secondaries ?? [],
        pin: i.pin,
        injRef: i,
      })
    })

  // Mental health conditions
  mentalConditions
    .filter((c) => c.date)
    .forEach((c) => {
      entries.push({
        type: 'mental',
        id: `mh-${c.id}`,
        label: c.condition,
        date: c.date,
        severity: ratingToSeverity(c.effectiveRating),
        location: c.location ?? '',
        event: c.event ?? '',
        description: c.description || `Mental Health — ${c.effectiveRating}% rating`,
        medicalCare: c.medicalCare ?? '',
        clinicName: c.clinicName ?? '',
        witnesses: c.witnesses ?? '',
        functionalImpacts: [],
        secondaries: [],
        pin: c.pin ?? null,
      })
    })

  // Head & Face conditions
  headConditions
    .filter((c) => c.date)
    .forEach((c) => {
      entries.push({
        type: 'head',
        id: `hd-${c.id}`,
        label: c.condition,
        date: c.date,
        severity: ratingToSeverity(c.effectiveRating),
        location: c.location ?? '',
        event: c.event ?? '',
        description: c.description || `Head & Face — ${c.effectiveRating}% rating`,
        medicalCare: c.medicalCare ?? '',
        clinicName: c.clinicName ?? '',
        witnesses: c.witnesses ?? '',
        functionalImpacts: [],
        secondaries: [],
        pin: c.pin ?? null,
      })
    })

  // Body part conditions
  Object.entries(bpConditions).forEach(([region, conds]) => {
    const meta = BP_META[region as BPRegion]
    if (!meta) return
    conds
      .filter((c) => c.date)
      .forEach((c) => {
        entries.push({
          type: region as BPRegion,
          id: `bp-${c.id}`,
          label: c.condition,
          date: c.date,
          severity: ratingToSeverity(c.effectiveRating),
          location: c.location ?? '',
          event: c.event ?? '',
          description: c.description || `${meta.title} — ${c.effectiveRating}% rating`,
          medicalCare: c.medicalCare ?? '',
          clinicName: c.clinicName ?? '',
          witnesses: c.witnesses ?? '',
          functionalImpacts: [],
          secondaries: [],
          pin: c.pin ?? null,
        })
      })
  })

  // Sort by date then id
  entries.sort((a, b) => {
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime()
    if (dateDiff !== 0) return dateDiff
    return String(a.id) > String(b.id) ? 1 : -1
  })

  const hasSpecials = specialClaims.smcSelections.length > 0 ||
    Object.keys(specialClaims.claims).length > 0

  const years = [...new Set(entries.map((e) => e.date?.slice(0, 4)).filter(Boolean))]

  return (
    <div id="tab-timeline" className={`content${activeTab !== 'timeline' ? ' hidden' : ''}`}>
      <div className="tl-bar">
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--fh)', textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--navy)' }}>
          Injury History
        </div>
        <button
          className="btn-p"
          onClick={() => setActiveTab('map')}
          style={{ flex: 'none', padding: '8px 16px', fontSize: 13 }}
        >
          + Add Injury
        </button>
      </div>

      <div className="tab-instructions">
        Your injury history in order. Each entry shows the date, location, and details you provided.
        Items need a date to appear here. Go to the <strong>Primary Map</strong> tab to add or edit injuries.
      </div>

      <div id="tl-list">
        {entries.length === 0 && !hasSpecials ? (
          <div className="empty">
            No injuries or conditions logged yet.<br />
            Click the body map or use Quick Select to begin.<br />
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Items require a date to appear on the timeline.</span>
          </div>
        ) : (
          <>
            {years.map((yr) => (
              <div key={yr}>
                <div className="yr-lbl">{yr}</div>
                {entries
                  .filter((e) => e.date?.startsWith(yr))
                  .map((entry) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      onEdit={entry.type === 'injury' && typeof entry.id === 'number'
                        ? () => setEditingId(entry.id as number)
                        : undefined}
                      onDelete={entry.type === 'injury' && typeof entry.id === 'number'
                        ? () => removeInjury(entry.id as number)
                        : undefined}
                    />
                  ))}
              </div>
            ))}

            {hasSpecials && (
              <div style={{ marginTop: 20 }}>
                <div className="yr-lbl" style={{ color: '#b45309' }}>Special Claims &amp; Entitlements</div>
                {specialClaims.smcSelections.map((id) => (
                  <div key={id} className="ic custom" style={{ borderLeft: '3px solid #b45309' }}>
                    <div style={{ flex: 1 }}>
                      <div className="ic-title">
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 22, height: 22, borderRadius: '50%', background: '#b45309', color: '#fff', fontSize: 8, fontWeight: 800, fontFamily: 'var(--fm)', flexShrink: 0, padding: '0 4px' }}>SP</span>
                        {' '}SMC — {id.replace('smc_', '').toUpperCase()}
                        <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--fh)', color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', padding: '1px 5px', borderRadius: 3 }}>Special Entitlement</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
