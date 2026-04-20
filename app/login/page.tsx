"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push("/")
    }
    setLoading(false)
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
        <div className="auth-inline-right">
          <Link href="/forgot-password" className="auth-link-subtle">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="auth-submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  )
}
