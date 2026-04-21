'use client'

import { useState } from 'react'
import { RegistryPanel } from './RegistryPanel'
import { CreateKeyForm } from './CreateKeyForm'
import { AssignmentsPanel } from './AssignmentsPanel'
import type { KeyRow } from './KeysTable'

type Tab = 'registry' | 'issue' | 'assignments'

const TABS: { id: Tab; label: string }[] = [
  { id: 'registry',    label: 'Key Registry' },
  { id: 'issue',       label: 'Issue Key'    },
  { id: 'assignments', label: 'Assignments'  },
]

type Props = {
  rows: KeyRow[]
  errorMessage: string | null
}

export function AdminConsole({ rows, errorMessage }: Props) {
  const [tab, setTab] = useState<Tab>('registry')

  return (
    <>
      <nav className="admin-tabs-wrap" aria-label="Admin sections">
        <div className="admin-tabs">
          {TABS.map((t) => {
            const isActive = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`admin-tab${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <main className="admin-main">
        <div className="admin-panel" key={tab}>
          {tab === 'registry' && (
            <RegistryPanel
              rows={rows}
              errorMessage={errorMessage}
              onIssue={() => setTab('issue')}
            />
          )}
          {tab === 'issue' && (
            <section className="admin-card">
              <CreateKeyForm />
            </section>
          )}
          {tab === 'assignments' && <AssignmentsPanel keys={rows} />}
        </div>
      </main>
    </>
  )
}
