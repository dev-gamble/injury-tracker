"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"
import { clearRecoveryMarker } from "./actions"

type Props = { fromServerRecovery: boolean }

export function ResetPasswordForm({ fromServerRecovery }: Props) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(fromServerRecovery)
  const [checkingLink, setCheckingLink] = useState(!fromServerRecovery)

  // Ready can only be set via (a) the server-marker cookie (new /auth/confirm
  // flow) or (b) a PASSWORD_RECOVERY event fired by detectSessionInUrl after
  // consuming hash tokens from a legacy implicit-flow email. A plain signed-in
  // session is NOT sufficient — otherwise a user with brief access to a
  // logged-in browser could change the password without re-auth.
  useEffect(() => {
    if (fromServerRecovery) return

    let mounted = true

    async function checkHashFlow() {
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
        if (error) setError(error.message)
        else setReady(true)
        setCheckingLink(false)
        return
      }

      if (!mounted) return
      setCheckingLink(false)
    }

    checkHashFlow()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fromServerRecovery])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    await clearRecoveryMarker()
    router.push("/")
  }

  if (checkingLink) {
    return (
      <AuthShell title="Verifying reset link" subtitle="One moment...">
        <div />
      </AuthShell>
    )
  }

  if (!ready) {
    return (
      <AuthShell
        eyebrow="Link Expired"
        title="Reset link invalid"
        subtitle="This link is invalid or expired. Request a new reset email and try again."
        footer={<Link href="/forgot-password" className="auth-link">Request new reset link</Link>}
      >
        <div />
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Account Recovery"
      title="Set new password"
      subtitle="Choose a strong password you haven't used before."
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="password" className="auth-label">New password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="auth-input"
          />
        </div>
        <div className="auth-field">
          <label htmlFor="confirm" className="auth-label">Confirm password</label>
          <input
            id="confirm"
            type="password"
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            className="auth-input"
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading} className="auth-submit">
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthShell>
  )
}
