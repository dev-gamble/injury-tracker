"use client"

import { useTracker } from "@/lib/endex/tracker-context"
import { EvalPanelMental } from "./eval-panel-mental"
import { EvalPanelHead } from "./eval-panel-head"
import { EvalPanelBP } from "./eval-panel-bp"

export function EvaluationPanels() {
  const { evalPanel } = useTracker()
  if (!evalPanel.type) return null

  switch (evalPanel.type) {
    case "mental":
      return <EvalPanelMental />
    case "head":
      return <EvalPanelHead />
    case "bp":
      return <EvalPanelBP regionId={evalPanel.regionId!} />
    default:
      return null
  }
}
