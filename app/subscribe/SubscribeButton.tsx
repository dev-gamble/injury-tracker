"use client"

import { useState } from "react"

type Plan = "monthly" | "yearly"

type SubscribeButtonProps = {
  plan: Plan
  label: string
}

export function SubscribeButton({ plan, label }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || !body?.url) {
        setError(body?.error ?? "Could not start checkout")
        setLoading(false)
        return
      }
      window.location.href = body.url
    } catch {
      setError("Network error — try again")
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="auth-submit"
      >
        {loading ? (
          <>
            <span className="auth-spinner" aria-hidden="true" />
            Opening checkout...
          </>
        ) : (
          label
        )}
      </button>
      {error && <p className="auth-error" style={{ marginTop: 12 }}>{error}</p>}
    </>
  )
}
