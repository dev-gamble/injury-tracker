"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type {
  ConditionPin,
  EvalCondition,
  EvalPanelState,
  FormModalState,
  Injury,
  MHDomainValue,
  PendingPin,
  PinPlaceMode,
} from "./types"
import {
  BACK_PINS,
  BP_REGISTRY,
  FRONT_PINS,
  getGroupForKey,
  hasBilateralSides,
  HEAD_KEYS,
  HEAD_PINS,
  MENTAL_PINS,
  SIDEBAR_ITEMS,
} from "./data"
import {
  calculateMaxRating,
  calculateMHRating,
  getProfileForRegion,
  MH_DOMAINS,
} from "./profiles"

interface BadgeInfo {
  count: number
  severity: string
}

interface BilateralPrompt {
  regionId: string
  condName: string
  leftKey: string
  rightKey: string
}

interface TrackerContextValue {
  // State
  injuries: Injury[]
  curSide: "front" | "back"
  curBody: "male" | "female"
  pinPlaceMode: PinPlaceMode | null
  formModal: FormModalState
  userId: string
  sidebarSearch: string
  pendingImpacts: string[]

  // Eval panel state
  evalPanel: EvalPanelState
  evalConditions: Record<string, EvalCondition[]>
  evalSearch: string
  bilateralPrompt: BilateralPrompt | null

  // Condition pins (from eval panels)
  conditionPins: ConditionPin[]
  toast: { visible: boolean; message: string } | null

  // Derived
  activeViewId: string
  badgeCounts: Record<string, BadgeInfo>
  injuryNumber: (id: number) => number | string

  // Actions
  setSide: (s: "front" | "back") => void
  setBody: (b: "male" | "female") => void
  enterPinPlaceMode: (key: string, label: string, fromPanel?: boolean) => void
  cancelPinPlaceMode: () => void
  quickSelect: (key: string) => void
  bodyClicked: (x: number, y: number) => void
  editInjury: (id: number) => void
  saveInjury: (formData: Partial<Injury>) => void
  deleteInjury: (id: number) => void
  cancelForm: () => void
  closeModal: () => void
  updatePinPosition: (id: number, x: number, y: number) => void
  addImpact: (impact: string) => void
  removeImpact: (impact: string) => void
  setSidebarSearch: (val: string) => void
  setUserId: (val: string) => void

  // Eval panel actions
  openEvalPanel: (type: "mental" | "head" | "bp", regionId: string, pinKey: string) => void
  closeEvalPanel: () => void
  placePinFromPanel: () => void
  toggleEvalCondition: (regionId: string, condName: string) => void
  updateEvalDomain: (regionId: string, condId: number, domainId: string, value: number | MHDomainValue) => void
  updateMHFrequency: (condId: number, domainId: string, freq: string) => void
  setEvalOverride: (regionId: string, condId: number, value: number | null) => void
  toggleEvalOverride: (regionId: string, condId: number, checked: boolean) => void
  removeEvalCondition: (regionId: string, condId: number) => void
  unlinkBilateral: (regionId: string, condId: number) => void
  switchBPSide: (regionId: string, key: string) => void
  setEvalSearch: (val: string) => void
  showBilateralPrompt: (regionId: string, condName: string, leftKey: string, rightKey: string) => void
  resolveBilateralPrompt: (chosenKey: string, isBoth: boolean) => void
  toggleEvalCard: (condId: number) => void
  collapsedCards: Set<number>

  // Condition pin actions
  removeConditionPin: (condId: number) => void
  updateConditionPinPosition: (condId: number, x: number, y: number) => void
  dismissToast: () => void
}

const TrackerContext = createContext<TrackerContextValue | null>(null)

export function useTracker(): TrackerContextValue {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error("useTracker must be used within TrackerProvider")
  return ctx
}

function getPinLabel(key: string, side: "front" | "back"): string {
  if (SIDEBAR_ITEMS[key]) return SIDEBAR_ITEMS[key]
  const allPins = {
    ...MENTAL_PINS,
    ...HEAD_PINS,
    ...(side === "front" ? FRONT_PINS : BACK_PINS),
  }
  return allPins[key]?.label || "Other / Unlisted"
}

const SEVERITY_ORDER: Record<string, number> = {
  custom: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
}

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [injuries, setInjuries] = useState<Injury[]>([])
  const [curSide, setCurSide] = useState<"front" | "back">("front")
  const [curBody, setCurBody] = useState<"male" | "female">("male")
  const [pinPlaceMode, setPinPlaceMode] = useState<PinPlaceMode | null>(null)
  const [formModal, setFormModal] = useState<FormModalState>({
    isOpen: false,
    editingId: null,
    pendingPin: null,
  })
  const [userId, setUserId] = useState("")
  const [sidebarSearch, setSidebarSearch] = useState("")
  const [pendingImpacts, setPendingImpacts] = useState<string[]>([])

  // Eval panel state
  const [evalPanel, setEvalPanel] = useState<EvalPanelState>({
    type: null,
    regionId: null,
    pinKey: "",
  })
  const [evalConditions, setEvalConditions] = useState<Record<string, EvalCondition[]>>({})
  const [evalSearch, setEvalSearch] = useState("")
  const [bilateralPrompt, setBilateralPrompt] = useState<BilateralPrompt | null>(null)
  const [collapsedCards, setCollapsedCards] = useState<Set<number>>(new Set())

  // Condition pins (from eval panels)
  const [conditionPins, setConditionPins] = useState<ConditionPin[]>([])
  const [toast, setToast] = useState<{ visible: boolean; message: string } | null>(null)

  const activeViewId = useMemo(
    () => (curBody === "male" ? "m" : "f") + (curSide === "front" ? "f" : "b"),
    [curBody, curSide],
  )

  const badgeCounts = useMemo(() => {
    const counts: Record<string, BadgeInfo> = {}
    for (const inj of injuries) {
      const group = getGroupForKey(inj.key)
      if (!counts[group]) {
        counts[group] = { count: 0, severity: "custom" }
      }
      counts[group].count++
      const injOrder = SEVERITY_ORDER[inj.severity] ?? 0
      const curOrder = SEVERITY_ORDER[counts[group].severity] ?? 0
      if (injOrder > curOrder) {
        counts[group].severity = inj.severity
      }
    }
    return counts
  }, [injuries])

  const injuryNumber = useCallback(
    (id: number): number | string => {
      const sorted = [...injuries].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id,
      )
      const idx = sorted.findIndex((i) => i.id === id)
      return idx >= 0 ? idx + 1 : "?"
    },
    [injuries],
  )

  const setSide = useCallback((s: "front" | "back") => {
    setCurSide(s)
    setPinPlaceMode(null)
  }, [])

  const setBody = useCallback((b: "male" | "female") => {
    setCurBody(b)
  }, [])

  const enterPinPlaceMode = useCallback(
    (key: string, label: string, fromPanel?: boolean) => {
      setPinPlaceMode({ key, label, fromPanel: !!fromPanel })
    },
    [],
  )

  const cancelPinPlaceMode = useCallback(() => {
    setPinPlaceMode(null)
  }, [])

  // ── EVAL PANEL ACTIONS ─────────────────────────────────────────────────────

  const openEvalPanel = useCallback(
    (type: "mental" | "head" | "bp", regionId: string, pinKey: string) => {
      // Mark existing conditions as committed (except MH which is multi-select)
      if (type !== "mental") {
        setEvalConditions((prev) => {
          const existing = prev[regionId] || []
          if (existing.length === 0) return prev
          return {
            ...prev,
            [regionId]: existing.map((c) => ({ ...c, _committed: true })),
          }
        })
      }
      setEvalPanel({ type, regionId, pinKey })
      setEvalSearch("")
      setCollapsedCards(new Set())
    },
    [],
  )

  const closeEvalPanel = useCallback(() => {
    setEvalPanel({ type: null, regionId: null, pinKey: "" })
    setEvalSearch("")
    setBilateralPrompt(null)
  }, [])

  const placePinFromPanel = useCallback(() => {
    const { type, regionId } = evalPanel
    if (!type || !regionId) return

    const conds = evalConditions[regionId] || []

    if (type === "mental") {
      // MH: use highest-rated condition name
      let best: EvalCondition | null = null
      for (const c of conds) {
        if (!best || c.effectiveRating > best.effectiveRating) best = c
      }
      const label = best ? best.condition : "Mental Health"
      closeEvalPanel()
      enterPinPlaceMode("mental", label, true)
    } else if (type === "head") {
      const label = conds.length ? conds[conds.length - 1].condition : "Head & Face"
      closeEvalPanel()
      enterPinPlaceMode("headFace", label, true)
    } else {
      // BP
      const cfg = BP_REGISTRY[regionId]
      if (!cfg) return
      const label = conds.length ? conds[conds.length - 1].condition : cfg.title
      const pinKey = (evalPanel.pinKey && evalPanel.pinKey !== "both")
        ? evalPanel.pinKey
        : Object.keys(cfg.sideKeys)[0] || regionId
      closeEvalPanel()
      enterPinPlaceMode(pinKey, label, true)
    }
  }, [evalPanel, evalConditions, closeEvalPanel, enterPinPlaceMode])

  const toggleEvalCondition = useCallback(
    (regionId: string, condName: string) => {
      const panelType = evalPanel.type

      if (panelType === "mental") {
        // Multi-select: toggle on/off
        setEvalConditions((prev) => {
          const conds = prev[regionId] || []
          const existing = conds.find((c) => c.condition === condName)
          if (existing) {
            return { ...prev, [regionId]: conds.filter((c) => c.id !== existing.id) }
          }
          // Add new MH condition
          const domains: Record<string, MHDomainValue> = {}
          for (const d of MH_DOMAINS) {
            domains[d.id] = { level: "none", frequency: "less25" }
          }
          const newCond: EvalCondition = {
            id: Date.now() + Math.random(),
            condition: condName,
            profile: "mental",
            domains,
            calculatedRating: 0,
            manualOverride: null,
            effectiveRating: 0,
            extremity: "none",
            sideLabel: "",
            bilateralLinked: false,
            bilateralPairId: null,
            bilateralSource: false,
            _committed: false,
          }
          return { ...prev, [regionId]: [...conds, newCond] }
        })
        return
      }

      // Head & BP: single-select with committed filter
      setEvalConditions((prev) => {
        const conds = prev[regionId] || []
        const uncommitted = conds.filter((c) => !c._committed)
        const alreadySelected = uncommitted.find((c) => c.condition === condName)

        if (alreadySelected) {
          // Deselect
          return { ...prev, [regionId]: conds.filter((c) => c.id !== alreadySelected.id) }
        }

        // Remove previous uncommitted selection
        const cleaned = conds.filter((c) => c._committed)

        // For bilateral BP panels, defer to the side selection popup
        if (panelType === "bp" && hasBilateralSides(regionId)) {
          const cfg = BP_REGISTRY[regionId]
          const sides = Object.entries(cfg.sideKeys)
          const leftKey = sides.find(([k]) => k.toLowerCase().startsWith("left"))
          const rightKey = sides.find(([k]) => k.toLowerCase().startsWith("right"))
          if (leftKey && rightKey) {
            // Store the cleaned state and show bilateral prompt
            // The prompt resolution will actually add the condition
            setBilateralPrompt({
              regionId,
              condName,
              leftKey: leftKey[0],
              rightKey: rightKey[0],
            })
            // Remove uncommitted from state while waiting
            return { ...prev, [regionId]: cleaned }
          }
        }

        // Non-bilateral: add condition directly
        const { profile, profileKey } = getProfileForRegion(regionId, condName)
        const domains: Record<string, number> = {}
        for (const d of profile.domains) {
          domains[d.id] = 0
        }
        const cfg = BP_REGISTRY[regionId]
        const pinKey = evalPanel.pinKey
        const ext = cfg ? (cfg.extremityMap[pinKey] || "none") : "none"
        const sideLabel = cfg ? (cfg.sideKeys[pinKey] || "") : ""

        const newCond: EvalCondition = {
          id: Date.now() + Math.random(),
          condition: condName,
          profile: profileKey,
          domains,
          calculatedRating: 0,
          manualOverride: null,
          effectiveRating: 0,
          extremity: ext,
          sideLabel,
          bilateralLinked: false,
          bilateralPairId: null,
          bilateralSource: false,
          _committed: false,
        }
        return { ...prev, [regionId]: [...cleaned, newCond] }
      })
    },
    [evalPanel.type, evalPanel.pinKey],
  )

  const resolveBilateralPrompt = useCallback(
    (chosenKey: string, isBoth: boolean) => {
      if (!bilateralPrompt) return
      const { regionId, condName, leftKey, rightKey } = bilateralPrompt
      setBilateralPrompt(null)

      const cfg = BP_REGISTRY[regionId]
      if (!cfg) return

      const { profile, profileKey } = getProfileForRegion(regionId, condName)
      const makeDomains = () => {
        const d: Record<string, number> = {}
        for (const dom of profile.domains) d[dom.id] = 0
        return d
      }

      setEvalConditions((prev) => {
        const conds = prev[regionId] || []
        // Remove uncommitted (already cleaned in toggleEvalCondition, but be safe)
        const cleaned = conds.filter((c) => c._committed)

        if (isBoth) {
          const id1 = Date.now() + Math.random()
          const id2 = id1 + 0.001
          const c1: EvalCondition = {
            id: id1,
            condition: condName,
            profile: profileKey,
            domains: makeDomains(),
            calculatedRating: 0,
            manualOverride: null,
            effectiveRating: 0,
            extremity: cfg.extremityMap[leftKey] || "none",
            sideLabel: cfg.sideKeys[leftKey] || "",
            bilateralLinked: true,
            bilateralPairId: id2,
            bilateralSource: true,
            _committed: false,
          }
          const c2: EvalCondition = {
            id: id2,
            condition: condName,
            profile: profileKey,
            domains: makeDomains(),
            calculatedRating: 0,
            manualOverride: null,
            effectiveRating: 0,
            extremity: cfg.extremityMap[rightKey] || "none",
            sideLabel: cfg.sideKeys[rightKey] || "",
            bilateralLinked: true,
            bilateralPairId: id1,
            bilateralSource: false,
            _committed: false,
          }
          return { ...prev, [regionId]: [...cleaned, c1, c2] }
        } else {
          // Single side
          const newCond: EvalCondition = {
            id: Date.now() + Math.random(),
            condition: condName,
            profile: profileKey,
            domains: makeDomains(),
            calculatedRating: 0,
            manualOverride: null,
            effectiveRating: 0,
            extremity: cfg.extremityMap[chosenKey] || "none",
            sideLabel: cfg.sideKeys[chosenKey] || "",
            bilateralLinked: false,
            bilateralPairId: null,
            bilateralSource: false,
            _committed: false,
          }
          // Also update the pinKey to the chosen side
          setEvalPanel((prev) => ({ ...prev, pinKey: chosenKey }))
          return { ...prev, [regionId]: [...cleaned, newCond] }
        }
      })
    },
    [bilateralPrompt],
  )

  const showBilateralPrompt = useCallback(
    (regionId: string, condName: string, leftKey: string, rightKey: string) => {
      setBilateralPrompt({ regionId, condName, leftKey, rightKey })
    },
    [],
  )

  const updateEvalDomain = useCallback(
    (regionId: string, condId: number, domainId: string, value: number | MHDomainValue) => {
      setEvalConditions((prev) => {
        const conds = prev[regionId] || []
        const idx = conds.findIndex((c) => c.id === condId)
        if (idx < 0) return prev

        const cond = { ...conds[idx], domains: { ...conds[idx].domains, [domainId]: value } }

        // Recalculate rating
        if (evalPanel.type === "mental") {
          cond.calculatedRating = calculateMHRating(cond.domains as Record<string, MHDomainValue>)
        } else {
          cond.calculatedRating = calculateMaxRating(cond.domains as Record<string, number>)
        }
        if (cond.manualOverride === null) {
          cond.effectiveRating = cond.calculatedRating
        }

        const updated = [...conds]
        updated[idx] = cond

        // Bilateral sync: source → target auto-syncs; editing target unlinks
        if (cond.bilateralLinked && cond.bilateralPairId) {
          const pairIdx = updated.findIndex((c) => c.id === cond.bilateralPairId)
          if (pairIdx >= 0 && updated[pairIdx].bilateralLinked) {
            if (cond.bilateralSource) {
              // Source → sync to target
              const pair = {
                ...updated[pairIdx],
                domains: { ...updated[pairIdx].domains, [domainId]: value },
              }
              pair.calculatedRating = calculateMaxRating(pair.domains as Record<string, number>)
              if (pair.manualOverride === null) pair.effectiveRating = pair.calculatedRating
              updated[pairIdx] = pair
            } else {
              // Editing target → unlink both
              updated[idx] = {
                ...updated[idx],
                bilateralLinked: false,
                bilateralPairId: null,
                bilateralSource: false,
              }
              updated[pairIdx] = {
                ...updated[pairIdx],
                bilateralLinked: false,
                bilateralPairId: null,
                bilateralSource: false,
              }
            }
          }
        }

        return { ...prev, [regionId]: updated }
      })
    },
    [evalPanel.type],
  )

  const updateMHFrequency = useCallback(
    (condId: number, domainId: string, freq: string) => {
      const regionId = "mental"
      setEvalConditions((prev) => {
        const conds = prev[regionId] || []
        const idx = conds.findIndex((c) => c.id === condId)
        if (idx < 0) return prev

        const cond = { ...conds[idx], domains: { ...conds[idx].domains } }
        const domVal = cond.domains[domainId] as MHDomainValue
        cond.domains[domainId] = { ...domVal, frequency: freq }
        cond.calculatedRating = calculateMHRating(cond.domains as Record<string, MHDomainValue>)
        if (cond.manualOverride === null) cond.effectiveRating = cond.calculatedRating

        const updated = [...conds]
        updated[idx] = cond
        return { ...prev, [regionId]: updated }
      })
    },
    [],
  )

  const setEvalOverride = useCallback(
    (regionId: string, condId: number, value: number | null) => {
      setEvalConditions((prev) => {
        const conds = prev[regionId] || []
        const idx = conds.findIndex((c) => c.id === condId)
        if (idx < 0) return prev

        const cond = { ...conds[idx] }
        if (value === null) {
          cond.manualOverride = null
          cond.effectiveRating = cond.calculatedRating
        } else {
          cond.manualOverride = value
          cond.effectiveRating = value
        }

        const updated = [...conds]
        updated[idx] = cond

        // Bilateral sync for overrides
        if (cond.bilateralLinked && cond.bilateralSource && cond.bilateralPairId) {
          const pairIdx = updated.findIndex((c) => c.id === cond.bilateralPairId)
          if (pairIdx >= 0 && updated[pairIdx].bilateralLinked) {
            const pair = { ...updated[pairIdx] }
            pair.manualOverride = cond.manualOverride
            pair.effectiveRating = cond.effectiveRating
            updated[pairIdx] = pair
          }
        }

        return { ...prev, [regionId]: updated }
      })
    },
    [],
  )

  const toggleEvalOverride = useCallback(
    (regionId: string, condId: number, checked: boolean) => {
      setEvalConditions((prev) => {
        const conds = prev[regionId] || []
        const idx = conds.findIndex((c) => c.id === condId)
        if (idx < 0) return prev

        const cond = { ...conds[idx] }
        if (checked) {
          cond.manualOverride = cond.calculatedRating
          cond.effectiveRating = cond.manualOverride
        } else {
          cond.manualOverride = null
          cond.effectiveRating = cond.calculatedRating
        }

        const updated = [...conds]
        updated[idx] = cond
        return { ...prev, [regionId]: updated }
      })
    },
    [],
  )

  const removeEvalCondition = useCallback(
    (regionId: string, condId: number) => {
      setEvalConditions((prev) => {
        const conds = prev[regionId] || []
        const removing = conds.find((c) => c.id === condId)

        let updated = conds.filter((c) => c.id !== condId)

        // Unlink bilateral pair
        if (removing?.bilateralPairId) {
          updated = updated.map((c) => {
            if (c.id === removing.bilateralPairId) {
              return { ...c, bilateralLinked: false, bilateralPairId: null, bilateralSource: false }
            }
            return c
          })
        }

        return { ...prev, [regionId]: updated }
      })
    },
    [],
  )

  const unlinkBilateral = useCallback(
    (regionId: string, condId: number) => {
      setEvalConditions((prev) => {
        const conds = prev[regionId] || []
        const cond = conds.find((c) => c.id === condId)
        if (!cond) return prev

        return {
          ...prev,
          [regionId]: conds.map((c) => {
            if (c.id === condId || c.id === cond.bilateralPairId) {
              return { ...c, bilateralLinked: false, bilateralPairId: null, bilateralSource: false }
            }
            return c
          }),
        }
      })
    },
    [],
  )

  const switchBPSide = useCallback(
    (_regionId: string, key: string) => {
      setEvalPanel((prev) => ({ ...prev, pinKey: key }))
    },
    [],
  )

  const toggleEvalCard = useCallback(
    (condId: number) => {
      setCollapsedCards((prev) => {
        const next = new Set(prev)
        if (next.has(condId)) next.delete(condId)
        else next.add(condId)
        return next
      })
    },
    [],
  )

  // ── QUICK SELECT (fixed routing) ───────────────────────────────────────────

  const quickSelect = useCallback(
    (key: string) => {
      // Mental health opens the dedicated evaluation panel
      if (key === "mental") {
        openEvalPanel("mental", "mental", "mental")
        return
      }

      // Head & Face opens the head evaluation panel
      if (HEAD_KEYS.includes(key)) {
        openEvalPanel("head", "headFace", key)
        return
      }

      // Direct region key (from simplified sidebar)
      if (BP_REGISTRY[key]) {
        openEvalPanel("bp", key, Object.keys(BP_REGISTRY[key].sideKeys)[0])
        return
      }

      // Pin key → find matching region
      for (const [regionId, cfg] of Object.entries(BP_REGISTRY)) {
        if (cfg.sideKeys[key]) {
          openEvalPanel("bp", regionId, key)
          return
        }
      }

      // Fallback: direct pin placement (no eval panel)
      const label = getPinLabel(key, curSide)
      enterPinPlaceMode(key, label)
    },
    [curSide, enterPinPlaceMode, openEvalPanel],
  )

  const autoCreatePinsFromPanel = useCallback(
    (x: number, y: number, key: string) => {
      // Gather conditions from evalConditions based on key
      let conditionsToPin: { ref: EvalCondition; regionId: string; label: string; isBilateral: boolean }[] = []

      if (key === "mental") {
        conditionsToPin = (evalConditions["mental"] || []).map((c) => ({
          ref: c, regionId: "mental", label: c.condition, isBilateral: false,
        }))
      } else if (key === "headFace" || key === "head") {
        conditionsToPin = (evalConditions["headFace"] || []).map((c) => ({
          ref: c, regionId: "headFace", label: c.condition, isBilateral: false,
        }))
      } else {
        // Find matching BP_REGISTRY region by sideKey or direct key
        for (const [regionId, cfg] of Object.entries(BP_REGISTRY)) {
          if (cfg.sideKeys[key] || regionId === key) {
            conditionsToPin = (evalConditions[regionId] || []).map((c) => ({
              ref: c, regionId, label: c.condition, isBilateral: !!c.bilateralLinked,
            }))
            break
          }
        }
      }

      // Filter out conditions that already have pins
      const existingIds = new Set(conditionPins.map((p) => p.id))
      const needsPin = conditionsToPin.filter((c) => !existingIds.has(c.ref.id))

      if (needsPin.length === 0) return

      // Create pins with staggered x offset
      const newPins: ConditionPin[] = needsPin.map((item, i) => {
        const px = Math.min(95, x + i * 2.5)
        const rating = item.ref.effectiveRating || item.ref.calculatedRating || 0

        // Determine side tag
        let sideTag = ""
        if (item.isBilateral) {
          sideTag = "(B)"
        } else if (item.ref.sideLabel) {
          const sl = item.ref.sideLabel.toLowerCase()
          if (sl.includes("left")) sideTag = "(L)"
          else if (sl.includes("right")) sideTag = "(R)"
        } else if (item.ref.extremity && item.ref.extremity !== "none") {
          const ex = item.ref.extremity.toLowerCase()
          if (ex.startsWith("l")) sideTag = "(L)"
          else if (ex.startsWith("r")) sideTag = "(R)"
        }

        const pinLabel = sideTag
          ? `${sideTag} ${item.label} — ${rating}%`
          : `${item.label} — ${rating}%`

        return {
          id: item.ref.id,
          condition: item.label,
          regionId: item.regionId,
          rating,
          sideLabel: item.ref.sideLabel || "",
          extremity: item.ref.extremity || "none",
          bilateralLinked: item.isBilateral,
          pin: {
            x: px,
            y,
            side: curSide,
            body: curBody,
            label: pinLabel,
          },
        }
      })

      setConditionPins((prev) => [...prev, ...newPins])
      setToast({ visible: true, message: "Pin placed! Rate severity & add secondaries" })
    },
    [evalConditions, conditionPins, curSide, curBody],
  )

  const bodyClicked = useCallback(
    (x: number, y: number) => {
      if (pinPlaceMode) {
        const { key, label, fromPanel } = pinPlaceMode
        setPinPlaceMode(null)

        if (fromPanel) {
          // Coming from evaluation panel — auto-create pins, skip form modal
          autoCreatePinsFromPanel(x, y, key)
          return
        }

        // Normal flow: open form modal
        const pending: PendingPin = { x, y, side: curSide, body: curBody, key, label }
        setPendingImpacts([])
        setFormModal({ isOpen: true, editingId: null, pendingPin: pending })
        return
      }
      // Free-click custom pin
      const pending: PendingPin = {
        x,
        y,
        side: curSide,
        body: curBody,
        key: "custom",
        label: "",
      }
      setPendingImpacts([])
      setFormModal({ isOpen: true, editingId: null, pendingPin: pending })
    },
    [pinPlaceMode, curSide, curBody, autoCreatePinsFromPanel],
  )

  const editInjury = useCallback(
    (id: number) => {
      const inj = injuries.find((i) => i.id === id)
      if (!inj) return
      setPendingImpacts([...inj.functionalImpacts])
      setFormModal({ isOpen: true, editingId: id, pendingPin: null })
    },
    [injuries],
  )

  const saveInjury = useCallback(
    (formData: Partial<Injury>) => {
      if (formModal.editingId !== null) {
        // Edit mode
        setInjuries((prev) =>
          prev.map((inj) => {
            if (inj.id !== formModal.editingId) return inj
            const updated = { ...inj, ...formData, functionalImpacts: [...pendingImpacts] }
            if (formData.label) {
              updated.pin = { ...updated.pin, label: formData.label }
            }
            return updated
          }),
        )
      } else if (formModal.pendingPin) {
        // New injury
        const pin = formModal.pendingPin
        const newInjury: Injury = {
          id: Date.now(),
          key: formData.key || pin.key,
          label: formData.label || pin.label,
          date: formData.date || "",
          severity: formData.severity || "moderate",
          location: formData.location || "",
          event: formData.event || "",
          description: formData.description || "",
          medicalCare: formData.medicalCare || "",
          clinicName: formData.clinicName || "",
          witnesses: formData.witnesses || "",
          stillBeingSeen: formData.stillBeingSeen || false,
          functionalImpacts: [...pendingImpacts],
          secondaries: [],
          secondaryRatings: {},
          pin: {
            x: pin.x,
            y: pin.y,
            side: pin.side,
            body: pin.body,
            label: formData.label || pin.label,
          },
        }
        setInjuries((prev) => [...prev, newInjury])
      }
      setFormModal({ isOpen: false, editingId: null, pendingPin: null })
      setPendingImpacts([])
    },
    [formModal, pendingImpacts],
  )

  const deleteInjury = useCallback((id: number) => {
    setInjuries((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const cancelForm = useCallback(() => {
    setFormModal({ isOpen: false, editingId: null, pendingPin: null })
    setPendingImpacts([])
  }, [])

  const closeModal = useCallback(() => {
    setFormModal({ isOpen: false, editingId: null, pendingPin: null })
    setPendingImpacts([])
  }, [])

  const updatePinPosition = useCallback((id: number, x: number, y: number) => {
    setInjuries((prev) =>
      prev.map((inj) => {
        if (inj.id !== id) return inj
        return { ...inj, pin: { ...inj.pin, x, y } }
      }),
    )
  }, [])

  const addImpact = useCallback((impact: string) => {
    const trimmed = impact.trim()
    if (!trimmed) return
    setPendingImpacts((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]))
  }, [])

  const removeImpact = useCallback((impact: string) => {
    setPendingImpacts((prev) => prev.filter((fi) => fi !== impact))
  }, [])

  const removeConditionPin = useCallback((condId: number) => {
    setConditionPins((prev) => prev.filter((p) => p.id !== condId))
  }, [])

  const updateConditionPinPosition = useCallback((condId: number, x: number, y: number) => {
    setConditionPins((prev) =>
      prev.map((p) => {
        if (p.id !== condId) return p
        return { ...p, pin: { ...p.pin, x, y } }
      }),
    )
  }, [])

  const dismissToast = useCallback(() => {
    setToast(null)
  }, [])

  const value = useMemo<TrackerContextValue>(
    () => ({
      injuries,
      curSide,
      curBody,
      pinPlaceMode,
      formModal,
      userId,
      sidebarSearch,
      pendingImpacts,
      evalPanel,
      evalConditions,
      evalSearch,
      bilateralPrompt,
      activeViewId,
      badgeCounts,
      injuryNumber,
      setSide,
      setBody,
      enterPinPlaceMode,
      cancelPinPlaceMode,
      quickSelect,
      bodyClicked,
      editInjury,
      saveInjury,
      deleteInjury,
      cancelForm,
      closeModal,
      updatePinPosition,
      addImpact,
      removeImpact,
      setSidebarSearch,
      setUserId,
      openEvalPanel,
      closeEvalPanel,
      placePinFromPanel,
      toggleEvalCondition,
      updateEvalDomain,
      updateMHFrequency,
      setEvalOverride,
      toggleEvalOverride,
      removeEvalCondition,
      unlinkBilateral,
      switchBPSide,
      setEvalSearch,
      showBilateralPrompt,
      resolveBilateralPrompt,
      toggleEvalCard,
      collapsedCards,
      conditionPins,
      toast,
      removeConditionPin,
      updateConditionPinPosition,
      dismissToast,
    }),
    [
      injuries,
      curSide,
      curBody,
      pinPlaceMode,
      formModal,
      userId,
      sidebarSearch,
      pendingImpacts,
      evalPanel,
      evalConditions,
      evalSearch,
      bilateralPrompt,
      conditionPins,
      toast,
      activeViewId,
      badgeCounts,
      injuryNumber,
      setSide,
      setBody,
      enterPinPlaceMode,
      cancelPinPlaceMode,
      quickSelect,
      bodyClicked,
      editInjury,
      saveInjury,
      deleteInjury,
      cancelForm,
      closeModal,
      updatePinPosition,
      addImpact,
      removeImpact,
      setSidebarSearch,
      setUserId,
      openEvalPanel,
      closeEvalPanel,
      placePinFromPanel,
      toggleEvalCondition,
      updateEvalDomain,
      updateMHFrequency,
      setEvalOverride,
      toggleEvalOverride,
      removeEvalCondition,
      unlinkBilateral,
      switchBPSide,
      setEvalSearch,
      showBilateralPrompt,
      resolveBilateralPrompt,
      toggleEvalCard,
      collapsedCards,
      conditionPins,
      toast,
      removeConditionPin,
      updateConditionPinPosition,
      dismissToast,
    ],
  )

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
}
