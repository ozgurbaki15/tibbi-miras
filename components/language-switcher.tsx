'use client'

import { useLanguage } from '@/components/language-provider'
import type { Lang } from '@/lib/types'

const OPTIONS: { key: Lang; label: string }[] = [
  { key: 'tr', label: 'TR' },
  { key: 'en', label: 'EN' },
]

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Dil seçimi / Language"
      className="inline-flex items-center rounded-full border border-border bg-card p-1"
    >
      {OPTIONS.map((option) => {
        const selected = option.key === lang
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => setLang(option.key)}
            aria-pressed={selected}
            className={`rounded-full px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest transition-colors ${
              selected
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
