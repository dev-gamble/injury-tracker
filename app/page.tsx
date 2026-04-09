import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { AuthBrand } from "@/components/auth/AuthBrand"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="auth-page">
      <div className="auth-card">
        <AuthBrand />
        <div className="auth-body">
          {user ? (
            <>
              <h1 className="auth-title">Welcome Back</h1>
              <div className="auth-user-email">{user.email}</div>
              <Link href="/dashboard" className="auth-btn-dashboard">
                Go to Dashboard →
              </Link>
              <div className="auth-divider" />
              <div style={{ textAlign: "center" }}>
                <form action="/signout" method="post" style={{ display: "inline" }}>
                  <button type="submit" className="auth-signout-link">
                    Sign out
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <h1 className="auth-title">Sign In</h1>
              <p className="auth-info">
                Track and document your service-connected disabilities to support your VA benefits claim.
              </p>
              <div className="auth-home-actions">
                <Link href="/login" className="auth-btn-dashboard">
                  Sign In
                </Link>
                <Link href="/signup" className="auth-btn-outline">
                  Create Account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
