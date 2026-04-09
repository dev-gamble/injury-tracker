import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InjuryTrackerApp } from "@/components/injury-tracker/InjuryTrackerApp"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return <InjuryTrackerApp />
}
