export function TabStatement() {
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
          Notes &amp; Statement
        </div>
      </div>
      <div className="tab-instructions">
        Use this space for personal notes, research, or your VA personal
        statement. Write in your own words — explain how your conditions started,
        how they&apos;ve gotten worse, and how they affect your daily life. Your
        logged conditions are listed on the right for easy reference.
      </div>
      <div id="ps-content"></div>
    </>
  )
}
