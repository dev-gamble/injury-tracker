"use client"

import { useMemo } from "react"
import { useTracker } from "@/lib/endex/tracker-context"
import { BP_REGISTRY, hasBilateralSides, VA_AREA_CONDITIONS } from "@/lib/endex/data"
import { getProfileForRegion } from "@/lib/endex/profiles"
import { BilateralDialog } from "./bilateral-dialog"

export function EvalPanelBP({ regionId }: { regionId: string }) {
  const {
    evalPanel,
    evalConditions,
    evalSearch,
    setEvalSearch,
    toggleEvalCondition,
    updateEvalDomain,
    setEvalOverride,
    toggleEvalOverride,
    removeEvalCondition,
    unlinkBilateral,
    switchBPSide,
    placePinFromPanel,
    closeEvalPanel,
    toggleEvalCard,
    collapsedCards,
    bilateralPrompt,
  } = useTracker()

  const cfg = BP_REGISTRY[regionId]
  const conds = evalConditions[regionId] || []
  const filter = evalSearch.toLowerCase()
  const pinKey = evalPanel.pinKey

  // Side tabs logic: only show for non-bilateral multi-option panels (e.g. back: Upper/Mid/Lower)
  const sideEntries = cfg ? Object.entries(cfg.sideKeys) : []
  const isBilateralPanel = hasBilateralSides(regionId)
  const showSideTabs = !isBilateralPanel && sideEntries.length > 1

  // Only show current session conditions (non-committed)
  const visibleConds = useMemo(
    () => conds.filter((c) => !c._committed),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [evalConditions[regionId]],
  )

  // Condition list from VA_AREA_CONDITIONS
  const conditionsKey = cfg?.conditions || regionId
  const filtered = useMemo(() => {
    const allConditions = VA_AREA_CONDITIONS[conditionsKey] || []
    if (!filter) return allConditions
    return allConditions.filter((name) => name.toLowerCase().includes(filter))
  }, [conditionsKey, filter])

  // For single-select radio: current session's selection
  const currentCond = visibleConds.length > 0 ? visibleConds[0] : null
  const selectedName = currentCond?.condition || ""

  const overrideValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  if (!cfg) return null

  return (
    <div className="mental-panel" id={cfg.id + "-panel"}>
      <div className="mh-header">
        <span className="mh-title">{cfg.title}</span>
        <button className="mh-back" onClick={closeEvalPanel}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7" />
          </svg>
          Back to Map
        </button>
      </div>

      <div className="mh-body">
        {/* Info banner */}
        <div className="mh-info">
          <strong>{cfg.title}:</strong> {cfg.note}
        </div>

        {/* Side tabs for non-bilateral multi-option panels */}
        {showSideTabs && (
          <div className="bp-side-tabs">
            {sideEntries.map(([key, label]) => (
              <button
                key={key}
                className={`bp-side-tab${pinKey === key ? " active" : ""}`}
                onClick={() => switchBPSide(regionId, key)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="mh-search">
          <svg className="mh-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search conditions..."
            value={evalSearch}
            onChange={(e) => setEvalSearch(e.target.value)}
          />
        </div>

        {/* Condition checklist (radio single-select) */}
        <div className="mh-cond-list" id={`bp-cond-list-${regionId}`}>
          {filtered.map((name) => {
            const checked = selectedName === name
            return (
              <div
                key={name}
                className={`mh-cond-item${checked ? " selected" : ""}`}
                onClick={() => toggleEvalCondition(regionId, name)}
              >
                <input
                  type="radio"
                  name={`bp-cond-${regionId}`}
                  checked={checked}
                  onChange={() => {}}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleEvalCondition(regionId, name)
                  }}
                />
                <span className="mh-cond-label">{name}</span>
                {checked && currentCond && (
                  <span className={`mh-cond-badge mh-rate-${currentCond.effectiveRating}`}>
                    {currentCond.effectiveRating}%
                  </span>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ padding: "14px", color: "var(--muted)", fontSize: "12px", textAlign: "center" }}>
              No conditions match your search.
            </div>
          )}
        </div>

        {/* Evaluations */}
        {visibleConds.length > 0 ? (
          <>
            <div className="mh-section-title">
              Evaluations ({visibleConds.length} condition{visibleConds.length > 1 ? "s" : ""})
            </div>

            {visibleConds.map((cond) => {
              const { profile } = getProfileForRegion(regionId, cond.condition)
              const overrideActive = cond.manualOverride !== null
              const isCollapsed = collapsedCards.has(cond.id)
              const extLabel = cond.sideLabel
                ? ` (${cond.sideLabel})`
                : cond.extremity !== "none"
                  ? ` [${cond.extremity}]`
                  : ""

              return (
                <div key={cond.id} className="mh-eval-card">
                  {/* Header */}
                  <div className="mh-eval-header" onClick={() => toggleEvalCard(cond.id)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                      <span className="mh-eval-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cond.condition}{extLabel}
                      </span>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 600,
                          fontFamily: "var(--fh)",
                          color: "var(--muted)",
                          background: "var(--bg)",
                          border: "1px solid var(--border)",
                          padding: "1px 6px",
                          borderRadius: "3px",
                        }}
                      >
                        {profile.label.split("(")[0].trim()}
                      </span>
                      {cond.bilateralLinked && (
                        <>
                          <span className="bilateral-badge">Bilateral &#128279;</span>
                          <button
                            className="bilateral-unlink"
                            onClick={(e) => {
                              e.stopPropagation()
                              unlinkBilateral(regionId, cond.id)
                            }}
                            title="Unlink — evaluate sides independently"
                          >
                            Unlink
                          </button>
                        </>
                      )}
                      {overrideActive && <span className="mh-override-tag">Manual</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className={`mh-eval-rating mh-rate-${cond.effectiveRating}`}>
                        {cond.effectiveRating}%
                      </span>
                      <button
                        className="mh-remove"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeEvalCondition(regionId, cond.id)
                        }}
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  </div>

                  {/* Body (domains) */}
                  <div className={`mh-eval-body${isCollapsed ? " collapsed" : ""}`} id={`bp-eval-${cond.id}`}>
                    {/* Profile note */}
                    {profile.note && (
                      <div
                        style={{
                          padding: "8px 12px",
                          marginBottom: "10px",
                          background: "#fffbeb",
                          border: "1px solid #fde68a",
                          borderRadius: "6px",
                          fontSize: "11px",
                          color: "#92400e",
                        }}
                      >
                        {profile.note}
                      </div>
                    )}

                    {/* Domain cards */}
                    {profile.domains.map((domain) => {
                      const currentValue = (cond.domains[domain.id] as number) || 0

                      return (
                        <div key={domain.id} className="mh-domain">
                          <div className="mh-domain-header">
                            <div className="mh-domain-label">{domain.label}</div>
                            <div className="mh-domain-desc">{domain.description}</div>
                          </div>

                          <div className="hd-levels">
                            {domain.levels.map((lv) => (
                              <button
                                key={lv.value}
                                className={`hd-level-btn${currentValue === lv.value ? " hd-active" : ""}`}
                                onClick={() => updateEvalDomain(regionId, cond.id, domain.id, lv.value)}
                              >
                                <span className="hd-level-val">{lv.value}%</span>
                                <span className="hd-level-body">
                                  <span className="hd-level-label">{lv.label}</span>
                                  {lv.description && (
                                    <div className="hd-level-desc">{lv.description}</div>
                                  )}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}

                    {/* Calculated rating */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: "rgba(10,35,87,.04)",
                        borderRadius: "6px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--navy)",
                            fontFamily: "var(--fh)",
                            textTransform: "uppercase",
                            letterSpacing: ".5px",
                          }}
                        >
                          Calculated Rating
                        </div>
                        <div className="bp-calc-val" style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--fm)", color: "var(--navy)" }}>
                          {cond.calculatedRating}%
                        </div>
                      </div>
                    </div>

                    {/* Manual override */}
                    <div className="mh-override">
                      <label>
                        <input
                          type="checkbox"
                          checked={overrideActive}
                          onChange={(e) => toggleEvalOverride(regionId, cond.id, e.target.checked)}
                        />
                        Manual Override
                      </label>
                      {overrideActive && (
                        <select
                          value={cond.manualOverride ?? 0}
                          onChange={(e) => setEvalOverride(regionId, cond.id, parseInt(e.target.value))}
                        >
                          {overrideValues.map((v) => (
                            <option key={v} value={v}>
                              {v}%
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <div className="mh-empty">
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>&#128161;</div>
            <strong>Select a condition above to begin evaluation</strong>
            <br />
            Choose a condition, then rate it using VA diagnostic criteria.
          </div>
        )}

        {/* Place Pin / Done buttons */}
        <div className="mh-done-wrap">
          {visibleConds.length > 0 && (
            <>
              <button className="mh-done-btn" onClick={placePinFromPanel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z" />
                </svg>{" "}
                Place Pin for{" "}
                <strong>
                  {visibleConds[0].condition}
                  {visibleConds[0].effectiveRating > 0 ? ` — ${visibleConds[0].effectiveRating}%` : ""}
                </strong>
              </button>
              <div style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center", marginTop: "6px" }}>
                Click to return to the map and place a pin for this condition.
              </div>
            </>
          )}
          <button className="mh-back-btn" onClick={closeEvalPanel} style={{ marginTop: "8px" }}>
            Back to Map (no pin)
          </button>
        </div>
      </div>

      {/* Bilateral side selection dialog */}
      {bilateralPrompt && bilateralPrompt.regionId === regionId && <BilateralDialog />}
    </div>
  )
}
