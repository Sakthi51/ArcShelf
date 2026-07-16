import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookmarkStore } from '@/store/bookmark-store'
import { useToastStore } from '@/store/toast-store'
import { FolderPicker } from './FolderPicker'

interface Props {
  defaultParentId: string
  onClose: () => void
}

export function NewFolderDialog({ defaultParentId, onClose }: Props) {
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState(defaultParentId)
  const inputRef = useRef<HTMLInputElement>(null)
  const createFolder = useBookmarkStore(s => s.createFolder)
  const show = useToastStore(s => s.show)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const handleCreate = async () => {
    if (!name.trim()) return
    await createFolder(parentId, name.trim())
    show('Folder created')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleCreate() }
    if (e.key === 'Escape') onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/55 flex items-center justify-center z-[2147483647]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          className="w-[380px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-[var(--radius-xl)] shadow-[var(--shadow-dialog)] overflow-hidden"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
          onKeyDown={handleKeyDown}
        >
          <div className="p-5 pb-3.5">
            <div className="text-[15px] font-semibold text-[var(--color-text-primary)]">New folder</div>
          </div>

          <div className="px-5 pb-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Name</label>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Folder name"
                className="w-full h-9 px-2.5 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-sm outline-none placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-border-focus)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Location</label>
              <FolderPicker value={parentId} onChange={setParentId} />
            </div>
          </div>

          <div className="flex justify-end gap-2 px-5 py-3 border-t border-[var(--color-border-primary)]">
            <button
              onClick={onClose}
              className="h-[34px] px-3.5 rounded-[var(--radius-md)] text-[13px] font-medium bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-active)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="h-[34px] px-3.5 rounded-[var(--radius-md)] text-[13px] font-medium bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              Create
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
