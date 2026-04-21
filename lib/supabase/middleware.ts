import { createServerClient, type CookieMethodsServer } from '@/lib/supabase/ssr'
import { errorToFields, logger, safeFlush } from '@/lib/logging'
import { getPublicEnv } from "@/lib/env"
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication to access
const PROTECTED_PREFIXES = ['/dashboard', '/admin']
// Routes that additionally require admin role (app_metadata.role === 'admin')
const ADMIN_PREFIXES = ['/admin']

export async function updateSession(request: NextRequest, requestId?: string) {
  const env = getPublicEnv()
  let res = NextResponse.next({ request })
  const path = request.nextUrl.pathname
  const authLog = logger('auth.middleware').with(requestId ? { requestId } : {})

  const isProtected = PROTECTED_PREFIXES.some(
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

  const isAdminRoute = ADMIN_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
  if (isAdminRoute && user) {
    const role = (user.app_metadata as { role?: unknown } | null | undefined)?.role
    if (role !== 'admin') {
      authLog.warn('auth.admin_forbidden', { path, userId: user.id })
      await safeFlush(authLog)
      return redirectWithCookies(new URL('/', request.url))
    }
  }

  return res
}
