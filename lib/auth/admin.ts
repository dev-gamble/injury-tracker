import type { User } from "@supabase/supabase-js"

export function isAdmin(user: Pick<User, "app_metadata"> | null | undefined): boolean {
  if (!user) return false
  const role = (user.app_metadata as { role?: unknown } | null | undefined)?.role
  return role === "admin"
}
