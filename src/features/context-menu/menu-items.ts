import type { BookmarkNode } from '@/lib/chrome-api'
import { tabs } from '@/lib/chrome-api'
import { useBookmarkStore } from '@/store/bookmark-store'
import { useToastStore } from '@/store/toast-store'
import { useInteractionStore } from '@/store/interaction-store'
import { useSelectionStore } from '@/store/selection-store'
import type { MenuEntry } from './ContextMenu'

export function getBookmarkMenuItems(node: BookmarkNode): MenuEntry[] {
  return [
    {
      id: 'open',
      label: 'Open',
      onClick: () => { if (node.url) tabs.openUrl(node.url) },
    },
    {
      id: 'open-new-tab',
      label: 'Open in new tab',
      shortcut: '⌘+Click',
      onClick: () => { if (node.url) tabs.openUrl(node.url, true) },
    },
    { id: 'sep-1', type: 'separator' },
    {
      id: 'rename',
      label: 'Rename',
      onClick: () => { useInteractionStore.getState().startRename(node.id) },
    },
    {
      id: 'copy-url',
      label: 'Copy URL',
      onClick: () => {
        if (node.url) navigator.clipboard.writeText(node.url)
        useToastStore.getState().show('Copied to clipboard')
      },
    },
    { id: 'sep-2', type: 'separator' },
    {
      id: 'delete',
      label: 'Delete',
      danger: true,
      onClick: () => {
        const store = useBookmarkStore.getState()
        store.removeBookmark(node.id)
        useToastStore.getState().show('Deleted', {
          label: 'Undo',
          onClick: () => { store.createBookmark(node.parentId ?? '1', node.title, node.url ?? '') },
        })
      },
    },
  ]
}

export function getFolderMenuItems(node: BookmarkNode): MenuEntry[] {
  const childUrls = (node.children ?? []).filter(c => c.url).map(c => c.url!)

  return [
    {
      id: 'open-all',
      label: `Open all (${childUrls.length})`,
      disabled: childUrls.length === 0,
      onClick: () => { tabs.openMultiple(childUrls) },
    },
    { id: 'sep-1', type: 'separator' },
    {
      id: 'rename',
      label: 'Rename',
      onClick: () => { useInteractionStore.getState().startRename(node.id) },
    },
    {
      id: 'new-folder',
      label: 'New folder inside',
      onClick: () => {
        const store = useBookmarkStore.getState()
        store.createFolder(node.id, 'New Folder')
        useToastStore.getState().show('Folder created')
      },
    },
    { id: 'sep-2', type: 'separator' },
    {
      id: 'delete',
      label: 'Delete',
      danger: true,
      onClick: () => {
        useBookmarkStore.getState().removeFolder(node.id)
        useToastStore.getState().show(`Deleted "${node.title}"`)
      },
    },
  ]
}

export function getMultiSelectMenuItems(selectedIds: Set<string>): MenuEntry[] {
  const count = selectedIds.size
  return [
    {
      id: 'open-all',
      label: `Open all (${count}) in tabs`,
      onClick: () => {
        const store = useBookmarkStore.getState()
        const urls: string[] = []
        selectedIds.forEach(id => {
          const n = store.getNode(id)
          if (n?.url) urls.push(n.url)
        })
        if (urls.length) tabs.openMultiple(urls)
      },
    },
    { id: 'sep-1', type: 'separator' },
    {
      id: 'delete-all',
      label: `Delete ${count} items`,
      danger: true,
      onClick: () => {
        const store = useBookmarkStore.getState()
        selectedIds.forEach(id => {
          const n = store.getNode(id)
          if (!n) return
          if (n.url) store.removeBookmark(id)
          else store.removeFolder(id)
        })
        useSelectionStore.getState().clearSelection()
        useToastStore.getState().show(`Deleted ${count} items`)
      },
    },
  ]
}
