# Performance Strategy

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial load (cold) | <200ms | Time from panel open to first paint |
| Initial load (warm) | <50ms | With cached index |
| Search latency | <30ms | Keystroke to results rendered |
| Scroll FPS | 60 FPS | During virtualized list scroll |
| Animation FPS | 60 FPS | All interactions |
| Memory usage | <50MB | With 100,000 bookmarks loaded |
| Drag response | <16ms | Pointer move to ghost update |

---

## Virtual Scrolling

### Implementation: TanStack Virtual
```typescript
const virtualizer = useVirtualizer({
  count: flattenedItems.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 36,  // item height
  overscan: 5,
})
```

### Strategy
- Only render visible items + 5 overscan buffer
- Estimated size: 36px per item (consistent height)
- Dynamic height: Folders with expanded children use measured height
- Scroll container: Sidebar content area
- Key recycling: Stable keys from bookmark IDs

### When Virtual Scrolling Activates
- Always on for flat search results
- Tree view: Virtualize when total visible items > 100
- Below 100 items: Regular rendering (avoids complexity overhead)

---

## Search Performance

### Index Strategy
1. **Build on load**: Fuse.js index from flattened bookmark array
2. **Incremental updates**: Add/remove/update index entries on bookmark events
3. **Cache**: Serialized index in chrome.storage.local (invalidated on tree changes)

### Search Pipeline
```
Keystroke → Debounce (150ms) → Fuse.search(query) → Slice(0, 100) → Render
```

### Optimization
- Limit results to 100 (most users don't scroll past 20)
- Pre-filter by type if searching URLs only
- Short queries (1 char): Show recent + starts-with matches (skip fuzzy)
- Index only title + URL (not metadata)

### Benchmark Targets
| Bookmarks | Index Build | Search Query |
|-----------|-------------|-------------|
| 1,000 | <20ms | <5ms |
| 10,000 | <100ms | <15ms |
| 100,000 | <500ms | <50ms |

---

## Rendering Performance

### Memoization Strategy
```typescript
// Bookmark item only re-renders when its data or selection state changes
const BookmarkItem = React.memo(({ bookmark, isSelected, isExpanded }) => {
  // ...
}, (prev, next) => {
  return prev.bookmark.id === next.bookmark.id
    && prev.isSelected === next.isSelected
    && prev.isExpanded === next.isExpanded
})
```

### Zustand Selectors
```typescript
// Only subscribe to the specific slice of state needed
const isSelected = useSelectionStore(s => s.selected.has(bookmarkId))
const isExpanded = useUIStore(s => s.expandedFolders.has(folderId))
```

### Avoid Re-render Triggers
- Use stable references for callbacks (useCallback)
- Avoid inline objects/arrays in props
- Context menu and dialogs are portaled (don't cause tree re-renders)
- Drag state updates are batched per frame

---

## Animation Performance

### Composite-Only Properties
All hot-path animations use ONLY:
- `transform` (translate, scale, rotate)
- `opacity`

These properties don't trigger layout or paint — GPU composited.

### Avoid
- Animating `height` (use `transform: scaleY` or `max-height` with overflow)
- Animating `width`
- Animating `margin`, `padding`, `top`, `left`
- Animating `box-shadow` (use pseudo-element with opacity)

### Framer Motion Configuration
```typescript
// Use layout animations for reorder (Framer handles optimally)
<motion.div layout layoutId={bookmark.id} transition={springs.snappy}>

// Use will-change hint for drag overlay
<motion.div style={{ willChange: 'transform' }}>
```

### Folder Expand
```typescript
// Animate height via Framer's layout animation (handles GPU compositing)
<AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    />
  )}
</AnimatePresence>
```

---

## Memory Management

### Large Bookmark Trees
- Flat index map: ~100 bytes per bookmark × 100K = ~10MB
- Fuse.js index: ~200 bytes per entry × 100K = ~20MB
- Total working memory: ~35-45MB for 100K bookmarks

### Optimization for 100K+
- Lazy folder loading: Only load children when expanded
- Paginate deep folder contents (load 100 at a time)
- Dispose Fuse.js index when sidebar closed (rebuild on open)
- Use WeakRef for favicon cache

### Favicon Handling
- Load favicons lazily (IntersectionObserver)
- Cache loaded favicons in memory (Map with LRU eviction)
- Use Google's favicon service URL (no local storage needed)
- Placeholder icon while loading

---

## Network Performance

### Favicon Loading
```typescript
// Lazy load favicons only for visible items
const { ref, inView } = useInView({ triggerOnce: true })
const faviconUrl = inView
  ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  : undefined
```

### No Other Network Requests
- All bookmark data is local (Chrome API)
- All settings are local (Chrome Storage)
- No analytics, no external APIs
- Extension works fully offline

---

## Build Optimization

### Code Splitting
```typescript
// Settings view loaded on demand
const SettingsView = React.lazy(() => import('./features/settings/SettingsView'))

// Import/Export loaded on demand
const ImportDialog = React.lazy(() => import('./features/import-export/ImportDialog'))
```

### Bundle Size Targets
| Chunk | Target |
|-------|--------|
| Side panel (critical) | <150KB gzipped |
| Background worker | <10KB |
| Content fallback | <200KB gzipped |
| Settings (lazy) | <30KB |

### Tree Shaking
- Import only used icons (not full icon libraries)
- Import specific Framer Motion features
- Tailwind purges unused classes

---

## Profiling & Monitoring

### Development Tools
- React DevTools Profiler (identify slow renders)
- Chrome DevTools Performance tab (FPS, layout thrashing)
- Chrome DevTools Memory tab (heap snapshots)
- Lighthouse (overall extension performance)

### Synthetic Benchmarks
```typescript
// Generate large bookmark trees for testing
function generateBookmarks(count: number, depth: number): BookmarkItem[] {
  // Creates realistic tree structure with specified total count and nesting
}
```

### Performance Regression Prevention
- Benchmark tests for search latency
- FPS monitoring in CI (Puppeteer + Chrome DevTools Protocol)
- Bundle size check in build (fail if >200KB gzipped)
