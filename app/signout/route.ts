import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const routeLog = logger("auth.signout").with({ requestId })

  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    routeLog.info("signout.success", {
      method: request.method,
      path: request.nextUrl.pathname,
    })
    const response = NextResponse.redirect(new URL("/login", request.url), { status: 303 })
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
