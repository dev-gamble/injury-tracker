'use client'

import { useState } from 'react'
import { createLicenseKey, type CreateKeyResult } from './actions'

const TIERS = ['demo', 'free', 'full', 'partner'] as const

export function CreateKeyForm() {
  const [tier, setTier] = useState<(typeof TIERS)[number]>('demo')
  const [maxUses, setMaxUses] = useState('1')
  const [expiresAt, setExpiresAt] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CreateKeyResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Strict digit check — <input type="number"> accepts "1e2", and
    // parseInt("1e2", 10) silently returns 1 instead of 100.
    if (!/^\d+$/.test(maxUses)) {
      setResult({ ok: false, error: 'Max uses must be a whole number (no decimals or scientific notation).' })
      return
    }
    setLoading(true)
    setResult(null)
    const res = await createLicenseKey({
      tier,
      maxUses: parseInt(maxUses, 10),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      notes: notes.trim() || null,
    })
    setResult(res)
    setLoading(false)
    if (res.ok) {
      setNotes('')
    }
  }

  if (result?.ok) {
    return (
      <div style={{ marginTop: '1.5rem', padding: '1rem', border: '2px solid #2a7', borderRadius: 8, background: '#f0fff4' }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Key created. Save this now — you will not see it again.</p>
        <pre style={{ fontSize: '1.25rem', padding: '0.75rem', background: '#fff', borderRadius: 4, border: '1px solid #ccc', marginTop: '0.75rem' }}>
          {result.rawKey}
        </pre>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
          ID: {result.id} · Prefix: {result.keyPrefix}
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          Issue another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
      <label>
        <div>Tier</div>
        <select value={tier} onChange={(e) => setTier(e.target.value as typeof tier)}>
          {TIERS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      <label>
        <div>Max uses</div>
        <input
          type="number"
          min={1}
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          required
        />
      </label>

      <label>
        <div>Expires at (optional)</div>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
      </label>

      <label>
        <div>Notes (optional)</div>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Partner: Acme VSO, Spring 2026 pilot"
        />
      </label>

      {result && !result.ok && (
        <p style={{ color: '#c00' }}>{result.error}</p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Generate key'}
      </button>
    </form>
  )
}
