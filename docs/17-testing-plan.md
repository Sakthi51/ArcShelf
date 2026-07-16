# Testing Plan

## Testing Layers

### 1. Unit Tests (Vitest)
Critical logic that must be correct regardless of UI:

- **Bookmark utilities**: flatten tree, find ancestors, compute path, validate URLs
- **Search engine**: Fuse.js config, scoring, match highlighting
- **Import parser**: HTML parsing, folder structure extraction, validation
- **Export generator**: Correct HTML output format
- **Undo stack**: Push, pop, clear, expiry logic
- **Selection logic**: Range selection, toggle, select-all, boundary cases
- **Keyboard shortcut registry**: Conflict detection, binding resolution
- **Duplicate detection**: URL matching, threshold logic

### 2. Component Tests (Vitest + React Testing Library)
Interactive components with meaningful behavior:

- **BookmarkItem**: Renders title, favicon, handles click/context-menu
- **FolderItem**: Expand/collapse, renders children, handles drag
- **SearchBar**: Debounce, clear, focus behavior
- **ContextMenu**: Positioning, keyboard navigation, action dispatch
- **Dialog**: Focus trap, Escape close, form submission
- **Toast**: Auto-dismiss, undo action, stacking
- **VirtualList**: Renders only visible items, handles scroll

### 3. Integration Tests (Vitest + Mock Chrome API)
End-to-end flows within the extension:

- **CRUD flow**: Create bookmark → verify in tree → edit → verify → delete → verify
- **Search flow**: Type query → results appear → select → open
- **Drag & drop flow**: Start drag → hover target → drop → verify new position
- **Import flow**: Select file → parse → preview → resolve conflicts → import
- **Undo flow**: Delete → undo → bookmark restored at same position
- **Multi-select flow**: Shift+Click range → bulk delete → undo all
- **Settings flow**: Change theme → verify applied → persist → reload → verify

### 4. E2E Tests (Playwright + Chrome Extension)
Full browser tests with real Chrome APIs:

- Extension loads in Arc/Chrome
- Side panel opens/closes with keyboard shortcut
- Bookmarks load from actual Chrome bookmark tree
- Create, edit, delete bookmarks persists
- Import/export produces valid files
- Theme follows system preference
- Performance within targets for 1000+ bookmarks

---

## Chrome API Mocking

```typescript
// test/mocks/chrome.ts
const mockBookmarks: chrome.bookmarks.BookmarkTreeNode[] = [
  {
    id: '0',
    title: '',
    children: [
      { id: '1', title: 'Bookmarks Bar', parentId: '0', children: [...] },
      { id: '2', title: 'Other Bookmarks', parentId: '0', children: [] },
    ]
  }
]

export const chrome = {
  bookmarks: {
    getTree: vi.fn().mockResolvedValue(mockBookmarks),
    create: vi.fn().mockImplementation(async (data) => ({ id: nanoid(), ...data })),
    update: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
    removeTree: vi.fn().mockResolvedValue(undefined),
    move: vi.fn().mockResolvedValue(undefined),
    search: vi.fn().mockResolvedValue([]),
    onCreated: { addListener: vi.fn() },
    onRemoved: { addListener: vi.fn() },
    onChanged: { addListener: vi.fn() },
    onMoved: { addListener: vi.fn() },
  },
  storage: {
    local: { get: vi.fn(), set: vi.fn() },
    sync: { get: vi.fn(), set: vi.fn() },
  },
  runtime: {
    sendMessage: vi.fn(),
    onMessage: { addListener: vi.fn() },
  },
}
```

---

## Test Data

### Fixture: Small Tree (10 items)
```typescript
const smallTree = generateTree({ folders: 2, bookmarksPerFolder: 3, depth: 2 })
```

### Fixture: Medium Tree (1,000 items)
```typescript
const mediumTree = generateTree({ folders: 50, bookmarksPerFolder: 15, depth: 4 })
```

### Fixture: Large Tree (100,000 items)
```typescript
const largeTree = generateTree({ folders: 2000, bookmarksPerFolder: 40, depth: 6 })
```

### Edge Cases
- Empty tree (no bookmarks at all)
- Single bookmark, no folders
- Deeply nested (20 levels)
- Very long titles (500 chars)
- Unicode titles (emoji, RTL, CJK)
- Invalid URLs
- Duplicate URLs across folders
- Folders with 1000+ direct children

---

## Performance Tests

### Search Latency
```typescript
it('searches 10,000 bookmarks in under 30ms', async () => {
  const store = createSearchStore(largeTree)
  const start = performance.now()
  store.search('react')
  const duration = performance.now() - start
  expect(duration).toBeLessThan(30)
})
```

### Virtual Scroll FPS
```typescript
it('maintains 60fps while scrolling 100,000 items', async () => {
  // Render VirtualList with 100K items
  // Programmatically scroll at high speed
  // Measure frame drops via requestAnimationFrame timing
})
```

### Initial Load
```typescript
it('renders first meaningful paint in under 200ms', async () => {
  const start = performance.now()
  render(<App />)
  await waitFor(() => screen.getByRole('tree'))
  expect(performance.now() - start).toBeLessThan(200)
})
```

---

## Accessibility Tests

### Automated (axe-core)
```typescript
it('has no accessibility violations', async () => {
  const { container } = render(<App />)
  const results = await axeCore.run(container)
  expect(results.violations).toHaveLength(0)
})
```

### Manual Checklist
- [ ] Navigate entire UI with keyboard only
- [ ] Complete all flows with VoiceOver on macOS
- [ ] Verify all ARIA roles and labels
- [ ] Confirm focus management in dialogs
- [ ] Test with prefers-reduced-motion

---

## Browser Compatibility Matrix

| Browser | Version | Side Panel | Content Fallback |
|---------|---------|-----------|-----------------|
| Arc | Latest | Test | N/A |
| Chrome | 116+ | Test | N/A |
| Chrome | 100-115 | N/A | Test |
| Edge | 116+ | Test | N/A |
| Brave | Latest | Test | Test |

---

## CI Pipeline

```yaml
test:
  - lint (ESLint + TypeScript)
  - unit tests (Vitest)
  - component tests (Vitest + JSDOM)
  - bundle size check
  - accessibility audit (axe-core)

manual-qa:
  - E2E flows on Arc
  - E2E flows on Chrome
  - Performance profiling
  - VoiceOver walkthrough
```
