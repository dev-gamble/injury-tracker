-- Wrap auth.uid() in a subquery so Postgres evaluates it once per query
-- (as an InitPlan) instead of re-calling it for every row during the RLS check.
-- Addresses Supabase's auth_rls_initplan advisor warning.

drop policy "users can view their own redemptions" on public.user_license_keys;

create policy "users can view their own redemptions"
  on public.user_license_keys
  for select
  using (user_id = (select auth.uid()));
