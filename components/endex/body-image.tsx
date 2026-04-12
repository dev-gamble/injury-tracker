"use client"

import { useCallback, useEffect, useRef } from "react"
import { useTracker } from "@/lib/endex/tracker-context"
import type { ConditionPin, Injury } from "@/lib/endex/types"

const SIDE_LABEL_STYLE: React.CSSProperties = {
  position: "absolute",
  top: "22%",
  transform: "translateY(-50%)",
  fontSize: "12px",
  fontWeight: 800,
  fontFamily: "var(--fh)",
  letterSpacing: "1.5px",
  color: "rgba(10,35,87,.35)",
  pointerEvents: "none",
  zIndex: 1,
}

function DraggablePin({ inj }: { inj: Injury }) {
  const { injuryNumber, editInjury, deleteInjury, updatePinPosition } = useTracker()
  const pinRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    dragging: false,
    didDrag: false,
    startX: 0,
    startY: 0,
    origLeft: 0,
    origTop: 0,
    wrap: null as HTMLElement | null,
  })

  const num = injuryNumber(inj.id)
  const tip = (inj.label + (inj.event ? " \u00b7 " + inj.event : "")).slice(0, 32)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains("pin-del")) return
      e.preventDefault()
      e.stopPropagation()
      const el = pinRef.current
      if (!el) return
      const wrap = el.closest(".body-wrap") as HTMLElement
      if (!wrap) return
      const ds = dragState.current
      ds.dragging = true
      ds.didDrag = false
      ds.wrap = wrap
      ds.startX = e.clientX
      ds.startY = e.clientY
      ds.origLeft = inj.pin.x
      ds.origTop = inj.pin.y
      el.classList.add("dragging")
      document.body.style.userSelect = "none"
    },
    [inj.pin.x, inj.pin.y],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).classList.contains("pin-del")) return
      e.preventDefault()
      const el = pinRef.current
      if (!el) return
      const wrap = el.closest(".body-wrap") as HTMLElement
      if (!wrap) return
      const t = e.touches[0]
      const ds = dragState.current
      ds.dragging = true
      ds.didDrag = false
      ds.wrap = wrap
      ds.startX = t.clientX
      ds.startY = t.clientY
      ds.origLeft = inj.pin.x
      ds.origTop = inj.pin.y
      el.classList.add("dragging")
    },
    [inj.pin.x, inj.pin.y],
  )

  useEffect(() => {
    const ds = dragState.current

    const onMouseMove = (e: MouseEvent) => {
      if (!ds.dragging || !ds.wrap) return
      const rect = ds.wrap.getBoundingClientRect()
      const dx = ((e.clientX - ds.startX) / rect.width) * 100
      const dy = ((e.clientY - ds.startY) / rect.height) * 100
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) ds.didDrag = true
      const newX = Math.max(0, Math.min(100, ds.origLeft + dx))
      const newY = Math.max(0, Math.min(100, ds.origTop + dy))
      const el = pinRef.current
      if (el) {
        el.style.left = newX + "%"
        el.style.top = newY + "%"
      }
    }

    const onMouseUp = () => {
      if (!ds.dragging) return
      ds.dragging = false
      const el = pinRef.current
      if (el) {
        el.classList.remove("dragging")
        if (ds.didDrag) {
          const left = parseFloat(el.style.left)
          const top = parseFloat(el.style.top)
          updatePinPosition(inj.id, parseFloat(left.toFixed(1)), parseFloat(top.toFixed(1)))
        } else {
          editInjury(inj.id)
        }
      }
      document.body.style.userSelect = ""
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!ds.dragging || !ds.wrap) return
      e.preventDefault()
      const t = e.touches[0]
      const rect = ds.wrap.getBoundingClientRect()
      const dx = ((t.clientX - ds.startX) / rect.width) * 100
      const dy = ((t.clientY - ds.startY) / rect.height) * 100
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) ds.didDrag = true
      const newX = Math.max(0, Math.min(100, ds.origLeft + dx))
      const newY = Math.max(0, Math.min(100, ds.origTop + dy))
      const el = pinRef.current
      if (el) {
        el.style.left = newX + "%"
        el.style.top = newY + "%"
      }
    }

    const onTouchEnd = () => {
      if (!ds.dragging) return
      ds.dragging = false
      const el = pinRef.current
      if (el) {
        el.classList.remove("dragging")
        if (ds.didDrag) {
          const left = parseFloat(el.style.left)
          const top = parseFloat(el.style.top)
          updatePinPosition(inj.id, parseFloat(left.toFixed(1)), parseFloat(top.toFixed(1)))
        } else {
          editInjury(inj.id)
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    document.addEventListener("touchmove", onTouchMove, { passive: false })
    document.addEventListener("touchend", onTouchEnd)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
    }
  }, [inj.id, editInjury, updatePinPosition])

  return (
    <div
      ref={pinRef}
      className={`pin pin-${inj.severity}`}
      style={{ left: `${inj.pin.x}%`, top: `${inj.pin.y}%` }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="pin-head">
        <span className="pin-num">{num}</span>
      </div>
      <div className="pin-tip">
        #{num} &middot; {tip}
      </div>
      <button
        className="pin-del"
        onClick={(e) => {
          e.stopPropagation()
          if (confirm(`Delete "${inj.label}" and all its secondary conditions?`)) {
            deleteInjury(inj.id)
          }
        }}
        title="Remove"
      >
        &times;
      </button>
    </div>
  )
}

function DraggableConditionPin({ cp }: { cp: ConditionPin }) {
  const { removeConditionPin, updateConditionPinPosition } = useTracker()
  const pinRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    dragging: false,
    didDrag: false,
    startX: 0,
    startY: 0,
    origLeft: 0,
    origTop: 0,
    wrap: null as HTMLElement | null,
  })

  // Build display text: "(L) 10%", "(R) 0%", "(B) 30%", or just "0%"
  let sideTag = ""
  if (cp.bilateralLinked) {
    sideTag = "(B)"
  } else if (cp.sideLabel) {
    const sl = cp.sideLabel.toLowerCase()
    if (sl.includes("left")) sideTag = "(L)"
    else if (sl.includes("right")) sideTag = "(R)"
  } else if (cp.extremity && cp.extremity !== "none") {
    const ex = cp.extremity.toLowerCase()
    if (ex.startsWith("l")) sideTag = "(L)"
    else if (ex.startsWith("r")) sideTag = "(R)"
  }

  const pinDisplay = sideTag ? `${sideTag} ${cp.rating}%` : `${cp.rating}%`
  const tipText = sideTag
    ? `${sideTag} ${cp.condition} — ${cp.rating}%`
    : `${cp.condition} — ${cp.rating}%`

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains("pin-del")) return
      e.preventDefault()
      e.stopPropagation()
      const el = pinRef.current
      if (!el) return
      const wrap = el.closest(".body-wrap") as HTMLElement
      if (!wrap) return
      const ds = dragState.current
      ds.dragging = true
      ds.didDrag = false
      ds.wrap = wrap
      ds.startX = e.clientX
      ds.startY = e.clientY
      ds.origLeft = cp.pin.x
      ds.origTop = cp.pin.y
      el.classList.add("dragging")
      document.body.style.userSelect = "none"
    },
    [cp.pin.x, cp.pin.y],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).classList.contains("pin-del")) return
      e.preventDefault()
      const el = pinRef.current
      if (!el) return
      const wrap = el.closest(".body-wrap") as HTMLElement
      if (!wrap) return
      const t = e.touches[0]
      const ds = dragState.current
      ds.dragging = true
      ds.didDrag = false
      ds.wrap = wrap
      ds.startX = t.clientX
      ds.startY = t.clientY
      ds.origLeft = cp.pin.x
      ds.origTop = cp.pin.y
      el.classList.add("dragging")
    },
    [cp.pin.x, cp.pin.y],
  )

  useEffect(() => {
    const ds = dragState.current

    const onMouseMove = (e: MouseEvent) => {
      if (!ds.dragging || !ds.wrap) return
      const rect = ds.wrap.getBoundingClientRect()
      const dx = ((e.clientX - ds.startX) / rect.width) * 100
      const dy = ((e.clientY - ds.startY) / rect.height) * 100
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) ds.didDrag = true
      const newX = Math.max(0, Math.min(100, ds.origLeft + dx))
      const newY = Math.max(0, Math.min(100, ds.origTop + dy))
      const el = pinRef.current
      if (el) {
        el.style.left = newX + "%"
        el.style.top = newY + "%"
      }
    }

    const onMouseUp = () => {
      if (!ds.dragging) return
      ds.dragging = false
      const el = pinRef.current
      if (el) {
        el.classList.remove("dragging")
        if (ds.didDrag) {
          const left = parseFloat(el.style.left)
          const top = parseFloat(el.style.top)
          updateConditionPinPosition(cp.id, parseFloat(left.toFixed(1)), parseFloat(top.toFixed(1)))
        }
      }
      document.body.style.userSelect = ""
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!ds.dragging || !ds.wrap) return
      e.preventDefault()
      const t = e.touches[0]
      const rect = ds.wrap.getBoundingClientRect()
      const dx = ((t.clientX - ds.startX) / rect.width) * 100
      const dy = ((t.clientY - ds.startY) / rect.height) * 100
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) ds.didDrag = true
      const newX = Math.max(0, Math.min(100, ds.origLeft + dx))
      const newY = Math.max(0, Math.min(100, ds.origTop + dy))
      const el = pinRef.current
      if (el) {
        el.style.left = newX + "%"
        el.style.top = newY + "%"
      }
    }

    const onTouchEnd = () => {
      if (!ds.dragging) return
      ds.dragging = false
      const el = pinRef.current
      if (el) {
        el.classList.remove("dragging")
        if (ds.didDrag) {
          const left = parseFloat(el.style.left)
          const top = parseFloat(el.style.top)
          updateConditionPinPosition(cp.id, parseFloat(left.toFixed(1)), parseFloat(top.toFixed(1)))
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    document.addEventListener("touchmove", onTouchMove, { passive: false })
    document.addEventListener("touchend", onTouchEnd)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
    }
  }, [cp.id, updateConditionPinPosition])

  return (
    <div
      ref={pinRef}
      className={`pin ${cp.bilateralLinked ? "pin-bilateral" : "pin-single"}`}
      style={{ left: `${cp.pin.x}%`, top: `${cp.pin.y}%` }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="pin-head">
        <span className="pin-num" style={{ fontSize: "7px" }}>{pinDisplay}</span>
      </div>
      <div className="pin-tip">{tipText}</div>
      <button
        className="pin-del"
        onClick={(e) => {
          e.stopPropagation()
          removeConditionPin(cp.id)
        }}
        title="Remove"
      >
        &times;
      </button>
    </div>
  )
}

export function BodyImage({
  viewId,
  src,
  alt,
  isHidden,
  side,
  body,
}: {
  viewId: string
  src: string
  alt: string
  isHidden: boolean
  side: "front" | "back"
  body: "male" | "female"
}) {
  const { bodyClicked, pinPlaceMode, injuries, conditionPins, formModal } = useTracker()
  const wrapRef = useRef<HTMLDivElement>(null)

  const leftLabel = side === "front" ? "RIGHT" : "LEFT"
  const rightLabel = side === "front" ? "LEFT" : "RIGHT"

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const wrap = wrapRef.current
      if (!wrap) return
      const r = wrap.getBoundingClientRect()
      const x = parseFloat(((e.clientX - r.left) / r.width * 100).toFixed(1))
      const y = parseFloat(((e.clientY - r.top) / r.height * 100).toFixed(1))
      bodyClicked(x, y)
    },
    [bodyClicked],
  )

  // Filter injuries that belong to this view
  const viewPins = injuries.filter(
    (inj) => inj.pin.side === side && inj.pin.body === body,
  )

  // Filter condition pins that belong to this view
  const viewCondPins = conditionPins.filter(
    (cp) => cp.pin.side === side && cp.pin.body === body,
  )

  // Show preview pin if pending pin matches this view
  const preview = formModal.pendingPin
  const showPreview =
    preview && preview.side === side && preview.body === body

  return (
    <div
      ref={wrapRef}
      id={`view-${viewId}`}
      className={`body-wrap${isHidden ? " hidden" : ""}${pinPlaceMode ? " pin-place-mode" : ""}`}
      style={isHidden ? { display: "none" } : undefined}
      onClick={!isHidden ? handleClick : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      <div className="pins-layer" id={`pins-${viewId}`}>
        {viewPins.map((inj) => (
          <DraggablePin key={inj.id} inj={inj} />
        ))}
        {viewCondPins.map((cp) => (
          <DraggableConditionPin key={cp.id} cp={cp} />
        ))}
        {showPreview && (
          <div
            className="pin pin-preview"
            style={{
              left: `${preview.x}%`,
              top: `${preview.y}%`,
              pointerEvents: "none",
              opacity: 0.6,
            }}
          >
            <div className="pin-head" style={{ background: "#64748b" }}>
              <div className="dot"></div>
            </div>
            <div className="pin-tip" style={{ opacity: 1, background: "#64748b" }}>
              {preview.label || "Custom Pin"}
            </div>
          </div>
        )}
      </div>
      <div
        className="body-side-label"
        style={{ ...SIDE_LABEL_STYLE, left: "6px" }}
      >
        {leftLabel}
      </div>
      <div
        className="body-side-label"
        style={{ ...SIDE_LABEL_STYLE, right: "6px" }}
      >
        {rightLabel}
      </div>
    </div>
  )
}
