'use client'

import { useTracker } from '../../../hooks/useTrackerStore'

export function PersonalStatementTab() {
  const { state, dispatch } = useTracker()
  const { personalStatement, injuries, mentalHealthConditions, headConditions, bpConditions } = state

  // Auto-generate a starter template
  function generateTemplate() {
    const parts: string[] = []
    parts.push('I am submitting this personal statement in support of my VA disability claim.')
    parts.push('')

    if (injuries.length > 0) {
      parts.push('Physical Injuries / Conditions:')
      injuries.forEach(inj => {
        const line = [`- ${inj.label}`]
        if (inj.severity !== 'mild') line[0] += ` (${inj.severity})`
        if (inj.event) line.push(`  Cause: ${inj.event}`)
        if (inj.installation) line.push(`  Location: ${inj.installation}`)
        if (inj.dailyImpact) line.push(`  Daily Impact: ${inj.dailyImpact}`)
        parts.push(line.join('\n'))
      })
      parts.push('')
    }

    const allMH = mentalHealthConditions
    if (allMH.length > 0) {
      parts.push('Mental Health Conditions:')
      allMH.forEach(c => {
        parts.push(`- ${c.condition}`)
        if (c.event) parts.push(`  Related event: ${c.event}`)
      })
      parts.push('')
    }

    const allHead = headConditions
    if (allHead.length > 0) {
      parts.push('Head / Face Conditions:')
      allHead.forEach(c => parts.push(`- ${c.condition}`))
      parts.push('')
    }

    const bpConds = Object.values(bpConditions).flat()
    if (bpConds.length > 0) {
      parts.push('Other Service-Connected Conditions:')
      bpConds.forEach(c => parts.push(`- ${c.condition} (${c.sideLabel || 'N/A'})`))
      parts.push('')
    }

    parts.push('These conditions significantly impact my daily life, work capacity, and overall well-being. I respectfully request the VA consider this statement in evaluating my claim.')

    dispatch({ type: 'SET_PERSONAL_STATEMENT', statement: parts.join('\n') })
  }

  const wordCount = personalStatement.trim()
    ? personalStatement.trim().split(/\s+/).length
    : 0

  return (
    <div className="content">
      <div className="tab-instructions">
        <strong>Personal Statement (Buddy/Lay Statement)</strong> — Write your personal account of how your
        service-connected conditions affect your life. This is submitted with your claim as a lay statement
        (VA Form 21-4142 or buddy statement). Be specific about daily limitations, pain levels,
        and how conditions interfere with work, sleep, and relationships.
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--fm)' }}>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </div>
        <button className="btn-s" style={{ fontSize: 12, padding: '7px 14px' }} onClick={generateTemplate}>
          Generate Template from My Data
        </button>
      </div>

      <textarea
        value={personalStatement}
        onChange={e => dispatch({ type: 'SET_PERSONAL_STATEMENT', statement: e.target.value })}
        placeholder="Write your personal statement here. Describe in your own words how each condition affects your daily life, ability to work, relationships, sleep, and overall well-being.

Tips for a strong statement:
• Be specific — describe actual activities you can no longer do or that cause pain
• Include frequency and duration of symptoms
• Mention how conditions have changed over time
• Describe any medications and their side effects
• Connect each condition to your military service"
        style={{
          width: '100%',
          minHeight: 480,
          padding: '14px 16px',
          border: '1px solid var(--border2)',
          borderRadius: 6,
          fontFamily: 'var(--fd)',
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text)',
          background: 'var(--surface)',
          resize: 'vertical',
          outline: 'none',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--navy)'; e.target.style.boxShadow = '0 0 0 3px rgba(10,35,87,.1)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none' }}
      />

      <div style={{ marginTop: 10, padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, fontSize: 12, color: '#92400e' }}>
        <strong>Note:</strong> Your personal statement is one of the most important pieces of evidence in your
        claim. The VA rater will read it. Be honest, specific, and thorough. There is no word limit.
      </div>
    </div>
  )
}
