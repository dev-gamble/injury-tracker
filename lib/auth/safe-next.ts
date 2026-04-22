// Only allow same-origin paths for post-auth redirects. Rejects protocol-
// relative URLs ("//evil.com"), absolute URLs, and non-path strings — without
// this, /auth/callback?next=https://evil.com and /auth/confirm?next=... would
// be open redirects that send a freshly-authenticated user off-site.
export function safeNext(next: string | null | undefined, fallback = "/"): string {
  if (typeof next !== "string" || next.length === 0) return fallback
  if (!next.startsWith("/")) return fallback
  if (next.startsWith("//")) return fallback
  return next
}
