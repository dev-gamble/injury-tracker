import type { NextConfig } from "next"
import { withAxiom } from "next-axiom"

const supabaseHostname = process.env.SUPABASE_HOSTNAME || ""
const isProd = process.env.NODE_ENV === "production"
const devConnectSources = isProd
  ? ""
  : " http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*"

// Allow connections to the configured Supabase hostname (covers both the
// raw <project-ref>.supabase.co URL and any custom auth domain like
// auth.endexclaims.com). The wildcard *.supabase.co handles the legacy
// project-URL case; the explicit hostname is required when the host is on
// a non-supabase.co domain.
const supabaseConnectSrc = supabaseHostname ? ` https://${supabaseHostname}` : ""

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://js.stripe.com https://ajax.cloudflare.com${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' https://*.supabase.co https://api.supabase.com https://api.axiom.co https://api.stripe.com${supabaseConnectSrc}${devConnectSources}`,
  // Stripe.js renders payment elements inside iframes from these origins.
  "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
  // Form posts to Stripe hosted checkout.
  "form-action 'self' https://checkout.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Ensure client-js files are included in the standalone Docker build output.
  // Without this, fs.readFile calls in the tracker route handler get ENOENT in production.
  outputFileTracingIncludes: {
    "/[[...slug]]": ["./client-js/injury-tracker/**/*"],
  },
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
