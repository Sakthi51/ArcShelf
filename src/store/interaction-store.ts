import { create } from 'zustand'

interface InteractionState {
  renamingId: string | null
  draggingId: string | null
  dropTargetId: string | null
  dropPosition: 'above' | 'below' | 'inside' | null

  startRename: (id: string) => void
  stopRename: () => void
  startDrag: (id: string) => void
  setDropTarget: (id: string | null, position: 'above' | 'below' | 'inside' | null) => void
  stopDrag: () => void
}

export const useInteractionStore = create<InteractionState>((set) => ({
  renamingId: null,
  draggingId: null,
  dropTargetId: null,
  dropPosition: null,

  startRename(id) { set({ renamingId: id }) },
  stopRename() { set({ renamingId: null }) },
  startDrag(id) { set({ draggingId: id }) },
  setDropTarget(id, position) { set({ dropTargetId: id, dropPosition: position }) },
  stopDrag() { set({ draggingId: null, dropTargetId: null, dropPosition: null }) },
}))
