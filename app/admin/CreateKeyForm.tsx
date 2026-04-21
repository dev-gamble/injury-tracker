'use client'

import { useEffect, useState } from 'react'
import { createLicenseKey, type CreateKeyResult } from './actions'

const TIERS = [
  { value: 'demo',    label: 'Demo',    glyph: 'DMO' },
  { value: 'free',    label: 'Free',    glyph: 'FRE' },
  { value: 'full',    label: 'Full',    glyph: 'FUL' },
  { value: 'partner', label: 'Partner', glyph: 'PTR' },
] as const

type Tier = (typeof TIERS)[number]['value']

function formatTime() {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} · ${d.toISOString().slice(0,10)}`
}

function formatExpiresDisplay(iso: string | null) {
  if (!iso) return 'Never'
  try {
    const d = new Date(iso)
    return d.toISOString().replace('T', ' · ').slice(0, 19) + ' UTC'
  } catch {
    return iso
  }
}

export function CreateKeyForm() {
  const [tier, setTier] = useState<Tier>('demo')
  const [maxUses, setMaxUses] = useState('1')
  const [expiresAt, setExpiresAt] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CreateKeyResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [issuedAt, setIssuedAt] = useState<string>('')
  const [submittedExpires, setSubmittedExpires] = useState<string | null>(null)
  const [submittedTier, setSubmittedTier] = useState<Tier>('demo')
  const [submittedMaxUses, setSubmittedMaxUses] = useState<number>(1)

  useEffect(() => {
    if (result?.ok) setIssuedAt(formatTime())
  }, [result])

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
    const expiresIso = expiresAt ? new Date(expiresAt).toISOString() : null
    const parsedMaxUses = parseInt(maxUses, 10)
    const res = await createLicenseKey({
      tier,
      maxUses: parsedMaxUses,
      expiresAt: expiresIso,
      notes: notes.trim() || null,
    })
    if (res.ok) {
      setSubmittedExpires(expiresIso)
      setSubmittedTier(tier)
      setSubmittedMaxUses(parsedMaxUses)
    }
    setResult(res)
    setLoading(false)
    if (res.ok) {
      setNotes('')
    }
  }

  async function handleCopy() {
    if (!result?.ok) return
    try {
      await navigator.clipboard.writeText(result.rawKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available; user can still select+copy manually
    }
  }

  function handleIssueAnother() {
    setResult(null)
    setCopied(false)
    setTier('demo')
    setMaxUses('1')
    setExpiresAt('')
  }

  if (result?.ok) {
    return (
      <div className="admin-issued">
        <div className="admin-issued-head">
          <span className="admin-issued-head-left">
            <span className="admin-issued-seal" aria-hidden="true" />
            Credential Issued
          </span>
          <span className="admin-issued-time">{issuedAt}</span>
        </div>

        <div className="admin-issued-body">
          <div className="admin-issued-stamp" aria-hidden="true">ISSUED</div>

          <div className="admin-issued-label">License Key — Record &amp; Transmit Once</div>
          <div className="admin-key-display" role="code" aria-label="License key">
            {result.rawKey}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`admin-key-copy${copied ? ' is-copied' : ''}`}
          >
            <span className="admin-key-copy-glyph">{copied ? '✓' : '⧉'}</span>
            {copied ? 'Copied to clipboard' : 'Copy to clipboard'}
          </button>

          <div className="admin-issued-meta">
            <div className="admin-meta-row">
              <span className="admin-meta-key">Tier</span>
              <span className={`admin-meta-val val-tier-${submittedTier}`}>{submittedTier}</span>
            </div>
            <div className="admin-meta-row">
              <span className="admin-meta-key">Max uses</span>
              <span className="admin-meta-val">{submittedMaxUses}</span>
            </div>
            <div className="admin-meta-row">
              <span className="admin-meta-key">Expires</span>
              <span className="admin-meta-val">{formatExpiresDisplay(submittedExpires)}</span>
            </div>
            <div className="admin-meta-row">
              <span className="admin-meta-key">Prefix</span>
              <span className="admin-meta-val">{result.keyPrefix}</span>
            </div>
            <div className="admin-meta-row" style={{ gridColumn: '1 / -1' }}>
              <span className="admin-meta-key">Record ID</span>
              <span className="admin-meta-val">{result.id}</span>
            </div>
          </div>
        </div>

        <div className="admin-warning" role="alert">
          <span className="admin-warning-glyph" aria-hidden="true">!</span>
          <span>
            <strong>Final view.</strong><br />
            Only the SHA-256 hash is stored. Leaving this page discards the raw key permanently — we cannot recover it. Confirm the recipient has it before moving on.
          </span>
        </div>

        <div className="admin-issued-actions">
          <span className="admin-submit-hint">Key captured?</span>
          <button type="button" onClick={handleIssueAnother} className="admin-btn-ghost">
            Issue another
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="admin-card-head">
        <div className="admin-form-id">
          <span>Form AX-001 · License Credential</span>
          <span className="admin-form-id-right">Restricted</span>
        </div>
        <h1 className="admin-card-title">Issue Access Key</h1>
        <p className="admin-card-subtitle">
          Generate a new license key. The raw value is rendered once on success and is not recoverable afterwards. Hand it off through a secure channel immediately.
        </p>
      </div>
      <div className="admin-card-body">
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-field">
          <span className="admin-label">Access tier</span>
          <div className="admin-tier-group" role="radiogroup" aria-label="Access tier">
            {TIERS.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={tier === t.value}
                onClick={() => setTier(t.value)}
                className={`admin-tier-btn${tier === t.value ? ' is-active' : ''}`}
              >
                <span>{t.label}</span>
                <span className="admin-tier-glyph">{t.glyph}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-row-2">
          <div className="admin-field">
            <label htmlFor="maxUses" className="admin-label">Max uses</label>
            <input
              id="maxUses"
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              required
              className="admin-input admin-input-mono"
              placeholder="1"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="expiresAt" className="admin-label">
              Expires at
              <span className="admin-label-opt">(optional)</span>
            </label>
            <input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="admin-input admin-input-mono"
            />
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="notes" className="admin-label">
            Notes
            <span className="admin-label-opt">(shown only to admins)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Acme VSO — Spring 2026 pilot, contact: jane@acme.org"
            className="admin-textarea"
          />
        </div>

        {result && !result.ok && (
          <p className="admin-error" role="alert">{result.error}</p>
        )}

        <div className="admin-submit-row">
          <span className="admin-submit-hint">Irrevocable once issued</span>
          <button type="submit" disabled={loading} className="admin-submit">
            <span>{loading ? 'Generating…' : 'Generate key'}</span>
            <span className="admin-submit-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </form>
      </div>
    </>
  )
}
