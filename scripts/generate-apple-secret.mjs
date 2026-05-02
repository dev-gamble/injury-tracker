// Generates the JWT that Supabase expects in Authentication → Providers →
// Apple → "Secret Key (for OAuth)". Apple JWTs expire after 180 days, so
// re-run this every ~5 months and paste the new token into Supabase.
//
// Usage:
//   npm i -D jsonwebtoken
//   node scripts/generate-apple-secret.mjs
//
// Required env vars (set inline or via .env.local with --env-file):
//   APPLE_TEAM_ID    Apple Team ID (top-right of developer.apple.com, 10 chars)
//   APPLE_CLIENT_ID  Services ID, e.g. com.endex.web
//   APPLE_KEY_ID     Key ID from the .p8 filename (AuthKey_<KEY_ID>.p8)
//   APPLE_KEY_PATH   Path to the .p8 file (default: ./keys/AuthKey_<KEY_ID>.p8)

import jwt from "jsonwebtoken"
import fs from "node:fs"
import path from "node:path"

const {
  APPLE_TEAM_ID,
  APPLE_CLIENT_ID,
  APPLE_KEY_ID,
  APPLE_KEY_PATH,
} = process.env

const missing = ["APPLE_TEAM_ID", "APPLE_CLIENT_ID", "APPLE_KEY_ID"].filter(
  (k) => !process.env[k],
)
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(", ")}`)
  process.exit(1)
}

const keyPath = APPLE_KEY_PATH ?? path.join("keys", `AuthKey_${APPLE_KEY_ID}.p8`)
if (!fs.existsSync(keyPath)) {
  console.error(`Private key not found at ${keyPath}`)
  console.error(`Set APPLE_KEY_PATH or place the .p8 at the default location.`)
  process.exit(1)
}

const privateKey = fs.readFileSync(keyPath)

const token = jwt.sign({}, privateKey, {
  algorithm: "ES256",
  expiresIn: "180d",
  audience: "https://appleid.apple.com",
  issuer: APPLE_TEAM_ID,
  subject: APPLE_CLIENT_ID,
  keyid: APPLE_KEY_ID,
})

console.log(token)
