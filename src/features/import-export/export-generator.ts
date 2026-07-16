import type { BookmarkNode } from '@/lib/chrome-api'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDate(ms?: number): string {
  if (!ms) return ''
  return Math.floor(ms / 1000).toString()
}

function renderNode(node: BookmarkNode, indent: number): string {
  const pad = '    '.repeat(indent)

  if (node.url) {
    const dateAttr = node.dateAdded ? ` ADD_DATE="${formatDate(node.dateAdded)}"` : ''
    return `${pad}<DT><A HREF="${escapeHtml(node.url)}"${dateAttr}>${escapeHtml(node.title)}</A>\n`
  }

  let html = ''
  const dateAttr = node.dateAdded ? ` ADD_DATE="${formatDate(node.dateAdded)}"` : ''
  const modAttr = node.dateGroupModified ? ` LAST_MODIFIED="${formatDate(node.dateGroupModified)}"` : ''
  html += `${pad}<DT><H3${dateAttr}${modAttr}>${escapeHtml(node.title)}</H3>\n`
  html += `${pad}<DL><p>\n`
  if (node.children) {
    for (const child of node.children) {
      html += renderNode(child, indent + 1)
    }
  }
  html += `${pad}</DL><p>\n`
  return html
}

export function generateBookmarkHtml(nodes: BookmarkNode[]): string {
  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`

  for (const node of nodes) {
    html += renderNode(node, 1)
  }

  html += `</DL><p>\n`
  return html
}

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
