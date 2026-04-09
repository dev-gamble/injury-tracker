"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { AuthBrand } from "@/components/auth/AuthBrand"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setChecking(false)
    })
  }, [])

  async function handleSubmit(e: { preventDefault(): void }) {
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

  if (checking) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <AuthBrand />
          <div className="auth-body" style={{ textAlign: "center", padding: "40px 28px" }}>
            <p style={{ fontFamily: "var(--fd)", fontSize: 12, color: "var(--muted)" }}>Verifying session...</p>
          </div>
        </div>
      </main>
    )
  }

  if (user) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <AuthBrand />
          <div className="auth-body">
            <h1 className="auth-title">Welcome Back</h1>
            <div className="auth-user-email">{user.email}</div>
            <Link href="/dashboard" className="auth-btn-dashboard">
              Go to Dashboard →
            </Link>
            <div className="auth-divider" />
            <div style={{ textAlign: "center" }}>
              <form action="/signout" method="post" style={{ display: "inline" }}>
                <button type="submit" className="auth-signout-link">
                  Sign out
                </button>
              </form>
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
          <h1 className="auth-title">Sign In</h1>
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
            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-forgot">
              <Link href="/forgot-password">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="auth-divider" />
          <div className="auth-footer">
            <p>No account?{" "}<Link href="/signup">Create one</Link></p>
          </div>
        </div>
      </div>
    </main>
  )
}
