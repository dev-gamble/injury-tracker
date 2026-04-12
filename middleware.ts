import { NextResponse, type NextRequest } from "next/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const requestLog = logger("app.middleware").with({ requestId })
  const startedAt = Date.now()
  const { pathname } = request.nextUrl

  try {
    // Skip Next.js internals, API routes, static assets, and tracker JS/CSS.
    // Tracker JS/CSS are only reachable after loading the auth-protected HTML,
    // contain no sensitive data, and don't need per-request token refresh.
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/js/") ||
      pathname.startsWith("/css/") ||
      pathname.match(/\.(?:ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot)$/)
    ) {
      const res = NextResponse.next()
      requestLog.debug("request.skipped", {
        method: request.method,
        path: pathname,
      })
      return attachRequestIdHeader(res, requestId)
    }

    const res = await updateSession(request, requestId)
    const durationMs = Date.now() - startedAt

    if (res.status >= 500) {
      requestLog.error("request.completed", { method: request.method, path: pathname, status: res.status, durationMs })
    } else if (res.status >= 400) {
      requestLog.warn("request.completed", { method: request.method, path: pathname, status: res.status, durationMs })
    } else {
      requestLog.debug("request.completed", { method: request.method, path: pathname, status: res.status, durationMs })
    }

    return attachRequestIdHeader(res, requestId)
  } catch (error) {
    requestLog.error("request.failed", {
      method: request.method,
      path: pathname,
      durationMs: Date.now() - startedAt,
      error: errorToFields(error),
    })
    throw error
  } finally {
    await safeFlush(requestLog)
  }
}

export const config = {
  matcher: [
    "/((?!_next/|api/|.*\\.(?:ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot)$).*)",
  ],
}
