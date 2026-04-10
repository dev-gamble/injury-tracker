"use client"

const css = `
  .cm-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(4, 12, 32, 0.72);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: cm-fade-in 180ms ease both;
  }

  @keyframes cm-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .cm-card {
    background: #fff;
    border-radius: 8px;
    box-shadow:
      0 4px 40px rgba(4, 12, 32, 0.32),
      0 1px 6px rgba(4, 12, 32, 0.12);
    width: 100%;
    max-width: 400px;
    overflow: hidden;
    animation: cm-rise 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes cm-rise {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .cm-band {
    height: 4px;
    background: linear-gradient(90deg, #a50d25 0%, #c8102e 50%, #e8173a 100%);
  }

  .cm-body {
    padding: 28px 32px 32px;
  }

  .cm-icon-wrap {
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

  .cm-title {
    font-family: 'Oswald', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #0a2357;
    margin: 0 0 8px 0;
    line-height: 1.1;
  }

  .cm-subtitle {
    font-family: 'Open Sans', sans-serif;
    font-size: 13.5px;
    color: #4a5568;
    line-height: 1.55;
    margin: 0 0 20px 0;
  }

  .cm-label {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    color: #0a2357;
    font-size: 14px;
  }

  .cm-alert {
    background: rgba(200, 16, 46, 0.045);
    border: 1px solid rgba(200, 16, 46, 0.18);
    border-left: 3px solid #c8102e;
    border-radius: 5px;
    padding: 11px 14px;
    margin-bottom: 24px;
  }

  .cm-alert-text {
    font-family: 'Open Sans', sans-serif;
    font-size: 12.5px;
    color: #7a1020;
    line-height: 1.5;
  }

  .cm-alert-text strong {
    font-weight: 700;
    color: #c8102e;
    font-family: 'Oswald', sans-serif;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: 11px;
    display: block;
    margin-bottom: 2px;
  }

  .cm-actions {
    display: flex;
    gap: 10px;
  }

  .cm-btn-cancel {
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

  .cm-btn-cancel:hover:not(:disabled) {
    border-color: #0a2357;
    color: #0a2357;
    background: rgba(10, 35, 87, 0.04);
  }

  .cm-btn-cancel:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .cm-btn-confirm {
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

  .cm-btn-confirm:hover:not(:disabled) {
    background: #a50d25;
    box-shadow: 0 3px 12px rgba(200, 16, 46, 0.35);
  }

  .cm-btn-confirm:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes cm-spin {
    to { transform: rotate(360deg); }
  }

  .cm-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cm-spin 0.6s linear infinite;
    flex-shrink: 0;
  }
`

interface ConfirmModalProps {
  icon: React.ReactNode
  title: string
  subtitle: React.ReactNode
  alertHeading: string
  alertBody: string
  confirmLabel: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmModal({
  icon,
  title,
  subtitle,
  alertHeading,
  alertBody,
  confirmLabel,
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="cm-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <style>{css}</style>
      <div className="cm-card" role="dialog" aria-modal="true" aria-labelledby="cm-title">
        <div className="cm-band" />
        <div className="cm-body">

          <div className="cm-icon-wrap">
            {icon}
          </div>

          <h2 className="cm-title" id="cm-title">{title}</h2>
          <p className="cm-subtitle">{subtitle}</p>

          <div className="cm-alert">
            <div className="cm-alert-text">
              <strong>{alertHeading}</strong>
              {alertBody}
            </div>
          </div>

          <div className="cm-actions">
            <button className="cm-btn-cancel" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </button>
            <button className="cm-btn-confirm" onClick={onConfirm} disabled={loading}>
              {loading
                ? <><span className="cm-spinner" />{confirmLabel}…</>
                : confirmLabel
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
