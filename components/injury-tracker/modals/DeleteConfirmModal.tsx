"use client"

import { Trash2 } from 'lucide-react'

const css = `
  .dm-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(4, 12, 32, 0.72);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: dm-fade-in 180ms ease both;
  }

  @keyframes dm-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .dm-card {
    background: #fff;
    border-radius: 8px;
    box-shadow:
      0 4px 40px rgba(4, 12, 32, 0.32),
      0 1px 6px rgba(4, 12, 32, 0.12);
    width: 100%;
    max-width: 400px;
    overflow: hidden;
    animation: dm-rise 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes dm-rise {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .dm-band {
    height: 4px;
    background: linear-gradient(90deg, #a50d25 0%, #c8102e 50%, #e8173a 100%);
  }

  .dm-body {
    padding: 28px 32px 32px;
  }

  .dm-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(200, 16, 46, 0.07);
    border: 1.5px solid rgba(200, 16, 46, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    flex-shrink: 0;
  }

  .dm-title {
    font-family: 'Oswald', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #0a2357;
    margin: 0 0 8px 0;
    line-height: 1.1;
  }

  .dm-subtitle {
    font-family: 'Open Sans', sans-serif;
    font-size: 13.5px;
    color: #4a5568;
    line-height: 1.55;
    margin: 0 0 20px 0;
  }

  .dm-label {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    color: #0a2357;
    font-size: 14px;
  }

  .dm-alert {
    background: rgba(200, 16, 46, 0.045);
    border: 1px solid rgba(200, 16, 46, 0.18);
    border-left: 3px solid #c8102e;
    border-radius: 5px;
    padding: 11px 14px;
    margin-bottom: 24px;
  }

  .dm-alert-text {
    font-family: 'Open Sans', sans-serif;
    font-size: 12.5px;
    color: #7a1020;
    line-height: 1.5;
  }

  .dm-alert-text strong {
    font-weight: 700;
    color: #c8102e;
    font-family: 'Oswald', sans-serif;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: 11px;
    display: block;
    margin-bottom: 2px;
  }

  .dm-actions {
    display: flex;
    gap: 10px;
  }

  .dm-btn-cancel {
    flex: 1;
    border: 1.5px solid #d0d8e8;
    background: transparent;
    border-radius: 5px;
    padding: 10px 16px;
    font-family: 'Oswald', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #4a5978;
    cursor: pointer;
    transition: border-color 160ms, color 160ms, background 160ms;
  }

  .dm-btn-cancel:hover {
    border-color: #0a2357;
    color: #0a2357;
    background: rgba(10, 35, 87, 0.04);
  }

  .dm-btn-confirm {
    flex: 1.4;
    border: none;
    background: #c8102e;
    border-radius: 5px;
    padding: 10px 16px;
    font-family: 'Oswald', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: background 160ms, box-shadow 160ms;
  }

  .dm-btn-confirm:hover {
    background: #a50d25;
    box-shadow: 0 3px 12px rgba(200, 16, 46, 0.35);
  }
`

interface DeleteConfirmModalProps {
  label: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({ label, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="dm-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <style>{css}</style>
      <div className="dm-card" role="dialog" aria-modal="true" aria-labelledby="dm-title">
        <div className="dm-band" />
        <div className="dm-body">

          <div className="dm-icon-wrap">
            <Trash2 size={22} stroke="#c8102e" strokeWidth={2} />
          </div>

          <h2 className="dm-title" id="dm-title">Delete Condition</h2>
          <p className="dm-subtitle">
            You are about to permanently remove <span className="dm-label">{label}</span> and all associated secondary conditions.
          </p>

          <div className="dm-alert">
            <div className="dm-alert-text">
              <strong>This action cannot be undone</strong>
              All ratings, secondaries, and evaluation data for this condition will be erased from your session.
            </div>
          </div>

          <div className="dm-actions">
            <button className="dm-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="dm-btn-confirm" onClick={onConfirm}>
              Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
