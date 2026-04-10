"use client"

import { useState } from "react"
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
  const [importOpen, setImportOpen] = useState(false)

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh", color: "#0a1628", fontFamily: "'Open Sans', sans-serif" }}>
      <Header onImport={() => setImportOpen(true)} />
      <Tabs />

      {/* MAP TAB */}
      <MapTab />

      {/* MODALS */}
      <InjuryModal />
      <ImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />

      {/* OTHER TABS */}
      <TimelineTab />
      <SecondaryTab />
      <SpecialTab />
      <RatingTab />
      <StatementTab />

      <Disclaimer />
    </div>
  )
}
