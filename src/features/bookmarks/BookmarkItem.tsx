import { memo, useCallback, useState, useRef } from 'react'
import type { BookmarkNode } from '@/lib/chrome-api'
import { tabs } from '@/lib/chrome-api'
import { useSelectionStore } from '@/store/selection-store'
import { useInteractionStore } from '@/store/interaction-store'
import { useBookmarkStore } from '@/store/bookmark-store'
import { getFaviconUrl } from '@/lib/constants'
import { DotsIcon, GlobeIcon } from '@/components/ui/Icons'
import { ContextMenu, useContextMenuTrigger } from '@/features/context-menu/ContextMenu'
import { getBookmarkMenuItems } from '@/features/context-menu/menu-items'
import { InlineRename } from './InlineRename'

interface Props {
  node: BookmarkNode
}

export const BookmarkItem = memo(function BookmarkItem({ node }: Props) {
  const isSelected = useSelectionStore(s => s.selected.has(node.id))
  const select = useSelectionStore(s => s.select)
  const rangeSelect = useSelectionStore(s => s.rangeSelect)
  const isRenaming = useInteractionStore(s => s.renamingId === node.id)
  const stopRename = useInteractionStore(s => s.stopRename)
  const draggingId = useInteractionStore(s => s.draggingId)
  const dropTargetId = useInteractionStore(s => s.dropTargetId)
  const dropPosition = useInteractionStore(s => s.dropPosition)
  const [imgError, setImgError] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  const { contextMenu, handleContextMenu, closeMenu } = useContextMenuTrigger()

  const isDragging = draggingId === node.id
  const isDropTarget = dropTargetId === node.id

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      if (node.url) tabs.openUrl(node.url, true)
      return
    }
    if (e.shiftKey) {
      rangeSelect(node.id, [])
      return
    }
    select(node.id)
  }, [node.id, node.url, select, rangeSelect])

  const handleDoubleClick = useCallback(() => {
    if (node.url) tabs.openUrl(node.url)
  }, [node.url])

  const handleAuxClick = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 && node.url) {
      e.preventDefault()
      tabs.openUrl(node.url, true)
    }
  }, [node.url])

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', node.id)
    useInteractionStore.getState().startDrag(node.id)
  }, [node.id])

  const handleDragEnd = useCallback(() => {
    useInteractionStore.getState().stopDrag()
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggingId === node.id) return
    const rect = itemRef.current?.getBoundingClientRect()
    if (!rect) return
    const midY = rect.top + rect.height / 2
    const pos = e.clientY < midY ? 'above' : 'below'
    useInteractionStore.getState().setDropTarget(node.id, pos)
  }, [node.id, draggingId])

  const handleDragLeave = useCallback(() => {
    if (dropTargetId === node.id) {
      useInteractionStore.getState().setDropTarget(null, null)
    }
  }, [node.id, dropTargetId])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData('text/plain')
    if (!sourceId || sourceId === node.id) return
    const store = useBookmarkStore.getState()
    const targetNode = store.getNode(node.id)
    if (!targetNode) return
    const idx = dropPosition === 'above' ? targetNode.index : (targetNode.index ?? 0) + 1
    store.moveBookmark(sourceId, targetNode.parentId ?? '1', idx)
    useInteractionStore.getState().stopDrag()
  }, [node.id, dropPosition])

  const faviconUrl = node.url ? getFaviconUrl(node.url) : ''
  const domain = node.url
    ? (() => { try { return new URL(node.url).hostname.replace('www.', '') } catch { return '' } })()
    : ''

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
          flex items-center gap-[10px] h-[var(--item-height)] px-[10px] pr-8
          rounded-[var(--radius-lg)] cursor-pointer relative select-none
          transition-colors duration-[120ms]
          ${isDragging ? 'opacity-40' : ''}
          ${isSelected ? 'bg-[var(--color-bg-selected)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'}
          group
        `}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onAuxClick={handleAuxClick}
        onContextMenu={handleContextMenu}
      >
        {isDropTarget && dropPosition === 'above' && (
          <div className="absolute top-0 left-2 right-2 h-[2px] bg-[var(--color-accent)] rounded-full" />
        )}
        {isDropTarget && dropPosition === 'below' && (
          <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--color-accent)] rounded-full" />
        )}
        <span className="w-[16px] h-[16px] flex-shrink-0 flex items-center justify-center">
          {faviconUrl && !imgError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-[16px] h-[16px] rounded-[2px]"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <GlobeIcon size={14} className="text-[var(--color-text-tertiary)]" />
          )}
        </span>
        {isRenaming ? (
          <InlineRename id={node.id} currentTitle={node.title} onDone={stopRename} />
        ) : (
          <span className="flex-1 truncate">{node.title || domain}</span>
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
          items={getBookmarkMenuItems(node)}
          onClose={closeMenu}
        />
      )}
    </>
  )
})
