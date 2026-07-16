import { useUIStore, type Theme, type SidebarPosition } from '@/store/ui-store'
import { ChevronLeftIcon, SunIcon, MoonIcon, MonitorIcon, GrayIcon, FolderIcon, FOLDER_COLORS } from '@/components/ui/Icons'
import { storage } from '@/lib/chrome-api'
import { useState, useEffect } from 'react'
import { ImportExportButtons } from '@/features/import-export/ImportExportUI'

const themes: { id: Theme; label: string; icon: typeof SunIcon }[] = [
  { id: 'light', label: 'Light', icon: SunIcon },
  { id: 'dark', label: 'Dark', icon: MoonIcon },
  { id: 'gray', label: 'Gray', icon: GrayIcon },
  { id: 'system', label: 'System', icon: MonitorIcon },
]

const textSizes = [
  { id: 's', label: 'S' },
  { id: 'm', label: 'M', isDefault: true },
  { id: 'l', label: 'L' },
]

export function SettingsView() {
  const setView = useUIStore(s => s.setView)
  const theme = useUIStore(s => s.theme)
  const setTheme = useUIStore(s => s.setTheme)
  const animationsEnabled = useUIStore(s => s.animationsEnabled)
  const setAnimations = useUIStore(s => s.setAnimations)
  const sidebarPosition = useUIStore(s => s.sidebarPosition)
  const setSidebarPosition = useUIStore(s => s.setSidebarPosition)
  const [folderColor, setFolderColor] = useState('blue')
  const [textSize, setTextSize] = useState('m')

  useEffect(() => {
    storage.getLocal<string>(['folderColor', 'textSize']).then(r => {
      if (r.folderColor) setFolderColor(r.folderColor)
      if (r.textSize) setTextSize(r.textSize)
    })
  }, [])

  const handleFolderColor = (id: string) => {
    setFolderColor(id)
    storage.setLocal({ folderColor: id })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <button
          onClick={() => setView('tree')}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ChevronLeftIcon size={15} />
        </button>
        <span className="text-[12px] font-medium text-[var(--color-text-primary)]">Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <section className="mb-4">
          <h3 className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1.5 px-1">
            Theme
          </h3>
          <div className="grid grid-cols-4 gap-1 p-0.5">
            {themes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`
                  flex flex-col items-center gap-1 py-2 rounded-[var(--radius-md)] text-[10px] transition-all duration-150
                  ${theme === id
                    ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                  }
                `}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h3 className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1.5 px-1">
            Position
          </h3>
          <div className="flex gap-1 px-1">
            {(['left', 'right'] as SidebarPosition[]).map(pos => (
              <button
                key={pos}
                onClick={() => setSidebarPosition(pos)}
                className={`
                  flex-1 h-[28px] flex items-center justify-center rounded-[var(--radius-md)] text-[11px] font-medium capitalize transition-all duration-150
                  ${sidebarPosition === pos
                    ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                  }
                `}
              >
                {pos}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h3 className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1.5 px-1">
            Text Size
          </h3>
          <div className="flex gap-1 px-1">
            {textSizes.map(({ id, label, isDefault }) => (
              <button
                key={id}
                onClick={() => { setTextSize(id); storage.setLocal({ textSize: id }) }}
                className={`
                  flex-1 h-[28px] flex items-center justify-center gap-1 rounded-[var(--radius-md)] text-[11px] font-medium transition-all duration-150
                  ${textSize === id
                    ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                  }
                `}
              >
                {label}
                {isDefault && <span className="text-[8px] opacity-60">•</span>}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h3 className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1.5 px-1">
            Folder Icon
          </h3>
          <div className="flex gap-1.5 px-1">
            {FOLDER_COLORS.map(({ id, color, label }) => (
              <button
                key={id}
                onClick={() => handleFolderColor(id)}
                title={label}
                className={`
                  w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] transition-all duration-150
                  ${folderColor === id
                    ? 'ring-2 ring-[var(--color-accent)] ring-offset-1 ring-offset-[var(--color-bg-primary)]'
                    : 'hover:bg-[var(--color-bg-hover)]'
                  }
                `}
              >
                <FolderIcon size={20} color={color} />
              </button>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h3 className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1.5 px-1">
            Motion
          </h3>
          <label className="flex items-center justify-between px-2.5 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors">
            <span className="text-[12px] text-[var(--color-text-primary)]">Animations</span>
            <input
              type="checkbox"
              checked={animationsEnabled}
              onChange={e => setAnimations(e.target.checked)}
              className="w-3.5 h-3.5 accent-[var(--color-accent)] rounded"
            />
          </label>
        </section>

        <section className="mb-4">
          <h3 className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1.5 px-1">
            Shortcuts
          </h3>
          <div className="space-y-0">
            <ShortcutRow label="Toggle sidebar" keys={['⌘', '⇧', 'B']} />
            <ShortcutRow label="New bookmark" keys={['⌘', 'D']} />
            <ShortcutRow label="Open in new tab" keys={['⌘', 'Click']} />
            <ShortcutRow label="Search" keys={['/']} />
            <ShortcutRow label="Close" keys={['Esc']} />
          </div>
        </section>

        <section className="mb-4">
          <h3 className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1.5 px-1">
            Data
          </h3>
          <ImportExportButtons />
        </section>

        <div className="px-2 py-1 text-[10px] text-[var(--color-text-tertiary)]">
          ArcShelf v1.0.0
        </div>
      </div>
    </div>
  )
}

function ShortcutRow({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div className="flex items-center justify-between px-2.5 py-1.5">
      <span className="text-[11px] text-[var(--color-text-secondary)]">{label}</span>
      <div className="flex gap-0.5">
        {keys.map((k, i) => (
          <kbd
            key={i}
            className="min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-[3px] bg-[var(--color-bg-hover)] text-[9px] text-[var(--color-text-tertiary)] font-medium border border-[var(--color-border-primary)]"
          >
            {k}
          </kbd>
        ))}
      </div>
    </div>
  )
}
