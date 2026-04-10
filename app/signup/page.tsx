"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else if (data.session) {
      router.push("/dashboard")
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <AuthShell title="Check Your Email">
        <p className="auth-success">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <div className="auth-footer-links">
          <Link href="/login" className="auth-link">Back to sign in</Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Create Account">
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
        <div className="auth-field">
          <label className="auth-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="auth-input"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
      <div className="auth-footer-links">
        <span style={{ fontSize: "13px", color: "#5a6782" }}>
          Already have an account?{" "}
          <Link href="/login" className="auth-link-primary">Sign in</Link>
        </span>
      </div>
    </AuthShell>
  )
}
