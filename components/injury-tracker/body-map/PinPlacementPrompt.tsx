'use client'

interface PinPlacementPromptProps {
  label: string
  onCancel: () => void
}

export function PinPlacementPrompt({ label, onCancel }: PinPlacementPromptProps) {
  return (
    <>
      <div className="pin-placing-overlay" />
      <div className="pin-place-prompt">
        <span>
          📍 Click the body image to place a pin for: <strong>{label}</strong>
        </span>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </>
  )
}
