import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { getOrCreateRequestId, attachRequestIdHeader } from "@/lib/logging/request-id"
import { promises as fs } from "fs"
import path from "path"
import { redirect } from "next/navigation"

export const runtime = "nodejs"

// Absolute path to the client-js app on disk.
// Dev:        <repo>/client-js/injury-tracker
// Standalone: /app/client-js/injury-tracker  (process.cwd() === "/app")
const BASE_DIR = path.resolve(process.cwd(), "client-js/injury-tracker")

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
}

const ALLOWED_EXTENSIONS = new Set(Object.keys(MIME_TYPES))

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const requestId = getOrCreateRequestId(request)
  const routeLog = logger("dashboard.tracker").with({ requestId })

  try {
    const { slug } = await params
    const segments = slug && slug.length > 0 ? slug : ["index.html"]
    const relativePath = segments.join("/")
    const resolvedPath = path.resolve(BASE_DIR, relativePath)

    // Security: path traversal prevention.
    // path.resolve normalizes ../sequences; startsWith is the definitive guard.
    if (!resolvedPath.startsWith(BASE_DIR + path.sep) && resolvedPath !== BASE_DIR) {
      routeLog.warn("tracker.path_traversal_attempt", { relativePath })
      return attachRequestIdHeader(
        NextResponse.json({ error: "Not found" }, { status: 404 }),
        requestId
      )
    }

    // Security: extension allowlist — only .html, .js, .css are ever served.
    // Body diagrams are SVG-inlined in index.html; no external image files needed.
    const ext = path.extname(resolvedPath).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return attachRequestIdHeader(
        NextResponse.json({ error: "Not found" }, { status: 404 }),
        requestId
      )
    }

    // Auth double-check for HTML (defense-in-depth beyond middleware).
    // Middleware already guards all /dashboard/* routes, but this ensures the
    // initial page load is always validated even if middleware config changes.
    if (ext === ".html") {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) redirect("/login")
    }

    let fileBuffer: Buffer
    try {
      fileBuffer = await fs.readFile(resolvedPath)
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException).code
      if (code === "ENOENT" || code === "EISDIR") {
        return attachRequestIdHeader(
          NextResponse.json({ error: "Not found" }, { status: 404 }),
          requestId
        )
      }
      throw err
    }

    const isHtml = ext === ".html"

    // For HTML, inject a <base> tag so relative paths (css/styles.css, js/data.js, etc.)
    // resolve to /dashboard/tracker/… regardless of whether the URL has a trailing slash.
    const responseBody = isHtml
      ? fileBuffer.toString("utf-8").replace("<head>", '<head>\n<base href="/dashboard/tracker/">')
      : new Uint8Array(fileBuffer)

    const response = new NextResponse(responseBody, {
      status: 200,
      headers: {
        "Content-Type": MIME_TYPES[ext],
        "Cache-Control": isHtml
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=3600, immutable",
      },
    })

    routeLog.debug("tracker.served", { path: relativePath, ext, bytes: fileBuffer.length })
    return attachRequestIdHeader(response, requestId)

  } catch (error) {
    // redirect() from next/navigation throws a NEXT_REDIRECT error — re-throw
    // it so Next.js can handle the redirect response correctly.
    if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw error

    routeLog.error("tracker.failed", {
      method: request.method,
      path: request.nextUrl.pathname,
      error: errorToFields(error),
    })
    throw error
  } finally {
    await safeFlush(routeLog)
  }
}
