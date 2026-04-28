import type { SubscriptionRow } from './actions'

// Whether the discount on this row is currently in effect for revenue
// purposes. A 'forever' discount applies as long as the sub is active; a
// 'repeating' discount applies until discount_end; a 'once' discount applies
// only on the first invoice (after that, full price).
export function isDiscountActiveNow(r: SubscriptionRow, now = Date.now()): boolean {
  if (!hasAnyDiscount(r)) return false
  if (r.discount_duration === 'forever') return true
  if (r.discount_duration === 'repeating') {
    const end = r.discount_end ? new Date(r.discount_end).getTime() : null
    if (end === null) return true
    return now < end
  }
  if (r.discount_duration === 'once') {
    // Applies only to the first invoice — heuristic: still active until the
    // first period_end passes. After that the customer pays list price.
    const firstPeriodEnd = r.current_period_end ? new Date(r.current_period_end).getTime() : null
    if (firstPeriodEnd === null) return true
    return now < firstPeriodEnd
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
// computed against the effective (discount-aware) per-cycle amount.
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

// Human-readable summary of the active discount, e.g. "CLAIMS40 · 40% off"
// or "WELCOME · $10 off". Returns null when no discount is currently active.
export function discountSummary(r: SubscriptionRow, now = Date.now()): string | null {
  if (!isDiscountActiveNow(r, now)) return null
  const code = r.discount_promotion_code ?? 'PROMO'
  if (r.discount_percent_off && r.discount_percent_off > 0) {
    const pct = r.discount_percent_off
    const trimmed = pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
    return `${code} · ${trimmed}% off`
  }
  if (r.discount_amount_off && r.discount_amount_off > 0) {
    const sym = (r.currency ?? 'usd').toLowerCase() === 'usd' ? '$' : ''
    const dollars = (r.discount_amount_off / 100).toLocaleString('en-US', {
      minimumFractionDigits: r.discount_amount_off % 100 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })
    return `${code} · ${sym}${dollars} off`
  }
  return code
}
