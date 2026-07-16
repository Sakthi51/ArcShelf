# Component Inventory

## Layout Components

### `<Sidebar>`
- Root container for the extension UI
- Handles: width, resize, open/close animation
- Props: isOpen, width, onResize

### `<SidebarHeader>`
- Fixed top section with action buttons
- Contains: Add Bookmark, New Folder, Settings, Close buttons

### `<SidebarContent>`
- Scrollable middle section (virtualized)
- Switches between Tree/Search/Settings views

### `<SidebarFooter>`
- Optional bottom bar with counts/status

---

## Navigation Components

### `<Breadcrumb>`
- Shows current folder path
- Clickable segments for navigation
- Truncates middle segments for deep paths
- Props: path: {id, title}[]

### `<SearchBar>`
- Sticky search input
- Icon, input, clear button
- Controlled input with debounce
- Props: value, onChange, onClear, onFocus

---

## Tree Components

### `<BookmarkTree>`
- Virtual scrollable list of items
- Handles keyboard navigation
- Uses TanStack Virtual for performance
- Props: items, expandedFolders, selectedIds

### `<BookmarkItem>`
- Single bookmark row
- Shows: favicon, title, action dots
- States: default, hover, selected, dragging, drop-target
- Props: bookmark, isSelected, onOpen, onContextMenu

### `<FolderItem>`
- Folder row with expand/collapse
- Shows: chevron, folder icon, title, action dots, child count
- States: default, hover, selected, expanded, dragging, drop-target
- Props: folder, isExpanded, isSelected, onToggle, onContextMenu

### `<FolderChildren>`
- Animated container for folder's child items
- Handles expand/collapse animation
- Props: isExpanded, children

---

## Search Components

### `<SearchResults>`
- Flat list of search matches
- Virtualized for performance
- Props: results, selectedIndex

### `<SearchResultItem>`
- Single search result
- Shows: favicon, title (highlighted), URL domain, folder path
- Props: result, isSelected, highlights

### `<HighlightedText>`
- Renders text with highlighted match portions
- Props: text, matches: {start, end}[]

### `<EmptySearchState>`
- Friendly empty state when no results
- Animated illustration

### `<RecentSearches>`
- Shows recent search terms when input focused but empty
- Props: searches, onSelect, onClear

---

## Dialog Components

### `<Dialog>`
- Base modal dialog with overlay
- Spring animation in/out
- Focus trap, Escape to close
- Props: isOpen, onClose, title, children

### `<AddBookmarkDialog>`
- Pre-filled title/URL from current tab
- Favicon preview
- Folder picker dropdown
- Props: defaultTitle, defaultUrl, defaultFolder

### `<EditBookmarkDialog>`
- Edit title and URL
- Props: bookmark

### `<NewFolderDialog>`
- Folder name input + location picker
- Props: defaultParentId

### `<MoveToDialog>`
- Folder tree for selecting destination
- Props: itemIds, onMove

### `<ImportDialog>`
- File upload, preview, conflict resolution
- Multi-step flow
- Props: onImport

### `<DeleteConfirmDialog>`
- Confirmation with item details
- "Don't ask again" option for single items
- Props: items, onConfirm

---

## Context Menu

### `<ContextMenu>`
- Floating menu at cursor position
- macOS-native styling
- Keyboard navigation (arrows, Enter)
- Sub-menus with disclosure arrow
- Props: items, position, onClose

### `<ContextMenuItem>`
- Single menu item with label, shortcut, icon
- States: default, hover, disabled
- Props: label, shortcut, icon, onClick, disabled

### `<ContextMenuSeparator>`
- Visual divider between groups

---

## Form Components

### `<Input>`
- Styled text input
- States: default, focus, error
- Props: label, value, onChange, placeholder, error

### `<Select>`
- Styled dropdown (folder picker)
- Tree-structured options
- Props: options, value, onChange

### `<Button>`
- Primary and secondary variants
- Sizes: sm, md
- Props: variant, size, onClick, disabled

### `<IconButton>`
- Icon-only button with tooltip
- Props: icon, tooltip, onClick

---

## Feedback Components

### `<Toast>`
- Bottom-center notification
- Auto-dismiss (5s)
- Optional undo action
- Stacks multiple toasts
- Props: message, action, duration

### `<Tooltip>`
- Hover tooltip for icon buttons
- Delay: 500ms
- Props: content, side

---

## Drag & Drop Components

### `<DragOverlay>`
- Ghost preview while dragging
- Shows item count badge for multi-drag
- Props: items, position

### `<DropIndicator>`
- Blue line showing insertion point
- Props: position: 'above' | 'below' | 'inside'

---

## Settings Components

### `<SettingsView>`
- Full settings page within sidebar
- Back navigation

### `<ThemeSelector>`
- Light/Dark/System toggle
- Live preview

### `<ShortcutEditor>`
- Displays and allows editing keyboard shortcuts
- Conflict detection

### `<ImportExport>`
- Import/Export section with file handling

---

## Utility Components

### `<VirtualList>`
- Wrapper around TanStack Virtual
- Handles dynamic row heights
- Props: items, renderItem, estimateSize

### `<FocusScope>`
- Traps focus within a region
- Handles Tab cycling

### `<AnimatePresence>`
- Framer Motion wrapper for enter/exit animations

### `<VisuallyHidden>`
- Screen reader only content
- For ARIA announcements

---

## Component Count Summary
- Layout: 4
- Navigation: 2
- Tree: 4
- Search: 5
- Dialogs: 7
- Context Menu: 3
- Forms: 4
- Feedback: 2
- Drag & Drop: 2
- Settings: 4
- Utility: 4

**Total: ~41 components**
