export function StatementTab() {
  return (
    <div id="tab-statement" className="content hidden">
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
          Personal Statement
        </div>
      </div>
      <div className="tab-instructions">
        Use this space to write your personal statement in your own words. Explain how your conditions
        started, how they&apos;ve gotten worse, and how they affect your daily life. The conditions
        you&apos;ve logged are listed on the right for reference.
      </div>
      <div id="ps-content"></div>
    </div>
  )
}
