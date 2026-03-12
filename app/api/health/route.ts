import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { attachRequestIdHeader, getOrCreateRequestId } from "@/lib/logging/request-id"
import { getPublicEnv, getServerEnv } from "@/lib/env"
import { NextRequest, NextResponse } from "next/server"

function extractEnvIssueKeys(error: unknown): string[] {
  if (!(error instanceof Error)) return ["unknown_env_error"]

  const keys = error.message
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).split(":")[0]?.trim())
    .filter(Boolean) as string[]

  return keys.length > 0 ? keys : ["env_validation_failed"]
}

function getHealthSnapshot() {
  const envIssues = new Set<string>()
  try {
    getPublicEnv()
  } catch (error) {
    extractEnvIssueKeys(error).forEach((issue) => envIssues.add(issue))
  }

  try {
    getServerEnv()
  } catch (error) {
    extractEnvIssueKeys(error).forEach((issue) => envIssues.add(issue))
  }

  const missingEnv = Array.from(envIssues)
  const ready = missingEnv.length === 0
  const status = ready ? 200 : 503

  return {
    status,
    body: {
      status: ready ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptimeSec: Math.round(process.uptime()),
      checks: {
        env: {
          status: ready ? "ok" : "missing",
          missing: missingEnv,
        },
      },
    },
  }
}

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const routeLog = logger("ops.health").with({ requestId })

  try {
    const snapshot = getHealthSnapshot()
    if (snapshot.status === 503) {
      routeLog.warn("health.degraded", snapshot.body)
    } else {
      routeLog.debug("health.ok", { uptimeSec: snapshot.body.uptimeSec })
    }

    const response = NextResponse.json(snapshot.body, { status: snapshot.status })
    response.headers.set("Cache-Control", "no-store")
    return attachRequestIdHeader(response, requestId)
  } catch (error) {
    routeLog.error("health.failed", { error: errorToFields(error) })
    const response = NextResponse.json({ status: "error" }, { status: 500 })
    response.headers.set("Cache-Control", "no-store")
    return attachRequestIdHeader(response, requestId)
  } finally {
    await safeFlush(routeLog)
  }
}

export async function HEAD(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const snapshot = getHealthSnapshot()
  const response = new NextResponse(null, { status: snapshot.status })
  response.headers.set("Cache-Control", "no-store")
  return attachRequestIdHeader(response, requestId)
}
