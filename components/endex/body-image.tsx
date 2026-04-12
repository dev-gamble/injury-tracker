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

export function BodyImage({
  id,
  src,
  alt,
  pinsId,
  isHidden,
  side,
}: {
  id: string
  src: string
  alt: string
  pinsId: string
  isHidden: boolean
  side: "front" | "back"
}) {
  // Front view: person's RIGHT is on viewer's LEFT, person's LEFT is on viewer's RIGHT
  // Back view: person's RIGHT is on viewer's RIGHT, person's LEFT is on viewer's LEFT
  const leftLabel = side === "front" ? "RIGHT" : "LEFT"
  const rightLabel = side === "front" ? "LEFT" : "RIGHT"

  return (
    <div
      id={id}
      className={`body-wrap${isHidden ? " hidden" : ""}`}
      style={isHidden ? { display: "none" } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      <div className="pins-layer" id={pinsId}></div>
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
