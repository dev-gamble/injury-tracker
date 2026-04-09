"use client"

export function InjuryModal() {
  return (
    <div
      id="form-modal"
      className="modal-overlay hidden"
      onClick={(e) => window.modalBgClick?.(e.nativeEvent)}
    >
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="ftitle" id="ftitle">Log Injury</div>
            <div className="fsub" id="fsub">Fill in the details below.</div>
          </div>
          <button className="modal-close" onClick={() => window.cancelForm?.()}>×</button>
        </div>
        <div className="modal-body">
          <div
            id="body-area-field"
            className="field hidden"
            style={{
              background: "var(--al)",
              border: "1px solid rgba(29,78,216,.2)",
              borderRadius: "8px",
              padding: "12px 14px",
              gap: "6px",
            }}
          >
            <label style={{ color: "var(--accent)", fontSize: "12px", fontWeight: 700 }}>
              Body Area Affected <span style={{ color: "var(--severe)" }}>*</span>
            </label>
            <select id="f-body-area" onChange={(e) => window.onBodyAreaChange?.(e.target.value)}>
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

          <div
            id="condition-field"
            className="field hidden"
            style={{
              background: "var(--al)",
              border: "1px solid rgba(29,78,216,.2)",
              borderRadius: "8px",
              padding: "12px 14px",
              gap: "6px",
            }}
          >
            <label style={{ color: "var(--accent)", fontSize: "12px", fontWeight: 700 }}>
              Primary Condition <span style={{ color: "var(--severe)" }}>*</span>
            </label>
            <select id="f-condition">
              <option value="">— Select condition —</option>
            </select>
            <input
              type="text"
              id="f-condition-custom"
              className="hidden"
              placeholder="Enter custom condition name..."
              style={{ marginTop: "4px" }}
            />
          </div>

          <div
            id="custom-label-field"
            className="field hidden"
            style={{
              background: "var(--al)",
              border: "1px solid rgba(29,78,216,.2)",
              borderRadius: "8px",
              padding: "12px 14px",
              gap: "6px",
            }}
          >
            <label style={{ color: "var(--accent)", fontSize: "12px", fontWeight: 700 }}>
              Pin Label
            </label>
            <input
              type="text"
              id="f-custom-label"
              placeholder="e.g. Left ear ringing, jaw pain, burn scar on forearm..."
            />
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              Override the condition name shown on the pin (optional).
            </span>
          </div>

          <div className="field">
            <label>Date of Injury</label>
            <input type="date" id="f-date" />
          </div>
          <input type="hidden" id="f-sev" value="moderate" />

          <div className="field">
            <label>Location / Installation</label>
            <input
              type="text"
              id="f-loc"
              placeholder="e.g. Fort Hood, Camp Pendleton, FOB Salerno"
            />
          </div>

          <div className="field">
            <label>Training Event / Duty</label>
            <input
              type="text"
              id="f-event"
              placeholder="e.g. Ruck march, obstacle course, motor pool"
            />
          </div>

          <div className="field">
            <label>Description / Notes</label>
            <textarea
              id="f-desc"
              placeholder="Describe the injury, symptoms, or any additional context..."
            />
          </div>

          <div className="fgrid">
            <div className="field">
              <label>Medical Care Received</label>
              <select
                id="f-med"
                onChange={(e) => {
                  const cf = document.getElementById("cf")
                  if (cf) cf.style.display = e.target.value === "yes" ? "flex" : "none"
                }}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="field" id="cf" style={{ display: "none" }}>
              <label>Clinic / Hospital</label>
              <input type="text" id="f-clinic" placeholder="e.g. Battalion Aid Station" />
            </div>
            <div className="field" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                id="f-still-seen"
                style={{ width: "16px", height: "16px", accentColor: "var(--red)", cursor: "pointer" }}
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
            <input type="text" id="f-wit" placeholder="e.g. Squad leader, medic, buddy" />
          </div>

          <div className="field">
            <label>Daily Life Impact</label>
            <div
              id="fi-chips"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
                minHeight: "24px",
                marginBottom: "4px",
              }}
            ></div>
            <select
              id="f-impact"
              onChange={(e) => {
                window.addImpactFromSelect?.(e.target)
              }}
            >
              <option value="">+ Add a functional limitation...</option>
              <option value="Cannot stand for long periods">Cannot stand for long periods</option>
              <option value="Difficulty lifting objects">Difficulty lifting objects</option>
              <option value="Sleep disruption">Sleep disruption</option>
              <option value="Difficulty driving">Difficulty driving</option>
              <option value="Limited range of motion">Limited range of motion</option>
              <option value="Chronic pain">Chronic pain</option>
              <option value="Difficulty walking">Difficulty walking</option>
              <option value="Difficulty sitting">Difficulty sitting</option>
              <option value="Cognitive difficulty / focus">Cognitive difficulty / focus</option>
              <option value="Memory problems">Memory problems</option>
              <option value="Difficulty with stairs">Difficulty with stairs</option>
              <option value="Unable to exercise">Unable to exercise</option>
              <option value="Difficulty gripping / fine motor">Difficulty gripping / fine motor</option>
              <option value="Hearing difficulty">Hearing difficulty</option>
              <option value="Vision impairment">Vision impairment</option>
              <option value="Difficulty bending / kneeling">Difficulty bending / kneeling</option>
              <option value="Balance problems">Balance problems</option>
              <option value="Anxiety in daily activities">Anxiety in daily activities</option>
              <option value="Difficulty with personal care">Difficulty with personal care</option>
            </select>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <input
                type="text"
                id="f-impact-custom"
                placeholder="Other limitation..."
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
                onClick={() => window.addCustomImpact?.()}
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
            <button className="btn-p" id="save-btn" onClick={() => window.saveInjury?.()}>
              Save Injury
            </button>
            <button className="btn-s" onClick={() => window.cancelForm?.()}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
