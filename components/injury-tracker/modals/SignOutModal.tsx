"use client"

const css = `
  .so-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(4, 12, 32, 0.72);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: so-fade-in 180ms ease both;
  }

  @keyframes so-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .so-card {
    background: #fff;
    border-radius: 8px;
    box-shadow:
      0 4px 40px rgba(4, 12, 32, 0.32),
      0 1px 6px rgba(4, 12, 32, 0.12);
    width: 100%;
    max-width: 400px;
    overflow: hidden;
    animation: so-rise 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes so-rise {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .so-band {
    height: 4px;
    background: linear-gradient(90deg, #a50d25 0%, #c8102e 50%, #e8173a 100%);
  }

  .so-body {
    padding: 28px 32px 32px;
  }

  .so-icon-wrap {
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

  .so-title {
    font-family: 'Oswald', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #0a2357;
    margin: 0 0 8px 0;
    line-height: 1.1;
  }

  .so-subtitle {
    font-family: 'Open Sans', sans-serif;
    font-size: 13.5px;
    color: #4a5568;
    line-height: 1.55;
    margin: 0 0 20px 0;
  }

  .so-alert {
    background: rgba(200, 16, 46, 0.045);
    border: 1px solid rgba(200, 16, 46, 0.18);
    border-left: 3px solid #c8102e;
    border-radius: 5px;
    padding: 11px 14px;
    margin-bottom: 24px;
  }

  .so-alert-text {
    font-family: 'Open Sans', sans-serif;
    font-size: 12.5px;
    color: #7a1020;
    line-height: 1.5;
  }

  .so-alert-text strong {
    font-weight: 700;
    color: #c8102e;
    font-family: 'Oswald', sans-serif;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: 11px;
    display: block;
    margin-bottom: 2px;
  }

  .so-actions {
    display: flex;
    gap: 10px;
  }

  .so-btn-cancel {
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

  .so-btn-cancel:hover {
    border-color: #0a2357;
    color: #0a2357;
    background: rgba(10, 35, 87, 0.04);
  }

  .so-btn-signout {
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

  .so-btn-signout:hover:not(:disabled) {
    background: #a50d25;
    box-shadow: 0 3px 12px rgba(200, 16, 46, 0.35);
  }

  .so-btn-signout:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes so-spin {
    to { transform: rotate(360deg); }
  }

  .so-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: so-spin 0.6s linear infinite;
    flex-shrink: 0;
  }
`

interface SignOutModalProps {
  onConfirm: () => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function SignOutModal({ onConfirm, onCancel, loading }: SignOutModalProps) {
  return (
    <div className="so-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <style>{css}</style>
      <div className="so-card" role="dialog" aria-modal="true" aria-labelledby="so-title">
        <div className="so-band" />
        <div className="so-body">

          <div className="so-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h2 className="so-title" id="so-title">Confirm Sign Out</h2>
          <p className="so-subtitle">
            You are about to end your session and return to the login screen.
          </p>

          <div className="so-alert">
            <div className="so-alert-text">
              <strong>Session data will be erased</strong>
              All injury entries, conditions, and notes from this session will be permanently cleared from this device. Export your data before signing out if you need a record.
            </div>
          </div>

          <div className="so-actions">
            <button className="so-btn-cancel" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button className="so-btn-signout" onClick={onConfirm} disabled={loading}>
              {loading
                ? <><span className="so-spinner" /> Signing Out…</>
                : <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Sign Out
                  </>
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
