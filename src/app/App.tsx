import { useEffect } from 'react'
import { useBookmarkStore } from '@/store/bookmark-store'
import { useUIStore } from '@/store/ui-store'
import { useSearchStore } from '@/store/search-store'
import { Sidebar } from '@/features/sidebar/Sidebar'
import { ToastContainer } from '@/components/feedback/Toast'
import { useKeyboardNavigation } from '@/features/keyboard/use-keyboard'

export default function App() {
  const loadTree = useBookmarkStore(s => s.loadTree)
  const tree = useBookmarkStore(s => s.tree)
  const loadPersistedState = useUIStore(s => s.loadPersistedState)
  const toggleSidebar = useUIStore(s => s.toggleSidebar)
  const buildIndex = useSearchStore(s => s.buildIndex)
  const loadRecentSearches = useSearchStore(s => s.loadRecentSearches)

  useKeyboardNavigation()

  useEffect(() => {
    loadPersistedState()
    loadRecentSearches()
    loadTree()
  }, [loadTree, loadPersistedState, loadRecentSearches])

  useEffect(() => {
    if (tree.length > 0) {
      buildIndex(tree)
    }
  }, [tree, buildIndex])

  useEffect(() => {
    const listener = (msg: { action?: string }) => {
      if (msg.action === 'toggle-sidebar') {
        toggleSidebar()
      }
      if (msg.action === 'show-sidebar') {
        useUIStore.getState().showSidebar()
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [toggleSidebar])

  return (
    <>
      <Sidebar />
      <ToastContainer />
    </>
  )
}
