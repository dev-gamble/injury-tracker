-- Mirror discount data attached to a subscription so the admin UI shows the
-- price the customer actually pays (and so MRR/ARR reflect realized revenue,
-- not list-price revenue). Stripe stores discounts as separate Coupon +
-- PromotionCode objects; we flatten the parts we care about into the row.
--
-- All columns nullable: most subs have no discount, and the webhook only
-- populates these when sub.discounts is non-empty.

alter table public.stripe_user_subscriptions
  add column discount_amount_off       integer,        -- cents off per cycle (fixed)
  add column discount_percent_off      numeric(5,2),   -- percent off per cycle
  add column discount_promotion_code   text,           -- human code (e.g. "CLAIMS40")
  add column discount_duration         text,           -- 'forever' | 'once' | 'repeating'
  add column discount_duration_in_months integer,      -- repeat length when duration='repeating'
  add column discount_end              timestamptz;    -- when the discount stops applying
