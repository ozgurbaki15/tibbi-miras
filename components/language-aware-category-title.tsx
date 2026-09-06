'use client'

import { useLanguage } from '@/components/language-provider'
import type { Category } from '@/lib/types'

export function LanguageAwareCategoryTitle({ category }: { category: Category }) {
  const { lang } = useLanguage()
  const name = lang === 'tr' ? category.name_tr || category.name_en : category.name_en || category.name_tr
  return <h1 className="mb-3 font-serif text-5xl text-foreground">{name}</h1>
}
