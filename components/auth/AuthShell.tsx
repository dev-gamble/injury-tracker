import Link from "next/link"
import type { ReactNode } from "react"
import "./auth.css"

type AuthShellProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="auth-root">
      <header className="auth-header">
        <Link href="/" className="auth-logo" aria-label="ENDEX home">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <circle cx="18" cy="18" r="12" fill="rgba(255,255,255,0.1)" stroke="#fff" strokeWidth="1.5" />
            <path d="M8 8L28 28M28 8L8 28" stroke="#c8102e" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
          <div>
            <div className="auth-logo-wordmark">
              <span className="endex-e">ENDE</span>
              <span className="endex-x">X</span>
            </div>
            <div className="auth-logo-sub">Disability Claim Index</div>
          </div>
        </Link>
      </header>

      <main className="auth-main">
        <section className="auth-card" role="region" aria-labelledby="auth-title">
          {eyebrow && <div className="auth-eyebrow">{eyebrow}</div>}
          <h1 id="auth-title" className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
          {footer && <div className="auth-meta">{footer}</div>}
        </section>
      </main>

      <div className="auth-footer">
        ENDEX is a tracking, education, and organizational tool. Not an official VA product.
        <div className="auth-footer-copy">&copy; 2026 CG Web Lab, LLC. All rights reserved.</div>
      </div>
    </div>
  )
}
