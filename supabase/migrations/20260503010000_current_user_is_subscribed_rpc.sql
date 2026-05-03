-- Returns true only when the caller has an active Stripe subscription —
-- regardless of free-tier or license-key access. The header badge in the
-- catch-all route uses this to decide whether to render the SUBSCRIBED pill
-- (which links into the Stripe billing portal). Without this RPC the
-- catch-all infers "subscribed" from "has access AND no key group," which
-- now mislabels every free-tier user (and pre-migration accounts with
-- mismatched metadata) and dumps them into a billing portal that has no
-- Stripe customer record.
--
-- Status filter mirrors current_user_has_access() so the two stay aligned:
-- 'past_due' is included because it's mid-retry and Stripe's recommended
-- handling is to keep access until 'canceled' or 'unpaid'.

create or replace function public.current_user_is_subscribed()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.stripe_user_subscriptions s
    where s.user_id = (select auth.uid())
      and s.status in ('active', 'trialing', 'past_due')
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;

grant execute on function public.current_user_is_subscribed() to authenticated;
