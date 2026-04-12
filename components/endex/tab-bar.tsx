const TABS = [
  { id: "map", label: "Primary Map" },
  { id: "secondary", label: "Severity & Secondary" },
  { id: "special", label: "Special Claims" },
  { id: "timeline", label: "Timeline" },
  { id: "rating", label: "Rating" },
  { id: "statement", label: "Notes & Statement" },
]

export function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  return (
    <div className="tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab${activeTab === tab.id ? " active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
