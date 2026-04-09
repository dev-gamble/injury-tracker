import type { EvalProfile } from '../types'

export const SYSTEMIC_PROFILES: Record<string, EvalProfile> = {
  fibromyalgia: {
    label: 'Fibromyalgia (DC 5025)',
    domains: [
      {
        id: 'severity', label: 'Overall Severity',
        description: 'Frequency of symptoms and response to treatment.',
        levels: [
          { value: 10, label: 'Continuous medication needed',    description: 'Symptoms controlled by continuous medication.' },
          { value: 20, label: 'Episodic, with exacerbations',    description: 'Episodic, with exacerbations often precipitated by environmental or emotional stress or by overexertion, but symptoms that are present more than one-third of the time.' },
          { value: 40, label: 'Constant or nearly constant',     description: 'Widespread musculoskeletal pain and tender points, with or without associated fatigue, sleep disturbance, stiffness, paresthesias, headache, irritable bowel symptoms, depression, anxiety, or Raynaud\'s-like symptoms that are constant or nearly so and not responding to therapy.' },
        ],
      },
    ],
  },
  cfs: {
    label: 'Chronic Fatigue Syndrome (DC 6354)',
    domains: [
      {
        id: 'severity', label: 'Functional Limitation',
        description: 'Degree of activity restriction and incapacitating episodes per year.',
        levels: [
          { value: 10,  label: 'Nearly constant but able to function',  description: 'Debilitating fatigue, cognitive impairments, or other symptoms nearly constant and restrict routine daily activities by less than 25%; or incapacitating episodes totaling at least 1 but less than 2 weeks per year.' },
          { value: 20,  label: 'Routine activities restricted 25-50%',  description: 'Symptoms restrict routine daily activities to 50–75% of pre-illness level; or incapacitating episodes totaling at least 2 but less than 4 weeks per year.' },
          { value: 40,  label: 'Routine activities restricted 50-75%',  description: 'Symptoms restrict routine daily activities to less than 50% of pre-illness level; or incapacitating episodes totaling at least 4 but less than 6 weeks per year.' },
          { value: 60,  label: 'Nearly completely restricted',          description: 'Symptoms nearly completely restrict routine daily activities; or incapacitating episodes totaling at least 6 weeks per year.' },
          { value: 100, label: 'Completely debilitating',               description: 'Debilitating fatigue, cognitive impairments, and other symptoms that are completely debilitating, virtually restricting all routine daily activities.' },
        ],
      },
    ],
  },
  diabetes: {
    label: 'Diabetes Mellitus (DC 7913)',
    domains: [
      {
        id: 'management', label: 'Treatment & Management',
        description: 'Level of treatment required to manage diabetes.',
        levels: [
          { value: 10,  label: 'Manageable by diet alone',                      description: 'Manageable by restricted diet only.' },
          { value: 20,  label: 'Insulin and diet, or oral meds and diet',        description: 'Requiring insulin and restricted diet, or oral hypoglycemic agent and restricted diet.' },
          { value: 40,  label: 'Insulin, diet, and activity regulation',         description: 'Requiring insulin, restricted diet, and regulation of activities.' },
          { value: 60,  label: 'Insulin, diet, activity + hospitalizations',     description: 'Requiring insulin, restricted diet, and regulation of activities with dangerous blood sugar emergencies (ketoacidosis) or hypoglycemic reactions requiring 1–2 hospitalizations per year or twice-a-month provider visits, plus complications not separately compensable.' },
          { value: 100, label: 'More than one daily injection + complications',  description: 'Requiring more than one daily insulin injection, restricted diet, and regulation of activities with ketoacidosis or hypoglycemic reactions requiring at least 3 hospitalizations per year or weekly provider visits, plus progressive weight/strength loss or separately compensable complications.' },
        ],
      },
    ],
  },
  hypothyroid: {
    label: 'Hypothyroidism (DC 7903)',
    domains: [
      {
        id: 'severity', label: 'Symptom Severity',
        description: 'Degree of symptoms despite treatment. Includes Hashimoto\'s thyroiditis.',
        levels: [
          { value: 0,   label: 'Asymptomatic on medication',                      description: 'No symptoms; controlled by continuous medication.' },
          { value: 10,  label: 'Fatigability, or medication required',            description: 'Fatigability, or continuous medication required for control.' },
          { value: 30,  label: 'Fatigability, constipation, mental sluggishness', description: 'Fatigability, constipation, and mental sluggishness.' },
          { value: 60,  label: 'Muscular weakness, mental disturbance, weight gain', description: 'Muscular weakness, mental disturbance, and weight gain.' },
          { value: 100, label: 'Cold intolerance, cardiovascular involvement',    description: 'Cold intolerance, muscular weakness, cardiovascular involvement, mental disturbance, bradycardia (< 60 bpm), and sleepiness.' },
        ],
      },
    ],
  },
  hyperthyroid: {
    label: 'Hyperthyroidism / Graves\' Disease (DC 7900)',
    domains: [
      {
        id: 'severity', label: 'Symptom Severity',
        description: 'Degree of symptoms including tachycardia, tremor, and weight loss.',
        levels: [
          { value: 0,   label: 'Asymptomatic on medication',                         description: 'No symptoms; controlled by continuous medication.' },
          { value: 10,  label: 'Tachycardia, tremor, medication required',           description: 'Tachycardia (100+ bpm), which may be intermittent, and tremor, or continuous medication required for control.' },
          { value: 30,  label: 'Tachycardia, tremor, increased pulse/blood pressure', description: 'Tachycardia, tremor, and increased pulse pressure or blood pressure.' },
          { value: 60,  label: 'Emotional instability, weight loss, fatigability',   description: 'Emotional instability, tachycardia, fatigability, and increased pulse pressure or blood pressure.' },
          { value: 100, label: 'Thyroid enlargement, rapid/irregular pulse, cardiovascular', description: 'Thyroid enlargement, tachycardia (> 150 bpm), eye involvement, muscular weakness, weight loss, and sympathetic nervous system, cardiovascular, or GI symptoms.' },
        ],
      },
    ],
  },
  dermatitis: {
    label: 'Skin Conditions — Dermatitis / Eczema (DC 7806)',
    domains: [
      {
        id: 'area', label: 'Body Area Affected',
        description: 'Percentage of entire body or exposed areas affected.',
        levels: [
          { value: 0,  label: 'Less than 5% of body',       description: 'Less than 5% of entire body or exposed areas affected, and no more than topical therapy required during the past 12 months.' },
          { value: 10, label: '5–20% of body',              description: 'At least 5% but less than 20% of entire body or exposed areas affected, and intermittent systemic therapy required less than 6 weeks total during the past 12 months.' },
          { value: 30, label: '20–40% of body',             description: '20–40% of entire body or exposed areas affected, or systemic therapy required at least 6 weeks but not constantly during the past 12 months.' },
          { value: 60, label: 'More than 40% of body',      description: 'More than 40% of entire body or exposed areas affected, or constant or near-constant systemic therapy required during the past 12 months.' },
        ],
      },
    ],
  },
  scars: {
    label: 'Scars — Painful or Unstable (DC 7804)',
    domains: [
      {
        id: 'count', label: 'Number of Painful or Unstable Scars',
        description: 'Count of scars that are painful on examination and/or unstable (skin covering frequently breaks down).',
        levels: [
          { value: 0,  label: 'No painful or unstable scars', description: 'No scars that are painful on examination or unstable.' },
          { value: 10, label: '1 or 2 scars',                 description: 'One or two scars that are unstable or painful.' },
          { value: 20, label: '3 or 4 scars',                 description: 'Three or four scars that are unstable or painful.' },
          { value: 30, label: '5 or more scars',              description: 'Five or more scars that are unstable or painful.' },
        ],
      },
      {
        id: 'both', label: 'Both Painful AND Unstable?',
        description: 'If one or more scars are BOTH painful and unstable, an additional 10% is added per VA Note 2.',
        levels: [
          { value: 0,  label: 'No — painful only or unstable only', description: 'Scars are either painful or unstable, but not both.' },
          { value: 10, label: 'Yes — at least one scar is both',    description: 'One or more scars are both painful on examination AND unstable. VA adds 10% to the evaluation.' },
        ],
      },
    ],
  },
  burn_deep: {
    label: 'Burn Scars / Deep Scars (DC 7801)',
    domains: [
      {
        id: 'area', label: 'Total Area of Deep Scars',
        description: 'Combined area of all deep nonlinear scars (not on head/face/neck).',
        levels: [
          { value: 0,  label: 'Less than 6 sq in (39 sq cm)',     description: 'Total area less than 6 square inches (39 sq cm).' },
          { value: 10, label: '6–12 sq in (39–77 sq cm)',          description: 'Area at least 6 but less than 12 square inches (39–77 sq cm).' },
          { value: 20, label: '12–72 sq in (77–465 sq cm)',        description: 'Area at least 12 but less than 72 square inches (77–465 sq cm).' },
          { value: 30, label: '72–144 sq in (465–929 sq cm)',      description: 'Area at least 72 but less than 144 square inches (465–929 sq cm).' },
          { value: 40, label: '144+ sq in (929+ sq cm)',           description: 'Area of 144 square inches (929 sq cm) or greater.' },
        ],
      },
      {
        id: 'function', label: 'Limitation of Function',
        description: 'Does the scar cause limitation of motion or other functional loss?',
        levels: [
          { value: 0,  label: 'No functional limitation', description: 'Scar does not limit movement or function.' },
          { value: 10, label: 'Mild limitation',          description: 'Scar causes mild tightness or pulling that slightly limits range of motion.' },
          { value: 20, label: 'Moderate limitation',      description: 'Scar noticeably restricts movement of the affected body part.' },
          { value: 30, label: 'Severe limitation',        description: 'Scar severely restricts movement — may need to rate under the affected body part (DC 7805).' },
        ],
      },
    ],
  },
  burn_superficial: {
    label: 'Superficial Scars (DC 7802)',
    domains: [
      {
        id: 'area', label: 'Total Area of Superficial Scars',
        description: 'Combined area of all superficial nonlinear scars (not on head/face/neck).',
        levels: [
          { value: 0,  label: 'Less than 144 sq in (929 sq cm)', description: 'Total area less than 144 square inches (929 sq cm). Not compensable under DC 7802 — may still qualify under DC 7804 if painful or unstable.' },
          { value: 10, label: '144+ sq in (929+ sq cm)',          description: 'Area of 144 square inches (929 sq cm) or greater.' },
        ],
      },
    ],
  },
  epilepsy: {
    label: 'Seizure Disorder / Epilepsy (DC 8910–8914)',
    domains: [
      {
        id: 'major', label: 'Major Seizures (Grand Mal)',
        description: 'Full-body convulsive or other major seizure frequency over the past year.',
        levels: [
          { value: 0,   label: 'No major seizures',     description: 'No documented major seizures.' },
          { value: 20,  label: '1 in last 2 years',     description: 'At least 1 major seizure in the last 2 years.' },
          { value: 40,  label: '1 in last 6 months',    description: 'At least 1 major seizure in the last 6 months; or 2+ in last year.' },
          { value: 60,  label: '1 every 3 months',      description: 'Averaging at least 1 major seizure every 3 months over the last year.' },
          { value: 80,  label: '1 per month',           description: 'Averaging at least 1 major seizure per month over the last year.' },
          { value: 100, label: '1+ per week',           description: 'Averaging at least 1 major seizure per week over the last year.' },
        ],
      },
      {
        id: 'minor', label: 'Minor Seizures (Petit Mal / Absence)',
        description: 'Absence seizures, myoclonic jerks, or other minor seizure activity.',
        levels: [
          { value: 0,  label: 'No minor seizures',              description: 'No documented minor seizures.' },
          { value: 10, label: '1–2 minor seizures in 6 months', description: 'A confirmed minor seizure within the last 6 months.' },
          { value: 20, label: '2+ minor seizures in 6 months',  description: 'At least 2 minor seizures in the last 6 months.' },
          { value: 40, label: '5–8 minor seizures per week',    description: 'Averaging 5 to 8 minor seizures weekly.' },
          { value: 60, label: '10+ minor seizures per week',    description: 'Averaging more than 10 minor seizures weekly.' },
        ],
      },
    ],
  },
  lupus: {
    label: 'Systemic Lupus Erythematosus (DC 6350)',
    domains: [
      {
        id: 'severity', label: 'Disease Activity',
        description: 'Frequency of exacerbations and extent of organ involvement.',
        levels: [
          { value: 10,  label: 'Once or twice per year',       description: 'Exacerbations once or twice a year or symptomatic during the past 2 years.' },
          { value: 60,  label: 'Frequent exacerbations',       description: 'Exacerbations lasting a week or more, 2 to 3 times per year.' },
          { value: 100, label: 'Acute with frequent crises',   description: 'Acute, with frequent exacerbations, producing severe impairment of health; or constantly combating active lupus involving vital organs/body systems.' },
        ],
      },
    ],
  },
  ra: {
    label: 'Rheumatoid Arthritis (DC 5002)',
    domains: [
      {
        id: 'active', label: 'Active Disease Process',
        description: 'Whole-body symptoms during active disease (weight loss, anemia, overall impairment).',
        levels: [
          { value: 0,   label: 'No active disease',                       description: 'Inactive or in remission.' },
          { value: 20,  label: '1–2 flare-ups per year',                  description: 'One or two exacerbations a year in a well-established diagnosis.' },
          { value: 40,  label: 'Disabling symptom combinations',          description: 'Symptom combinations causing definite impairment of health, or disabling flare-ups 3+ times per year.' },
          { value: 60,  label: 'Weight loss and anemia, severely disabling', description: 'Weight loss and anemia causing severe impairment of health, or severely disabling flare-ups 4+ times per year.' },
          { value: 100, label: 'Totally disabling active disease',        description: 'Whole-body constitutional manifestations associated with active joint involvement, totally disabling.' },
        ],
      },
    ],
  },
  htn: {
    label: 'Hypertension (DC 7101)',
    domains: [
      {
        id: 'severity', label: 'Blood Pressure Severity',
        description: 'Based on diastolic and systolic blood pressure readings.',
        levels: [
          { value: 0,  label: 'Controlled on medication',   description: 'Blood pressure controlled to normal limits with medication; no history of diastolic 100+.' },
          { value: 10, label: 'Diastolic 100+ or systolic 160+', description: 'Diastolic predominantly 100 or more, or systolic predominantly 160 or more; or minimum evaluation for history of diastolic 100+ requiring continuous medication.' },
          { value: 20, label: 'Diastolic 110+ or systolic 200+', description: 'Diastolic predominantly 110 or more, or systolic predominantly 200 or more.' },
          { value: 40, label: 'Diastolic 120+',              description: 'Diastolic predominantly 120 or more.' },
          { value: 60, label: 'Diastolic 130+',              description: 'Diastolic predominantly 130 or more.' },
        ],
      },
    ],
  },
  raynauds: {
    label: 'Raynaud\'s Syndrome (DC 7117)',
    domains: [
      {
        id: 'severity', label: 'Attack Frequency & Severity',
        description: 'Frequency of characteristic attacks and extent of digital involvement.',
        levels: [
          { value: 10,  label: '1–3 attacks per week',                           description: 'Characteristic attacks occurring 1–3 times a week.' },
          { value: 20,  label: '4–6 attacks per week',                           description: 'Characteristic attacks occurring 4–6 times a week.' },
          { value: 40,  label: 'Daily attacks',                                  description: 'Characteristic attacks occurring at least daily.' },
          { value: 60,  label: '2+ digital ulcers, autoamputation',              description: 'Two or more digital ulcers and history of characteristic attacks, including autoamputation of one or more digits.' },
          { value: 100, label: '2+ ulcers + autoamputation + critical ischemia', description: 'Two or more digital ulcers plus autoamputation of one or more digits and history of characteristic attacks.' },
        ],
      },
    ],
  },
  gerd: {
    label: 'GERD / Hiatal Hernia (DC 7346)',
    domains: [
      {
        id: 'severity', label: 'Symptom Severity',
        description: 'Frequency and severity of reflux symptoms.',
        levels: [
          { value: 10, label: 'Two or more mild symptoms',                  description: 'Two or more of the symptoms for the 30% evaluation of less severity.' },
          { value: 30, label: 'Persistent dysphagia, heartburn, regurgitation', description: 'Persistently recurrent symptoms with difficulty swallowing, heartburn, and regurgitation, accompanied by substernal or arm/shoulder pain, causing considerable impairment of health.' },
          { value: 60, label: 'Pain, vomiting, significant weight loss, anemia', description: 'Pain, vomiting, significant weight loss and hematemesis or melena with moderate anemia; or other symptom combinations causing severe impairment of health.' },
        ],
      },
    ],
  },
  ed: {
    label: 'Erectile Dysfunction (DC 7522)',
    domains: [
      {
        id: 'severity', label: 'Severity of Dysfunction',
        description: 'Degree of erectile dysfunction or loss of creative organ.',
        levels: [
          { value: 0,  label: 'Erectile dysfunction present',           description: 'Loss of erectile power; rated 0% but eligible for SMC-K (~$120/month) for loss of use of a creative organ.' },
          { value: 20, label: 'Penile deformity with loss of erectile power', description: 'Deformity of the penis with loss of erectile power.' },
          { value: 30, label: 'Removal of half or more of penis',       description: 'Removal of half or more of the penis.' },
        ],
      },
      {
        id: 'organ', label: 'Loss of Creative Organ',
        description: 'Loss or removal of a creative organ (testicle, ovary).',
        levels: [
          { value: 0,  label: 'No loss',                         description: 'No loss or removal of a creative organ.' },
          { value: 20, label: 'Removal of one testicle',         description: 'Removal of one testicle.' },
          { value: 30, label: 'Removal of both testicles / complete loss', description: 'Removal of both testicles, or complete atrophy.' },
        ],
      },
    ],
  },
  parkinsons: {
    label: 'Parkinson\'s Disease (DC 8004)',
    domains: [
      {
        id: 'severity', label: 'Disease Severity',
        description: 'Overall functional impairment from Parkinson\'s symptoms. Minimum 30%.',
        levels: [
          { value: 30,  label: 'Minimum rating',       description: 'Mild symptoms: slight tremor, minor rigidity, minimal impact on daily activities.' },
          { value: 60,  label: 'Moderately severe',    description: 'Significant tremor and/or rigidity, bradykinesia, balance problems, noticeable impact on daily activities and employment.' },
          { value: 100, label: 'Complete disability',  description: 'Pronounced tremor, severe rigidity, significant postural instability, unable to perform most daily activities independently.' },
        ],
      },
    ],
  },
  ms: {
    label: 'Multiple Sclerosis (DC 8018)',
    domains: [
      {
        id: 'severity', label: 'Disease Severity',
        description: 'Overall functional impairment from MS symptoms. Minimum 30%.',
        levels: [
          { value: 30,  label: 'Minimum rating',       description: 'Mild symptoms: fatigue, occasional numbness/tingling, minor balance issues.' },
          { value: 60,  label: 'Moderately severe',    description: 'Significant fatigue, muscle weakness, coordination problems, bladder dysfunction, cognitive fog impacting work.' },
          { value: 100, label: 'Complete disability',  description: 'Severe mobility impairment, significant cognitive decline, requires assistance; or rated on individual residuals if higher.' },
        ],
      },
    ],
  },
  mg: {
    label: 'Myasthenia Gravis (DC 8025)',
    domains: [
      {
        id: 'severity', label: 'Disease Severity',
        description: 'Degree of muscular weakness and functional impairment. Minimum 30%.',
        levels: [
          { value: 30,  label: 'Minimum rating',       description: 'Mild weakness: intermittent ptosis, mild diplopia, fatigable muscles, generally manageable.' },
          { value: 60,  label: 'Moderately severe',    description: 'Difficulty chewing/swallowing, limb weakness, respiratory muscle involvement requiring medication adjustments.' },
          { value: 100, label: 'Severe / crisis-prone', description: 'Myasthenic crises, significant respiratory compromise, inability to perform daily activities, frequent hospitalizations.' },
        ],
      },
    ],
  },
  gbs: {
    label: 'Guillain-Barré Syndrome (by analogy)',
    domains: [
      {
        id: 'severity', label: 'Residual Severity',
        description: 'Degree of residual weakness and nerve damage after acute phase.',
        levels: [
          { value: 10,  label: 'Mild residuals',                   description: 'Mild residual weakness or numbness; mostly recovered; minor functional impact.' },
          { value: 30,  label: 'Moderate residuals',               description: 'Moderate residual weakness in extremities; balance problems; fatigue; noticeable impact on daily activities.' },
          { value: 60,  label: 'Severe residuals',                 description: 'Significant residual paralysis or weakness; requires assistive devices; substantial functional impairment.' },
          { value: 100, label: 'Complete or near-complete paralysis', description: 'Severe residual paralysis; wheelchair-bound or bedridden; requires assistance for daily activities.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Other / Systemic — General',
    domains: [
      {
        id: 'severity', label: 'Overall Severity',
        description: 'General severity of the systemic condition.',
        levels: [
          { value: 0,  label: 'None',        description: 'No significant impairment.' },
          { value: 10, label: 'Mild',        description: 'Mild impairment with occasional symptoms.' },
          { value: 20, label: 'Moderate',    description: 'Moderate impairment affecting daily activities.' },
          { value: 30, label: 'Severe',      description: 'Severe impairment with significant limitation.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment.' },
        ],
      },
    ],
  },
}

export const SYSTEMIC_CONDITION_PROFILE: Record<string, string> = {
  'Fibromyalgia': 'fibromyalgia',
  'Chronic fatigue syndrome': 'cfs',
  'Chronic pain syndrome': 'generic',
  'Diabetes mellitus': 'diabetes',
  'Diabetes mellitus, Type 1': 'diabetes',
  'Diabetes mellitus, Type 2': 'diabetes',
  'Hypothyroidism': 'hypothyroid',
  'Hashimoto\'s thyroiditis': 'hypothyroid',
  'Hyperthyroidism': 'hyperthyroid',
  'Graves\' disease': 'hyperthyroid',
  'Addison\'s disease': 'generic',
  'Cushing\'s syndrome': 'generic',
  'Hyperparathyroidism': 'generic',
  'Dermatitis or eczema': 'dermatitis',
  'Psoriasis': 'dermatitis',
  'Acne vulgaris': 'dermatitis',
  'Chronic urticaria': 'dermatitis',
  'Contact dermatitis': 'dermatitis',
  'Seborrheic dermatitis': 'dermatitis',
  'Pseudofolliculitis barbae': 'dermatitis',
  'Folliculitis': 'dermatitis',
  'Hidradenitis suppurativa': 'dermatitis',
  'Alopecia areata': 'dermatitis',
  'Vitiligo': 'dermatitis',
  'Chloracne': 'dermatitis',
  'Tinea pedis (athlete\'s foot)': 'dermatitis',
  'Hyperhidrosis': 'dermatitis',
  'Scar(s), unstable or painful': 'scars',
  'Keloid scarring': 'scars',
  'Burn scar(s)': 'burn_deep',
  'Skin cancer (basal cell, squamous cell, melanoma)': 'dermatitis',
  'Seizure disorder (epilepsy)': 'epilepsy',
  'Epilepsy': 'epilepsy',
  'Systemic lupus erythematosus (SLE)': 'lupus',
  'Lupus': 'lupus',
  'Rheumatoid arthritis': 'ra',
  'Hypertension': 'htn',
  'Raynaud\'s syndrome': 'raynauds',
  'Raynaud\'s phenomenon': 'raynauds',
  'GERD / acid reflux': 'gerd',
  'Hiatal hernia': 'gerd',
  'Erectile dysfunction': 'ed',
  'Loss of use of creative organ': 'ed',
  'Parkinson\'s disease': 'parkinsons',
  'Multiple sclerosis': 'ms',
  'Myasthenia gravis': 'mg',
  'Guillain-Barré syndrome': 'gbs',
  'Other systemic condition': 'generic',
}

export function getSystemicProfile(name: string): EvalProfile {
  return SYSTEMIC_PROFILES[SYSTEMIC_CONDITION_PROFILE[name] ?? 'generic'] ?? SYSTEMIC_PROFILES.generic
}
export function getSystemicProfileKey(name: string): string {
  return SYSTEMIC_CONDITION_PROFILE[name] ?? 'generic'
}
export function calculateSystemicRating(domainValues: Record<string, number>): number {
  return Math.max(0, ...Object.values(domainValues).filter(v => typeof v === 'number'))
}
