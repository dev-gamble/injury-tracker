import 'server-only'
import { countryNameFor } from './countries'

// GeoIP enrichment for visit events. We try the most reliable signal first:
// hosting platform headers (Vercel / Cloudflare) — those are populated by the
// edge for free and never miss. If we're behind a different proxy or running
// locally, fall back to a free public lookup against ip-api.com (45 req/min,
// no API key) with a short timeout so a degraded service can't slow recording.

export type GeoLookup = {
  countryCode: string | null
  countryName: string | null
  region: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
}

const EMPTY_GEO: GeoLookup = {
  countryCode: null,
  countryName: null,
  region: null,
  city: null,
  latitude: null,
  longitude: null,
}

const LOCAL_IP_RE = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|::1$|fe80:|fc00:|fd)/i
const LOOKUP_TIMEOUT_MS = 1500

export function isLocalIp(ip: string): boolean {
  return ip === '::1' || LOCAL_IP_RE.test(ip)
}

// Pulls the originating IP out of the standard proxy headers. We trust the
// leftmost x-forwarded-for entry because Next.js/Vercel/Cloudflare strip and
// rewrite this header at the edge.
export function ipFromHeaders(headers: Headers): string | null {
  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const real = headers.get('x-real-ip')
  if (real) return real.trim()
  return null
}

// Header-based geo from Vercel / Cloudflare. Free, instant, no fetch needed.
function geoFromHeaders(headers: Headers): GeoLookup | null {
  const country = headers.get('x-vercel-ip-country') ?? headers.get('cf-ipcountry')
  if (!country) return null
  return {
    countryCode: country.toUpperCase(),
    countryName: countryNameFor(country.toUpperCase()),
    region: headers.get('x-vercel-ip-country-region') ?? null,
    city: decodeIfPresent(headers.get('x-vercel-ip-city')),
    latitude: parseFloatOrNull(headers.get('x-vercel-ip-latitude')),
    longitude: parseFloatOrNull(headers.get('x-vercel-ip-longitude')),
  }
}

function decodeIfPresent(raw: string | null): string | null {
  if (!raw) return null
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

function parseFloatOrNull(raw: string | null): number | null {
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

// Free public lookup, no API key. Returns null on any error (timeout, rate
// limit, malformed payload) — recording falls through to "no geo" gracefully.
async function lookupGeoExternal(ip: string): Promise<GeoLookup | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS)
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,region,regionName,city,lat,lon`,
      { signal: controller.signal, cache: 'no-store' },
    )
    if (!res.ok) return null
    const data = (await res.json()) as {
      status?: string
      country?: string
      countryCode?: string
      regionName?: string
      city?: string
      lat?: number
      lon?: number
    }
    if (data.status !== 'success') return null
    return {
      countryCode: data.countryCode?.toUpperCase() ?? null,
      countryName: data.country ?? null,
      region: data.regionName ?? null,
      city: data.city ?? null,
      latitude: typeof data.lat === 'number' ? data.lat : null,
      longitude: typeof data.lon === 'number' ? data.lon : null,
    }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

// Sync part: free, instant header-based geo. Used on the request path.
export function geoFromHeadersOnly(ip: string, headers: Headers): GeoLookup {
  if (isLocalIp(ip)) return EMPTY_GEO
  return geoFromHeaders(headers) ?? EMPTY_GEO
}

// Async part: external lookup. Called from the after-task so the request
// path doesn't pay for it.
export async function geoForIp(ip: string): Promise<GeoLookup | null> {
  if (isLocalIp(ip)) return null
  return lookupGeoExternal(ip)
}

export async function geoForRequest(ip: string, headers: Headers): Promise<GeoLookup> {
  if (isLocalIp(ip)) return EMPTY_GEO
  const fromHeaders = geoFromHeaders(headers)
  if (fromHeaders) return fromHeaders
  const external = await lookupGeoExternal(ip)
  return external ?? EMPTY_GEO
}

