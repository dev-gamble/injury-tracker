const PANEL_IDS = [
  "mental-health-panel",
  "head-panel",
  "knee-panel",
  "back-panel",
  "shoulder-panel",
  "neck-panel",
  "hip-panel",
  "elbow-panel",
  "wrist-panel",
  "ankle-panel",
  "chest-panel",
  "abdomen-panel",
  "leg-panel",
  "systemic-panel",
]

export function EvaluationPanels() {
  return (
    <>
      {PANEL_IDS.map((id) => (
        <div key={id} id={id} className="mental-panel hidden"></div>
      ))}
    </>
  )
}
