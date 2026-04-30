'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/admin'
import { logger } from '@/lib/logging'

// Aggregations are computed in Postgres so the panel's view of the 30-day
// window is exact regardless of volume — not "the most recent 5000 rows."
// Only the recent-activity feed pulls raw rows, and that's intentionally
// capped to a small page (50) since it's a feed, not an aggregate.

export type VisitSummary = {
  totalCount: number
  windowCount: number
  uniqueIps: number
  last24h: number
  prev24h: number
  topCountryCode: string | null
  topCountryCount: number
}

export type VisitDailyPoint = {
  bucketStart: number
  visits: number
  uniques: number
}

export type CountryAgg = { code: string; name: string; count: number }
export type PathAgg = { path: string; count: number }
export type IpAgg = {
  ip: string
  count: number
  lastSeen: number
  countryCode: string | null
  city: string | null
}

export type RecentVisit = {
  id: string
  ip_address: string
  path: string
  country_code: string | null
  city: string | null
  created_at: string
}

export type AnalyticsPayload = {
  summary: VisitSummary
  series: VisitDailyPoint[]
  countries: CountryAgg[]
  paths: PathAgg[]
  topIps: IpAgg[]
  recent: RecentVisit[]
  windowDays: number
}

export type ListAnalyticsResult =
  | { ok: true; payload: AnalyticsPayload }
  | { ok: false; error: string }

const WINDOW_DAYS = 30
const RECENT_LIMIT = 50

export async function listVisitAnalytics(): Promise<ListAnalyticsResult> {
  const log = logger('admin.analytics.list')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) {
    log.warn('list.forbidden', { userId: user?.id ?? null })
    return { ok: false, error: 'Forbidden' }
  }

  const admin = createAdminClient()

  const [summaryRes, seriesRes, countriesRes, pathsRes, topIpsRes, recentRes] = await Promise.all([
    admin.rpc('get_visit_summary', { window_days: WINDOW_DAYS }),
    admin.rpc('get_visit_daily_series', { window_days: WINDOW_DAYS }),
    admin.rpc('get_visit_top_countries', { window_days: WINDOW_DAYS, row_limit: 12 }),
    admin.rpc('get_visit_top_paths', { window_days: WINDOW_DAYS, row_limit: 12 }),
    admin.rpc('get_visit_top_ips', { window_days: WINDOW_DAYS, row_limit: 25 }),
    admin
      .from('visit_events')
      .select('id, ip_address, path, country_code, city, created_at')
      .order('created_at', { ascending: false })
      .limit(RECENT_LIMIT),
  ])

  for (const [name, res] of Object.entries({
    summary: summaryRes,
    series: seriesRes,
    countries: countriesRes,
    paths: pathsRes,
    topIps: topIpsRes,
    recent: recentRes,
  })) {
    if (res.error) {
      log.error(`list.${name}_failed`, { error: res.error.message })
      return { ok: false, error: 'Failed to load analytics' }
    }
  }

  type SummaryRow = {
    total_count: number
    window_count: number
    unique_ips: number
    last_24h: number
    prev_24h: number
    top_country_code: string | null
    top_country_count: number
  }
  const summaryRow = (summaryRes.data?.[0] ?? null) as SummaryRow | null
  const summary: VisitSummary = summaryRow
    ? {
        totalCount: Number(summaryRow.total_count),
        windowCount: Number(summaryRow.window_count),
        uniqueIps: Number(summaryRow.unique_ips),
        last24h: Number(summaryRow.last_24h),
        prev24h: Number(summaryRow.prev_24h),
        topCountryCode: summaryRow.top_country_code,
        topCountryCount: Number(summaryRow.top_country_count),
      }
    : {
        totalCount: 0, windowCount: 0, uniqueIps: 0,
        last24h: 0, prev24h: 0, topCountryCode: null, topCountryCount: 0,
      }

  type SeriesRow = { bucket_start: string; visits: number; uniques: number }
  const series: VisitDailyPoint[] = ((seriesRes.data ?? []) as SeriesRow[]).map((r) => ({
    bucketStart: new Date(r.bucket_start).getTime(),
    visits: Number(r.visits),
    uniques: Number(r.uniques),
  }))

  type CountryRow = { country_code: string; country_name: string; count: number }
  const countries: CountryAgg[] = ((countriesRes.data ?? []) as CountryRow[]).map((r) => ({
    code: r.country_code,
    name: r.country_name,
    count: Number(r.count),
  }))

  type PathRow = { path: string; count: number }
  const paths: PathAgg[] = ((pathsRes.data ?? []) as PathRow[]).map((r) => ({
    path: r.path,
    count: Number(r.count),
  }))

  type IpRow = {
    ip_address: string
    count: number
    last_seen: string
    country_code: string | null
    city: string | null
  }
  const topIps: IpAgg[] = ((topIpsRes.data ?? []) as IpRow[]).map((r) => ({
    ip: r.ip_address,
    count: Number(r.count),
    lastSeen: new Date(r.last_seen).getTime(),
    countryCode: r.country_code,
    city: r.city,
  }))

  const recent = (recentRes.data ?? []) as RecentVisit[]

  return {
    ok: true,
    payload: {
      summary,
      series,
      countries,
      paths,
      topIps,
      recent,
      windowDays: WINDOW_DAYS,
    },
  }
}
