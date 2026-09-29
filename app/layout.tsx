import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import { VisitTracker } from "@/components/analytics/VisitTracker"
import "./globals.css"

// Same share card as the tracker route injects, so links to /signup,
// /subscribe, etc. preview with the logo too. metadataBase makes the image URL
// absolute, which link scrapers require. The fallback matters: statically
// prerendered pages resolve this during `docker build`, where
// NEXT_PUBLIC_SITE_URL isn't passed in (it's runtime-only on DO) — without a
// fallback Next bakes in http://localhost:3000.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://endexclaims.com"),
  title: "ENDEX",
  description: "Service Impact Index",
  openGraph: {
    type: "website",
    siteName: "ENDEX",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ENDEX logo" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <Providers>{children}</Providers>
        <VisitTracker />
      </body>
    </html>
  )
}
