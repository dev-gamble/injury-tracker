"use client"

import { useCallback, useMemo } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { GROUPS_FRONT, GROUPS_BACK, SIDEBAR_ITEMS } from '../data/pins'
import { BP_META, getPanelKeys } from '../data/bpMeta'
import { useBadges } from './useBadges'
import { DraggablePin } from './DraggablePin'
import { PanelPin, type PanelPinDescriptor } from './PanelPin'
import { MentalHealthPanel } from '../panels/MentalHealthPanel'
import { HeadPanel } from '../panels/HeadPanel'
import { BodyPartPanel } from '../panels/BodyPartPanel'
import type { BPCondition, BPRegion, HeadCondition, Injury, MHCondition, Pin } from '../types'

const HEAD_KEYS = new Set(['headFace', 'head', 'leftEar', 'rightEar', 'leftEye', 'rightEye', 'nose', 'jaw'])
const PANEL_KEYS = getPanelKeys()

function injuryNumber(inj: Injury, sorted: Injury[]): number {
  const idx = sorted.findIndex((i) => i.id === inj.id)
  return idx >= 0 ? idx + 1 : 0
}

function clearPinPlacementUi() {
  document.body.classList.remove('pin-placing')
  document.querySelectorAll('.body-wrap').forEach((el) => el.classList.remove('pin-place-mode'))
}

function ratingToSeverity(rating: number): Injury['severity'] {
  if (rating >= 70) return 'severe'
  if (rating >= 30) return 'moderate'
  if (rating > 0) return 'mild'
  return 'custom'
}

function resolveBPRegionForKey(key: string): BPRegion | null {
  if (BP_META[key as BPRegion]) return key as BPRegion

  for (const [regionId, meta] of Object.entries(BP_META)) {
    if (key in meta.sideKeys) return regionId as BPRegion
  }

  return null
}

function buildPanelPins(
  mentalConditions: MHCondition[],
  headConditions: HeadCondition[],
  bpConditions: Record<BPRegion, BPCondition[]>,
): PanelPinDescriptor[] {
  const panelPins: PanelPinDescriptor[] = []

  const mentalAnchor = mentalConditions.find((condition) => condition.pin)
  if (mentalAnchor?.pin) {
    const highestRating = Math.max(...mentalConditions.map((condition) => condition.effectiveRating ?? 0))
    panelPins.push({
      id: 'panel-mental',
      panel: 'mental',
      label: mentalAnchor.pin.label || mentalAnchor.condition || 'Mental Health',
      severity: ratingToSeverity(highestRating),
      pin: mentalAnchor.pin,
    })
  }

  const headAnchor = headConditions.find((condition) => condition.pin)
  if (headAnchor?.pin) {
    const highestRating = Math.max(...headConditions.map((condition) => condition.effectiveRating ?? 0))
    panelPins.push({
      id: 'panel-head',
      panel: 'head',
      label: headAnchor.pin.label || headAnchor.condition || 'Head & Face',
      severity: ratingToSeverity(highestRating),
      pin: headAnchor.pin,
    })
  }

  Object.entries(bpConditions).forEach(([regionId, conditions]) => {
    const anchor = conditions.find((condition) => condition.pin)
    if (!anchor?.pin) return

    const highestRating = Math.max(...conditions.map((condition) => condition.effectiveRating ?? 0))
    const meta = BP_META[regionId as BPRegion]

    panelPins.push({
      id: `panel-${regionId}`,
      panel: regionId as BPRegion,
      label: anchor.pin.label || anchor.condition || meta.title.replace(/ Evaluation$/, ''),
      severity: ratingToSeverity(highestRating),
      pin: anchor.pin,
    })
  })

  return panelPins
}

function PinPlaceBanner() {
  const pinPlaceMode = useInjuryStore((s) => s.ui.pinPlaceMode)
  const setPinPlaceMode = useInjuryStore((s) => s.setPinPlaceMode)
  const setPendingPin = useInjuryStore((s) => s.setPendingPin)

  if (!pinPlaceMode) return null

  return (
    <div className="pin-place-prompt">
      <span>Click the body map to place: <strong>{pinPlaceMode.label}</strong></span>
      <button
        onClick={() => {
          setPinPlaceMode(null)
          setPendingPin(null)
          clearPinPlacementUi()
        }}
      >
        Cancel
      </button>
    </div>
  )
}

function BodyView({ id, src, alt }: { id: string; src: string; alt: string }) {
  const curSide = useInjuryStore((s) => s.ui.curSide)
  const curBody = useInjuryStore((s) => s.ui.curBody)
  const injuries = useInjuryStore((s) => s.injuries)
  const mentalConditions = useInjuryStore((s) => s.mentalConditions)
  const headConditions = useInjuryStore((s) => s.headConditions)
  const bpConditions = useInjuryStore((s) => s.bpConditions)
  const pinPlaceMode = useInjuryStore((s) => s.ui.pinPlaceMode)
  const setPinPlaceMode = useInjuryStore((s) => s.setPinPlaceMode)
  const setPendingPin = useInjuryStore((s) => s.setPendingPin)
  const updateMHCondition = useInjuryStore((s) => s.updateMHCondition)
  const updateHeadCondition = useInjuryStore((s) => s.updateHeadCondition)
  const updateBPCondition = useInjuryStore((s) => s.updateBPCondition)

  const bodySuffix = (curBody === 'male' ? 'm' : 'f') + (curSide === 'front' ? 'f' : 'b')
  const isActive = id === `view-${bodySuffix}`

  const sortedInjuries = useMemo(
    () => [...injuries].filter((injury) => !PANEL_KEYS.has(injury.key)).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id
    ),
    [injuries]
  )

  const viewId = id.replace('view-', '')
  const viewBody = viewId[0] === 'm' ? 'male' : 'female'
  const viewSide = viewId[1] === 'f' ? 'front' : 'back'
  const viewInjuries = sortedInjuries.filter(
    (injury) => injury.pin.body === viewBody && injury.pin.side === viewSide
  )
  const panelPins = useMemo(
    () => buildPanelPins(mentalConditions, headConditions, bpConditions),
    [mentalConditions, headConditions, bpConditions]
  )
  const viewPanelPins = panelPins.filter(
    (panelPin) => panelPin.pin.body === viewBody && panelPin.pin.side === viewSide
  )

  const stampPanelPin = useCallback((key: string, pin: Pin) => {
    if (key === 'mental') {
      mentalConditions.forEach((condition) => {
        updateMHCondition(condition.id, { pin: { ...pin } })
      })
      return
    }

    if (key === 'headFace' || key === 'head') {
      headConditions.forEach((condition) => {
        updateHeadCondition(condition.id, { pin: { ...pin } })
      })
      return
    }

    const region = resolveBPRegionForKey(key)
    if (!region) return

    ;(bpConditions[region] ?? []).forEach((condition) => {
      updateBPCondition(region, condition.id, { pin: { ...pin } })
    })
  }, [
    mentalConditions,
    headConditions,
    bpConditions,
    updateMHCondition,
    updateHeadCondition,
    updateBPCondition,
  ])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return

    const wrap = e.currentTarget
    const rect = wrap.getBoundingClientRect()
    const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1))
    const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1))

    if (pinPlaceMode) {
      const { key, label, fromPanel } = pinPlaceMode
      setPinPlaceMode(null)
      clearPinPlacementUi()

      const pin = { x, y, side: curSide, body: curBody, label }
      if (fromPanel) {
        stampPanelPin(key, pin)
        setPendingPin(null)
      } else {
        setPendingPin({ ...pin, key })
      }
      return
    }

    setPendingPin({ x, y, side: curSide, body: curBody, key: 'custom', label: '' })
  }, [isActive, pinPlaceMode, curSide, curBody, setPinPlaceMode, setPendingPin, stampPanelPin])

  if (!isActive) return null

  return (
    <div
      id={id}
      className={`body-wrap${pinPlaceMode ? ' pin-place-mode' : ''}`}
      onClick={handleClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="body-img" src={src} alt={alt} />
      <div className="pins-layer" id={`pins-${viewId}`}>
        {viewInjuries.map((injury) => (
          <DraggablePin
            key={injury.id}
            inj={injury}
            num={injuryNumber(injury, sortedInjuries)}
          />
        ))}
        {viewPanelPins.map((panelPin) => (
          <PanelPin
            key={panelPin.id}
            descriptor={panelPin}
          />
        ))}
      </div>
    </div>
  )
}

function Sidebar() {
  const curSide = useInjuryStore((s) => s.ui.curSide)
  const setPinPlaceMode = useInjuryStore((s) => s.setPinPlaceMode)
  const setPendingPin = useInjuryStore((s) => s.setPendingPin)
  const setActivePanel = useInjuryStore((s) => s.setActivePanel)
  const badges = useBadges()

  const groups = curSide === 'front' ? GROUPS_FRONT : GROUPS_BACK

  const handleQuickSelect = useCallback((key: string) => {
    if (key === 'mental') {
      setActivePanel('mental')
      return
    }

    if (HEAD_KEYS.has(key)) {
      setActivePanel('head')
      return
    }

    if (BP_META[key as BPRegion]) {
      setActivePanel(key as BPRegion)
      return
    }

    for (const [regionId, meta] of Object.entries(BP_META)) {
      if (meta.sideKeys[key]) {
        setActivePanel(regionId as BPRegion)
        return
      }
    }

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

          <BodyView id="view-mf" src="/body/body-male-front.png" alt="Male front body diagram" />
          <BodyView id="view-mb" src="/body/body-male-back.png" alt="Male back body diagram" />
          <BodyView id="view-ff" src="/body/body-female-front.png" alt="Female front body diagram" />
          <BodyView id="view-fb" src="/body/body-female-back.png" alt="Female back body diagram" />
        </div>

        {showBodyAndSidebar && <Sidebar />}

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
