# Extension Architecture (Chrome Manifest V3)

## Manifest V3 Structure

```json
{
  "manifest_version": 3,
  "name": "Arc Bookmark Manager",
  "version": "1.0.0",
  "description": "Premium bookmark management for Arc Browser",
  "permissions": [
    "bookmarks",
    "storage",
    "activeTab",
    "sidePanel",
    "contextMenus"
  ],
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "side_panel": {
    "default_path": "sidepanel.html"
  },
  "action": {
    "default_icon": { "16": "icons/16.png", "32": "icons/32.png", "48": "icons/48.png", "128": "icons/128.png" },
    "default_title": "Open Bookmark Manager"
  },
  "commands": {
    "_execute_action": {
      "suggested_key": { "default": "Ctrl+Shift+B", "mac": "Command+Shift+B" },
      "description": "Toggle bookmark sidebar"
    },
    "add-bookmark": {
      "suggested_key": { "default": "Ctrl+D", "mac": "Command+D" },
      "description": "Bookmark current page"
    }
  },
  "icons": {
    "16": "icons/16.png",
    "32": "icons/32.png",
    "48": "icons/48.png",
    "128": "icons/128.png"
  },
  "options_page": "options.html"
}
```

---

## Component Communication

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Service Worker (background.js)                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  • Registers context menus                       │    │
│  │  • Listens to chrome.bookmarks events            │    │
│  │  • Handles chrome.commands                       │    │
│  │  • Bridges messages between components           │    │
│  │  • Opens/closes side panel                       │    │
│  └─────────────────┬───────────────────────────────┘    │
│                     │ chrome.runtime messaging            │
│           ┌─────────┴─────────┐                          │
│           │                   │                          │
│  ┌────────▼────────┐  ┌──────▼──────────┐              │
│  │  Side Panel     │  │  Content Script  │              │
│  │  (React App)    │  │  (Fallback)      │              │
│  │                 │  │                   │              │
│  │  Primary UI     │  │  Shadow DOM       │              │
│  │  Full features  │  │  Injected sidebar │              │
│  └─────────────────┘  └──────────────────┘              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Side Panel Strategy

### Primary: Chrome Side Panel API
```typescript
// background.ts
chrome.sidePanel.setOptions({
  path: 'sidepanel.html',
  enabled: true
})

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id })
})
```

### Fallback: Content Script Injection
For browsers that don't support `chrome.sidePanel`:
```typescript
// background.ts — fallback detection
if (!chrome.sidePanel) {
  chrome.action.onClicked.addListener(async (tab) => {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content-fallback.js']
    })
  })
}
```

The fallback content script mounts the React app inside a Shadow DOM for style isolation.

---

## Message Protocol

### Panel → Background
```typescript
type PanelMessage =
  | { type: 'BOOKMARK_CREATE', payload: { title: string, url?: string, parentId: string } }
  | { type: 'BOOKMARK_UPDATE', payload: { id: string, changes: { title?: string, url?: string } } }
  | { type: 'BOOKMARK_DELETE', payload: { id: string } }
  | { type: 'BOOKMARK_MOVE', payload: { id: string, destination: { parentId: string, index?: number } } }
  | { type: 'FOLDER_CREATE', payload: { title: string, parentId: string } }
  | { type: 'FOLDER_DELETE', payload: { id: string } }
  | { type: 'TREE_GET', payload: {} }
  | { type: 'TAB_GET_CURRENT', payload: {} }
```

### Background → Panel (Events)
```typescript
type BackgroundEvent =
  | { type: 'BOOKMARK_CREATED', payload: BookmarkTreeNode }
  | { type: 'BOOKMARK_REMOVED', payload: { id: string, parentId: string } }
  | { type: 'BOOKMARK_CHANGED', payload: { id: string, changes: object } }
  | { type: 'BOOKMARK_MOVED', payload: { id: string, oldParentId: string, newParentId: string } }
  | { type: 'CHILDREN_REORDERED', payload: { id: string, childIds: string[] } }
```

---

## Context Menu Registration

```typescript
// background.ts — registered once on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'bookmark-page',
    title: 'Bookmark this page',
    contexts: ['page']
  })
  chrome.contextMenus.create({
    id: 'bookmark-link',
    title: 'Bookmark this link',
    contexts: ['link']
  })
})
```

---

## Build Pipeline (Vite)

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'sidepanel.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        'content-fallback': resolve(__dirname, 'src/content/fallback.ts'),
        options: resolve(__dirname, 'options.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    outDir: 'dist',
    emptyDirFirst: true,
  },
})
```

---

## Development Workflow

1. `npm run dev` — Vite watch mode, outputs to `dist/`
2. Load `dist/` as unpacked extension in Chrome
3. Changes to panel code: auto-reload via Vite HMR
4. Changes to background: manual reload of extension
5. `npm run build` — Production build with minification
6. `npm run zip` — Package for Chrome Web Store

---

## Security Considerations

- No `<all_urls>` host permission (not needed for side panel)
- `activeTab` only for getting current page info on user action
- Content Security Policy: default Manifest V3 (no eval, no remote scripts)
- No external network requests (except favicon URLs via Google's service)
- All bookmark data stays in Chrome's native storage
