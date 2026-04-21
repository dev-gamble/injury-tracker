'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/admin'
import { generateRawKey, hashKeyForDb, keyPrefixFor } from '@/lib/keys/generate'
import { logger } from '@/lib/logging'

type Tier = 'demo' | 'free' | 'full' | 'partner'

export type CreateKeyInput = {
  tier: Tier
  maxUses: number
  expiresAt: string | null
  notes: string | null
}

export type CreateKeyResult =
  | { ok: true; rawKey: string; id: string; keyPrefix: string }
  | { ok: false; error: string }

export async function createLicenseKey(input: CreateKeyInput): Promise<CreateKeyResult> {
  const log = logger('admin.keys.create')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!isAdmin(user)) {
    log.warn('create.forbidden', { userId: user?.id ?? null })
    return { ok: false, error: 'Forbidden' }
  }

  if (!['demo', 'free', 'full', 'partner'].includes(input.tier)) {
    return { ok: false, error: 'Invalid tier' }
  }
  if (!Number.isInteger(input.maxUses) || input.maxUses < 1) {
    return { ok: false, error: 'maxUses must be a positive integer' }
  }

  const rawKey = generateRawKey()
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('license_keys')
    .insert({
      key_hash: hashKeyForDb(rawKey),
      key_prefix: keyPrefixFor(rawKey),
      tier: input.tier,
      max_uses: input.maxUses,
      expires_at: input.expiresAt,
      notes: input.notes,
      created_by: user!.id,
    })
    .select('id')
    .single()

  if (error) {
    log.error('create.failed', { error: error.message, code: error.code })
    return { ok: false, error: 'Failed to create key' }
  }

  log.info('create.success', { id: data.id, tier: input.tier, createdBy: user!.id })

  return {
    ok: true,
    id: data.id,
    rawKey,
    keyPrefix: keyPrefixFor(rawKey),
  }
}
