"use client"

export function ImportModal() {
  return (
    <div
      id="import-modal"
      className="modal-overlay hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) window.closeImportModal?.()
      }}
    >
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "640px" }}>
        <div className="modal-header">
          <div>
            <div className="ftitle">Import from CSV</div>
            <div className="fsub">Upload a spreadsheet to bulk-import injuries.</div>
          </div>
          <button className="modal-close" onClick={() => window.closeImportModal?.()}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              className="btn-s"
              onClick={() => window.downloadTemplate?.()}
              style={{ fontSize: "11px", padding: "8px 14px" }}
            >
              Download Template
            </button>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              Use this template for the correct column format.
            </span>
          </div>
          <div className="field">
            <label>Select CSV File</label>
            <input
              type="file"
              id="import-file"
              accept=".csv"
              onChange={(e) => window.handleImportFile?.(e.target)}
              style={{ fontSize: "13px" }}
            />
          </div>
          <div id="import-status" style={{ fontSize: "12px", fontWeight: 600, fontFamily: "var(--fh)", letterSpacing: ".3px" }}></div>
          <div id="import-preview" style={{ maxHeight: "250px", overflowY: "auto" }}></div>
          <div className="form-actions">
            <button
              className="btn-p hidden"
              id="import-confirm-btn"
              onClick={() => window.confirmImport?.()}
            >
              Import Injuries
            </button>
            <button className="btn-s" onClick={() => window.closeImportModal?.()}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
