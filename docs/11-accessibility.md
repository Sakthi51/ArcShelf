# Accessibility Checklist

## WCAG 2.1 AA Compliance Target

### Perceivable

- [ ] All images/icons have text alternatives (aria-label or alt)
- [ ] Color is not the only means of conveying information
- [ ] Contrast ratio meets 4.5:1 for normal text, 3:1 for large text
- [ ] Content reflows at 200% zoom without loss of functionality
- [ ] Text can be resized up to 200% without loss of content
- [ ] UI adapts to user's text spacing preferences

### Operable

- [ ] All functionality available via keyboard
- [ ] No keyboard traps (Escape always exits)
- [ ] Focus order follows logical reading sequence
- [ ] Focus indicators visible (2px ring, contrasting color)
- [ ] No time limits on user actions
- [ ] Skip navigation available (jump to bookmark list)
- [ ] Moving content can be paused (prefers-reduced-motion)
- [ ] Drag and drop has keyboard alternative (Move To dialog)

### Understandable

- [ ] Language attribute set on root element
- [ ] Consistent navigation patterns across views
- [ ] Error messages identify the issue and suggest fixes
- [ ] Labels associated with their form controls
- [ ] Instructions do not rely on shape/location/size alone

### Robust

- [ ] Valid semantic HTML
- [ ] ARIA roles, states, and properties used correctly
- [ ] Status messages announced via aria-live regions
- [ ] Custom widgets follow WAI-ARIA authoring practices

---

## ARIA Implementation

### Sidebar Panel
```html
<aside role="complementary" aria-label="Bookmark manager">
```

### Bookmark Tree
```html
<div role="tree" aria-label="Bookmarks">
  <div role="treeitem" aria-expanded="true" aria-level="1">
    Folder
    <div role="group">
      <div role="treeitem" aria-level="2">Bookmark</div>
    </div>
  </div>
</div>
```

### Search
```html
<div role="search">
  <input role="searchbox" aria-label="Search bookmarks"
         aria-controls="search-results"
         aria-activedescendant="result-3">
</div>
<ul role="listbox" id="search-results" aria-label="Search results">
  <li role="option" id="result-3" aria-selected="true">...</li>
</ul>
```

### Context Menu
```html
<div role="menu" aria-label="Bookmark actions">
  <div role="menuitem" tabindex="-1">Open</div>
  <div role="separator"></div>
  <div role="menuitem" tabindex="-1">Delete</div>
</div>
```

### Dialogs
```html
<div role="dialog" aria-modal="true" aria-labelledby="dlg-title">
  <h2 id="dlg-title">Add Bookmark</h2>
  ...
</div>
```

### Live Regions
```html
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- Announce: "Bookmark saved", "3 items selected", "Moved to folder" -->
</div>
```

---

## Focus Management

### Focus Trap Regions
- Dialog (trap until closed)
- Context menu (trap until closed)
- Sidebar (soft trap — Tab cycles within, Cmd+Shift+B exits)

### Focus Restoration
- Dialog close → return focus to trigger element
- Context menu close → return focus to item
- Search clear → return focus to search input
- Sidebar close → return focus to page

### Focus Ring Style
```css
:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

---

## Screen Reader Announcements

| Event | Announcement |
|-------|-------------|
| Bookmark added | "Bookmark [title] saved to [folder]" |
| Bookmark deleted | "Bookmark [title] deleted" |
| Folder expanded | "[folder] expanded, [n] items" |
| Folder collapsed | "[folder] collapsed" |
| Search results | "[n] results for [query]" |
| No results | "No bookmarks found for [query]" |
| Selection change | "[n] items selected" |
| Drag start | "Grabbed [title], use arrow keys to move" |
| Drop | "Moved [title] to [folder]" |
| Undo | "Action undone" |

---

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In JavaScript (Framer Motion):
```typescript
const prefersReducedMotion = useReducedMotion()
const animation = prefersReducedMotion ? { duration: 0 } : springConfig
```

---

## High Contrast Mode

```css
@media (forced-colors: active) {
  .bookmark-item:focus {
    outline: 2px solid Highlight;
  }
  .bookmark-item[aria-selected="true"] {
    background: Highlight;
    color: HighlightText;
  }
}
```

---

## Testing Plan
- [ ] Keyboard-only navigation walkthrough
- [ ] VoiceOver (macOS) full flow test
- [ ] NVDA (Windows) full flow test
- [ ] axe-core automated scan (zero violations)
- [ ] Manual contrast check on all themes
- [ ] Reduced motion verification
- [ ] 200% zoom test
- [ ] Touch target size verification (44x44px minimum)
