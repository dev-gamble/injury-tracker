# Base Template

Next.js 15 + Supabase starter with auth pre-wired.

**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Supabase (SSR), Axiom logging, Zod

---

## First-time machine setup

Store your shared credentials in `~/.creds` once so every project can reuse them.

```env
SUPABASE_ACCESS_TOKEN=sbp_...
SUPABASE_ORG_ID=org_...
SUPABASE_REGION=us-east-1
SUPABASE_PLAN=pro

# Optional Axiom defaults for new projects
NEXT_PUBLIC_AXIOM_TOKEN=xaat_...
NEXT_PUBLIC_AXIOM_DATASET=webapp-logs
NEXT_PUBLIC_AXIOM_LOG_LEVEL=debug
```

- Supabase access token: `https://supabase.com/dashboard/account/tokens`
- Supabase org ID: `https://supabase.com/dashboard/org/<your-slug>/general`

---

## Starting a new project

### 1. Clone and initialize

```bash
git clone <this-repo> my-app
cd my-app
bash init.sh my-app
```

`init.sh` installs dependencies and runs `db:setup`, which:
- Creates a new Supabase project via the Management API
- Waits for the project to become healthy
- Writes `.env.local` with Supabase + Axiom placeholders
- Updates `package.json` name to match your project
- Links the Supabase CLI to the new project
- Pushes migrations if any exist in `supabase/migrations/`

### 2. Fill in Supabase keys

The Supabase publishable and secret keys are not returned by the Management API.

Open your project dashboard at **Settings -> API** and copy both keys into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
SUPABASE_SECRET_KEY="sb_secret_..."
```

### 3. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Logging baseline

This template includes:
- `next-axiom` integration in [`next.config.ts`](./next.config.ts)
- Web Vitals forwarding via [`components/providers.tsx`](./components/providers.tsx)
- Logger helpers in [`lib/logging/index.ts`](./lib/logging/index.ts)
- Request ID helpers in [`lib/logging/request-id.ts`](./lib/logging/request-id.ts)
- Request/auth server logs in:
  - [`middleware.ts`](./middleware.ts)
  - [`lib/supabase/middleware.ts`](./lib/supabase/middleware.ts)
  - [`app/signout/route.ts`](./app/signout/route.ts)

Use the logger in server code:

```ts
import { logger, safeFlush } from "@/lib/logging"

const log = logger("my-feature")
log.info("event.name", { key: "value" })
await safeFlush(log)
```

If Axiom env vars are not set, logs fall back to console output.

---

## Runtime ops baseline

This template includes:
- `GET /api/health` readiness endpoint in [`app/api/health/route.ts`](./app/api/health/route.ts)
- Route-level error boundary in [`app/error.tsx`](./app/error.tsx)
- Global fatal error boundary in [`app/global-error.tsx`](./app/global-error.tsx)
- Custom 404 page in [`app/not-found.tsx`](./app/not-found.tsx)

`/api/health` returns `200` when required runtime env vars are present and `503` when required vars are missing.

---

## Validation (Zod)

This template uses Zod for:
- Environment validation in [`lib/env.ts`](./lib/env.ts)
- Runtime data validation in route handlers/server actions

Example data-validation pattern:

```ts
import { z } from "zod"

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const result = createUserSchema.safeParse(payload)
if (!result.success) {
  return { ok: false, errors: result.error.flatten() }
}

const data = result.data
```

---

## Sharing a live preview URL

To expose your local app to the internet temporarily:

```bash
# Start tunnel
./tunnel-start.sh

# Stop tunnel
./tunnel-stop.sh
```

The tunnel scripts:
- Start a localtunnel on port 3000
- Inject the generated URL into `supabase/config.toml`
- Add that URL to Supabase auth redirect allowlist using `SUPABASE_ACCESS_TOKEN` from `~/.creds`
- Reverse those changes on stop

---

## Deploying to DigitalOcean

### 1. Set up `.env.production`

```bash
cp .env.production.example .env.production
```

Fill in required Supabase values. Axiom values are optional.

### 2. Authenticate with DigitalOcean registry

```bash
doctl registry login
```

### 3. Build, tag, and push

```bash
./deploy.sh
./deploy.sh v1.0.0
```

### 4. Runtime secrets (DO App Platform)

Set these in the platform dashboard, not in `.env.production`:

| Variable | Where to get it |
|---|---|
| `SUPABASE_SECRET_KEY` | Supabase dashboard -> Settings -> API |

---

## Auth routes

| Route | Description |
|---|---|
| `/login` | Sign in with email + password |
| `/signup` | Create a new account |
| `/forgot-password` | Request a password reset email |
| `/reset-password` | Set a new password from email link |
| `/dashboard` | Protected route |
| `POST /signout` | Signs out and redirects to `/login` |
| `GET /api/health` | Readiness probe for deploy/runtime checks |

---

## Database commands

```bash
npm run db:push
npm run db:dump
npm run db:reset
npx supabase db dump --linked --data-only -f backups/data.sql
```

Add migration files to `supabase/migrations/` as `.sql`. They run in filename order.

---

## CI gate

GitHub Actions runs lint, typecheck, and build on push/PR via:
- [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

Release checklist (runtime + backup/restore + observability):
- [`docs/release-checklist.md`](./docs/release-checklist.md)

---

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` / `.env.production` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `.env.local` / `.env.production` | Supabase public API key |
| `SUPABASE_HOSTNAME` | `.env.local` / `.env.production` | Next image allowlist hostname |
| `SUPABASE_SECRET_KEY` | runtime secret | Service-role key for server-only operations |
| `SUPABASE_DB_PASSWORD` | `.env.local` | DB password for CLI operations |
| `SUPABASE_ACCESS_TOKEN` | `~/.creds` | Supabase Management API token for provisioning and tunnel scripts |
| `SUPABASE_ORG_ID` | `~/.creds` | Org ID for project provisioning |
| `SUPABASE_REGION` | `~/.creds` | Optional region override |
| `SUPABASE_PLAN` | `~/.creds` | Optional plan override (default: `pro`) |
| `NEXT_PUBLIC_AXIOM_TOKEN` | `.env.local` / `.env.production` | Axiom ingest token used by browser/server logs |
| `NEXT_PUBLIC_AXIOM_DATASET` | `.env.local` / `.env.production` | Target Axiom dataset |
| `NEXT_PUBLIC_AXIOM_LOG_LEVEL` | `.env.local` / `.env.production` | Logging threshold (`debug`, `info`, `warn`, `error`, `off`) |
