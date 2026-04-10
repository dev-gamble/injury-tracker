"use client"

import { useCallback } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import type { BPRegion, Injury, Pin } from '../types'

export type PanelPinTarget = 'mental' | 'head' | BPRegion

export interface PanelPinDescriptor {
  id: string
  panel: PanelPinTarget
  label: string
  severity: Injury['severity']
  pin: Pin
}

export function PanelPin({ descriptor }: { descriptor: PanelPinDescriptor }) {
  const setActivePanel = useInjuryStore((s) => s.setActivePanel)
  const mentalConditions = useInjuryStore((s) => s.mentalConditions)
  const headConditions = useInjuryStore((s) => s.headConditions)
  const bpConditions = useInjuryStore((s) => s.bpConditions)
  const updateMHCondition = useInjuryStore((s) => s.updateMHCondition)
  const updateHeadCondition = useInjuryStore((s) => s.updateHeadCondition)
  const updateBPCondition = useInjuryStore((s) => s.updateBPCondition)

  const { panel, label, pin, severity } = descriptor

  const handleOpen = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setActivePanel(panel)
  }, [panel, setActivePanel])

  const handleRemove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (panel === 'mental') {
      mentalConditions.forEach((condition) => {
        updateMHCondition(condition.id, { pin: undefined })
      })
      return
    }

    if (panel === 'head') {
      headConditions.forEach((condition) => {
        updateHeadCondition(condition.id, { pin: undefined })
      })
      return
    }

    ;(bpConditions[panel] ?? []).forEach((condition) => {
      updateBPCondition(panel, condition.id, { pin: undefined })
    })
  }, [
    panel,
    mentalConditions,
    headConditions,
    bpConditions,
    updateMHCondition,
    updateHeadCondition,
    updateBPCondition,
  ])

  return (
    <div
      className={`pin pin-${severity}`}
      style={{ left: `${pin.x}%`, top: `${pin.y}%`, cursor: 'pointer' }}
      onClick={handleOpen}
    >
      <div className="pin-head">
        <span className="pin-num" style={{ fontSize: 7 }}>*</span>
      </div>
      <div className="pin-tip">{label}</div>
      <button
        type="button"
        className="pin-del"
        onClick={handleRemove}
        title="Remove"
      >
        x
      </button>
    </div>
  )
}
