# ArcShelf

A beautifully crafted bookmark manager for Arc Browser.
Native sidebar, instant search, effortless organization, and a keyboard-first experience.

---

## ✨ Why ArcShelf?

Arc Browser deserves a bookmark experience that matches its beautiful interface.

ArcShelf brings Chrome's powerful bookmark management into a polished, native-looking sidebar inspired by Arc, macOS, and ChatGPT.

Designed with smooth animations, keyboard-first workflows, and performance in mind, ArcShelf makes organizing thousands of bookmarks effortless.

---

# Features

### 📚 Bookmark Management

- Complete bookmark tree
- Unlimited nested folders
- Drag & Drop organization
- Auto-expand folders while dragging
- Inline rename
- Multi-select (Shift / Cmd)
- Bulk move
- Bulk delete
- Duplicate detection
- Open one or multiple bookmarks
- Open folder contents
- Real website favicons

---

### 🔍 Search

- Instant fuzzy search
- Search bookmarks & folders
- Keyboard navigation
- Search highlighting
- Cmd + Enter → Open in new tab
- Recent searches

---

### 🎨 Beautiful UI

- Native sidebar experience
- Smooth animations
- Glass-inspired design
- Responsive layout
- Beautiful empty states
- Elegant context menus
- macOS-inspired interactions

---

### 🎨 Personalization

- 🌙 Dark Mode
- ☀️ Light Mode
- 💻 System Theme
- 🩶 Gray Theme
- Adjustable text size
- Colored folders
- Sidebar on Left or Right
- Remember last position

---

### 📦 Import & Export

Supports importing and exporting bookmarks using the standard HTML format.

Compatible with:

- Arc
- Google Chrome
- Microsoft Edge
- Brave
- Firefox
- Safari

---

### ⚡ Productivity

- One-click bookmark current page
- Duplicate detection
- Cmd + Click → Open in new tab
- Instant sidebar toggle
- Fully keyboard navigable

---

# ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|-----------|--------|
| `⌘ + Shift + B` | Toggle ArcShelf |
| `/` | Focus search |
| `↑` `↓` | Navigate search results |
| `Enter` | Open bookmark |
| `⌘ + Enter` | Open in new tab |
| `⌘ + Click` | Open bookmark in new tab |
| `Esc` | Close sidebar |

---

# 📷 Screenshots

> Coming soon

| Sidebar | Search | Settings |
|---------|--------|----------|
| ![](docs/sidebar.png) | ![](docs/search.png) | ![](docs/settings.png) |

---

# 🚀 Installation

## Install from GitHub Release (Recommended)

1. Download the latest release from the **Releases** page.
2. Extract the downloaded ZIP file.
3. Open **Arc Browser**.
4. Navigate to:

```
chrome://extensions
```

5. Enable **Developer Mode** (top-right).
6. Click **Load unpacked**.
7. Select the extracted ArcShelf folder.
8. Pin the extension from the Extensions menu.
9. Press **⌘ + Shift + B** to open ArcShelf.

---

## Install from Source

Clone the repository:

```bash
git clone https://github.com/Sakthi51/ArcShelf.git

cd ArcShelf
```

Install dependencies:

```bash
npm install
```

Run development mode:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

The compiled extension will be available in:

```
dist/
```

Load the **dist** folder using **Load unpacked** in `chrome://extensions`.

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Search | Fuse.js |
| Virtualization | TanStack Virtual |
| Animation | Framer Motion |
| Extension | Chrome Manifest V3 |

---

# 📁 Project Structure

```
src/
│
├── app/
│
├── background/
│
├── content/
│
├── components/
│   ├── ui/
│   ├── icons/
│   └── common/
│
├── features/
│   ├── bookmarks/
│   ├── sidebar/
│   ├── search/
│   ├── settings/
│   ├── dialogs/
│   ├── context-menu/
│   ├── import-export/
│   └── keyboard/
│
├── hooks/
│
├── lib/
│
├── services/
│
├── store/
│
├── styles/
│
└── types/
```

---

# 🌐 Browser Support

| Browser | Supported |
|----------|-----------|
| Arc Browser | ✅ |
| Google Chrome | ✅ |
| Microsoft Edge | ✅ |
| Brave Browser | ✅ |
| Chromium Browsers | ✅ |

---

# 🗺 Roadmap

- [ ] Bookmark Tags
- [ ] Smart Collections
- [ ] AI Bookmark Organization
- [ ] Duplicate Finder
- [ ] Broken Link Detection
- [ ] Workspace Support
- [ ] Bookmark Notes
- [ ] Cloud Sync
- [ ] Bookmark Preview Cards
- [ ] Read Later
- [ ] Keyboard Shortcut Customization
- [ ] Bookmark Statistics

---

# 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repository

# Create a feature branch
git checkout -b feature/my-feature

# Commit your changes
git commit -m "Add awesome feature"

# Push your branch
git push origin feature/my-feature

# Open a Pull Request
```

Please ensure new features follow the existing design language and coding standards.

---

# 📄 License

MIT License © 2026 Sakthi51

---

<p align="center">

Built with ❤️ for the Arc community.

</p>
