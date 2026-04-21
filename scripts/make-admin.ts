#!/usr/bin/env tsx
/**
 * make-admin.ts - Promote a user to admin by setting app_metadata.role.
 *
 * Usage:
 *   npm run make-admin -- <email>
 *   npx tsx scripts/make-admin.ts <email>
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SECRET_KEY
 */

import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { resolve } from 'path'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Usage: npx tsx scripts/make-admin.ts <email>')
    process.exit(1)
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY
  if (!url || !secret) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Find the user. The admin listUsers API paginates; scan until we hit it.
  let userId: string | undefined
  let page = 1
  while (!userId) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (match) {
      userId = match.id
      break
    }
    if (data.users.length < 200) break
    page += 1
  }

  if (!userId) {
    console.error(`No user found with email: ${email}`)
    process.exit(1)
  }

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { role: 'admin' },
  })
  if (error) throw error

  console.log(`✓ ${email} is now an admin (user_id: ${userId})`)
  console.log('  They must sign out and back in for the new role to appear in their JWT.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
