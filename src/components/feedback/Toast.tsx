import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore } from '@/store/toast-store'

export function ToastContainer() {
  const toasts = useToastStore(s => s.toasts)
  const dismiss = useToastStore(s => s.dismiss)

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[2147483647] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-[13px] border border-[var(--color-border-primary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-toast)]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <span>{toast.message}</span>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action!.onClick()
                  dismiss(toast.id)
                }}
                className="text-[var(--color-accent)] font-medium hover:text-[var(--color-accent-hover)] transition-colors"
              >
                {toast.action.label}
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
