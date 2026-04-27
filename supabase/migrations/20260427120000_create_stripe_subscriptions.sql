-- Stripe subscription mirror table. Webhook handler upserts rows here using
-- the service role; the rest of the app only reads. One row per Stripe
-- subscription (not per user) so historical/canceled subs are preserved
-- alongside the active one.
--
-- Access is granted whenever the user has either:
--   - an active, non-expired license_keys row (existing path), OR
--   - a stripe_user_subscriptions row in status 'active' or 'trialing' with
--     current_period_end in the future (or NULL, e.g. trialing without an end).

create table public.stripe_user_subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id       text not null,
  stripe_subscription_id   text not null unique,
  stripe_price_id          text not null,
  status                   text not null,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean not null default false,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index stripe_user_subscriptions_user_id_idx
  on public.stripe_user_subscriptions (user_id);

create index stripe_user_subscriptions_customer_id_idx
  on public.stripe_user_subscriptions (stripe_customer_id);

create index stripe_user_subscriptions_status_idx
  on public.stripe_user_subscriptions (status);

-- Touch updated_at on every row write so the webhook handler doesn't have to
-- maintain it manually.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger stripe_user_subscriptions_set_updated_at
before update on public.stripe_user_subscriptions
for each row execute function public.set_updated_at();

alter table public.stripe_user_subscriptions enable row level security;

-- Users can read their own subscription rows. All writes go through the
-- service-role webhook handler — no INSERT/UPDATE/DELETE policies for users.
create policy "stripe_user_subscriptions_self_select"
on public.stripe_user_subscriptions
for select
to authenticated
using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Extend current_user_has_access() to recognize active Stripe subscriptions.
-- License keys remain the first check; subscriptions are unioned in.
-- ---------------------------------------------------------------------------

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
      and s.status in ('active', 'trialing')
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;
