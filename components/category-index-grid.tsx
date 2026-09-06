'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import type { Category } from '@/lib/types'

export function CategoryIndexGrid({ categories }: { categories: Category[] }) {
  const { lang } = useLanguage()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const name = lang === 'tr' ? category.name_tr || category.name_en : category.name_en || category.name_tr
        if (!name) return null

        return (
          <Link key={category.id} href={`/categories/${category.id}`} className="rounded-md border border-border bg-card p-6 transition-colors hover:border-primary/50">
            <h2 className="font-serif text-2xl text-card-foreground">{name}</h2>
          </Link>
        )
      })}
    </div>
  )
}
