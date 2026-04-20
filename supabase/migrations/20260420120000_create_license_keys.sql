-- License key access control foundation.
--
-- Two tables:
--   license_keys       — catalog of issued keys (service-role-only, hash-stored)
--   user_license_keys  — redemption/seat join between auth.users and license_keys
--
-- Access is granted via the user_access view, which middleware queries to decide
-- whether a session is still valid. A future migration will extend this view to
-- UNION in active Stripe subscriptions.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.license_tier as enum ('demo', 'free', 'full', 'partner');

create type public.license_status as enum ('active', 'revoked', 'expired');

-- ---------------------------------------------------------------------------
-- license_keys: admin-managed catalog. Raw key is never stored; only SHA-256.
-- ---------------------------------------------------------------------------

create table public.license_keys (
  id            uuid                      primary key default gen_random_uuid(),
  key_hash      bytea                     not null unique,
  key_prefix    text                      not null,
  tier          public.license_tier       not null,
  status        public.license_status     not null default 'active',
  max_uses      integer                   not null default 1 check (max_uses >= 1),
  current_uses  integer                   not null default 0 check (current_uses >= 0),
  expires_at    timestamptz,
  notes         text,
  created_at    timestamptz               not null default now(),
  created_by    uuid                      references auth.users(id) on delete set null,
  constraint license_keys_uses_within_max check (current_uses <= max_uses)
);

create index license_keys_status_idx     on public.license_keys (status);
create index license_keys_expires_at_idx on public.license_keys (expires_at);

alter table public.license_keys enable row level security;

-- No policies on license_keys — only the service role (which bypasses RLS) may
-- read or write. Redemption goes through the SECURITY DEFINER RPC below.
revoke all on public.license_keys from anon, authenticated;

-- ---------------------------------------------------------------------------
-- user_license_keys: which users have redeemed which keys.
-- ---------------------------------------------------------------------------

create table public.user_license_keys (
  id               uuid         primary key default gen_random_uuid(),
  user_id          uuid         not null references auth.users(id)      on delete cascade,
  license_key_id   uuid         not null references public.license_keys on delete restrict,
  redeemed_at      timestamptz  not null default now(),
  unique (user_id, license_key_id)
);

create index user_license_keys_user_id_idx        on public.user_license_keys (user_id);
create index user_license_keys_license_key_id_idx on public.user_license_keys (license_key_id);

alter table public.user_license_keys enable row level security;

create policy "users can view their own redemptions"
  on public.user_license_keys
  for select
  using (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies — all writes go through redeem_license_key().
revoke insert, update, delete on public.user_license_keys from anon, authenticated;

-- ---------------------------------------------------------------------------
-- user_access: single source of truth for "does this user currently have access?"
-- Middleware queries this view. A row here means access is granted.
-- ---------------------------------------------------------------------------

create view public.user_access
with (security_invoker = true)
as
select
  ulk.user_id,
  lk.id          as license_key_id,
  lk.tier,
  lk.expires_at
from public.user_license_keys ulk
join public.license_keys      lk on lk.id = ulk.license_key_id
where lk.status = 'active'
  and (lk.expires_at is null or lk.expires_at > now());

-- ---------------------------------------------------------------------------
-- redeem_license_key(raw_key): atomic redemption for the calling user.
--
-- Returns the new user_license_keys.id on success, or raises an exception with
-- a named error code the client can map to a user-facing message:
--   invalid_key      — no key matches the submitted hash
--   revoked          — key was revoked
--   expired          — key passed its expires_at
--   exhausted        — key hit max_uses
--   already_redeemed — this user already redeemed this key
--   not_authenticated — no auth.uid() (should be unreachable via GRANT, but guarded)
-- ---------------------------------------------------------------------------

create or replace function public.redeem_license_key(raw_key text)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id        uuid := auth.uid();
  v_hash           bytea;
  v_key            public.license_keys%rowtype;
  v_redemption_id  uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_hash := digest(raw_key, 'sha256');

  select * into v_key
  from public.license_keys
  where key_hash = v_hash
  for update;

  if not found then
    raise exception 'invalid_key' using errcode = 'P0002';
  end if;

  if v_key.status = 'revoked' then
    raise exception 'revoked' using errcode = 'P0001';
  end if;

  if v_key.expires_at is not null and v_key.expires_at <= now() then
    raise exception 'expired' using errcode = 'P0001';
  end if;

  if v_key.current_uses >= v_key.max_uses then
    raise exception 'exhausted' using errcode = 'P0001';
  end if;

  begin
    insert into public.user_license_keys (user_id, license_key_id)
    values (v_user_id, v_key.id)
    returning id into v_redemption_id;
  exception when unique_violation then
    raise exception 'already_redeemed' using errcode = 'P0001';
  end;

  update public.license_keys
     set current_uses = current_uses + 1
   where id = v_key.id;

  return v_redemption_id;
end;
$$;

revoke all on function public.redeem_license_key(text) from public, anon;
grant execute on function public.redeem_license_key(text) to authenticated;
