'use client'

import { Moon, Palette, ScrollText, Sun } from 'lucide-react'
import { useTheme, type ThemeName } from '@/components/theme-provider'

const themes: { id: ThemeName; label: string; icon: typeof Sun }[] = [
  { id: 'parchment', label: 'Parchment', icon: Sun },
  { id: 'manuscript', label: 'Manuscript', icon: ScrollText },
  { id: 'obsidian', label: 'Obsidian', icon: Moon },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const current = themes.find((item) => item.id === theme) ?? themes[0]
  const Icon = current.icon

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card px-3 py-2 font-sans text-[10px] uppercase tracking-wider text-foreground transition hover:border-primary">
        <Palette className="size-3.5 text-primary" aria-hidden="true" />
        <span className="hidden sm:inline">{current.label}</span>
        <Icon className="size-3.5" aria-hidden="true" />
      </summary>
      <div className="absolute right-0 top-full z-30 mt-2 flex min-w-40 flex-col gap-1 rounded-md border border-border bg-popover p-2 shadow-xl">
        {themes.map(({ id, label, icon: ItemIcon }) => (
          <button key={id} type="button" onClick={() => setTheme(id)} className={`flex items-center gap-2 rounded px-3 py-2 text-left font-sans text-xs transition hover:bg-accent ${theme === id ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'}`}>
            <ItemIcon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </details>
  )
}
