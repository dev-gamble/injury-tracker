'use client'

import { useTracker } from '../../../hooks/useTrackerStore'
import { SIDEBAR_ITEMS, GROUPS_FRONT, GROUPS_BACK } from '../../../lib/va/sidebar'
import { BP_REGISTRY } from '../../../lib/va/registry'

interface SidebarProps {
  onOpenPanel: (regionId: string) => void
}

export function Sidebar({ onOpenPanel }: SidebarProps) {
  const { state } = useTracker()
  const { curSide, bpConditions, mentalHealthConditions, headConditions, bpPanelOpen } = state

  const groups = curSide === 'front' ? GROUPS_FRONT : GROUPS_BACK

  function getCount(regionId: string): number {
    if (regionId === 'mental') return mentalHealthConditions.length
    if (regionId === 'headFace') return headConditions.length
    const entry = BP_REGISTRY[regionId]
    if (!entry) return 0
    return (bpConditions[regionId] ?? []).length
  }

  function getBestRating(regionId: string): number {
    if (regionId === 'mental') {
      const ratings = mentalHealthConditions.map(c => c.effectiveRating)
      return ratings.length ? Math.max(...ratings) : 0
    }
    if (regionId === 'headFace') {
      const ratings = headConditions.map(c => c.effectiveRating)
      return ratings.length ? Math.max(...ratings) : 0
    }
    const conds = bpConditions[regionId] ?? []
    const ratings = conds.map(c => c.effectiveRating)
    return ratings.length ? Math.max(...ratings) : 0
  }

  return (
    <div className="sidebar">
      {groups.map(([groupLabel, regionIds]) => (
        <div key={groupLabel}>
          <div className="sb-head">{groupLabel}</div>
          {regionIds.map(regionId => {
            const count = getCount(regionId)
            const bestRating = getBestRating(regionId)
            const isActive = bpPanelOpen === regionId

            return (
              <div
                key={regionId}
                className={`sb-item${count > 0 ? ' has' : ''}${isActive ? ' active' : ''}`}
                onClick={() => onOpenPanel(regionId)}
                style={isActive ? { background: 'var(--al)', borderColor: 'rgba(200,16,46,.4)' } : undefined}
              >
                <span className="sb-name">{SIDEBAR_ITEMS[regionId]}</span>
                {count > 0 ? (
                  <span className="badge b-severe">{bestRating}%</span>
                ) : (
                  <span className="badge b0">+</span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
