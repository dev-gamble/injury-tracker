"use client"

import { RotateCcw } from 'lucide-react'
import { ConfirmModal } from './ConfirmModal'

interface ClearDataModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export function ClearDataModal({ onConfirm, onCancel }: ClearDataModalProps) {
  return (
    <ConfirmModal
      icon={<RotateCcw size={22} stroke="#c8102e" strokeWidth={2} />}
      title="Reset Session Data"
      subtitle="This will permanently clear all injury entries, conditions, and notes from your current session."
      alertHeading="This action cannot be undone"
      alertBody="All data entered in this session will be erased. Make sure you have exported anything you need before continuing."
      confirmLabel="Clear Data"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
