'use client'

import { useTracker } from '../../hooks/useTrackerStore'
import { Header } from './Header'
import { TabBar } from './TabBar'
import { MapTab } from './tabs/MapTab'
import { TimelineTab } from './tabs/TimelineTab'
import { SeveritySecondaryTab } from './tabs/SeveritySecondaryTab'
import { SpecialClaimsTab } from './tabs/SpecialClaimsTab'
import { RatingTab } from './tabs/RatingTab'
import { PersonalStatementTab } from './tabs/PersonalStatementTab'
import { useExport } from '../../hooks/useExport'

export function TrackerLayout() {
  const { state, dispatch } = useTracker()
  const { activeTab } = state
  const { exportPDF, exportCSV, exportTXT } = useExport()

  function handleReset() {
    dispatch({ type: 'RESET' })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--fd)' }}>
      <Header
        onExportPDF={exportPDF}
        onExportCSV={exportCSV}
        onExportTXT={exportTXT}
        onReset={handleReset}
      />
      <TabBar />

      <div style={{ minHeight: 'calc(100vh - 120px)' }}>
        {activeTab === 'map'       && <MapTab />}
        {activeTab === 'timeline'  && <TimelineTab />}
        {activeTab === 'secondary' && <SeveritySecondaryTab />}
        {activeTab === 'special'   && <SpecialClaimsTab />}
        {activeTab === 'rating'    && <RatingTab />}
        {activeTab === 'statement' && <PersonalStatementTab />}
      </div>

      <div className="disc">
        <div className="disc-box">
          <strong>Disclaimer:</strong> This tool is for personal documentation and planning purposes only.
          It does not constitute legal or medical advice. VA ratings shown are estimates based on general
          VA rating criteria (38 CFR Part 4). Always consult a VSO or accredited VA attorney for official
          claim assistance.
        </div>
      </div>
    </div>
  )
}
