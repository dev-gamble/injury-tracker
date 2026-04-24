import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "ENDEX",
  description: "Service Impact Index",
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
      </body>
    </html>
  )
}
