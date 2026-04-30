-- Visit analytics: SQL-side aggregations + retention.
--
-- The first cut of the admin Analytics tab pulled raw rows and aggregated in
-- TypeScript, which silently capped the panel at the most recent 5000 visits.
-- This migration moves the aggregations into Postgres so the dashboard always
-- reflects the full 30-day window regardless of volume, and adds:
--   * an IP-truncation routine (last octet → 0 / last 80 bits → 0) for old rows
--   * a retention prune that drops rows older than the cutoff
-- Both privacy routines are designed to be called from a daily Postgres cron
-- (or pg_cron) once configured; they're idempotent and cheap.

-- ---------------------------------------------------------------------------
-- get_visit_summary(window_days int): one-row roll-up for the stat tiles.
-- ---------------------------------------------------------------------------

-- The window across all aggregates is "the last `window_days` calendar days
-- including today, anchored at midnight UTC." Using the same calendar-day
-- basis everywhere means the chart's leftmost bucket and the summary's
-- "Visits · 30D" tile cover identical row sets; a rolling `now() - N days`
-- would silently shed the first partial day from one but not the other.

create or replace function public.get_visit_summary(window_days int default 30)
returns table (
  total_count       bigint,
  window_count      bigint,
  unique_ips        bigint,
  last_24h          bigint,
  prev_24h          bigint,
  top_country_code  text,
  top_country_count bigint
)
language sql
security definer
set search_path = public, pg_temp
as $$
  with windowed as (
    select * from public.visit_events
    where created_at >= date_trunc('day', now()) - make_interval(days => window_days - 1)
  ),
  top_country as (
    select country_code, count(*)::bigint as c
    from windowed
    where country_code is not null
    group by country_code
    order by c desc
    limit 1
  )
  select
    (select count(*)::bigint from public.visit_events) as total_count,
    (select count(*)::bigint from windowed) as window_count,
    (select count(distinct ip_address)::bigint from windowed) as unique_ips,
    (select count(*)::bigint from public.visit_events where created_at >= now() - interval '1 day') as last_24h,
    (select count(*)::bigint from public.visit_events where created_at >= now() - interval '2 days' and created_at < now() - interval '1 day') as prev_24h,
    (select country_code from top_country) as top_country_code,
    coalesce((select c from top_country), 0)::bigint as top_country_count;
$$;

revoke all on function public.get_visit_summary(int) from public, anon, authenticated;
grant execute on function public.get_visit_summary(int) to service_role;

-- ---------------------------------------------------------------------------
-- get_visit_daily_series: daily visit + unique-IP buckets across the window.
-- Returns one row per day, gaps included (LEFT JOIN on a generated date axis).
-- ---------------------------------------------------------------------------

create or replace function public.get_visit_daily_series(window_days int default 30)
returns table (
  bucket_start  timestamptz,
  visits        bigint,
  uniques       bigint
)
language sql
security definer
set search_path = public, pg_temp
as $$
  with axis as (
    select generate_series(
      date_trunc('day', now()) - make_interval(days => window_days - 1),
      date_trunc('day', now()),
      interval '1 day'
    ) as day
  ),
  buckets as (
    select
      date_trunc('day', created_at)            as day,
      count(*)::bigint                         as visits,
      count(distinct ip_address)::bigint       as uniques
    from public.visit_events
    where created_at >= date_trunc('day', now()) - make_interval(days => window_days - 1)
    group by 1
  )
  select
    a.day                            as bucket_start,
    coalesce(b.visits, 0)::bigint    as visits,
    coalesce(b.uniques, 0)::bigint   as uniques
  from axis a
  left join buckets b on b.day = a.day
  order by a.day;
$$;

revoke all on function public.get_visit_daily_series(int) from public, anon, authenticated;
grant execute on function public.get_visit_daily_series(int) to service_role;

-- ---------------------------------------------------------------------------
-- get_visit_top_countries: full-window country leaderboard.
-- ---------------------------------------------------------------------------

create or replace function public.get_visit_top_countries(window_days int default 30, row_limit int default 12)
returns table (
  country_code  text,
  country_name  text,
  count         bigint
)
language sql
security definer
set search_path = public, pg_temp
as $$
  select
    coalesce(country_code, '—') as country_code,
    coalesce(max(country_name), '—') as country_name,
    count(*)::bigint as count
  from public.visit_events
  where created_at >= date_trunc('day', now()) - make_interval(days => window_days - 1)
  group by 1
  order by count desc
  limit greatest(1, row_limit);
$$;

revoke all on function public.get_visit_top_countries(int, int) from public, anon, authenticated;
grant execute on function public.get_visit_top_countries(int, int) to service_role;

-- ---------------------------------------------------------------------------
-- get_visit_top_paths: full-window path leaderboard.
-- ---------------------------------------------------------------------------

create or replace function public.get_visit_top_paths(window_days int default 30, row_limit int default 12)
returns table (
  path  text,
  count bigint
)
language sql
security definer
set search_path = public, pg_temp
as $$
  select path, count(*)::bigint as count
  from public.visit_events
  where created_at >= date_trunc('day', now()) - make_interval(days => window_days - 1)
  group by path
  order by count desc
  limit greatest(1, row_limit);
$$;

revoke all on function public.get_visit_top_paths(int, int) from public, anon, authenticated;
grant execute on function public.get_visit_top_paths(int, int) to service_role;

-- ---------------------------------------------------------------------------
-- get_visit_top_ips: full-window IP leaderboard with last-seen + geo hint.
-- ---------------------------------------------------------------------------

create or replace function public.get_visit_top_ips(window_days int default 30, row_limit int default 25)
returns table (
  ip_address    inet,
  count         bigint,
  last_seen     timestamptz,
  country_code  text,
  city          text
)
language sql
security definer
set search_path = public, pg_temp
as $$
  with by_ip as (
    select
      ip_address,
      count(*)::bigint as count,
      max(created_at)  as last_seen
    from public.visit_events
    where created_at >= date_trunc('day', now()) - make_interval(days => window_days - 1)
    group by ip_address
    order by count desc
    limit greatest(1, row_limit)
  )
  select
    b.ip_address,
    b.count,
    b.last_seen,
    -- Pick the most recent geo we observed for this IP — the lookup may have
    -- been NULL on early hits and resolved later by the after-task.
    (
      select country_code from public.visit_events ve
      where ve.ip_address = b.ip_address and ve.country_code is not null
      order by ve.created_at desc limit 1
    ) as country_code,
    (
      select city from public.visit_events ve
      where ve.ip_address = b.ip_address and ve.city is not null
      order by ve.created_at desc limit 1
    ) as city
  from by_ip b
  order by b.count desc;
$$;

revoke all on function public.get_visit_top_ips(int, int) from public, anon, authenticated;
grant execute on function public.get_visit_top_ips(int, int) to service_role;

-- ---------------------------------------------------------------------------
-- Retention + anonymization.
--
-- Default policy:
--   * Visits older than 14 days have their IP truncated (IPv4 → /24, IPv6 → /48)
--     and user_agent dropped. Geo + path + counts stay intact.
--   * Visits older than 180 days are deleted outright.
-- Both numbers are arguments so an operator can tune them without re-deploying.
-- ---------------------------------------------------------------------------

create or replace function public.anonymize_visit_events(anonymize_after_days int default 14)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected integer;
begin
  -- Anonymization intent: an old row should not be linkable back to a person.
  -- That means we strip *every* identifier — IP truncated, UA dropped, and
  -- user_id nulled. Aggregation fields (path, country, timestamps) stay so
  -- the dashboard's window-spanning charts remain accurate after the cutoff.
  update public.visit_events
     set ip_address = case
                        when family(ip_address) = 4 then set_masklen(ip_address, 24)::cidr::inet
                        else set_masklen(ip_address, 48)::cidr::inet
                      end,
         user_agent = null,
         user_id    = null
   where created_at < now() - make_interval(days => anonymize_after_days)
     and (
       (family(ip_address) = 4 and masklen(ip_address) = 32) or
       (family(ip_address) = 6 and masklen(ip_address) = 128) or
       user_agent is not null or
       user_id is not null
     );
  get diagnostics affected = row_count;
  return affected;
end;
$$;

revoke all on function public.anonymize_visit_events(int) from public, anon, authenticated;
grant execute on function public.anonymize_visit_events(int) to service_role;

create or replace function public.prune_visit_events(retain_days int default 180)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected integer;
begin
  delete from public.visit_events
   where created_at < now() - make_interval(days => retain_days);
  get diagnostics affected = row_count;
  return affected;
end;
$$;

revoke all on function public.prune_visit_events(int) from public, anon, authenticated;
grant execute on function public.prune_visit_events(int) to service_role;

-- ---------------------------------------------------------------------------
-- pg_cron schedule: actually enforce retention.
--
-- Supabase ships pg_cron preinstalled but it must be enabled before scheduling
-- jobs. We enable it here (idempotent) and register two daily jobs:
--   * 03:10 UTC — anonymize rows older than 14 days
--   * 03:20 UTC — prune rows older than 180 days
-- The unschedule-then-schedule pattern keeps the migration idempotent: a
-- re-run replaces the existing job rather than failing on duplicate name.
-- ---------------------------------------------------------------------------

create extension if not exists pg_cron with schema extensions;

do $$
declare
  job_id bigint;
begin
  -- Drop any prior incarnations so a re-run lands a single, fresh schedule.
  for job_id in
    select jobid from cron.job
     where jobname in ('anonymize_visit_events_daily', 'prune_visit_events_daily')
  loop
    perform cron.unschedule(job_id);
  end loop;

  perform cron.schedule(
    'anonymize_visit_events_daily',
    '10 3 * * *',
    $cron$ select public.anonymize_visit_events(14); $cron$
  );

  perform cron.schedule(
    'prune_visit_events_daily',
    '20 3 * * *',
    $cron$ select public.prune_visit_events(180); $cron$
  );
end
$$;
