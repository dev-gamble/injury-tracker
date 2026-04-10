// ── SHARED FIELD INFO ──────────────────────────────────────────────────────────
export interface CondInfo {
  date: string
  location: string
  event: string
  description: string
  medicalCare: '' | 'yes' | 'no'
  clinicName: string
  witnesses: string
  stillBeingSeen: boolean
}

// ── PIN ────────────────────────────────────────────────────────────────────────
export interface Pin {
  x: number
  y: number
  side: 'front' | 'back'
  body: 'male' | 'female'
  label: string
}

// ── INJURY ─────────────────────────────────────────────────────────────────────
export interface Injury {
  id: number
  key: string
  label: string
  date: string
  severity: 'mild' | 'moderate' | 'severe' | 'custom'
  location: string
  event: string
  description: string
  medicalCare: '' | 'yes' | 'no'
  clinicName: string
  witnesses: string
  stillBeingSeen: boolean
  functionalImpacts: string[]
  secondaries?: string[]
  secondaryRatings?: Record<string, number>
  secondaryEvals?: Record<string, { domains: Record<string, number | { level: string; frequency: string }>; rating: number }>
  evalDomains?: Record<string, number>
  rating?: number
  pin: Pin
}

// ── MENTAL HEALTH ──────────────────────────────────────────────────────────────
export interface MHDomainState {
  level: 'none' | 'mild' | 'moderate' | 'severe' | 'total'
  frequency: 'less25' | '25plus'
}

export interface MHCondition extends CondInfo {
  id: number
  condition: string
  domains: Record<string, MHDomainState>
  calculatedRating: number
  manualOverride: number | null
  effectiveRating: number
  pin?: Pin
  secondaries?: string[]
  secondaryRatings?: Record<string, number>
  secondaryEvals?: Record<string, { domains: Record<string, number | { level: string; frequency: string }>; rating: number }>
  secondaryExtremities?: Record<string, string>
}

// ── HEAD / FACE ────────────────────────────────────────────────────────────────
export interface HeadCondition extends CondInfo {
  id: number
  condition: string
  profile: string
  domains: Record<string, number>
  calculatedRating: number
  manualOverride: number | null
  effectiveRating: number
  extremity: string
  pin?: Pin
  secondaries?: string[]
  secondaryRatings?: Record<string, number>
  secondaryEvals?: Record<string, { domains: Record<string, number | { level: string; frequency: string }>; rating: number }>
  secondaryExtremities?: Record<string, string>
}

// ── BODY PART (knee, back, shoulder, etc.) ─────────────────────────────────────
export interface BPCondition extends CondInfo {
  id: number
  condition: string
  profile: string
  side?: string
  sideLabel?: string
  domains: Record<string, number>
  calculatedRating: number
  manualOverride: number | null
  effectiveRating: number
  extremity: string
  pin?: Pin
  secondaries?: string[]
  secondaryRatings?: Record<string, number>
  secondaryEvals?: Record<string, { domains: Record<string, number | { level: string; frequency: string }>; rating: number }>
  secondaryExtremities?: Record<string, string>
}

// ── BP REGION KEYS ─────────────────────────────────────────────────────────────
export type BPRegion =
  | 'knee'
  | 'back'
  | 'shoulder'
  | 'neck'
  | 'hip'
  | 'elbow'
  | 'wrist_hand'
  | 'ankle_foot'
  | 'chest'
  | 'abdomen'
  | 'leg'
  | 'systemic'

// ── SPECIAL CLAIMS ─────────────────────────────────────────────────────────────
export interface MSTPrimaryCondition {
  name: string
  rating: number
  secondaries: Array<{ name: string; rating: number }>
}

export interface MSTData {
  privacyShield: boolean
  conditions: MSTPrimaryCondition[]
  notes: string
  evidence: Record<string, boolean>
}

export interface SpecialClaimsState {
  vocSecondaries: string[]
  vocNotes: string
  claims: Record<string, Record<string, string>>   // claimId → fieldId → value
  smcSelections: string[]
  presumptiveData: Record<string, Record<string, string>>
  mstData: MSTData
}

// ── PENDING PIN (while form is open) ──────────────────────────────────────────
export interface PendingPin {
  x: number
  y: number
  side: 'front' | 'back'
  body: 'male' | 'female'
  key: string
  label: string
}

// ── UI STATE ───────────────────────────────────────────────────────────────────
export type ActiveTab =
  | 'map'
  | 'timeline'
  | 'secondary'
  | 'rating'
  | 'special'
  | 'statement'

export type ActivePanel =
  | null
  | 'mental'
  | 'head'
  | BPRegion

export interface UIState {
  activeTab: ActiveTab
  curSide: 'front' | 'back'
  curBody: 'male' | 'female'
  activePanel: ActivePanel
  pinPlaceMode: { key: string; label: string; fromPanel: boolean } | null
  pendingPin: PendingPin | null
  editingId: number | null
}

// ── FULL STORE ─────────────────────────────────────────────────────────────────
export interface AppState {
  injuries: Injury[]
  mentalConditions: MHCondition[]
  headConditions: HeadCondition[]
  bpConditions: Record<BPRegion, BPCondition[]>
  specialClaims: SpecialClaimsState
  ui: UIState
  personalStatement: string
  ratingOverrides: Record<string, number>
}
