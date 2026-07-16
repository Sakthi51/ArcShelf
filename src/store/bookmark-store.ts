import { create } from 'zustand'
import type { BookmarkNode } from '@/lib/chrome-api'
import api from '@/lib/chrome-api'
import { BOOKMARKS_BAR_ID } from '@/lib/constants'

export interface FlatBookmark {
  id: string
  parentId: string
  index: number
  title: string
  url?: string
  dateAdded?: number
  isFolder: boolean
  childCount: number
}

interface BookmarkState {
  tree: BookmarkNode[]
  flatIndex: Map<string, BookmarkNode>
  loading: boolean
  error: string | null
  rootIds: string[]

  loadTree: () => Promise<void>
  getNode: (id: string) => BookmarkNode | undefined
  getChildren: (id: string) => BookmarkNode[]
  getPath: (id: string) => BookmarkNode[]
  createBookmark: (parentId: string, title: string, url: string, index?: number) => Promise<BookmarkNode | null>
  createFolder: (parentId: string, title: string) => Promise<BookmarkNode | null>
  updateBookmark: (id: string, changes: { title?: string; url?: string }) => Promise<void>
  moveBookmark: (id: string, parentId: string, index?: number) => Promise<void>
  removeBookmark: (id: string) => Promise<void>
  removeFolder: (id: string) => Promise<void>
  refreshNode: (id: string) => void
}

function buildFlatIndex(nodes: BookmarkNode[]): Map<string, BookmarkNode> {
  const map = new Map<string, BookmarkNode>()
  function walk(node: BookmarkNode) {
    map.set(node.id, node)
    node.children?.forEach(walk)
  }
  nodes.forEach(walk)
  return map
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  tree: [],
  flatIndex: new Map(),
  loading: false,
  error: null,
  rootIds: [],

  async loadTree() {
    set({ loading: true, error: null })
    try {
      const tree = await api.getTree()
      const flatIndex = buildFlatIndex(tree)
      const rootIds = tree[0]?.children?.map(c => c.id) ?? [BOOKMARKS_BAR_ID]
      set({ tree, flatIndex, rootIds, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  getNode(id: string) {
    return get().flatIndex.get(id)
  },

  getChildren(id: string) {
    const node = get().flatIndex.get(id)
    return node?.children ?? []
  },

  getPath(id: string) {
    const { flatIndex } = get()
    const path: BookmarkNode[] = []
    let current = flatIndex.get(id)
    while (current && current.parentId) {
      path.unshift(current)
      current = flatIndex.get(current.parentId)
    }
    return path
  },

  async createBookmark(parentId, title, url, index) {
    try {
      const node = await api.create({ parentId, title, url, index })
      await get().loadTree()
      return node
    } catch {
      return null
    }
  },

  async createFolder(parentId, title) {
    try {
      const node = await api.create({ parentId, title })
      await get().loadTree()
      return node
    } catch {
      return null
    }
  },

  async updateBookmark(id, changes) {
    await api.update(id, changes)
    await get().loadTree()
  },

  async moveBookmark(id, parentId, index) {
    await api.move(id, { parentId, index })
    await get().loadTree()
  },

  async removeBookmark(id) {
    await api.remove(id)
    await get().loadTree()
  },

  async removeFolder(id) {
    await api.removeTree(id)
    await get().loadTree()
  },

  refreshNode(_id: string) {
    get().loadTree()
  },
}))
