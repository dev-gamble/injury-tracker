"use client"

import { useRef, useCallback, useEffect } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import type { Injury } from '../types'

interface DraggablePinProps {
  inj: Injury
  num: number
}

export function DraggablePin({ inj, num }: DraggablePinProps) {
  const updateInjuryPin = useInjuryStore((s) => s.updateInjuryPin)
  const removeInjury = useInjuryStore((s) => s.removeInjury)
  const setEditingId = useInjuryStore((s) => s.setEditingId)
  const pinRef = useRef<HTMLDivElement>(null)

  const dragState = useRef({
    dragging: false,
    didDrag: false,
    startX: 0,
    startY: 0,
    origLeft: 0,
    origTop: 0,
    wrapRect: null as DOMRect | null,
  })

  const tip = (inj.label + (inj.event ? ' · ' + inj.event : '')).slice(0, 32)

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as Element
    if (target.classList.contains('pin-del')) return
    e.preventDefault()
    e.stopPropagation()
    const wrap = pinRef.current?.closest('.body-wrap')
    if (!wrap) return
    dragState.current = {
      dragging: true,
      didDrag: false,
      startX: e.clientX,
      startY: e.clientY,
      origLeft: inj.pin.x,
      origTop: inj.pin.y,
      wrapRect: wrap.getBoundingClientRect(),
    }
    pinRef.current?.classList.add('dragging')
    document.body.style.userSelect = 'none'
  }, [inj.pin.x, inj.pin.y])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const ds = dragState.current
    if (!ds.dragging || !ds.wrapRect || !pinRef.current) return
    const dx = (e.clientX - ds.startX) / ds.wrapRect.width * 100
    const dy = (e.clientY - ds.startY) / ds.wrapRect.height * 100
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) ds.didDrag = true
    const newX = Math.max(0, Math.min(100, ds.origLeft + dx))
    const newY = Math.max(0, Math.min(100, ds.origTop + dy))
    pinRef.current.style.left = newX + '%'
    pinRef.current.style.top = newY + '%'
  }, [])

  const handleMouseUp = useCallback(() => {
    const ds = dragState.current
    if (!ds.dragging || !pinRef.current) return
    ds.dragging = false
    pinRef.current.classList.remove('dragging')
    document.body.style.userSelect = ''

    // Compute final position from element style
    const newX = parseFloat(pinRef.current.style.left)
    const newY = parseFloat(pinRef.current.style.top)
    if (ds.didDrag) {
      updateInjuryPin(inj.id, { ...inj.pin, x: newX, y: newY })
    } else {
      setEditingId(inj.id)
    }
  }, [inj.id, inj.pin, updateInjuryPin, setEditingId])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const target = e.target as Element
    if (target.classList.contains('pin-del')) return
    e.preventDefault()
    const t = e.touches[0]
    const wrap = pinRef.current?.closest('.body-wrap')
    if (!wrap) return
    dragState.current = {
      dragging: true,
      didDrag: false,
      startX: t.clientX,
      startY: t.clientY,
      origLeft: inj.pin.x,
      origTop: inj.pin.y,
      wrapRect: wrap.getBoundingClientRect(),
    }
    pinRef.current?.classList.add('dragging')
  }, [inj.pin.x, inj.pin.y])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const ds = dragState.current
    if (!ds.dragging || !ds.wrapRect || !pinRef.current) return
    e.preventDefault()
    const t = e.touches[0]
    const dx = (t.clientX - ds.startX) / ds.wrapRect.width * 100
    const dy = (t.clientY - ds.startY) / ds.wrapRect.height * 100
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) ds.didDrag = true
    const newX = Math.max(0, Math.min(100, ds.origLeft + dx))
    const newY = Math.max(0, Math.min(100, ds.origTop + dy))
    pinRef.current.style.left = newX + '%'
    pinRef.current.style.top = newY + '%'
  }, [])

  const handleTouchEnd = useCallback(() => {
    const ds = dragState.current
    if (!ds.dragging || !pinRef.current) return
    ds.dragging = false
    pinRef.current.classList.remove('dragging')
    const newX = parseFloat(pinRef.current.style.left)
    const newY = parseFloat(pinRef.current.style.top)
    if (ds.didDrag) {
      updateInjuryPin(inj.id, { ...inj.pin, x: newX, y: newY })
    } else {
      setEditingId(inj.id)
    }
  }, [inj.id, inj.pin, updateInjuryPin, setEditingId])

  // Attach document-level listeners
  useEffect(() => {
    const el = pinRef.current
    if (!el) return
    el.addEventListener('mousedown', handleMouseDown)
    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    return () => {
      el.removeEventListener('mousedown', handleMouseDown)
      el.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd])

  return (
    <div
      ref={pinRef}
      id={`pin-${inj.id}`}
      className={`pin pin-${inj.severity}`}
      style={{ left: `${inj.pin.x}%`, top: `${inj.pin.y}%` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="pin-head">
        <span className="pin-num">{num}</span>
      </div>
      <div className="pin-tip">#{num} · {tip}</div>
      <button
        className="pin-del"
        onClick={(e) => { e.stopPropagation(); removeInjury(inj.id) }}
        title="Remove"
      >
        ×
      </button>
    </div>
  )
}
