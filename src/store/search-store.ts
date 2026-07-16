import { create } from 'zustand'
import Fuse, { type IFuseOptions } from 'fuse.js'
import type { BookmarkNode } from '@/lib/chrome-api'
import { SEARCH_MAX_RESULTS, RECENT_SEARCHES_MAX } from '@/lib/constants'
import { storage } from '@/lib/chrome-api'

interface SearchableItem {
  id: string
  title: string
  url: string
  parentId: string
  path: string
}

interface SearchState {
  query: string
  results: SearchableItem[]
  selectedIndex: number
  recentSearches: string[]
  isActive: boolean
  fuse: Fuse<SearchableItem> | null

  buildIndex: (tree: BookmarkNode[]) => void
  search: (query: string) => void
  setSelectedIndex: (index: number) => void
  clearSearch: () => void
  addRecentSearch: (query: string) => void
  removeRecentSearch: (query: string) => void
  loadRecentSearches: () => Promise<void>
}

function flattenTree(nodes: BookmarkNode[], path = ''): SearchableItem[] {
  const items: SearchableItem[] = []
  for (const node of nodes) {
    const currentPath = path ? `${path} / ${node.title}` : node.title
    if (node.url) {
      items.push({
        id: node.id,
        title: node.title,
        url: node.url,
        parentId: node.parentId ?? '',
        path: path,
      })
    }
    if (node.children) {
      items.push(...flattenTree(node.children, currentPath))
    }
  }
  return items
}

const fuseOptions: IFuseOptions<SearchableItem> = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'url', weight: 0.2 },
    { name: 'path', weight: 0.1 },
  ],
  threshold: 0.35,
  distance: 100,
  includeMatches: true,
  includeScore: true,
  minMatchCharLength: 2,
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  selectedIndex: 0,
  recentSearches: [],
  isActive: false,
  fuse: null,

  buildIndex(tree) {
    const items = flattenTree(tree)
    const fuse = new Fuse(items, fuseOptions)
    set({ fuse })
  },

  search(query) {
    const { fuse } = get()
    if (!query.trim()) {
      set({ query: '', results: [], isActive: false, selectedIndex: 0 })
      return
    }
    set({ query, isActive: true })
    if (!fuse) return

    const results = fuse
      .search(query)
      .slice(0, SEARCH_MAX_RESULTS)
      .map(r => r.item)
    set({ results, selectedIndex: 0 })
  },

  setSelectedIndex(index) {
    set({ selectedIndex: index })
  },

  clearSearch() {
    set({ query: '', results: [], isActive: false, selectedIndex: 0 })
  },

  addRecentSearch(query) {
    if (!query.trim()) return
    const { recentSearches } = get()
    const filtered = recentSearches.filter(s => s !== query)
    const next = [query, ...filtered].slice(0, RECENT_SEARCHES_MAX)
    set({ recentSearches: next })
    storage.setLocal({ recentSearches: next })
  },

  removeRecentSearch(query) {
    const { recentSearches } = get()
    const next = recentSearches.filter(s => s !== query)
    set({ recentSearches: next })
    storage.setLocal({ recentSearches: next })
  },

  async loadRecentSearches() {
    try {
      const data = await storage.getLocal<string[]>(['recentSearches'])
      if (data.recentSearches) {
        set({ recentSearches: data.recentSearches })
      }
    } catch {
      // Use defaults
    }
  },
}))
