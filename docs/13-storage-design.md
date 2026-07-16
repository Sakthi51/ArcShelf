# Database / Storage Design

## Storage Strategy

The extension uses Chrome's native Bookmarks API as the primary data source. Additional state is persisted via Chrome Storage API.

---

## Primary Data: Chrome Bookmarks API

### Source of Truth
Chrome manages all bookmark data natively. We never duplicate the full tree into our own storage.

### API Surface Used
```typescript
// Read
chrome.bookmarks.getTree()              // Full tree
chrome.bookmarks.getChildren(id)        // Direct children
chrome.bookmarks.get(id)                // Single node
chrome.bookmarks.search(query)          // Text search

// Write
chrome.bookmarks.create({ title, url?, parentId, index? })
chrome.bookmarks.update(id, { title?, url? })
chrome.bookmarks.move(id, { parentId, index? })
chrome.bookmarks.remove(id)             // Single item
chrome.bookmarks.removeTree(id)         // Folder + children

// Events
chrome.bookmarks.onCreated
chrome.bookmarks.onRemoved
chrome.bookmarks.onChanged
chrome.bookmarks.onMoved
chrome.bookmarks.onChildrenReordered
```

---

## Secondary Data: Chrome Storage

### chrome.storage.sync (syncs across devices)
Max: 100KB total, 8KB per item

```typescript
interface SyncedSettings {
  theme: 'light' | 'dark' | 'system'
  animationsEnabled: boolean
  defaultFolderId: string
  sidebarWidth: number
  keyboardShortcuts: Record<string, string>
  showBookmarkBar: boolean
  compactMode: boolean
}
```

### chrome.storage.local (device-specific)
Max: 10MB total

```typescript
interface LocalState {
  // UI State
  expandedFolders: string[]        // IDs of expanded folders
  lastView: 'tree' | 'search' | 'settings'
  lastFolder: string               // Last navigated folder ID

  // Search
  recentSearches: string[]         // Last 10 searches
  searchIndex?: SerializedIndex    // Cached Fuse.js index

  // Undo Stack
  undoStack: UndoAction[]          // Last 20 actions

  // Import History
  lastImportDate?: number
  importStats?: { count: number, folders: number }

  // Performance Cache
  bookmarkCount?: number
  lastTreeHash?: string            // Detect if tree changed since last load
}
```

---

## In-Memory State (Zustand — not persisted)

```typescript
interface RuntimeState {
  // Bookmark tree (loaded from API on init)
  tree: BookmarkItem[]
  flatIndex: Map<string, BookmarkItem>   // O(1) lookup by ID

  // Current interaction state
  selection: Set<string>
  clipboard: { ids: string[], mode: 'cut' | 'copy' } | null
  dragState: DragState | null
  focusedItemId: string | null

  // Search runtime
  searchQuery: string
  searchResults: BookmarkItem[]
  searchSelectedIndex: number
  fuseInstance: Fuse<BookmarkItem> | null

  // Dialog state
  activeDialog: DialogType | null
  dialogData: any
}
```

---

## Undo System

### Action Types
```typescript
type UndoAction =
  | { type: 'delete', bookmark: BookmarkItem, parentId: string, index: number }
  | { type: 'move', id: string, from: { parentId: string, index: number }, to: { parentId: string, index: number } }
  | { type: 'rename', id: string, oldTitle: string, newTitle: string }
  | { type: 'edit', id: string, old: { title: string, url: string }, new: { title: string, url: string } }
  | { type: 'create', id: string }
  | { type: 'bulk-delete', items: Array<{ bookmark: BookmarkItem, parentId: string, index: number }> }
```

### Undo Stack
- Max depth: 20 actions
- Auto-expires after 5 minutes
- Persisted to chrome.storage.local (survives page reload)
- Cmd+Z triggers most recent undoable action

---

## Search Index

### Fuse.js Configuration
```typescript
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'url', weight: 0.3 },
  ],
  threshold: 0.3,
  distance: 100,
  includeMatches: true,
  includeScore: true,
  minMatchCharLength: 2,
  useExtendedSearch: false,
}
```

### Index Lifecycle
1. Built on initial tree load
2. Updated incrementally on bookmark events (add/remove/update)
3. Cached serialized form in chrome.storage.local
4. Rebuilt if cache invalidated (tree hash mismatch)

---

## Import/Export Format

### HTML Format (Standard Netscape Bookmark File)
```html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT><H3 ADD_DATE="1234567890" LAST_MODIFIED="1234567890">Folder Name</H3>
  <DL><p>
    <DT><A HREF="https://example.com" ADD_DATE="1234567890" ICON="data:...">Title</A>
  </DL><p>
</DL><p>
```

### Parsing Strategy
- DOMParser for HTML parsing
- Walk DL/DT/A/H3 structure
- Preserve: title, url, add_date, folder hierarchy
- Handle: malformed HTML, missing attributes, encoding issues

---

## Data Integrity

### Conflict Resolution (Import)
```typescript
type ConflictStrategy = 'skip' | 'replace' | 'keep-both'

interface ImportConflict {
  existing: BookmarkItem
  incoming: BookmarkItem
  type: 'exact-url' | 'same-title-different-url'
}
```

### Validation
- URL validation: try new URL(url) — reject invalid
- Title: trim, max 500 chars
- Folder depth: warn at 10+ levels (Chrome limit ~50)
- Total count: warn at 10,000+ during import (performance)

---

## Performance Characteristics

| Operation | Expected Latency |
|-----------|-----------------|
| getTree() | 5-50ms (depends on size) |
| search() | <20ms (Fuse.js in-memory) |
| create() | <10ms |
| move() | <10ms |
| delete() | <10ms |
| Initial load (1000 bookmarks) | <100ms |
| Initial load (10,000 bookmarks) | <500ms |
| Search index build (10,000) | <200ms |
| Import 1000 bookmarks | 2-5s |
