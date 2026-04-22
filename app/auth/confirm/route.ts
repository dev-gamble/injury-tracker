import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { safeNext } from "@/lib/auth/safe-next"
import { NextRequest, NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"

const ALLOWED_TYPES: ReadonlySet<EmailOtpType> = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
])

function classifyVerifyError(description: string | null): "expired" | "used" | "invalid" {
  const text = (description ?? "").toLowerCase()
  if (text.includes("expired") || text.includes("otp_expired")) return "expired"
  if (text.includes("already") && text.includes("used")) return "used"
  return "invalid"
}

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const routeLog = logger("auth.confirm").with({ requestId })
  const { searchParams, origin } = request.nextUrl

  const tokenHash = searchParams.get("token_hash")
  const typeParam = searchParams.get("type")
  const next = safeNext(searchParams.get("next"))

  try {
    if (!tokenHash || !typeParam || !ALLOWED_TYPES.has(typeParam as EmailOtpType)) {
      routeLog.warn("confirm.bad_request", { hasTokenHash: !!tokenHash, type: typeParam })
      const redirect = new URL("/resend-confirmation", origin)
      redirect.searchParams.set("reason", "invalid")
      return attachRequestIdHeader(NextResponse.redirect(redirect), requestId)
    }

    const type = typeParam as EmailOtpType
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })

    if (error) {
      routeLog.warn("confirm.verify_failed", { type, error: errorToFields(error) })
      const reason = classifyVerifyError(error.message)
      // Password recovery failures belong on /forgot-password; the
      // resend-confirmation page is scoped to signup verification.
      if (type === "recovery") {
        const redirect = new URL("/forgot-password", origin)
        redirect.searchParams.set("error", error.message)
        return attachRequestIdHeader(NextResponse.redirect(redirect), requestId)
      }
      const redirect = new URL("/resend-confirmation", origin)
      redirect.searchParams.set("reason", reason)
      return attachRequestIdHeader(NextResponse.redirect(redirect), requestId)
    }

    routeLog.info("confirm.success", { type, next })
    const response = NextResponse.redirect(new URL(next, origin))

    // For password recovery, bind a short-lived HttpOnly marker cookie to the
    // verified user. /reset-password gates the form on (cookie.value === user.id),
    // so a normal signed-in user who never went through recovery can't reach it.
    if (type === "recovery" && data.user?.id) {
      response.cookies.set("endex_pw_recovery", data.user.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 15 * 60,
      })
    }

    return attachRequestIdHeader(response, requestId)
  } catch (error) {
    routeLog.error("confirm.failed", { error: errorToFields(error) })
    throw error
  } finally {
    await safeFlush(routeLog)
  }
}
