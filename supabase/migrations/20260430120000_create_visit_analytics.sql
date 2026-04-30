-- Lightweight visitor analytics.
--
-- One row per page-visit "event". Geo-enrichment fields are nullable because
-- the GeoIP lookup is a best-effort hop to a free public service (ip-api.com)
-- with a tight timeout — we never want a missed lookup to break recording.
--
-- Access model: service-role-only. The /api/analytics/track route writes
-- through the admin client, and the admin Analytics panel reads through the
-- admin client. Nothing here is exposed to anon or authenticated.

create extension if not exists pgcrypto;

create table public.visit_events (
  id            uuid          primary key default gen_random_uuid(),
  ip_address    inet          not null,
  user_agent    text,
  path          text          not null,
  referrer      text,
  country_code  text,
  country_name  text,
  region        text,
  city          text,
  latitude      double precision,
  longitude     double precision,
  user_id       uuid          references auth.users(id) on delete set null,
  created_at    timestamptz   not null default now()
);

-- Time-series scans (recent visits, daily buckets) hit created_at hardest.
create index visit_events_created_at_idx on public.visit_events (created_at desc);
-- "Top IPs" + dedupe lookups by IP.
create index visit_events_ip_idx         on public.visit_events (ip_address);
-- Country leaderboard aggregates.
create index visit_events_country_idx    on public.visit_events (country_code);
-- Per-path breakdown.
create index visit_events_path_idx       on public.visit_events (path);

alter table public.visit_events enable row level security;

-- Service role bypasses RLS; no policies for anon/authenticated. The table is
-- write-only to the API route and read-only to the admin panel, both of which
-- run server-side with the secret key.
revoke all on public.visit_events from anon, authenticated;
