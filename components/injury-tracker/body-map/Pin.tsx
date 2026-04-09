'use client'

import { useRef, useCallback } from 'react'
import type { Injury } from '../../../lib/va/types'
import { useTracker } from '../../../hooks/useTrackerStore'

interface PinProps {
  injury: Injury
  containerRef: React.RefObject<HTMLDivElement | null>
  onClickPin: (injury: Injury) => void
}

export function Pin({ injury, containerRef, onClickPin }: PinProps) {
  const { dispatch } = useTracker()
  const dragState = useRef<{ dragging: boolean; startX: number; startY: number } | null>(null)

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100))
    if (injury.pin) {
      dispatch({
        type: 'UPDATE_INJURY_PIN',
        id: injury.id,
        pin: { ...injury.pin, x, y },
      })
    }
  }, [containerRef, dispatch, injury])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('pin-del')) return
    e.preventDefault()
    dragState.current = { dragging: false, startX: e.clientX, startY: e.clientY }

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragState.current) return
      const dx = Math.abs(ev.clientX - dragState.current.startX)
      const dy = Math.abs(ev.clientY - dragState.current.startY)
      if (!dragState.current.dragging && (dx > 4 || dy > 4)) {
        dragState.current.dragging = true
      }
      if (dragState.current.dragging) {
        updatePosition(ev.clientX, ev.clientY)
      }
    }

    const onMouseUp = (ev: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      if (!dragState.current?.dragging) {
        onClickPin(injury)
      }
      dragState.current = null
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [injury, onClickPin, updatePosition])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).classList.contains('pin-del')) return
    const touch = e.touches[0]
    dragState.current = { dragging: false, startX: touch.clientX, startY: touch.clientY }

    const onTouchMove = (ev: TouchEvent) => {
      ev.preventDefault()
      if (!dragState.current) return
      const t = ev.touches[0]
      const dx = Math.abs(t.clientX - dragState.current.startX)
      const dy = Math.abs(t.clientY - dragState.current.startY)
      if (!dragState.current.dragging && (dx > 4 || dy > 4)) {
        dragState.current.dragging = true
      }
      if (dragState.current.dragging) {
        updatePosition(t.clientX, t.clientY)
      }
    }

    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      if (!dragState.current?.dragging) {
        onClickPin(injury)
      }
      dragState.current = null
    }

    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
  }, [injury, onClickPin, updatePosition])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: 'DELETE_INJURY', id: injury.id })
  }, [dispatch, injury.id])

  const { pin, severity, label, event: evt } = injury
  if (!pin) return null

  const tooltipText = evt ? `${label} — ${evt}` : label

  return (
    <div
      className={`pin pin-${severity}`}
      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div className="pin-head">
        <span className="pin-num">{injury.id % 100}</span>
      </div>
      <div className="pin-tip">{tooltipText}</div>
      <button className="pin-del" onClick={handleDelete} title="Remove pin">×</button>
    </div>
  )
}
