import 'server-only'
import Stripe from 'stripe'
import { getServerEnv } from '@/lib/env'

let cached: Stripe | null = null

// Single restricted-key Stripe client for all server-to-Stripe calls. Cached
// in module scope so we reuse the underlying HTTP agent across requests.
export function getStripe(): Stripe {
  if (cached) return cached
  const env = getServerEnv()
  cached = new Stripe(env.STRIPE_RESTRICTED_KEY, {
    typescript: true,
  })
  return cached
}
