'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { KeyRow } from './KeysTable'
import { updateKeyNotes } from './actions'

const NOTES_MAX = 1000

export function KeyDetailsModal({ row, onClose }: { row: KeyRow; onClose: () => void }) {
  const [notes, setNotes] = useState(row.notes ?? '')
  const [savedNotes, setSavedNotes] = useState(row.notes ?? '')
  const [error, setError] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus the textarea on open so editing notes is one keystroke away, but
  // only after the entry transition so the focus ring doesn't clash with it.
  // Place the caret at the end so admins can append without re-clicking.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus({ preventScroll: true })
      const end = el.value.length
      el.setSelectionRange(end, end)
      el.scrollTop = el.scrollHeight
    }, 60)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (dirty && !isPending) handleSave()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, savedNotes, isPending])

  // Lock body scroll while the modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const dirty = notes !== savedNotes

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const res = await updateKeyNotes(row.id, notes)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setSavedNotes(res.notes ?? '')
      setNotes(res.notes ?? '')
      setSavedFlash(true)
      window.setTimeout(() => setSavedFlash(false), 1400)
      router.refresh()
    })
  }

  const remaining = NOTES_MAX - notes.length

  return (
    <div
      className="admin-modal-backdrop"
      onMouseDown={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div ref={panelRef} className="admin-modal-panel">
        <header className="admin-modal-head">
          <div className="admin-modal-eyebrow">
            <span>Record Detail</span>
          </div>
          <h2 id="admin-modal-title" className="admin-modal-title">
            {row.key_prefix}
          </h2>
          <div className="admin-modal-pills">
            <span
              className="admin-pill admin-pill-group"
              style={{ ['--g' as never]: row.group_color } as React.CSSProperties}
            >
              {row.group_name}
            </span>
            <span className={`admin-pill admin-pill-status-${row.status}`}>
              {row.status}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="admin-modal-close"
            aria-label="Close details"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </header>

        <div className="admin-modal-body">
          <div className="admin-modal-notes">
            <div className="admin-modal-notes-head">
              <label htmlFor="admin-modal-notes" className="admin-label admin-modal-notes-label">
                Notes
                <span className="admin-label-opt">(visible only to admins)</span>
              </label>
              <span className={`admin-modal-notes-count${remaining < 0 ? ' is-over' : ''}`}>
                {notes.length}/{NOTES_MAX}
              </span>
            </div>
            <textarea
              ref={textareaRef}
              id="admin-modal-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="admin-textarea admin-modal-notes-input"
              rows={5}
              maxLength={NOTES_MAX}
              placeholder="No notes yet. Add context — recipient, purpose, contact — to help the next admin."
              spellCheck
            />
            {error && (
              <p className="admin-error admin-modal-error" role="alert">{error}</p>
            )}
          </div>
        </div>

        <footer className="admin-modal-foot">
          <span className={`admin-modal-saved${savedFlash ? ' is-on' : ''}`} aria-live="polite">
            {savedFlash ? 'Saved' : dirty ? 'Unsaved changes' : ' '}
          </span>
          <div className="admin-modal-foot-actions">
            <button type="button" onClick={onClose} className="admin-btn-ghost">
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || isPending}
              className="admin-submit admin-modal-save"
            >
              <span>{isPending ? 'Saving…' : 'Save notes'}</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
