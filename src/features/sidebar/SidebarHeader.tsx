import { useUIStore } from '@/store/ui-store'
import { useBookmarkStore } from '@/store/bookmark-store'
import { useToastStore } from '@/store/toast-store'
import { BOOKMARKS_BAR_ID } from '@/lib/constants'
import { useState, useCallback } from 'react'
import { tabs } from '@/lib/chrome-api'
import { AddBookmarkDialog } from '@/features/dialogs/AddBookmarkDialog'
import { NewFolderDialog } from '@/features/dialogs/NewFolderDialog'
import { AppIcon, SidebarCollapseIcon, SettingsIcon, FolderNewIcon, BookmarkPlusIcon, PinIcon } from '@/components/ui/Icons'

export function SidebarHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showFolderDialog, setShowFolderDialog] = useState(false)
  const currentFolderId = useUIStore(s => s.currentFolderId)
  const hideSidebar = useUIStore(s => s.hideSidebar)
  const setView = useUIStore(s => s.setView)
  const tree = useBookmarkStore(s => s.tree)
  const createBookmark = useBookmarkStore(s => s.createBookmark)
  const show = useToastStore(s => s.show)

  const addCurrentPage = useCallback(async () => {
    const tab = await tabs.getCurrent()
    if (!tab?.url) { show('Cannot bookmark this page'); return }

    const allBookmarks = flattenUrls(tree)
    if (allBookmarks.has(tab.url)) {
      show('Already bookmarked')
      return
    }

    await createBookmark(currentFolderId || BOOKMARKS_BAR_ID, tab.title ?? 'Untitled', tab.url)
    show('Page bookmarked')
  }, [tree, createBookmark, currentFolderId, show])

  return (
    <>
      <div className="px-2 pt-2 pb-1">
        {/* Row 1: App icon + name | collapse */}
        <div className="flex items-center gap-2 h-9 mb-1 px-1">
          <AppIcon size={22} />
          <span className="font-semibold text-[var(--color-text-primary)] tracking-tight" style={{ fontSize: 'var(--text-heading)' }}>ArcShelf</span>
          <div className="flex-1" />
          <button
            onClick={hideSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
            title="Close sidebar"
          >
            <SidebarCollapseIcon size={18} />
          </button>
        </div>

        {/* Action buttons — full width rows like ClaudeCodeBrowserUI */}
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2.5 w-full h-[34px] px-2.5 rounded-[var(--radius-lg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
        >
          <BookmarkPlusIcon size={15} />
          <span>New Bookmark</span>
        </button>
        <button
          onClick={() => setShowFolderDialog(true)}
          className="flex items-center gap-2.5 w-full h-[34px] px-2.5 rounded-[var(--radius-lg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
        >
          <FolderNewIcon size={15} />
          <span>New Folder</span>
        </button>
        <button
          onClick={addCurrentPage}
          className="flex items-center gap-2.5 w-full h-[34px] px-2.5 rounded-[var(--radius-lg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
        >
          <PinIcon size={15} />
          <span>Add Current Page</span>
        </button>
        <button
          onClick={() => setView('settings')}
          className="flex items-center gap-2.5 w-full h-[34px] px-2.5 rounded-[var(--radius-lg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
        >
          <SettingsIcon size={15} />
          <span>Settings</span>
        </button>
      </div>

      {showAddDialog && (
        <AddBookmarkDialog
          defaultParentId={currentFolderId || BOOKMARKS_BAR_ID}
          onClose={() => setShowAddDialog(false)}
        />
      )}
      {showFolderDialog && (
        <NewFolderDialog
          defaultParentId={currentFolderId || BOOKMARKS_BAR_ID}
          onClose={() => setShowFolderDialog(false)}
        />
      )}
    </>
  )
}

function flattenUrls(tree: import('@/lib/chrome-api').BookmarkNode[]): Set<string> {
  const urls = new Set<string>()
  function walk(nodes: import('@/lib/chrome-api').BookmarkNode[]) {
    for (const n of nodes) {
      if (n.url) urls.add(n.url)
      if (n.children) walk(n.children)
    }
  }
  walk(tree)
  return urls
}
