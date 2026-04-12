"use client"

import { useMemo } from "react"
import { useTracker } from "@/lib/endex/tracker-context"
import { VA_AREA_CONDITIONS } from "@/lib/endex/data"
import {
  MH_DOMAINS,
  MH_IMPAIRMENT_LEVELS,
  MH_IMPAIRMENT_LABELS,
} from "@/lib/endex/profiles"
import type { MHDomainValue } from "@/lib/endex/types"

const REGION_ID = "mental"

export function EvalPanelMental() {
  const {
    evalConditions,
    evalSearch,
    setEvalSearch,
    toggleEvalCondition,
    updateEvalDomain,
    updateMHFrequency,
    setEvalOverride,
    toggleEvalOverride,
    removeEvalCondition,
    placePinFromPanel,
    closeEvalPanel,
    toggleEvalCard,
    collapsedCards,
  } = useTracker()

  const conds = evalConditions[REGION_ID] || []
  const filter = evalSearch.toLowerCase()

  // Highest-rated condition
  const highest = useMemo(() => {
    const c = evalConditions[REGION_ID] || []
    if (c.length < 2) return null
    let best = c[0]
    for (const cond of c) {
      if (cond.effectiveRating > best.effectiveRating) best = cond
    }
    return best
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evalConditions[REGION_ID]])

  const highestRating = useMemo(() => {
    let max = 0
    for (const c of conds) {
      if (c.effectiveRating > max) max = c.effectiveRating
    }
    return max
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evalConditions[REGION_ID]])

  // Filtered condition list
  const filtered = useMemo(() => {
    const allConditions = VA_AREA_CONDITIONS.mental || []
    if (!filter) return allConditions
    return allConditions.filter((name) => name.toLowerCase().includes(filter))
  }, [filter])

  const selectedSet = useMemo(
    () => new Set((evalConditions[REGION_ID] || []).map((c) => c.condition)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [evalConditions[REGION_ID]],
  )

  return (
    <div className="mental-panel" id="mental-health-panel">
      <div className="mh-header">
        <span className="mh-title">Mental Health Evaluation</span>
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
          <strong>VA Single Rating Rule:</strong> The VA rates all mental health conditions under one combined rating using the General Rating Formula for Mental Disorders.
          If you have multiple conditions, the <strong>highest evaluated rating</strong> will be used as your single mental health disability rating.
        </div>

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

        {/* Condition checklist */}
        <div className="mh-cond-list" id="mh-cond-list">
          {filtered.map((name) => {
            const checked = selectedSet.has(name)
            const cond = conds.find((c) => c.condition === name)
            return (
              <div
                key={name}
                className={`mh-cond-item${checked ? " selected" : ""}`}
                onClick={() => toggleEvalCondition(REGION_ID, name)}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {}}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleEvalCondition(REGION_ID, name)
                  }}
                />
                <span className="mh-cond-label">{name}</span>
                {cond && (
                  <span className={`mh-cond-badge mh-rate-${cond.effectiveRating}`}>
                    {cond.effectiveRating}%
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
        {conds.length > 0 ? (
          <>
            <div className="mh-section-title">
              Evaluations ({conds.length} condition{conds.length > 1 ? "s" : ""})
            </div>

            {conds.map((cond) => {
              const isHighest = highest && cond.id === highest.id
              const overrideActive = cond.manualOverride !== null
              const isCollapsed = collapsedCards.has(cond.id)

              return (
                <div key={cond.id} className={`mh-eval-card${isHighest ? " mh-highest" : ""}`}>
                  {/* Header */}
                  <div className="mh-eval-header" onClick={() => toggleEvalCard(cond.id)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                      <span className="mh-eval-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cond.condition}
                      </span>
                      {isHighest && <span className="mh-highest-tag">Highest Rating</span>}
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
                          removeEvalCondition(REGION_ID, cond.id)
                        }}
                        title="Remove condition"
                      >
                        &times;
                      </button>
                    </div>
                  </div>

                  {/* Body (domains) */}
                  <div className={`mh-eval-body${isCollapsed ? " collapsed" : ""}`} id={`mh-eval-body-${cond.id}`}>
                    {MH_DOMAINS.map((domain) => {
                      const dv = cond.domains[domain.id] as MHDomainValue
                      const currentLevel = dv?.level || "none"
                      const currentFreq = dv?.frequency || "less25"
                      const exampleText = domain.examples[currentLevel] || ""

                      return (
                        <div key={domain.id} className="mh-domain">
                          <div className="mh-domain-header">
                            <div className="mh-domain-label">{domain.label}</div>
                            <div className="mh-domain-desc">{domain.description}</div>
                          </div>

                          {/* Level buttons */}
                          <div className="mh-levels">
                            {MH_IMPAIRMENT_LEVELS.map((lv) => (
                              <button
                                key={lv}
                                className={`mh-level-btn${currentLevel === lv ? ` active-${lv}` : ""}`}
                                onClick={() =>
                                  updateEvalDomain(REGION_ID, cond.id, domain.id, {
                                    level: lv,
                                    frequency: lv === "none" ? "less25" : currentFreq,
                                  })
                                }
                              >
                                {MH_IMPAIRMENT_LABELS[lv]}
                              </button>
                            ))}
                          </div>

                          {/* Frequency */}
                          {currentLevel !== "none" && (
                            <div className="mh-freq">
                              <span className="mh-freq-label">How often?</span>
                              <button
                                className={`mh-freq-btn${currentFreq === "less25" ? " active" : ""}`}
                                onClick={() => updateMHFrequency(cond.id, domain.id, "less25")}
                              >
                                Less than 25% of time
                              </button>
                              <button
                                className={`mh-freq-btn${currentFreq === "25plus" ? " active" : ""}`}
                                onClick={() => updateMHFrequency(cond.id, domain.id, "25plus")}
                              >
                                25% or more
                              </button>
                            </div>
                          )}

                          {/* Example */}
                          <div className="mh-example">{exampleText}</div>
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
                        <div style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--fm)", color: "var(--navy)" }}>
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
                          onChange={(e) => toggleEvalOverride(REGION_ID, cond.id, e.target.checked)}
                        />
                        Manual Override
                      </label>
                      {overrideActive && (
                        <select
                          value={cond.manualOverride ?? 0}
                          onChange={(e) => setEvalOverride(REGION_ID, cond.id, parseInt(e.target.value))}
                        >
                          {[0, 10, 30, 50, 70, 100].map((v) => (
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

            {/* Combined rating */}
            <div className="mh-combined">
              <div className="mh-combined-label">Your Mental Health Rating</div>
              <div className="mh-combined-value">{highestRating}%</div>
              <div className="mh-combined-note">
                {conds.length > 1
                  ? `Highest of ${conds.length} evaluated conditions (VA single-rating rule)`
                  : "Based on your evaluation above"}
              </div>
            </div>
          </>
        ) : (
          <div className="mh-empty">
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>&#9881;</div>
            <strong>Select conditions above to begin evaluation</strong>
            <br />
            Check one or more conditions, then rate how each affects you across 5 functional domains.
            <br />
            The VA uses these domains to determine your mental health disability rating.
          </div>
        )}

        {/* Place Pin / Done buttons */}
        <div className="mh-done-wrap">
          {conds.length > 0 && (
            <>
              <button className="mh-done-btn" onClick={placePinFromPanel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z" />
                </svg>{" "}
                Place Pin on Map
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
    </div>
  )
}
