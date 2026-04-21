'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/admin'
import { generateRawKey, hashKeyForDb, keyPrefixFor } from '@/lib/keys/generate'
import { logger } from '@/lib/logging'

type Tier = 'demo' | 'free' | 'full' | 'partner'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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

// ---------------------------------------------------------------------------
// Seat assignments — manual attach/detach of keys on behalf of users.
// ---------------------------------------------------------------------------

export type AssignmentKey = {
  id: string
  key_prefix: string
  tier: Tier
  status: 'active' | 'revoked' | 'expired'
  expires_at: string | null
  max_uses: number
  current_uses: number
}

export type Assignment = {
  id: string
  user_id: string
  license_key_id: string
  redeemed_at: string
  key: AssignmentKey
}

export type AssignmentUser = {
  id: string
  email: string | null
  created_at: string
  assignments: Assignment[]
}

export type ListAssignmentsResult =
  | { ok: true; users: AssignmentUser[] }
  | { ok: false; error: string }

export async function listAssignmentUsers(): Promise<ListAssignmentsResult> {
  const log = logger('admin.assignments.list')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) {
    log.warn('list.forbidden', { userId: user?.id ?? null })
    return { ok: false, error: 'Forbidden' }
  }

  const admin = createAdminClient()

  const [usersResult, assignmentsResult] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin
      .from('user_license_keys')
      .select(`
        id,
        user_id,
        license_key_id,
        redeemed_at,
        license_keys!inner (
          id,
          key_prefix,
          tier,
          status,
          expires_at,
          max_uses,
          current_uses
        )
      `),
  ])

  if (usersResult.error) {
    log.error('list.users_failed', { error: usersResult.error.message })
    return { ok: false, error: 'Failed to load users' }
  }
  if (assignmentsResult.error) {
    log.error('list.assignments_failed', { error: assignmentsResult.error.message })
    return { ok: false, error: 'Failed to load assignments' }
  }

  type RawAssignment = {
    id: string
    user_id: string
    license_key_id: string
    redeemed_at: string
    license_keys: AssignmentKey
  }

  const assignmentsByUser = new Map<string, Assignment[]>()
  for (const row of (assignmentsResult.data ?? []) as unknown as RawAssignment[]) {
    const list = assignmentsByUser.get(row.user_id) ?? []
    list.push({
      id: row.id,
      user_id: row.user_id,
      license_key_id: row.license_key_id,
      redeemed_at: row.redeemed_at,
      key: row.license_keys,
    })
    assignmentsByUser.set(row.user_id, list)
  }

  const users: AssignmentUser[] = usersResult.data.users
    .map((u) => ({
      id: u.id,
      email: u.email ?? null,
      created_at: u.created_at,
      assignments: assignmentsByUser.get(u.id) ?? [],
    }))
    .sort((a, b) => {
      if (a.assignments.length !== b.assignments.length) {
        return b.assignments.length - a.assignments.length
      }
      return (a.email ?? '').localeCompare(b.email ?? '')
    })

  return { ok: true, users }
}

export type AssignmentActionResult = { ok: true } | { ok: false; error: string }

export async function assignKeyToUser(
  targetUserId: string,
  licenseKeyId: string,
): Promise<AssignmentActionResult> {
  const log = logger('admin.assignments.assign')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) {
    log.warn('assign.forbidden', { userId: user?.id ?? null })
    return { ok: false, error: 'Forbidden' }
  }
  if (!UUID_RE.test(targetUserId) || !UUID_RE.test(licenseKeyId)) {
    return { ok: false, error: 'Invalid identifier' }
  }

  const admin = createAdminClient()

  const { data: key, error: keyErr } = await admin
    .from('license_keys')
    .select('id, status, expires_at, max_uses, current_uses')
    .eq('id', licenseKeyId)
    .single()

  if (keyErr || !key) {
    log.warn('assign.key_not_found', { licenseKeyId, error: keyErr?.message })
    return { ok: false, error: 'Key not found' }
  }
  if (key.status !== 'active') {
    return { ok: false, error: `Key is ${key.status} and cannot be assigned` }
  }
  if (key.expires_at && new Date(key.expires_at) <= new Date()) {
    return { ok: false, error: 'Key has already expired' }
  }
  if (key.current_uses >= key.max_uses) {
    return { ok: false, error: 'Key has no seats remaining' }
  }

  const { error: insertErr } = await admin
    .from('user_license_keys')
    .insert({ user_id: targetUserId, license_key_id: licenseKeyId })

  if (insertErr) {
    if (insertErr.code === '23505') {
      return { ok: false, error: 'User already holds this key' }
    }
    log.error('assign.insert_failed', { code: insertErr.code, error: insertErr.message })
    return { ok: false, error: 'Failed to assign key' }
  }

  log.info('assign.success', { targetUserId, licenseKeyId, by: user!.id })
  return { ok: true }
}

export async function unassignKey(userLicenseKeyId: string): Promise<AssignmentActionResult> {
  const log = logger('admin.assignments.unassign')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) {
    log.warn('unassign.forbidden', { userId: user?.id ?? null })
    return { ok: false, error: 'Forbidden' }
  }
  if (!UUID_RE.test(userLicenseKeyId)) {
    return { ok: false, error: 'Invalid identifier' }
  }

  const admin = createAdminClient()
  const { error, count } = await admin
    .from('user_license_keys')
    .delete({ count: 'exact' })
    .eq('id', userLicenseKeyId)

  if (error) {
    log.error('unassign.failed', { error: error.message })
    return { ok: false, error: 'Failed to unassign key' }
  }
  if (!count) {
    return { ok: false, error: 'Assignment not found' }
  }

  log.info('unassign.success', { userLicenseKeyId, by: user!.id })
  return { ok: true }
}
