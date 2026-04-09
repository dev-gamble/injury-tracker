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
        <div style={{width:42,height:42,background:'var(--red)',borderRadius:6,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0,padding:'4px 3px',boxShadow:'0 2px 6px rgba(0,0,0,.25)'}}>
          <div style={{color:'#fff',fontSize:7,letterSpacing:'1.5px',lineHeight:1}}>★ ★ ★</div>
          <div style={{color:'#fff',fontFamily:'var(--fh)',fontSize:7,fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',textAlign:'center',lineHeight:1.35,marginTop:3}}>VETERAN<br/>CLAIM TOOL</div>
        </div>
        <div style={{width:1,height:32,background:'rgba(255,255,255,.28)',margin:'0 14px',flexShrink:0}} />
        <div>
          <h1>Injury Documentation</h1>
          <div className="logo-sub">Veteran VA Claim Support Tool</div>
          <div className="logo-star">★ ★ ★ ★ ★</div>
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
