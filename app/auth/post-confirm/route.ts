import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { NextRequest, NextResponse } from "next/server"

// Post-confirmation decision point. A confirmed user lands here and gets
// routed to the next step of activation. The split is deliberate so the
// key-redemption and subscription flows can evolve independently without
// changing the email template or the signup handshake.
export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const routeLog = logger("auth.post_confirm").with({ requestId })
  const { origin } = request.nextUrl

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      routeLog.info("post_confirm.no_user")
      return attachRequestIdHeader(NextResponse.redirect(new URL("/login", origin)), requestId)
    }

    try {
      const { data, error } = await supabase.rpc("current_user_has_access")
      // Fail-open on RPC error: we can't confirm access, so we route to
      // /subscribe rather than block a legitimate user. A provisioned user
      // will see the wrong page for the duration of the outage — log loudly
      // so transient DB issues are visible in observability.
      if (error) {
        routeLog.warn("post_confirm.access_check_rpc_error", {
          userId: user.id,
          error: errorToFields(error),
        })
      } else if (data === true) {
        routeLog.info("post_confirm.has_access", { userId: user.id })
        return attachRequestIdHeader(NextResponse.redirect(new URL("/", origin)), requestId)
      }
    } catch (error) {
      routeLog.warn("post_confirm.access_check_failed", {
        userId: user.id,
        error: errorToFields(error),
      })
    }

    // Default new confirmed users into the subscription flow. Users with an
    // issued access key can reach /redeem-key from the subscribe page.
    routeLog.info("post_confirm.route_subscribe", { userId: user.id })
    return attachRequestIdHeader(NextResponse.redirect(new URL("/subscribe", origin)), requestId)
  } catch (error) {
    routeLog.error("post_confirm.failed", { error: errorToFields(error) })
    throw error
  } finally {
    await safeFlush(routeLog)
  }
}
