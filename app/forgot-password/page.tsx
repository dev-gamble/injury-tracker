"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent) {
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
      <AuthShell title="Check Your Email">
        <p className="auth-success">
          We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the link to set a new password.
        </p>
        <div className="auth-footer-links">
          <Link href="/login" className="auth-link">Back to sign in</Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Reset Password">
      <p style={{ fontSize: "13px", color: "#5a6782", margin: "0 0 20px 0", lineHeight: 1.5 }}>
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
      <div className="auth-footer-links">
        <Link href="/login" className="auth-link">Back to sign in</Link>
      </div>
    </AuthShell>
  )
}
