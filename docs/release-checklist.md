# Release Checklist

Use this checklist before shipping a new project from this template.

## 1) Quality gate

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## 2) Runtime readiness

- Confirm `.env.production` is populated from `.env.production.example`.
- Confirm runtime secret `SUPABASE_SECRET_KEY` is set in your host (not in git).
- Hit `GET /api/health` in the deployed environment and verify `status: "ok"`.
- Confirm `x-request-id` is present on responses (including auth routes).

## 3) Security baseline

- Verify CSP/security headers are present in responses.
- Verify protected routes redirect anonymous users to `/login`.
- Verify password reset flow works end-to-end.

## 4) Database safety

- Ensure migrations are committed in `supabase/migrations/`.
- Create a schema snapshot:
  - `npm run db:dump`
- Create a data backup:
  - `npx supabase db dump --linked --data-only -f backups/data.sql`
- Rehearse restore into a non-production environment before release.

## 5) Observability

- Confirm Axiom vars are set for hosted logging, or intentionally left unset for console-only logs.
- Confirm request/auth/signout logs are visible and include request IDs.
