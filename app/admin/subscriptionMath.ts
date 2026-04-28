import type { SubscriptionRow } from './actions'

// Whether the discount on this row is currently in effect for revenue
// purposes. A 'forever' discount applies as long as the sub is active; a
// 'repeating' discount applies until discount_end; a 'once' discount applies
// only on the first invoice — for which the webhook seeds discount_end at
// the first period_end (see checkoutDiscountEnd in the webhook).
export function isDiscountActiveNow(r: SubscriptionRow, now = Date.now()): boolean {
  if (!hasAnyDiscount(r)) return false
  if (r.discount_duration === 'forever') return true
  if (r.discount_duration === 'repeating' || r.discount_duration === 'once') {
    // Use discount_end (frozen at checkout) rather than current_period_end —
    // the latter advances on renewal and would keep a one-time promo looking
    // active forever.
    const end = r.discount_end ? new Date(r.discount_end).getTime() : null
    if (end === null) return true
    return now < end
  }
  return false
}

function hasAnyDiscount(r: SubscriptionRow): boolean {
  return (r.discount_amount_off ?? 0) > 0 || (r.discount_percent_off ?? 0) > 0
}

// Effective per-cycle charge in the price's smallest unit (e.g. cents),
// factoring in any currently-active discount. Falls back to list price when
// no discount is active. Caps at zero — Stripe coupons can't make it negative.
export function effectiveUnitAmount(r: SubscriptionRow, now = Date.now()): number {
  const list = r.unit_amount ?? 0
  if (list <= 0) return 0
  if (!isDiscountActiveNow(r, now)) return list

  let amount = list
  if (r.discount_percent_off && r.discount_percent_off > 0) {
    amount = amount * (1 - r.discount_percent_off / 100)
  }
  if (r.discount_amount_off && r.discount_amount_off > 0) {
    amount = amount - r.discount_amount_off
  }
  return Math.max(0, Math.round(amount))
}

// Per-day / per-week / per-month / per-year recurring-revenue rates,
// computed against the effective (discount-aware) per-cycle amount. This is
// "realized recurring revenue right now," not pure run rate — during a 'once'
// or 'repeating' discount window the figures reflect what's actually billed,
// then snap up to list price once discount_end passes.
export function normalizedRevenue(
  r: SubscriptionRow,
  now = Date.now(),
): { perDay: number; perWeek: number; perMonth: number; perYear: number } {
  if (!r.recurring_interval) {
    return { perDay: 0, perWeek: 0, perMonth: 0, perYear: 0 }
  }
  const cycleAmount = effectiveUnitAmount(r, now)
  if (cycleAmount <= 0) {
    return { perDay: 0, perWeek: 0, perMonth: 0, perYear: 0 }
  }
  const intervalCount = Math.max(1, r.recurring_interval_count ?? 1)
  const daysPerInterval =
    r.recurring_interval === 'day'   ? 1 :
    r.recurring_interval === 'week'  ? 7 :
    r.recurring_interval === 'month' ? 30.4375 :
    r.recurring_interval === 'year'  ? 365.25 :
    /* unknown */ 30.4375
  const perDay = cycleAmount / (intervalCount * daysPerInterval)
  return {
    perDay,
    perWeek: perDay * 7,
    perMonth: perDay * 30.4375,
    perYear: perDay * 365.25,
  }
}

