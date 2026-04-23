import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

export default async function SubscribePage() {
  const log = logger("app.subscribe")
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fail-open on RPC error: render the subscribe page rather than block.
  // An already-provisioned user will see the wrong page during a DB outage —
  // log so the impact is visible.
  const { data: hasAccess, error: accessErr } = await supabase.rpc("current_user_has_access")
  if (accessErr) {
    log.warn("subscribe.access_check_rpc_error", {
      userId: user.id,
      error: errorToFields(accessErr),
    })
  }
  await safeFlush(log)
  if (hasAccess === true) redirect("/")

  return (
    <AuthShell
      eyebrow="Subscription"
      title="Choose your plan"
      subtitle="Commercial enrollment is in final integration. A recurring subscription will be offered here soon."
      footer={
        <>
          Have an access key? <Link href="/redeem-key" className="auth-link">Redeem it here</Link>
          <br />
          <br />
          <form action="/signout" method="post">
            <button type="submit" className="auth-link-subtle" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              Sign out
            </button>
          </form>
        </>
      }
    >
      <div className="auth-stripe" role="status">
        <div className="auth-stripe-rule" aria-hidden="true">
          <span>{'//'}</span> Pending release
        </div>
        <h3 className="auth-stripe-title">Subscriptions not yet open</h3>
        <p className="auth-stripe-body">
          You&apos;re signed in as {user.email}. We&apos;ll email you the moment subscriptions open.
          If an administrator issued you an access key, redeem it to enter ENDEX now.
        </p>
        <button type="button" disabled className="auth-submit is-ghost" aria-disabled="true">
          Subscribe · unavailable
        </button>
      </div>
    </AuthShell>
  )
}
