"use client"

import { Trash2 } from 'lucide-react'
import { ConfirmModal } from './ConfirmModal'

interface DeleteConfirmModalProps {
  label: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({ label, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <ConfirmModal
      icon={<Trash2 size={22} stroke="#c8102e" strokeWidth={2} />}
      title="Delete Condition"
      subtitle={<>You are about to permanently remove <span className="cm-label">{label}</span> and all associated secondary conditions.</>}
      alertHeading="This action cannot be undone"
      alertBody="All ratings, secondaries, and evaluation data for this condition will be erased from your session."
      confirmLabel="Delete"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
