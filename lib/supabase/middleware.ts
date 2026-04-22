import { createServerClient, type CookieMethodsServer } from '@/lib/supabase/ssr'
import { errorToFields, logger, safeFlush } from '@/lib/logging'
import { getPublicEnv } from "@/lib/env"
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication to access.
const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/redeem-key']
// Routes that additionally require admin role (app_metadata.role === 'admin')
const ADMIN_PREFIXES = ['/admin']

// Per-edge-instance cache of "user has access" to skip the RPC on repeat
// /redeem-key hits. Only positive results are cached — revocation surfaces
// within 60s, and a user without access stays uncached so a fresh redemption
// is visible immediately on next navigation.
const ACCESS_TTL_MS = 60_000
const accessCache = new Map<string, number>()

export async function updateSession(request: NextRequest, requestId?: string) {
  const env = getPublicEnv()
  let res = NextResponse.next({ request })
  const path = request.nextUrl.pathname
  const authLog = logger('auth.middleware').with(requestId ? { requestId } : {})

  const matchesPrefix = (prefixes: readonly string[]) =>
    prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  const isProtected = matchesPrefix(PROTECTED_PREFIXES)
  const isAdminRoute = matchesPrefix(ADMIN_PREFIXES)
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

  // A user who already holds an active grant shouldn't linger on /redeem-key —
  // bounce them back to the app. Fail-open: if the RPC errors we leave them on
  // the page so they can still attempt a redemption.
  if (user && (path === '/redeem-key' || path.startsWith('/redeem-key/'))) {
    const cachedExpiry = accessCache.get(user.id)
    const hasCachedAccess = cachedExpiry !== undefined && cachedExpiry > Date.now()
    if (hasCachedAccess) {
      authLog.info('auth.redeem_key_skip', { path, userId: user.id, cached: true })
      await safeFlush(authLog)
      return redirectWithCookies(new URL('/', request.url))
    }
    if (cachedExpiry !== undefined) accessCache.delete(user.id)
    try {
      const { data, error } = await supabase.rpc('current_user_has_access')
      if (!error && data === true) {
        accessCache.set(user.id, Date.now() + ACCESS_TTL_MS)
        authLog.info('auth.redeem_key_skip', { path, userId: user.id })
        await safeFlush(authLog)
        return redirectWithCookies(new URL('/', request.url))
      }
    } catch (error) {
      authLog.warn('auth.redeem_key_access_check_failed', {
        path,
        userId: user.id,
        error: errorToFields(error),
      })
    }
  }

  if (isAdminRoute && user && !isAdmin) {
    authLog.warn('auth.admin_forbidden', { path, userId: user.id })
    await safeFlush(authLog)
    return redirectWithCookies(new URL('/', request.url))
  }

  return res
}
