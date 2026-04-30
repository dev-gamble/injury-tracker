'use client'

import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Fire-and-forget visit tracker. Mounted once in the root layout. Records on
// every client-side navigation (the root layout persists across navigations,
// so we listen to pathname/search changes instead of relying on mount).
//
// Dedupes per session+path so reloading the same screen mid-session doesn't
// double-count.
//
// useSearchParams() forces opt-in CSR for any consumer not under Suspense, so
// the inner reader is wrapped in a boundary — the rest of the tree stays
// statically renderable.
export function VisitTracker() {
  return (
    <Suspense fallback={null}>
      <VisitTrackerInner />
    </Suspense>
  )
}

function VisitTrackerInner() {
  const pathname = usePathname()
  const search = useSearchParams()
  // Track the last referrer we sent — for in-app navigations the browser
  // never updates document.referrer, so we synthesise it from the prior path.
  const lastSentRef = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const queryString = search?.toString() ?? ''
    const path = pathname + (queryString ? `?${queryString}` : '')
    const dedupeKey = `vt:${path}`

    try {
      if (window.sessionStorage.getItem(dedupeKey)) {
        lastSentRef.current = path
        return
      }
      window.sessionStorage.setItem(dedupeKey, '1')
    } catch {
      // Private mode / quota — fall through and just send.
    }

    const referrer = lastSentRef.current ?? document.referrer ?? null
    lastSentRef.current = path
    const body = JSON.stringify({ path, referrer })

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
      cache: 'no-store',
    }).catch(() => {})
  }, [pathname, search])

  return null
}
