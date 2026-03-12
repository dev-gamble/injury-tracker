'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getPublicEnv } from "@/lib/env"

const env = getPublicEnv()

export const supabase = createBrowserClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
