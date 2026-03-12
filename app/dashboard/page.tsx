import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Signed in as {user.email}</p>
        <form action="/signout" method="post">
          <button
            type="submit"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
