#!/usr/bin/env tsx
/**
 * setup-db.ts - Provision a new Supabase project and write .env.local
 *
 * Required credentials (env vars or ~/.creds):
 *   SUPABASE_ACCESS_TOKEN - https://supabase.com/dashboard/account/tokens
 *   SUPABASE_ORG_ID       - https://supabase.com/dashboard/org/<slug>/general
 *
 * Optional overrides:
 *   SUPABASE_REGION=us-east-1
 *   SUPABASE_PLAN=pro
 *
 * Usage:
 *   npm run db:setup <project-name>
 *   npx tsx scripts/setup-db.ts <project-name>
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs"
import { execSync } from "child_process"
import { randomBytes } from "crypto"
import { resolve } from "path"
import { config as loadEnv } from "dotenv"

function loadGlobalCreds() {
  const home = process.env.HOME || process.env.USERPROFILE || ""
  const credsPath = resolve(home, ".creds")
  if (!existsSync(credsPath)) return

  const raw = readFileSync(credsPath)
  const isUtf16Le = raw[0] === 0xff && raw[1] === 0xfe
  const text = isUtf16Le ? raw.toString("utf16le") : raw.toString("utf8")
  const lines = text.replace(/^\uFEFF/, "").split("\n")

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const [key, ...rest] = trimmed.split("=")
    if (!key || rest.length === 0) continue

    const envKey = key.trim()
    if (process.env[envKey]) continue

    process.env[envKey] = rest.join("=").trim().replace(/^["']|["']$/g, "")
  }
}

function generatePassword(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const bytes = randomBytes(length)
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join("")
}

async function supabaseAPI<T>(
  method: string,
  path: string,
  token: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`https://api.supabase.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase API ${method} ${path} -> ${res.status}: ${text}`)
  }

  return res.json() as Promise<T>
}

async function waitForProject(ref: string, token: string): Promise<void> {
  const maxWaitMs = 5 * 60 * 1000
  const pollMs = 6000
  const startedAt = Date.now()

  process.stdout.write("Waiting for project to be ready")
  while (Date.now() - startedAt < maxWaitMs) {
    const project = await supabaseAPI<{ status: string }>("GET", `/projects/${ref}`, token)
    if (project.status === "ACTIVE_HEALTHY") {
      console.log(" [ok]")
      return
    }

    process.stdout.write(".")
    await new Promise((resolveSleep) => setTimeout(resolveSleep, pollMs))
  }

  throw new Error("Timed out waiting for Supabase project to become healthy (>5 min)")
}

function run(command: string, extraEnv?: Record<string, string>) {
  execSync(command, {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  })
}

async function main() {
  loadGlobalCreds()
  loadEnv({ path: ".env.local" })
  loadEnv({ path: ".env" })

  const projectName = process.argv[2]
  if (!projectName) {
    console.error("Usage: npx tsx scripts/setup-db.ts <project-name>")
    console.error("Example: npx tsx scripts/setup-db.ts my-app")
    process.exit(1)
  }

  const token = process.env.SUPABASE_ACCESS_TOKEN
  const orgId = process.env.SUPABASE_ORG_ID
  const region = process.env.SUPABASE_REGION || "us-east-1"
  const plan = process.env.SUPABASE_PLAN || "pro"

  const axiomToken = process.env.NEXT_PUBLIC_AXIOM_TOKEN || process.env.AXIOM_TOKEN || ""
  const axiomDataset = process.env.NEXT_PUBLIC_AXIOM_DATASET || process.env.AXIOM_DATASET || ""
  const axiomLogLevel = process.env.NEXT_PUBLIC_AXIOM_LOG_LEVEL || "debug"

  if (!token) {
    console.error([
      "",
      "  Missing: SUPABASE_ACCESS_TOKEN",
      "  Get one at: https://supabase.com/dashboard/account/tokens",
      "",
      "  Set it one of two ways:",
      "  1. Export:  export SUPABASE_ACCESS_TOKEN=sbp_xxx",
      "  2. File:    echo 'SUPABASE_ACCESS_TOKEN=sbp_xxx' >> ~/.creds",
      "",
    ].join("\n"))
    process.exit(1)
  }

  if (!orgId) {
    console.error([
      "",
      "  Missing: SUPABASE_ORG_ID",
      "  Find it at: https://supabase.com/dashboard/org/<slug>/general",
      "",
      "  Set it one of two ways:",
      "  1. Export:  export SUPABASE_ORG_ID=org_xxx",
      "  2. File:    echo 'SUPABASE_ORG_ID=org_xxx' >> ~/.creds",
      "",
    ].join("\n"))
    process.exit(1)
  }

  console.log(`\nCreating Supabase project: ${projectName} (${region})`)

  const dbPassword = generatePassword()

  const project = await supabaseAPI<{ id: string }>(
    "POST",
    "/projects",
    token,
    {
      name: projectName,
      organization_id: orgId,
      plan,
      region,
      db_pass: dbPassword,
    }
  )

  const ref = project.id
  console.log(`  Project ref: ${ref}`)

  await waitForProject(ref, token)

  const supabaseUrl = `https://${ref}.supabase.co`
  const hostname = `${ref}.supabase.co`
  const dashboardUrl = `https://supabase.com/dashboard/project/${ref}/settings/api`

  const envContent = [
    "# Supabase (public)",
    `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`,
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."',
    `SUPABASE_HOSTNAME=${hostname}`,
    "",
    "# Supabase (private - never commit)",
    'SUPABASE_SECRET_KEY="sb_secret_..."',
    `SUPABASE_DB_PASSWORD="${dbPassword}"`,
    "",
    "# Axiom logging (leave blank to use console logging in dev)",
    `NEXT_PUBLIC_AXIOM_TOKEN=${axiomToken}`,
    `NEXT_PUBLIC_AXIOM_DATASET=${axiomDataset}`,
    `NEXT_PUBLIC_AXIOM_LOG_LEVEL=${axiomLogLevel}`,
    "",
  ].join("\n")

  writeFileSync(".env.local", envContent, "utf8")
  console.log("  [ok] .env.local written")
  if (axiomToken && axiomDataset) {
    console.log("  [ok] Axiom credentials written to .env.local")
  } else {
    console.warn("  [warn] Axiom credentials not found - add NEXT_PUBLIC_AXIOM_TOKEN and NEXT_PUBLIC_AXIOM_DATASET to ~/.creds or .env.local manually")
  }

  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"))
    pkg.name = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`, "utf8")
    console.log("  [ok] package.json name updated")
  } catch {
    console.warn("  [warn] Could not update package.json name (non-fatal)")
  }

  try {
    console.log("  Linking Supabase CLI...")
    run(`npx supabase link --project-ref ${ref} --password ${dbPassword}`, {
      SUPABASE_ACCESS_TOKEN: token,
      SUPABASE_DB_PASSWORD: dbPassword,
    })
    console.log("  [ok] Supabase CLI linked")
  } catch {
    console.warn("  [warn] Could not link Supabase CLI (non-fatal - run manually)")
    console.warn(`    npx supabase link --project-ref ${ref} --password ${dbPassword}`)
  }

  let hasMigrations = false
  try {
    const migrationFiles = readdirSync("supabase/migrations").filter((file) => file.endsWith(".sql"))
    hasMigrations = migrationFiles.length > 0
  } catch {
    hasMigrations = false
  }

  if (hasMigrations) {
    try {
      console.log("  Pushing migrations...")
      run("npx supabase db push", {
        SUPABASE_ACCESS_TOKEN: token,
        SUPABASE_DB_PASSWORD: dbPassword,
      })
      console.log("  [ok] Migrations pushed")
    } catch {
      console.warn("  [warn] Could not push migrations (run `npm run db:push` manually)")
    }
  }

  console.log(`
Done! Project is ready.

  Name:       ${projectName}
  Ref:        ${ref}
  URL:        ${supabaseUrl}
  Dashboard:  https://supabase.com/dashboard/project/${ref}

Next:
  1. Copy your Publishable and Secret keys from:
     ${dashboardUrl}
  2. Paste them into .env.local
  3. npm run dev
`)
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err)
  console.error("\nError:", message)
  process.exit(1)
})

