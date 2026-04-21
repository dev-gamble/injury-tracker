import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { NextRequest, NextResponse } from "next/server"

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
      const redirect = new URL("/login", origin)
      redirect.searchParams.set("error", errorDescription ?? errorParam)
      return attachRequestIdHeader(NextResponse.redirect(redirect), requestId)
    }

    if (!code) {
      routeLog.warn("callback.missing_code", {})
      const redirect = new URL("/login", origin)
      redirect.searchParams.set("error", "Missing confirmation code.")
      return attachRequestIdHeader(NextResponse.redirect(redirect), requestId)
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      routeLog.warn("callback.exchange_failed", { error: errorToFields(error) })
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
