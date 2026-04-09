'use client'

import { createContext, useContext, useReducer, type Dispatch } from 'react'
import type { TrackerState, Injury, MentalHealthCondition, HeadCondition, BPCondition, MSTData, PlacedPin, TabName, BodySide, BodyGender } from '../lib/va/types'

// ── Initial State ──────────────────────────────────────────────────────────

const INITIAL_MST_DATA: MSTData = {
  privacyShield: true,
  conditions: [],
  notes: '',
  evidence: {},
}

export const INITIAL_STATE: TrackerState = {
  activeTab: 'map',
  curSide: 'front',
  curBody: 'male',
  pendingPin: null,
  bpPanelOpen: null,
  bpPinKey: '',
  bpSearch: '',
  injuries: [],
  mentalHealthConditions: [],
  headConditions: [],
  bpConditions: {},
  mstData: INITIAL_MST_DATA,
  smcSelections: [],
  presumptiveData: {},
  vocSecondaries: [],
  vocNotes: '',
  personalStatement: '',
}

// ── Actions ────────────────────────────────────────────────────────────────

export type TrackerAction =
  // UI state
  | { type: 'SET_ACTIVE_TAB'; tab: TabName }
  | { type: 'SET_CUR_SIDE'; side: BodySide }
  | { type: 'SET_CUR_BODY'; body: BodyGender }
  | { type: 'SET_PENDING_PIN'; pin: PlacedPin | null }
  | { type: 'SET_BP_PANEL_OPEN'; regionId: string | null }
  | { type: 'SET_BP_PIN_KEY'; key: string }
  | { type: 'SET_BP_SEARCH'; search: string }
  // Injuries
  | { type: 'ADD_INJURY'; injury: Injury }
  | { type: 'UPDATE_INJURY'; id: number; updates: Partial<Injury> }
  | { type: 'DELETE_INJURY'; id: number }
  | { type: 'UPDATE_INJURY_PIN'; id: number; pin: PlacedPin }
  // Mental health
  | { type: 'ADD_MH_CONDITION'; condition: MentalHealthCondition }
  | { type: 'UPDATE_MH_CONDITION'; id: number; updates: Partial<MentalHealthCondition> }
  | { type: 'REMOVE_MH_CONDITION'; id: number }
  // Head conditions
  | { type: 'ADD_HEAD_CONDITION'; condition: HeadCondition }
  | { type: 'UPDATE_HEAD_CONDITION'; id: number; updates: Partial<HeadCondition> }
  | { type: 'REMOVE_HEAD_CONDITION'; id: number }
  // BP conditions
  | { type: 'ADD_BP_CONDITION'; stateKey: string; condition: BPCondition }
  | { type: 'UPDATE_BP_CONDITION'; stateKey: string; id: number; updates: Partial<BPCondition> }
  | { type: 'REMOVE_BP_CONDITION'; stateKey: string; id: number }
  // Special claims
  | { type: 'SET_MST_DATA'; data: MSTData }
  | { type: 'UPDATE_MST_DATA'; updates: Partial<MSTData> }
  | { type: 'ADD_SMC_SELECTION'; id: string }
  | { type: 'REMOVE_SMC_SELECTION'; id: string }
  | { type: 'SET_PRESUMPTIVE_DATA'; claimId: string; data: Record<string, string | boolean> }
  // Vocational / personal
  | { type: 'SET_VOC_SECONDARIES'; secondaries: string[] }
  | { type: 'ADD_VOC_SECONDARY'; condition: string }
  | { type: 'REMOVE_VOC_SECONDARY'; condition: string }
  | { type: 'SET_VOC_NOTES'; notes: string }
  | { type: 'SET_PERSONAL_STATEMENT'; statement: string }
  // Reset
  | { type: 'RESET' }

// ── Reducer ────────────────────────────────────────────────────────────────

function trackerReducer(state: TrackerState, action: TrackerAction): TrackerState {
  switch (action.type) {
    // ── UI ──
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab }
    case 'SET_CUR_SIDE':
      return { ...state, curSide: action.side }
    case 'SET_CUR_BODY':
      return { ...state, curBody: action.body }
    case 'SET_PENDING_PIN':
      return { ...state, pendingPin: action.pin }
    case 'SET_BP_PANEL_OPEN':
      return { ...state, bpPanelOpen: action.regionId }
    case 'SET_BP_PIN_KEY':
      return { ...state, bpPinKey: action.key }
    case 'SET_BP_SEARCH':
      return { ...state, bpSearch: action.search }

    // ── Injuries ──
    case 'ADD_INJURY':
      return { ...state, injuries: [...state.injuries, action.injury] }
    case 'UPDATE_INJURY':
      return {
        ...state,
        injuries: state.injuries.map(i => i.id === action.id ? { ...i, ...action.updates } : i),
      }
    case 'DELETE_INJURY':
      return { ...state, injuries: state.injuries.filter(i => i.id !== action.id) }
    case 'UPDATE_INJURY_PIN':
      return {
        ...state,
        injuries: state.injuries.map(i => i.id === action.id ? { ...i, pin: action.pin } : i),
      }

    // ── Mental Health ──
    case 'ADD_MH_CONDITION':
      return { ...state, mentalHealthConditions: [...state.mentalHealthConditions, action.condition] }
    case 'UPDATE_MH_CONDITION':
      return {
        ...state,
        mentalHealthConditions: state.mentalHealthConditions.map(c =>
          c.id === action.id ? { ...c, ...action.updates } : c
        ),
      }
    case 'REMOVE_MH_CONDITION':
      return { ...state, mentalHealthConditions: state.mentalHealthConditions.filter(c => c.id !== action.id) }

    // ── Head Conditions ──
    case 'ADD_HEAD_CONDITION':
      return { ...state, headConditions: [...state.headConditions, action.condition] }
    case 'UPDATE_HEAD_CONDITION':
      return {
        ...state,
        headConditions: state.headConditions.map(c =>
          c.id === action.id ? { ...c, ...action.updates } : c
        ),
      }
    case 'REMOVE_HEAD_CONDITION':
      return { ...state, headConditions: state.headConditions.filter(c => c.id !== action.id) }

    // ── BP Conditions ──
    case 'ADD_BP_CONDITION': {
      const existing = state.bpConditions[action.stateKey] ?? []
      return {
        ...state,
        bpConditions: { ...state.bpConditions, [action.stateKey]: [...existing, action.condition] },
      }
    }
    case 'UPDATE_BP_CONDITION': {
      const conds = state.bpConditions[action.stateKey] ?? []
      return {
        ...state,
        bpConditions: {
          ...state.bpConditions,
          [action.stateKey]: conds.map(c => c.id === action.id ? { ...c, ...action.updates } : c),
        },
      }
    }
    case 'REMOVE_BP_CONDITION': {
      const conds = state.bpConditions[action.stateKey] ?? []
      return {
        ...state,
        bpConditions: {
          ...state.bpConditions,
          [action.stateKey]: conds.filter(c => c.id !== action.id),
        },
      }
    }

    // ── Special Claims ──
    case 'SET_MST_DATA':
      return { ...state, mstData: action.data }
    case 'UPDATE_MST_DATA':
      return { ...state, mstData: { ...state.mstData, ...action.updates } }
    case 'ADD_SMC_SELECTION':
      if (state.smcSelections.includes(action.id)) return state
      return { ...state, smcSelections: [...state.smcSelections, action.id] }
    case 'REMOVE_SMC_SELECTION':
      return { ...state, smcSelections: state.smcSelections.filter(id => id !== action.id) }
    case 'SET_PRESUMPTIVE_DATA':
      return {
        ...state,
        presumptiveData: { ...state.presumptiveData, [action.claimId]: action.data },
      }

    // ── Vocational / Personal ──
    case 'SET_VOC_SECONDARIES':
      return { ...state, vocSecondaries: action.secondaries }
    case 'ADD_VOC_SECONDARY':
      if (state.vocSecondaries.includes(action.condition)) return state
      return { ...state, vocSecondaries: [...state.vocSecondaries, action.condition] }
    case 'REMOVE_VOC_SECONDARY':
      return { ...state, vocSecondaries: state.vocSecondaries.filter(s => s !== action.condition) }
    case 'SET_VOC_NOTES':
      return { ...state, vocNotes: action.notes }
    case 'SET_PERSONAL_STATEMENT':
      return { ...state, personalStatement: action.statement }

    // ── Reset ──
    case 'RESET':
      return INITIAL_STATE

    default:
      return state
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface TrackerContextValue {
  state: TrackerState
  dispatch: Dispatch<TrackerAction>
}

export const TrackerContext = createContext<TrackerContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

import { type ReactNode } from 'react'

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(trackerReducer, INITIAL_STATE)
  return (
    <TrackerContext.Provider value={{ state, dispatch }}>
      {children}
    </TrackerContext.Provider>
  )
}

// ── Consumer hook ──────────────────────────────────────────────────────────

export function useTracker(): TrackerContextValue {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used within a TrackerProvider')
  return ctx
}

// ── ID counter ────────────────────────────────────────────────────────────

let _nextId = Date.now()
export function nextId(): number {
  return ++_nextId
}
