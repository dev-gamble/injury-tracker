-- Middleware needs to ask "does the caller currently have a valid access
-- grant?" on every request to a protected page. The existing user_access view
-- is marked security_invoker=true, but authenticated has all privileges
-- revoked on public.license_keys, so the view's join fails with a permission
-- error when queried from the client.
--
-- Rather than poke holes in license_keys RLS (which is deliberately locked to
-- service-role only), expose access as a boolean via a SECURITY DEFINER RPC.
-- The function reads both tables under the definer's privileges but scopes
-- the check to auth.uid() internally, so a caller can only observe their own
-- access state.

create or replace function public.current_user_has_access()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_license_keys ulk
    join public.license_keys lk on lk.id = ulk.license_key_id
    where ulk.user_id = (select auth.uid())
      and lk.status = 'active'
      and (lk.expires_at is null or lk.expires_at > now())
  );
$$;

revoke all on function public.current_user_has_access() from public;
grant execute on function public.current_user_has_access() to authenticated;
