import { createServerClient, type CookieMethodsServer } from '@/lib/supabase/ssr'
import { errorToFields, logger, safeFlush } from '@/lib/logging'
import { getPublicEnv } from "@/lib/env"
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication to access
const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/redeem-key']
// Routes that additionally require admin role (app_metadata.role === 'admin')
const ADMIN_PREFIXES = ['/admin']
// Routes that authenticated users can visit without an active license grant —
// i.e., auth-flow pages (login, signup, redeem the key, recover password).
// Anything outside this list requires a valid grant when the user is signed in.
const AUTH_FLOW_PREFIXES = [
  '/login',
  '/signup',
  '/redeem-key',
  '/forgot-password',
  '/reset-password',
  '/auth',
]

// Brief in-memory cache of "this user has access" per edge instance. Avoids a
// DB round-trip on every request. Only positive results are cached — a fresh
// redemption is visible immediately, and revocation surfaces within 60s.
const ACCESS_TTL_MS = 60_000
const accessCache = new Map<string, number>()

export async function updateSession(request: NextRequest, requestId?: string) {
  const env = getPublicEnv()
  let res = NextResponse.next({ request })
  const path = request.nextUrl.pathname
  const authLog = logger('auth.middleware').with(requestId ? { requestId } : {})

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
  const isAuthFlow = AUTH_FLOW_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll()
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
      res = NextResponse.next({ request })
      cookiesToSet.forEach(({ name, value, options }) => {
        res.cookies.set({ name, value, ...options })
      })
    },
  }

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: cookieMethods,
    }
  )

  // IMPORTANT: Do not add code between createServerClient and auth.getUser()
  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'] = null
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    user = currentUser
  } catch (error) {
    authLog.error('auth.user_fetch_failed', {
      path,
      error: errorToFields(error),
    })
    await safeFlush(authLog)
    throw error
  }

  // When redirecting from middleware, we must copy any cookies Supabase set
  // during auth.getUser() (via the setAll callback above) onto the redirect
  // response. A fresh NextResponse.redirect() drops them, which would lose
  // a freshly rotated session and bounce the user into a login loop.
  function redirectWithCookies(url: URL) {
    const redirect = NextResponse.redirect(url)
    res.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
    return redirect
  }

  if (isProtected && !user) {
    authLog.info('auth.redirect_login', {
      path,
      redirectTo: '/login',
    })
    await safeFlush(authLog)
    return redirectWithCookies(new URL('/login', request.url))
  }

  const role = user
    ? (user.app_metadata as { role?: unknown } | null | undefined)?.role
    : undefined
  const isAdmin = role === 'admin'

  // Authenticated users visiting any non-auth-flow page must have an active
  // license grant. Without this check, a user with a session but no redeemed
  // key can browse the product as if fully enrolled. Admins are exempt — they
  // manage the product and shouldn't be gated by the same license pipeline.
  if (user && !isAuthFlow && !isAdmin) {
    const cachedExpiry = accessCache.get(user.id)
    const hasCachedAccess = cachedExpiry !== undefined && cachedExpiry > Date.now()
    if (!hasCachedAccess) {
      if (cachedExpiry !== undefined) accessCache.delete(user.id)
      try {
        const { data, error } = await supabase.rpc('current_user_has_access')
        if (error) {
          // Fail closed. /redeem-key is in AUTH_FLOW_PREFIXES so it won't loop,
          // and the user sees the redemption form where they can try again.
          authLog.warn('auth.access_check_failed', {
            path,
            userId: user.id,
            error: errorToFields(error),
          })
          await safeFlush(authLog)
          return redirectWithCookies(new URL('/redeem-key', request.url))
        }
        if (data === true) {
          accessCache.set(user.id, Date.now() + ACCESS_TTL_MS)
        } else {
          authLog.info('auth.redirect_redeem_key', { path, userId: user.id })
          await safeFlush(authLog)
          return redirectWithCookies(new URL('/redeem-key', request.url))
        }
      } catch (error) {
        authLog.error('auth.access_check_threw', {
          path,
          userId: user.id,
          error: errorToFields(error),
        })
        await safeFlush(authLog)
        return redirectWithCookies(new URL('/redeem-key', request.url))
      }
    }
  }

  const isAdminRoute = ADMIN_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
  if (isAdminRoute && user && !isAdmin) {
    authLog.warn('auth.admin_forbidden', { path, userId: user.id })
    await safeFlush(authLog)
    return redirectWithCookies(new URL('/', request.url))
  }

  return res
}
