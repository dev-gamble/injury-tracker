import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Signed in as {user.email}</p>
        </div>

        <div className="border rounded-lg p-6 space-y-3 bg-gray-50">
          <h2 className="font-semibold text-lg">ENDEX — Service Impact Index</h2>
          <p className="text-sm text-gray-600">
            Document service-connected injuries and build your VA claim.
          </p>
          <Link
            href="/dashboard/tracker/"
            className="inline-block mt-1 rounded bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            Open Tracker
          </Link>
        </div>

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
