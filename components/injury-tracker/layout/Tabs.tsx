"use client"

export function Tabs() {
  return (
    <div className="tabs">
      <button
        className="tab active"
        onClick={(e) => window.showTab?.("map", e.currentTarget)}
      >
        Primary Map
      </button>
      <button
        className="tab"
        id="sc-tab"
        onClick={(e) => window.showTab?.("secondary", e.currentTarget)}
      >
        Severity &amp; Secondary
      </button>
      <button
        className="tab"
        id="sp-tab"
        onClick={(e) => window.showTab?.("special", e.currentTarget)}
      >
        Special Claims
      </button>
      <button
        className="tab"
        id="tl-tab"
        onClick={(e) => window.showTab?.("timeline", e.currentTarget)}
      >
        Timeline
      </button>
      <button
        className="tab"
        id="rc-tab"
        onClick={(e) => window.showTab?.("rating", e.currentTarget)}
      >
        Rating
      </button>
      <button
        className="tab"
        id="ps-tab"
        onClick={(e) => window.showTab?.("statement", e.currentTarget)}
      >
        Personal Statement
      </button>
    </div>
  )
}
