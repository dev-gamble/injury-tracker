-- Mirror Stripe's `livemode` flag on the subscription so the admin UI can link
-- to the correct dashboard environment. Test- and live-mode subscription IDs
-- share the same `sub_...` prefix, so ID-string heuristics are unreliable —
-- only `livemode` (set by Stripe at object creation) is authoritative.
--
-- Nullable for backfill: existing rows resolve as live (the historical
-- assumption) until the next webhook tick refreshes them.

alter table public.stripe_user_subscriptions
  add column livemode boolean;
