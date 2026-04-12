"use client"

import { useTracker } from "@/lib/endex/tracker-context"
import { getBilateralBodyName } from "@/lib/endex/data"

export function BilateralDialog() {
  const { bilateralPrompt, resolveBilateralPrompt } = useTracker()

  if (!bilateralPrompt) return null

  const { regionId, condName, leftKey, rightKey } = bilateralPrompt
  const bodyName = getBilateralBodyName(regionId)

  return (
    <div className="bilateral-overlay">
      <div className="bilateral-dialog">
        <div className="bilateral-dialog-icon">&#9878;</div>
        <div className="bilateral-dialog-title">Which side is affected?</div>
        <div className="bilateral-dialog-cond">{condName}</div>
        <div className="bilateral-dialog-desc">
          Select which {bodyName} this condition affects. Choosing &quot;Both&quot; applies the bilateral factor (10% bonus) to your combined VA rating.
        </div>
        <div className="bilateral-dialog-btns" style={{ flexDirection: "column", gap: "8px" }}>
          <button
            className="bilateral-btn bilateral-btn-no"
            style={{ flex: 1 }}
            onClick={() => resolveBilateralPrompt(leftKey, false)}
          >
            Left
          </button>
          <button
            className="bilateral-btn bilateral-btn-no"
            style={{ flex: 1 }}
            onClick={() => resolveBilateralPrompt(rightKey, false)}
          >
            Right
          </button>
          <button
            className="bilateral-btn bilateral-btn-yes"
            style={{ flex: 1 }}
            onClick={() => resolveBilateralPrompt("both", true)}
          >
            Both (Bilateral)
          </button>
        </div>
      </div>
    </div>
  )
}
