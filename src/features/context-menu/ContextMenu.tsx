import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export interface MenuItem {
  id: string
  label: string
  shortcut?: string
  icon?: React.ReactNode
  danger?: boolean
  disabled?: boolean
  onClick: () => void
}

export interface MenuSeparator {
  id: string
  type: 'separator'
}

export type MenuEntry = MenuItem | MenuSeparator

interface ContextMenuProps {
  position: { x: number; y: number }
  items: MenuEntry[]
  onClose: () => void
}

export function ContextMenu({ position, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [adjustedPos, setAdjustedPos] = useState(position)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    const rect = menu.getBoundingClientRect()
    let x = position.x
    let y = position.y
    if (rect.right > window.innerWidth) x = window.innerWidth - rect.width - 8
    if (rect.bottom > window.innerHeight) y = window.innerHeight - rect.height - 8
    if (x < 0) x = 8
    if (y < 0) y = 8
    setAdjustedPos({ x, y })
  }, [position])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        e.preventDefault()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex(i => {
          let next = i + 1
          while (next < items.length && 'type' in items[next]) next++
          return next < items.length ? next : i
        })
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex(i => {
          let next = i - 1
          while (next >= 0 && 'type' in items[next]) next--
          return next >= 0 ? next : i
        })
      }
      if (e.key === 'Enter' && focusedIndex >= 0) {
        const item = items[focusedIndex]
        if (item && !('type' in item) && !item.disabled) {
          item.onClick()
          onClose()
        }
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose, items, focusedIndex])

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        role="menu"
        className="fixed z-[2147483647] min-w-[180px] bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-[var(--radius-lg)] p-1 shadow-[var(--shadow-menu)]"
        style={{ left: adjustedPos.x, top: adjustedPos.y }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
        {items.map((entry, i) => {
          if ('type' in entry) {
            return (
              <div
                key={entry.id}
                role="separator"
                className="h-px bg-[var(--color-border-primary)] mx-2 my-1"
              />
            )
          }
          return (
            <div
              key={entry.id}
              role="menuitem"
              className={`
                flex items-center gap-[10px] px-3.5 py-2 text-[13px] rounded-[var(--radius-sm)] cursor-pointer transition-colors duration-75
                ${entry.danger ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-secondary)]'}
                ${i === focusedIndex ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]' : ''}
                ${entry.disabled ? 'opacity-40 cursor-default' : 'hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'}
                ${entry.danger && i === focusedIndex ? '!text-[var(--color-danger)] bg-[var(--color-danger-bg)]' : ''}
              `}
              onClick={() => {
                if (!entry.disabled) {
                  entry.onClick()
                  onClose()
                }
              }}
              onMouseEnter={() => setFocusedIndex(i)}
            >
              {entry.icon && <span className="w-4 h-4 flex items-center justify-center">{entry.icon}</span>}
              <span className="flex-1">{entry.label}</span>
              {entry.shortcut && (
                <span className="ml-auto text-[11px] text-[var(--color-text-tertiary)]">{entry.shortcut}</span>
              )}
            </div>
          )
        })}
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

export function useContextMenuTrigger() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const closeMenu = useCallback(() => setContextMenu(null), [])

  return { contextMenu, handleContextMenu, closeMenu }
}
