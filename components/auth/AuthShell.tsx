"use client"

import Link from "next/link"

const css = `
  .auth-wrap {
    min-height: 100vh;
    background: #f0f2f5;
    display: flex;
    flex-direction: column;
    font-family: 'Open Sans', sans-serif;
  }

  .auth-header {
    background: linear-gradient(135deg,#0a2357 0%,#0d2d6b 60%,#1a3a7a 100%);
    border-bottom: 3px solid #c8102e;
    box-shadow: 0 4px 16px rgba(10,35,87,.35);
    padding: 0 24px;
    height: 80px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .auth-logo-group {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
  }

  .auth-header-divider {
    width: 2px;
    height: 28px;
    background: rgba(255,255,255,.25);
    flex-shrink: 0;
  }

  .auth-header-title {
    font-family: 'Oswald', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: .5px;
    text-transform: uppercase;
    color: #fff;
    line-height: 1;
    margin: 0;
  }

  .auth-header-sub {
    font-size: 11px;
    color: rgba(255,255,255,.65);
    font-family: 'Open Sans', sans-serif;
    letter-spacing: .3px;
    margin-top: 2px;
  }

  .auth-header-stars {
    color: #f0a500;
    letter-spacing: 2px;
    font-size: 11px;
    margin-top: 2px;
  }

  .auth-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
  }

  .auth-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 24px rgba(10,35,87,.1), 0 1px 4px rgba(10,35,87,.06);
    padding: 40px 36px;
    width: 100%;
    max-width: 400px;
    border-top: 4px solid #c8102e;
    animation: cardIn .25s ease both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-card-title {
    font-family: 'Oswald', sans-serif;
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #0a2357;
    margin: 0 0 24px 0;
  }

  .auth-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .auth-label {
    font-family: 'Oswald', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #5a6782;
  }

  .auth-input {
    width: 100%;
    border: 1.5px solid #d8dde8;
    border-radius: 5px;
    padding: 10px 12px;
    font-size: 14px;
    font-family: 'Open Sans', sans-serif;
    color: #0a1628;
    background: #fff;
    transition: border-color 180ms, box-shadow 180ms;
    outline: none;
    box-sizing: border-box;
  }

  .auth-input:focus {
    border-color: #0d2d6b;
    box-shadow: 0 0 0 3px rgba(13,45,107,.1);
  }

  .auth-input::placeholder {
    color: #b0bac9;
  }

  .auth-input:-webkit-autofill,
  .auth-input:-webkit-autofill:hover,
  .auth-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 30px #fff inset !important;
    -webkit-text-fill-color: #0a1628 !important;
    caret-color: #0a1628;
  }

  .auth-btn {
    width: 100%;
    background: #c8102e;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 11px 16px;
    font-family: 'Oswald', sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 180ms, box-shadow 180ms;
    margin-top: 4px;
  }

  .auth-btn:hover:not(:disabled) {
    background: #a50d25;
    box-shadow: 0 2px 10px rgba(200,16,46,.28);
  }

  .auth-btn:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  @keyframes auth-spin {
    to { transform: rotate(360deg); }
  }

  .auth-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: auth-spin .65s linear infinite;
    vertical-align: middle;
    margin-right: 7px;
    flex-shrink: 0;
  }

  .auth-error {
    font-size: 13px;
    color: #c8102e;
    background: rgba(200,16,46,.06);
    border: 1px solid rgba(200,16,46,.2);
    border-radius: 4px;
    padding: 8px 12px;
    line-height: 1.4;
  }

  .auth-success {
    font-size: 13px;
    color: #0d6b3a;
    background: rgba(13,107,58,.06);
    border: 1px solid rgba(13,107,58,.2);
    border-radius: 4px;
    padding: 10px 12px;
    line-height: 1.5;
  }

  .auth-divider {
    border: none;
    border-top: 1px solid #e8ecf2;
    margin: 20px 0 0 0;
    padding-top: 16px;
  }

  .auth-footer-links {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e8ecf2;
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .auth-link {
    color: #5a6782;
    text-decoration: none;
    font-size: 13px;
    transition: color 150ms;
  }

  .auth-link:hover {
    color: #0a2357;
    text-decoration: underline;
  }

  .auth-link-primary {
    color: #0d2d6b;
    font-weight: 600;
    text-decoration: none;
    font-size: 13px;
    transition: color 150ms;
  }

  .auth-link-primary:hover {
    color: #0a2357;
    text-decoration: underline;
  }

  .auth-footer {
    padding: 14px 24px;
    text-align: center;
    font-size: 11px;
    color: #9aa5b4;
    letter-spacing: .3px;
  }

  @media (max-width: 480px) {
    .auth-card {
      padding: 28px 20px;
      border-radius: 6px;
    }
  }
`

interface AuthShellProps {
  title: string
  children: React.ReactNode
}

export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <div className="auth-wrap">
      <style>{css}</style>

      <header className="auth-header">
        <div className="auth-logo-group">
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
              <rect width="42" height="42" rx="5" fill="#c8102e" />
              <text x="21" y="16" textAnchor="middle" fill="white" fontSize="9" fontFamily="Oswald,sans-serif" fontWeight="700" letterSpacing="1">★ ★ ★</text>
              <text x="21" y="27" textAnchor="middle" fill="white" fontSize="8" fontFamily="Oswald,sans-serif" fontWeight="700" letterSpacing=".5">VETERAN</text>
              <text x="21" y="36" textAnchor="middle" fill="white" fontSize="7" fontFamily="Oswald,sans-serif" letterSpacing=".5">CLAIM TOOL</text>
            </svg>
          </Link>
          <div className="auth-header-divider" />
          <div>
            <h1 className="auth-header-title">Injury Documentation</h1>
            <div className="auth-header-sub">Veteran VA Claim Support Tool</div>
            <div className="auth-header-stars">★ ★ ★ ★ ★</div>
          </div>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <h2 className="auth-card-title">{title}</h2>
          {children}
        </div>
      </main>

      <footer className="auth-footer">© K. Dimond | C. Gamble · Not an official VA tool</footer>
    </div>
  )
}
