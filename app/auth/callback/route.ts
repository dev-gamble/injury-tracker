import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { relativeRedirect } from "@/lib/auth/relative-redirect"
import { safeNext } from "@/lib/auth/safe-next"
import { NextRequest } from "next/server"

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
  const { searchParams } = request.nextUrl
  const code = searchParams.get("code")
  const next = safeNext(searchParams.get("next"))
  const errorParam = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  try {
    if (errorParam) {
      routeLog.warn("callback.provider_error", { error: errorParam, errorDescription })
      const reason = classifyLinkError(errorParam, errorDescription)
      if (reason) {
        return attachRequestIdHeader(relativeRedirect(`/resend-confirmation?reason=${reason}`), requestId)
      }
      return attachRequestIdHeader(
        relativeRedirect(`/login?error=${encodeURIComponent(errorDescription ?? errorParam)}`),
        requestId,
      )
    }

    if (!code) {
      // Supabase parks expired/invalid link errors in the URL hash fragment,
      // which never reaches the server. Arriving here with no code and no
      // query-string error is almost always that case — route to resend.
      routeLog.warn("callback.missing_code", {})
      return attachRequestIdHeader(relativeRedirect("/resend-confirmation?reason=expired"), requestId)
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      routeLog.warn("callback.exchange_failed", { error: errorToFields(error) })
      const reason = classifyLinkError(null, error.message)
      if (reason) {
        return attachRequestIdHeader(relativeRedirect(`/resend-confirmation?reason=${reason}`), requestId)
      }
      return attachRequestIdHeader(
        relativeRedirect(`/login?error=${encodeURIComponent(error.message)}`),
        requestId,
      )
    }

    routeLog.info("callback.success", { next })
    return attachRequestIdHeader(relativeRedirect(next), requestId)
  } catch (error) {
    routeLog.error("callback.failed", { error: errorToFields(error) })
    throw error
  } finally {
    await safeFlush(routeLog)
  }
}
