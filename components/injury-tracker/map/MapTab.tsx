"use client"

export function MapTab() {
  return (
    <div id="tab-map" className="content">
      <div className="tab-instructions" style={{ margin: "0 0 8px" }}>
        Select the body area where you have an issue using the <strong>Quick Select</strong> list on
        the right, or click anywhere on the body map to drop a custom pin and enter your information.
        Fill in what happened, when, and where.
      </div>
      <div className="map-layout">

        {/* CENTER: body image */}
        <div className="body-panel">
          <div className="toolbar">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="tb-lbl">View</span>
              <div className="tgrp">
                <button
                  className="tog active"
                  id="btn-front"
                  onClick={() => window.setSide?.("front")}
                >
                  Front
                </button>
                <button
                  className="tog"
                  id="btn-back"
                  onClick={() => window.setSide?.("back")}
                >
                  Back
                </button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="tb-lbl">Body</span>
              <div className="tgrp">
                <button
                  className="tog active"
                  id="btn-male"
                  onClick={() => window.setBody?.("male")}
                >
                  Male
                </button>
                <button
                  className="tog"
                  id="btn-female"
                  onClick={() => window.setBody?.("female")}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          {/* MALE FRONT */}
          <div
            id="view-mf"
            className="body-wrap"
            onClick={(e) => window.bodyClicked?.(e.nativeEvent, e.currentTarget)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="body-img" src="/images/injury-tracker/body-male-front.png" alt="Male front body diagram" />
            <div className="pins-layer" id="pins-mf"></div>
          </div>

          {/* MALE BACK */}
          <div
            id="view-mb"
            className="body-wrap hidden"
            style={{ display: "none" }}
            onClick={(e) => window.bodyClicked?.(e.nativeEvent, e.currentTarget)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="body-img" src="/images/injury-tracker/body-male-back.png" alt="Male back body diagram" />
            <div className="pins-layer" id="pins-mb"></div>
          </div>

          {/* FEMALE FRONT */}
          <div
            id="view-ff"
            className="body-wrap hidden"
            style={{ display: "none" }}
            onClick={(e) => window.bodyClicked?.(e.nativeEvent, e.currentTarget)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="body-img" src="/images/injury-tracker/body-female-front.png" alt="Female front body diagram" />
            <div className="pins-layer" id="pins-ff"></div>
          </div>

          {/* FEMALE BACK */}
          <div
            id="view-fb"
            className="body-wrap hidden"
            style={{ display: "none" }}
            onClick={(e) => window.bodyClicked?.(e.nativeEvent, e.currentTarget)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="body-img" src="/images/injury-tracker/body-female-back.png" alt="Female back body diagram" />
            <div className="pins-layer" id="pins-fb"></div>
          </div>
        </div>

        {/* RIGHT: quick-select sidebar */}
        <div className="sidebar" id="sidebar">
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--navy)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
              fontFamily: "var(--fh)",
              borderBottom: "2px solid var(--red)",
              paddingBottom: "8px",
            }}
          >
            Quick Select
          </div>
          <div id="sb-list"></div>
        </div>

        {/* EVALUATION PANELS — populated by JS */}
        <div id="mental-health-panel" className="mental-panel hidden"></div>
        <div id="head-panel" className="mental-panel hidden"></div>
        <div id="knee-panel" className="mental-panel hidden"></div>
        <div id="back-panel" className="mental-panel hidden"></div>
        <div id="shoulder-panel" className="mental-panel hidden"></div>
        <div id="neck-panel" className="mental-panel hidden"></div>
        <div id="hip-panel" className="mental-panel hidden"></div>
        <div id="elbow-panel" className="mental-panel hidden"></div>
        <div id="wrist-panel" className="mental-panel hidden"></div>
        <div id="ankle-panel" className="mental-panel hidden"></div>
        <div id="chest-panel" className="mental-panel hidden"></div>
        <div id="abdomen-panel" className="mental-panel hidden"></div>
        <div id="leg-panel" className="mental-panel hidden"></div>
        <div id="systemic-panel" className="mental-panel hidden"></div>
      </div>
    </div>
  )
}
