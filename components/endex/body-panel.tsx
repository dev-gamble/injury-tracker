"use client"

import { useTracker } from "@/lib/endex/tracker-context"
import { BodyImage } from "./body-image"

export function BodyPanel() {
  const { curSide, curBody, setSide, setBody, activeViewId } = useTracker()

  return (
    <div className="body-panel">
      <div className="toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="tb-lbl">View</span>
          <div className="tgrp">
            <button
              className={`tog${curSide === "front" ? " active" : ""}`}
              onClick={() => setSide("front")}
            >
              Front
            </button>
            <button
              className={`tog${curSide === "back" ? " active" : ""}`}
              onClick={() => setSide("back")}
            >
              Back
            </button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="tb-lbl">Body</span>
          <div className="tgrp">
            <button
              className={`tog${curBody === "male" ? " active" : ""}`}
              onClick={() => setBody("male")}
            >
              Male
            </button>
            <button
              className={`tog${curBody === "female" ? " active" : ""}`}
              onClick={() => setBody("female")}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      <BodyImage
        viewId="mf"
        src="/body-diagrams/body-male-front.png"
        alt="Male front body diagram"
        isHidden={activeViewId !== "mf"}
        side="front"
        body="male"
      />
      <BodyImage
        viewId="mb"
        src="/body-diagrams/body-male-back.png"
        alt="Male back body diagram"
        isHidden={activeViewId !== "mb"}
        side="back"
        body="male"
      />
      <BodyImage
        viewId="ff"
        src="/body-diagrams/body-female-front.png"
        alt="Female front body diagram"
        isHidden={activeViewId !== "ff"}
        side="front"
        body="female"
      />
      <BodyImage
        viewId="fb"
        src="/body-diagrams/body-female-back.png"
        alt="Female back body diagram"
        isHidden={activeViewId !== "fb"}
        side="back"
        body="female"
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
