"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthBrand } from "@/components/auth/AuthBrand"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
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
      <main className="auth-page">
        <div className="auth-card">
          <AuthBrand />
          <div className="auth-body">
            <span className="auth-success-icon">✉️</span>
            <h1 className="auth-title">Check Your Email</h1>
            <p className="auth-info">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
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
          <h1 className="auth-title">Create Account</h1>
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
            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <div className="auth-divider" />
          <div className="auth-footer">
            <p>Already have an account?{" "}<Link href="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </main>
  )
}
