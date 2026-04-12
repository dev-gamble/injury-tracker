"use client"

import { useEffect, useState } from "react"
import { TrackerProvider, useTracker } from "@/lib/endex/tracker-context"
import { Header } from "./header"
import { TabBar } from "./tab-bar"
import { TabMap } from "./tab-map"
import { TabTimeline } from "./tab-timeline"
import { TabSecondary } from "./tab-secondary"
import { TabSpecial } from "./tab-special"
import { TabRating } from "./tab-rating"
import { TabStatement } from "./tab-statement"
import { FormModal } from "./form-modal"
import { ImportModal } from "./import-modal"
import { Footer } from "./footer"
import { ToastNotification } from "./toast-notification"

function TrackerShellInner() {
  const [activeTab, setActiveTab] = useState("map")
  const { pinPlaceMode, cancelPinPlaceMode } = useTracker()

  // Toggle pin-placing class on .endex-root ancestor
  useEffect(() => {
    const root = document.querySelector(".endex-root")
    if (!root) return
    if (pinPlaceMode) {
      root.classList.add("pin-placing")
    } else {
      root.classList.remove("pin-placing")
    }
    return () => {
      root.classList.remove("pin-placing")
    }
  }, [pinPlaceMode])

  return (
    <>
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <div id="tab-map" className={`content${activeTab !== "map" ? " hidden" : ""}`}>
        <TabMap />
      </div>

      <div id="tab-secondary" className={`content${activeTab !== "secondary" ? " hidden" : ""}`}>
        <TabSecondary />
      </div>

      <div id="tab-special" className={`content${activeTab !== "special" ? " hidden" : ""}`}>
        <TabSpecial />
      </div>

      <div id="tab-timeline" className={`content${activeTab !== "timeline" ? " hidden" : ""}`}>
        <TabTimeline />
      </div>

      <div id="tab-rating" className={`content${activeTab !== "rating" ? " hidden" : ""}`}>
        <TabRating />
      </div>

      <div id="tab-statement" className={`content${activeTab !== "statement" ? " hidden" : ""}`}>
        <TabStatement />
      </div>

      <FormModal />
      <ImportModal />
      <ToastNotification />

      {pinPlaceMode && (
        <div className="pin-place-prompt">
          <span>
            Click the body map to place: <strong>{pinPlaceMode.label}</strong>
          </span>
          <button onClick={cancelPinPlaceMode}>Cancel</button>
        </div>
      )}

      {/* Walkthrough overlay */}
      <div
        id="walkthrough-overlay"
        className="bilateral-overlay"
        style={{ display: "none", zIndex: 10000 }}
      >
        <div
          className="bilateral-dialog"
          style={{ maxWidth: "480px", padding: 0, overflow: "hidden" }}
        >
          <div id="wt-content"></div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export function TrackerShell() {
  return (
    <TrackerProvider>
      <TrackerShellInner />
    </TrackerProvider>
  )
}
