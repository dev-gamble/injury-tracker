'use client'

import { useRef, useCallback } from 'react'
import type { Injury } from '../../../lib/va/types'
import { useTracker } from '../../../hooks/useTrackerStore'
import { BodyImage } from './BodyImage'

interface BodyPanelProps {
  onClickPin: (injury: Injury) => void
  onBodyClick: (x: number, y: number) => void
}

export function BodyPanel({ onClickPin, onBodyClick }: BodyPanelProps) {
  const { state, dispatch } = useTracker()
  const { curSide, curBody, injuries, pendingPin } = state
  const containerRef = useRef<HTMLDivElement>(null)

  const handleBodyClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!pendingPin) return
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    onBodyClick(x, y)
  }, [pendingPin, onBodyClick])

  return (
    <div className="body-panel">
      <div className="toolbar">
        <span className="tb-lbl">View</span>
        <div className="tgrp">
          <button
            className={`tog${curSide === 'front' ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'SET_CUR_SIDE', side: 'front' })}
          >
            Front
          </button>
          <button
            className={`tog${curSide === 'back' ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'SET_CUR_SIDE', side: 'back' })}
          >
            Back
          </button>
        </div>
        <div className="tgrp">
          <button
            className={`tog${curBody === 'male' ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'SET_CUR_BODY', body: 'male' })}
          >
            Male
          </button>
          <button
            className={`tog${curBody === 'female' ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'SET_CUR_BODY', body: 'female' })}
          >
            Female
          </button>
        </div>
      </div>

      <BodyImage
        ref={containerRef}
        curSide={curSide}
        curBody={curBody}
        injuries={injuries}
        onClickPin={onClickPin}
        onClickBody={handleBodyClick}
        placingPin={!!pendingPin}
      />

      <div className="legend">
        <div className="leg"><div className="leg-dot" style={{ background: 'var(--mild)' }} /><span>Mild</span></div>
        <div className="leg"><div className="leg-dot" style={{ background: 'var(--moderate)' }} /><span>Moderate</span></div>
        <div className="leg"><div className="leg-dot" style={{ background: 'var(--severe)' }} /><span>Severe</span></div>
        <div className="leg"><div className="leg-dot" style={{ background: 'var(--custom)' }} /><span>Custom</span></div>
      </div>

      {!pendingPin && (
        <p className="click-hint">Click body to log an injury</p>
      )}
      {!!pendingPin && (
        <p className="drag-hint">Click on the body image to place the pin</p>
      )}
    </div>
  )
}
