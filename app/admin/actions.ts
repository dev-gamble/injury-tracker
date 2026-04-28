'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/admin'
import { generateRawKey, hashKeyForDb, keyPrefixFor } from '@/lib/keys/generate'
import { logger } from '@/lib/logging'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/

export type CreateKeyInput = {
  groupName: string
  groupColor: string
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

  const groupName = input.groupName.trim()
  if (groupName.length < 1 || groupName.length > 32) {
    return { ok: false, error: 'Group name must be 1–32 characters' }
  }
  if (!HEX_COLOR_RE.test(input.groupColor)) {
    return { ok: false, error: 'Group color must be a 6-digit hex (e.g. #0a2357)' }
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
      group_name: groupName,
      group_color: input.groupColor,
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

  log.info('create.success', { id: data.id, group: groupName, createdBy: user!.id })

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
  group_name: string
  group_color: string
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
          group_name,
          group_color,
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

// ---------------------------------------------------------------------------
// Key status — revoke / unrevoke directly from the registry row action menu.
// "expired" is never a target: it's derived from expires_at and must remain
// coherent with time. We only toggle between active and revoked.
// ---------------------------------------------------------------------------

export type KeyStatusResult = { ok: true; status: 'active' | 'revoked' } | { ok: false; error: string }

async function setKeyStatus(licenseKeyId: string, next: 'active' | 'revoked'): Promise<KeyStatusResult> {
  const log = logger(`admin.keys.${next === 'revoked' ? 'revoke' : 'unrevoke'}`)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) {
    log.warn('forbidden', { userId: user?.id ?? null })
    return { ok: false, error: 'Forbidden' }
  }
  if (!UUID_RE.test(licenseKeyId)) {
    return { ok: false, error: 'Invalid identifier' }
  }

  const admin = createAdminClient()
  const { data: existing, error: fetchErr } = await admin
    .from('license_keys')
    .select('id, status, expires_at')
    .eq('id', licenseKeyId)
    .single()

  if (fetchErr || !existing) {
    return { ok: false, error: 'Key not found' }
  }

  // Guard: don't let an admin flip an expired key back to active — the date
  // logic still says expired, so the UI would lie. They need to edit expiry first.
  if (next === 'active' && existing.expires_at && new Date(existing.expires_at) <= new Date()) {
    return { ok: false, error: 'Key is past its expiry — extend the expiry date before reactivating.' }
  }

  const { error: updateErr } = await admin
    .from('license_keys')
    .update({ status: next })
    .eq('id', licenseKeyId)

  if (updateErr) {
    log.error('update_failed', { code: updateErr.code, error: updateErr.message })
    return { ok: false, error: 'Failed to update key status' }
  }

  log.info('success', { licenseKeyId, by: user!.id, next })
  return { ok: true, status: next }
}

export async function revokeKey(licenseKeyId: string): Promise<KeyStatusResult> {
  return setKeyStatus(licenseKeyId, 'revoked')
}

export async function unrevokeKey(licenseKeyId: string): Promise<KeyStatusResult> {
  return setKeyStatus(licenseKeyId, 'active')
}

// ---------------------------------------------------------------------------
// Notes editing — invoked from the row-detail modal.
// ---------------------------------------------------------------------------

const NOTES_MAX_LENGTH = 1000

export type UpdateNotesResult = { ok: true; notes: string | null } | { ok: false; error: string }

export async function updateKeyNotes(
  licenseKeyId: string,
  notes: string,
): Promise<UpdateNotesResult> {
  const log = logger('admin.keys.notes_update')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) {
    log.warn('forbidden', { userId: user?.id ?? null })
    return { ok: false, error: 'Forbidden' }
  }
  if (!UUID_RE.test(licenseKeyId)) {
    return { ok: false, error: 'Invalid identifier' }
  }
  if (notes.length > NOTES_MAX_LENGTH) {
    return { ok: false, error: `Notes must be ${NOTES_MAX_LENGTH} characters or fewer` }
  }

  const trimmed = notes.trim()
  const value: string | null = trimmed.length === 0 ? null : trimmed

  const admin = createAdminClient()
  const { error } = await admin
    .from('license_keys')
    .update({ notes: value })
    .eq('id', licenseKeyId)

  if (error) {
    log.error('failed', { code: error.code, error: error.message })
    return { ok: false, error: 'Failed to update notes' }
  }

  log.info('success', { licenseKeyId, by: user!.id })
  return { ok: true, notes: value }
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

// ---------------------------------------------------------------------------
// Subscriptions panel — read-only views on the stripe_user_subscriptions
// mirror. All writes still happen through the Stripe webhook (so this surface
// is purely observational; nothing here mutates billing state).
// ---------------------------------------------------------------------------

export type SubscriptionRow = {
  id: string
  user_id: string
  email: string | null
  stripe_customer_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: string
  current_period_end: string | null
  cancel_at_period_end: boolean
  cancel_at: string | null
  canceled_at: string | null
  unit_amount: number | null
  currency: string | null
  recurring_interval: string | null
  recurring_interval_count: number | null
  created_at: string
  updated_at: string
}

export type ListSubscriptionsResult =
  | { ok: true; rows: SubscriptionRow[] }
  | { ok: false; error: string }

export async function listSubscriptions(): Promise<ListSubscriptionsResult> {
  const log = logger('admin.subscriptions.list')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) {
    log.warn('list.forbidden', { userId: user?.id ?? null })
    return { ok: false, error: 'Forbidden' }
  }

  const admin = createAdminClient()

  const [subsResult, usersResult] = await Promise.all([
    admin
      .from('stripe_user_subscriptions')
      .select(
        'id, user_id, stripe_customer_id, stripe_subscription_id, stripe_price_id, status, current_period_end, cancel_at_period_end, cancel_at, canceled_at, unit_amount, currency, recurring_interval, recurring_interval_count, created_at, updated_at',
      )
      .order('created_at', { ascending: false })
      .limit(500),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ])

  if (subsResult.error) {
    log.error('list.subs_failed', { error: subsResult.error.message })
    return { ok: false, error: 'Failed to load subscriptions' }
  }
  if (usersResult.error) {
    log.error('list.users_failed', { error: usersResult.error.message })
    return { ok: false, error: 'Failed to load users' }
  }

  const emailById = new Map<string, string | null>()
  for (const u of usersResult.data.users) emailById.set(u.id, u.email ?? null)

  const rows: SubscriptionRow[] = (subsResult.data ?? []).map((r) => ({
    id: r.id,
    user_id: r.user_id,
    email: emailById.get(r.user_id) ?? null,
    stripe_customer_id: r.stripe_customer_id,
    stripe_subscription_id: r.stripe_subscription_id,
    stripe_price_id: r.stripe_price_id,
    status: r.status,
    current_period_end: r.current_period_end,
    cancel_at_period_end: r.cancel_at_period_end,
    cancel_at: r.cancel_at,
    canceled_at: r.canceled_at,
    unit_amount: r.unit_amount,
    currency: r.currency,
    recurring_interval: r.recurring_interval,
    recurring_interval_count: r.recurring_interval_count,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }))

  return { ok: true, rows }
}
