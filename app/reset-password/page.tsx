"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthBrand } from "@/components/auth/AuthBrand"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [checkingLink, setCheckingLink] = useState(true)

  useEffect(() => {
    let mounted = true

    async function checkRecoverySession() {
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash
      const hashParams = new URLSearchParams(hash)
      const type = hashParams.get("type")
      const accessToken = hashParams.get("access_token")
      const refreshToken = hashParams.get("refresh_token")

      if (type === "recovery" && accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (!mounted) return
        if (error) {
          setError(error.message)
        } else {
          setReady(true)
        }
        setCheckingLink(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setReady(Boolean(data.session))
      setCheckingLink(false)
    }

    checkRecoverySession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      router.push("/dashboard")
    }
    setLoading(false)
  }

  if (checkingLink) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <AuthBrand />
          <div className="auth-body" style={{ textAlign: "center", padding: "40px 28px" }}>
            <p style={{ fontFamily: "var(--fd)", fontSize: 12, color: "var(--muted)" }}>Verifying reset link...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!ready) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <AuthBrand />
          <div className="auth-body">
            <h1 className="auth-title">Link Invalid</h1>
            <p className="auth-info">
              This link is invalid or expired. Request a new reset email and try again.
            </p>
            <Link href="/forgot-password" className="auth-btn-dashboard">
              Request New Link
            </Link>
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
          <h1 className="auth-title">Set New Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="auth-input"
              />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                className="auth-input"
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
