import { memo, useCallback, useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { BookmarkNode } from '@/lib/chrome-api'
import { storage } from '@/lib/chrome-api'
import { useUIStore } from '@/store/ui-store'
import { useSelectionStore } from '@/store/selection-store'
import { useInteractionStore } from '@/store/interaction-store'
import { useBookmarkStore } from '@/store/bookmark-store'
import { ChevronRightIcon, FolderIcon, DotsIcon, FOLDER_COLORS } from '@/components/ui/Icons'
import { ContextMenu, useContextMenuTrigger } from '@/features/context-menu/ContextMenu'
import { getFolderMenuItems } from '@/features/context-menu/menu-items'
import { InlineRename } from './InlineRename'
import { DND_FOLDER_EXPAND_DELAY } from '@/lib/constants'

interface Props {
  node: BookmarkNode
}

let cachedFolderColor = '#5AB1F0'
storage.getLocal<string>(['folderColor']).then(r => {
  if (r.folderColor) {
    const found = FOLDER_COLORS.find(c => c.id === r.folderColor)
    if (found) cachedFolderColor = found.color
  }
})

export const FolderItem = memo(function FolderItem({ node }: Props) {
  const isExpanded = useUIStore(s => s.expandedFolders.has(node.id))
  const toggleFolder = useUIStore(s => s.toggleFolder)
  const expandFolder = useUIStore(s => s.expandFolder)
  const isSelected = useSelectionStore(s => s.selected.has(node.id))
  const select = useSelectionStore(s => s.select)
  const isRenaming = useInteractionStore(s => s.renamingId === node.id)
  const stopRename = useInteractionStore(s => s.stopRename)
  const draggingId = useInteractionStore(s => s.draggingId)
  const dropTargetId = useInteractionStore(s => s.dropTargetId)
  const dropPosition = useInteractionStore(s => s.dropPosition)
  const [folderColor, setFolderColor] = useState(cachedFolderColor)
  const expandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const itemRef = useRef<HTMLDivElement>(null)

  const isDragging = draggingId === node.id
  const isDropTarget = dropTargetId === node.id

  useEffect(() => {
    const handler = (changes: Record<string, chrome.storage.StorageChange>) => {
      if (changes.folderColor) {
        const id = changes.folderColor.newValue
        const found = FOLDER_COLORS.find(c => c.id === id)
        if (found) { cachedFolderColor = found.color; setFolderColor(found.color) }
      }
    }
    chrome.storage.onChanged.addListener(handler)
    return () => chrome.storage.onChanged.removeListener(handler)
  }, [])

  const { contextMenu, handleContextMenu, closeMenu } = useContextMenuTrigger()

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      useSelectionStore.getState().toggleSelect(node.id)
    } else if (e.shiftKey) {
      useSelectionStore.getState().rangeSelect(node.id, [])
    } else {
      select(node.id)
      toggleFolder(node.id)
    }
  }, [node.id, select, toggleFolder])

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', node.id)
    useInteractionStore.getState().startDrag(node.id)
  }, [node.id])

  const handleDragEnd = useCallback(() => {
    if (expandTimerRef.current) clearTimeout(expandTimerRef.current)
    useInteractionStore.getState().stopDrag()
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggingId === node.id) return
    const rect = itemRef.current?.getBoundingClientRect()
    if (!rect) return
    const y = e.clientY - rect.top
    const zone = rect.height / 4
    let pos: 'above' | 'below' | 'inside'
    if (y < zone) pos = 'above'
    else if (y > rect.height - zone) pos = 'below'
    else pos = 'inside'
    useInteractionStore.getState().setDropTarget(node.id, pos)

    if (pos === 'inside' && !isExpanded && !expandTimerRef.current) {
      expandTimerRef.current = setTimeout(() => {
        expandFolder(node.id)
        expandTimerRef.current = null
      }, DND_FOLDER_EXPAND_DELAY)
    } else if (pos !== 'inside' && expandTimerRef.current) {
      clearTimeout(expandTimerRef.current)
      expandTimerRef.current = null
    }
  }, [node.id, draggingId, isExpanded, expandFolder])

  const handleDragLeave = useCallback(() => {
    if (expandTimerRef.current) { clearTimeout(expandTimerRef.current); expandTimerRef.current = null }
    if (dropTargetId === node.id) {
      useInteractionStore.getState().setDropTarget(null, null)
    }
  }, [node.id, dropTargetId])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (expandTimerRef.current) { clearTimeout(expandTimerRef.current); expandTimerRef.current = null }
    const sourceId = e.dataTransfer.getData('text/plain')
    if (!sourceId || sourceId === node.id) return
    const store = useBookmarkStore.getState()
    if (dropPosition === 'inside') {
      store.moveBookmark(sourceId, node.id)
    } else {
      const targetNode = store.getNode(node.id)
      if (!targetNode) return
      const idx = dropPosition === 'above' ? targetNode.index : (targetNode.index ?? 0) + 1
      store.moveBookmark(sourceId, targetNode.parentId ?? '1', idx)
    }
    useInteractionStore.getState().stopDrag()
  }, [node.id, dropPosition])

  const childCount = node.children?.length ?? 0

  return (
    <>
      <div
        ref={itemRef}
        draggable={!isRenaming}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex items-center gap-2 h-[var(--item-height)] px-[10px] pr-8
          rounded-[var(--radius-lg)] cursor-pointer relative select-none
          font-medium transition-colors duration-[120ms]
          ${isDragging ? 'opacity-40' : ''}
          ${isDropTarget && dropPosition === 'inside' ? 'bg-[var(--color-accent-bg)] ring-1 ring-[var(--color-accent)]' : ''}
          ${isSelected && !isDropTarget ? 'bg-[var(--color-bg-selected)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'}
          group
        `}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {isDropTarget && dropPosition === 'above' && (
          <div className="absolute top-0 left-2 right-2 h-[2px] bg-[var(--color-accent)] rounded-full" />
        )}
        {isDropTarget && dropPosition === 'below' && (
          <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--color-accent)] rounded-full" />
        )}
        <motion.span
          className="w-[14px] h-[14px] flex-shrink-0 flex items-center justify-center text-[var(--color-text-tertiary)]"
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronRightIcon />
        </motion.span>
        <FolderIcon size={16} color={folderColor} className="flex-shrink-0" />
        {isRenaming ? (
          <InlineRename id={node.id} currentTitle={node.title} onDone={stopRename} />
        ) : (
          <span className="flex-1 truncate">{node.title}</span>
        )}
        {childCount > 0 && !isRenaming && (
          <span className="text-[10px] text-[var(--color-text-tertiary)] mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {childCount}
          </span>
        )}
        {!isRenaming && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--color-bg-active)] hover:text-[var(--color-text-primary)] transition-opacity duration-100"
            onClick={(e) => { e.stopPropagation(); handleContextMenu(e) }}
          >
            <DotsIcon size={13} />
          </button>
        )}
      </div>
      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          items={getFolderMenuItems(node)}
          onClose={closeMenu}
        />
      )}
    </>
  )
})
