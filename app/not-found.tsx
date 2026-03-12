import Link from "next/link"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-4 rounded border border-gray-200 bg-white p-6 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-gray-600">
          The page you requested does not exist or has moved.
        </p>
        <Link
          href="/"
          className="inline-flex rounded bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
