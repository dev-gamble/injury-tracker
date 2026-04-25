-- Replace the four-value `tier` enum on license_keys with a free-form
-- `group_name` text + a `group_color` hex. Groups are purely organizational
-- now: any active, non-expired key grants full access regardless of label.
--
-- Existing rows are preserved verbatim — tier values 'demo'/'free'/'full'/
-- 'partner' carry over as the literal group_name string, and we backfill
-- group_color so the registry looks visually identical post-migration.

-- ---------------------------------------------------------------------------
-- Drop dependents that reference license_keys.tier so we can detype the column
-- ---------------------------------------------------------------------------

drop view if exists public.user_access;
drop function if exists public.current_user_tier();

-- ---------------------------------------------------------------------------
-- license_keys: rename tier -> group_name, drop the enum, add group_color
-- ---------------------------------------------------------------------------

alter table public.license_keys
  rename column tier to group_name;

alter table public.license_keys
  alter column group_name type text using group_name::text;

alter table public.license_keys
  add column group_color text;

-- Backfill so the existing four legacy values display with their original
-- colors. New keys must supply a color explicitly.
update public.license_keys set group_color =
  case group_name
    when 'demo'    then '#d9a21b'
    when 'free'    then '#2a7a4b'
    when 'full'    then '#0a2357'
    when 'partner' then '#c8102e'
    else '#0a2357'
  end
where group_color is null;

alter table public.license_keys
  alter column group_color set not null;

alter table public.license_keys
  add constraint license_keys_group_color_hex
    check (group_color ~ '^#[0-9a-fA-F]{6}$');

alter table public.license_keys
  add constraint license_keys_group_name_nonempty
    check (length(btrim(group_name)) between 1 and 32);

-- The enum has no remaining references — safe to drop.
drop type if exists public.license_tier;

-- ---------------------------------------------------------------------------
-- Recreate user_access with the new columns
-- ---------------------------------------------------------------------------

create view public.user_access
with (security_invoker = true)
as
select
  ulk.user_id,
  lk.id          as license_key_id,
  lk.group_name,
  lk.group_color,
  lk.expires_at
from public.user_license_keys ulk
join public.license_keys      lk on lk.id = ulk.license_key_id
where lk.status = 'active'
  and (lk.expires_at is null or lk.expires_at > now());

-- ---------------------------------------------------------------------------
-- current_user_group(): replaces current_user_tier(). Returns a JSON object
-- { name, color } for the caller's most-recent active grant, or NULL if none.
-- Group label is purely cosmetic — gating still uses current_user_has_access().
-- ---------------------------------------------------------------------------

create or replace function public.current_user_group()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object('name', lk.group_name, 'color', lk.group_color)
  from public.user_license_keys ulk
  join public.license_keys lk on lk.id = ulk.license_key_id
  where ulk.user_id = (select auth.uid())
    and lk.status = 'active'
    and (lk.expires_at is null or lk.expires_at > now())
  order by lk.expires_at desc nulls first
  limit 1;
$$;

revoke all on function public.current_user_group() from public;
grant execute on function public.current_user_group() to authenticated;
