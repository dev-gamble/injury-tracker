const SIDEBAR_GROUPS = [
  {
    heading: "Mental Health",
    items: [{ key: "mental", label: "Mental Health" }],
  },
  {
    heading: "Head & Face",
    items: [{ key: "headFace", label: "Head & Face" }],
  },
  {
    heading: "Neck / Shoulders",
    items: [
      { key: "neck", label: "Neck" },
      { key: "shoulder", label: "Shoulders" },
    ],
  },
  {
    heading: "Chest / Lungs",
    items: [{ key: "chest", label: "Chest / Lungs" }],
  },
  {
    heading: "Arms",
    items: [
      { key: "elbow", label: "Elbow / Forearm" },
      { key: "wrist_hand", label: "Wrist / Hand" },
    ],
  },
  {
    heading: "Abdomen / Pelvis",
    items: [{ key: "abdomen", label: "Abdomen / Pelvis" }],
  },
  {
    heading: "Hips",
    items: [{ key: "hip", label: "Hips" }],
  },
  {
    heading: "Legs",
    items: [
      { key: "knee", label: "Knees" },
      { key: "leg", label: "Thigh / Shin / Calf" },
      { key: "ankle_foot", label: "Ankle / Foot" },
    ],
  },
  {
    heading: "Back & Spine",
    items: [{ key: "back", label: "Back & Spine" }],
  },
  {
    heading: "Other / Systemic",
    items: [{ key: "systemic", label: "Other / Systemic" }],
  },
]

export function Sidebar() {
  return (
    <div className="sidebar" id="sidebar">
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "var(--navy)",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "10px",
          fontFamily: "var(--fh)",
          borderBottom: "2px solid var(--red)",
          paddingBottom: "8px",
        }}
      >
        Quick Select
      </div>
      <input
        type="text"
        id="qs-search"
        className="qs-search"
        placeholder="Search body areas..."
        readOnly
      />
      <div id="sb-list">
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.heading}>
            <div className="sb-head">{group.heading}</div>
            {group.items.map((item) => (
              <div key={item.key} className="sb-item" id={`si-${item.key}`}>
                <span className="sb-name">{item.label}</span>
                <span className="badge b0" id={`bd-${item.key}`}>+</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
