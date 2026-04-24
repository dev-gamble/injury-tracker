"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

type Channel = "key" | "subscription"

export default function SignupPage() {
  const router = useRouter()
  const [channel, setChannel] = useState<Channel>("key")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (channel !== "key") return
    setLoading(true)
    setError(null)
    const redirect = `${window.location.origin}/auth/confirm?next=${encodeURIComponent("/auth/post-confirm")}`
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirect,
        data: { access_channel: "key" },
      },
    })
    if (error) {
      setError(error.message)
    } else if (data.session) {
      router.push("/auth/post-confirm")
    } else if (data.user && data.user.identities?.length === 0) {
      // Supabase silently "succeeds" for already-confirmed emails to
      // prevent enumeration; surface a clear error instead of the
      // misleading "check your email" screen.
      setError("An account with this email already exists. Sign in instead.")
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <AuthShell
        eyebrow="Verification Pending"
        title="Check your email"
        subtitle={`We dispatched a confirmation link to ${email}. Complete each step to activate ENDEX.`}
        footer={<Link href="/login" className="auth-link">Back to sign in</Link>}
      >
        <ol className="auth-journey" aria-label="Signup journey">
          <li className="auth-journey-step is-done">
            <span className="auth-journey-mark" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="auth-journey-label">Account created</span>
          </li>
          <li className="auth-journey-step is-current" aria-current="step">
            <span className="auth-journey-mark" aria-hidden="true">02</span>
            <span className="auth-journey-label">Confirm email</span>
          </li>
          <li className="auth-journey-step">
            <span className="auth-journey-mark" aria-hidden="true">03</span>
            <span className="auth-journey-label">Set up access</span>
          </li>
        </ol>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Enrollment"
      title="Create account"
      subtitle="Choose an ENDEX channel."
      footer={
        <>
          Already registered? <Link href="/login" className="auth-link">Sign in</Link>
          <br />
          <Link href="/" className="auth-link-subtle">Back to home</Link>
        </>
      }
    >
      <div className="auth-fork" role="radiogroup" aria-label="Access channel">
        <button
          type="button"
          role="radio"
          aria-checked={channel === "key"}
          onClick={() => { setChannel("key"); setError(null) }}
          className={`auth-channel${channel === "key" ? " is-active" : ""}`}
        >
          <span className="auth-channel-head">
            <span className="auth-channel-tag">Channel 01</span>
            <span className="auth-channel-dot" aria-hidden="true" />
          </span>
          <span className="auth-channel-label">Access Key</span>
          <span className="auth-channel-sub">Issued</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={channel === "subscription"}
          onClick={() => { setChannel("subscription"); setError(null) }}
          className={`auth-channel${channel === "subscription" ? " is-active" : ""}`}
        >
          <span className="auth-channel-head">
            <span className="auth-channel-tag">Channel 02</span>
            <span className="auth-channel-chip">Soon</span>
          </span>
          <span className="auth-channel-label">Subscription</span>
          <span className="auth-channel-sub">Commercial</span>
        </button>
      </div>

      <div className="auth-fork-body" key={channel}>
        {channel === "key" ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <p className="auth-fork-brief">
              Enter your credentials below. After email verification you&apos;ll be prompted for your access key.
            </p>
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
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="auth-input"
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? (
                <>
                  <span className="auth-spinner" aria-hidden="true" />
                  Creating account...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        ) : (
          <div className="auth-stripe" role="status">
            <div className="auth-stripe-rule" aria-hidden="true">
              <span>{'//'}</span> Pending release
            </div>
            <h3 className="auth-stripe-title">Subscriptions not yet open</h3>
            <button
              type="button"
              onClick={() => setChannel("key")}
              className="auth-fork-switch"
            >
              Use an access key instead →
            </button>
          </div>
        )}
      </div>
    </AuthShell>
  )
}
