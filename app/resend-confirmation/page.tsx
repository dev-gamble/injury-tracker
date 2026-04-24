"use client"

import { Suspense, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string }

const REASON_TAG: Record<string, string> = {
  expired: "Link expired",
  invalid: "Link invalid",
  used: "Link used",
  default: "Link lapsed",
}

function ResendConfirmationInner() {
  const params = useSearchParams()
  const prefillEmail = params.get("email") ?? ""
  const reasonKey = params.get("reason") ?? "default"
  const reasonTag = REASON_TAG[reasonKey] ?? REASON_TAG.default

  const [email, setEmail] = useState(prefillEmail)
  const [status, setStatus] = useState<Status>({ kind: "idle" })

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail)
  }, [prefillEmail])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus({ kind: "sending" })
    const redirect = `${window.location.origin}/auth/confirm?next=${encodeURIComponent("/auth/post-confirm")}`
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: redirect },
    })
    if (error) {
      setStatus({ kind: "error", message: error.message })
      return
    }
    setStatus({ kind: "sent" })
  }

  if (status.kind === "sent") {
    return (
      <AuthShell
        eyebrow="Link Dispatched"
        title="Check your email"
        subtitle={`A fresh confirmation link has been transmitted to ${email}. It replaces any earlier link and expires in 1 hour.`}
        footer={
          <>
            Didn&apos;t receive it? Check spam or contact{" "}
            <a href="mailto:support@endexclaims.com" className="auth-link-subtle">
              support@endexclaims.com
            </a>
            <br />
            <br />
            <Link href="/login" className="auth-link">Back to sign in</Link>
          </>
        }
      >
        <ol className="auth-journey" aria-label="Resend journey">
          <li className="auth-journey-step is-done">
            <span className="auth-journey-mark" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="auth-journey-label">New link dispatched</span>
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
      eyebrow={reasonTag}
      title="Resend confirmation"
      subtitle="The link you followed is no longer valid. Enter your email below and we'll dispatch a new one."
      footer={
        <>
          Already confirmed? <Link href="/login" className="auth-link">Sign in</Link>
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
            autoComplete="email"
            className="auth-input"
          />
          <p className="auth-hint">
            Use the address you signed up with.
          </p>
        </div>

        {status.kind === "error" && <p className="auth-error">{status.message}</p>}

        <button
          type="submit"
          disabled={status.kind === "sending" || !email}
          className="auth-submit"
        >
          {status.kind === "sending" ? (
            <>
              <span className="auth-spinner" aria-hidden="true" />
              Transmitting...
            </>
          ) : (
            "Dispatch new link"
          )}
        </button>
      </form>
    </AuthShell>
  )
}

export default function ResendConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ResendConfirmationInner />
    </Suspense>
  )
}
