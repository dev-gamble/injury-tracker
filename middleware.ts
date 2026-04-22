import { NextResponse, type NextRequest } from "next/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { updateSession } from "@/lib/supabase/middleware"

// Next.js-rendered app routes. These have no legitimate inline scripts of our
// own — only Next's internal hydration scripts, which it auto-nonces when the
// incoming request CSP includes 'strict-dynamic' + 'nonce-*'. Tracker paths
// (served by [[...slug]]) fall back to the loose CSP
// in next.config.ts because the signout-modal injection ships inline handlers.
const APP_ROUTE_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/resend-confirmation",
  "/redeem-key",
  "/admin",
  "/auth",
  "/dashboard",
  "/signout",
]

function isAppRoute(pathname: string): boolean {
  return APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  let binary = ""
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function buildStrictCsp(nonce: string): string {
  const isProd = process.env.NODE_ENV === "production"
  const devConnectSources = isProd
    ? ""
    : " http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*"
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isProd ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    `connect-src 'self' https://*.supabase.co https://api.supabase.com https://api.axiom.co${devConnectSources}`,
    "object-src 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join("; ")
}

export async function middleware(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const requestLog = logger("app.middleware").with({ requestId })
  const startedAt = Date.now()
  const { pathname } = request.nextUrl

  try {
    // Skip Next.js internals, API routes, static assets, and tracker JS/CSS.
    // Tracker JS/CSS contain no sensitive data and don't need per-request
    // token refresh.
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

    // For app routes only: plumb a per-request CSP through the request so
    // Next's internal inline hydration scripts get nonced, then mirror that
    // same CSP on the response to drop 'unsafe-inline'.
    let nonce: string | undefined
    let strictCsp: string | undefined
    if (isAppRoute(pathname)) {
      nonce = generateNonce()
      strictCsp = buildStrictCsp(nonce)
      request.headers.set("Content-Security-Policy", strictCsp)
    }

    const res = await updateSession(request, requestId)
    const durationMs = Date.now() - startedAt

    if (strictCsp) {
      res.headers.set("Content-Security-Policy", strictCsp)
    }

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
