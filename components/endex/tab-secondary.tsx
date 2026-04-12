export function TabSecondary() {
  return (
    <>
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
        Rate how bad each condition is and add any secondary issues it has
        caused. Click <strong>&quot;Rate&quot;</strong> to answer questions about
        your condition. Under each claim, use{" "}
        <strong>&quot;Add Secondary&quot;</strong> to list problems caused by
        that condition (for example: a knee injury that caused back pain, or
        PTSD that caused insomnia). Secondary conditions can increase your
        overall rating.
      </div>
      <div id="sc-list"></div>
    </>
  )
}
