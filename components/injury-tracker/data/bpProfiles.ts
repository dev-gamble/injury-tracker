// ── BODY PART EVALUATION PROFILES ─────────────────────────────────────────────

export interface BPLevel {
  value: number
  label: string
  description: string
}

export interface BPDomainDef {
  id: string
  label: string
  description: string
  levels: BPLevel[]
}

export interface BPProfile {
  label: string
  note?: string
  domains: BPDomainDef[]
}

// Generic physical profile — used as fallback for unmapped conditions
export const PHYSICAL_PROFILE: BPProfile = {
  label: 'Musculoskeletal / General Physical',
  domains: [
    { id: 'rom', label: 'Range of Motion / Function',
      description: 'How limited is your movement or physical function in this area?',
      levels: [
        { value: 0, label: 'Normal', description: 'Full range of motion, no functional limitation.' },
        { value: 10, label: 'Slight limitation', description: 'Minor restriction noticeable with strenuous activity; mostly functional.' },
        { value: 20, label: 'Moderate limitation', description: 'Noticeable restriction affecting some daily activities; compensating movements.' },
        { value: 30, label: 'Significant limitation', description: 'Movement substantially restricted; difficulty with routine tasks.' },
        { value: 50, label: 'Severe limitation', description: 'Major restriction; unable to perform most physical tasks in this area.' },
        { value: 100, label: 'Total loss / Ankylosis', description: 'No useful movement remaining; complete loss of function.' },
      ],
    },
    { id: 'pain', label: 'Pain Severity',
      description: 'Rate your typical pain level during daily activities.',
      levels: [
        { value: 0, label: 'No pain', description: 'No pain during normal activities.' },
        { value: 10, label: 'Mild', description: 'Occasional mild pain; manageable without medication.' },
        { value: 20, label: 'Moderate', description: 'Frequent pain requiring over-the-counter medication; affects some activities.' },
        { value: 30, label: 'Moderately severe', description: 'Constant or near-constant pain; prescription medication needed; limits many activities.' },
        { value: 50, label: 'Severe', description: 'Pain prevents most activities; requires strong medication or injections.' },
      ],
    },
    { id: 'daily', label: 'Impact on Daily Living',
      description: 'How does this condition affect your ability to work, exercise, and perform daily tasks?',
      levels: [
        { value: 0, label: 'No impact', description: 'Condition does not interfere with daily living.' },
        { value: 10, label: 'Minimal', description: 'Minor inconvenience; can perform all duties with slight difficulty.' },
        { value: 20, label: 'Moderate', description: 'Cannot perform some physical tasks; needs accommodation at work.' },
        { value: 30, label: 'Considerable', description: 'Significant limitation on employment and daily activities.' },
        { value: 50, label: 'Major', description: 'Unable to maintain substantially gainful employment due to this condition.' },
        { value: 100, label: 'Total', description: 'Completely dependent on others for daily living activities.' },
      ],
    },
  ],
}

// ── KNEE ──────────────────────────────────────────────────────────────────────
export const KNEE_PROFILES: Record<string, BPProfile> = {
  rom: {
    label: 'Range of Motion — How Far It Moves (DC 5260/5261)',
    domains: [
      { id: 'flexion', label: 'Bending (Flexion) — DC 5260',
        description: 'How far can the knee bend? Normal is 140+ degrees.',
        levels: [
          { value: 0, label: 'Normal (140°+)', description: 'Full bending (flexion), no limitation.' },
          { value: 10, label: 'Limited to 45°', description: 'Bending (flexion) limited to 45 degrees.' },
          { value: 20, label: 'Limited to 30°', description: 'Bending (flexion) limited to 30 degrees.' },
          { value: 30, label: 'Limited to 15°', description: 'Bending (flexion) limited to 15 degrees or less.' },
        ],
      },
      { id: 'extension', label: 'Straightening (Extension) — DC 5261',
        description: 'How far can the knee straighten? Normal is 0 degrees (fully straight).',
        levels: [
          { value: 0, label: 'Normal (0°)', description: 'Full straightening (extension), no limitation.' },
          { value: 10, label: 'Limited to 10°', description: 'Straightening (extension) limited to 10 degrees.' },
          { value: 20, label: 'Limited to 15°', description: 'Straightening (extension) limited to 15 degrees.' },
          { value: 30, label: 'Limited to 20°', description: 'Straightening (extension) limited to 20 degrees.' },
          { value: 40, label: 'Limited to 30°', description: 'Straightening (extension) limited to 30 degrees.' },
          { value: 50, label: 'Limited to 45°+', description: 'Straightening (extension) limited to 45 degrees or more.' },
        ],
      },
    ],
  },
  instability: {
    label: 'Instability / Partial Dislocation (DC 5257)',
    domains: [
      { id: 'instability', label: 'Recurrent Partial Dislocation or Lateral Instability',
        description: 'Severity of knee giving way, lateral instability, or recurrent partial dislocation.',
        levels: [
          { value: 0, label: 'None', description: 'No instability or partial dislocation.' },
          { value: 10, label: 'Slight', description: 'Slight recurrent partial dislocation (subluxation) or slight lateral instability.' },
          { value: 20, label: 'Moderate', description: 'Moderate recurrent partial dislocation (subluxation) or moderate lateral instability.' },
          { value: 30, label: 'Severe', description: 'Severe recurrent partial dislocation (subluxation) or severe lateral instability.' },
        ],
      },
    ],
  },
  meniscus: {
    label: 'Meniscus / Cartilage (DC 5258/5259)',
    domains: [
      { id: 'meniscus', label: 'Semilunar Cartilage Condition',
        description: 'Meniscus (cartilage) damage, locking, or surgical removal.',
        levels: [
          { value: 0, label: 'Asymptomatic', description: 'No symptoms or asymptomatic residuals following removal.' },
          { value: 10, label: 'Dislocated with locking', description: 'Dislocated semilunar cartilage with frequent episodes of locking, pain, and swelling from fluid in the joint (effusion).' },
          { value: 20, label: 'Symptomatic after removal', description: 'Symptomatic residuals following semilunar cartilage removal.' },
        ],
      },
    ],
  },
  replacement: {
    label: 'Knee Replacement (DC 5055)',
    domains: [
      { id: 'replacement', label: 'Prosthetic Knee Status',
        description: 'Current status after total or partial knee replacement surgery.',
        levels: [
          { value: 30, label: 'Minimum post-replacement', description: 'Minimum evaluation following prosthetic replacement (after initial 100% period).' },
          { value: 60, label: 'Chronic residuals', description: 'Chronic residuals: severe painful motion or weakness requiring assistive devices.' },
          { value: 100, label: 'Within 13 months of surgery', description: '100% rating for 13 months following prosthetic replacement of knee joint.' },
        ],
      },
    ],
  },
  arthritis: {
    label: 'Degenerative Arthritis (DC 5003)',
    domains: [
      { id: 'arthritis', label: 'Arthritis Severity',
        description: 'Degenerative arthritis confirmed by X-ray with limitation of motion.',
        levels: [
          { value: 0, label: 'X-ray only, no limitation', description: 'X-ray evidence of arthritis without painful or limited motion.' },
          { value: 10, label: 'Painful motion / minor limitation', description: 'X-ray evidence with painful motion or some limitation of motion.' },
          { value: 20, label: 'Significant limitation', description: 'X-ray evidence with more significant limitation of motion in the joint.' },
        ],
      },
    ],
  },
  generic: {
    label: 'General Knee Assessment',
    domains: [
      { id: 'severity', label: 'Overall Knee Condition Severity',
        description: 'General functional impact of this knee condition.',
        levels: [
          { value: 0, label: 'Asymptomatic', description: 'Condition present but no functional limitation.' },
          { value: 10, label: 'Mild', description: 'Mild symptoms with slight functional limitation.' },
          { value: 20, label: 'Moderate', description: 'Moderate symptoms with noticeable limitation.' },
          { value: 30, label: 'Moderately severe', description: 'Significant symptoms affecting daily activities.' },
          { value: 50, label: 'Severe', description: 'Severe symptoms substantially limiting function.' },
        ],
      },
    ],
  },
}

export const KNEE_CONDITION_PROFILE: Record<string, string> = {
  'Knee osteoarthritis': 'arthritis',
  'ACL tear / reconstruction': 'instability',
  'Meniscus tear': 'meniscus',
  'Patellar tendinitis': 'rom',
  'Patellofemoral syndrome': 'rom',
  'MCL / LCL sprain': 'instability',
  'Knee bursitis': 'generic',
  'Knee instability': 'instability',
  'Knee replacement (total)': 'replacement',
  "Baker's cyst": 'generic',
  'Chondromalacia patella': 'rom',
}

// ── BACK & SPINE ──────────────────────────────────────────────────────────────
export const SPINE_PROFILES: Record<string, BPProfile> = {
  thoracolumbar: {
    label: 'Thoracolumbar Spine Range of Motion (General Rating Formula)',
    domains: [
      { id: 'forward_flexion', label: 'Forward Bending (Flexion)',
        description: 'How far can you bend forward? Normal is 90 degrees.',
        levels: [
          { value: 0, label: 'Normal (90°)', description: 'Full forward bending (flexion), no limitation.' },
          { value: 10, label: 'Greater than 60° but ≤85°', description: 'Forward bending (flexion) greater than 60° but not greater than 85°; or combined range of motion >120° but ≤235°.' },
          { value: 20, label: 'Greater than 30° but ≤60°', description: 'Forward bending (flexion) greater than 30° but not greater than 60°; or combined range of motion ≤120°; or muscle spasm/guarding causing abnormal gait or contour.' },
          { value: 40, label: '30° or less', description: 'Forward bending (flexion) of the thoracolumbar spine 30° or less; or the spine is frozen/locked in a favorable position (favorable ankylosis).' },
          { value: 50, label: 'Spine frozen in unfavorable position', description: 'The entire thoracolumbar spine is frozen/locked in an unfavorable position (unfavorable ankylosis).' },
          { value: 100, label: 'Entire spine frozen', description: 'The entire spine is frozen/locked in an unfavorable position (unfavorable ankylosis of the entire spine).' },
        ],
      },
      { id: 'pain', label: 'Painful Motion / Spasm',
        description: 'Presence of painful motion, muscle spasm, or guarding.',
        levels: [
          { value: 0, label: 'None', description: 'No painful motion, spasm, or guarding.' },
          { value: 10, label: 'Painful motion / tenderness', description: 'Painful motion; or muscle spasm, guarding, or localized tenderness not resulting in abnormal gait.' },
          { value: 20, label: 'Spasm causing abnormal gait', description: 'Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour.' },
        ],
      },
      { id: 'radiculopathy', label: 'Nerve Pain / Numbness Traveling Down the Leg (Radiculopathy / Sciatica — DC 8520)',
        description: 'Nerve root involvement — numbness, tingling, pain, or weakness radiating into the legs',
        levels: [
          { value: 0, label: 'None', description: 'No nerve pain/numbness traveling down the leg (radiculopathy) or nerve involvement.' },
          { value: 10, label: 'Mild', description: 'Mild incomplete paralysis — intermittent numbness or tingling in the leg/foot.' },
          { value: 20, label: 'Moderate', description: 'Moderate incomplete paralysis — frequent numbness, pain radiating below the knee, mild foot weakness.' },
          { value: 40, label: 'Moderately Severe', description: 'Moderately severe incomplete paralysis — significant pain, noticeable muscle weakness, difficulty with toe/heel walking.' },
          { value: 60, label: 'Severe', description: 'Severe incomplete paralysis — marked muscle shrinkage/wasting (atrophy), foot drop, or significant loss of function.' },
          { value: 80, label: 'Complete', description: 'Complete paralysis — foot dangles and drops, no active movement possible below the knee, ability to bend (flex) the knee weakened or lost.' },
        ],
      },
    ],
  },
  ivds: {
    label: 'Intervertebral Disc Syndrome (DC 5243)',
    note: 'Rate based on flare-ups bad enough to keep you in bed, as prescribed by a physician.',
    domains: [
      { id: 'episodes', label: 'Flare-Ups Bad Enough to Keep You in Bed (past 12 months)',
        description: 'Total duration of flare-ups bad enough to keep you in bed (incapacitating episodes) requiring bed rest prescribed by a physician during past 12 months.',
        levels: [
          { value: 0, label: 'None', description: 'No flare-ups requiring bed rest in past 12 months.' },
          { value: 10, label: '1-2 weeks total', description: 'At least 1 week but less than 2 weeks total duration.' },
          { value: 20, label: '2-4 weeks total', description: 'At least 2 weeks but less than 4 weeks total duration.' },
          { value: 40, label: '4-6 weeks total', description: 'At least 4 weeks but less than 6 weeks total duration.' },
          { value: 60, label: '6+ weeks total', description: 'At least 6 weeks total duration. Highest schedular evaluation for IVDS.' },
        ],
      },
    ],
  },
  generic: {
    label: 'General Spine Assessment',
    domains: [
      { id: 'severity', label: 'Overall Spine Condition Severity',
        description: 'General functional impact of this spine/back condition.',
        levels: [
          { value: 0, label: 'Asymptomatic', description: 'Condition present but no functional limitation.' },
          { value: 10, label: 'Mild', description: 'Mild symptoms with slight functional limitation.' },
          { value: 20, label: 'Moderate', description: 'Moderate symptoms with noticeable limitation.' },
          { value: 30, label: 'Moderately severe', description: 'Significant symptoms affecting daily activities.' },
          { value: 50, label: 'Severe', description: 'Severe symptoms substantially limiting function.' },
        ],
      },
    ],
  },
}

export const SPINE_CONDITION_PROFILE: Record<string, string> = {
  'Lumbar strain / sprain': 'thoracolumbar',
  'Lumbar disc herniation': 'thoracolumbar',
  'Lumbar radiculopathy / sciatica': 'thoracolumbar',
  'Degenerative disc disease (lumbar)': 'thoracolumbar',
  'Spinal stenosis (lumbar)': 'thoracolumbar',
  'Thoracic strain': 'thoracolumbar',
  'Compression fracture': 'thoracolumbar',
  'Sacroiliac joint dysfunction': 'thoracolumbar',
  'Ankylosing spondylitis': 'thoracolumbar',
  'Intervertebral disc syndrome (IVDS)': 'ivds',
  'Scoliosis': 'thoracolumbar',
}

// ── SHOULDER ──────────────────────────────────────────────────────────────────
export const SHOULDER_PROFILES: Record<string, BPProfile> = {
  rom: {
    label: 'Limitation of Motion (DC 5201)',
    domains: [
      { id: 'motion', label: 'Arm Motion at Shoulder',
        description: 'How far can you raise your arm? Rated by limitation of motion.',
        levels: [
          { value: 0, label: 'Normal (full overhead)', description: 'Full range of motion, no limitation.' },
          { value: 20, label: 'At shoulder level', description: 'Motion limited to shoulder level (90°).' },
          { value: 30, label: 'Midway (side to shoulder)', description: 'Motion limited to midway between side and shoulder level (~45°).' },
          { value: 40, label: 'To 25° from side', description: 'Motion limited to 25° from side. Significant functional loss.' },
        ],
      },
    ],
  },
  instability: {
    label: 'Instability / Dislocation (DC 5202)',
    domains: [
      { id: 'instability', label: 'Recurrent Dislocation or Impairment',
        description: 'Humerus impairment: recurrent dislocation, malunion, or nonunion.',
        levels: [
          { value: 0, label: 'None', description: 'No instability, dislocation, or impairment.' },
          { value: 20, label: 'Infrequent dislocation', description: 'Recurrent dislocation with infrequent episodes; guarding only at shoulder level.' },
          { value: 30, label: 'Frequent dislocation', description: 'Recurrent dislocation with frequent episodes and guarding of all arm movements.' },
          { value: 50, label: 'Fibrous union', description: 'Fibrous union of the humerus.' },
          { value: 60, label: 'Nonunion (false flail)', description: 'Nonunion of the humerus (false flail joint).' },
          { value: 80, label: 'Loss of head (flail)', description: 'Loss of head of the humerus (flail shoulder).' },
        ],
      },
    ],
  },
  clavicle: {
    label: 'Clavicle / Scapula (DC 5203)',
    domains: [
      { id: 'clavicle', label: 'Clavicle or Scapula Impairment',
        description: 'Impairment of the clavicle or scapula.',
        levels: [
          { value: 0, label: 'None / Malunion only', description: 'No impairment or malunion of clavicle/scapula.' },
          { value: 10, label: 'Nonunion without loose movement', description: 'Nonunion of clavicle or scapula without loose movement.' },
          { value: 20, label: 'Nonunion with loose movement / Dislocation', description: 'Nonunion with loose movement; or dislocation of clavicle or scapula.' },
        ],
      },
    ],
  },
  generic: {
    label: 'General Shoulder Assessment',
    domains: [
      { id: 'severity', label: 'Overall Shoulder Condition Severity',
        description: 'General functional impact of this shoulder condition.',
        levels: [
          { value: 0, label: 'Asymptomatic', description: 'No functional limitation.' },
          { value: 10, label: 'Mild', description: 'Mild symptoms with slight limitation.' },
          { value: 20, label: 'Moderate', description: 'Moderate symptoms with noticeable limitation.' },
          { value: 30, label: 'Moderately severe', description: 'Significant symptoms affecting daily activities.' },
          { value: 50, label: 'Severe', description: 'Severe symptoms substantially limiting function.' },
        ],
      },
    ],
  },
}

export const SHOULDER_CONDITION_PROFILE: Record<string, string> = {
  'Rotator cuff tear / tendinopathy': 'rom',
  'Shoulder impingement': 'rom',
  'Shoulder instability / dislocation': 'instability',
  'Labral tear (SLAP)': 'rom',
  'Frozen shoulder (adhesive capsulitis)': 'rom',
  'AC joint separation': 'clavicle',
  'Shoulder arthritis': 'rom',
  'Shoulder bursitis': 'generic',
  'Shoulder fracture': 'instability',
}

// ── NECK ──────────────────────────────────────────────────────────────────────
export const NECK_PROFILES: Record<string, BPProfile> = {
  cervical: {
    label: 'Cervical Spine (DC 5237-5243)',
    note: 'Rated using the General Rating Formula for Diseases and Injuries of the Spine — cervical segment.',
    domains: [
      { id: 'rom', label: 'Range of Motion (How Far It Moves)',
        description: 'Forward bending and combined range of motion of the cervical spine',
        levels: [
          { value: 0, label: 'Normal', description: 'Forward bending (flexion) greater than 40°, combined range of motion greater than 335°.' },
          { value: 10, label: 'Mild', description: 'Forward bending (flexion) greater than 30° but not greater than 40°, or combined range of motion greater than 170° but not greater than 335°.' },
          { value: 20, label: 'Moderate', description: 'Forward bending (flexion) greater than 15° but not greater than 30°, or combined range of motion not greater than 170°.' },
          { value: 30, label: 'Severe', description: 'Forward bending (flexion) 15° or less, or the entire cervical spine is frozen/locked in a favorable position (favorable ankylosis).' },
          { value: 40, label: 'Very Severe', description: 'The entire cervical spine is frozen/locked in an unfavorable position (unfavorable ankylosis).' },
          { value: 100, label: 'Total', description: 'The entire spine is frozen/locked in an unfavorable position (unfavorable ankylosis of the entire spine).' },
        ],
      },
      { id: 'pain', label: 'Pain / Functional Loss',
        description: 'Pain on movement, guarding, muscle spasm, abnormal gait',
        levels: [
          { value: 0, label: 'None', description: 'No additional functional loss due to pain.' },
          { value: 10, label: 'Mild', description: 'Painful motion without significant functional loss.' },
          { value: 20, label: 'Moderate', description: 'Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour.' },
        ],
      },
      { id: 'radiculopathy', label: 'Nerve Pain / Numbness Traveling Down the Arm (Radiculopathy)',
        description: 'Nerve root involvement — numbness, tingling, weakness in arms',
        levels: [
          { value: 0, label: 'None', description: 'No nerve pain/numbness traveling down the arm (radiculopathy).' },
          { value: 20, label: 'Mild', description: 'Mild incomplete paralysis of affected nerve group.' },
          { value: 30, label: 'Moderate', description: 'Moderate incomplete paralysis.' },
          { value: 40, label: 'Moderately Severe', description: 'Moderately severe incomplete paralysis.' },
          { value: 50, label: 'Severe', description: 'Severe incomplete paralysis with marked muscle shrinkage/wasting (atrophy).' },
          { value: 70, label: 'Complete', description: 'Complete paralysis of affected nerve group.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Neck — General',
    domains: [
      { id: 'severity', label: 'Overall Severity',
        description: 'General severity of the neck condition',
        levels: [
          { value: 0, label: 'None', description: 'No significant impairment.' },
          { value: 10, label: 'Mild', description: 'Mild impairment with occasional symptoms.' },
          { value: 20, label: 'Moderate', description: 'Moderate impairment affecting daily activities.' },
          { value: 30, label: 'Severe', description: 'Severe impairment with significant limitation.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment, near-constant symptoms.' },
        ],
      },
    ],
  },
}

export const NECK_CONDITION_PROFILE: Record<string, string> = {
  'Cervical strain / sprain': 'cervical',
  'Cervical radiculopathy': 'cervical',
  'Cervical disc disease (DDD)': 'cervical',
  'Cervical spinal stenosis': 'cervical',
  'Cervical vertebral fracture': 'cervical',
  'Whiplash injury': 'cervical',
  'Cervical spondylosis': 'cervical',
  'Torticollis': 'cervical',
  'Neck muscle spasm': 'cervical',
}

// ── HIP ───────────────────────────────────────────────────────────────────────
export const HIP_PROFILES: Record<string, BPProfile> = {
  rom: {
    label: 'Hip Range of Motion (DC 5252/5253)',
    note: 'Rated based on limitation of flexion and extension of the thigh.',
    domains: [
      { id: 'flexion', label: 'Limitation of Bending (Flexion)',
        description: 'Limitation of bending (flexion) of the thigh (DC 5252)',
        levels: [
          { value: 0, label: 'Normal', description: 'Bending (flexion) greater than 45°.' },
          { value: 10, label: 'Mild', description: 'Bending (flexion) limited to 45°.' },
          { value: 20, label: 'Moderate', description: 'Bending (flexion) limited to 30°.' },
          { value: 30, label: 'Severe', description: 'Bending (flexion) limited to 20°.' },
          { value: 40, label: 'Very Severe', description: 'Bending (flexion) limited to 10°.' },
        ],
      },
      { id: 'extension', label: 'Limitation of Straightening (Extension)',
        description: 'Limitation of straightening (extension) of the thigh (DC 5251)',
        levels: [
          { value: 0, label: 'Normal', description: 'Straightening (extension) not limited to 5°.' },
          { value: 10, label: 'Mild', description: 'Straightening (extension) limited to 5°.' },
        ],
      },
      { id: 'abduction', label: 'Limitation of Spreading/Moving Outward (Abduction)',
        description: 'Limitation of spreading/moving outward (abduction), moving inward (adduction), or rotation (DC 5253)',
        levels: [
          { value: 0, label: 'Normal', description: 'Can cross legs, no motion lost beyond 10°.' },
          { value: 10, label: 'Mild', description: 'Cannot cross legs or cannot toe-out more than 15°.' },
          { value: 20, label: 'Moderate', description: 'Motion lost beyond 10°.' },
        ],
      },
    ],
  },
  replacement: {
    label: 'Hip Replacement (DC 5054)',
    note: 'Following prosthetic replacement. Minimum 30% rating following implantation. 100% for 1 year following.',
    domains: [
      { id: 'status', label: 'Replacement Status',
        description: 'Current functional status after hip replacement',
        levels: [
          { value: 30, label: 'Minimum', description: 'Prosthetic replacement with no significant residuals.' },
          { value: 50, label: 'Moderate', description: 'Moderately severe residuals of weakness, pain, or limitation of motion.' },
          { value: 70, label: 'Severe', description: 'Markedly severe residual weakness, pain, or limitation of motion.' },
          { value: 90, label: 'Very Severe', description: 'Painful motion or weakness requiring assistive devices.' },
          { value: 100, label: '1-Year Post-Op', description: 'For 1 year following implantation of prosthesis.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Hip — General',
    domains: [
      { id: 'severity', label: 'Overall Severity',
        description: 'General severity of the hip condition',
        levels: [
          { value: 0, label: 'None', description: 'No significant impairment.' },
          { value: 10, label: 'Mild', description: 'Mild impairment with occasional symptoms.' },
          { value: 20, label: 'Moderate', description: 'Moderate impairment affecting daily activities.' },
          { value: 30, label: 'Severe', description: 'Severe impairment with significant limitation.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment.' },
        ],
      },
    ],
  },
}

export const HIP_CONDITION_PROFILE: Record<string, string> = {
  'Hip osteoarthritis': 'rom',
  'Hip labral tear': 'rom',
  'Hip bursitis (trochanteric)': 'rom',
  'Hip impingement (FAI)': 'rom',
  'Hip fracture': 'rom',
  'Avascular necrosis of hip': 'rom',
  'Hip flexor strain': 'rom',
  'Snapping hip syndrome': 'rom',
  'Hip replacement (total)': 'replacement',
}

// ── ELBOW / FOREARM ───────────────────────────────────────────────────────────
export const ELBOW_PROFILES: Record<string, BPProfile> = {
  rom: {
    label: 'Elbow Range of Motion (DC 5206/5207)',
    note: 'Rated based on limitation of flexion and extension of the forearm.',
    domains: [
      { id: 'flexion', label: 'Limitation of Bending (Flexion)',
        description: 'Limitation of bending (flexion) of the forearm (DC 5206)',
        levels: [
          { value: 0, label: 'Normal', description: 'Bending (flexion) greater than 100°.' },
          { value: 10, label: 'Mild', description: 'Bending (flexion) limited to 100°.' },
          { value: 20, label: 'Moderate', description: 'Bending (flexion) limited to 90°.' },
          { value: 30, label: 'Severe', description: 'Bending (flexion) limited to 70°.' },
          { value: 40, label: 'Very Severe', description: 'Bending (flexion) limited to 55°.' },
          { value: 50, label: 'Extreme', description: 'Bending (flexion) limited to 45°.' },
        ],
      },
      { id: 'extension', label: 'Limitation of Straightening (Extension)',
        description: 'Limitation of straightening (extension) of the forearm (DC 5207)',
        levels: [
          { value: 0, label: 'Normal', description: 'Straightening (extension) not limited.' },
          { value: 10, label: 'Mild', description: 'Straightening (extension) limited to 45° or 60°.' },
          { value: 20, label: 'Moderate', description: 'Straightening (extension) limited to 75°.' },
          { value: 30, label: 'Severe', description: 'Straightening (extension) limited to 90°.' },
          { value: 40, label: 'Very Severe', description: 'Straightening (extension) limited to 100°.' },
          { value: 50, label: 'Extreme', description: 'Straightening (extension) limited to 110°.' },
        ],
      },
      { id: 'pronation', label: 'Rotating Palm Down/Up (Pronation/Supination)',
        description: 'Limitation of rotating palm down (pronation) or rotating palm up (supination) (DC 5213)',
        levels: [
          { value: 0, label: 'Normal', description: 'No limitation.' },
          { value: 10, label: 'Mild', description: 'Rotating palm up (supination) limited to 30° or less.' },
          { value: 20, label: 'Moderate', description: 'Rotating palm down (pronation) limited beyond last quarter of arc.' },
          { value: 30, label: 'Severe', description: 'Rotating palm down (pronation) lost beyond middle of arc.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Elbow — General',
    domains: [
      { id: 'severity', label: 'Overall Severity',
        description: 'General severity of the elbow condition',
        levels: [
          { value: 0, label: 'None', description: 'No significant impairment.' },
          { value: 10, label: 'Mild', description: 'Mild impairment.' },
          { value: 20, label: 'Moderate', description: 'Moderate impairment.' },
          { value: 30, label: 'Severe', description: 'Severe impairment.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment.' },
        ],
      },
    ],
  },
}

export const ELBOW_CONDITION_PROFILE: Record<string, string> = {
  "Lateral epicondylitis (tennis elbow)": 'rom',
  "Medial epicondylitis (golfer's elbow)": 'rom',
  'Elbow bursitis (olecranon)': 'rom',
  'Cubital tunnel syndrome': 'rom',
  'Elbow fracture': 'rom',
  'Elbow arthritis': 'rom',
  'Forearm fracture': 'rom',
  'Forearm muscle strain': 'generic',
  'Elbow dislocation': 'rom',
}

// ── WRIST / HAND ──────────────────────────────────────────────────────────────
export const WRIST_PROFILES: Record<string, BPProfile> = {
  rom: {
    label: 'Wrist Range of Motion (DC 5215)',
    note: 'Rated based on limitation of motion of the wrist.',
    domains: [
      { id: 'dorsiflexion', label: 'Bending Wrist Back (Dorsiflexion)',
        description: 'Limitation of bending the wrist back (dorsiflexion/extension)',
        levels: [
          { value: 0, label: 'Normal', description: 'Wrist bends back (dorsiflexion) greater than 15°.' },
          { value: 10, label: 'Mild', description: 'Wrist bends back (dorsiflexion) less than 15°.' },
        ],
      },
      { id: 'ankylosis', label: 'Wrist Frozen/Locked (Ankylosis)',
        description: 'Wrist joint is frozen/locked and cannot move (ankylosis of the wrist, DC 5214)',
        levels: [
          { value: 0, label: 'None', description: 'Wrist is not frozen/locked (no ankylosis).' },
          { value: 20, label: 'Favorable', description: 'Wrist frozen/locked (ankylosis) in 20° to 30° bent-back position.' },
          { value: 30, label: 'Any Other', description: 'Wrist frozen/locked (ankylosis) in any other position except favorable.' },
          { value: 40, label: 'Unfavorable', description: 'Wrist frozen/locked in an unfavorable position with side-to-side deviation.' },
        ],
      },
    ],
  },
  carpal: {
    label: 'Carpal Tunnel (DC 8515)',
    note: 'Median nerve impairment rated under DC 8515.',
    domains: [
      { id: 'nerve', label: 'Median Nerve Impairment',
        description: 'Severity of median nerve (carpal tunnel) paralysis',
        levels: [
          { value: 0, label: 'Normal', description: 'No impairment.' },
          { value: 10, label: 'Mild', description: 'Mild incomplete paralysis (minor hand).' },
          { value: 20, label: 'Moderate', description: 'Moderate incomplete paralysis.' },
          { value: 40, label: 'Severe', description: 'Severe incomplete paralysis.' },
          { value: 60, label: 'Complete', description: "Complete paralysis — hand inclined to ulnar side, can't make a fist." },
        ],
      },
    ],
  },
  finger: {
    label: 'Finger/Hand (DC 5216-5230)',
    note: 'Individual finger frozen/locked joint (ankylosis) or limitation.',
    domains: [
      { id: 'severity', label: 'Finger/Hand Severity',
        description: 'Overall severity of finger or hand impairment',
        levels: [
          { value: 0, label: 'None', description: 'No significant impairment.' },
          { value: 10, label: 'Mild', description: 'Mild limitation of one or more fingers.' },
          { value: 20, label: 'Moderate', description: 'Moderate limitation, one finger frozen/locked (ankylosis).' },
          { value: 30, label: 'Severe', description: 'Multiple fingers frozen/locked (ankylosis) or significant grip loss.' },
          { value: 40, label: 'Very Severe', description: 'Loss of use of hand or multiple finger amputations.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Wrist/Hand — General',
    domains: [
      { id: 'severity', label: 'Overall Severity',
        description: 'General severity of the wrist/hand condition',
        levels: [
          { value: 0, label: 'None', description: 'No significant impairment.' },
          { value: 10, label: 'Mild', description: 'Mild impairment.' },
          { value: 20, label: 'Moderate', description: 'Moderate impairment.' },
          { value: 30, label: 'Severe', description: 'Severe impairment.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment.' },
        ],
      },
    ],
  },
}

export const WRIST_CONDITION_PROFILE: Record<string, string> = {
  'Carpal tunnel syndrome': 'carpal',
  "De Quervain's tenosynovitis": 'rom',
  'Wrist fracture': 'rom',
  'Trigger finger': 'finger',
  "Dupuytren's contracture": 'finger',
  'Hand / finger fracture': 'finger',
  'Wrist sprain': 'rom',
  'Ganglion cyst': 'generic',
  'Wrist arthritis': 'rom',
  'Hand arthritis': 'finger',
  "Raynaud's phenomenon": 'generic',
}

// ── ANKLE / FOOT ──────────────────────────────────────────────────────────────
export const ANKLE_PROFILES: Record<string, BPProfile> = {
  rom: {
    label: 'Ankle Range of Motion (DC 5271)',
    note: 'Rated based on limitation of motion of the ankle.',
    domains: [
      { id: 'motion', label: 'Limitation of Motion',
        description: 'Limited motion of the ankle (DC 5271)',
        levels: [
          { value: 0, label: 'Normal', description: 'No significant limitation.' },
          { value: 10, label: 'Moderate', description: 'Moderate limitation of motion.' },
          { value: 20, label: 'Marked', description: 'Marked limitation of motion.' },
        ],
      },
      { id: 'ankylosis', label: 'Joint Frozen/Locked (Ankylosis)',
        description: 'Ankle joint is frozen/locked and cannot move (ankylosis of the ankle, DC 5270)',
        levels: [
          { value: 0, label: 'None', description: 'Ankle is not frozen/locked (no ankylosis).' },
          { value: 20, label: 'Foot pointed down <30°', description: 'Ankle frozen/locked (ankylosis) with foot pointing down (plantar flexion) less than 30°.' },
          { value: 30, label: 'Foot pointed down 30-40°', description: 'Ankle frozen/locked (ankylosis) with foot pointing down between 30° and 40°, or pulled up between 0° and 10°.' },
          { value: 40, label: 'Unfavorable', description: 'Ankle frozen/locked (ankylosis) with foot pointing down at more than 40°, or pulled up at more than 10°, or with outward/inward deformity.' },
        ],
      },
    ],
  },
  instability: {
    label: 'Ankle Instability (DC 5271)',
    note: 'Chronic ankle instability or recurrent partial dislocation (subluxation).',
    domains: [
      { id: 'severity', label: 'Instability Severity',
        description: 'Severity of ankle instability',
        levels: [
          { value: 0, label: 'None', description: 'No instability.' },
          { value: 10, label: 'Moderate', description: 'Moderate instability with occasional giving way.' },
          { value: 20, label: 'Marked', description: 'Marked instability, frequent giving way.' },
        ],
      },
    ],
  },
  flatfoot: {
    label: 'Flatfoot (DC 5276)',
    note: 'Acquired flatfoot (pes planus).',
    domains: [
      { id: 'severity', label: 'Flatfoot Severity',
        description: 'Severity of acquired flatfoot',
        levels: [
          { value: 0, label: 'Mild', description: 'Symptoms relieved by built-up shoe or arch support.' },
          { value: 10, label: 'Moderate', description: 'Weight-bearing line over or toward the big toe, inward bowing of the Achilles tendon. One or both feet.' },
          { value: 20, label: 'Severe (Unilateral)', description: 'Clear evidence of marked deformity, pain when the foot is moved or used, swelling, thick calluses. One foot.' },
          { value: 30, label: 'Severe (Bilateral)', description: 'Severe flatfoot in both feet — marked deformity, pain when the foot is moved or used, swelling, thick calluses.' },
          { value: 50, label: 'Pronounced', description: 'Pronounced; marked inward rolling of the foot (pronation), extreme tenderness of the bottom of the foot, not improved by orthopedic shoes/appliances.' },
        ],
      },
    ],
  },
  plantar: {
    label: 'Plantar Fasciitis',
    note: 'Rated by analogy, commonly under DC 5276 or 5284.',
    domains: [
      { id: 'severity', label: 'Plantar Fasciitis Severity',
        description: 'Overall severity of plantar fasciitis',
        levels: [
          { value: 0, label: 'None', description: 'No significant impairment.' },
          { value: 10, label: 'Moderate', description: 'Pain with prolonged standing/walking, relieved with rest.' },
          { value: 20, label: 'Moderately Severe', description: 'Pain with most weight-bearing, some activity limitation.' },
          { value: 30, label: 'Severe', description: 'Severe pain limiting most activities.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Ankle/Foot — General',
    domains: [
      { id: 'severity', label: 'Overall Severity',
        description: 'General severity of the ankle/foot condition',
        levels: [
          { value: 0, label: 'None', description: 'No significant impairment.' },
          { value: 10, label: 'Mild', description: 'Mild impairment.' },
          { value: 20, label: 'Moderate', description: 'Moderate impairment.' },
          { value: 30, label: 'Severe', description: 'Severe impairment.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment.' },
        ],
      },
    ],
  },
}

export const ANKLE_CONDITION_PROFILE: Record<string, string> = {
  'Ankle sprain (chronic)': 'instability',
  'Ankle instability': 'instability',
  'Achilles tendinitis / rupture': 'rom',
  'Plantar fasciitis': 'plantar',
  'Flat feet (pes planus)': 'flatfoot',
  'Ankle fracture': 'rom',
  'Foot fracture (metatarsal / stress)': 'generic',
  'Bunion (hallux valgus)': 'generic',
  'Heel spurs': 'plantar',
  "Morton's neuroma": 'generic',
  'Tarsal tunnel syndrome': 'generic',
  'Diabetic foot neuropathy': 'generic',
}

// ── CHEST / LUNGS ─────────────────────────────────────────────────────────────
export const CHEST_PROFILES: Record<string, BPProfile> = {
  respiratory: {
    label: 'Respiratory (DC 6600-6604)',
    note: 'Rated based on lung/breathing capacity tests (pulmonary function tests, PFT) and clinical findings.',
    domains: [
      { id: 'pft', label: 'Lung/Breathing Capacity',
        description: 'Breathing test score (FEV-1)/FVC ratio or FEV-1 percent predicted',
        levels: [
          { value: 0, label: 'Normal', description: 'Breathing test score (FEV-1) greater than 80% predicted; FEV-1/FVC greater than 80%.' },
          { value: 10, label: 'Mild', description: 'Breathing test score (FEV-1) of 71-80% predicted, or FEV-1/FVC of 71-80%.' },
          { value: 30, label: 'Moderate', description: 'Breathing test score (FEV-1) of 56-70% predicted, or FEV-1/FVC of 56-70%.' },
          { value: 60, label: 'Severe', description: 'Breathing test score (FEV-1) of 40-55% predicted, or FEV-1/FVC of 40-55%.' },
          { value: 100, label: 'Very Severe', description: 'Breathing test score (FEV-1) less than 40% predicted, or FEV-1/FVC less than 40%.' },
        ],
      },
      { id: 'oxygen', label: 'Oxygen Dependence',
        description: 'Requirement for outpatient oxygen therapy',
        levels: [
          { value: 0, label: 'None', description: 'No supplemental oxygen needed.' },
          { value: 60, label: 'Intermittent', description: 'Requires intermittent outpatient oxygen therapy.' },
          { value: 100, label: 'Continuous', description: 'Requires continuous outpatient oxygen therapy.' },
        ],
      },
    ],
  },
  apnea: {
    label: 'Sleep Apnea (DC 6847)',
    note: 'Rated under DC 6847 for obstructive, central, or mixed sleep apnea.',
    domains: [
      { id: 'severity', label: 'Sleep Apnea Severity',
        description: 'Severity of sleep apnea and treatment required',
        levels: [
          { value: 0, label: 'Asymptomatic', description: 'Asymptomatic but with documented sleep disorder breathing.' },
          { value: 30, label: 'Mild', description: 'Persistent excessive daytime sleepiness (hypersomnolence).' },
          { value: 50, label: 'Moderate', description: 'Requires use of breathing assistance device such as CPAP.' },
          { value: 100, label: 'Severe', description: 'Chronic respiratory failure with carbon dioxide retention or heart failure from lung disease (cor pulmonale), or requires a breathing tube (tracheostomy).' },
        ],
      },
    ],
  },
  asthma: {
    label: 'Bronchial Asthma (DC 6602)',
    note: 'Rated based on FEV-1 results, medication requirements, and frequency of exacerbations.',
    domains: [
      { id: 'pft', label: 'Lung/Breathing Capacity (FEV-1)',
        description: 'Breathing test score (FEV-1) percent predicted from lung/breathing capacity testing',
        levels: [
          { value: 0, label: 'Normal (>80%)', description: 'Breathing test score (FEV-1) greater than 80% predicted.' },
          { value: 10, label: '71-80% predicted', description: 'Breathing test score (FEV-1) of 71-80% predicted.' },
          { value: 30, label: '56-70% predicted', description: 'Breathing test score (FEV-1) of 56-70% predicted.' },
          { value: 60, label: '40-55% predicted', description: 'Breathing test score (FEV-1) of 40-55% predicted; or at least monthly visits to physician for exacerbations.' },
          { value: 100, label: '<40% predicted', description: 'Breathing test score (FEV-1) less than 40% predicted; or more than one attack per week with episodes of respiratory failure.' },
        ],
      },
      { id: 'medication', label: 'Medication Level',
        description: 'Current asthma treatment tier',
        levels: [
          { value: 0, label: 'No daily medication', description: 'Intermittent use of bronchodilator only.' },
          { value: 10, label: 'Daily inhaled bronchodilator', description: 'Daily use of inhaled bronchodilator therapy.' },
          { value: 30, label: 'Daily inhaled corticosteroid', description: 'Daily inhalational anti-inflammatory medication.' },
          { value: 60, label: 'High-dose inhaled + intermittent oral steroids', description: 'High-dose inhaled corticosteroid plus intermittent systemic corticosteroid courses.' },
          { value: 100, label: 'Daily systemic corticosteroids', description: 'Requires daily use of systemic high-dose corticosteroids or immuno-suppressive medications.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Chest/Lung — General',
    domains: [
      { id: 'severity', label: 'Overall Severity',
        description: 'General severity of the chest/lung condition',
        levels: [
          { value: 0, label: 'None', description: 'No significant impairment.' },
          { value: 10, label: 'Mild', description: 'Mild impairment.' },
          { value: 30, label: 'Moderate', description: 'Moderate impairment.' },
          { value: 60, label: 'Severe', description: 'Severe impairment.' },
          { value: 100, label: 'Total', description: 'Total impairment.' },
        ],
      },
    ],
  },
}

export const CHEST_CONDITION_PROFILE: Record<string, string> = {
  'Asthma': 'asthma',
  'COPD / chronic bronchitis': 'respiratory',
  'Pulmonary embolism': 'respiratory',
  'Costochondritis': 'generic',
  'Rib fracture': 'generic',
  'Restrictive lung disease': 'respiratory',
  'Sleep apnea': 'apnea',
  'Pleural effusion': 'respiratory',
  'Pneumothorax': 'respiratory',
  'Chronic cough': 'respiratory',
  'Chest wall pain': 'generic',
}

// ── ABDOMEN / PELVIS ──────────────────────────────────────────────────────────
export const ABDOMEN_PROFILES: Record<string, BPProfile> = {
  digestive: {
    label: 'Digestive (DC 7301-7354)',
    note: 'Rated based on severity, frequency, and treatment response of digestive conditions.',
    domains: [
      { id: 'severity', label: 'Condition Severity',
        description: 'Overall severity and impact on daily function',
        levels: [
          { value: 0, label: 'None', description: 'No significant symptoms.' },
          { value: 10, label: 'Mild', description: 'Mild symptoms manageable with diet or OTC medication.' },
          { value: 30, label: 'Moderate', description: 'Moderate symptoms requiring prescription medication; some weight loss or nutritional deficiency.' },
          { value: 60, label: 'Severe', description: 'Severe and frequent symptoms; material weight loss; requires continuous medication.' },
          { value: 100, label: 'Total', description: 'Pronounced symptoms causing marked malnutrition and health impairment.' },
        ],
      },
      { id: 'frequency', label: 'Symptom Frequency',
        description: 'How often symptoms occur',
        levels: [
          { value: 0, label: 'Rare', description: 'Symptoms occur rarely, long periods of remission.' },
          { value: 10, label: 'Occasional', description: 'Symptoms several times per month.' },
          { value: 20, label: 'Frequent', description: 'Symptoms occur weekly or more.' },
          { value: 30, label: 'Near-Constant', description: 'Nearly constant symptoms affecting most daily activities.' },
        ],
      },
    ],
  },
  genitourinary: {
    label: 'Genitourinary (DC 7500-7542)',
    note: 'Rated based on renal function, voiding dysfunction, or specific condition criteria.',
    domains: [
      { id: 'voiding', label: 'Voiding Dysfunction',
        description: 'Frequency, urgency, or incontinence',
        levels: [
          { value: 0, label: 'Normal', description: 'Normal voiding function.' },
          { value: 10, label: 'Mild', description: 'Daytime voiding interval 1-2 hours, or awakening to void 2 times per night.' },
          { value: 20, label: 'Moderate', description: 'Daytime voiding interval <1 hour, or awakening to void 3-4 times per night.' },
          { value: 40, label: 'Severe', description: 'Requiring absorbent materials that must be changed 2-4 times per day.' },
          { value: 60, label: 'Very Severe', description: 'Requiring absorbent materials changed more than 4 times per day, or use of appliance.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Abdomen — General',
    domains: [
      { id: 'severity', label: 'Overall Severity',
        description: 'General severity of the condition',
        levels: [
          { value: 0, label: 'None', description: 'No significant impairment.' },
          { value: 10, label: 'Mild', description: 'Mild impairment.' },
          { value: 20, label: 'Moderate', description: 'Moderate impairment.' },
          { value: 30, label: 'Severe', description: 'Severe impairment.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment.' },
        ],
      },
    ],
  },
}

export const ABDOMEN_CONDITION_PROFILE: Record<string, string> = {
  'GERD / acid reflux': 'digestive',
  'Irritable bowel syndrome (IBS)': 'digestive',
  'Hiatal hernia': 'digestive',
  'Inguinal hernia': 'generic',
  'Peptic ulcer disease': 'digestive',
  "Crohn's disease": 'digestive',
  'Ulcerative colitis': 'digestive',
  'Gallbladder disease': 'digestive',
  'Kidney stones': 'genitourinary',
  'Liver condition': 'digestive',
  'Bladder condition': 'genitourinary',
  'Pelvic pain': 'generic',
}

// ── LEG (THIGH / SHIN / CALF) ─────────────────────────────────────────────────
export const LEG_PROFILES: Record<string, BPProfile> = {
  muscle: {
    label: 'Muscle Injury (DC 5311-5315)',
    note: 'Rated based on muscle group injury severity — function of movement, strength, fatigue.',
    domains: [
      { id: 'severity', label: 'Muscle Injury Severity',
        description: 'Key signs: loss of power, weakness, getting tired more easily, pain, difficulty with coordination, unsteady movement',
        levels: [
          { value: 0, label: 'Slight', description: 'Simple wound, no surgical cleaning needed, no lasting impairment.' },
          { value: 10, label: 'Moderate', description: 'Through-and-through or deep penetrating wound; hospitalized and treated; consistent complaints on exam.' },
          { value: 20, label: 'Moderately Severe', description: 'Wound required surgical cleaning (debridement); prolonged infection or tissue breakdown; scarring between muscles.' },
          { value: 30, label: 'Severe', description: 'Shattering bone fracture or comminuted fracture; extensive surgical wound cleaning; prolonged infection; soft, flabby muscles in wound area.' },
        ],
      },
    ],
  },
  neuropathy: {
    label: 'Peripheral Neuropathy (DC 8520/8521)',
    note: 'Sciatic or peroneal nerve involvement rated under DC 8520/8521.',
    domains: [
      { id: 'nerve', label: 'Nerve Impairment',
        description: 'Severity of nerve damage (peripheral neuropathy) causing numbness, tingling, or weakness',
        levels: [
          { value: 0, label: 'Normal', description: 'No nerve damage (neuropathy).' },
          { value: 10, label: 'Mild', description: 'Mild incomplete paralysis.' },
          { value: 20, label: 'Moderate', description: 'Moderate incomplete paralysis.' },
          { value: 40, label: 'Moderately Severe', description: 'Moderately severe incomplete paralysis.' },
          { value: 60, label: 'Severe', description: 'Severe incomplete paralysis with marked muscle shrinkage/wasting (atrophy).' },
          { value: 80, label: 'Complete', description: 'Complete paralysis — foot dangles, no active movement possible.' },
        ],
      },
    ],
  },
  generic: {
    label: 'Leg — General',
    domains: [
      { id: 'severity', label: 'Overall Severity',
        description: 'General severity of the leg condition',
        levels: [
          { value: 0, label: 'None', description: 'No significant impairment.' },
          { value: 10, label: 'Mild', description: 'Mild impairment.' },
          { value: 20, label: 'Moderate', description: 'Moderate impairment.' },
          { value: 30, label: 'Severe', description: 'Severe impairment.' },
          { value: 50, label: 'Very Severe', description: 'Very severe impairment.' },
        ],
      },
    ],
  },
}

export const LEG_CONDITION_PROFILE: Record<string, string> = {
  'Shin splints (MTSS)': 'muscle',
  'Stress fracture (tibia / fibula)': 'muscle',
  'Hamstring strain': 'muscle',
  'Quadriceps strain': 'muscle',
  'Calf strain / tear': 'muscle',
  'Deep vein thrombosis (DVT)': 'generic',
  'Peripheral neuropathy': 'neuropathy',
  'Femur fracture': 'muscle',
  'Compartment syndrome': 'muscle',
  'Varicose veins': 'generic',
  'Muscle atrophy': 'muscle',
}

// ── SYSTEMIC ──────────────────────────────────────────────────────────────────
// All region profiles combined into one lookup map by regionId
export const BP_REGION_PROFILES: Record<string, Record<string, BPProfile>> = {
  knee: KNEE_PROFILES,
  back: SPINE_PROFILES,
  shoulder: SHOULDER_PROFILES,
  neck: NECK_PROFILES,
  hip: HIP_PROFILES,
  elbow: ELBOW_PROFILES,
  wrist_hand: WRIST_PROFILES,
  ankle_foot: ANKLE_PROFILES,
  chest: CHEST_PROFILES,
  abdomen: ABDOMEN_PROFILES,
  leg: LEG_PROFILES,
  systemic: { generic: PHYSICAL_PROFILE },
}

export const BP_REGION_CONDITION_PROFILES: Record<string, Record<string, string>> = {
  knee: KNEE_CONDITION_PROFILE,
  back: SPINE_CONDITION_PROFILE,
  shoulder: SHOULDER_CONDITION_PROFILE,
  neck: NECK_CONDITION_PROFILE,
  hip: HIP_CONDITION_PROFILE,
  elbow: ELBOW_CONDITION_PROFILE,
  wrist_hand: WRIST_CONDITION_PROFILE,
  ankle_foot: ANKLE_CONDITION_PROFILE,
  chest: CHEST_CONDITION_PROFILE,
  abdomen: ABDOMEN_CONDITION_PROFILE,
  leg: LEG_CONDITION_PROFILE,
  systemic: {},
}

// Default profile key for each region
const DEFAULT_PROFILE_KEY: Record<string, string> = {
  knee: 'generic',
  back: 'generic',
  shoulder: 'generic',
  neck: 'cervical',
  hip: 'rom',
  elbow: 'rom',
  wrist_hand: 'rom',
  ankle_foot: 'rom',
  chest: 'generic',
  abdomen: 'generic',
  leg: 'generic',
  systemic: 'generic',
}

export function getBPProfileKey(regionId: string, conditionName: string): string {
  const condMap = BP_REGION_CONDITION_PROFILES[regionId] ?? {}
  return condMap[conditionName] ?? DEFAULT_PROFILE_KEY[regionId] ?? 'generic'
}

export function getBPProfile(regionId: string, conditionName: string): BPProfile {
  const profileKey = getBPProfileKey(regionId, conditionName)
  const profiles = BP_REGION_PROFILES[regionId] ?? {}
  return profiles[profileKey] ?? PHYSICAL_PROFILE
}

export function calculateBPRating(domainValues: Record<string, number>): number {
  return Object.values(domainValues).reduce((max, v) => (v > max ? v : max), 0)
}
