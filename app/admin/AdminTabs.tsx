'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/admin/keys',       label: 'Key Registry' },
  { href: '/admin/keys/issue', label: 'Issue Key'    },
] as const

export function AdminTabs() {
  const pathname = usePathname() || ''
  // Exact match for registry; startsWith for issue so /admin/keys/issue/* would also count.
  const activeHref =
    pathname === '/admin/keys' || pathname === '/admin/keys/'
      ? '/admin/keys'
      : pathname.startsWith('/admin/keys/issue')
        ? '/admin/keys/issue'
        : ''

  return (
    <div className="admin-tabs">
      {TABS.map((tab) => {
        const isActive = tab.href === activeHref
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`admin-tab${isActive ? ' is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
