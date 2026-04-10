import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AppState,
  Injury,
  MHCondition,
  HeadCondition,
  BPCondition,
  BPRegion,
  SpecialClaimsState,
  UIState,
  ActiveTab,
  ActivePanel,
  PendingPin,
  Pin,
} from '../types'

// ── DEFAULT STATE ───────────────────────────────────────────────────────────────

const DEFAULT_BP_CONDITIONS = {} as Record<BPRegion, BPCondition[]>
const BP_REGIONS: BPRegion[] = [
  'knee', 'back', 'shoulder', 'neck', 'hip', 'elbow',
  'wrist_hand', 'ankle_foot', 'chest', 'abdomen', 'leg', 'systemic',
]
BP_REGIONS.forEach(r => { DEFAULT_BP_CONDITIONS[r] = [] })

const DEFAULT_SPECIAL_CLAIMS: SpecialClaimsState = {
  vocSecondaries: [],
  vocNotes: '',
  claims: {},
  smcSelections: [],
  presumptiveData: {},
  mstData: {
    privacyShield: true,
    conditions: [],
    notes: '',
    evidence: {},
  },
}

const DEFAULT_UI: UIState = {
  activeTab: 'map',
  curSide: 'front',
  curBody: 'male',
  activePanel: null,
  pinPlaceMode: null,
  pendingPin: null,
  editingId: null,
}

// ── STORE ACTIONS ───────────────────────────────────────────────────────────────

interface Actions {
  // Injuries
  addInjury: (injury: Injury) => void
  updateInjury: (id: number, patch: Partial<Injury>) => void
  removeInjury: (id: number) => void

  // Mental Health
  addMHCondition: (condition: MHCondition) => void
  updateMHCondition: (id: number, patch: Partial<MHCondition>) => void
  removeMHCondition: (id: number) => void

  // Head / Face
  addHeadCondition: (condition: HeadCondition) => void
  updateHeadCondition: (id: number, patch: Partial<HeadCondition>) => void
  removeHeadCondition: (id: number) => void

  // Body Part conditions
  addBPCondition: (region: BPRegion, condition: BPCondition) => void
  updateBPCondition: (region: BPRegion, id: number, patch: Partial<BPCondition>) => void
  removeBPCondition: (region: BPRegion, id: number) => void

  // Special Claims
  setSpecialClaims: (patch: Partial<SpecialClaimsState>) => void
  setClaimField: (claimId: string, fieldId: string, value: string) => void
  toggleSMC: (id: string) => void
  setPresumptiveField: (claimId: string, fieldId: string, value: string) => void

  // UI
  setActiveTab: (tab: ActiveTab) => void
  setSide: (side: 'front' | 'back') => void
  setBody: (body: 'male' | 'female') => void
  setActivePanel: (panel: ActivePanel) => void
  setPinPlaceMode: (mode: { key: string; label: string; fromPanel: boolean } | null) => void
  setEditingId: (id: number | null) => void
  setPendingPin: (pin: PendingPin | null) => void

  // Injury pin position updates (from dragging)
  updateInjuryPin: (id: number, pin: Pin) => void

  // Rating overrides
  setRatingOverride: (key: string, val: number) => void

  // Personal statement
  setPersonalStatement: (html: string) => void

  // Reset
  reset: () => void
}

// ── STORE ───────────────────────────────────────────────────────────────────────

const INITIAL_STATE: AppState = {
  injuries: [],
  mentalConditions: [],
  headConditions: [],
  bpConditions: { ...DEFAULT_BP_CONDITIONS },
  specialClaims: { ...DEFAULT_SPECIAL_CLAIMS },
  ui: { ...DEFAULT_UI },
  personalStatement: '',
  ratingOverrides: {},
}

export const useInjuryStore = create<AppState & Actions>()(
  persist(
    (set) => ({
  ...INITIAL_STATE,

  // ── Injuries ──
  addInjury: (injury) =>
    set((s) => ({ injuries: [...s.injuries, injury] })),

  updateInjury: (id, patch) =>
    set((s) => ({
      injuries: s.injuries.map((inj) => (inj.id === id ? { ...inj, ...patch } : inj)),
    })),

  removeInjury: (id) =>
    set((s) => ({ injuries: s.injuries.filter((inj) => inj.id !== id) })),

  // ── Mental Health ──
  addMHCondition: (condition) =>
    set((s) => ({ mentalConditions: [...s.mentalConditions, condition] })),

  updateMHCondition: (id, patch) =>
    set((s) => ({
      mentalConditions: s.mentalConditions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),

  removeMHCondition: (id) =>
    set((s) => ({ mentalConditions: s.mentalConditions.filter((c) => c.id !== id) })),

  // ── Head / Face ──
  addHeadCondition: (condition) =>
    set((s) => ({ headConditions: [...s.headConditions, condition] })),

  updateHeadCondition: (id, patch) =>
    set((s) => ({
      headConditions: s.headConditions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),

  removeHeadCondition: (id) =>
    set((s) => ({ headConditions: s.headConditions.filter((c) => c.id !== id) })),

  // ── Body Part Conditions ──
  addBPCondition: (region, condition) =>
    set((s) => ({
      bpConditions: {
        ...s.bpConditions,
        [region]: [...s.bpConditions[region], condition],
      },
    })),

  updateBPCondition: (region, id, patch) =>
    set((s) => ({
      bpConditions: {
        ...s.bpConditions,
        [region]: s.bpConditions[region].map((c) => (c.id === id ? { ...c, ...patch } : c)),
      },
    })),

  removeBPCondition: (region, id) =>
    set((s) => ({
      bpConditions: {
        ...s.bpConditions,
        [region]: s.bpConditions[region].filter((c) => c.id !== id),
      },
    })),

  // ── Special Claims ──
  setSpecialClaims: (patch) =>
    set((s) => ({ specialClaims: { ...s.specialClaims, ...patch } })),

  setClaimField: (claimId, fieldId, value) =>
    set((s) => ({
      specialClaims: {
        ...s.specialClaims,
        claims: {
          ...s.specialClaims.claims,
          [claimId]: { ...(s.specialClaims.claims[claimId] ?? {}), [fieldId]: value },
        },
      },
    })),

  toggleSMC: (id) =>
    set((s) => {
      const sel = s.specialClaims.smcSelections
      const next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]
      return { specialClaims: { ...s.specialClaims, smcSelections: next } }
    }),

  setPresumptiveField: (claimId, fieldId, value) =>
    set((s) => ({
      specialClaims: {
        ...s.specialClaims,
        presumptiveData: {
          ...s.specialClaims.presumptiveData,
          [claimId]: {
            ...(s.specialClaims.presumptiveData[claimId] ?? {}),
            [fieldId]: value,
          },
        },
      },
    })),

  // ── UI ──
  setActiveTab: (tab) =>
    set((s) => ({ ui: { ...s.ui, activeTab: tab } })),

  setSide: (side) =>
    set((s) => ({ ui: { ...s.ui, curSide: side } })),

  setBody: (body) =>
    set((s) => ({ ui: { ...s.ui, curBody: body } })),

  setActivePanel: (panel) =>
    set((s) => ({ ui: { ...s.ui, activePanel: panel } })),

  setPinPlaceMode: (mode) =>
    set((s) => ({ ui: { ...s.ui, pinPlaceMode: mode } })),

  setEditingId: (id) =>
    set((s) => ({ ui: { ...s.ui, editingId: id } })),

  setPendingPin: (pin) =>
    set((s) => ({ ui: { ...s.ui, pendingPin: pin } })),

  // ── Pin position (drag) ──
  updateInjuryPin: (id, pin) =>
    set((s) => ({
      injuries: s.injuries.map((inj) => (inj.id === id ? { ...inj, pin } : inj)),
    })),

  // ── Rating Overrides ──
  setRatingOverride: (key, val) =>
    set((s) => ({ ratingOverrides: { ...s.ratingOverrides, [key]: val } })),

  // ── Personal Statement ──
  setPersonalStatement: (html) => set({ personalStatement: html }),

  // ── Reset ──
  reset: () => set(INITIAL_STATE),
}),
    {
      name: 'injury-session',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

// ── SELECTORS ───────────────────────────────────────────────────────────────────

export const selectInjuries = (s: AppState & Actions) => s.injuries
export const selectMentalConditions = (s: AppState & Actions) => s.mentalConditions
export const selectHeadConditions = (s: AppState & Actions) => s.headConditions
export const selectBPConditions = (region: BPRegion) => (s: AppState & Actions) =>
  s.bpConditions[region]
export const selectSpecialClaims = (s: AppState & Actions) => s.specialClaims
export const selectRatingOverrides = (s: AppState & Actions) => s.ratingOverrides
export const selectUI = (s: AppState & Actions) => s.ui
