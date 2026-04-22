"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

const ERROR_MESSAGES: Record<string, string> = {
  invalid_key: "This key does not match any issued credential.",
  revoked: "This key has been revoked. Contact your administrator.",
  expired: "This key has passed its expiry date.",
  exhausted: "This key has reached its maximum redemptions.",
  already_redeemed: "You have already redeemed this key on this account.",
  not_authenticated: "Your session ended. Sign in and try again.",
}

function normalizeKey(raw: string) {
  const stripped = raw.toUpperCase().replace(/\s+/g, "")
  return stripped.slice(0, 20)
}

export default function RedeemKeyPage() {
  const router = useRouter()
  const [key, setKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isComplete = key.replace(/-/g, "").length >= 17

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: rpcError } = await supabase.rpc("redeem_license_key", { raw_key: key })
    if (rpcError) {
      console.error("[redeem_license_key] error", rpcError)
      const code = rpcError.message?.trim() ?? ""
      const mapped = ERROR_MESSAGES[code]
      setError(mapped ?? `Redemption failed: ${rpcError.message || "unknown error"}`)
      setLoading(false)
      return
    }
    router.push("/")
    router.refresh()
  }

  return (
    <AuthShell
      eyebrow="Access Redemption"
      title="Enter your key"
      subtitle="Paste or type the access key issued to you."
      footer={
        <>
          Lost your key? <br />
          Contact{' '}
          <a href="mailto:support@endexclaims.com" className="auth-link-subtle">
            support@endexclaims.com
          </a>
          <br />
          <br />
          <Link href="/login" className="auth-link">Back to sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field auth-key-field">
          <label htmlFor="license-key" className="auth-label">License key</label>
          <input
            id="license-key"
            type="text"
            value={key}
            onChange={(e) => setKey(normalizeKey(e.target.value))}
            placeholder="ENDEX-XXXX-XXXX-XXXX"
            maxLength={20}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            required
            className="auth-input auth-key-input"
          />
          <p className="auth-hint">
            Format: <span className="auth-hint-mono">ENDEX-XXXX-XXXX-XXXX</span> · Case insensitive
          </p>
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button
          type="submit"
          disabled={loading || !isComplete}
          className="auth-submit"
        >
          {loading ? (
            <>
              <span className="auth-spinner" aria-hidden="true" />
              Verifying credential...
            </>
          ) : (
            "Redeem & enter ENDEX"
          )}
        </button>
      </form>
    </AuthShell>
  )
}
