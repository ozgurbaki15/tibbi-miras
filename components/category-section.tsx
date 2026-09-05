'use client'

import Link from 'next/link'
import { ArrowUpRight, FolderTree } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import type { Category } from '@/lib/types'

export function CategorySection({ categories }: { categories: Category[] }) {
  const { lang } = useLanguage()
  const visible = categories.filter((category) => category.name_tr || category.name_en).slice(0, 12)
  if (!visible.length) return null

  return (
    <section className="mx-auto max-w-6xl px-6 pb-6" aria-labelledby="categories-heading">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">{lang === 'tr' ? 'Keşfet' : 'Explore'}</p>
          <h2 id="categories-heading" className="font-serif text-3xl font-semibold text-foreground">{lang === 'tr' ? 'Koleksiyonlar' : 'Collections'}</h2>
        </div>
        <Link href="/categories" className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider text-primary hover:text-accent">{lang === 'tr' ? 'Tümünü gör' : 'View all'} <ArrowUpRight className="size-3" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {visible.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`} className="group flex items-center gap-3 rounded-md border border-border bg-card/50 p-4 transition-colors hover:border-primary/50 hover:bg-card">
            <FolderTree className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="font-serif text-lg text-card-foreground">{lang === 'tr' ? (category.name_tr || category.name_en) : (category.name_en || category.name_tr)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
