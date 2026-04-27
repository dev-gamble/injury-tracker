-- Roll back 20260422120000_license_keys_admin_read_realtime.
--
-- The admin registry no longer relies on client-side Realtime — the page
-- re-fetches via server actions on mutation, so the SELECT policy and
-- Realtime publication entry are no longer needed. Returning license_keys
-- to service-role-only access keeps the table's surface as small as possible.

-- Drop from the Realtime publication only if currently a member; the original
-- migration's add was conditional, so we mirror that on the way out.
do $$
begin
  if exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'license_keys'
  ) then
    alter publication supabase_realtime drop table public.license_keys;
  end if;
end $$;

drop policy if exists "admins can view all license keys" on public.license_keys;
revoke select on public.license_keys from authenticated;
