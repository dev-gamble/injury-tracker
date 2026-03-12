import * as SupabaseSSR from "@supabase/ssr"
import type { CookieMethodsServer } from "@supabase/ssr"

type CreateServerClientModern = (
  supabaseUrl: string,
  supabaseKey: string,
  options: {
    cookies: CookieMethodsServer
    cookieEncoding?: "raw" | "base64url"
  }
) => ReturnType<typeof SupabaseSSR.createServerClient>

// @supabase/ssr@0.6.x marks an overload as deprecated; this wrapper pins
// usage to the modern getAll/setAll cookie API shape used by this template.
export const createServerClient =
  SupabaseSSR.createServerClient as unknown as CreateServerClientModern

export type { CookieMethodsServer }
