"use client"

import { useRef, useCallback, useEffect } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import { getPanelKeys, BP_META } from '../data/bpMeta'
import type { BPRegion } from '../types'

const PLACEHOLDER_HTML =
  '<p style="color:var(--muted);">Write your personal statement here...</p>' +
  '<p style="color:var(--muted);font-size:12px;"><br>Example:<br><br>' +
  'During my service at [base], I injured my [body part] while [activity]. ' +
  'Since then, the pain has gotten worse and I now have difficulty [daily activities]. ' +
  'I was treated at [clinic] and continue to receive care for this condition.<br><br>' +
  'This condition has also caused [secondary condition], which affects my ability to [impact]...</p>'

interface CondRef {
  name: string
  type: string
  rating?: number
  extremity?: string
  date?: string
}

export function StatementTab() {
  const editorRef = useRef<HTMLDivElement>(null)
  const isPlaceholder = useRef(true)

  const injuries = useInjuryStore((s) => s.injuries)
  const mentalConditions = useInjuryStore((s) => s.mentalConditions)
  const headConditions = useInjuryStore((s) => s.headConditions)
  const bpConditions = useInjuryStore((s) => s.bpConditions)
  const specialClaims = useInjuryStore((s) => s.specialClaims)
  const personalStatement = useInjuryStore((s) => s.personalStatement)
  const setPersonalStatement = useInjuryStore((s) => s.setPersonalStatement)
  const activeTab = useInjuryStore((s) => s.ui.activeTab)

  // Seed editor content on first render
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (personalStatement) {
      editor.innerHTML = personalStatement
      isPlaceholder.current = false
    } else {
      editor.innerHTML = PLACEHOLDER_HTML
      isPlaceholder.current = true
    }
  }, []) // intentionally run once — after that, editor is controlled directly

  const clearPlaceholder = useCallback(() => {
    const editor = editorRef.current
    if (!editor || !isPlaceholder.current) return
    editor.innerHTML = ''
    isPlaceholder.current = false
    editor.focus()
  }, [])

  const handleInput = useCallback(() => {
    const editor = editorRef.current
    if (editor) setPersonalStatement(editor.innerHTML)
  }, [setPersonalStatement])

  const psCmd = useCallback((command: string) => {
    clearPlaceholder()
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand(command, false)
    editorRef.current?.focus()
  }, [clearPlaceholder])

  const psInsert = useCallback((text: string) => {
    clearPlaceholder()
    editorRef.current?.focus()
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand('insertText', false, text)
    handleInput()
  }, [clearPlaceholder, handleInput])

  // Gather conditions for reference sidebar
  const panelKeys = getPanelKeys()
  const allConds: CondRef[] = []

  injuries.filter((i) => !panelKeys.has(i.key)).forEach((i) => {
    allConds.push({ name: i.label, type: 'Primary', date: i.date })
  })
  mentalConditions.forEach((c) => {
    allConds.push({ name: c.condition, type: 'Mental Health', rating: c.effectiveRating })
  })
  headConditions.forEach((c) => {
    allConds.push({ name: c.condition, type: 'Head & Face', rating: c.effectiveRating })
  })
  Object.entries(bpConditions).forEach(([region, conds]) => {
    const meta = BP_META[region as BPRegion]
    if (!meta) return
    conds.forEach((c) => {
      allConds.push({ name: c.condition, type: meta.title, rating: c.effectiveRating, extremity: c.extremity })
    })
  })

  const secSet = new Set<string>()
  injuries.forEach((i) => (i.secondaries ?? []).forEach((s) => secSet.add(s)))
  mentalConditions.forEach((c) => (c.secondaries ?? []).forEach((s) => secSet.add(s)))
  headConditions.forEach((c) => (c.secondaries ?? []).forEach((s) => secSet.add(s)))
  Object.values(bpConditions).forEach((conds) =>
    conds.forEach((c) => (c.secondaries ?? []).forEach((s) => secSet.add(s)))
  )

  const specials = specialClaims.smcSelections.map((id) => id.replace('smc_', 'SMC-').toUpperCase())

  const isEmpty = allConds.length === 0 && secSet.size === 0 && specials.length === 0

  return (
    <div id="tab-statement" className={`content${activeTab !== 'statement' ? ' hidden' : ''}`}>
      <div className="tl-bar">
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--fh)', textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--navy)' }}>
          Personal Statement
        </div>
      </div>
      <div className="tab-instructions">
        Use this space to write your personal statement in your own words. Explain how your conditions
        started, how they&apos;ve gotten worse, and how they affect your daily life. The conditions
        you&apos;ve logged are listed on the right for reference.
      </div>

      <div id="ps-content">
        <div className="ps-layout">
          {/* Main writing area */}
          <div className="ps-main">
            <div className="ps-toolbar">
              <button onClick={() => psCmd('bold')} title="Bold"><b>B</b></button>
              <button onClick={() => psCmd('italic')} title="Italic"><i>I</i></button>
              <button onClick={() => psCmd('underline')} title="Underline"><u>U</u></button>
              <div className="ps-sep" />
              <button onClick={() => psCmd('insertUnorderedList')} title="Bullet List">• List</button>
              <button onClick={() => psCmd('insertOrderedList')} title="Numbered List">1. List</button>
              <div className="ps-sep" />
              <button onClick={() => psCmd('indent')} title="Indent">⇥ Indent</button>
              <button onClick={() => psCmd('outdent')} title="Outdent">⇤ Outdent</button>
              <div className="ps-sep" />
              <button onClick={() => psCmd('removeFormat')} title="Clear Formatting">Clear</button>
            </div>

            <div
              id="ps-editor"
              className="ps-editor"
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onFocus={clearPlaceholder}
              onInput={handleInput}
            />

            <div className="ps-hint">
              This statement is included in your export. Write in your own words — there is no wrong way to describe your experience.
            </div>
          </div>

          {/* Reference sidebar */}
          <div className="ps-sidebar">
            <div className="ps-sidebar-title">Your Conditions</div>
            <div className="ps-sidebar-desc">
              Reference list of everything you&apos;ve logged. Click a condition to insert its name into your statement.
            </div>

            {isEmpty ? (
              <div style={{ padding: 16, color: 'var(--muted)', fontSize: 12, textAlign: 'center' }}>
                No conditions logged yet.<br />Add conditions from the Body Map tab.
              </div>
            ) : (
              <>
                {allConds.length > 0 && (
                  <>
                    <div className="ps-ref-section">Primary &amp; Evaluated</div>
                    {allConds.map((c, i) => {
                      const ext = c.extremity && c.extremity !== 'none' ? ` [${c.extremity}]` : ''
                      const ratingTxt = c.rating !== undefined ? ` — ${c.rating}%` : ''
                      return (
                        <div key={i} className="ps-ref-item" onClick={() => psInsert(c.name + ext)} title="Click to insert">
                          <span className="ps-ref-name">{c.name}{ext}</span>
                          <span className="ps-ref-type">{c.type}{ratingTxt}</span>
                        </div>
                      )
                    })}
                  </>
                )}

                {secSet.size > 0 && (
                  <>
                    <div className="ps-ref-section">Secondary Conditions</div>
                    {[...secSet].map((s) => (
                      <div key={s} className="ps-ref-item" onClick={() => psInsert(s)} title="Click to insert">
                        <span className="ps-ref-name">{s}</span>
                        <span className="ps-ref-type">Secondary</span>
                      </div>
                    ))}
                  </>
                )}

                {specials.length > 0 && (
                  <>
                    <div className="ps-ref-section">Special Claims</div>
                    {specials.map((s) => (
                      <div key={s} className="ps-ref-item" onClick={() => psInsert(s)} title="Click to insert">
                        <span className="ps-ref-name">{s}</span>
                        <span className="ps-ref-type">Special</span>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
