import { create } from 'zustand'

type ClipboardMode = 'cut' | 'copy'

interface SelectionState {
  selected: Set<string>
  lastSelected: string | null
  clipboard: { ids: string[]; mode: ClipboardMode } | null

  select: (id: string) => void
  toggleSelect: (id: string) => void
  rangeSelect: (id: string, allVisibleIds: string[]) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean

  cut: (ids?: string[]) => void
  copy: (ids?: string[]) => void
  clearClipboard: () => void
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selected: new Set(),
  lastSelected: null,
  clipboard: null,

  select(id) {
    set({ selected: new Set([id]), lastSelected: id })
  },

  toggleSelect(id) {
    const { selected } = get()
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    set({ selected: next, lastSelected: id })
  },

  rangeSelect(id, allVisibleIds) {
    const { lastSelected } = get()
    if (!lastSelected) {
      set({ selected: new Set([id]), lastSelected: id })
      return
    }
    const startIdx = allVisibleIds.indexOf(lastSelected)
    const endIdx = allVisibleIds.indexOf(id)
    if (startIdx === -1 || endIdx === -1) {
      set({ selected: new Set([id]), lastSelected: id })
      return
    }
    const from = Math.min(startIdx, endIdx)
    const to = Math.max(startIdx, endIdx)
    const rangeIds = allVisibleIds.slice(from, to + 1)
    set({ selected: new Set(rangeIds), lastSelected: id })
  },

  selectAll(ids) {
    set({ selected: new Set(ids) })
  },

  clearSelection() {
    set({ selected: new Set(), lastSelected: null })
  },

  isSelected(id) {
    return get().selected.has(id)
  },

  cut(ids) {
    const toUse = ids ?? Array.from(get().selected)
    set({ clipboard: { ids: toUse, mode: 'cut' } })
  },

  copy(ids) {
    const toUse = ids ?? Array.from(get().selected)
    set({ clipboard: { ids: toUse, mode: 'copy' } })
  },

  clearClipboard() {
    set({ clipboard: null })
  },
}))
