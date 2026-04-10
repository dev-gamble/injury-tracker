"use client"

import { useCallback, useMemo } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { GROUPS_FRONT, GROUPS_BACK, SIDEBAR_ITEMS } from '../data/pins'
import { BP_META, getPanelKeys } from '../data/bpMeta'
import { useBadges } from './useBadges'
import { DraggablePin } from './DraggablePin'
import { MentalHealthPanel } from '../panels/MentalHealthPanel'
import { HeadPanel } from '../panels/HeadPanel'
import { BodyPartPanel } from '../panels/BodyPartPanel'
import type { BPRegion, Injury } from '../types'

const HEAD_KEYS = new Set(['headFace', 'head', 'leftEar', 'rightEar', 'leftEye', 'rightEye', 'nose', 'jaw'])

function injuryNumber(inj: Injury, sorted: Injury[]): number {
  const idx = sorted.findIndex((i) => i.id === inj.id)
  return idx >= 0 ? idx + 1 : 0
}

function PinPlaceBanner() {
  const pinPlaceMode = useInjuryStore((s) => s.ui.pinPlaceMode)
  const setPinPlaceMode = useInjuryStore((s) => s.setPinPlaceMode)
  const setPendingPin = useInjuryStore((s) => s.setPendingPin)

  if (!pinPlaceMode) return null

  return (
    <div className="pin-place-prompt">
      <span>Click the body map to place: <strong>{pinPlaceMode.label}</strong></span>
      <button onClick={() => {
        setPinPlaceMode(null)
        setPendingPin(null)
        document.body.classList.remove('pin-placing')
      }}>Cancel</button>
    </div>
  )
}

function BodyView({ id, src, alt }: { id: string; src: string; alt: string }) {
  const curSide = useInjuryStore((s) => s.ui.curSide)
  const curBody = useInjuryStore((s) => s.ui.curBody)
  const injuries = useInjuryStore((s) => s.injuries)
  const pinPlaceMode = useInjuryStore((s) => s.ui.pinPlaceMode)
  const setPinPlaceMode = useInjuryStore((s) => s.setPinPlaceMode)
  const setPendingPin = useInjuryStore((s) => s.setPendingPin)
  const setEditingId = useInjuryStore((s) => s.setEditingId)
  const setActivePanel = useInjuryStore((s) => s.setActivePanel)

  const bodySuffix = (curBody === 'male' ? 'm' : 'f') + (curSide === 'front' ? 'f' : 'b')
  const isActive = id === `view-${bodySuffix}`

  // Sort injuries by date for numbering
  const panelKeys = getPanelKeys()
  const sortedInjuries = useMemo(
    () => [...injuries].filter((i) => !panelKeys.has(i.key)).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id
    ),
    [injuries]  // eslint-disable-line react-hooks/exhaustive-deps
  )

  // Injuries whose pin matches this view
  const viewId = id.replace('view-', '')
  const viewBody = viewId[0] === 'm' ? 'male' : 'female'
  const viewSide = viewId[1] === 'f' ? 'front' : 'back'
  const viewInjuries = sortedInjuries.filter(
    (i) => i.pin.body === viewBody && i.pin.side === viewSide
  )

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return
    const wrap = e.currentTarget
    const r = wrap.getBoundingClientRect()
    const x = parseFloat(((e.clientX - r.left) / r.width * 100).toFixed(1))
    const y = parseFloat(((e.clientY - r.top) / r.height * 100).toFixed(1))

    if (pinPlaceMode) {
      const { key, label, fromPanel } = pinPlaceMode
      setPinPlaceMode(null)
      document.body.classList.remove('pin-placing')
      document.querySelectorAll('.body-wrap').forEach((el) => el.classList.remove('pin-place-mode'))

      const pin = { x, y, side: curSide, body: curBody, key, label }
      if (fromPanel) {
        // Panel pin — stamp coords onto panel conditions
        setPendingPin(pin)
        // auto-create: open edit form pre-filled for panel conditions is handled by the panel
        // For now just stamp the pin and clear
        setPendingPin(null)
        // TODO: stamp pin onto panel conditions via store actions
      } else {
        setPendingPin(pin)
        // open form by triggering editingId = null && pendingPin != null (already set)
      }
      return
    }

    // Free-click custom pin
    const pin = { x, y, side: curSide, body: curBody, key: 'custom', label: '' }
    setPendingPin(pin)
  }, [isActive, pinPlaceMode, curSide, curBody, setPinPlaceMode, setPendingPin])

  if (!isActive) return null

  return (
    <div
      id={id}
      className={`body-wrap${pinPlaceMode ? ' pin-place-mode' : ''}`}
      onClick={handleClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="body-img" src={src} alt={alt} />
      <div className={`pins-layer`} id={`pins-${viewId}`}>
        {viewInjuries.map((inj) => (
          <DraggablePin
            key={inj.id}
            inj={inj}
            num={injuryNumber(inj, sortedInjuries)}
          />
        ))}
      </div>
    </div>
  )
}

function Sidebar() {
  const curSide = useInjuryStore((s) => s.ui.curSide)
  const curBody = useInjuryStore((s) => s.ui.curBody)
  const setSide = useInjuryStore((s) => s.setSide)
  const setBody = useInjuryStore((s) => s.setBody)
  const setPinPlaceMode = useInjuryStore((s) => s.setPinPlaceMode)
  const setPendingPin = useInjuryStore((s) => s.setPendingPin)
  const setActivePanel = useInjuryStore((s) => s.setActivePanel)
  const badges = useBadges()

  const groups = curSide === 'front' ? GROUPS_FRONT : GROUPS_BACK

  const handleQuickSelect = useCallback((key: string) => {
    // Mental health → open panel
    if (key === 'mental') {
      setActivePanel('mental')
      return
    }
    // Head & Face → open head panel
    if (HEAD_KEYS.has(key)) {
      setActivePanel('head')
      return
    }
    // BP region → open BP panel
    if (BP_META[key as BPRegion]) {
      setActivePanel(key as BPRegion)
      return
    }
    // Check if pin key belongs to a BP region
    for (const [regionId, meta] of Object.entries(BP_META)) {
      if (meta.sideKeys[key]) {
        setActivePanel(regionId as BPRegion)
        return
      }
    }
    // All other → enter pin place mode
    const label = SIDEBAR_ITEMS[key] ?? 'Other / Unlisted'
    setPinPlaceMode({ key, label, fromPanel: false })
    setPendingPin(null)
    document.body.classList.add('pin-placing')
    document.querySelectorAll('.body-wrap').forEach((el) => el.classList.add('pin-place-mode'))
  }, [setActivePanel, setPinPlaceMode, setPendingPin])

  return (
    <div className="sidebar" id="sidebar">
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, fontFamily: 'var(--fh)', borderBottom: '2px solid var(--red)', paddingBottom: 8 }}>
        Quick Select
      </div>
      <div id="sb-list">
        {groups.map(([groupName, keys]) => (
          <div key={groupName}>
            <div className="sb-head">{groupName}</div>
            {keys.map((key) => {
              const badge = badges[key]
              return (
                <div
                  key={key}
                  className={`sb-item${badge ? ' has' : ''}`}
                  id={`si-${key}`}
                  onClick={() => handleQuickSelect(key)}
                >
                  <span className="sb-name">{SIDEBAR_ITEMS[key] ?? key}</span>
                  {badge ? (
                    <span className={`badge b-${badge.severity}`} id={`bd-${key}`}>
                      {badge.count}
                    </span>
                  ) : (
                    <span className="badge b0" id={`bd-${key}`}>+</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export function MapTab() {
  const curSide = useInjuryStore((s) => s.ui.curSide)
  const curBody = useInjuryStore((s) => s.ui.curBody)
  const setSide = useInjuryStore((s) => s.setSide)
  const setBody = useInjuryStore((s) => s.setBody)
  const activePanel = useInjuryStore((s) => s.ui.activePanel)
  const activeTab = useInjuryStore((s) => s.ui.activeTab)

  const showBodyAndSidebar = activePanel === null

  return (
    <div id="tab-map" className={`content${activeTab !== 'map' ? ' hidden' : ''}`}>
      <PinPlaceBanner />

      <div className="tab-instructions" style={{ margin: '0 0 8px' }}>
        Select the body area where you have an issue using the <strong>Quick Select</strong> list on
        the right, or click anywhere on the body map to drop a custom pin and enter your information.
        Fill in what happened, when, and where.
      </div>

      <div className="map-layout">
        {/* CENTER: body image */}
        <div className={`body-panel${showBodyAndSidebar ? '' : ' hidden'}`}>
          <div className="toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="tb-lbl">View</span>
              <div className="tgrp">
                <button
                  className={`tog${curSide === 'front' ? ' active' : ''}`}
                  id="btn-front"
                  onClick={() => setSide('front')}
                >
                  Front
                </button>
                <button
                  className={`tog${curSide === 'back' ? ' active' : ''}`}
                  id="btn-back"
                  onClick={() => setSide('back')}
                >
                  Back
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="tb-lbl">Body</span>
              <div className="tgrp">
                <button
                  className={`tog${curBody === 'male' ? ' active' : ''}`}
                  id="btn-male"
                  onClick={() => setBody('male')}
                >
                  Male
                </button>
                <button
                  className={`tog${curBody === 'female' ? ' active' : ''}`}
                  id="btn-female"
                  onClick={() => setBody('female')}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          <BodyView id="view-mf" src="/images/injury-tracker/body-male-front.png" alt="Male front body diagram" />
          <BodyView id="view-mb" src="/images/injury-tracker/body-male-back.png" alt="Male back body diagram" />
          <BodyView id="view-ff" src="/images/injury-tracker/body-female-front.png" alt="Female front body diagram" />
          <BodyView id="view-fb" src="/images/injury-tracker/body-female-back.png" alt="Female back body diagram" />
        </div>

        {/* RIGHT: quick-select sidebar */}
        {showBodyAndSidebar && <Sidebar />}

        {/* EVALUATION PANELS */}
        {activePanel === 'mental' && <MentalHealthPanel />}
        {activePanel === 'head' && <HeadPanel />}
        {activePanel === 'knee' && <BodyPartPanel regionId="knee" />}
        {activePanel === 'back' && <BodyPartPanel regionId="back" />}
        {activePanel === 'shoulder' && <BodyPartPanel regionId="shoulder" />}
        {activePanel === 'neck' && <BodyPartPanel regionId="neck" />}
        {activePanel === 'hip' && <BodyPartPanel regionId="hip" />}
        {activePanel === 'elbow' && <BodyPartPanel regionId="elbow" />}
        {activePanel === 'wrist_hand' && <BodyPartPanel regionId="wrist_hand" />}
        {activePanel === 'ankle_foot' && <BodyPartPanel regionId="ankle_foot" />}
        {activePanel === 'chest' && <BodyPartPanel regionId="chest" />}
        {activePanel === 'abdomen' && <BodyPartPanel regionId="abdomen" />}
        {activePanel === 'leg' && <BodyPartPanel regionId="leg" />}
        {activePanel === 'systemic' && <BodyPartPanel regionId="systemic" />}
      </div>
    </div>
  )
}
