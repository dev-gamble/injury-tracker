export function SecondaryTab() {
  return (
    <div id="tab-secondary" className="content hidden">
      <div className="tl-bar">
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            fontFamily: "var(--fh)",
            textTransform: "uppercase",
            letterSpacing: ".5px",
            color: "var(--navy)",
          }}
        >
          Claim Map — Severity &amp; Secondary
        </div>
      </div>
      <div className="tab-instructions">
        Rate how bad each condition is and add any secondary issues it has caused. Click{" "}
        <strong>&ldquo;Rate&rdquo;</strong> to answer questions about your condition. Under each claim,
        use <strong>&ldquo;Add Secondary&rdquo;</strong> to list problems caused by that condition (for
        example: a knee injury that caused back pain, or PTSD that caused insomnia). Secondary
        conditions can increase your overall rating.
      </div>
      <div id="sc-list"></div>
    </div>
  )
}
