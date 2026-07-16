# Technical Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Chrome Browser                     │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │  Background   │    │     Side Panel / Popup    │   │
│  │  Service      │◄──►│     (React App)           │   │
│  │  Worker       │    │                           │   │
│  │              │    │  ┌─────────────────────┐  │   │
│  │  • Chrome API │    │  │  Zustand Store      │  │   │
│  │  • Event Hub  │    │  │  • Bookmark State   │  │   │
│  │  • Message    │    │  │  • UI State         │  │   │
│  │    Bridge     │    │  │  • Search Index     │  │   │
│  │              │    │  └─────────────────────┘  │   │
│  └──────────────┘    │                           │   │
│                       │  ┌─────────────────────┐  │   │
│                       │  │  Virtual DOM        │  │   │
│                       │  │  (React 18)         │  │   │
│                       │  └─────────────────────┘  │   │
│                       └──────────────────────────┘   │
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │  Content Script (Fallback only)               │   │
│  │  • Sidebar injection if Side Panel unavail.   │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
└─────────────────────────────────────────────────────┘
```

## Entry Points

### 1. Side Panel (Primary — Manifest V3)
- `sidepanel.html` → React app mount
- Native Chrome Side Panel API
- Best UX: proper panel behavior, no z-index fights

### 2. Content Script (Fallback)
- For browsers/versions without Side Panel API
- Injects sidebar via shadow DOM (style isolation)
- Same React app, different mount strategy

### 3. Service Worker (Background)
- `background.ts` → Chrome API bridge
- Handles: bookmark CRUD, events, keyboard shortcuts
- Communicates with panel/content via chrome.runtime messaging

---

## Project Structure

```
arc-bookmark-manager/
├── public/
│   ├── manifest.json
│   ├── sidepanel.html
│   └── icons/
├── src/
│   ├── background/
│   │   ├── index.ts              # Service worker entry
│   │   ├── bookmark-api.ts       # Chrome Bookmarks API wrapper
│   │   ├── message-handler.ts    # Message routing
│   │   └── events.ts             # Bookmark change events
│   ├── app/
│   │   ├── App.tsx               # Root component
│   │   ├── main.tsx              # React mount
│   │   └── providers.tsx         # Context providers
│   ├── features/
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarHeader.tsx
│   │   │   └── use-sidebar.ts
│   │   ├── bookmarks/
│   │   │   ├── BookmarkTree.tsx
│   │   │   ├── BookmarkItem.tsx
│   │   │   ├── FolderItem.tsx
│   │   │   ├── use-bookmarks.ts
│   │   │   └── bookmark-utils.ts
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── use-search.ts
│   │   │   └── search-engine.ts
│   │   ├── dnd/
│   │   │   ├── DndProvider.tsx
│   │   │   ├── DragOverlay.tsx
│   │   │   ├── DropIndicator.tsx
│   │   │   └── use-dnd.ts
│   │   ├── context-menu/
│   │   │   ├── ContextMenu.tsx
│   │   │   ├── ContextMenuItem.tsx
│   │   │   └── use-context-menu.ts
│   │   ├── dialogs/
│   │   │   ├── Dialog.tsx
│   │   │   ├── AddBookmarkDialog.tsx
│   │   │   ├── EditDialog.tsx
│   │   │   ├── NewFolderDialog.tsx
│   │   │   ├── MoveToDialog.tsx
│   │   │   └── ImportDialog.tsx
│   │   ├── selection/
│   │   │   ├── use-selection.ts
│   │   │   └── selection-utils.ts
│   │   ├── keyboard/
│   │   │   ├── use-keyboard.ts
│   │   │   └── shortcut-registry.ts
│   │   ├── import-export/
│   │   │   ├── import-parser.ts
│   │   │   ├── export-generator.ts
│   │   │   └── duplicate-detector.ts
│   │   ├── settings/
│   │   │   ├── SettingsView.tsx
│   │   │   ├── use-settings.ts
│   │   │   └── defaults.ts
│   │   └── undo/
│   │       ├── use-undo.ts
│   │       └── undo-stack.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── IconButton.tsx
│   │   │   └── Tooltip.tsx
│   │   ├── feedback/
│   │   │   ├── Toast.tsx
│   │   │   └── toast-store.ts
│   │   └── layout/
│   │       ├── VirtualList.tsx
│   │       ├── FocusScope.tsx
│   │       └── VisuallyHidden.tsx
│   ├── store/
│   │   ├── bookmark-store.ts     # Zustand bookmark state
│   │   ├── ui-store.ts           # Zustand UI state
│   │   └── middleware.ts         # Persistence, devtools
│   ├── lib/
│   │   ├── chrome-api.ts         # Typed Chrome API wrapper
│   │   ├── messaging.ts          # Panel ↔ Background messaging
│   │   ├── constants.ts          # App-wide constants
│   │   └── utils.ts              # Shared utilities
│   ├── hooks/
│   │   ├── use-chrome-bookmarks.ts
│   │   ├── use-theme.ts
│   │   ├── use-reduced-motion.ts
│   │   └── use-platform.ts
│   └── styles/
│       ├── globals.css           # Tailwind base + tokens
│       └── animations.css        # Keyframe definitions
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
└── docs/
```

---

## Data Flow

### Bookmark CRUD
```
User Action (React)
  → Optimistic UI update (Zustand store)
  → Send message to Background
  → Background calls Chrome Bookmarks API
  → On success: confirm (no-op, already shown)
  → On failure: revert optimistic update, show error toast
```

### Real-time Sync
```
Chrome fires bookmark event (onCreated, onRemoved, onMoved, onChanged)
  → Background receives event
  → Background broadcasts to all panels/content scripts
  → React app receives via chrome.runtime.onMessage
  → Zustand store updates
  → React re-renders affected components
```

### Search
```
User types in search input
  → Debounce 150ms
  → Query sent to search engine (Fuse.js, runs in panel)
  → Results returned (pre-indexed on load)
  → UI switches to search results view
  → Results virtualized if > 50
```

---

## State Management (Zustand)

### Stores
1. **bookmarkStore** — Tree data, flat index, expanded folders
2. **uiStore** — View state, sidebar open/width, dialogs
3. **selectionStore** — Selected IDs, clipboard, last anchor
4. **searchStore** — Query, results, recent searches, index
5. **settingsStore** — Theme, animations, shortcuts (persisted)

### Persistence
- Settings: chrome.storage.sync (syncs across devices)
- UI state (width, expanded): chrome.storage.local
- Bookmarks: Chrome Bookmarks API (source of truth)

---

## Performance Strategy

### Virtual Scrolling
- TanStack Virtual for bookmark list
- Estimated row height: 36px
- Overscan: 5 items above/below viewport
- Dynamic height measurement for folders with children

### Search Indexing
- Fuse.js index built on initial load
- Index updated incrementally on bookmark events
- Keys indexed: title, url
- Threshold: 0.3 (balanced fuzzy)

### Memoization
- React.memo on BookmarkItem and FolderItem
- useMemo for derived data (filtered lists, sorted results)
- Selective re-renders via Zustand selectors

### Lazy Loading
- Folder children rendered only when expanded
- Deep nesting: render first 3 levels, lazy-expand deeper
- Settings view: code-split (React.lazy)

---

## Browser Compatibility
- Chrome 116+ (Side Panel API)
- Arc (latest, Chromium-based)
- Edge 116+
- Brave (latest)
- Fallback: content script injection for older versions
