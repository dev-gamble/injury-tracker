import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <p className="mt-4 text-gray-500">Your app starts here.</p>
      <div className="mt-8">
        {user ? (
          <form action="/signout" method="post">
            <button
              type="submit"
              className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Sign out
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Sign in
          </Link>
        )}
      </div>
    </main>
  )
}
