// Pure ISO-3166 helpers — safe to import in client components. Kept apart
// from `geo.ts` so the server-only fetch logic doesn't get bundled into the
// client.

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', CA: 'Canada', MX: 'Mexico',
  GB: 'United Kingdom', IE: 'Ireland', DE: 'Germany', FR: 'France',
  ES: 'Spain', PT: 'Portugal', IT: 'Italy', NL: 'Netherlands',
  BE: 'Belgium', CH: 'Switzerland', AT: 'Austria', SE: 'Sweden',
  NO: 'Norway', DK: 'Denmark', FI: 'Finland', PL: 'Poland',
  CZ: 'Czechia', RO: 'Romania', GR: 'Greece', UA: 'Ukraine',
  RU: 'Russia', TR: 'Türkiye', IL: 'Israel', AE: 'UAE',
  SA: 'Saudi Arabia', EG: 'Egypt', ZA: 'South Africa', NG: 'Nigeria',
  KE: 'Kenya', MA: 'Morocco', IN: 'India', PK: 'Pakistan',
  BD: 'Bangladesh', CN: 'China', JP: 'Japan', KR: 'South Korea',
  TW: 'Taiwan', HK: 'Hong Kong', SG: 'Singapore', MY: 'Malaysia',
  TH: 'Thailand', VN: 'Vietnam', PH: 'Philippines', ID: 'Indonesia',
  AU: 'Australia', NZ: 'New Zealand', BR: 'Brazil', AR: 'Argentina',
  CL: 'Chile', CO: 'Colombia', PE: 'Peru', VE: 'Venezuela',
}

export function countryNameFor(code: string | null | undefined): string | null {
  if (!code) return null
  return COUNTRY_NAMES[code.toUpperCase()] ?? code.toUpperCase()
}

// ISO alpha-2 → flag emoji via Regional Indicator Symbols. Returns the empty
// string for codes outside the alpha-2 shape so React renders nothing.
export function flagFor(code: string | null | undefined): string {
  if (!code || code.length !== 2) return ''
  const A = 0x1f1e6
  const a = 'A'.charCodeAt(0)
  const cc = code.toUpperCase()
  if (cc.charCodeAt(0) < a || cc.charCodeAt(0) > a + 25) return ''
  if (cc.charCodeAt(1) < a || cc.charCodeAt(1) > a + 25) return ''
  return String.fromCodePoint(A + cc.charCodeAt(0) - a, A + cc.charCodeAt(1) - a)
}
