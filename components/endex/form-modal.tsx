"use client"

import { useCallback, useEffect, useState } from "react"
import { useTracker } from "@/lib/endex/tracker-context"
import { VA_AREA_CONDITIONS, getGroupForKey, IMPACT_OPTIONS } from "@/lib/endex/data"

function FormModalInner() {
  const {
    formModal,
    cancelForm,
    saveInjury,
    injuries,
    pendingImpacts,
    addImpact,
    removeImpact,
  } = useTracker()

  const { editingId, pendingPin } = formModal
  const isEditing = editingId !== null
  const isCustom = !isEditing && pendingPin?.key === "custom"
  const editingInjury = isEditing
    ? injuries.find((i) => i.id === editingId)
    : null

  // Local form state
  const [bodyArea, setBodyArea] = useState("")
  const [condition, setCondition] = useState("")
  const [conditionCustom, setConditionCustom] = useState("")
  const [customLabel, setCustomLabel] = useState("")
  const [date, setDate] = useState("")
  const [severity, setSeverity] = useState("moderate")
  const [location, setLocation] = useState("")
  const [event, setEvent] = useState("")
  const [description, setDescription] = useState("")
  const [medicalCare, setMedicalCare] = useState("")
  const [clinicName, setClinicName] = useState("")
  const [witnesses, setWitnesses] = useState("")
  const [stillBeingSeen, setStillBeingSeen] = useState(false)
  const [impactCustom, setImpactCustom] = useState("")

  // Condition options for the selected body area
  const [conditionOptions, setConditionOptions] = useState<string[]>([])

  // Populate form on open
  useEffect(() => {
    if (isEditing && editingInjury) {
      const group = getGroupForKey(editingInjury.key)
      setBodyArea(group)
      setDate(editingInjury.date || "")
      setSeverity(editingInjury.severity || "moderate")
      setLocation(editingInjury.location || "")
      setEvent(editingInjury.event || "")
      setDescription(editingInjury.description || "")
      setMedicalCare(editingInjury.medicalCare || "")
      setClinicName(editingInjury.clinicName || "")
      setWitnesses(editingInjury.witnesses || "")
      setStillBeingSeen(editingInjury.stillBeingSeen || false)
      setImpactCustom("")

      // Populate condition dropdown
      const conditions = VA_AREA_CONDITIONS[group] || []
      setConditionOptions(conditions)
      if (conditions.includes(editingInjury.label)) {
        setCondition(editingInjury.label)
        setConditionCustom("")
      } else {
        setCondition("__custom__")
        setConditionCustom(editingInjury.label)
      }
      setCustomLabel(editingInjury.label)
    } else {
      // New injury - reset form
      setBodyArea("")
      setCondition("")
      setConditionCustom("")
      setCustomLabel("")
      setDate("")
      setSeverity(pendingPin?.key === "other" ? "custom" : "moderate")
      setLocation("")
      setEvent("")
      setDescription("")
      setMedicalCare("")
      setClinicName("")
      setWitnesses("")
      setStillBeingSeen(false)
      setImpactCustom("")
      setConditionOptions([])
    }
  }, [isEditing, editingInjury, pendingPin])

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const handleBodyAreaChange = useCallback((area: string) => {
    setBodyArea(area)
    setCondition("")
    setConditionCustom("")
    setCustomLabel("")
    if (area) {
      setConditionOptions(VA_AREA_CONDITIONS[area] || [])
    } else {
      setConditionOptions([])
    }
  }, [])

  const handleConditionChange = useCallback((val: string) => {
    setCondition(val)
    if (val === "__custom__") {
      setConditionCustom("")
    } else {
      setConditionCustom("")
    }
  }, [])

  const handleAddImpactFromSelect = useCallback(
    (val: string) => {
      if (!val) return
      addImpact(val)
    },
    [addImpact],
  )

  const handleAddCustomImpact = useCallback(() => {
    if (!impactCustom.trim()) return
    addImpact(impactCustom.trim())
    setImpactCustom("")
  }, [impactCustom, addImpact])

  const handleSave = useCallback(() => {
    if (!date) {
      alert("Please select a date.")
      return
    }

    if (isCustom) {
      if (!bodyArea) {
        alert("Please select a body area.")
        return
      }
    }

    // Resolve label: customLabel > conditionCustom (if __custom__) > condition > pendingPin.label
    let resolvedLabel = ""
    if (customLabel.trim()) {
      resolvedLabel = customLabel.trim()
    } else if (condition === "__custom__") {
      resolvedLabel = conditionCustom.trim()
    } else if (condition) {
      resolvedLabel = condition
    } else if (pendingPin) {
      resolvedLabel = pendingPin.label
    } else if (editingInjury) {
      resolvedLabel = editingInjury.label
    }

    if (isCustom && !resolvedLabel) {
      alert("Please select or enter a condition.")
      return
    }

    saveInjury({
      key: isCustom ? bodyArea : undefined,
      label: resolvedLabel || undefined,
      date,
      severity: severity as "mild" | "moderate" | "severe" | "custom",
      location,
      event,
      description,
      medicalCare: medicalCare as "" | "yes" | "no",
      clinicName,
      witnesses,
      stillBeingSeen,
    })
  }, [
    date,
    isCustom,
    bodyArea,
    customLabel,
    condition,
    conditionCustom,
    pendingPin,
    editingInjury,
    severity,
    location,
    event,
    description,
    medicalCare,
    clinicName,
    witnesses,
    stillBeingSeen,
    saveInjury,
  ])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) cancelForm()
    },
    [cancelForm],
  )

  // Title and subtitle
  const title = isEditing
    ? `Edit Injury — ${editingInjury?.label || ""}`
    : isCustom
      ? "Log Injury — Custom Pin"
      : `Log Injury — ${pendingPin?.label || ""}`

  const subtitle = isEditing
    ? "Update the details below."
    : isCustom
      ? "Select an area and condition, then fill in the details."
      : "Complete the fields below."

  const showBodyAreaField = isCustom || isEditing
  const showConditionField = conditionOptions.length > 0
  const showCustomCondition = condition === "__custom__"
  const showCustomLabel = showCustomCondition || isEditing
  const showClinic = medicalCare === "yes"

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-panel">
        <div className="modal-header">
          <div>
            <div className="ftitle">{title}</div>
            <div className="fsub">{subtitle}</div>
          </div>
          <button className="modal-close" onClick={cancelForm}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {/* Body area field */}
          {showBodyAreaField && (
            <div
              className="field"
              style={{
                background: "var(--al)",
                border: "1px solid rgba(29,78,216,.2)",
                borderRadius: "8px",
                padding: "12px 14px",
                gap: "6px",
              }}
            >
              <label
                style={{
                  color: "var(--accent)",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Body Area Affected{" "}
                <span style={{ color: "var(--severe)" }}>*</span>
              </label>
              <select
                value={bodyArea}
                onChange={(e) => handleBodyAreaChange(e.target.value)}
              >
                <option value="">— Select area —</option>
                <option value="head">Head / Face / Eyes / Ears</option>
                <option value="mental">Mental Health</option>
                <option value="neck">Neck</option>
                <option value="shoulder">Shoulder</option>
                <option value="back">Back / Spine</option>
                <option value="chest">Chest / Lungs</option>
                <option value="abdomen">Abdomen / Pelvis</option>
                <option value="hip">Hip</option>
                <option value="elbow">Elbow / Forearm</option>
                <option value="wrist_hand">Wrist / Hand</option>
                <option value="knee">Knee</option>
                <option value="leg">Thigh / Shin / Calf</option>
                <option value="ankle_foot">Ankle / Foot</option>
              </select>
            </div>
          )}

          {/* Condition field */}
          {showConditionField && (
            <div
              className="field"
              style={{
                background: "var(--al)",
                border: "1px solid rgba(29,78,216,.2)",
                borderRadius: "8px",
                padding: "12px 14px",
                gap: "6px",
              }}
            >
              <label
                style={{
                  color: "var(--accent)",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Primary Condition{" "}
                <span style={{ color: "var(--severe)" }}>*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => handleConditionChange(e.target.value)}
              >
                <option value="">— Select condition —</option>
                {conditionOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                <option value="__custom__">Other / Custom...</option>
              </select>
              {showCustomCondition && (
                <input
                  type="text"
                  placeholder="Enter custom condition name..."
                  value={conditionCustom}
                  onChange={(e) => setConditionCustom(e.target.value)}
                  style={{ marginTop: "4px" }}
                  autoFocus
                />
              )}
            </div>
          )}

          {/* Custom label field */}
          {showCustomLabel && (
            <div
              className="field"
              style={{
                background: "var(--al)",
                border: "1px solid rgba(29,78,216,.2)",
                borderRadius: "8px",
                padding: "12px 14px",
                gap: "6px",
              }}
            >
              <label
                style={{
                  color: "var(--accent)",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Pin Label
              </label>
              <input
                type="text"
                placeholder="e.g. Left ear ringing, jaw pain, burn scar on forearm..."
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                Override the condition name shown on the pin (optional).
              </span>
            </div>
          )}

          {/* Standard fields */}
          <div className="field">
            <label>Date of Injury</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <input type="hidden" value={severity} />

          <div className="field">
            <label>Location / Installation</label>
            <input
              type="text"
              placeholder="e.g. Fort Hood, Camp Pendleton, FOB Salerno"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Training Event / Duty</label>
            <input
              type="text"
              placeholder="e.g. Ruck march, obstacle course, motor pool"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Description / Notes</label>
            <textarea
              placeholder="Describe the injury, symptoms, or any additional context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="fgrid">
            <div className="field">
              <label>Medical Care Received</label>
              <select
                value={medicalCare}
                onChange={(e) => setMedicalCare(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {showClinic && (
              <div className="field">
                <label>Clinic / Hospital</label>
                <input
                  type="text"
                  placeholder="e.g. Battalion Aid Station"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>
            )}
            <div
              className="field"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input
                type="checkbox"
                id="f-still-seen"
                checked={stillBeingSeen}
                onChange={(e) => setStillBeingSeen(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "var(--red)",
                  cursor: "pointer",
                }}
              />
              <label
                htmlFor="f-still-seen"
                style={{
                  textTransform: "uppercase",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--navy)",
                  letterSpacing: ".5px",
                  fontFamily: "var(--fh)",
                  cursor: "pointer",
                  margin: 0,
                }}
              >
                Still being seen?
              </label>
            </div>
          </div>

          <div className="field">
            <label>Witnesses (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Squad leader, medic, buddy"
              value={witnesses}
              onChange={(e) => setWitnesses(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Daily Life Impact</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
                minHeight: "24px",
                marginBottom: "4px",
              }}
            >
              {pendingImpacts.length === 0 ? (
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--muted)",
                    fontStyle: "italic",
                  }}
                >
                  No limitations added
                </span>
              ) : (
                pendingImpacts.map((fi) => (
                  <span
                    key={fi}
                    className="sc-chip"
                    style={{
                      background: "rgba(200,16,46,.1)",
                      color: "var(--red2)",
                      border: "1px solid rgba(200,16,46,.2)",
                    }}
                  >
                    <span>{fi}</span>
                    <span
                      className="sc-rm"
                      style={{ color: "var(--red)", cursor: "pointer" }}
                      onClick={() => removeImpact(fi)}
                    >
                      &times;
                    </span>
                  </span>
                ))
              )}
            </div>
            <select
              value=""
              onChange={(e) => {
                handleAddImpactFromSelect(e.target.value)
                e.target.value = ""
              }}
            >
              <option value="">+ Add a functional limitation...</option>
              {IMPACT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <input
                type="text"
                placeholder="Other limitation..."
                value={impactCustom}
                onChange={(e) => setImpactCustom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCustomImpact()
                  }
                }}
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  borderRadius: "4px",
                  border: "1px solid var(--border2)",
                  fontSize: "13px",
                  fontFamily: "var(--fd)",
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomImpact}
                style={{
                  padding: "7px 12px",
                  borderRadius: "4px",
                  border: "none",
                  background: "var(--navy)",
                  color: "#fff",
                  fontFamily: "var(--fh)",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-p" onClick={handleSave}>
              {isEditing ? "Update Injury" : "Save Injury"}
            </button>
            <button className="btn-s" onClick={cancelForm}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormModal() {
  const { formModal } = useTracker()
  if (!formModal.isOpen) return null
  return <FormModalInner />
}
