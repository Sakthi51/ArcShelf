import { create } from 'zustand'
import { useBookmarkStore } from '@/store/bookmark-store'
import { UNDO_STACK_MAX, UNDO_EXPIRY_MS } from '@/lib/constants'

interface UndoDeleteAction {
  type: 'delete'
  title: string
  url: string
  parentId: string
  index: number
  timestamp: number
}

interface UndoMoveAction {
  type: 'move'
  id: string
  fromParentId: string
  fromIndex: number
  timestamp: number
}

interface UndoRenameAction {
  type: 'rename'
  id: string
  oldTitle: string
  timestamp: number
}

type UndoAction = UndoDeleteAction | UndoMoveAction | UndoRenameAction

interface UndoState {
  stack: UndoAction[]
  push: (action: UndoAction) => void
  undo: () => Promise<boolean>
  clear: () => void
}

export const useUndoStore = create<UndoState>((set, get) => ({
  stack: [],

  push(action) {
    const { stack } = get()
    const now = Date.now()
    const filtered = stack.filter(a => now - a.timestamp < UNDO_EXPIRY_MS)
    set({ stack: [...filtered, action].slice(-UNDO_STACK_MAX) })
  },

  async undo() {
    const { stack } = get()
    if (stack.length === 0) return false

    const action = stack[stack.length - 1]
    const now = Date.now()
    if (now - action.timestamp > UNDO_EXPIRY_MS) {
      set({ stack: stack.slice(0, -1) })
      return false
    }

    const store = useBookmarkStore.getState()

    switch (action.type) {
      case 'delete':
        await store.createBookmark(action.parentId, action.title, action.url, action.index)
        break
      case 'move':
        await store.moveBookmark(action.id, action.fromParentId, action.fromIndex)
        break
      case 'rename':
        await store.updateBookmark(action.id, { title: action.oldTitle })
        break
    }

    set({ stack: stack.slice(0, -1) })
    return true
  },

  clear() {
    set({ stack: [] })
  },
}))
