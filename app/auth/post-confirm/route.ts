import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { relativeRedirect } from "@/lib/auth/relative-redirect"
import { NextRequest } from "next/server"

// Post-confirmation decision point. A confirmed user lands here and gets
// routed to the next step of activation. The split is deliberate so the
// key-redemption and subscription flows can evolve independently without
// changing the email template or the signup handshake.
export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const routeLog = logger("auth.post_confirm").with({ requestId })

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      routeLog.info("post_confirm.no_user")
      return attachRequestIdHeader(relativeRedirect("/login"), requestId)
    }

    // Persist the channel BEFORE checking access. OAuth signups don't pass
    // through signUp() so channel rides the redirect as ?channel=...; if we
    // ran the access RPC first, the early-launch override returns true for
    // every signed-in user and we'd redirect to / before saving the marker.
    // It's user-writable metadata — only impact is later waiting-room
    // routing and the EARLY ACCESS badge, neither of which grants access.
    let channel = (user.user_metadata as { access_channel?: unknown } | null)?.access_channel
    const isKnownChannel = (v: unknown): v is "key" | "subscription" | "free" =>
      v === "key" || v === "subscription" || v === "free"
    if (!isKnownChannel(channel)) {
      const queryChannel = request.nextUrl.searchParams.get("channel")
      if (isKnownChannel(queryChannel)) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { access_channel: queryChannel },
        })
        if (updateError) {
          routeLog.warn("post_confirm.channel_persist_failed", {
            userId: user.id,
            error: errorToFields(updateError),
          })
        }
        channel = queryChannel
      }
    }

    try {
      const { data, error } = await supabase.rpc("current_user_has_access")
      // Fail-open on RPC error: we can't confirm access, so we fall through
      // to channel-based routing rather than block a legitimate user. A
      // provisioned user will see the wrong page during the outage — log
      // loudly so transient DB issues are visible in observability.
      if (error) {
        routeLog.warn("post_confirm.access_check_rpc_error", {
          userId: user.id,
          error: errorToFields(error),
        })
      } else if (data === true) {
        routeLog.info("post_confirm.has_access", { userId: user.id, channel: typeof channel === "string" ? channel : null })
        return attachRequestIdHeader(relativeRedirect("/"), requestId)
      }
    } catch (error) {
      routeLog.warn("post_confirm.access_check_failed", {
        userId: user.id,
        error: errorToFields(error),
      })
    }

    // Early-launch: free-channel signups land directly on the app. Belt
    // and suspenders — has-access RPC above already covers this, but if it
    // ever fails open, the explicit branch keeps free users from being
    // bounced to /subscribe.
    if (channel === "free") {
      routeLog.info("post_confirm.route_free", { userId: user.id })
      return attachRequestIdHeader(relativeRedirect("/"), requestId)
    }

    if (channel === "key") {
      routeLog.info("post_confirm.route_redeem_key", { userId: user.id })
      return attachRequestIdHeader(relativeRedirect("/redeem-key"), requestId)
    }

    routeLog.info("post_confirm.route_subscribe", { userId: user.id, channel: typeof channel === "string" ? channel : null })
    return attachRequestIdHeader(relativeRedirect("/subscribe"), requestId)
  } catch (error) {
    routeLog.error("post_confirm.failed", { error: errorToFields(error) })
    throw error
  } finally {
    await safeFlush(routeLog)
  }
}
