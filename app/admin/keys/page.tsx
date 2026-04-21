import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth/admin'
import { redirect } from 'next/navigation'
import { CreateKeyForm } from './CreateKeyForm'

export const dynamic = 'force-dynamic'

export default async function AdminKeysPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Middleware already guards /admin, but re-check here as defense-in-depth.
  if (!isAdmin(user)) redirect('/')

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Issue a new license key</h1>
      <p style={{ color: '#666', marginTop: '-0.5rem' }}>
        The raw key is shown <strong>once</strong> after creation. Copy it immediately — it cannot be retrieved later.
      </p>
      <CreateKeyForm />
    </main>
  )
}
