import type { NextConfig } from "next"
import { withAxiom } from "next-axiom"

const supabaseHostname = process.env.SUPABASE_HOSTNAME || ""
const isProd = process.env.NODE_ENV === "production"
const devConnectSources = isProd
  ? ""
  : " http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*"

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co https://api.supabase.com https://api.axiom.co${devConnectSources}`,
  "object-src 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  ...(supabaseHostname && {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: supabaseHostname,
          pathname: "/storage/v1/object/public/**",
        },
      ],
    },
  }),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ]
  },
}

export default withAxiom(nextConfig)
