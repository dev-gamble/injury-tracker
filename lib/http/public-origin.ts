import 'server-only'
import type { NextRequest } from 'next/server'

// Resolve the public-facing origin (scheme + host) for the current request.
//
// `request.nextUrl.origin` returns the *internal* URL when the app runs
// behind a TLS-terminating proxy (DO App Platform, Vercel, Cloudflare, etc.):
// the proxy receives `https://yourdomain.com/...` from the user, then forwards
// to the container as `http://127.0.0.1:8080/...`. Anything we hand off to
// external systems (Stripe Checkout success_url, portal return_url, OAuth
// callbacks, password-reset email links) must be the public URL — otherwise
// the user gets redirected to an unreachable internal address after coming
// back through the proxy.
//
// Resolution order:
//   1. NEXT_PUBLIC_SITE_URL env var — explicit + can't be spoofed.
//   2. x-forwarded-proto + x-forwarded-host — set by every reasonable proxy.
//   3. host header (with assumed https in prod, http in dev) — last resort.
//   4. request.nextUrl.origin — fallback that matches local dev exactly.
export function getPublicOrigin(request: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')

  const fwdHost = request.headers.get('x-forwarded-host')
  const fwdProto = request.headers.get('x-forwarded-proto')
  if (fwdHost) {
    const proto = fwdProto ?? 'https'
    return `${proto}://${fwdHost}`
  }

  const host = request.headers.get('host')
  if (host) {
    const proto = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    return `${proto}://${host}`
  }

  return request.nextUrl.origin
}
