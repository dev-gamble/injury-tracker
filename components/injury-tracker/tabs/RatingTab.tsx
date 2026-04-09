export function RatingTab() {
  return (
    <div id="tab-rating" className="content hidden">
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
          VA Rating Calculator
        </div>
      </div>
      <div className="tab-instructions">
        Your estimated combined VA disability rating based on all conditions you&apos;ve entered. The VA
        uses <strong>&ldquo;VA Math&rdquo;</strong> — each rating is applied to the remaining healthy
        percentage, not simply added together. Conditions affecting both sides of your body (left and
        right knee, for example) get a 10% bilateral bonus. This is an estimate only — your actual
        rating may differ.
      </div>
      <div id="rc-list"></div>
    </div>
  )
}
