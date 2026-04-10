"use client"

import { useState, useCallback } from 'react'
import { useInjuryStore } from '../store/useInjuryStore'
import type { MSTData, MSTPrimaryCondition } from '../types'

// ── STATIC DATA ───────────────────────────────────────────────────────────────

const MST_CONDITIONS = [
  'PTSD', 'Major Depressive Disorder', 'Generalized Anxiety Disorder',
  'Panic Disorder', 'Adjustment Disorder', 'Insomnia / Sleep Disturbance',
  'Substance Use Disorder', 'Eating Disorder', 'Sexual Dysfunction / Pain',
  'Chronic Pelvic Pain', 'Irritable Bowel Syndrome (stress-related)',
  'Somatic Symptom Disorder', 'Other condition related to MST',
]

const MST_EVIDENCE_TYPES = [
  { id: 'buddy', label: 'Buddy statement(s) from someone you told' },
  { id: 'behavioral', label: 'Behavioral changes in service records (performance drop, discipline issues, etc.)' },
  { id: 'police', label: 'Police or military police report' },
  { id: 'counseling', label: 'Counseling or therapy records' },
  { id: 'medical', label: 'Medical records showing treatment' },
  { id: 'performance', label: 'Performance evaluations showing decline after the event' },
  { id: 'transfer', label: 'Transfer, duty change, or reassignment requests' },
  { id: 'pregnancy', label: 'Pregnancy or STI testing records' },
  { id: 'journal', label: 'Personal journal or diary entries' },
  { id: 'other', label: 'Other supporting evidence' },
]

const MST_SECONDARY_SUGGESTIONS: Record<string, string[]> = {
  'PTSD': ['Sleep Apnea', 'Migraines', 'Hypertension', 'Bruxism (Teeth Grinding)', 'Tinnitus', 'GERD / Acid Reflux', 'Erectile Dysfunction', 'Weight Gain / Obesity'],
  'Major Depressive Disorder': ['Sleep Apnea', 'Migraines', 'Weight Gain / Obesity', 'Chronic Fatigue', 'Erectile Dysfunction', 'Fibromyalgia'],
  'Generalized Anxiety Disorder': ['Migraines', 'Hypertension', 'GERD / Acid Reflux', 'Irritable Bowel Syndrome', 'Bruxism (Teeth Grinding)'],
  'Panic Disorder': ['Migraines', 'Hypertension', 'GERD / Acid Reflux', 'Chest Pain (Non-cardiac)'],
  'Insomnia / Sleep Disturbance': ['Sleep Apnea', 'Chronic Fatigue', 'Migraines', 'Weight Gain / Obesity'],
  'Substance Use Disorder': ['Liver Disease', 'Peripheral Neuropathy', 'GERD / Acid Reflux', 'Hypertension'],
  'Eating Disorder': ['GERD / Acid Reflux', 'Dental Conditions', 'Malnutrition-related Conditions'],
  '_default': ['Sleep Apnea', 'Migraines', 'Hypertension', 'Chronic Fatigue', 'GERD / Acid Reflux', 'Erectile Dysfunction'],
}

const SMC_LEVELS = [
  { id: 'smc_k', label: 'SMC-K: Loss of Body Part', description: "You've lost (or lost the use of) a body part — a reproductive organ, one hand, one foot, both buttocks, a breast, or sight in one eye. This extra payment gets added on top of your regular disability check. You can receive more than one SMC-K if multiple body parts are affected. Also commonly awarded with erectile dysfunction (ED) ratings." },
  { id: 'smc_l', label: 'SMC-L: Aid & Attendance', description: "You need someone to help you with everyday tasks — bathing, getting dressed, eating, or using the bathroom — because of your service-connected disabilities. Also applies if you are bedridden or blind from service-connected conditions. You do NOT need a 100% rating to qualify — you just need to show you need daily help." },
  { id: 'smc_l_half', label: 'SMC-L½: Aid & Attendance + Body Part Loss', description: "You already qualify for Aid & Attendance (SMC-L) AND you've also lost or lost the use of a hand, foot, or eye on top of that. This bumps your payment higher because you have both the daily help need AND a physical loss." },
  { id: 'smc_m', label: 'SMC-M: Higher Level of Care', description: "You need more help than a regular caregiver can provide — like skilled nursing or someone with medical training. This is for veterans whose daily care needs go beyond what family or a basic aide can handle." },
  { id: 'smc_m_half', label: 'SMC-M½: Higher Care + Additional Loss', description: "You qualify for the higher level of care (SMC-M) AND have additional body part losses on top of your care needs. A step up from M because of the combined severity." },
  { id: 'smc_n', label: 'SMC-N: Multiple Losses + Aid & Attendance', description: "You need Aid & Attendance AND have lost or lost use of multiple body parts — such as two hands, two feet, one of each, or a combination with blindness." },
  { id: 'smc_n_half', label: 'SMC-N½: Severe Multiple Losses', description: "You have losses and care needs that go beyond N level. Multiple severe body part losses plus Aid & Attendance needs that are especially impactful." },
  { id: 'smc_o', label: 'SMC-O: Maximum Regular SMC', description: "The highest regular SMC level. This is for veterans with multiple severe body part losses or conditions so severe they require the most intensive ongoing care." },
  { id: 'smc_r1', label: 'SMC-R.1: Higher A&A (TBI / Severe Conditions)', description: "You need regular daily help specifically because of a traumatic brain injury (TBI) or conditions so severe that standard Aid & Attendance isn't enough." },
  { id: 'smc_r2', label: 'SMC-R.2: Hospitalization / Nursing Home Level', description: "You need ongoing hospitalization or nursing home-level care because of your service-connected conditions. This is the highest SMC payment level." },
  { id: 'smc_s', label: 'SMC-S: Housebound', description: "One of your conditions is rated at 100% AND your other conditions combine to at least 60% on their own (without the 100% condition). OR your disabilities physically keep you confined to your home and immediate area." },
]

const PRESUMPTIVE_CLAIMS = [
  { id: 'pow', label: 'Prisoner of War (POW)', description: "If you were a prisoner of war, the VA automatically assumes certain conditions were caused by your time in captivity — you don't have to prove the connection yourself. This includes PTSD, anxiety, arthritis, heart disease, stroke, liver disease, and more. You still need a current diagnosis, but the hardest part (proving it's connected to service) is done for you.", fields: [
    { id: 'dates', label: 'When were you held?', placeholder: 'e.g., Mar 1968 - Jan 1969' },
    { id: 'location', label: 'Where were you held?', placeholder: 'e.g., Hanoi, Vietnam' },
    { id: 'duration', label: 'How long?', placeholder: 'e.g., 10 months' },
    { id: 'conditions', label: 'Conditions you believe are related', placeholder: 'e.g., PTSD, arthritis, heart disease' },
  ]},
  { id: 'agent_orange', label: 'Agent Orange / Herbicide Exposure', description: "If you served somewhere the military used Agent Orange or other herbicides, certain conditions are automatically connected to your service. Covered conditions include Type 2 diabetes, heart disease, Parkinson's, bladder cancer, prostate cancer, lung cancer, and more.", fields: [
    { id: 'dates', label: 'When did you serve there?', placeholder: 'e.g., Jun 1967 - Aug 1968' },
    { id: 'location', label: 'Where did you serve?', placeholder: 'e.g., Da Nang, Vietnam / Korat RTAFB, Thailand' },
    { id: 'unit', label: 'Unit (optional)', placeholder: 'e.g., 1st Infantry Division' },
    { id: 'conditions', label: 'Conditions you believe are related', placeholder: 'e.g., Type 2 diabetes, prostate cancer' },
  ]},
  { id: 'gulf_war', label: 'Gulf War / Southwest Asia Illness', description: "If you served in Southwest Asia (Iraq, Kuwait, Saudi Arabia, etc.) from 1990 to now, you may qualify even WITHOUT a specific diagnosis. Unexplained symptoms lasting 6+ months can count on their own.", fields: [
    { id: 'dates', label: 'When did you serve there?', placeholder: 'e.g., Jan 1991 - May 1991' },
    { id: 'location', label: 'Where did you serve?', placeholder: 'e.g., Kuwait, Saudi Arabia' },
    { id: 'unit', label: 'Unit (optional)', placeholder: 'e.g., 3rd Armored Division' },
    { id: 'symptoms', label: 'Unexplained symptoms you experience', placeholder: 'e.g., chronic fatigue, joint pain, headaches' },
  ]},
  { id: 'burn_pit', label: 'Burn Pit / PACT Act Exposure', description: "The PACT Act (2022) automatically connects certain cancers and breathing problems to burn pit and toxic exposure. This covers post-9/11 veterans who served near burn pits in Iraq, Afghanistan, and other locations.", fields: [
    { id: 'dates', label: 'When did you serve there?', placeholder: 'e.g., Mar 2004 - Feb 2005' },
    { id: 'location', label: 'Where did you serve?', placeholder: 'e.g., Balad Air Base, Iraq' },
    { id: 'unit', label: 'Unit (optional)', placeholder: 'e.g., 332nd Air Expeditionary Wing' },
    { id: 'exposure', label: 'What were you exposed to?', placeholder: 'e.g., burn pits, oil well fires, depleted uranium' },
    { id: 'conditions', label: 'Conditions you believe are related', placeholder: 'e.g., chronic bronchitis, sinusitis' },
  ]},
]

const PHYSICAL_LOSS_ITEMS = [
  { id: 'loss_extremity', label: 'Loss of Use of Extremity', description: '"Loss of use" means your hand, foot, or limb basically doesn\'t work anymore — even if it\'s still physically attached. If you\'d be just as well off with a prosthetic, the VA considers it "lost." This gets rated at the same level as if the limb was actually amputated, and often qualifies you for extra SMC payments on top.' },
  { id: 'loss_paired', label: 'Loss of Paired Organ', description: 'When both sides of a paired body part are affected (both eyes, both ears, both kidneys, both hands, etc.), special rules can increase your compensation — even if only ONE side was damaged in service.' },
]

const VOCATIONAL_CONDITIONS = [
  'Difficulty maintaining employment', 'Unable to perform physical labor',
  'Unable to perform sedentary work', 'Frequent absences due to conditions',
  'Reduced work hours / part-time only', 'Loss of prior career / MOS-related work',
  'Difficulty with retraining / new skills', 'Social / interpersonal workplace difficulties',
  'Combat-related occupational limitations', 'Agent Orange related conditions',
  'Gulf War illness related limitations', 'Burn pit / toxic exposure related',
]

const RATING_VALUES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 100]

// ── HELPERS ───────────────────────────────────────────────────────────────────

function ratingColors(rating: number) {
  if (rating >= 70) return { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
  if (rating >= 30) return { color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
  if (rating > 0) return { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' }
  return { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' }
}

// ── MST CONDITION CARD ────────────────────────────────────────────────────────

function MSTCondCard({
  cond, index, mstData, privacyShield, onUpdate,
}: {
  cond: MSTPrimaryCondition
  index: number
  mstData: MSTData
  privacyShield: boolean
  onUpdate: (newMst: MSTData) => void
}) {
  const [customSec, setCustomSec] = useState('')
  const displayName = privacyShield ? 'Private Condition' : cond.name
  const clr = ratingColors(cond.rating)
  const suggestions = MST_SECONDARY_SUGGESTIONS[cond.name] ?? MST_SECONDARY_SUGGESTIONS['_default']
  const availableSecs = suggestions.filter((s) => !cond.secondaries.find((x) => x.name === s))

  function updateConditions(updater: (conds: MSTPrimaryCondition[]) => MSTPrimaryCondition[]) {
    onUpdate({ ...mstData, conditions: updater([...mstData.conditions]) })
  }

  const removeCondition = () => {
    updateConditions((conds) => conds.filter((_, i) => i !== index))
  }

  const setRating = (val: string) => {
    updateConditions((conds) => conds.map((c, i) => i === index ? { ...c, rating: parseInt(val) } : c))
  }

  const addSecondary = (name: string) => {
    if (!name.trim() || cond.secondaries.find((s) => s.name === name)) return
    updateConditions((conds) => conds.map((c, i) => i === index
      ? { ...c, secondaries: [...c.secondaries, { name, rating: 10 }] } : c))
  }

  const removeSecondary = (j: number) => {
    updateConditions((conds) => conds.map((c, i) => i === index
      ? { ...c, secondaries: c.secondaries.filter((_, si) => si !== j) } : c))
  }

  const setSecRating = (j: number, val: string) => {
    updateConditions((conds) => conds.map((c, i) => i === index
      ? { ...c, secondaries: c.secondaries.map((s, si) => si === j ? { ...s, rating: parseInt(val) } : s) } : c))
  }

  return (
    <div className="cr-primary" style={{ marginTop: 10 }}>
      <div className="cr-primary-head">
        <div className="cr-primary-info">
          <span className="cr-dot" style={{ background: clr.color }} />
          {privacyShield && <span className="mst-lock-icon">&#128274; </span>}
          <div className="cr-primary-name">{displayName}</div>
        </div>
        <div className="cr-primary-actions">
          <span className="cr-rating-badge" style={{ background: clr.bg, color: clr.color, border: `1px solid ${clr.border}` }}>{cond.rating}%</span>
          <select style={{ padding: '4px 6px', borderRadius: 5, border: '1px solid var(--border)', fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--navy)', cursor: 'pointer' }}
            value={cond.rating} onChange={(e) => setRating(e.target.value)}>
            {RATING_VALUES.map((v) => <option key={v} value={v}>{v}%</option>)}
          </select>
          <button className="cr-sec-rm" onClick={removeCondition} title="Remove">&times;</button>
        </div>
      </div>

      {/* Current secondaries */}
      {cond.secondaries.length > 0 && (
        <div className="cr-secondaries">
          {cond.secondaries.map((sec, j) => {
            const secClr = ratingColors(sec.rating)
            const secDisplay = privacyShield ? 'Private Secondary' : sec.name
            return (
              <div key={j} className="cr-secondary">
                <div className="cr-sec-head">
                  <div className="cr-sec-info">
                    <span className="cr-sec-line" />
                    <span className="cr-sec-dot" style={{ background: secClr.color }} />
                    <span className="cr-sec-name">{privacyShield && <span className="mst-lock-icon">&#128274; </span>}{secDisplay}</span>
                  </div>
                  <div className="cr-sec-actions">
                    <span className="cr-rating-badge cr-rating-sm" style={{ background: secClr.bg, color: secClr.color, border: `1px solid ${secClr.border}` }}>{sec.rating}%</span>
                    <select style={{ padding: '3px 5px', borderRadius: 4, border: '1px solid var(--border)', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--navy)', cursor: 'pointer' }}
                      value={sec.rating} onChange={(e) => setSecRating(j, e.target.value)}>
                      {RATING_VALUES.map((v) => <option key={v} value={v}>{v}%</option>)}
                    </select>
                    <button className="cr-sec-rm" onClick={() => removeSecondary(j)}>&times;</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Secondary suggestions */}
      <div className="cr-add-sec">
        {availableSecs.length > 0 && (
          <div className="cr-suggest">
            <div className="cr-suggest-title">Veterans commonly also claim with <strong>{displayName}</strong>:</div>
            <div className="cr-suggest-chips">
              {availableSecs.map((name) => (
                <button key={name} className="cr-suggest-chip" onClick={() => addSecondary(name)}>
                  <span className="cr-suggest-plus">+</span> {name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="cr-custom-row">
          <input type="text" className="cr-custom-input" placeholder="Custom secondary..."
            value={customSec} onChange={(e) => setCustomSec(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { addSecondary(customSec); setCustomSec('') } }} />
          <button className="cr-custom-btn" onClick={() => { addSecondary(customSec); setCustomSec('') }}>Add</button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function SpecialTab() {
  const activeTab = useInjuryStore((s) => s.ui.activeTab)
  const specialClaims = useInjuryStore((s) => s.specialClaims)
  const setSpecialClaims = useInjuryStore((s) => s.setSpecialClaims)
  const setClaimField = useInjuryStore((s) => s.setClaimField)
  const toggleSMC = useInjuryStore((s) => s.toggleSMC)
  const setPresumptiveField = useInjuryStore((s) => s.setPresumptiveField)

  const { vocSecondaries, vocNotes, smcSelections, presumptiveData, claims, mstData } = specialClaims

  const [vocCustom, setVocCustom] = useState('')
  const [mstCustomCond, setMstCustomCond] = useState('')

  const isClaimed = (id: string) => claims[id]?.['selected'] === 'true'
  const toggleClaim = (id: string) => setClaimField(id, 'selected', isClaimed(id) ? 'false' : 'true')

  const isPresumptiveSelected = (id: string) => presumptiveData[id]?.['selected'] === 'true'
  const togglePresumptive = (id: string) => setPresumptiveField(id, 'selected', isPresumptiveSelected(id) ? 'false' : 'true')

  const addVoc = useCallback((s: string) => {
    if (!s || vocSecondaries.includes(s)) return
    setSpecialClaims({ vocSecondaries: [...vocSecondaries, s] })
  }, [vocSecondaries, setSpecialClaims])

  const removeVoc = useCallback((s: string) => {
    setSpecialClaims({ vocSecondaries: vocSecondaries.filter((v) => v !== s) })
  }, [vocSecondaries, setSpecialClaims])

  const updateMST = useCallback((patch: Partial<MSTData>) => {
    setSpecialClaims({ mstData: { ...mstData, ...patch } })
  }, [mstData, setSpecialClaims])

  const addMSTCondition = useCallback((name: string) => {
    if (!name.trim() || mstData.conditions.find((c) => c.name === name)) return
    updateMST({ conditions: [...mstData.conditions, { name, rating: 30, secondaries: [] }] })
  }, [mstData, updateMST])

  const isMSTExpanded = isClaimed('mst')
  const availableMSTConds = MST_CONDITIONS.filter((n) => !mstData.conditions.find((c) => c.name === n))
  const availableSMC = SMC_LEVELS.filter((s) => !smcSelections.includes(s.id))

  return (
    <div id="tab-special" className={`content${activeTab !== 'special' ? ' hidden' : ''}`}>
      <div className="tl-bar">
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--fh)', textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--navy)' }}>
          Vocational, War-Related &amp; Special Claims
        </div>
      </div>
      <div className="tab-instructions">
        Add claims related to your job, combat service, or special circumstances. This includes things
        like <strong>combat-related conditions</strong>,{' '}
        <strong>Military Sexual Trauma (MST)</strong>, Agent Orange exposure, burn pit exposure, and
        Gulf War illness. These claims have special rules that can help your case.
      </div>

      {/* 1. VOCATIONAL CONDITIONS */}
      <div className="sp-section">
        <div className="sp-section-title">Vocational Conditions</div>
        <div className="sp-section-desc">Document how your service-connected conditions affect your ability to work.</div>

        {vocSecondaries.length > 0 && (
          <div className="sp-chips">
            {vocSecondaries.map((s) => (
              <span key={s} className="sc-chip">
                <span>{s}</span>
                <span className="sc-rm" onClick={() => removeVoc(s)}>&times;</span>
              </span>
            ))}
          </div>
        )}

        <select className="cr-add-select" style={{ marginTop: 8 }}
          value="" onChange={(e) => { if (e.target.value) { addVoc(e.target.value); e.target.value = '' } }}>
          <option value="">+ Add vocational condition...</option>
          {VOCATIONAL_CONDITIONS.filter((s) => !vocSecondaries.includes(s)).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="cr-custom-row" style={{ marginTop: 8 }}>
          <input type="text" className="cr-custom-input" placeholder="Custom vocational condition..."
            value={vocCustom} onChange={(e) => setVocCustom(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { addVoc(vocCustom); setVocCustom('') } }} />
          <button className="cr-custom-btn" onClick={() => { addVoc(vocCustom); setVocCustom('') }}>Add</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: 'var(--fh)' }}>Vocational Notes</label>
          <textarea
            placeholder="Document how service-connected conditions affect employment..."
            value={vocNotes}
            onChange={(e) => setSpecialClaims({ vocNotes: e.target.value })}
            style={{ width: '100%', minHeight: 60, marginTop: 4, padding: 10, borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--fm)', fontSize: 12, resize: 'vertical', display: 'block', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* 2. SMC — EXTRA MONTHLY PAYMENTS */}
      <div className="sp-section">
        <div className="sp-section-title">Extra Monthly Payments (SMC)</div>
        <div className="sp-section-desc">Special Monthly Compensation is extra money added on top of your regular disability check. These are NOT percentage ratings — they are flat payments for specific situations. Select any that apply.</div>

        {smcSelections.length > 0 && (
          <div className="smc-cards">
            {smcSelections.map((id) => {
              const smc = SMC_LEVELS.find((s) => s.id === id)
              if (!smc) return null
              return (
                <div key={id} className="smc-card">
                  <div className="smc-card-head">
                    <span className="smc-card-label">{smc.label}</span>
                    <button className="smc-rm" onClick={() => toggleSMC(id)} title="Remove">&times;</button>
                  </div>
                  <div className="smc-card-desc">{smc.description}</div>
                </div>
              )
            })}
          </div>
        )}

        {availableSMC.length > 0 && (
          <select className="cr-add-select" style={{ marginTop: 8 }}
            value="" onChange={(e) => { if (e.target.value) { toggleSMC(e.target.value); e.target.value = '' } }}>
            <option value="">+ Add SMC level...</option>
            {availableSMC.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        )}
      </div>

      {/* 3. PRESUMPTIVE SERVICE CONNECTION */}
      <div className="sp-section">
        <div className="sp-section-title">Presumptive Service Connection</div>
        <div className="sp-section-desc">These are shortcuts — if you served in certain places or situations, the VA automatically assumes your conditions were caused by your service. Check any that apply and enter your service details.</div>

        {PRESUMPTIVE_CLAIMS.map((claim) => {
          const selected = isPresumptiveSelected(claim.id)
          const data = presumptiveData[claim.id] ?? {}
          return (
            <div key={claim.id}>
              <div className={`sp-claim${selected ? ' sp-claim-active' : ''}`} onClick={() => togglePresumptive(claim.id)}>
                <div className="sp-claim-head">
                  <input type="checkbox" checked={selected} readOnly onClick={(e) => { e.stopPropagation(); togglePresumptive(claim.id) }} />
                  <span className="sp-claim-label">{claim.label}</span>
                </div>
                <div className="sp-claim-desc">{claim.description}</div>
              </div>
              {selected && (
                <div className="presumptive-details" onClick={(e) => e.stopPropagation()}>
                  <div className="presumptive-details-title">Your Service Details</div>
                  {claim.fields.map((f) => (
                    <div key={f.id} className="presumptive-field">
                      <label className="presumptive-field-label">{f.label}</label>
                      <input
                        type="text"
                        className="presumptive-field-input"
                        value={data[f.id] ?? ''}
                        placeholder={f.placeholder}
                        onChange={(e) => setPresumptiveField(claim.id, f.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 4. PHYSICAL LOSS & PAIRED ORGANS */}
      <div className="sp-section">
        <div className="sp-section-title">Physical Loss &amp; Paired Organs</div>
        <div className="sp-section-desc">Special rules for when you&apos;ve lost the use of a body part or when both sides of a paired organ are affected.</div>
        {PHYSICAL_LOSS_ITEMS.map((item) => {
          const checked = isClaimed(item.id)
          return (
            <div key={item.id} className={`sp-claim${checked ? ' sp-claim-active' : ''}`} onClick={() => toggleClaim(item.id)}>
              <div className="sp-claim-head">
                <input type="checkbox" checked={checked} readOnly onClick={(e) => { e.stopPropagation(); toggleClaim(item.id) }} />
                <span className="sp-claim-label">{item.label}</span>
              </div>
              <div className="sp-claim-desc">{item.description}</div>
            </div>
          )
        })}
      </div>

      {/* 5. TRAUMA-BASED CLAIMS (MST) */}
      <div className="sp-section">
        <div className="sp-section-title">Trauma-Based Claims</div>
        <div className="sp-section-desc">Special claim pathways with relaxed evidence rules for sensitive experiences.</div>

        <div className={`sp-claim${isMSTExpanded ? ' sp-claim-active' : ''}`} onClick={() => toggleClaim('mst')}>
          <div className="sp-claim-head">
            <input type="checkbox" checked={isMSTExpanded} readOnly onClick={(e) => { e.stopPropagation(); toggleClaim('mst') }} />
            <span className="sp-claim-label">Military Sexual Trauma (MST)</span>
          </div>
          <div className="sp-claim-desc">
            MST is NOT rated on its own — it&apos;s a pathway to claim conditions CAUSED by the trauma (PTSD, depression, anxiety, physical issues). The big difference: you do NOT need to have reported the assault during service. The VA accepts buddy statements, behavior changes, counseling records, performance drops, and other indirect evidence. Both men and women can file.
          </div>
        </div>

        {isMSTExpanded && (
          <div className="mst-section" onClick={(e) => e.stopPropagation()}>
            {/* Privacy Shield */}
            <div className="mst-privacy-bar">
              <div className="mst-privacy-left">
                <span className="mst-privacy-icon">{mstData.privacyShield ? '&#128274;' : '&#128275;'}</span>
                <div>
                  <div className="mst-privacy-label">Privacy Shield</div>
                  <div className="mst-privacy-desc">
                    {mstData.privacyShield
                      ? 'ON — MST details are hidden throughout the app. Conditions show as "Private Condition" in ratings, timeline, and exports.'
                      : 'OFF — MST details are visible throughout the app. Toggle on to hide sensitive information.'}
                  </div>
                </div>
              </div>
              <label className="mst-toggle">
                <input type="checkbox" checked={mstData.privacyShield} onChange={() => updateMST({ privacyShield: !mstData.privacyShield })} />
                <span className="mst-toggle-slider" />
              </label>
            </div>

            {/* MST Conditions */}
            <div className="mst-subsection">
              <div className="mst-subsection-title">Conditions Caused by MST</div>

              {availableMSTConds.length > 0 && (
                <div className="cr-suggest">
                  <div className="cr-suggest-title">Common conditions caused by MST:</div>
                  <div className="cr-suggest-chips">
                    {availableMSTConds.map((name) => (
                      <button key={name} className="cr-suggest-chip" onClick={() => addMSTCondition(name)}>
                        <span className="cr-suggest-plus">+</span> {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mstData.conditions.map((cond, i) => (
                <MSTCondCard
                  key={`${cond.name}-${i}`}
                  cond={cond}
                  index={i}
                  mstData={mstData}
                  privacyShield={mstData.privacyShield}
                  onUpdate={(newMst) => setSpecialClaims({ mstData: newMst })}
                />
              ))}

              <div className="cr-custom-row" style={{ marginTop: 10 }}>
                <input type="text" className="cr-custom-input" placeholder="Other condition not listed..."
                  value={mstCustomCond} onChange={(e) => setMstCustomCond(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { addMSTCondition(mstCustomCond); setMstCustomCond('') } }} />
                <button className="cr-custom-btn" onClick={() => { addMSTCondition(mstCustomCond); setMstCustomCond('') }}>Add</button>
              </div>
            </div>

            {/* Evidence */}
            <div className="mst-subsection">
              <div className="mst-subsection-title">Evidence You Have</div>
              <div className="mst-subsection-desc">Check any evidence you have or can obtain. The VA has relaxed evidence rules for MST — you do NOT need all of these. Even one can support your claim.</div>
              {MST_EVIDENCE_TYPES.map((ev) => {
                const checked = mstData.evidence[ev.id] ?? false
                return (
                  <label key={ev.id} className={`mst-evidence-item${checked ? ' mst-evidence-checked' : ''}`}>
                    <input type="checkbox" checked={checked}
                      onChange={() => updateMST({ evidence: { ...mstData.evidence, [ev.id]: !checked } })} />
                    <span>{ev.label}</span>
                  </label>
                )
              })}
            </div>

            {/* Private Notes */}
            <div className="mst-subsection">
              <div className="mst-subsection-title">
                Private Notes {mstData.privacyShield && <span className="mst-lock-icon">&#128274;</span>}
              </div>
              <div className="mst-subsection-desc">
                For your personal reference only.{' '}
                {mstData.privacyShield
                  ? 'These notes are hidden when Privacy Shield is on and will not appear in exports.'
                  : 'Turn on Privacy Shield to hide these notes from exports.'}
              </div>
              <textarea
                placeholder="Your private notes..."
                value={mstData.notes}
                onChange={(e) => updateMST({ notes: e.target.value })}
                style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--fm)', fontSize: 12, resize: 'vertical', display: 'block', boxSizing: 'border-box' }}
              />
            </div>

            <div className="mst-reminder">
              <strong>Remember:</strong> The VA provides free MST-related treatment to ALL veterans — regardless of discharge status, disability rating, or whether you&apos;ve filed a claim.
              You can contact the VA MST coordinator at any VA medical center or call the Veterans Crisis Line at <strong>988</strong> (press 1).
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
