import { createServerClient, type CookieMethodsServer } from '@/lib/supabase/ssr'
import { errorToFields, logger, safeFlush } from '@/lib/logging'
import { getPublicEnv } from "@/lib/env"
import { NextResponse, type NextRequest } from 'next/server'

// Add any paths that should require authentication
const PROTECTED_PREFIXES = ['/dashboard']

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
  let hasUser = false
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    hasUser = Boolean(currentUser)
  } catch (error) {
    authLog.error('auth.user_fetch_failed', {
      path,
      error: errorToFields(error),
    })
    await safeFlush(authLog)
    throw error
  }

  if (isProtected && !hasUser) {
    authLog.info('auth.redirect_login', {
      path,
      redirectTo: '/login',
    })
    await safeFlush(authLog)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return res
}
