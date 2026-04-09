export function TimelineTab() {
  return (
    <div id="tab-timeline" className="content hidden">
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
          Injury History
        </div>
        <button
          className="btn-p"
          onClick={() => {
            const mapTab = document.querySelectorAll(".tab")[0] as HTMLElement
            ;window.showTab?.("map", mapTab)
          }}
          style={{ flex: "none", padding: "8px 16px", fontSize: "13px" }}
        >
          + Add Injury
        </button>
      </div>
      <div className="tab-instructions">
        Your injury history in order. Each entry shows the date, location, and details you provided.
        Items need a date to appear here. Go to the <strong>Primary Map</strong> tab to add or edit
        injuries.
      </div>
      <div id="tl-list"></div>
    </div>
  )
}
