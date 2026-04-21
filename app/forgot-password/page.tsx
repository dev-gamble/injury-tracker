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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
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
      <AuthShell
        eyebrow="Email Sent"
        title="Check your email"
        subtitle={`We sent a password reset link to ${email}.`}
        footer={<Link href="/login" className="auth-link">Back to sign in</Link>}
      >
        <div />
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Account Recovery"
      title="Reset password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <>
          <Link href="/login" className="auth-link">Back to sign in</Link>
          <br />
          <Link href="/" className="auth-link-subtle">Back to home</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="email" className="auth-label">Email</label>
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
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading} className="auth-submit">
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  )
}
