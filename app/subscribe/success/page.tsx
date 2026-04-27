import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AuthShell } from "@/components/auth/AuthShell"

// Stripe redirects here after a successful checkout. By the time the user
// lands the webhook may not have written the row yet, so we don't gate on
// access here — we just thank them and let the access RPC catch up on the
// next navigation.
export default async function SubscribeSuccessPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <AuthShell
      eyebrow="Subscription"
      title="You're in"
      subtitle="Thanks for subscribing to ENDEX."
      footer={<Link href="/" className="auth-link">Continue to ENDEX →</Link>}
    >
      <div className="auth-stripe" role="status">
        <p className="auth-stripe-body">
          Your subscription is active. If the app still asks you to subscribe, give it a few seconds and refresh — Stripe&apos;s confirmation can take a moment to reach us.
        </p>
      </div>
    </AuthShell>
  )
}
