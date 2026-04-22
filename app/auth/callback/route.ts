import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { NextRequest, NextResponse } from "next/server"

// Returns a reason slug for /resend-confirmation when the error looks like an
// expired, invalid, or already-used confirmation link. Returns null for
// unrelated failures (those keep the existing /login redirect).
function classifyLinkError(code: string | null, description: string | null): string | null {
  const text = `${code ?? ""} ${description ?? ""}`.toLowerCase()
  if (!text.trim()) return null
  if (text.includes("otp_expired") || text.includes("expired")) return "expired"
  if (text.includes("already") && text.includes("used")) return "used"
  if (text.includes("access_denied") || text.includes("invalid")) return "invalid"
  return null
}

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const routeLog = logger("auth.callback").with({ requestId })
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
  const errorParam = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  try {
    if (errorParam) {
      routeLog.warn("callback.provider_error", { error: errorParam, errorDescription })
      const reason = classifyLinkError(errorParam, errorDescription)
      if (reason) {
        const redirect = new URL("/resend-confirmation", origin)
        redirect.searchParams.set("reason", reason)
        return attachRequestIdHeader(NextResponse.redirect(redirect), requestId)
      }
      const redirect = new URL("/login", origin)
      redirect.searchParams.set("error", errorDescription ?? errorParam)
      return attachRequestIdHeader(NextResponse.redirect(redirect), requestId)
    }

    if (!code) {
      // Supabase parks expired/invalid link errors in the URL hash fragment,
      // which never reaches the server. Arriving here with no code and no
      // query-string error is almost always that case — route to resend.
      routeLog.warn("callback.missing_code", {})
      const redirect = new URL("/resend-confirmation", origin)
      redirect.searchParams.set("reason", "expired")
      return attachRequestIdHeader(NextResponse.redirect(redirect), requestId)
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      routeLog.warn("callback.exchange_failed", { error: errorToFields(error) })
      const reason = classifyLinkError(null, error.message)
      if (reason) {
        const redirect = new URL("/resend-confirmation", origin)
        redirect.searchParams.set("reason", reason)
        return attachRequestIdHeader(NextResponse.redirect(redirect), requestId)
      }
      const redirect = new URL("/login", origin)
      redirect.searchParams.set("error", error.message)
      return attachRequestIdHeader(NextResponse.redirect(redirect), requestId)
    }

    routeLog.info("callback.success", { next })
    return attachRequestIdHeader(NextResponse.redirect(new URL(next, origin)), requestId)
  } catch (error) {
    routeLog.error("callback.failed", { error: errorToFields(error) })
    throw error
  } finally {
    await safeFlush(routeLog)
  }
}
