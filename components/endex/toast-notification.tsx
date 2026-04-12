"use client"

import { useEffect } from "react"
import { useTracker } from "@/lib/endex/tracker-context"

export function ToastNotification() {
  const { toast, dismissToast } = useTracker()

  useEffect(() => {
    if (!toast?.visible) return
    const t = setTimeout(dismissToast, 8000)
    return () => clearTimeout(t)
  }, [toast, dismissToast])

  if (!toast?.visible) return null

  return (
    <div className="next-step-toast">
      <span>Pin placed! Rate severity &amp; add secondaries</span>
      <button onClick={dismissToast}>
        Go to Severity &amp; Secondary
      </button>
      <span className="toast-close" onClick={dismissToast}>
        &times;
      </span>
    </div>
  )
}
