import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth/admin'
import { redirect } from 'next/navigation'
import './admin.css'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdmin(user)) redirect('/')

  return (
    <div className="admin-root">
      <header className="admin-header">
        <Link href="/" className="admin-logo" aria-label="ENDEX home">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <circle cx="18" cy="18" r="12" fill="rgba(255,255,255,0.1)" stroke="#fff" strokeWidth="1.5" />
            <path d="M8 8L28 28M28 8L8 28" stroke="#c8102e" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
          <div>
            <div className="admin-logo-wordmark">
              <span className="endex-e">ENDE</span>
              <span className="endex-x">X</span>
            </div>
            <div className="admin-logo-sub">Administrative Console</div>
          </div>
        </Link>

        <Link href="/" className="admin-back" aria-label="Return to home">
          <span className="admin-back-arrow" aria-hidden="true">←</span>
          <span>Back to app</span>
        </Link>
      </header>

      {children}

      <div className="admin-footer">
        ENDEX Admin
      </div>
    </div>
  )
}
