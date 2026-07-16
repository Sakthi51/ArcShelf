import { useCallback } from 'react'
import { useSearchStore } from '@/store/search-store'
import { tabs } from '@/lib/chrome-api'
import { getFaviconUrl } from '@/lib/constants'
import { GlobeIcon } from '@/components/ui/Icons'

export function SearchResults() {
  const results = useSearchStore(s => s.results)
  const selectedIndex = useSearchStore(s => s.selectedIndex)

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-sm text-[var(--color-text-tertiary)]">No bookmarks found</p>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Try a different search term</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto px-2 py-1">
      {results.map((item, index) => (
        <SearchResultItem
          key={item.id}
          item={item}
          isSelected={index === selectedIndex}
          index={index}
        />
      ))}
    </div>
  )
}

interface ResultItemProps {
  item: { id: string; title: string; url: string; path: string }
  isSelected: boolean
  index: number
}

function SearchResultItem({ item, isSelected, index }: ResultItemProps) {
  const setSelectedIndex = useSearchStore(s => s.setSelectedIndex)
  const addRecentSearch = useSearchStore(s => s.addRecentSearch)
  const query = useSearchStore(s => s.query)

  const handleClick = useCallback(() => {
    tabs.openUrl(item.url)
    addRecentSearch(query)
  }, [item.url, query, addRecentSearch])

  const handleAuxClick = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault()
      tabs.openUrl(item.url, true)
    }
  }, [item.url])

  const domain = (() => {
    try { return new URL(item.url).hostname.replace('www.', '') } catch { return item.url }
  })()

  const faviconUrl = getFaviconUrl(item.url)

  return (
    <div
      className={`
        flex items-center gap-[10px] px-[10px] py-2 rounded-[var(--radius-lg)]
        cursor-pointer select-none transition-colors duration-100
        ${isSelected ? 'bg-[var(--color-bg-hover)]' : 'hover:bg-[var(--color-bg-hover)]'}
      `}
      onClick={handleClick}
      onAuxClick={handleAuxClick}
      onMouseEnter={() => setSelectedIndex(index)}
    >
      <span className="w-[16px] h-[16px] flex-shrink-0 flex items-center justify-center">
        {faviconUrl ? (
          <img src={faviconUrl} alt="" className="w-4 h-4 rounded-[2px]" loading="lazy" />
        ) : (
          <GlobeIcon size={14} className="text-[var(--color-text-tertiary)]" />
        )}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[var(--color-text-primary)] truncate">
          {item.title || domain}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-[var(--color-text-tertiary)] truncate">{domain}</span>
          {item.path && (
            <>
              <span className="text-[11px] text-[var(--color-text-tertiary)]">·</span>
              <span className="text-[11px] text-[var(--color-text-tertiary)] truncate">{item.path}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
