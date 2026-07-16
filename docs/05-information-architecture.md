# Information Architecture

## Data Model

### Bookmark Node (Chrome API native)
```typescript
interface BookmarkTreeNode {
  id: string
  parentId?: string
  index?: number
  url?: string          // undefined = folder
  title: string
  dateAdded?: number
  dateGroupModified?: number
  dateLastUsed?: number
  children?: BookmarkTreeNode[]
}
```

### Extended Internal Model
```typescript
interface BookmarkItem {
  id: string
  parentId: string
  index: number
  title: string
  url?: string
  type: 'bookmark' | 'folder' | 'separator'
  dateAdded: number
  dateModified?: number
  children?: BookmarkItem[]
  // Computed
  depth: number
  path: string[]        // breadcrumb: ['Root', 'Dev', 'Tools']
  favicon?: string
  domain?: string
  isExpanded?: boolean
}
```

## Tree Structure
```
Root (id: "0")
├── Bookmarks Bar (id: "1")
│   ├── Folder A
│   │   ├── Bookmark 1
│   │   ├── Bookmark 2
│   │   └── Subfolder
│   │       └── Bookmark 3
│   ├── Bookmark 4
│   └── Folder B
│       └── ...
├── Other Bookmarks (id: "2")
│   └── ...
└── Mobile Bookmarks (id: "3")
    └── ...
```

## View States

### Tree View (Default)
- Hierarchical folder tree
- Expand/collapse folders
- Breadcrumb shows current path
- Current folder highlighted in navigation

### Search View
- Flat list of results
- Grouped by relevance
- Each result shows: title, URL domain, parent folder path
- Highlight matching text

### Multi-Select View
- Selection count in header
- Bulk action toolbar appears
- Selected items highlighted

## Navigation Model
```
Sidebar
├── Header (fixed)
│   ├── Add Bookmark button
│   ├── New Folder button
│   └── Close/Settings buttons
├── Search (sticky)
│   └── Input with icon
├── Breadcrumb (conditional, when navigated into folder)
│   └── Path segments (clickable)
├── Content (scrollable, virtualized)
│   ├── Folders
│   │   ├── Expand/collapse
│   │   └── Nested children
│   └── Bookmarks
│       ├── Favicon
│       ├── Title
│       └── Action dots (hover)
└── Footer (optional)
    └── Bookmark count / Status
```

## State Hierarchy
```
App State
├── UI State
│   ├── sidebarOpen: boolean
│   ├── sidebarWidth: number
│   ├── theme: 'light' | 'dark' | 'system'
│   ├── currentView: 'tree' | 'search' | 'settings'
│   └── animations: boolean
├── Bookmark State
│   ├── tree: BookmarkItem[]
│   ├── flatIndex: Map<id, BookmarkItem>
│   ├── expandedFolders: Set<id>
│   └── currentFolder: id
├── Selection State
│   ├── selected: Set<id>
│   ├── lastSelected: id | null
│   ├── clipboard: { items: id[], mode: 'cut' | 'copy' }
│   └── dragState: DragState | null
├── Search State
│   ├── query: string
│   ├── results: BookmarkItem[]
│   ├── selectedIndex: number
│   └── recentSearches: string[]
└── Settings State
    ├── theme
    ├── sidebarWidth
    ├── defaultFolder
    ├── animationsEnabled
    └── keyboardShortcuts
```
