-- redeem_license_key() calls pgcrypto's digest(), but Supabase installs pgcrypto
-- into the "extensions" schema. The original function pinned its search_path to
-- "public, pg_temp", so the unqualified digest(text, text) call failed at runtime
-- with "function digest(text, unknown) does not exist" (SQLSTATE 42883).
--
-- Fix: include "extensions" on the function's search_path. Leaving search_path
-- explicit (rather than unset) preserves the SECURITY DEFINER hardening against
-- search_path-based privilege escalation.

create or replace function public.redeem_license_key(raw_key text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions, pg_temp
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
