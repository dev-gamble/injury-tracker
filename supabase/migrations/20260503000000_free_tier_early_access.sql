-- Early-launch override: during the free-access growth phase, every
-- authenticated user has access to ENDEX regardless of subscription or key
-- redemption. The original key/subscription gates are preserved as the first
-- two branches so that — when paid tiers re-launch — we can revert this
-- migration to restore the previous behavior without losing the original
-- entitlement logic.
--
-- TO REVERT WHEN LAUNCHING PAID TIERS:
--   re-run migrations/20260428120000_stripe_access_include_past_due.sql
--   (which redefines this function without the auth.uid() override).

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
  )
  or exists (
    select 1
    from public.stripe_user_subscriptions s
    where s.user_id = (select auth.uid())
      and s.status in ('active', 'trialing', 'past_due')
      and (s.current_period_end is null or s.current_period_end > now())
  )
  -- Free-tier early-access override: any authenticated user.
  or (select auth.uid()) is not null;
$$;
