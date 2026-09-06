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

type CategoryNode = Category & { children: CategoryNode[] }

function buildTree(categories: Category[]) {
  const nodes = new Map(categories.map((category) => [String(category.id), { ...category, children: [] as CategoryNode[] }]))
  const roots: CategoryNode[] = []
  nodes.forEach((node) => {
    if (node.parent_id == null) roots.push(node)
    else nodes.get(String(node.parent_id))?.children.push(node)
  })
  const sort = (items: CategoryNode[]) => {
    items.sort((a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER) || String(a.name_tr || a.name_en || '').localeCompare(String(b.name_tr || b.name_en || ''), 'tr'))
    items.forEach((item) => sort(item.children))
  }
  sort(roots)
  return roots
}

function CategoryCard({ category, child = false }: { category: Category; child?: boolean }) {
  const { lang } = useLanguage()
  const name = lang === 'tr' ? category.name_tr || category.name_en : category.name_en || category.name_tr
  if (!name) return null
  return (
    <Link
      href={`/categories/${category.id}`}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-xl border border-primary/35 bg-card/80 px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-accent/20 hover:shadow-lg hover:shadow-primary/10 ${child ? 'min-h-20' : 'min-h-24'}`}
    >
      <span className="pointer-events-none absolute -right-3 -top-5 font-serif text-7xl text-primary/10">✦</span>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background/70"><CategoryMark name={name} /></span>
      <h2 className={`${child ? 'text-xl' : 'text-2xl'} relative text-pretty font-serif leading-tight text-card-foreground`}>{name}</h2>
      <span aria-hidden="true" className="ml-auto text-lg text-primary/60 transition-transform duration-300 group-hover:translate-x-1">→</span>
    </Link>
  )
}

export function CategoryIndexGrid({ categories }: { categories: Category[] }) {
  const { lang } = useLanguage()
  const tree = buildTree(categories.filter((category) => !category.is_adult && category.id !== 73 && (category.name_tr || category.name_en)))

  return (
    <div className="flex flex-col gap-10">
      {tree.map((parent) => (
        <section key={parent.id} aria-labelledby={`category-${parent.id}`} className="flex flex-col gap-4">
          <h2 id={`category-${parent.id}`} className="border-b border-primary/30 pb-2 font-serif text-3xl text-foreground">{lang === 'tr' ? parent.name_tr || parent.name_en : parent.name_en || parent.name_tr}</h2>
          <CategoryCard category={parent} />
          {parent.children.length > 0 ? <div className="grid items-start gap-4 border-s-2 border-primary/25 ps-4 sm:grid-cols-2 lg:grid-cols-3">{parent.children.map((child) => <CategoryCard key={child.id} category={child} child />)}</div> : null}
        </section>
      ))}
    </div>
  )
}
