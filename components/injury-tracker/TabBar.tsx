'use client'

import { useTracker } from '../../hooks/useTrackerStore'
import type { TabName } from '../../lib/va/types'

const TABS: { id: TabName; label: string }[] = [
  { id: 'map',       label: 'Body Map' },
  { id: 'timeline',  label: 'Timeline' },
  { id: 'secondary', label: 'Secondaries' },
  { id: 'special',   label: 'Special Claims' },
  { id: 'rating',    label: 'Rating Calculator' },
  { id: 'statement', label: 'Personal Statement' },
]

export function TabBar() {
  const { state, dispatch } = useTracker()
  const { activeTab } = state

  return (
    <div className="tabs">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`tab${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tab: tab.id })}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
