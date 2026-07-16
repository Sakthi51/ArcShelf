import { create } from 'zustand'
import { TOAST_DURATION_MS } from '@/lib/constants'

export interface Toast {
  id: string
  message: string
  action?: { label: string; onClick: () => void }
  duration: number
}

interface ToastState {
  toasts: Toast[]
  show: (message: string, action?: Toast['action']) => void
  dismiss: (id: string) => void
}

let idCounter = 0

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  show(message, action) {
    const id = `toast-${++idCounter}`
    const toast: Toast = { id, message, action, duration: TOAST_DURATION_MS }
    set({ toasts: [...get().toasts, toast] })
    setTimeout(() => get().dismiss(id), toast.duration)
  },

  dismiss(id) {
    set({ toasts: get().toasts.filter(t => t.id !== id) })
  },
}))
