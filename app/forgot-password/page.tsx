"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { AuthBrand } from "@/components/auth/AuthBrand"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <AuthBrand />
          <div className="auth-body">
            <span className="auth-success-icon">✉️</span>
            <h1 className="auth-title">Check Your Email</h1>
            <p className="auth-info">
              We sent a password reset link to <strong>{email}</strong>.
            </p>
            <div className="auth-divider" />
            <div className="auth-footer">
              <p><Link href="/login">Back to sign in</Link></p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <AuthBrand />
        <div className="auth-body">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-info">Enter your email and we&apos;ll send you a reset link.</p>
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <div className="auth-divider" />
          <div className="auth-footer">
            <p><Link href="/login">Back to sign in</Link></p>
          </div>
        </div>
      </div>
    </main>
  )
}
