# ENDEX Developer Guide

How to run, change, and deploy this codebase. For the business/transfer
inventory, see [technical-overview.md](./technical-overview.md).

## The two halves of the codebase

ENDEX is one deployable app with two distinct codebases inside it:

- **The Next.js shell** (`app/`, `components/`, `lib/`) — TypeScript/React.
  Handles auth, admin console, license keys, subscriptions, analytics, and
  serving the tracker.
- **The tracker** (`client-js/injury-tracker/`) — plain JavaScript/HTML/CSS.
  The actual claim-tracking product: body map, timeline, rating calculator,
  statement builder. **There is no build step**: `index.html` loads the files
  in `js/` directly, and the server serves them from disk as-is.

The seam between them is `app/[[...slug]]/route.ts`, which serves the tracker
and injects server state into it (see below). Understand that route before
touching either side of the seam.

## Local setup

Prerequisites: Node 22, npm, Docker (for deploys), Supabase CLI (installed as
a dev dependency).

1. `npm install`
2. Create `.env.local` from `.env.example`. For the existing production
   project, fill values from the Supabase and Stripe dashboards (Supabase:
   Settings → API). `npm run db:setup` is only for provisioning a brand-new
   Supabase project — don't run it against an existing one.
3. `npm run dev` → http://localhost:3000 serves the tracker; `/login`,
   `/dashboard`, `/admin` etc. are the shell.

For a fully local database: `npx supabase start` (ports are offset to the
544xx range — see `supabase/config.toml`), then point `.env.local` at it.
Local auth emails land in Inbucket at port 54424.

Checks: `npm run lint`, `npm run typecheck`, `npm run test:tracker`,
`npm run build`. CI runs the first, second, and fourth on every push/PR — it
does **not** run the tracker tests, so run them yourself.

## How the tracker is served (the injection contract)

`app/[[...slug]]/route.ts` handles every path not claimed by another route:

- Resolves the path under `client-js/injury-tracker/` with a path-traversal
  guard, an extension allowlist (`.html`, `.js`, `.css` only), and an HTML
  allowlist (`index.html`, `how-to-use-infographic.html` only). New tracker
  pages must be added to `ALLOWED_HTML_FILES` or they 404.
- For HTML, it injects before serving:
  - `<base href="/">` and the favicon into `<head>`;
  - the sign-in button or signed-in identity block (email + badge: ADMIN /
    group name / SUBSCRIBED / EARLY ACCESS / redeem-key CTA) at
    `<!--AUTH_BUTTON_START--> ... <!--AUTH_BUTTON_END-->`;
  - `window.__endexAccess = {hasAccess, isLoggedIn}` at
    `<!--ACCESS_STATE_START--> ... <!--ACCESS_STATE_END-->` — the tracker's
    `access-gate.js` reads this to lock/unlock premium features;
  - a visit-tracking pixel that POSTs to `/api/analytics/track`.

**Rules that follow from this:**

- Never remove or reformat the comment anchors in `index.html`. Injection is
  regex-replacement; if an anchor is missing the route serves the page
  without auth UI and nothing errors. After any tracker refactor, load the
  served page (not the raw file) and confirm the sign-in/identity block and
  `window.__endexAccess` are present.
- The access gate is UI-only. All tracker code and data ship to every
  browser; never put secrets or genuinely restricted content in the tracker.
- `next.config.ts` has `outputFileTracingIncludes` pulling
  `client-js/injury-tracker/**` into the standalone Docker output. Without
  it, the route gets ENOENT in production while working fine in dev.

## Editing the tracker

- One file per feature area in `client-js/injury-tracker/js/`: `map.js`,
  `bodypart.js`, `timeline.js`, `rating.js`, `secondary.js`, `special.js`,
  `statement.js`, `save.js` / `export.js` / `import.js` (encrypted
  `.endexclaim` save/load), `access-gate.js` (premium gating), `data.js`
  (static VA rating/reference data — maintained by hand when regulations
  change).
- State lives in browser memory; `.endexclaim` files are AES-256-GCM
  encrypted with a PBKDF2-derived key. Nothing persists server-side.
- Tests: `npm run test:tracker` (runner in `tests/run-tests.mjs`).
- Changes take effect on the next request in dev (files are read from disk
  per request); production requires a redeploy.

## The Next.js shell

- **Auth pages** (`app/login`, `signup`, `forgot-password`, `reset-password`,
  `resend-confirmation`, `auth/callback`, `auth/confirm`): thin UI over
  Supabase Auth. Emails are sent by Supabase (MailerSend SMTP configured in
  the Supabase dashboard — not in this repo). OAuth setup:
  [oauth-setup.md](./oauth-setup.md).
- **Middleware** (`middleware.ts` + `lib/supabase/middleware.ts`): session
  refresh, request-ID logging, protected-route redirects.
- **Access model**: a user gets access via admin role, a redeemed license
  key (hashed keys + groups in Postgres), an active Stripe subscription, or
  the current free early-access grant. The database RPCs
  `current_user_has_access()`, `current_user_group()`, and
  `current_user_is_subscribed()` are the single source of truth — call them
  rather than re-deriving entitlement.
- **Admin console** (`app/admin/`, server actions in `actions.ts`): license
  key create/assign/revoke, subscription and revenue panels, visit
  analytics. Grant admin with `npm run make-admin`.
- **Logging**: `logger()` from `lib/logging` (Axiom when configured, console
  otherwise). Include request IDs; call `safeFlush` in route handlers.

## Database

- Schema changes are SQL migrations in `supabase/migrations/`, applied in
  filename order (`YYYYMMDDHHMMSS_name.sql`). Workflow: write the migration,
  `npm run db:push` to apply, `npm run db:dump` to refresh
  `supabase/schema.sql`, commit both.
- Main tables: license keys/assignments/groups, `stripe_user_subscriptions`
  (webhook-maintained mirror), `visit_events` (service-role-only; cron jobs
  anonymize after 14 days, delete after 180).
- RLS is enabled throughout; the server uses the secret key via
  `lib/supabase/admin.ts` where it must bypass it. Never expose the admin
  client's data to unauthenticated paths.

## Stripe

- Routes: `app/api/stripe/checkout` (creates Checkout sessions),
  `portal` (billing portal), `webhook` (mirrors subscription lifecycle +
  discount events into the DB; signature-verified; needs the raw body, so
  don't add body parsing).
- The app reads only `STRIPE_RESTRICTED_KEY` (checkout/portal/customer
  write, subscription/price read — no refund/charge capability).
  `STRIPE_SECRET_KEY` in `.env.example` is unused by the app.
- Local webhook testing: `stripe listen --forward-to
  localhost:3000/api/stripe/webhook` and put the printed `whsec_...` in
  `.env.local`.
- **Current state**: the `free_tier_early_access` migration grants access to
  all authenticated users, and checkout short-circuits for users who already
  have access — so new paid checkout is effectively disabled until that
  override is removed. Test the full checkout flow in Stripe test mode
  before re-enabling paid gating.

## Deploy

1. `.env.production` from `.env.production.example` (plus `IMAGE_NAME`,
   `DO_REGISTRY`); `doctl registry login`.
2. `./deploy.sh [tag]` — builds the multi-stage Docker image (Next
   standalone, non-root, port 3000) and pushes to the DigitalOcean registry;
   App Platform deploys it.
3. Runtime secrets (`SUPABASE_SECRET_KEY`, Stripe keys, `NEXT_PUBLIC_SITE_URL`)
   are set in the DO dashboard, never in the image.
4. Verify with `GET /api/health` (200 = required env present) and
   [release-checklist.md](./release-checklist.md).

`NEXT_PUBLIC_*` values are inlined at **build** time — changing them means
rebuilding the image, not just editing dashboard env vars.

## Gotchas

- Missing injection anchors fail silently (see above) — verify the served
  page after tracker changes.
- CI doesn't run `test:tracker`.
- `NEXT_PUBLIC_SITE_URL` must be set in production (absolute URLs for Stripe
  redirects and the analytics same-origin check); behind DO's proxy,
  `request.nextUrl.origin` is the internal address.
- CSP is strict (`next.config.ts`). New external scripts/styles/connections
  need a CSP entry or they're silently blocked.
- If Apple Sign-In is enabled with a manually minted client secret, the JWT
  expires after 6 months — re-mint with `scripts/generate-apple-secret.mjs`.
- Local Supabase uses 544xx ports, not the default 543xx.
