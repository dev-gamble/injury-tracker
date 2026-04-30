import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { geoForIp, geoFromHeadersOnly, ipFromHeaders } from '@/lib/analytics/geo'
import { isAllowedPath, isLikelyBot, isSameOrigin, rateLimit } from '@/lib/analytics/guards'
import { getPublicOrigin } from '@/lib/http/public-origin'
import { errorToFields, logger, safeFlush } from '@/lib/logging'
import { attachRequestIdHeader, getOrCreateRequestId } from '@/lib/logging/request-id'

// Visit-tracking endpoint. Defense layers:
//   1. Same-origin check (Origin/Referer must match the public origin in prod)
//   2. Path allowlist (drops random POSTs to /wp-login etc.)
//   3. Bot user-agent filter
//   4. In-memory per-IP rate limit (30/min)
//   5. Body shape validation
// The insert uses only header-derived geo (free, sync). External GeoIP runs
// in an after-task so the response path stays under ~5ms regardless of
// ip-api.com's latency.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PathSchema = z.string().min(1).max(2000)
const ReferrerSchema = z.string().max(2000).nullable().optional()

const BodySchema = z.object({
  path: PathSchema,
  referrer: ReferrerSchema,
})

function noContent(requestId: string) {
  return attachRequestIdHeader(new NextResponse(null, { status: 204 }), requestId)
}

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request)
  const log = logger('analytics.track').with({ requestId })

  try {
    // 1. Same-origin gate.
    if (!isSameOrigin(request, getPublicOrigin(request))) {
      return attachRequestIdHeader(
        NextResponse.json({ ok: false }, { status: 403 }),
        requestId,
      )
    }

    // 2. Body shape.
    const json = await request.json().catch(() => null)
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return attachRequestIdHeader(
        NextResponse.json({ ok: false }, { status: 400 }),
        requestId,
      )
    }
    if (!isAllowedPath(parsed.data.path)) {
      // Quietly drop — never tell a probe whether its path was on our radar.
      return noContent(requestId)
    }

    // 3. Bot filter.
    const userAgent = request.headers.get('user-agent')?.slice(0, 500) ?? null
    if (isLikelyBot(userAgent)) {
      return noContent(requestId)
    }

    // 4. IP + rate limit.
    const ip = ipFromHeaders(request.headers)
    if (!ip) return noContent(requestId)
    const limit = rateLimit(ip)
    if (!limit.allowed) {
      const res = NextResponse.json({ ok: false }, { status: 429 })
      res.headers.set('Retry-After', String(limit.retryAfterSec))
      return attachRequestIdHeader(res, requestId)
    }

    // Best-effort user attach. Most page-loads are anonymous and that's fine.
    let userId: string | null = null
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id ?? null
    } catch {
      userId = null
    }

    // 5. Insert with whatever geo we can get for free from edge headers.
    const geo = geoFromHeadersOnly(ip, request.headers)
    const admin = createAdminClient()
    const { data: inserted, error } = await admin
      .from('visit_events')
      .insert({
        ip_address: ip,
        user_agent: userAgent,
        path: parsed.data.path,
        referrer: parsed.data.referrer ?? null,
        country_code: geo.countryCode,
        country_name: geo.countryName,
        region: geo.region,
        city: geo.city,
        latitude: geo.latitude,
        longitude: geo.longitude,
        user_id: userId,
      })
      .select('id, country_code')
      .single()

    if (error) {
      log.error('insert.failed', { code: error.code, error: error.message })
      return attachRequestIdHeader(
        NextResponse.json({ ok: false }, { status: 500 }),
        requestId,
      )
    }

    // 6. Off-path enrichment. Only runs if we still don't have a country (i.e.
    // edge-headers were absent and the IP is public). The response is already
    // on its way back to the client at this point.
    if (!inserted.country_code) {
      after(async () => {
        const lookup = await geoForIp(ip)
        if (!lookup || !lookup.countryCode) return
        const enrich = createAdminClient()
        const { error: updateErr } = await enrich
          .from('visit_events')
          .update({
            country_code: lookup.countryCode,
            country_name: lookup.countryName,
            region: lookup.region,
            city: lookup.city,
            latitude: lookup.latitude,
            longitude: lookup.longitude,
          })
          .eq('id', inserted.id)
        if (updateErr) {
          log.warn('enrich.failed', { id: inserted.id, error: updateErr.message })
        }
      })
    }

    return noContent(requestId)
  } catch (error) {
    log.error('track.failed', { error: errorToFields(error) })
    return attachRequestIdHeader(
      NextResponse.json({ ok: false }, { status: 500 }),
      requestId,
    )
  } finally {
    await safeFlush(log)
  }
}
