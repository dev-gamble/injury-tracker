"use client"

import Script from "next/script"
import { Header } from "./layout/Header"
import { Tabs } from "./layout/Tabs"
import { MapTab } from "./map/MapTab"
import { InjuryModal } from "./modals/InjuryModal"
import { ImportModal } from "./modals/ImportModal"
import { TimelineTab } from "./tabs/TimelineTab"
import { SecondaryTab } from "./tabs/SecondaryTab"
import { RatingTab } from "./tabs/RatingTab"
import { SpecialTab } from "./tabs/SpecialTab"
import { StatementTab } from "./tabs/StatementTab"
import { Disclaimer } from "./layout/Disclaimer"

export function InjuryTrackerApp() {
  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh", color: "#0a1628", fontFamily: "'Open Sans', sans-serif" }}>
      <Header />
      <Tabs />

      {/* MAP TAB */}
      <MapTab />

      {/* MODALS */}
      <InjuryModal />
      <ImportModal />

      {/* OTHER TABS */}
      <TimelineTab />
      <SecondaryTab />
      <SpecialTab />
      <RatingTab />
      <StatementTab />

      <Disclaimer />

      {/* All JS bundled in dependency order */}
      <Script
        src="/injury-tracker/js/bundle.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.buildSidebar?.()
          window.updateView?.()
        }}
      />
    </div>
  )
}
