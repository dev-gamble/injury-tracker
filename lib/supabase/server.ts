import { createServerClient, type CookieMethodsServer } from '@/lib/supabase/ssr'
import { getPublicEnv } from "@/lib/env"
import { cookies } from 'next/headers'

export async function createClient() {
  const env = getPublicEnv()
  const cookieStore = await cookies()
  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll()
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      } catch {
        // Called from a Server Component - safe to ignore if middleware
        // is refreshing sessions.
      }
    },
  }

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: cookieMethods,
    }
  )
}
