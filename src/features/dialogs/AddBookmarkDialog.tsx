import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookmarkStore } from '@/store/bookmark-store'
import { useToastStore } from '@/store/toast-store'
import { tabs } from '@/lib/chrome-api'
import { getFaviconUrl } from '@/lib/constants'
import { GlobeIcon } from '@/components/ui/Icons'
import { FolderPicker } from './FolderPicker'

interface Props {
  defaultParentId: string
  onClose: () => void
}

export function AddBookmarkDialog({ defaultParentId, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [parentId, setParentId] = useState(defaultParentId)
  const [, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const createBookmark = useBookmarkStore(s => s.createBookmark)
  const show = useToastStore(s => s.show)

  useEffect(() => {
    tabs.getCurrent().then(tab => {
      if (tab) {
        setTitle(tab.title ?? '')
        setUrl(tab.url ?? '')
      }
      setLoading(false)
      setTimeout(() => inputRef.current?.select(), 50)
    })
  }, [])

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) return
    await createBookmark(parentId, title.trim(), url.trim())
    show('Bookmark saved')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') onClose()
  }

  const faviconUrl = url ? getFaviconUrl(url) : ''
  const domain = url
    ? (() => { try { return new URL(url).hostname.replace('www.', '') } catch { return '' } })()
    : ''

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
          <div className="flex items-center gap-3 p-5 pb-3.5">
            <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-bg-hover)] flex items-center justify-center overflow-hidden flex-shrink-0">
              {faviconUrl ? (
                <img src={faviconUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <GlobeIcon size={20} className="text-[var(--color-text-tertiary)]" />
              )}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[var(--color-text-primary)]">Add bookmark</div>
              {domain && <div className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{domain}</div>}
            </div>
          </div>

          <div className="px-5 pb-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Name</label>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full h-9 px-2.5 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-sm outline-none focus:border-[var(--color-border-focus)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">URL</label>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full h-9 px-2.5 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-sm outline-none focus:border-[var(--color-border-focus)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Folder</label>
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
              onClick={handleSave}
              disabled={!title.trim() || !url.trim()}
              className="h-[34px] px-3.5 rounded-[var(--radius-md)] text-[13px] font-medium bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
