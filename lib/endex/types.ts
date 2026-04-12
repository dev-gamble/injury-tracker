export interface PinPosition {
  x: number
  y: number
  side: "front" | "back"
  body: "male" | "female"
  label: string
}

export interface Injury {
  id: number
  key: string
  label: string
  date: string
  severity: "mild" | "moderate" | "severe" | "custom"
  location: string
  event: string
  description: string
  medicalCare: "" | "yes" | "no"
  clinicName: string
  witnesses: string
  stillBeingSeen: boolean
  functionalImpacts: string[]
  secondaries: string[]
  secondaryRatings: Record<string, number>
  pin: PinPosition
}

export interface PinPlaceMode {
  key: string
  label: string
  fromPanel: boolean
}

export interface PendingPin {
  x: number
  y: number
  side: "front" | "back"
  body: "male" | "female"
  key: string
  label: string
}

export interface FormModalState {
  isOpen: boolean
  editingId: number | null
  pendingPin: PendingPin | null
}

export interface PinCoordinate {
  label: string
  x: number
  y: number
}

export interface SidebarGroup {
  heading: string
  keys: string[]
}

// ── EVALUATION PANEL TYPES ─────────────────────────────────────────────────

export interface MHDomainValue {
  level: string
  frequency: string
}

export interface EvalCondition {
  id: number
  condition: string
  profile: string
  domains: Record<string, number | MHDomainValue>
  calculatedRating: number
  manualOverride: number | null
  effectiveRating: number
  extremity: string
  sideLabel: string
  bilateralLinked: boolean
  bilateralPairId: number | null
  bilateralSource: boolean
  _committed: boolean
}

export interface EvalPanelState {
  type: "mental" | "head" | "bp" | null
  regionId: string | null
  pinKey: string
}

export interface BPRegistryEntry {
  id: string
  title: string
  conditions: string
  sideKeys: Record<string, string>
  extremityMap: Record<string, string>
  note: string
}

export interface ConditionPin {
  id: number
  condition: string
  regionId: string
  rating: number
  sideLabel: string
  extremity: string
  bilateralLinked: boolean
  pin: PinPosition
}
