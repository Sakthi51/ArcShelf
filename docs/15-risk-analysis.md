# Risk Analysis

## Technical Risks

### 1. Side Panel API Availability
- **Risk**: Arc Browser may not fully support Chrome Side Panel API
- **Impact**: High — primary UI delivery mechanism
- **Mitigation**: Content script fallback with Shadow DOM. Test on Arc early.
- **Detection**: Feature detection at runtime (`chrome.sidePanel` existence check)

### 2. Performance with Large Libraries
- **Risk**: Users with 50,000+ bookmarks experience sluggish UI
- **Impact**: Medium — degrades core experience
- **Mitigation**: Virtual scrolling, lazy folder expansion, indexed search, memoization
- **Detection**: Performance profiling with synthetic 100K bookmark trees

### 3. Chrome Extension Content Security Policy
- **Risk**: CSP blocks inline styles, eval, or dynamic code patterns
- **Impact**: Medium — could break Framer Motion or Tailwind runtime
- **Mitigation**: Vite builds everything statically. No eval. Framer Motion works within CSP.
- **Detection**: Test in production build mode early

### 4. Service Worker Lifecycle
- **Risk**: Manifest V3 service workers go idle after 30s, losing state
- **Impact**: Low — we don't hold long-running state in background
- **Mitigation**: All state in panel's Zustand store or chrome.storage. Background is stateless.
- **Detection**: Test after idle period, verify event listeners still fire

### 5. Z-Index Conflicts (Content Script Fallback)
- **Risk**: Injected sidebar clashes with page styles or Arc's own UI
- **Impact**: Medium — visual glitches, overlapping elements
- **Mitigation**: Shadow DOM for style isolation. High z-index. Test on popular sites.
- **Detection**: Visual testing on Top 20 websites

---

## UX Risks

### 6. Keyboard Shortcut Conflicts
- **Risk**: Cmd+Shift+B or Cmd+D already used by Arc/Chrome
- **Impact**: Medium — shortcuts don't work or override browser behavior
- **Mitigation**: Configurable shortcuts. Clear documentation. Chrome Commands API handles priority.
- **Detection**: Test on Arc, Chrome, Edge with default shortcut configs

### 7. Drag & Drop Edge Cases
- **Risk**: Complex drag scenarios (drag outside window, drag during scroll, nested drop)
- **Impact**: Low-Medium — broken drag UX frustrates power users
- **Mitigation**: Use battle-tested dnd-kit library. Comprehensive edge case testing.
- **Detection**: Manual testing matrix of drag scenarios

### 8. Theme Flash on Load
- **Risk**: Brief flash of wrong theme on sidebar open (FOUC)
- **Impact**: Low — feels unpolished
- **Mitigation**: Read theme from storage synchronously before first paint. Inline critical CSS.
- **Detection**: Visual inspection on slow connections

---

## Platform Risks

### 9. Arc Browser Updates
- **Risk**: Arc updates break extension behavior or change sidebar rendering
- **Impact**: Low-Medium — maintenance burden
- **Mitigation**: Minimal Arc-specific code. Standard Chrome Extension APIs. Monitor Arc release notes.
- **Detection**: Test on Arc beta channel

### 10. Chrome Web Store Review
- **Risk**: Extension rejected for permissions or policy violations
- **Impact**: Low — delays distribution
- **Mitigation**: Minimal permissions. Follow all Chrome Web Store policies. No remote code.
- **Detection**: Pre-submission checklist against CWS policies

---

## Data Risks

### 11. Bookmark Data Integrity
- **Risk**: Bug causes accidental deletion or corruption of bookmarks
- **Impact**: Critical — user data loss
- **Mitigation**: 
  - Undo stack for all destructive operations
  - Confirmation dialogs for bulk deletes
  - Never bypass Chrome's native API (which has its own safeguards)
  - Export/backup feature prominently accessible
- **Detection**: Automated tests for all CRUD operations

### 12. Import Failures
- **Risk**: Malformed HTML files cause import to fail or corrupt tree
- **Impact**: Medium — user frustration, potential data issues
- **Mitigation**: Strict parsing with validation. Preview before commit. Atomic import (all-or-nothing). Error reporting with details.
- **Detection**: Test with exports from all major browsers + edge cases

---

## Risk Matrix

| # | Risk | Probability | Impact | Priority |
|---|------|------------|--------|----------|
| 1 | Side Panel API | Low | High | P1 — Test first |
| 11 | Data Integrity | Low | Critical | P1 — Test thoroughly |
| 2 | Large Libraries | Medium | Medium | P2 — Profile early |
| 3 | CSP Issues | Low | Medium | P2 — Verify in build |
| 6 | Shortcut Conflicts | Medium | Medium | P2 — Make configurable |
| 7 | DnD Edge Cases | Medium | Low-Med | P3 — Iterative QA |
| 5 | Z-Index Conflicts | Medium | Medium | P3 — Shadow DOM |
| 4 | SW Lifecycle | Low | Low | P4 — Architecture handles |
| 8 | Theme Flash | Low | Low | P4 — Sync read |
| 9 | Arc Updates | Low | Low-Med | P4 — Standard APIs |
| 10 | CWS Review | Low | Low | P4 — Follow policies |
| 12 | Import Failures | Medium | Medium | P3 — Validate strictly |
