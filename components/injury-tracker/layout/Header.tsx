"use client"

import { useState, useCallback } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { exportCSV, exportTXT, exportSummary } from '../utils/export'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { SignOutModal } from '../modals/SignOutModal'
import { ClearDataModal } from '../modals/ClearDataModal'
import { LogOut, RotateCcw, Upload, Download, ChevronDown } from 'lucide-react'

export function Header({ onImport }: { onImport?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [signOutLoading, setSignOutLoading] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const state = useInjuryStore()
  const router = useRouter()

  const handleExport = useCallback((fn: (s: typeof state) => void) => {
    fn(state)
    setMenuOpen(false)
  }, [state])

  function handleClearData() {
    state.reset()
    setClearOpen(false)
  }

  async function handleSignOut() {
    setSignOutLoading(true)
    state.reset()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
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
          style={{ background: "rgba(255,255,255,.07)", borderColor: "rgba(255,255,255,.32)", color: "rgba(255,255,255,.85)", boxShadow: "none" }}
          onClick={() => setSignOutOpen(true)}
          title="Sign out"
        >
          <LogOut size={13} strokeWidth={2.5} />
          <span className="btn-label">Sign Out</span>
        </button>
        <button
          className="export-btn"
          style={{ background: "rgba(255,255,255,.07)", borderColor: "rgba(255,255,255,.32)", color: "rgba(255,255,255,.85)", boxShadow: "none" }}
          onClick={() => setClearOpen(true)}
          title="Clear session data"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
          <span className="btn-label">Refresh</span>
        </button>
        <button
          className="export-btn"
          style={{ background: "var(--navy)", borderColor: "var(--navy2)", boxShadow: "0 2px 8px rgba(10,35,87,.4)" }}
          onClick={() => onImport?.()}
        >
          <Upload size={13} strokeWidth={2.5} />
          <span className="btn-label">Import</span>
        </button>
        <div style={{ position: "relative" }}>
          <button className="export-btn" onClick={() => setMenuOpen(o => !o)}>
            <Download size={13} strokeWidth={2.5} />
            <span className="btn-label">Export</span>
            <ChevronDown size={11} strokeWidth={3} style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
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

    {signOutOpen && (
      <SignOutModal
        onConfirm={handleSignOut}
        onCancel={() => setSignOutOpen(false)}
        loading={signOutLoading}
      />
    )}
    {clearOpen && (
      <ClearDataModal
        onConfirm={handleClearData}
        onCancel={() => setClearOpen(false)}
      />
    )}
    </>
  )
}

