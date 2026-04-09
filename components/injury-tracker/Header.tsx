'use client'

import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  onExportPDF: () => void
  onExportCSV: () => void
  onExportTXT: () => void
  onReset: () => void
}

export function Header({ onExportPDF, onExportCSV, onExportTXT, onReset }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <header className="tracker-header">
      <div className="logo">
        <div>
          <h1>VA Claim Tracker</h1>
          <div className="logo-sub">Service-Connected Disability Documentation</div>
          <div className="logo-star">★ ★ ★</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', position: 'relative' }} ref={menuRef}>
        <button className="export-btn" onClick={() => setMenuOpen(o => !o)}>
          Export ▾
        </button>
        {menuOpen && (
          <div className="export-menu">
            <button onClick={() => { onExportPDF(); setMenuOpen(false) }}>📄 Export PDF</button>
            <button onClick={() => { onExportCSV(); setMenuOpen(false) }}>📊 Export CSV</button>
            <button onClick={() => { onExportTXT(); setMenuOpen(false) }}>📝 Export TXT</button>
            <button
              onClick={() => {
                if (confirm('Reset all data? This cannot be undone.')) {
                  onReset()
                  setMenuOpen(false)
                }
              }}
              style={{ color: 'var(--red)' }}
            >
              🗑 Reset All Data
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
