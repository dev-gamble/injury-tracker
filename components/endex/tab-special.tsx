export function TabSpecial() {
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
          War-Related &amp; Special Claims
        </div>
      </div>
      <div className="tab-instructions">
        Add claims related to your job, combat service, or special
        circumstances. This includes things like{" "}
        <strong>combat-related conditions</strong>,{" "}
        <strong>Military Sexual Trauma (MST)</strong>, Agent Orange exposure,
        burn pit exposure, and Gulf War illness. These claims have special rules
        that can help your case.
      </div>
      <div id="sp-list"></div>
    </>
  )
}
