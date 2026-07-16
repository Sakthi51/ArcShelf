export interface ImportedBookmark {
  title: string
  url: string
  dateAdded?: number
}

export interface ImportedFolder {
  title: string
  children: (ImportedBookmark | ImportedFolder)[]
  dateAdded?: number
}

export type ImportedItem = ImportedBookmark | ImportedFolder

export function isFolder(item: ImportedItem): item is ImportedFolder {
  return 'children' in item
}

export function parseBookmarkHtml(html: string): ImportedFolder {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const root: ImportedFolder = { title: 'Imported Bookmarks', children: [] }

  function parseDL(dl: Element): (ImportedBookmark | ImportedFolder)[] {
    const items: (ImportedBookmark | ImportedFolder)[] = []
    const dts = dl.children

    for (let i = 0; i < dts.length; i++) {
      const dt = dts[i]
      if (dt.tagName !== 'DT') continue

      const a = dt.querySelector(':scope > A')
      const h3 = dt.querySelector(':scope > H3')

      if (a) {
        const href = a.getAttribute('HREF') || a.getAttribute('href')
        if (href) {
          const dateStr = a.getAttribute('ADD_DATE') || a.getAttribute('add_date')
          items.push({
            title: a.textContent?.trim() || href,
            url: href,
            dateAdded: dateStr ? parseInt(dateStr, 10) * 1000 : undefined,
          })
        }
      } else if (h3) {
        const folder: ImportedFolder = {
          title: h3.textContent?.trim() || 'Untitled Folder',
          children: [],
          dateAdded: (() => {
            const d = h3.getAttribute('ADD_DATE') || h3.getAttribute('add_date')
            return d ? parseInt(d, 10) * 1000 : undefined
          })(),
        }
        const nextSibling = dt.querySelector(':scope > DL')
        if (nextSibling) {
          folder.children = parseDL(nextSibling)
        }
        items.push(folder)
      }
    }
    return items
  }

  const topDL = doc.querySelector('DL')
  if (topDL) {
    root.children = parseDL(topDL)
  }

  return root
}

export function countItems(items: ImportedItem[]): { bookmarks: number; folders: number } {
  let bookmarks = 0
  let folders = 0
  for (const item of items) {
    if (isFolder(item)) {
      folders++
      const sub = countItems(item.children)
      bookmarks += sub.bookmarks
      folders += sub.folders
    } else {
      bookmarks++
    }
  }
  return { bookmarks, folders }
}

export function detectDuplicates(
  imported: ImportedBookmark[],
  existing: { url: string; title: string }[]
): ImportedBookmark[] {
  const existingUrls = new Set(existing.map(e => e.url.toLowerCase()))
  return imported.filter(item => existingUrls.has(item.url.toLowerCase()))
}
