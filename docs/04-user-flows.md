# User Flows

## 1. First Launch
```
Install extension
  → Extension icon appears in toolbar
  → Click icon OR Cmd+Shift+B
  → Sidebar slides in from left (spring animation)
  → Bookmarks loaded from Chrome API
  → Tree displayed with Bookmarks Bar expanded
  → Brief onboarding tooltip (dismissable)
```

## 2. Add Bookmark (Current Page)
```
User on any webpage
  → Cmd+D OR click "+" button in sidebar
  → Dialog appears (centered, spring animation)
  → Pre-filled: page title, page URL, favicon
  → Folder picker shows current/last-used folder
  → User edits title if desired
  → Click "Save" OR press Enter
  → Dialog closes
  → Bookmark appears in list (animate in)
  → Toast: "Bookmark saved"
```

## 3. Search
```
Sidebar open
  → Click search input OR start typing (when sidebar focused)
  → Type query (debounce 150ms)
  → Results replace tree view instantly
  → Matched text highlighted in yellow
  → Arrow keys navigate results
  → Enter opens selected result
  → Cmd+Enter opens in new tab
  → Escape clears search, restores tree
```

## 4. Organize with Drag & Drop
```
Sidebar showing bookmarks
  → Mouse down on bookmark (150ms hold = drag start)
  → Item reduces opacity, ghost follows cursor
  → Drag over folder → folder highlights
  → Hold 500ms over collapsed folder → auto-expands
  → Drop indicator shows insertion point
  → Release → item moves with spring animation
  → Tree re-renders with new position
```

## 5. Multi-Select & Bulk Action
```
Sidebar showing bookmarks
  → Click first bookmark
  → Shift+Click another → range selected (highlight)
  → OR Cmd+Click to toggle individual items
  → Right-click on selection
  → Context menu: "Delete 5 bookmarks" / "Move to..." / "Open all"
  → Confirm action → bulk operation executes
  → Toast with undo option
```

## 6. Create Folder Structure
```
Sidebar open
  → Right-click in list OR click folder icon
  → "New Folder" option
  → Dialog: folder name + location picker
  → Enter name, select parent
  → "Create" → folder appears (animate in)
  → Drag bookmarks into folder
  → Right-click folder → "New Folder" (nested)
```

## 7. Import Bookmarks
```
Settings → Import section
  → "Import Bookmarks" button
  → File picker opens (accepts .html)
  → File parsed and validated
  → Preview: folder tree of imported bookmarks
  → Duplicate detection shows conflicts
  → User resolves: Skip / Replace / Keep Both
  → "Import" → bookmarks merge into tree
  → Progress indicator for large files
  → Toast: "Imported 247 bookmarks"
```

## 8. Export Bookmarks
```
Settings → Export section
  → "Export All" or select specific folders
  → Choose format (HTML)
  → File downloads
  → Toast: "Exported 1,247 bookmarks"
```

## 9. Context Menu Actions
```
Right-click on bookmark
  → Menu appears at cursor (scale+fade in)
  → Navigate with arrow keys or mouse
  → Select action
  → Menu closes (fade out)
  → Action executes
  → Feedback (toast / UI change)
```

## 10. Theme Switching
```
Settings → Theme
  → Toggle: Light / Dark / System
  → Immediate transition (200ms color animation)
  → Preference saved to Chrome Storage
  → Persists across sessions
```

## 11. Keyboard-Only Navigation
```
Cmd+Shift+B → sidebar opens, focus trapped
  → Tab → search input focused
  → Type to search, Escape to clear
  → Tab → first bookmark focused
  → Arrow Down/Up → navigate list
  → Arrow Right → expand folder
  → Arrow Left → collapse folder OR go to parent
  → Enter → open bookmark
  → Space → toggle folder expand
  → F2 → rename focused item
  → Delete → delete with confirmation
  → Cmd+Shift+B → sidebar closes
```

## 12. Undo Flow
```
User deletes bookmark
  → Bookmark removed from tree (animate out)
  → Toast appears: "Deleted 'Bookmark Name'" [Undo]
  → Click "Undo" OR Cmd+Z within 5 seconds
  → Bookmark restored (animate back in)
  → Toast: "Restored"
```
