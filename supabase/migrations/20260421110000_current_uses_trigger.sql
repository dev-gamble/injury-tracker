-- license_keys.current_uses becomes trigger-maintained derived state.
--
-- Previously the RPC manually bumped current_uses inside the same transaction
-- as the user_license_keys insert. That design breaks down any time a row
-- leaves user_license_keys via a path the RPC doesn't control:
--   * auth.users deletion cascades into user_license_keys (FK on delete cascade),
--     but current_uses is never decremented.
--   * Admin-initiated deletes in the dashboard for testing.
--   * Partial restores.
--
-- Result observed in production data: current_uses=2 while user_license_keys
-- held a single redemption row. The counter and the source-of-truth rows had
-- silently diverged.
--
-- Fix: treat the underlying redemption rows as authoritative and maintain the
-- counter with a trigger on insert/delete. Any future cascade, admin edit, or
-- restore self-heals.

-- ---------------------------------------------------------------------------
-- 1. Reconcile existing data from the source of truth.
-- ---------------------------------------------------------------------------
update public.license_keys lk
   set current_uses = coalesce((
     select count(*)::int
     from public.user_license_keys ulk
     where ulk.license_key_id = lk.id
   ), 0);

-- ---------------------------------------------------------------------------
-- 2. Trigger function: sync current_uses on redemption insert/delete.
--
-- SECURITY DEFINER so it can update license_keys (which has all privileges
-- revoked from anon/authenticated). greatest(..., 0) is a defensive floor in
-- case a future bug or manual edit drives the counter below the row count —
-- keeps legitimate deletes from being blocked by the current_uses >= 0 check.
-- ---------------------------------------------------------------------------
create or replace function public.sync_license_key_uses()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    update public.license_keys
       set current_uses = current_uses + 1
     where id = new.license_key_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.license_keys
       set current_uses = greatest(current_uses - 1, 0)
     where id = old.license_key_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists user_license_keys_sync_count on public.user_license_keys;
create trigger user_license_keys_sync_count
  after insert or delete on public.user_license_keys
  for each row execute function public.sync_license_key_uses();

-- ---------------------------------------------------------------------------
-- 3. Drop the now-redundant current_uses update from redeem_license_key.
-- The trigger above runs within the RPC's transaction, still holding the
-- FOR UPDATE lock on the license_keys row, so the increment remains atomic
-- with respect to concurrent redemptions.
-- ---------------------------------------------------------------------------
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

  -- current_uses is incremented by user_license_keys_sync_count trigger
  return v_redemption_id;
end;
$$;
