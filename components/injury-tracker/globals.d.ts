// Type declarations for the injury-tracker vanilla JS bundle
// These functions are defined in public/injury-tracker/js/bundle.js

declare global {
  interface Window {
    // map.js
    buildSidebar: () => void
    updateView: () => void
    setSide: (side: "front" | "back") => void
    setBody: (body: "male" | "female") => void
    bodyClicked: (e: MouseEvent, wrap: HTMLElement) => void
    quickSelect: (key: string) => void
    deleteInjury: (id: number, e: MouseEvent) => void
    updateBadges: () => void
    updateCount: () => void
    showTab: (id: string, btn: HTMLElement) => void

    // form.js
    openForm: (label: string, key: string) => void
    cancelForm: () => void
    saveInjury: () => void
    editInjury: (id: number) => void
    modalBgClick: (e: MouseEvent) => void
    onBodyAreaChange: (area: string) => void
    addImpactFromSelect: (sel: HTMLSelectElement) => void
    addCustomImpact: () => void
    removeImpact: (label: string) => void
    toggleExportMenu: () => void
    closeExportMenu: () => void

    // import.js
    openImportModal: () => void
    closeImportModal: () => void
    handleImportFile: (input: HTMLInputElement) => void
    downloadTemplate: () => void
    confirmImport: () => void

    // export.js
    exportSummary: () => void
    exportCSV: () => void
    exportTXT: () => void

    // mental.js
    openMentalHealthPanel: () => void
    closeMentalHealthPanel: () => void
    renderMentalPanel: () => void

    // head.js
    openHeadPanel: (key: string) => void
    closeHeadPanel: () => void
    renderHeadPanel: () => void

    // bodypart.js
    openBPPanel: (regionId: string, key?: string) => void
    closeBPPanel: (regionId: string) => void
    renderBPPanel: (regionId: string) => void

    // secondary.js
    renderSecondary: () => void

    // rating.js
    renderRating: () => void

    // special.js
    renderSpecial: () => void

    // statement.js
    renderStatement: () => void

    // timeline.js
    renderTimeline: () => void

    // data.js state
    _mentalHealthConditions: unknown[]
    _headConditions: unknown[]
    _kneeConditions: unknown[]
    _backConditions: unknown[]
    _shoulderConditions: unknown[]
    _neckConditions: unknown[]
    _hipConditions: unknown[]
    _elbowConditions: unknown[]
    _wristConditions: unknown[]
    _ankleConditions: unknown[]
    _chestConditions: unknown[]
    _abdomenConditions: unknown[]
    _legConditions: unknown[]
    _systemicConditions: unknown[]
    _specialClaims: Record<string, unknown>
    _mstData: Record<string, unknown>
  }
}

export {}
