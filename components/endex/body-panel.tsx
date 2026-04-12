import { BodyImage } from "./body-image"

export function BodyPanel() {
  return (
    <div className="body-panel">
      <div className="toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="tb-lbl">View</span>
          <div className="tgrp">
            <button className="tog active" id="btn-front">
              Front
            </button>
            <button className="tog" id="btn-back">
              Back
            </button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="tb-lbl">Body</span>
          <div className="tgrp">
            <button className="tog active" id="btn-male">
              Male
            </button>
            <button className="tog" id="btn-female">
              Female
            </button>
          </div>
        </div>
      </div>

      <BodyImage
        id="view-mf"
        src="/body-diagrams/body-male-front.png"
        alt="Male front body diagram"
        pinsId="pins-mf"
        isHidden={false}
        side="front"
      />
      <BodyImage
        id="view-mb"
        src="/body-diagrams/body-male-back.png"
        alt="Male back body diagram"
        pinsId="pins-mb"
        isHidden={true}
        side="back"
      />
      <BodyImage
        id="view-ff"
        src="/body-diagrams/body-female-front.png"
        alt="Female front body diagram"
        pinsId="pins-ff"
        isHidden={true}
        side="front"
      />
      <BodyImage
        id="view-fb"
        src="/body-diagrams/body-female-back.png"
        alt="Female back body diagram"
        pinsId="pins-fb"
        isHidden={true}
        side="back"
      />

      <div className="pin-legend">
        <span className="pin-legend-title">Pin Key:</span>
        <span className="pin-legend-item">
          <span
            className="pin-legend-dot"
            style={{ background: "#dc2626" }}
          ></span>{" "}
          Single (Unilateral)
        </span>
        <span className="pin-legend-item">
          <span
            className="pin-legend-dot"
            style={{ background: "#1d4ed8" }}
          ></span>{" "}
          Bilateral (Both Sides)
        </span>
      </div>
    </div>
  )
}
