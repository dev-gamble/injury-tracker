'use client'

import { useRef } from 'react'
import type { Injury, BodySide, BodyGender } from '../../../lib/va/types'
import { Pin } from './Pin'

interface PinsLayerProps {
  injuries: Injury[]
  curSide: BodySide
  curBody: BodyGender
  containerRef: React.RefObject<HTMLDivElement | null>
  onClickPin: (injury: Injury) => void
}

export function PinsLayer({ injuries, curSide, curBody, containerRef, onClickPin }: PinsLayerProps) {
  const visible = injuries.filter(
    inj => inj.pin && inj.pin.side === curSide && inj.pin.body === curBody
  )

  return (
    <div className="pins-layer">
      {visible.map(inj => (
        <Pin
          key={inj.id}
          injury={inj}
          containerRef={containerRef}
          onClickPin={onClickPin}
        />
      ))}
    </div>
  )
}
