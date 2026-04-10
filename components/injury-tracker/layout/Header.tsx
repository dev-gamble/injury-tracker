"use client"

import { useState, useCallback } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { exportCSV, exportTXT, exportSummary } from '../utils/export'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Header({ onImport }: { onImport?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const state = useInjuryStore()
  const router = useRouter()

  const handleExport = useCallback((fn: (s: typeof state) => void) => {
    fn(state)
    setMenuOpen(false)
  }, [state])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header>
      <div className="logo">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <rect width="42" height="42" rx="5" fill="#c8102e" />
          <text x="21" y="16" textAnchor="middle" fill="white" fontSize="9" fontFamily="Oswald,sans-serif" fontWeight="700" letterSpacing="1">★ ★ ★</text>
          <text x="21" y="27" textAnchor="middle" fill="white" fontSize="8" fontFamily="Oswald,sans-serif" fontWeight="700" letterSpacing=".5">VETERAN</text>
          <text x="21" y="36" textAnchor="middle" fill="white" fontSize="7" fontFamily="Oswald,sans-serif" letterSpacing=".5">CLAIM TOOL</text>
        </svg>
        <div className="logo-div"></div>
        <div>
          <h1>Injury Documentation</h1>
          <div className="logo-sub">Veteran VA Claim Support Tool</div>
          <div className="logo-star">★ ★ ★ ★ ★</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          className="export-btn"
          style={{ background: "transparent", borderColor: "rgba(255,255,255,.18)", color: "rgba(255,255,255,.6)", boxShadow: "none" }}
          onClick={handleSignOut}
          title="Sign out"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sign Out
        </button>
        <button
          className="export-btn"
          style={{ background: "var(--navy)", borderColor: "var(--navy2)", boxShadow: "0 2px 8px rgba(10,35,87,.4)" }}
          onClick={() => onImport?.()}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 3v12m0-12l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
          </svg>
          Import
        </button>
        <div style={{ position: "relative" }}>
          <button className="export-btn" onClick={() => setMenuOpen(o => !o)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
            </svg>
            Export
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {menuOpen && (
            <div className="export-menu" style={{ display: 'block' }}>
              <button onClick={() => handleExport(exportSummary)}>PDF / Print Summary</button>
              <button onClick={() => handleExport(exportCSV)}>CSV Spreadsheet</button>
              <button onClick={() => handleExport(exportTXT)}>TXT Report</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
