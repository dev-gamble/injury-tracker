import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"
import { SubscribeButton } from "./SubscribeButton"

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
      title="Activate ENDEX"
      footer={
        <>
          Have an access key? <Link href="/redeem-key" className="auth-link">Redeem it here</Link>
          <br />
          <br />
          <Link href="/" className="auth-link-subtle">Back to home</Link>
        </>
      }
    >
      <div className="auth-stripe">
        <p className="auth-stripe-body">
          Signed in as {user.email}. Choose a plan and you&apos;ll be taken to Stripe&apos;s secure checkout.
        </p>
        <SubscribeButton plan="monthly" label="$7/month" />
        <SubscribeButton plan="yearly" label="$50/year (save $34)" />
      </div>
    </AuthShell>
  )
}
