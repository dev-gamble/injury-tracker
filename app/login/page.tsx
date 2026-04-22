"use client"

import { Suspense, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

type ResendState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string }

function isUnconfirmedEmailError(err: { code?: string; message?: string } | null) {
  if (!err) return false
  if (err.code === "email_not_confirmed") return true
  return !!err.message?.toLowerCase().includes("email not confirmed")
}

function looksLikeExpiredLink(text: string | null) {
  if (!text) return false
  const t = text.toLowerCase()
  return t.includes("expired") || t.includes("invalid") || t.includes("otp") || t.includes("access_denied")
}

function LoginInner() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [resend, setResend] = useState<ResendState>({ kind: "idle" })

  // Safety net: if a user ever lands here with an expired-link error, forward
  // them to /resend-confirmation. Supabase parks the real signal in the URL
  // hash fragment (#error=access_denied&error_code=otp_expired...) which the
  // server never sees, so check both the query string and the hash.
  useEffect(() => {
    const urlError = params.get("error")
    const hash = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : ""
    const hashParams = new URLSearchParams(hash)
    const hashError = hashParams.get("error") || hashParams.get("error_code") || hashParams.get("error_description")
    if (looksLikeExpiredLink(urlError) || looksLikeExpiredLink(hashError)) {
      router.replace("/resend-confirmation?reason=expired")
    }
  }, [params, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setUnconfirmed(false)
    setResend({ kind: "idle" })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (isUnconfirmedEmailError(error)) {
        setUnconfirmed(true)
        setError("This email hasn't been confirmed yet. Check your inbox, or resend the confirmation link below.")
      } else {
        setError(error.message)
      }
    } else {
      router.push("/")
    }
    setLoading(false)
  }

  async function handleResend() {
    if (!email) {
      setResend({ kind: "error", message: "Enter your email above first." })
      return
    }
    setResend({ kind: "sending" })
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=/redeem-key` },
    })
    if (error) {
      setResend({ kind: "error", message: error.message })
      return
    }
    setResend({ kind: "sent" })
  }

  return (
    <AuthShell
      eyebrow="Secure Access"
      title="Sign in"
      subtitle="Enter your credentials to access your claim index."
      footer={
        <>
          Need an account? <Link href="/signup" className="auth-link">Sign up</Link>
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
        <div className="auth-field">
          <label htmlFor="password" className="auth-label">Password</label>
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
        {error && <p className="auth-error">{error}</p>}
        {unconfirmed && (
          <div className="auth-resend" role="group" aria-label="Resend confirmation email">
            <div className="auth-resend-head">
              <span className="auth-resend-tag">Unverified</span>
              <span className="auth-resend-title">Confirmation link lapsed?</span>
            </div>
            <p className="auth-resend-copy">
              We&rsquo;ll send a fresh confirmation email to <span className="auth-resend-mono">{email || "your address"}</span>. Links expire after 1 hour for security.
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resend.kind === "sending" || resend.kind === "sent"}
              className={`auth-resend-btn${resend.kind === "sent" ? " is-sent" : ""}`}
            >
              {resend.kind === "sending" && (
                <>
                  <span className="auth-spinner auth-spinner-dark" aria-hidden="true" />
                  Sending...
                </>
              )}
              {resend.kind === "sent" && (
                <>
                  <span className="auth-resend-check" aria-hidden="true">✓</span>
                  Sent — check your inbox
                </>
              )}
              {(resend.kind === "idle" || resend.kind === "error") && "Resend confirmation email"}
            </button>
            {resend.kind === "error" && (
              <p className="auth-resend-error">{resend.message}</p>
            )}
          </div>
        )}
        <div className="auth-inline-right">
          <Link href="/forgot-password" className="auth-link-subtle">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="auth-submit">
          {loading ? (
            <>
              <span className="auth-spinner" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </AuthShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  )
}
