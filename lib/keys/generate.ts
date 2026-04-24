import 'server-only'
import { createHash, randomBytes } from 'crypto'

// Crockford base32: excludes I, L, O, U to avoid visually ambiguous characters.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function randomChunk(length: number): string {
  const bytes = randomBytes(length)
  let out = ''
  for (const byte of bytes) {
    out += ALPHABET[byte % 32]
  }
  return out
}

// Three random chunks give ~60 bits of entropy (32^12 ≈ 10^18 combinations),
// enough to resist brute-force redemption even without per-user rate limiting.
// Two chunks (~40 bits) would be thin for an unrate-limited paid-access gate.
export function generateRawKey(prefix = 'ENDEX'): string {
  return `${prefix}-${randomChunk(4)}-${randomChunk(4)}-${randomChunk(4)}`
}

export function hashKey(rawKey: string): Buffer {
  return createHash('sha256').update(rawKey).digest()
}

// PostgREST bytea wire format: \x followed by hex. Use this when inserting via
// supabase-js; a raw Buffer will be JSON-serialized incorrectly.
export function hashKeyForDb(rawKey: string): string {
  return '\\x' + hashKey(rawKey).toString('hex')
}

export function keyPrefixFor(rawKey: string): string {
  const parts = rawKey.split('-')
  if (parts.length < 2) return rawKey
  return `${parts[0]}-${parts[1]}`
}
