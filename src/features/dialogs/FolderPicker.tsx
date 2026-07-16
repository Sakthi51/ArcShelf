import { useMemo } from 'react'
import { useBookmarkStore } from '@/store/bookmark-store'
import type { BookmarkNode } from '@/lib/chrome-api'

interface Props {
  value: string
  onChange: (id: string) => void
}

interface FolderOption {
  id: string
  label: string
  depth: number
}

function collectFolders(nodes: BookmarkNode[], depth = 0): FolderOption[] {
  const options: FolderOption[] = []
  for (const node of nodes) {
    if (!node.url) {
      options.push({ id: node.id, label: node.title || 'Untitled', depth })
      if (node.children) {
        options.push(...collectFolders(node.children, depth + 1))
      }
    }
  }
  return options
}

export function FolderPicker({ value, onChange }: Props) {
  const tree = useBookmarkStore(s => s.tree)

  const options = useMemo(() => {
    if (!tree[0]?.children) return []
    return collectFolders(tree[0].children)
  }, [tree])

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-9 px-2.5 pr-7 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-sm outline-none appearance-none focus:border-[var(--color-border-focus)] transition-colors"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237a7a7a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
      }}
    >
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>
          {'  '.repeat(opt.depth)}{opt.label}
        </option>
      ))}
    </select>
  )
}
