-- Stripe's "flexible billing mode" (default in API 2026-04-22+) records a
-- scheduled cancellation as `cancel_at` (a unix timestamp) rather than the
-- legacy `cancel_at_period_end` boolean. Both fields are still present on the
-- Subscription object, but only one of them carries the truth depending on
-- the sub's billing_mode:
--
--   * Legacy mode:    cancel_at_period_end=true  →  ends at current_period_end
--   * Flexible mode:  cancel_at=<timestamp>      →  ends at that timestamp
--                     cancel_at_period_end stays false
--
-- We add explicit columns for both `cancel_at` and `canceled_at` so the UI
-- can show "ends on <date>" / "canceled on <date>" regardless of mode, and
-- so anyone querying the table can tell at a glance whether a sub is
-- scheduled to terminate.

alter table public.stripe_user_subscriptions
  add column cancel_at   timestamptz,
  add column canceled_at timestamptz;
