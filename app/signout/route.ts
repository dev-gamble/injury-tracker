import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const routeLog = logger("auth.signout").with({ requestId })

  try {
    // Defense in depth against cross-origin signout-forging. SameSite=Lax
    // cookies already block most cases; rejecting any POST whose Origin
    // hostname doesn't match the request host closes the small remaining
    // window (e.g., a sibling subdomain on a shared parent). Compare
    // hostnames only — behind a TLS-terminating proxy, the browser's
    // Origin scheme won't always match the internal request scheme.
    const originHeader = request.headers.get("origin")
    if (originHeader) {
      const hostHeader = request.headers.get("host") ?? request.nextUrl.host
      let originHost: string | null = null
      try {
        originHost = new URL(originHeader).host
      } catch {
        originHost = null
      }
      if (!originHost || originHost !== hostHeader) {
        routeLog.warn("signout.origin_mismatch", {
          origin: originHeader,
          expected: hostHeader,
        })
        return attachRequestIdHeader(
          NextResponse.json({ error: "Forbidden" }, { status: 403 }),
          requestId
        )
      }
    }

    const supabase = await createClient()
    await supabase.auth.signOut()
    routeLog.info("signout.success", {
      method: request.method,
      path: request.nextUrl.pathname,
    })
    const response = NextResponse.redirect(new URL("/login", request.url), { status: 303 })
    // Clear any recovery marker so it can't outlive the session that produced it.
    response.cookies.delete("endex_pw_recovery")
    return attachRequestIdHeader(response, requestId)
  } catch (error) {
    routeLog.error("signout.failed", {
      method: request.method,
      path: request.nextUrl.pathname,
      error: errorToFields(error),
    })
    throw error
  } finally {
    await safeFlush(routeLog)
  }
}
