"use client"

import { useState } from "react"

export function SubscribeButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
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
          "Subscribe"
        )}
      </button>
      {error && <p className="auth-error" style={{ marginTop: 12 }}>{error}</p>}
    </>
  )
}
