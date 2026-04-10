"use client"

import { LogOut } from 'lucide-react'
import { ConfirmModal } from './ConfirmModal'

interface SignOutModalProps {
  onConfirm: () => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function SignOutModal({ onConfirm, onCancel, loading }: SignOutModalProps) {
  return (
    <ConfirmModal
      icon={<LogOut size={22} stroke="#c8102e" strokeWidth={2} />}
      title="Confirm Sign Out"
      subtitle="You are about to end your session and return to the login screen."
      alertHeading="Session data will be erased"
      alertBody="All injury entries, conditions, and notes from this session will be permanently cleared from this device. Export your data before signing out if you need a record."
      confirmLabel="Sign Out"
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
