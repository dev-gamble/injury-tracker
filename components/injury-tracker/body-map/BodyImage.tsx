'use client'

import { forwardRef } from 'react'
import type { BodySide, BodyGender, Injury } from '../../../lib/va/types'
import { PinsLayer } from './PinsLayer'

interface BodyImageProps {
  curSide: BodySide
  curBody: BodyGender
  injuries: Injury[]
  onClickPin: (injury: Injury) => void
  onClickBody: (e: React.MouseEvent<HTMLDivElement>) => void
  placingPin: boolean
}

export const BodyImage = forwardRef<HTMLDivElement, BodyImageProps>(function BodyImage(
  { curSide, curBody, injuries, onClickPin, onClickBody, placingPin },
  ref
) {
  const isBack = curSide === 'back'
  const src = curBody === 'female'
    ? (isBack ? '/body-female-back.png' : '/body-female-front.png')
    : (isBack ? '/body-male-back.png' : '/body-male-front.png')

  // Cast to the mutable ref type PinsLayer expects
  const internalRef = ref as React.RefObject<HTMLDivElement | null>

  return (
    <div
      ref={ref}
      className={`body-wrap${isBack ? ' body-wrap-back' : ''}${placingPin ? ' pin-place-mode' : ''}`}
      onClick={onClickBody}
      title={placingPin ? 'Click to place pin' : 'Click a location to log an injury'}
    >
      <img src={src} alt={`${curBody} body ${curSide}`} draggable={false} />
      <PinsLayer
        injuries={injuries}
        curSide={curSide}
        curBody={curBody}
        containerRef={internalRef}
        onClickPin={onClickPin}
      />
    </div>
  )
})
