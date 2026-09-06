'use client'

import Link from 'next/link'
import { Beef, CupSoda, Eye, FlaskConical, Gem, Leaf, Pill, ScrollText, Shirt, Sparkles } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import type { Category } from '@/lib/types'

function CategoryMark({ name }: { name: string }) {
  const normalized = name.toLocaleLowerCase('tr-TR')
  const Icon = normalized.includes('bitki') || normalized.includes('gıda') || normalized.includes('food') ? Leaf
    : normalized.includes('et') || normalized.includes('meat') ? Beef
    : normalized.includes('kimya') || normalized.includes('chemical') ? FlaskConical
    : normalized.includes('cevher') || normalized.includes('gem') ? Gem
    : normalized.includes('göz') || normalized.includes('görme') || normalized.includes('eye') ? Eye
    : normalized.includes('şarap') || normalized.includes('şerbet') || normalized.includes('drink') ? CupSoda
    : normalized.includes('ilaç') || normalized.includes('medicine') ? Pill
    : normalized.includes('giysi') || normalized.includes('kürk') || normalized.includes('cloth') ? Shirt
    : normalized.includes('tıp') || normalized.includes('arşiv') || normalized.includes('archive') ? ScrollText
    : Sparkles

  return <Icon aria-hidden="true" className="size-6 text-primary transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
}

export function CategoryIndexGrid({ categories }: { categories: Category[] }) {
  const { lang } = useLanguage()

  return (
    <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const name = lang === 'tr' ? category.name_tr || category.name_en : category.name_en || category.name_tr
        if (!name) return null

        return (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="group relative flex min-h-28 items-center gap-4 overflow-hidden rounded-xl border border-primary/35 bg-card/80 px-6 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-accent/20 hover:shadow-lg hover:shadow-primary/10"
          >
            <span className="pointer-events-none absolute -right-3 -top-5 font-serif text-7xl text-primary/10">✦</span>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background/70">
              <CategoryMark name={name} />
            </span>
            <h2 className="relative text-pretty font-serif text-2xl leading-tight text-card-foreground">{name}</h2>
            <span aria-hidden="true" className="ml-auto text-lg text-primary/60 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        )
      })}
    </div>
  )
}
