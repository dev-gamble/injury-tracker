'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import type { KeyRow } from './KeysTable'
import { updateKeyNotes } from './actions'

const NOTES_MAX = 1000

export function KeyDetailsModal({ row, onClose }: { row: KeyRow; onClose: () => void }) {
  const [notes, setNotes] = useState(row.notes ?? '')
  const [savedNotes, setSavedNotes] = useState(row.notes ?? '')
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [error, setError] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (mode !== 'edit') return
    const t = window.setTimeout(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus({ preventScroll: true })
      const end = el.value.length
      el.setSelectionRange(end, end)
      el.scrollTop = el.scrollHeight
    }, 40)
    return () => window.clearTimeout(t)
  }, [mode])

  const dirty = notes !== savedNotes

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (mode === 'edit') {
          handleCancel()
        } else {
          onClose()
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (mode === 'edit' && dirty && !isPending) handleSave()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, notes, savedNotes, isPending])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleEdit() {
    setError(null)
    setMode('edit')
  }

  function handleCancel() {
    setNotes(savedNotes)
    setError(null)
    setMode('view')
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
      setMode('view')
      setSavedFlash(true)
      window.setTimeout(() => setSavedFlash(false), 1400)
      router.refresh()
    })
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="admin-root">
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
              <span className="admin-label admin-modal-notes-label">
                Notes
                <span className="admin-label-opt">(visible only to admins)</span>
              </span>
              {mode === 'view' ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="admin-modal-notes-edit"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                  <span>{savedNotes ? 'Edit' : 'Add'}</span>
                </button>
              ) : (
                <span
                  className={`admin-modal-notes-count${notes.length > NOTES_MAX ? ' is-over' : ''}`}
                >
                  {notes.length}/{NOTES_MAX}
                </span>
              )}
            </div>

            {mode === 'view' ? (
              savedNotes ? (
                <p className="admin-modal-notes-display">{savedNotes}</p>
              ) : (
                <p className="admin-modal-notes-empty">
                  No notes yet — add context like recipient, purpose, or contact to help the next admin.
                </p>
              )
            ) : (
              <textarea
                ref={textareaRef}
                id="admin-modal-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="admin-textarea admin-modal-notes-input"
                rows={5}
                maxLength={NOTES_MAX}
                placeholder="Add context — recipient, purpose, contact — to help the next admin."
                spellCheck
              />
            )}

            {error && (
              <p className="admin-error admin-modal-error" role="alert">{error}</p>
            )}
          </div>
        </div>

        <footer className="admin-modal-foot">
          <span className={`admin-modal-saved${savedFlash ? ' is-on' : ''}`} aria-live="polite">
            {savedFlash ? 'Saved' : mode === 'edit' && dirty ? 'Unsaved changes' : ' '}
          </span>
          <div className="admin-modal-foot-actions">
            {mode === 'edit' ? (
              <>
                <button type="button" onClick={handleCancel} className="admin-btn-ghost" disabled={isPending}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!dirty || isPending}
                  className="admin-submit admin-modal-save"
                >
                  <span>{isPending ? 'Saving…' : 'Save notes'}</span>
                </button>
              </>
            ) : (
              <button type="button" onClick={onClose} className="admin-btn-ghost">
                Close
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
    </div>,
    document.body,
  )
}
