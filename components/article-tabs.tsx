'use client'

import { useEffect, useState } from 'react'
import { UI, useLanguage } from '@/components/language-provider'
import type { Article, Lang } from '@/lib/types'

const TABS: { key: Lang; label: string }[] = [
  { key: 'tr', label: 'Türkçe' },
  { key: 'en', label: 'English' },
]

export function ArticleTabs({ article }: { article: Article }) {
  const { lang } = useLanguage()
  const [active, setActive] = useState<Lang>(lang)

  // Follow the global language switcher when it changes.
  useEffect(() => {
    setActive(lang)
  }, [lang])

  const content: Record<Lang, string | null> = {
    tr: article.free_content_tr,
    en: article.free_content_en,
  }
  const body = content[active]

  return (
    <div>
      <div
        role="tablist"
        aria-label="Metin dili / Text language"
        className="flex flex-wrap gap-1 border-b border-border"
      >
        {TABS.map((tab) => {
          const selected = tab.key === active
          return (
            <button
              key={tab.key}
              role="tab"
              type="button"
              id={`tab-${tab.key}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActive(tab.key)}
              className={`-mb-px border-b-2 px-4 py-3 font-sans text-sm font-medium uppercase tracking-wider transition-colors ${
                selected
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="py-8"
      >
        {body ? (
          <div className="max-w-none whitespace-pre-wrap text-pretty font-serif text-lg leading-relaxed text-foreground/90">
            {body}
          </div>
        ) : (
          <p className="font-sans text-sm italic text-muted-foreground">
            {UI[active].emptyContent}
          </p>
        )}
      </div>
    </div>
  )
}
