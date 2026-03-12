"use client"

import { AxiomWebVitals } from "next-axiom"

// Add global providers here as the app grows (e.g. auth context, theme, state management)
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AxiomWebVitals />
      {children}
    </>
  )
}
