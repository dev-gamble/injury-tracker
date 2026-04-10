"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

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
      // Hash-based recovery links must be exchanged into session state.
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

  async function handleSubmit(e: React.SyntheticEvent) {
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
      <AuthShell title="Verifying Link">
        <p style={{ fontSize: "13px", color: "#5a6782", textAlign: "center" }}>Verifying your reset link…</p>
      </AuthShell>
    )
  }

  if (!ready) {
    return (
      <AuthShell title="Link Invalid">
        <p className="auth-error" style={{ marginBottom: "16px" }}>
          This reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password" className="auth-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          Request New Link
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Set New Password">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="password">New Password</label>
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
        <div className="auth-field">
          <label className="auth-label" htmlFor="confirm">Confirm Password</label>
          <input
            id="confirm"
            type="password"
            className="auth-input"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </AuthShell>
  )
}
