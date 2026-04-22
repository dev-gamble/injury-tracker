import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { ResetPasswordForm } from "./ResetPasswordForm"

export const dynamic = "force-dynamic"

export default async function ResetPasswordPage() {
  const cookieStore = await cookies()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const marker = cookieStore.get("endex_pw_recovery")?.value
  const fromServerRecovery = !!(user && marker && marker === user.id)
  return <ResetPasswordForm fromServerRecovery={fromServerRecovery} />
}
