export function Header() {
  return (
    <header>
      <div className="logo">
        <h1>ENDEX</h1>
        <div className="logo-div"></div>
        <div className="logo-sub">Index injuries. Build stronger VA claims.</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          className="export-btn"
          id="guide-btn"
          style={{
            background: "var(--navy)",
            borderColor: "var(--navy2)",
            padding: "6px 10px",
            fontSize: "11px",
          }}
          title="How to use this app"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Guide
        </button>
        <button
          className="export-btn"
          id="cb-toggle"
          style={{
            background: "var(--navy)",
            borderColor: "var(--navy2)",
            padding: "6px 10px",
            fontSize: "11px",
          }}
          title="Toggle black and white mode"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 010 20V2z" fill="currentColor" />
          </svg>
          <span id="cb-label">B&amp;W Mode</span>
        </button>
        <div style={{ position: "relative" }} id="export-wrap">
          <button className="export-btn">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
            </svg>
            Import / Export
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div id="export-menu" className="export-menu hidden">
            <div
              style={{
                padding: "6px 16px 2px",
                fontSize: "9px",
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Project
            </div>
            <button>Save Project (.vaclaim)</button>
            <button>Load Project (.vaclaim)</button>
            <div
              style={{
                padding: "6px 16px 2px",
                fontSize: "9px",
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "1px",
                textTransform: "uppercase",
                borderTop: "1px solid var(--border)",
              }}
            >
              Export
            </div>
            <button>PDF / Print Summary</button>
            <button>CSV Spreadsheet</button>
            <button>TXT Report</button>
          </div>
        </div>
      </div>
    </header>
  )
}
