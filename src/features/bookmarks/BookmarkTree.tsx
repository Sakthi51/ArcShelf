import { useRef, useMemo, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useBookmarkStore } from '@/store/bookmark-store'
import { useUIStore } from '@/store/ui-store'
import { useSelectionStore } from '@/store/selection-store'
import { BookmarkItem } from './BookmarkItem'
import { FolderItem } from './FolderItem'
import { BOOKMARKS_BAR_ID, ITEM_HEIGHT, VIRTUAL_OVERSCAN } from '@/lib/constants'
import { ContextMenu, useContextMenuTrigger } from '@/features/context-menu/ContextMenu'
import { getMultiSelectMenuItems } from '@/features/context-menu/menu-items'
import type { BookmarkNode } from '@/lib/chrome-api'

interface FlatItem {
  node: BookmarkNode
  depth: number
}

function flattenVisible(
  nodes: BookmarkNode[],
  expandedFolders: Set<string>,
  depth = 0
): FlatItem[] {
  const items: FlatItem[] = []
  for (const node of nodes) {
    items.push({ node, depth })
    if (!node.url && node.children && expandedFolders.has(node.id)) {
      items.push(...flattenVisible(node.children, expandedFolders, depth + 1))
    }
  }
  return items
}

export function BookmarkTree() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const tree = useBookmarkStore(s => s.tree)
  const expandedFolders = useUIStore(s => s.expandedFolders)
  const selected = useSelectionStore(s => s.selected)
  const { contextMenu, handleContextMenu, closeMenu } = useContextMenuTrigger()

  const rootChildren = useMemo(() => {
    if (!tree[0]?.children) return []
    const bar = tree[0].children.find(c => c.id === BOOKMARKS_BAR_ID)
    return bar?.children ?? tree[0].children[0]?.children ?? []
  }, [tree])

  const flatItems = useMemo(
    () => flattenVisible(rootChildren, expandedFolders),
    [rootChildren, expandedFolders]
  )

  const virtualizer = useVirtualizer({
    count: flatItems.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: VIRTUAL_OVERSCAN,
  })

  const handleTreeContextMenu = useCallback((e: React.MouseEvent) => {
    if (selected.size > 1) {
      handleContextMenu(e)
    }
  }, [selected.size, handleContextMenu])

  if (flatItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center text-[var(--color-text-tertiary)]">
        <p className="text-xs">No bookmarks yet.</p>
        <p className="text-[10px] mt-1">Click "New Bookmark" to add your first.</p>
      </div>
    )
  }

  return (
    <>
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overflow-x-hidden px-2 py-1"
        onContextMenu={handleTreeContextMenu}
      >
        <div
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map(virtualRow => {
            const { node, depth } = flatItems[virtualRow.index]
            const isFolder = !node.url

            return (
              <div
                key={node.id}
                className="absolute left-0 right-0"
                style={{
                  top: virtualRow.start,
                  height: virtualRow.size,
                  paddingLeft: depth * 12,
                }}
              >
                {isFolder ? (
                  <FolderItem node={node} />
                ) : (
                  <BookmarkItem node={node} />
                )}
              </div>
            )
          })}
        </div>
      </div>
      {contextMenu && selected.size > 1 && (
        <ContextMenu
          position={contextMenu}
          items={getMultiSelectMenuItems(selected)}
          onClose={closeMenu}
        />
      )}
    </>
  )
}
