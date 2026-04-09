'use client'

import { TrackerProvider } from '../../hooks/useTrackerStore'
import { TrackerLayout } from './TrackerLayout'

export function TrackerPage() {
  return (
    <TrackerProvider>
      <TrackerLayout />
    </TrackerProvider>
  )
}
