import { useRef, useCallback, useEffect } from 'react'
import { useSearchStore } from '@/store/search-store'
import { SearchIcon, XIcon } from '@/components/ui/Icons'
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants'

export function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const query = useSearchStore(s => s.query)
  const search = useSearchStore(s => s.search)
  const clearSearch = useSearchStore(s => s.clearSearch)
  const addRecentSearch = useSearchStore(s => s.addRecentSearch)
  const isActive = useSearchStore(s => s.isActive)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      search(value)
    }, SEARCH_DEBOUNCE_MS)
  }, [search])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isActive) {
        clearSearch()
        if (inputRef.current) inputRef.current.value = ''
      }
      e.preventDefault()
    }
    if (e.key === 'Enter' && query) {
      addRecentSearch(query)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      useSearchStore.getState().setSelectedIndex(
        Math.min(useSearchStore.getState().selectedIndex + 1, useSearchStore.getState().results.length - 1)
      )
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      useSearchStore.getState().setSelectedIndex(
        Math.max(useSearchStore.getState().selectedIndex - 1, 0)
      )
    }
  }, [isActive, query, clearSearch, addRecentSearch])

  const handleClear = useCallback(() => {
    clearSearch()
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }, [clearSearch])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <div className="flex items-center gap-2 mx-2 mb-1.5 px-3 py-[10px] rounded-[var(--radius-lg)] transition-colors duration-150 hover:bg-[var(--color-bg-hover)] focus-within:bg-[var(--color-bg-hover)]">
      <SearchIcon size={18} className="flex-shrink-0 text-[var(--color-text-tertiary)]" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search bookmarks..."
        defaultValue={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-tertiary)] outline-none"
      />
      {isActive && (
        <button
          onClick={handleClear}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
        >
          <XIcon size={14} />
        </button>
      )}
    </div>
  )
}
