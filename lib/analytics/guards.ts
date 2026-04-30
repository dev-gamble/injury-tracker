import 'server-only'

// Defensive guards for the public /api/analytics/track endpoint. Anything
// here is best-effort — the goal is "raise the cost of polluting the table",
// not "make it impossible to record a fake visit." A motivated attacker can
// still spoof an Origin and rotate IPs, but they have to mean it.

const BOT_RE = /\b(bot|crawler|spider|crawling|preview|scrape|fetch|wget|curl|httpclient|monitor|uptime|googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|discordbot|slackbot|whatsapp|telegrambot|headlesschrome|phantomjs|puppeteer|playwright|lighthouse|chrome-lighthouse)\b/i

// User-agents we never want to record. Tracking bot traffic dilutes the
// analytics for the human visitors the panel actually cares about.
export function isLikelyBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true
  return BOT_RE.test(userAgent)
}

// We only track first-party paths the app actually serves. Everything else
// (random POSTs from a random origin, /wp-login probes, deeplinks into 3rd
// party tools) gets dropped.
const ALLOWED_PATH_PREFIXES = [
  '/admin',
  '/dashboard',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/resend-confirmation',
  '/redeem-key',
  '/subscribe',
  '/auth',
  '/injury-tracker',
]

// Specific HTML files served by the static tracker route at app/[[...slug]].
// Listed exactly so the prefix matcher (which would otherwise treat '/' as
// "everything") can't be tricked into accepting arbitrary deep paths.
const ALLOWED_EXACT_PATHS = new Set<string>([
  '/',
  '/index.html',
  '/how-to-use-infographic.html',
])

export function isAllowedPath(path: string): boolean {
  if (path.length > 2000) return false
  // Strip query/fragment for the prefix check; we still record the full
  // path-with-query in the table.
  const justPath = path.split(/[?#]/)[0] ?? ''
  if (!justPath.startsWith('/')) return false
  if (ALLOWED_EXACT_PATHS.has(justPath)) return true
  return ALLOWED_PATH_PREFIXES.some(
    (p) => justPath === p || justPath.startsWith(`${p}/`),
  )
}

// Cross-site posts get rejected. Same-origin Origin/Referer header from any
// page on our domain is fine; missing both is fine in dev, rejected in prod.
//
// In production we require NEXT_PUBLIC_SITE_URL to be set: without it,
// `getPublicOrigin()` derives the origin from x-forwarded-host, which a
// misconfigured or missing reverse proxy could let a client spoof. With the
// env var present, the comparison is against a value that can't be poisoned
// from the request — fail-closed instead of trust-the-header.
export function isSameOrigin(
  request: { headers: Headers },
  publicOrigin: string,
): boolean {
  const isProd = process.env.NODE_ENV === 'production'
  if (isProd && !process.env.NEXT_PUBLIC_SITE_URL) {
    return false
  }

  const origin = request.headers.get('origin')
  if (origin) return origin === publicOrigin
  const referer = request.headers.get('referer')
  if (referer) {
    try {
      return new URL(referer).origin === publicOrigin
    } catch {
      return false
    }
  }
  // Browsers omit Origin on same-origin GETs and on some same-origin POSTs
  // depending on policy. In dev, allow the slip-through; in prod, reject so a
  // direct curl can't pollute the table without at least faking a header.
  return !isProd
}

// In-memory token bucket per IP. Per-Edge-instance (won't be shared across
// horizontally scaled processes), but on a single Node container it's a
// useful brake on a single misbehaving client. A real distributed limiter
// (Upstash, etc.) is overkill for what we're protecting here.
const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 30 // visits/minute/IP
const buckets = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now()
  const existing = buckets.get(ip)
  if (!existing || existing.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { allowed: true, retryAfterSec: 0 }
  }
  existing.count++
  if (existing.count > RATE_LIMIT) {
    return { allowed: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) }
  }
  // Cheap GC: every ~500 inserts, evict expired entries so the map doesn't
  // grow unbounded across hot IPs.
  if (buckets.size > 500) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k)
  }
  return { allowed: true, retryAfterSec: 0 }
}
