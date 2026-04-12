"use client"

import { useMemo } from "react"
import { useTracker } from "@/lib/endex/tracker-context"
import {
  GROUPS_FRONT,
  GROUPS_BACK,
  SIDEBAR_ITEMS,
  VA_AREA_CONDITIONS,
} from "@/lib/endex/data"

const AREA_LABELS: Record<string, string> = {
  head: "Head & Face",
  mental: "Mental Health",
  neck: "Neck",
  shoulder: "Shoulder",
  chest: "Chest / Lungs",
  elbow: "Elbow",
  wrist_hand: "Wrist / Hand",
  abdomen: "Abdomen",
  hip: "Hip",
  knee: "Knee",
  leg: "Leg",
  ankle_foot: "Ankle / Foot",
  back: "Back & Spine",
  systemic: "Systemic",
}

function highlightMatch(text: string, filter: string): string {
  const idx = text.toLowerCase().indexOf(filter)
  if (idx < 0) return text
  return (
    text.slice(0, idx) +
    '<strong style="color:var(--red);">' +
    text.slice(idx, idx + filter.length) +
    "</strong>" +
    text.slice(idx + filter.length)
  )
}

export function Sidebar() {
  const { curSide, quickSelect, sidebarSearch, setSidebarSearch, badgeCounts } =
    useTracker()

  const filter = sidebarSearch.toLowerCase().trim()
  const groups = curSide === "front" ? GROUPS_FRONT : GROUPS_BACK

  // Condition-level search results (when filter >= 2 chars)
  const conditionResults = useMemo(() => {
    if (filter.length < 2) return null
    const results: { name: string; areaKey: string; areaLabel: string }[] = []
    for (const [areaKey, conditions] of Object.entries(VA_AREA_CONDITIONS)) {
      const areaLabel = AREA_LABELS[areaKey] || SIDEBAR_ITEMS[areaKey] || areaKey
      for (const name of conditions) {
        if (name.toLowerCase().includes(filter)) {
          results.push({ name, areaKey, areaLabel })
        }
      }
    }
    return results.length > 0 ? results : null
  }, [filter])

  // Filtered sidebar groups
  const filteredGroups = useMemo(() => {
    if (!filter) return groups
    return groups
      .map((g) => ({
        ...g,
        keys: g.keys.filter((k) => {
          const label = SIDEBAR_ITEMS[k] || k
          return (
            label.toLowerCase().includes(filter) ||
            k.toLowerCase().includes(filter) ||
            g.heading.toLowerCase().includes(filter)
          )
        }),
      }))
      .filter((g) => g.keys.length > 0)
  }, [groups, filter])

  return (
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
      <input
        type="text"
        id="qs-search"
        className="qs-search"
        placeholder="Search body areas..."
        value={sidebarSearch}
        onChange={(e) => setSidebarSearch(e.target.value)}
      />
      <div id="sb-list">
        {/* Condition search results when filter >= 2 chars */}
        {conditionResults && (
          <>
            <div className="sb-head">
              Conditions matching &quot;{filter}&quot; ({conditionResults.length})
            </div>
            {conditionResults.slice(0, 20).map((r, i) => (
              <div
                key={`${r.areaKey}-${i}`}
                className="sb-item"
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "2px",
                  cursor: "pointer",
                }}
                onClick={() => quickSelect(r.areaKey)}
              >
                <span
                  className="sb-name"
                  style={{ fontSize: "12px" }}
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(r.name, filter),
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--muted)",
                    fontFamily: "var(--fh)",
                    textTransform: "uppercase",
                    letterSpacing: ".5px",
                  }}
                >
                  {r.areaLabel}
                </span>
              </div>
            ))}
            {conditionResults.length > 20 && (
              <div
                style={{
                  padding: "8px",
                  fontSize: "11px",
                  color: "var(--muted)",
                  textAlign: "center",
                }}
              >
                +{conditionResults.length - 20} more — refine your search
              </div>
            )}
          </>
        )}

        {/* Normal sidebar groups (always shown, filtered if searching) */}
        {!conditionResults &&
          filteredGroups.map((group) => (
            <div key={group.heading}>
              <div className="sb-head">{group.heading}</div>
              {group.keys.map((key) => {
                const label = SIDEBAR_ITEMS[key] || key
                const badge = badgeCounts[key]
                return (
                  <div
                    key={key}
                    className={`sb-item${badge ? " has" : ""}`}
                    id={`si-${key}`}
                    onClick={() => quickSelect(key)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="sb-name">{label}</span>
                    <span
                      className={`badge ${badge ? `b-${badge.severity}` : "b0"}`}
                      id={`bd-${key}`}
                    >
                      {badge ? badge.count : "+"}
                    </span>
                  </div>
                )
              })}
            </div>
          ))}

        {/* No results message */}
        {filter && !conditionResults && filteredGroups.length === 0 && (
          <div
            style={{
              padding: "14px",
              color: "var(--muted)",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            No results for &quot;{filter}&quot;
          </div>
        )}
      </div>
    </div>
  )
}
