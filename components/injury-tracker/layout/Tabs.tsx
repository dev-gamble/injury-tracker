"use client"

import { useInjuryStore } from '../store/useInjuryStore'

export function Tabs() {
  const activeTab = useInjuryStore((s) => s.ui.activeTab)
  const setActiveTab = useInjuryStore((s) => s.setActiveTab)
  const injuries = useInjuryStore((s) => s.injuries)
  const mentalConditions = useInjuryStore((s) => s.mentalConditions)
  const headConditions = useInjuryStore((s) => s.headConditions)
  const bpConditions = useInjuryStore((s) => s.bpConditions)

  const totalSecCount = [
    ...injuries.map(i => (i.secondaries || []).length),
    ...mentalConditions.map(c => (c.secondaries || []).length),
    ...headConditions.map(c => (c.secondaries || []).length),
    ...Object.values(bpConditions).flatMap(arr => arr.map(c => (c.secondaries || []).length)),
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="tabs">
      <button
        className={`tab${activeTab === 'map' ? ' active' : ''}`}
        onClick={() => setActiveTab('map')}
      >
        Primary Map
      </button>
      <button
        className={`tab${activeTab === 'secondary' ? ' active' : ''}`}
        id="sc-tab"
        onClick={() => setActiveTab('secondary')}
      >
        Severity &amp; Secondary{totalSecCount > 0 ? ` (${totalSecCount})` : ''}
      </button>
      <button
        className={`tab${activeTab === 'special' ? ' active' : ''}`}
        id="sp-tab"
        onClick={() => setActiveTab('special')}
      >
        Special Claims
      </button>
      <button
        className={`tab${activeTab === 'timeline' ? ' active' : ''}`}
        id="tl-tab"
        onClick={() => setActiveTab('timeline')}
      >
        Timeline
      </button>
      <button
        className={`tab${activeTab === 'rating' ? ' active' : ''}`}
        id="rc-tab"
        onClick={() => setActiveTab('rating')}
      >
        Rating
      </button>
      <button
        className={`tab${activeTab === 'statement' ? ' active' : ''}`}
        id="ps-tab"
        onClick={() => setActiveTab('statement')}
      >
        Personal Statement
      </button>
    </div>
  )
}
