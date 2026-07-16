# Development Roadmap

## Milestone 1: Foundation & Core Tree (Week 1)

### Setup
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS with design tokens
- [ ] Set up Manifest V3 structure
- [ ] Configure build pipeline (multi-entry: panel, background, fallback)
- [ ] Set up Zustand stores (bookmark, UI, settings)
- [ ] Chrome API typed wrapper
- [ ] Message bridge (panel ↔ background)

### Core UI
- [ ] Sidebar container (open/close animation)
- [ ] Sidebar header (action buttons)
- [ ] Bookmark tree rendering (recursive)
- [ ] Folder expand/collapse
- [ ] Bookmark item (favicon, title, click to open)
- [ ] Basic theme support (dark/light/system)
- [ ] CSS custom properties for tokens

### Deliverable
Side panel opens, shows bookmark tree, folders expand/collapse, clicking opens URL.

---

## Milestone 2: CRUD & Dialogs (Week 2)

### Bookmark Operations
- [ ] Add Bookmark dialog (pre-filled from current tab)
- [ ] Edit Bookmark dialog (title + URL)
- [ ] Delete bookmark (with undo toast)
- [ ] Rename (inline or dialog)
- [ ] Create Folder dialog
- [ ] Delete Folder (with confirmation for non-empty)
- [ ] Duplicate bookmark
- [ ] Duplicate folder (recursive)

### UI Components
- [ ] Dialog component (base, animated, focus trap)
- [ ] Input component
- [ ] Select component (folder picker tree)
- [ ] Button component (primary/secondary)
- [ ] Toast component (with undo action)
- [ ] Overlay/backdrop

### State
- [ ] Optimistic updates for all CRUD
- [ ] Real-time sync via bookmark events
- [ ] Undo stack (last 20 actions)

### Deliverable
Full CRUD on bookmarks and folders. Undo support. Real-time sync.

---

## Milestone 3: Search (Week 2-3)

### Search Engine
- [ ] Fuse.js integration and index building
- [ ] Incremental index updates on events
- [ ] Fuzzy search by title and URL
- [ ] Match highlighting
- [ ] Debounced input (150ms)

### Search UI
- [ ] Search bar (sticky, styled)
- [ ] Search results view (replaces tree)
- [ ] Result item (favicon, highlighted title, domain, folder path)
- [ ] Keyboard navigation in results (arrows, Enter)
- [ ] Cmd+Enter opens in new tab
- [ ] Empty state animation
- [ ] Recent searches (stored, clickable)
- [ ] Clear search (Escape or X button)

### Deliverable
Instant fuzzy search with highlighted results and keyboard navigation.

---

## Milestone 4: Keyboard Navigation (Week 3)

### Tree Navigation
- [ ] Arrow Up/Down moves focus
- [ ] Arrow Right expands folder
- [ ] Arrow Left collapses folder / go to parent
- [ ] Enter opens bookmark
- [ ] Space toggles folder
- [ ] Home/End jump to first/last

### Global Shortcuts
- [ ] Cmd+Shift+B toggle sidebar
- [ ] Cmd+D add bookmark
- [ ] / or Cmd+F focus search
- [ ] Escape (contextual: clear search / close dialog / deselect)
- [ ] F2 rename

### Selection
- [ ] Shift+Arrow extends selection
- [ ] Shift+Click range selection
- [ ] Cmd+Click toggle selection
- [ ] Cmd+A select all
- [ ] Visual focus indicator (ring)
- [ ] ARIA active-descendant tracking

### Deliverable
Complete keyboard-only navigation. No mouse required for any operation.

---

## Milestone 5: Context Menus (Week 3-4)

### Implementation
- [ ] Context menu component (floating, positioned)
- [ ] macOS-native styling
- [ ] Keyboard navigation within menu
- [ ] Sub-menu support
- [ ] Separator groups

### Menu Configurations
- [ ] Bookmark context menu (open, edit, delete, move, duplicate, copy)
- [ ] Folder context menu (open all, rename, delete, new bookmark, new folder)
- [ ] Empty space context menu (new bookmark, new folder, paste)
- [ ] Multi-selection context menu (open all, delete, move)

### Clipboard
- [ ] Cut (Cmd+X)
- [ ] Copy (Cmd+C)
- [ ] Paste (Cmd+V)
- [ ] Duplicate (Cmd+D in sidebar)

### Deliverable
Professional context menus with full action set. Clipboard operations work.

---

## Milestone 6: Drag & Drop (Week 4)

### Implementation (dnd-kit)
- [ ] Drag start (click + hold or immediate)
- [ ] Drag overlay (ghost with item preview)
- [ ] Drop indicator (blue line between items)
- [ ] Drop into folder (highlight folder)
- [ ] Auto-expand folder on hover (500ms)
- [ ] Auto-scroll during drag
- [ ] Multi-item drag
- [ ] Cancel with Escape

### Animations
- [ ] Pick up: source dims, ghost appears
- [ ] During: smooth follow cursor
- [ ] Drop: spring to new position
- [ ] Cancel: spring back to source

### Reorder
- [ ] Within same folder
- [ ] Between different folders
- [ ] Into nested folders (any depth)

### Deliverable
Smooth, animated drag and drop with all edge cases handled.

---

## Milestone 7: Multi-Select & Bulk Operations (Week 4-5)

### Selection
- [ ] Visual multi-select highlighting
- [ ] Selection count indicator
- [ ] Select across folders

### Bulk Actions
- [ ] Bulk delete (confirmation dialog)
- [ ] Bulk move (Move To dialog with folder tree)
- [ ] Bulk open (all in new tabs)
- [ ] Bulk export (selected items)

### Move To Dialog
- [ ] Folder tree display
- [ ] Create new folder inline
- [ ] Confirm move

### Deliverable
Power-user multi-select with all bulk operations.

---

## Milestone 8: Import / Export (Week 5)

### Import
- [ ] File picker (accept .html)
- [ ] Parse Netscape bookmark HTML format
- [ ] Browser detection (Chrome, Firefox, Safari, Edge, Brave)
- [ ] Preview imported structure
- [ ] Duplicate detection (by URL)
- [ ] Conflict resolution UI (skip / replace / keep both)
- [ ] Progress indicator
- [ ] Error handling with user feedback

### Export
- [ ] Export all bookmarks as HTML
- [ ] Export selected folder(s)
- [ ] Export selected bookmarks
- [ ] Valid Netscape Bookmark File format
- [ ] Download trigger

### Deliverable
Import from any Chromium/Firefox/Safari export. Export entire library.

---

## Milestone 9: Settings & Preferences (Week 5-6)

### Settings UI
- [ ] Settings view within sidebar (back navigation)
- [ ] Theme selector (Light/Dark/System) with live preview
- [ ] Animation toggle
- [ ] Sidebar width slider
- [ ] Default folder picker
- [ ] Keyboard shortcut display
- [ ] Restore defaults button

### Backup
- [ ] Backup all bookmarks + settings to JSON
- [ ] Restore from backup file
- [ ] Validation before restore

### Deliverable
Complete settings panel. Backup/restore functionality.

---

## Milestone 10: Polish & Accessibility (Week 6)

### Visual Polish
- [ ] All animations tuned to spec
- [ ] Theme transitions (smooth color changes)
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Favicon loading (lazy, placeholder)
- [ ] Scrollbar styling
- [ ] Resize handle

### Accessibility
- [ ] Full ARIA implementation
- [ ] Focus management audit
- [ ] Screen reader testing (VoiceOver)
- [ ] Reduced motion support
- [ ] High contrast mode
- [ ] Keyboard-only complete walkthrough
- [ ] axe-core zero violations

### Deliverable
Production-quality polish. WCAG 2.1 AA compliant.

---

## Milestone 11: Performance & Edge Cases (Week 6-7)

### Performance
- [ ] Virtual scrolling tuning
- [ ] 100K bookmark stress test
- [ ] Search performance benchmarks
- [ ] Memory profiling
- [ ] Animation FPS verification
- [ ] Bundle size optimization
- [ ] Code splitting verification

### Edge Cases
- [ ] Very long titles
- [ ] Unicode/emoji in titles
- [ ] Invalid URLs in data
- [ ] Network offline behavior
- [ ] Extension update migration
- [ ] Multiple windows/tabs open
- [ ] Rapid click/keyboard spam

### Deliverable
Verified performance targets met. All edge cases handled gracefully.

---

## Milestone 12: Final QA & Ship (Week 7)

### Testing
- [ ] Full feature parity checklist walkthrough
- [ ] Cross-browser testing (Arc, Chrome, Edge, Brave)
- [ ] E2E test suite green
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] Security review (minimal permissions, no leaks)

### Packaging
- [ ] Production build optimized
- [ ] Icons finalized (all sizes)
- [ ] Extension description / screenshots
- [ ] Chrome Web Store listing prepared

### Deliverable
Ship-ready extension. 100% feature parity verified.
