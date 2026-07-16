import { useEffect, useState } from 'react'
import { useUIStore } from '@/store/ui-store'
import { SidebarHeader } from './SidebarHeader'
import { SearchBar } from '@/features/search/SearchBar'
import { SearchResults } from '@/features/search/SearchResults'
import { BookmarkTree } from '@/features/bookmarks/BookmarkTree'
import { SettingsView } from '@/features/settings/SettingsView'
import { useSearchStore } from '@/store/search-store'
import { storage } from '@/lib/chrome-api'

export function Sidebar() {
  const view = useUIStore(s => s.view)
  const isSearchActive = useSearchStore(s => s.isActive)
  const visible = useUIStore(s => s.sidebarVisible)
  const position = useUIStore(s => s.sidebarPosition)
  const [textSize, setTextSize] = useState('m')

  useEffect(() => {
    storage.getLocal<string>(['textSize']).then(r => {
      if (r.textSize) setTextSize(r.textSize)
    })
    const handler = (changes: Record<string, chrome.storage.StorageChange>) => {
      if (changes.textSize) setTextSize(changes.textSize.newValue as string)
    }
    chrome.storage.onChanged.addListener(handler)
    return () => chrome.storage.onChanged.removeListener(handler)
  }, [])

  const posClass = position === 'right' ? 'arc-bm-right' : 'arc-bm-left'
  const visClass = visible ? '' : 'arc-bm-hidden'

  return (
    <div className={`arc-bm-panel ${posClass} ${visClass}`} data-size={textSize}>
      {view === 'settings' ? (
        <SettingsView />
      ) : (
        <>
          <SidebarHeader />
          <SearchBar />
          <div className="arc-bm-content">
            {!isSearchActive && <BookmarkTree />}
            {isSearchActive && <SearchResults />}
          </div>
        </>
      )}
    </div>
  )
}
