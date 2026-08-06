# ENDEX — Technical Overview and Code-Transfer Inventory

Developer documentation — setup, architecture, and operational workflows for
maintainers — is in [developer-guide.md](./developer-guide.md).

Facts below are verified in the source repository unless marked **to confirm**,
which means they must be evidenced from the live vendor accounts (ownership,
plans, invoices, production settings, incident history).

## One-page technical inventory

| Area | Answer |
|---|---|
| **Front end** | Plain JavaScript/HTML/CSS claim tracker under `client-js/injury-tracker/`, served through Next.js, which injects login, access, billing, and visit-tracking state at HTML comment anchors (`<!--AUTH_BUTTON_START-->`, `<!--ACCESS_STATE_START-->`). Removing the anchors silently breaks the account/access UI. The feature gate is UI-only, not a security boundary. Claim data lives in browser memory only — never in `localStorage` or the database. Users save work as password-encrypted `.endexclaim` files (AES-256-GCM, PBKDF2); the operator cannot recover a lost password or file. Unsaved work is lost on refresh/sign-out. |
| **Back end** | Next.js 15 App Router, React 19, TypeScript 5, Node.js 22. Provides auth pages, admin tools, license/access logic, analytics, Stripe routes, and the tracker wrapper. Multi-stage Dockerfile produces a non-root standalone container on port 3000. |
| **Database** | Supabase-managed PostgreSQL (config targets v17; live version **to confirm**) + Supabase Auth. Stores auth users, hashed license keys/assignments, Stripe subscription metadata, admin roles, and visit analytics. Claim/medical data and `.endexclaim` contents are never sent to or stored by the server. |
| **Hosting** | DigitalOcean App Platform + Container Registry (`registry.digitalocean.com/cgweblab-prod`, image `va-claim-tool`), on Cory's personal account. No App Spec/IaC in the repo — export region, instance size, health checks, domains, and env settings from the live dashboard. DO cannot move an App Platform app between teams; the buyer recreates it or deploys the image elsewhere. |
| **Domain / DNS** | Production references `endexclaims.com` / `veterans@endexclaims.com` (`endex.app` in the OAuth guide is an old example). Registrar, DNS host, and renewal date are **to confirm** — do not state "Bluehost" without account evidence. Transfer the domain, DNS zone, TLS settings, and the mailbox/sending domain. |
| **Email** | Supabase Auth sends confirmation/reset email via MailerSend custom SMTP, configured in the Supabase dashboard (not in code). Buyer must receive or recreate the MailerSend account, SMTP credentials, and SPF/DKIM/DMARC records. No other mailer exists. |
| **Analytics / logs** | Visit events in Supabase: IP, user agent, path, referrer, approximate location, signed-in user ID. Migrations define cron jobs that anonymize identifiers after 14 days and delete visits after 180 days (**confirm they run in production**). GeoIP falls back to `ip-api.com` over HTTP. Optional Axiom receives operational logs (user/Stripe IDs, paths, stacks — no claim contents by design). |
| **Payments** | Stripe-hosted Checkout and Billing Portal; card data never enters the app. Webhooks mirror subscription state into Supabase. **Current state: an early-access migration grants access to all authenticated users, so new paid checkout is blocked.** Re-enable paid gating and pass Stripe test-mode checks before describing subscriptions as live. The app uses a restricted Stripe key (no refund/charge/payout capability). |
| **External connections** | Supabase, Stripe, optional Axiom, `ip-api.com`, Google Fonts, Google/Apple OAuth if enabled, MailerSend (via Supabase). No VA API, AI API, or ad network. VA rating logic ships as static JavaScript data and must be maintained by hand when regulations change. |
| **Libraries** | Production: Next.js, React, Supabase JS/SSR, Stripe SDK, Zod, next-axiom, lucide-react — all permissively licensed; versions locked in `package-lock.json`. No direct GPL dependency. No SBOM or license report exists yet; generate one for the accepted commit if counsel requires it. |
| **Portability** | Yes — the container runs on any Docker-capable platform and all data can move to buyer-controlled services. Not one-click: Supabase, Stripe, DNS/email, OAuth, and secrets must move in a controlled sequence (see transfer plan). Shared static hosting is insufficient. |
| **Backups** | Schema versioned in migrations + `supabase/schema.sql`; `npm run db:dump` for schema, release checklist covers data dumps. Supabase Pro provides managed daily backups (7-day retention) — live plan and last successful restore **to confirm**. No scheduled off-site backup exists. Users hold their own encrypted claim files. |
| **Maintainability** | A full-stack developer familiar with Next.js/TypeScript, PostgreSQL, and Stripe can maintain it. Verified 2026-08-06: 27/27 tracker tests, typecheck, and production build pass; ESLint 0 errors. CI runs lint/typecheck/build (not the tracker tests). No incident/uptime history exists in the repo — breakage frequency requires operator records. |

## AI assistance disclosure

**Anthropic Claude Code** and **OpenAI Codex** assisted with infrastructure
code, configuration, implementation, and technical documentation (including
this inventory). CG Web Lab LLC conceived and controlled the product — its
workflow, claim/rating logic, rules, architecture, testing, and final
implementation — and represents that it owns the original expression it
created or validly acquired, subject to the open-source and third-party items
below. AI output was selected, reviewed, tested, and modified by developers,
not accepted autonomously.

**ENDEX itself uses no AI at runtime.** No AI SDK, endpoint, credential, or
call exists in the code; claim data is never sent to an AI provider. It is a
rules-based educational tool and does not evaluate or decide veterans' claims.

## Third-party materials requiring documentation

Open-source packages and Google Fonts (SIL OFL) transfer under their own
licenses — retain notices via a dependency/license report. Items needing
seller evidence:

- **Body-map images** (4 PNGs, metadata shows Adobe Express): confirm whether
  original, stock, or AI-generated; supply source files and licenses, or
  replace them.
- **DEAD Systems contribution** (original tracker code/content): provide the
  executed assignment or license covering the buyer's continued use.
- **Branding, icons, written guidance**: identify creators; provide
  assignments or work-for-hire agreements for all contributors, or certify
  none exist beyond disclosed parties.
- **VA/CFR material**: government text (38 CFR Part 4) is not copyrightable,
  but keep a citation/version register and update when the law changes. The
  external source `VA Thing/extracted-eval.txt` referenced by
  `BODY-PART-EVALUATION-PROMPT.md` must be located and identified.
- Google/Apple sign-in marks: usable only with those services under provider
  brand rules.

## Operating cost

List prices as of 2026-08-06 for budgeting; obtain the last three invoices and
confirm actuals before closing.

| Service | List price | Actual |
|---|---:|---|
| Supabase Pro | $25/mo + usage | to confirm |
| DO App Platform | $5–12/mo | to confirm |
| DO Container Registry | $0–5/mo | to confirm |
| MailerSend | Free tier; $7/mo Hobby | to confirm |
| Axiom | Free personal; $25/mo Cloud | to confirm |
| Stripe | 2.9% + $0.30/transaction, no fixed fee | to confirm |
| Domain | annual, registrar-specific | to confirm |
| Apple Developer (if Apple Sign-In kept) | $99/yr | to confirm |

Baseline roughly **$30–50/month** before Stripe fees and annual renewals.

## Configuration to hand off

Transfer secret **values** through a buyer-controlled vault — never email or
Git. `NEXT_PUBLIC_*` values are baked into the image; changing them requires a
rebuild.

| Scope | Configuration |
|---|---|
| Docker build | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_HOSTNAME`; optional Axiom vars |
| Runtime | `SUPABASE_SECRET_KEY`, `STRIPE_RESTRICTED_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_MONTHLY/ANNUAL`, `NEXT_PUBLIC_SITE_URL` |
| Deploy tooling | `IMAGE_NAME`, `DO_REGISTRY`, DO auth, Node 22, Docker |
| DB administration | Supabase project ref, `SUPABASE_DB_PASSWORD`, CLI token, org ID |
| Vendor dashboards | Stripe products/keys/webhooks/portal; Supabase Auth URLs/providers/templates/SMTP; Google/Apple OAuth; MailerSend domain; Axiom; DNS |

Notes: the app reads only the restricted Stripe key — `STRIPE_SECRET_KEY` in
`.env.example` is unused and should not be transferred. `NEXT_PUBLIC_SITE_URL`
is required in production but missing from `.env.production.example`; fix
during handoff. Deliver source via Git or a clean archive, never by copying
the working directory (it contains live ignored env files).

## Transfer plan

1. **Freeze the deliverable**: tag the accepted commit; include Git history,
   lockfile, migrations, assets, and this document.
2. **Establish buyer-owned admin access** on every vendor account before
   changing anything; collect owner/plan/billing evidence.
3. **Back up first**: schema + data dumps, and rehearse a restore into a
   non-production project.
4. **Transfer the Supabase project** between organizations
   ([supported](https://supabase.com/docs/guides/platform/project-transfer)) —
   this preserves auth users, data, and configuration. Re-verify SMTP, auth
   redirects, OAuth, and cron jobs afterward.
5. **Recreate hosting**: export the live App Spec/settings, push the image to
   a buyer-owned registry, recreate the app in the buyer's DO team (apps
   cannot be moved between teams). Keep the old app until validation passes.
6. **Choose the Stripe path before cutover**: transfer the account, or use
   [Stripe's data migration](https://docs.stripe.com/get-started/data-migrations/overview)
   to a new one — a key swap alone does not move existing customers or
   subscriptions.
7. **Transfer the domain**: DNS zone, TLS, support mailbox, and re-point
   Supabase auth URLs, Stripe webhooks, MailerSend SPF/DKIM/DMARC, and OAuth
   return URLs.
8. **Transfer the GitHub repo** (with branch protection/Actions) and any
   Axiom dashboards.
9. **Rotate every secret and revoke seller access** after the buyer passes
   acceptance tests; rebuild the image where public values changed.

## Acceptance tests

- [ ] Clean clone passes `npm ci`, lint, typecheck, `test:tracker`, and build
  on Node 22; buyer can deploy and `/api/health` returns 200.
- [ ] Signup, confirmation, login, logout, password reset, and resend work;
  Google/Apple sign-in work if transferred.
- [ ] `.endexclaim` save/restore works; wrong password fails safely.
- [ ] Admin access and license create/assign/redeem/revoke work.
- [ ] Analytics records visits; 14-day anonymization and 180-day deletion
  jobs run in production.
- [ ] If launching paid access: remove the early-access override and verify
  Stripe test-mode checkout, webhooks, portal, and access grant/revocation.
- [ ] DNS, TLS, SPF/DKIM/DMARC, auth redirects, and webhooks pass after
  domain cutover.
- [ ] Buyer completes and records a database restore rehearsal.

## Open items requiring seller evidence

- [ ] Legal owner and admin users for each vendor account (DO, Supabase,
  Stripe, GitHub, MailerSend, Axiom, Apple, Google, registrar) with invoices,
  plans, and the DO App Spec.
- [ ] Confirm the production domain and registrar.
- [ ] Confirm which optional services (MailerSend, OAuth providers, Axiom,
  analytics cron jobs) are actually enabled in production.
- [ ] Signed AI-use certification (tools, accounts, settings, degree of
  review; whether sessions included personal/health data, secrets, or
  third-party confidential material) and the Copilot-trailer clarification.
- [ ] Provenance for body-map images, branding, and written content; DEAD
  Systems agreement; contributor/assignment register; source of the
  `app-template` scaffold; `extracted-eval.txt`.
- [ ] Live Supabase plan, PostgreSQL version, backup status, and last
  successful restore.
- [ ] 12 months of outage/defect/support/maintenance history.
- [ ] Decision on the early-access override (keep, or date and test the
  migration restoring paid gating).
- [ ] SBOM / third-party license report for the accepted commit; add a root
  LICENSE if appropriate; update the generic README and
  `.env.production.example`.

## Expected maintenance

No fixed schedule. Ongoing work: npm/framework security updates,
Supabase/Stripe platform changes, backup and restore checks, vendor/domain
renewals, and periodic review of the VA rating data embedded in the tracker.
If the Apple OAuth client secret is manually minted, renew its JWT before the
six-month expiry. Failure-rate figures require the operator's incident
records, not repository inference.
