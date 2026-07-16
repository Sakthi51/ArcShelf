import { useState, useRef, useEffect } from 'react'
import { useBookmarkStore } from '@/store/bookmark-store'
import { useToastStore } from '@/store/toast-store'

interface Props {
  id: string
  currentTitle: string
  onDone: () => void
}

export function InlineRename({ id, currentTitle, onDone }: Props) {
  const [value, setValue] = useState(currentTitle)
  const inputRef = useRef<HTMLInputElement>(null)
  const updateBookmark = useBookmarkStore(s => s.updateBookmark)
  const show = useToastStore(s => s.show)

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 10)
  }, [])

  const save = () => {
    const trimmed = value.trim()
    if (trimmed && trimmed !== currentTitle) {
      updateBookmark(id, { title: trimmed })
      show('Renamed')
    }
    onDone()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Enter') { e.preventDefault(); save() }
    if (e.key === 'Escape') { e.preventDefault(); onDone() }
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={save}
      className="flex-1 h-[22px] px-1.5 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-focus)] rounded-[var(--radius-xs)] text-xs outline-none"
      onClick={e => e.stopPropagation()}
    />
  )
}
