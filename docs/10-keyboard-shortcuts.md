# Keyboard Shortcut Specification

## Global Shortcuts (Chrome Commands API)

| Shortcut | Action | Context |
|----------|--------|---------|
| Cmd+Shift+B | Toggle sidebar | Any page |
| Cmd+D | Add current page as bookmark | Any page (when sidebar open) |

---

## Sidebar Navigation

| Shortcut | Action | Context |
|----------|--------|---------|
| Arrow Down | Move focus to next item | Bookmark list focused |
| Arrow Up | Move focus to previous item | Bookmark list focused |
| Arrow Right | Expand folder / Enter folder | Folder focused |
| Arrow Left | Collapse folder / Go to parent | Folder focused / Inside folder |
| Home | Focus first item | Bookmark list focused |
| End | Focus last visible item | Bookmark list focused |
| Tab | Move focus to next region | Any |
| Shift+Tab | Move focus to previous region | Any |
| Escape | Clear search / Close menu / Deselect | Various |

---

## Item Actions

| Shortcut | Action | Context |
|----------|--------|---------|
| Enter | Open bookmark / Expand folder | Item focused |
| Cmd+Enter | Open bookmark in new tab | Bookmark focused |
| Shift+Enter | Open bookmark in new window | Bookmark focused |
| Space | Toggle folder expand/collapse | Folder focused |
| F2 | Rename item (inline edit) | Item focused |
| Delete | Delete item(s) | Item(s) selected |
| Backspace | Delete item(s) | Item(s) selected |

---

## Selection

| Shortcut | Action | Context |
|----------|--------|---------|
| Click | Select single item | Bookmark list |
| Shift+Click | Extend selection (range) | Bookmark list |
| Cmd+Click | Toggle item in selection | Bookmark list |
| Cmd+A | Select all visible items | Bookmark list focused |
| Shift+Arrow Down | Extend selection down | Item focused |
| Shift+Arrow Up | Extend selection up | Item focused |
| Escape | Clear selection | Items selected |

---

## Clipboard

| Shortcut | Action | Context |
|----------|--------|---------|
| Cmd+C | Copy selected bookmark(s) | Item(s) selected |
| Cmd+X | Cut selected bookmark(s) | Item(s) selected |
| Cmd+V | Paste bookmark(s) | Folder focused / Any |
| Cmd+D | Duplicate selected | Item(s) selected (when not on page) |

---

## Search

| Shortcut | Action | Context |
|----------|--------|---------|
| / or Cmd+F | Focus search input | Sidebar focused |
| Escape | Clear search, return to tree | Search active |
| Arrow Down | Move to next result | Search results |
| Arrow Up | Move to previous result | Search results |
| Enter | Open selected result | Search result focused |
| Cmd+Enter | Open in new tab | Search result focused |

---

## Undo

| Shortcut | Action | Context |
|----------|--------|---------|
| Cmd+Z | Undo last action | After delete/move/rename |

---

## Sidebar Control

| Shortcut | Action | Context |
|----------|--------|---------|
| Cmd+Shift+B | Close sidebar | Sidebar open |
| Cmd+, | Open settings | Sidebar focused |

---

## Context Menu

| Shortcut | Action | Context |
|----------|--------|---------|
| Right-click | Open context menu | Any item |
| Arrow Down | Next menu item | Menu open |
| Arrow Up | Previous menu item | Menu open |
| Enter | Activate menu item | Menu item focused |
| Escape | Close menu | Menu open |
| Arrow Right | Open sub-menu | Menu item with sub |
| Arrow Left | Close sub-menu | Sub-menu open |

---

## Focus Order
```
1. Search input
2. Bookmark list (items navigable with arrows)
3. Header buttons (Add, Folder, Settings, Close)
```

---

## Conflict Resolution
- Extension shortcuts registered via Chrome Commands API take priority
- If Arc/Chrome already uses a shortcut, provide fallback in settings
- Users can rebind all shortcuts in settings
- Shortcuts only active when sidebar has focus (except global toggles)

---

## Platform Awareness
- macOS: Cmd key
- Windows/Linux: Ctrl key
- All documentation shows both when relevant
- Key display adapts to detected platform
