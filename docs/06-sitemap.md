# Sitemap / View Map

## Extension Entry Points

### 1. Sidebar Panel (Primary UI)
The main interface. Opens via:
- Toolbar icon click
- Keyboard shortcut (Cmd+Shift+B)
- Chrome Side Panel API (if available)

### 2. Background Service Worker
- Chrome API bridge
- Event listener for bookmark changes
- Keyboard shortcut handler
- Context menu registration

### 3. Options Page (Settings)
- Accessible from sidebar settings icon
- Or chrome://extensions → Extension Options

---

## Sidebar View Hierarchy

```
┌─────────────────────────────────┐
│ SIDEBAR                         │
├─────────────────────────────────┤
│                                 │
│  ┌── Tree View (default) ──┐   │
│  │  Header                  │   │
│  │  Search                  │   │
│  │  Breadcrumb (opt)        │   │
│  │  Bookmark List           │   │
│  │    ├── Folders           │   │
│  │    └── Bookmarks         │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌── Search View ───────────┐   │
│  │  Header                  │   │
│  │  Search (active)         │   │
│  │  Results List            │   │
│  │    ├── Match highlights  │   │
│  │    └── Folder path       │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌── Settings View ─────────┐   │
│  │  Back button             │   │
│  │  Theme                   │   │
│  │  Appearance              │   │
│  │  Import/Export           │   │
│  │  Keyboard Shortcuts      │   │
│  │  About                   │   │
│  └──────────────────────────┘   │
│                                 │
├─────────────────────────────────┤
│ OVERLAYS (on top of sidebar)    │
├─────────────────────────────────┤
│                                 │
│  • Context Menu (floating)      │
│  • Add Bookmark Dialog          │
│  • Edit Bookmark Dialog         │
│  • New Folder Dialog            │
│  • Move To Dialog               │
│  • Rename Inline Editor         │
│  • Delete Confirmation          │
│  • Import Preview               │
│  • Toast Notifications          │
│                                 │
└─────────────────────────────────┘
```

## View Transitions
```
Tree View ←→ Search View    (typing in search / clearing search)
Tree View  → Settings View  (settings button)
Settings   → Tree View      (back button / Escape)
Any View   → Dialog         (action triggers)
Dialog     → Previous View  (cancel / save)
```

## URL Schema (internal routing)
Since this is a Chrome Extension sidebar (not a web app), routing is state-based:
```
view: 'tree' | 'search' | 'settings'
folder: string (current folder ID for tree view)
query: string (active search query)
```
