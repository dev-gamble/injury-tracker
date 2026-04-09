'use client'

import { useState, useCallback } from 'react'
import { useTracker } from '../../../hooks/useTrackerStore'
import { BodyPanel } from '../body-map/BodyPanel'
import { Sidebar } from '../body-map/Sidebar'
import { PinPlacementPrompt } from '../body-map/PinPlacementPrompt'
import { InjuryFormModal } from '../modals/InjuryFormModal'
import { MentalHealthPanel } from '../evaluation-panels/MentalHealthPanel'
import { HeadFacePanel } from '../evaluation-panels/HeadFacePanel'
import { BPPanel } from '../evaluation-panels/BPPanel'
import type { Injury, PlacedPin } from '../../../lib/va/types'

export function MapTab() {
  const { state, dispatch } = useTracker()
  const { pendingPin, bpPanelOpen } = state

  const [showModal, setShowModal] = useState(false)
  const [editingInjury, setEditingInjury] = useState<Injury | null>(null)
  const [pendingPlacedPin, setPendingPlacedPin] = useState<PlacedPin | null>(null)

  const handleBodyClick = useCallback((x: number, y: number) => {
    if (!pendingPin) return
    const placed: PlacedPin = { x, y, side: state.curSide, body: state.curBody }
    setPendingPlacedPin(placed)
    dispatch({ type: 'SET_PENDING_PIN', pin: null })
    setEditingInjury(null)
    setShowModal(true)
  }, [pendingPin, state.curSide, state.curBody, dispatch])

  const handleClickPin = useCallback((injury: Injury) => {
    setEditingInjury(injury)
    setPendingPlacedPin(null)
    setShowModal(true)
  }, [])

  const handleOpenPanel = useCallback((regionId: string) => {
    if (bpPanelOpen === regionId) {
      dispatch({ type: 'SET_BP_PANEL_OPEN', regionId: null })
    } else {
      dispatch({ type: 'SET_BP_PANEL_OPEN', regionId })
    }
  }, [bpPanelOpen, dispatch])

  const handleClosePanel = useCallback(() => {
    dispatch({ type: 'SET_BP_PANEL_OPEN', regionId: null })
  }, [dispatch])

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    setEditingInjury(null)
    setPendingPlacedPin(null)
  }, [])

  return (
    <>
      {pendingPin && (
        <PinPlacementPrompt
          label="Click the body to place a pin"
          onCancel={() => dispatch({ type: 'SET_PENDING_PIN', pin: null })}
        />
      )}

      <div className="content">
        <div className="tab-instructions">
          <strong>How to use:</strong> Click any area on the body image to start placing a pin for an injury.
          Then fill in the details. Use the sidebar to open evaluation panels for specific body regions.
        </div>

        <div className="map-layout">
          <div>
            <BodyPanel
              onClickPin={handleClickPin}
              onBodyClick={handleBodyClick}
            />
          </div>

          <div>
            <Sidebar onOpenPanel={handleOpenPanel} />
          </div>
        </div>

        {bpPanelOpen && (
          <div className="eval-panel-row">
            {bpPanelOpen === 'mental' ? (
              <MentalHealthPanel onClose={handleClosePanel} />
            ) : bpPanelOpen === 'headFace' ? (
              <HeadFacePanel onClose={handleClosePanel} />
            ) : (
              <BPPanel regionId={bpPanelOpen} onClose={handleClosePanel} />
            )}
          </div>
        )}
      </div>

      {showModal && (
        <InjuryFormModal
          injury={editingInjury}
          initialPin={pendingPlacedPin}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
