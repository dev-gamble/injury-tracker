"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Unhandled route error", error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-4 rounded border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-gray-600">
          An unexpected error occurred while rendering this page.
        </p>
        {error.digest ? (
          <p className="text-xs text-gray-500">Error digest: {error.digest}</p>
        ) : null}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
