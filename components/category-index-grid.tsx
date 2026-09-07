'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Beef, CupSoda, Eye, FlaskConical, Gem, Leaf, Lock, Pill, ScrollText, Shirt, Sparkles } from 'lucide-react'
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
    const parent = node.parent_id == null ? undefined : nodes.get(String(node.parent_id))
    if (parent) parent.children.push(node)
    else roots.push(node)
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

function CategoryTree({ tree }: { tree: CategoryNode[] }) {
  const { lang } = useLanguage()
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

function AdultSection({ tree }: { tree: CategoryNode[] }) {
  const { lang } = useLanguage()
  const [revealed, setRevealed] = useState(false)
  if (!tree.length) return null

  return (
    <section aria-labelledby="adult-heading" className="mt-14 flex flex-col gap-5 rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-destructive/40 bg-background/70"><Lock aria-hidden="true" className="size-5 text-destructive" /></span>
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-destructive">18+</p>
          <h2 id="adult-heading" className="font-serif text-3xl text-foreground">{lang === 'tr' ? 'Yetişkin İçerik' : 'Adult Content'}</h2>
        </div>
      </div>
      <p className="max-w-2xl text-pretty font-sans text-sm leading-relaxed text-muted-foreground">{lang === 'tr' ? 'Bu bölüm yalnızca yetişkinlere yönelik tıbbi içerikler barındırır. Devam etmek için 18 yaşından büyük olduğunuzu onaylayın.' : 'This section contains medical content intended for adults only. Confirm that you are over 18 to continue.'}</p>
      {revealed ? <CategoryTree tree={tree} /> : (
        <button type="button" onClick={() => setRevealed(true)} className="self-start rounded-full border border-destructive/60 bg-background px-5 py-2 font-sans text-xs font-semibold uppercase tracking-wider text-destructive transition hover:bg-destructive hover:text-destructive-foreground">
          {lang === 'tr' ? '18 yaşından büyüğüm, göster' : 'I am over 18, show'}
        </button>
      )}
    </section>
  )
}

export function CategoryIndexGrid({ categories }: { categories: Category[] }) {
  const named = categories.filter((category) => category.id !== 73 && (category.name_tr || category.name_en))
  const tree = buildTree(named.filter((category) => !category.is_adult))
  const adultTree = buildTree(named.filter((category) => category.is_adult))

  return (
    <div className="flex flex-col">
      <CategoryTree tree={tree} />
      <AdultSection tree={adultTree} />
    </div>
  )
}
