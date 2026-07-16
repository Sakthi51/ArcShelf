import { create } from 'zustand'
import { storage } from '@/lib/chrome-api'
import { SIDEBAR_WIDTH_DEFAULT, BOOKMARKS_BAR_ID } from '@/lib/constants'

export type ViewMode = 'tree' | 'search' | 'settings'
export type Theme = 'light' | 'dark' | 'gray' | 'system'
export type SidebarPosition = 'left' | 'right'

interface UIState {
  view: ViewMode
  theme: Theme
  sidebarPosition: SidebarPosition
  sidebarVisible: boolean
  sidebarWidth: number
  expandedFolders: Set<string>
  currentFolderId: string
  animationsEnabled: boolean
  focusedItemId: string | null

  setView: (view: ViewMode) => void
  setTheme: (theme: Theme) => void
  setSidebarPosition: (pos: SidebarPosition) => void
  toggleSidebar: () => void
  showSidebar: () => void
  hideSidebar: () => void
  setSidebarWidth: (width: number) => void
  toggleFolder: (id: string) => void
  expandFolder: (id: string) => void
  collapseFolder: (id: string) => void
  setCurrentFolder: (id: string) => void
  setFocusedItem: (id: string | null) => void
  setAnimations: (enabled: boolean) => void
  loadPersistedState: () => Promise<void>
  persist: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  view: 'tree',
  theme: 'system',
  sidebarPosition: 'left',
  sidebarVisible: false,
  sidebarWidth: SIDEBAR_WIDTH_DEFAULT,
  expandedFolders: new Set([BOOKMARKS_BAR_ID]),
  currentFolderId: BOOKMARKS_BAR_ID,
  animationsEnabled: true,
  focusedItemId: null,

  toggleSidebar() {
    const { sidebarVisible } = get()
    set({ sidebarVisible: !sidebarVisible })
    storage.setLocal({ sidebarVisible: !sidebarVisible })
  },

  showSidebar() {
    set({ sidebarVisible: true })
    storage.setLocal({ sidebarVisible: true })
  },

  hideSidebar() {
    set({ sidebarVisible: false })
    storage.setLocal({ sidebarVisible: false })
  },

  setSidebarPosition(pos) {
    set({ sidebarPosition: pos })
    get().persist()
  },

  setView(view) {
    set({ view })
  },

  setTheme(theme) {
    set({ theme })
    const el = document.getElementById('arc-bm-sidebar')
    if (el) {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        el.setAttribute('data-theme', isDark ? 'dark' : 'light')
      } else {
        el.setAttribute('data-theme', theme)
      }
    }
    get().persist()
  },


  setSidebarWidth(width) {
    set({ sidebarWidth: width })
    get().persist()
  },

  toggleFolder(id) {
    const { expandedFolders } = get()
    const next = new Set(expandedFolders)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    set({ expandedFolders: next })
    get().persist()
  },

  expandFolder(id) {
    const { expandedFolders } = get()
    if (!expandedFolders.has(id)) {
      const next = new Set(expandedFolders)
      next.add(id)
      set({ expandedFolders: next })
    }
  },

  collapseFolder(id) {
    const { expandedFolders } = get()
    if (expandedFolders.has(id)) {
      const next = new Set(expandedFolders)
      next.delete(id)
      set({ expandedFolders: next })
    }
  },

  setCurrentFolder(id) {
    set({ currentFolderId: id })
  },

  setFocusedItem(id) {
    set({ focusedItemId: id })
  },

  setAnimations(enabled) {
    set({ animationsEnabled: enabled })
    get().persist()
  },

  async loadPersistedState() {
    try {
      const data = await storage.getLocal<unknown>([
        'theme',
        'sidebarWidth',
        'sidebarPosition',
        'expandedFolders',
        'animationsEnabled',
      ])
      set({
        theme: (data.theme as Theme) ?? 'system',
        sidebarPosition: (data.sidebarPosition as SidebarPosition) ?? 'left',
        sidebarVisible: false,
        sidebarWidth: (data.sidebarWidth as number) ?? SIDEBAR_WIDTH_DEFAULT,
        expandedFolders: new Set((data.expandedFolders as string[]) ?? [BOOKMARKS_BAR_ID]),
        animationsEnabled: (data.animationsEnabled as boolean) ?? true,
      })
    } catch {
      // Use defaults
    }
  },

  persist() {
    const { theme, sidebarWidth, sidebarPosition, expandedFolders, animationsEnabled } = get()
    storage.setLocal({
      theme,
      sidebarWidth,
      sidebarPosition,
      expandedFolders: Array.from(expandedFolders),
      animationsEnabled,
    })
  },
}))
