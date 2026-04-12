import { BodyPanel } from "./body-panel"
import { Sidebar } from "./sidebar"
import { EvaluationPanels } from "./evaluation-panels"

export function TabMap() {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flex: 1,
            minWidth: "200px",
          }}
        >
          <label
            htmlFor="user-id-field"
            style={{
              fontSize: "10px",
              fontWeight: 700,
              fontFamily: "var(--fh)",
              color: "var(--navy)",
              textTransform: "uppercase",
              letterSpacing: ".5px",
              whiteSpace: "nowrap",
            }}
          >
            Name / ID
          </label>
          <input
            type="text"
            id="user-id-field"
            placeholder="Your name, case number, or identifier..."
            style={{
              flex: 1,
              padding: "6px 10px",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              fontFamily: "var(--fm)",
              fontSize: "12px",
              background: "var(--surface)",
            }}
          />
        </div>
        <span
          style={{
            fontSize: "10px",
            color: "var(--muted)",
            fontStyle: "italic",
          }}
        >
          Appears on exports so reviewers know who this belongs to.
        </span>
      </div>
      <div className="map-layout">
        <BodyPanel />
        <Sidebar />
        <EvaluationPanels />
      </div>
    </>
  )
}
