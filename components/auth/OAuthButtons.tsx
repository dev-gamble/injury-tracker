"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"

type Channel = "key" | "subscription" | "free"
type Provider = "google" | "apple"

type OAuthButtonsProps = {
  mode: "signin" | "signup"
  channel?: Channel
  onError?: (msg: string) => void
}

export function OAuthButtons({ mode, channel, onError }: OAuthButtonsProps) {
  const [pending, setPending] = useState<Provider | null>(null)

  async function handleOAuth(provider: Provider) {
    setPending(provider)
    // For signup we route through post-confirm so the user lands on the right
    // activation page (/subscribe or /redeem-key) based on the channel they
    // picked. For signin we just send them home — middleware will handle any
    // gated navigation.
    const next =
      mode === "signup"
        ? `/auth/post-confirm${channel ? `?channel=${encodeURIComponent(channel)}` : ""}`
        : "/"
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    })
    if (error) {
      onError?.(error.message)
      setPending(null)
    }
    // Success path navigates the browser away — no state cleanup needed.
  }

  const verb = mode === "signup" ? "Sign up" : "Sign in"

  return (
    <div className="auth-oauth">
      <div className="auth-oauth-divider" role="separator">
        <span>or</span>
      </div>
      <div className="auth-oauth-grid">
        <button
          type="button"
          className="auth-oauth-btn auth-oauth-google"
          onClick={() => handleOAuth("google")}
          disabled={pending !== null}
          aria-busy={pending === "google"}
          aria-label={`${verb} with Google`}
        >
          {pending === "google" ? (
            <span className="auth-oauth-spinner auth-oauth-spinner-dark" aria-hidden="true" />
          ) : (
            <>
              <GoogleIcon />
              <span>{verb} with Google</span>
            </>
          )}
        </button>
        <button
          type="button"
          className="auth-oauth-btn auth-oauth-apple"
          onClick={() => handleOAuth("apple")}
          disabled={pending !== null}
          aria-busy={pending === "apple"}
          aria-label={`${verb} with Apple`}
        >
          {pending === "apple" ? (
            <span className="auth-oauth-spinner auth-oauth-spinner-light" aria-hidden="true" />
          ) : (
            <>
              <AppleIcon />
              <span>{verb} with Apple</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.836.86-3.048.86-2.345 0-4.328-1.583-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.165 6.655 3.58 9 3.58z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M11.182 8.39c-.02-2.06 1.683-3.06 1.76-3.107-.96-1.404-2.45-1.595-2.978-1.617-1.27-.128-2.475.748-3.118.748-.642 0-1.638-.728-2.694-.708-1.388.02-2.668.806-3.382 2.045-1.443 2.5-.37 6.198 1.04 8.226.69.992 1.512 2.108 2.589 2.067 1.04-.04 1.434-.673 2.694-.673 1.26 0 1.614.673 2.71.652 1.119-.02 1.828-1.013 2.512-2.012.792-1.156 1.118-2.275 1.139-2.332-.025-.011-2.187-.84-2.272-3.289zM9.146 2.448c.575-.696.962-1.665.857-2.628-.83.034-1.831.553-2.425 1.247-.532.616-.999 1.6-.873 2.546.926.072 1.866-.47 2.441-1.165z"
      />
    </svg>
  )
}
