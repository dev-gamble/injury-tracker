import { NextResponse } from "next/server"

// Behind a TLS-terminating proxy (DO App Platform) the internal request
// host/scheme may not match the public one, so absolute URLs built from
// request.url / nextUrl.origin can leak 127.0.0.1:8080 into the redirect.
// Browsers resolve a relative Location against the current page URL — which
// is always the public origin — so this is proxy-agnostic.
export function relativeRedirect(path: string): NextResponse {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: path },
  })
}
