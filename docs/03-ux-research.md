# UX Research Summary

## Arc Browser Design Patterns

### Visual Language
- **Colors**: Deep muted backgrounds (#171717 dark, near-white light), vibrancy through accent colors per-Space
- **Corner radius**: 10-12px for panels/cards, 6-8px for buttons/inputs, 4px for small elements
- **Shadows**: Layered — subtle ambient shadow + directional shadow for elevation
- **Blur**: backdrop-filter: blur(20px) on overlays and floating panels
- **Borders**: 1px subtle separator lines, never harsh — uses opacity (0.06-0.12)
- **Spacing**: 8px grid system, generous padding (16-20px in panels)

### Typography
- Font: System font stack (-apple-system, SF Pro on macOS)
- Sizes: 11px metadata, 13px body/labels, 14px primary text, 16px section headers, 20px+ titles
- Weight: 400 normal, 500 medium (labels/folders), 600 semibold (headings)
- Letter-spacing: -0.01em to -0.02em for tighter large text
- Line-height: 1.3-1.5

### Sidebar
- Width: 220-260px default, resizable 180-400px
- Background: Slightly different shade from main content
- Items: 32-36px row height
- Hover: Subtle background fill (#2f2f2f dark / #ececec light)
- Active: Slightly more opaque background
- Transition: 150ms for hover, 250ms for panel animations

### Interactions
- Hover: 0ms delay (instant background), opacity fade for secondary elements
- Click: Immediate response, no debounce on navigation
- Context menu: Appears at cursor, 10px corner radius, soft shadow, scale-in animation
- Drag: Slight opacity reduction on source, ghost at cursor, spring snap on drop
- Selection: Blue/purple accent highlight, preserved across keyboard navigation

### Animations
- Panel slide: cubic-bezier(0.32, 0.72, 0, 1) — Arc's signature spring-like curve
- Expand/collapse: 200-250ms, ease-out
- Fade: 120-150ms
- Scale popup: from 0.96 to 1.0, 100ms
- Spring: tension 200, friction 20 (Framer Motion spring config)
- Drag: spring with damping 25, stiffness 300

### Keyboard
- Command Bar: Cmd+T (universal search/action)
- Navigation: Arrow keys
- Close: Escape
- Modifier awareness: Cmd held shows alternative actions

---

## Chrome Bookmark Manager Patterns

### Information Architecture
- Tree structure: Root > Bookmarks Bar / Other / Mobile
- Flat list view with breadcrumb for current folder
- Dual-pane: folder tree left, contents right (manager page)
- Sort: Manual default, sortable by name/date

### CRUD Operations
- Add: Dialog with title, URL, folder picker (tree)
- Edit: Inline or dialog, same fields
- Delete: Immediate with undo toast (no confirmation for single items)
- Move: Drag or "Move to" dialog with folder tree
- Bulk: Shift/Ctrl select, then right-click for bulk actions

### Context Menu Structure
```
[Bookmark]
Open in new tab
Open in new window
Open in incognito window
---
Edit...
Delete
---
Cut
Copy
Paste
---
Add bookmark...
Add folder...

[Folder]
Open all (N)
Open all in new window
Open all in incognito window
---
Rename...
Delete
---
Cut
Copy
Paste
---
Add bookmark...
Add folder...
```

### Import/Export
- HTML format (Netscape Bookmark File, standard across browsers)
- DT/DL nested structure for folders
- Preserves: title, URL, add_date, icon
- Import location: Creates new folder or merges to root

---

## Safari Bookmark Sidebar

### Design
- Ultra-clean, minimal chrome
- Items: 28px row height (compact)
- Indentation: 16px per level
- Icons: 16x16, monochrome system icons
- Disclosure triangles: Small, subtle
- Selection: System blue highlight
- Font: San Francisco, 13px
- No visible borders between items
- Scroll: Native momentum, thin scrollbar

### Hierarchy
- Favorites (top)
- Bookmarks Menu
- Custom folders
- Reading List (separate section)

---

## macOS Finder

### Sidebar
- Width: ~180-220px default
- Sections: Favorites, iCloud, Locations, Tags
- Section headers: 11px uppercase, muted color, 500 weight
- Items: 24px height, 16px icons
- Drag to reorder within sections
- Drop targets highlight with rounded rect

### Selection & Navigation
- Click to select, double-click to open
- Arrow keys navigate, Enter renames
- Space triggers Quick Look
- Cmd+Delete sends to trash
- Shift+Click extends selection
- Cmd+Click toggles individual items

### Context Menus
- Native macOS appearance
- Separator groups
- Keyboard shortcuts shown right-aligned
- Disabled items grayed out
- Sub-menus with disclosure arrows

### Drag & Drop
- Ghost image of dragged item
- Blue insertion indicator between items
- Folder springs open after 500ms hover
- Badge shows count when dragging multiple
- Escape cancels

---

## ChatGPT Desktop Sidebar

### Dimensions
- Width: 260px (fixed, not resizable on web)
- Item height: ~40px
- Padding: 8-12px horizontal
- Gap between items: 2px

### Search
- Sticky at top
- Full-width input
- Magnifying glass icon left
- Placeholder: "Search chats..."
- Results replace main list instantly
- Keyboard: Arrow keys navigate, Enter selects
- No separate search page — filters inline
- Debounce: ~200ms

### Visual Style
- Background: #171717 (dark mode)
- Items: No visible borders, just spacing
- Hover: #2f2f2f background
- Active/selected: Slightly brighter
- Text: #ececec primary, #b4b4b4 secondary
- Icons: 18px, muted color
- 3-dot menu: Appears on hover only
- Font: Söhne (proprietary), fallback to system
- Rounded corners: 10px on items

### Interaction
- Single click opens/navigates
- Hover reveals actions (rename, delete dots)
- Groups by date (Today, Yesterday, Previous 7 days)
- Smooth scroll, no virtual scrolling (limited items)
- Collapse/expand animation: height transition

---

## Key Design Decisions (Synthesis)

1. **Sidebar width**: 260px default (matches ChatGPT), resizable 200-400px
2. **Row height**: 36px (balance between Arc's compact and ChatGPT's roomy)
3. **Corner radius**: 10px standard, 8px for inputs, 6px for small elements
4. **Animation timing**: Arc-style spring curves, 150-250ms duration
5. **Color system**: ChatGPT's dark palette, Arc's vibrancy for accents
6. **Typography**: System font stack, SF Pro on macOS
7. **Context menus**: macOS-native style (Finder) with Arc's border radius
8. **Search**: ChatGPT's inline filtering approach with fuzzy matching
9. **Drag & drop**: Finder's spring-open + insertion indicators
10. **Keyboard**: Comprehensive Finder-like navigation
