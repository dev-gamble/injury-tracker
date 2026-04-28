-- Persist enough Stripe price metadata on each subscription row to compute
-- revenue locally without round-tripping to Stripe for every chart render.
--
-- unit_amount is stored in the price's smallest unit (cents for USD), matching
-- Stripe's wire format. recurring_interval is one of 'day' | 'week' | 'month'
-- | 'year'; recurring_interval_count is how many of those per cycle (e.g. an
-- "every 6 months" plan would be interval='month', interval_count=6).
--
-- All columns are nullable so the webhook can backfill them for existing rows
-- on the next subscription event without forcing a one-shot migration job.

alter table public.stripe_user_subscriptions
  add column unit_amount             integer,
  add column currency                text,
  add column recurring_interval      text,
  add column recurring_interval_count integer;
