-- Align access entitlement with the admin UI's classification: a sub in
-- 'past_due' is mid-retry (Stripe is still attempting to collect) and the
-- admin UI counts it as Active. Per Stripe's webhook guidance, revoke on
-- 'canceled' or 'unpaid' — not immediately on 'past_due' — so we keep access
-- during the dunning window.
--
-- See https://docs.stripe.com/billing/subscriptions/webhooks for the
-- recommended status-to-access mapping.

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
  );
$$;
