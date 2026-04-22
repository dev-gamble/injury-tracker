import { NextRequest, NextResponse } from "next/server"
import { errorToFields, logger, safeFlush } from "@/lib/logging"
import { getOrCreateRequestId, attachRequestIdHeader } from "@/lib/logging/request-id"
import { createClient } from "@/lib/supabase/server"
import { promises as fs } from "fs"
import path from "path"

const SIGN_IN_BUTTON = `<a href="/login" class="export-btn header-signin-btn" style="background:var(--navy);border-color:var(--navy2);padding:6px 10px;font-size:11px;" title="Sign in">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
  Sign in
</a>`

const SIGN_OUT_BUTTON = `<button type="button" class="export-btn header-signin-btn" style="background:var(--navy);border-color:var(--navy2);padding:6px 10px;font-size:11px;" onclick="window.__openSignoutModal&&window.__openSignoutModal()" title="Sign out">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  Sign out
</button>
<div id="signout-modal" class="signout-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="signout-title" onclick="window.__dismissSignoutModal&&window.__dismissSignoutModal(event)">
  <div class="signout-panel">
    <div class="signout-accent" aria-hidden="true"></div>
    <div class="signout-body">
      <div class="signout-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <h2 id="signout-title" class="signout-title">Sign out of ENDEX?</h2>
      <p class="signout-copy">All in-browser session data for this device will be erased. Make sure you've <strong>saved your project (.endexclaim)</strong> — otherwise pins, notes, and claim details will be lost.</p>
    </div>
    <div class="signout-actions">
      <button type="button" class="signout-cancel" onclick="window.__closeSignoutModal&&window.__closeSignoutModal()">Cancel</button>
      <form action="/signout" method="POST" style="margin:0;">
        <button type="submit" class="signout-confirm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign out
        </button>
      </form>
    </div>
  </div>
</div>
<script>(function(){var m=function(){return document.getElementById('signout-modal');};window.__openSignoutModal=function(){var el=m();if(el){el.classList.remove('hidden');document.body.style.overflow='hidden';}};window.__closeSignoutModal=function(){var el=m();if(el){el.classList.add('hidden');document.body.style.overflow='';}};window.__dismissSignoutModal=function(e){if(e&&e.target&&e.target.id==='signout-modal')window.__closeSignoutModal();};document.addEventListener('keydown',function(e){if(e.key==='Escape'){var el=m();if(el&&!el.classList.contains('hidden'))window.__closeSignoutModal();}});})();</script>`

const AUTH_BUTTON_PATTERN = /<!--AUTH_BUTTON_START-->[\s\S]*?<!--AUTH_BUTTON_END-->/

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPE_MAP[c])
}

// Small identity chip rendered to the left of the sign-out button for
// authenticated users. Hidden by CSS on narrow viewports. Admins are labeled
// explicitly; otherwise the tier is derived from current_user_tier(). A signed-
// in user with no active grant (tier === null) sees a subtle "Redeem Key" CTA
// where the tier badge would normally sit — middleware no longer bounces them
// to /redeem-key, so this is how they discover the redemption step.
function renderSignedInBlock(email: string, tier: string | null, isAdmin: boolean): string {
  const label = isAdmin ? 'admin' : tier
  const tierClass = label ? ` header-identity-tier-${label}` : ''
  let badge = ''
  if (isAdmin) {
    badge = `<a href="/admin" class="header-identity-tier header-identity-tier-link${tierClass}" title="Open admin console"><span class="header-identity-tier-dot" aria-hidden="true"></span>ADMIN ACCESS</a>`
  } else if (label) {
    badge = `<span class="header-identity-tier${tierClass}"><span class="header-identity-tier-dot" aria-hidden="true"></span>${escapeHtml(label.toUpperCase())} ACCESS</span>`
  } else {
    badge = `<a href="/redeem-key" class="header-identity-redeem" title="Redeem your access key"><span class="header-identity-redeem-dot" aria-hidden="true"></span>Redeem Key</a>`
  }
  const identity = `<div class="header-identity" aria-label="Account">
  <span class="header-identity-email" title="${escapeHtml(email)}">${escapeHtml(email)}</span>
  ${badge}
</div>`
  return identity + SIGN_OUT_BUTTON
}

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
    let responseBody: BodyInit
    if (isHtml) {
      let html = fileBuffer.toString("utf-8").replace(
        "<head>",
        '<head>\n<base href="/">\n<link rel="icon" href="/icon.svg" type="image/svg+xml">'
      )
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      let replacement = SIGN_IN_BUTTON
      if (user) {
        const isAdmin = (user.app_metadata as { role?: unknown })?.role === 'admin'
        let tier: string | null = null
        if (!isAdmin) {
          const { data: tierData } = await supabase.rpc('current_user_tier')
          tier = typeof tierData === 'string' ? tierData : null
        }
        replacement = renderSignedInBlock(user.email ?? '', tier, isAdmin)
      }
      html = html.replace(AUTH_BUTTON_PATTERN, replacement)
      responseBody = html
    } else {
      responseBody = new Uint8Array(fileBuffer)
    }

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
