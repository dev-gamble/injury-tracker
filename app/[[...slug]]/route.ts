import { NextRequest, NextResponse } from "next/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { getOrCreateRequestId, attachRequestIdHeader } from "@/lib/logging/request-id"
import { promises as fs } from "fs"
import path from "path"

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
  const routeLog = logger("tracker").with({ requestId })

  try {
    const { slug } = await params
    const segments = slug && slug.length > 0 ? slug : ["index.html"]
    const relativePath = segments.join("/")
    const resolvedPath = path.resolve(BASE_DIR, relativePath)

    // Security: path traversal prevention.
    if (!resolvedPath.startsWith(BASE_DIR + path.sep) && resolvedPath !== BASE_DIR) {
      routeLog.warn("tracker.path_traversal_attempt", { relativePath })
      return attachRequestIdHeader(
        NextResponse.json({ error: "Not found" }, { status: 404 }),
        requestId
      )
    }

    // Extension allowlist — only .html, .js, .css are served.
    const ext = path.extname(resolvedPath).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return attachRequestIdHeader(
        NextResponse.json({ error: "Not found" }, { status: 404 }),
        requestId
      )
    }

    const isHtml = ext === ".html"

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

    // Inject <base href="/"> so relative paths (css/styles.css, js/data.js)
    // resolve correctly from the root regardless of trailing slash.
    const responseBody = isHtml
      ? fileBuffer.toString("utf-8").replace("<head>", '<head>\n<base href="/">\n<link rel="icon" href="/icon.svg" type="image/svg+xml">')
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
