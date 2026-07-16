import { useEffect, useCallback } from 'react'
import { useUIStore } from '@/store/ui-store'
import { useSelectionStore } from '@/store/selection-store'
import { useSearchStore } from '@/store/search-store'
import { useBookmarkStore } from '@/store/bookmark-store'
import { useToastStore } from '@/store/toast-store'
import { tabs } from '@/lib/chrome-api'

export function useKeyboardNavigation() {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'b') {
      e.preventDefault()
      e.stopPropagation()
      useUIStore.getState().toggleSidebar()
      return
    }

    const { sidebarVisible } = useUIStore.getState()
    if (!sidebarVisible) return

    const { focusedItemId, expandedFolders, toggleFolder, setFocusedItem } = useUIStore.getState()
    const { selected, select, clearSelection } = useSelectionStore.getState()
    const { isActive, clearSearch } = useSearchStore.getState()
    const { getNode, removeBookmark, removeFolder } = useBookmarkStore.getState()
    const { show } = useToastStore.getState()

    const isInput = (e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA'

    if (e.key === 'Escape') {
      if (isActive) {
        clearSearch()
        return
      }
      if (selected.size > 0) {
        clearSelection()
        return
      }
      useUIStore.getState().hideSidebar()
      return
    }

    if (isInput) return

    if (e.key === '/' || (e.key === 'f' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault()
      const input = document.querySelector<HTMLInputElement>('.ab-search-input')
      input?.focus()
      return
    }

    if (!focusedItemId) return
    const node = getNode(focusedItemId)
    if (!node) return

    switch (e.key) {
      case 'Enter': {
        if (node.url) {
          if (e.metaKey || e.ctrlKey) {
            tabs.openUrl(node.url, true)
          } else {
            tabs.openUrl(node.url)
          }
        } else {
          toggleFolder(node.id)
        }
        break
      }

      case ' ': {
        e.preventDefault()
        if (!node.url) {
          toggleFolder(node.id)
        }
        break
      }

      case 'ArrowRight': {
        if (!node.url && !expandedFolders.has(node.id)) {
          useUIStore.getState().expandFolder(node.id)
        } else if (!node.url && node.children?.length) {
          setFocusedItem(node.children[0].id)
          select(node.children[0].id)
        }
        break
      }

      case 'ArrowLeft': {
        if (!node.url && expandedFolders.has(node.id)) {
          useUIStore.getState().collapseFolder(node.id)
        } else if (node.parentId) {
          setFocusedItem(node.parentId)
          select(node.parentId)
        }
        break
      }

      case 'Delete':
      case 'Backspace': {
        if (selected.size > 0) {
          const ids = Array.from(selected)
          ids.forEach(id => {
            const n = getNode(id)
            if (!n) return
            if (n.url) removeBookmark(id)
            else removeFolder(id)
          })
          clearSelection()
          show(`Deleted ${ids.length} item${ids.length > 1 ? 's' : ''}`)
        }
        break
      }

      case 'a': {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault()
          // Select all visible - would need access to visible IDs
        }
        break
      }

      case 'c': {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault()
          if (node.url) {
            navigator.clipboard.writeText(node.url)
            show('Copied URL')
          }
        }
        break
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [handleKeyDown])
}
