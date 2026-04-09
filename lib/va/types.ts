// ── Core types ──────────────────────────────────────────────────────────────

export type Severity = 'mild' | 'moderate' | 'severe' | 'custom'
export type BodySide = 'front' | 'back'
export type BodyGender = 'male' | 'female'
export type MHImpairmentLevel = 'none' | 'mild' | 'moderate' | 'severe' | 'total'
export type MHFrequency = 'less25' | 'less50' | 'more50' | 'always'

// ── Pin ──────────────────────────────────────────────────────────────────────

export interface PinCoord {
  label: string
  x: number
  y: number
}

export interface PlacedPin {
  x: number
  y: number
  side: BodySide
  body: BodyGender
}

// ── Injury (physical, on the body map) ──────────────────────────────────────

export interface Injury {
  id: number
  key: string          // pin key e.g. 'leftKnee'
  label: string        // display name e.g. 'Left Knee'
  severity: Severity
  date: string
  installation: string
  event: string
  description: string
  medicalCare: 'yes' | 'no' | ''
  clinicName: string
  witnesses: string
  notes: string
  secondaries: string[]                          // condition names
  secondaryRatings?: Record<string, number>      // keyed by condition name
  _secondaryRatings?: Record<number, number>     // keyed by index (legacy)
  secondaryExtremities?: Record<string, string>  // keyed by condition name
  dailyImpact: string
  pin: PlacedPin | null
  _assignedRating?: number
}

// ── Domain / Evaluation profile types ────────────────────────────────────────

export interface DomainLevel {
  value: number
  label: string
  description: string
}

export interface EvalDomain {
  id: string
  label: string
  description: string
  levels?: DomainLevel[]
  // For MH domains that use level+frequency instead of discrete levels:
  isMH?: boolean
}

export interface EvalProfile {
  label: string
  domains: EvalDomain[]
}

// ── Mental health condition state ─────────────────────────────────────────────

export interface MHDomainState {
  level: MHImpairmentLevel
  frequency: MHFrequency
}

export interface MentalHealthCondition {
  id: number
  condition: string
  domains: Record<string, MHDomainState>
  calculatedRating: number
  effectiveRating: number
  manualOverride: number | null
  pin: PlacedPin | null
  secondaries?: string[]
  secondaryRatings?: Record<string, number>
  // Shared info fields
  date: string
  installation: string
  event: string
  description: string
  medicalCare: 'yes' | 'no' | ''
  clinicName: string
  witnesses: string
  stillBeingSeen: boolean
}

// ── Head/Face condition state ─────────────────────────────────────────────────

export interface HeadCondition {
  id: number
  condition: string
  profile: string
  domains: Record<string, number>
  calculatedRating: number
  effectiveRating: number
  manualOverride: number | null
  pin: PlacedPin | null
  extremity?: string
  secondaries?: string[]
  secondaryRatings?: Record<string, number>
  date: string
  installation: string
  event: string
  description: string
  medicalCare: 'yes' | 'no' | ''
  clinicName: string
  witnesses: string
  stillBeingSeen: boolean
}

// ── Body-part condition state (generic, used by BP_REGISTRY regions) ──────────

export interface BPCondition {
  id: number
  condition: string
  profile: string
  domains: Record<string, number>
  calculatedRating: number
  effectiveRating: number
  manualOverride: number | null
  extremity: string         // 'LL' | 'RL' | 'LU' | 'RU' | 'none'
  sideLabel: string
  bilateralLinked: boolean
  bilateralPartnerId?: number
  pin: PlacedPin | null
  secondaries?: string[]
  secondaryRatings?: Record<string, number>
  secondaryExtremities?: Record<string, string>
  date: string
  installation: string
  event: string
  description: string
  medicalCare: 'yes' | 'no' | ''
  clinicName: string
  witnesses: string
  stillBeingSeen: boolean
}

// ── BP Registry entry ─────────────────────────────────────────────────────────

export interface BPRegistryEntry {
  id: string
  title: string
  stateKey: string
  panelId: string
  conditions: string           // key into VA_AREA_CONDITIONS
  profiles: () => Record<string, EvalProfile>
  profileMap: () => Record<string, string>
  getProfile: (name: string) => EvalProfile
  getProfileKey: (name: string) => string
  calcRating: (domainValues: Record<string, number>) => number
  sideKeys: Record<string, string>
  extremityMap: Record<string, string>
  note: string
}

// ── MST data ──────────────────────────────────────────────────────────────────

export interface MSTSecondary {
  name: string
  rating: number
}

export interface MSTConditionEntry {
  name: string
  rating: number
  secondaries: MSTSecondary[]
}

export interface MSTData {
  privacyShield: boolean
  conditions: MSTConditionEntry[]
  notes: string
  evidence: Record<string, boolean>
}

// ── SMC ───────────────────────────────────────────────────────────────────────

export interface SMCLevel {
  id: string
  label: string
  description: string
}

// ── Presumptive claim ─────────────────────────────────────────────────────────

export interface PresumptiveField {
  id: string
  label: string
  type: 'text' | 'date' | 'select'
  options?: string[]
  placeholder?: string
}

export interface PresumptiveClaim {
  id: string
  label: string
  description: string
  fields: PresumptiveField[]
}

// ── Gap analysis ──────────────────────────────────────────────────────────────

export interface GapStatus {
  status: 'complete' | 'incomplete' | 'no-date'
  missing: string[]
}

// ── Rating breakdown ──────────────────────────────────────────────────────────

export interface RatingItem {
  name: string
  rating: number
  extremity?: string  // 'LL' | 'RL' | 'LU' | 'RU' | 'none'
  isBilateral?: boolean
  isVoc?: boolean
  secondaries?: { name: string; rating: number }[]
}

export interface RatingBreakdown {
  items: RatingItem[]
  exact: number
  rounded: number
  bilateral: boolean
  bilateralBonus: number
  steps: RatingStep[]
}

export interface RatingStep {
  name: string
  rating: number
  runningTotal: number
  math: string
}

// ── Global tracker state ───────────────────────────────────────────────────────

export type TabName = 'map' | 'secondary' | 'special' | 'timeline' | 'rating' | 'statement'

export interface TrackerState {
  // Tab
  activeTab: TabName
  // Body map UI
  curSide: BodySide
  curBody: BodyGender
  pendingPin: PlacedPin | null
  bpPanelOpen: string | null   // region id from BP_REGISTRY or 'mental' | 'headFace' | null
  bpPinKey: string
  bpSearch: string
  // Physical injuries
  injuries: Injury[]
  // Condition arrays
  mentalHealthConditions: MentalHealthCondition[]
  headConditions: HeadCondition[]
  bpConditions: Record<string, BPCondition[]>  // keyed by BP_REGISTRY region id
  // Special claims
  mstData: MSTData
  smcSelections: string[]
  presumptiveData: Record<string, Record<string, string | boolean>>
  vocSecondaries: string[]
  vocNotes: string
  personalStatement: string
}
