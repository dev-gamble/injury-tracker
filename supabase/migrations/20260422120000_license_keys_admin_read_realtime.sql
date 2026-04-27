-- Realtime for the admin key registry.
--
-- license_keys currently has RLS enabled with zero policies — only the service
-- role touches it (via createAdminClient() on the server). That model works for
-- the admin page's initial load, but it blocks client-side Realtime: Supabase
-- Realtime only broadcasts rows a client could have SELECTed under RLS. Without
-- a policy, the admin browser can't receive INSERT/UPDATE/DELETE events and the
-- registry table stays stale until a manual reload.
--
-- The minimum-privilege fix is a policy that allows SELECT only to callers
-- whose JWT app_metadata.role = 'admin' — the same gate isAdmin() applies in
-- the Node handlers. No INSERT/UPDATE/DELETE policy is added; mutations still
-- go through the service-role admin client, which is unaffected by RLS.
-- Anonymous and non-admin authenticated users remain completely blocked.
--
-- Also re-grants SELECT to `authenticated`. The original migration did
-- `revoke all ... from anon, authenticated` — the grant is table-level,
-- orthogonal to RLS. Both must permit the read for the policy to matter.

grant select on public.license_keys to authenticated;
create policy "admins can view all license keys"
  on public.license_keys
  for select
  to authenticated
  using (
    coalesce(
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
      false
    )
  );
-- Add to the Realtime publication so change events are broadcast at all.
-- Wrapped in DO because add-table is idempotent but errors if already present.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'license_keys'
  ) then
    alter publication supabase_realtime add table public.license_keys;
  end if;
end $$;
