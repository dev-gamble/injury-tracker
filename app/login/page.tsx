"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push("/dashboard")
    }
    setLoading(false)
  }

  return (
    <AuthShell title="Sign In">
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <label className="auth-label" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="auth-link" style={{ fontSize: "12px" }}>Forgot password?</Link>
          </div>
          <input
            id="password"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <div className="auth-footer-links">
        <span style={{ fontSize: "13px", color: "#5a6782" }}>
          No account?{" "}
          <Link href="/signup" className="auth-link-primary">Create one</Link>
        </span>
      </div>
    </AuthShell>
  )
}
