import { useRef } from 'react'
import { useBookmarkStore } from '@/store/bookmark-store'
import { useToastStore } from '@/store/toast-store'
import { BOOKMARKS_BAR_ID } from '@/lib/constants'
import { parseBookmarkHtml, countItems, type ImportedItem, isFolder } from './import-parser'
import { generateBookmarkHtml, downloadFile } from './export-generator'
import api from '@/lib/chrome-api'

export function ImportExportButtons() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const loadTree = useBookmarkStore(s => s.loadTree)
  const tree = useBookmarkStore(s => s.tree)
  const show = useToastStore(s => s.show)

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const text = await file.text()
    try {
      const parsed = parseBookmarkHtml(text)
      const { bookmarks, folders } = countItems(parsed.children)

      await importItems(parsed.children, BOOKMARKS_BAR_ID)
      await loadTree()
      show(`Imported ${bookmarks} bookmarks, ${folders} folders`)
    } catch {
      show('Import failed — invalid file format')
    }
  }

  const importItems = async (items: ImportedItem[], parentId: string) => {
    for (const item of items) {
      if (isFolder(item)) {
        const folder = await api.create({ parentId, title: item.title })
        if (folder && item.children.length > 0) {
          await importItems(item.children, folder.id)
        }
      } else {
        await api.create({ parentId, title: item.title, url: item.url })
      }
    }
  }

  const handleExport = async () => {
    if (!tree[0]?.children) return
    const bar = tree[0].children.find(c => c.id === BOOKMARKS_BAR_ID)
    if (!bar?.children) return
    const html = generateBookmarkHtml(bar.children)
    downloadFile(html, `bookmarks-${new Date().toISOString().slice(0, 10)}.html`)
    show('Exported bookmarks')
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="space-y-0.5">
        <button
          onClick={handleImport}
          className="flex items-center gap-2 w-full px-2.5 py-2 rounded-[var(--radius-md)] text-[11px] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors text-left"
        >
          Import bookmarks (HTML)
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 w-full px-2.5 py-2 rounded-[var(--radius-md)] text-[11px] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors text-left"
        >
          Export bookmarks (HTML)
        </button>
      </div>
    </>
  )
}
