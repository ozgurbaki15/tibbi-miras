'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, FolderTree } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import type { Category } from '@/lib/types'

type CategoryNode = Category & { children: CategoryNode[] }

function buildTree(categories: Category[]): CategoryNode[] {
  const nodes = new Map(categories.map((category) => [String(category.id), { ...category, children: [] as CategoryNode[] }]))
  const roots: CategoryNode[] = []
  nodes.forEach((node) => {
    if (node.parent_id == null) roots.push(node)
    else nodes.get(String(node.parent_id))?.children.push(node)
  })
  const sortTree = (items: CategoryNode[]) => {
    items.sort((a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER) || String(a.id).localeCompare(String(b.id)))
    items.forEach((item) => sortTree(item.children))
  }
  sortTree(roots)
  return roots
}

function CategoryBranch({ node, depth = 0 }: { node: CategoryNode; depth?: number }) {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const name = lang === 'tr' ? node.name_tr || node.name_en : node.name_en || node.name_tr
  if (!name) return null
  const hasChildren = node.children.length > 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center rounded-md border border-border bg-card/50 transition-colors hover:border-primary/50 hover:bg-card">
        {hasChildren ? (
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex min-h-14 flex-1 items-center gap-3 p-4 text-left">
            <FolderTree className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="font-serif text-lg text-card-foreground">{name}</span>
            <ChevronDown className={`ml-auto size-5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        ) : (
          <Link href={`/categories/${node.id}`} className="flex min-h-14 flex-1 items-center gap-3 p-4">
            <FolderTree className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="font-serif text-lg text-card-foreground">{name}</span>
          </Link>
        )}
      </div>
      {hasChildren && open ? <div className="flex flex-col gap-2 border-s-2 border-primary/30 ps-4">{node.children.map((child) => <CategoryBranch key={child.id} node={child} depth={depth + 1} />)}</div> : null}
    </div>
  )
}

export function CategorySection({ categories }: { categories: Category[] }) {
  const { lang } = useLanguage()
  const tree = buildTree(categories.filter((category) => category.parent_id == null && !category.is_adult && (category.name_tr || category.name_en)))
  if (!tree.length) return null
  return (
    <section className="mx-auto max-w-6xl px-6 pb-8" aria-labelledby="categories-heading">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div><p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">{lang === 'tr' ? 'Keşfet' : 'Explore'}</p><h2 id="categories-heading" className="font-serif text-3xl font-semibold text-foreground">{lang === 'tr' ? 'Koleksiyonlar' : 'Collections'}</h2></div>
        <Link href="/categories" className="font-sans text-xs uppercase tracking-wider text-primary hover:text-accent">{lang === 'tr' ? 'Tümünü gör' : 'View all'}</Link>
      </div>
      <div className="flex flex-col gap-2">{tree.map((node) => <CategoryBranch key={node.id} node={node} />)}</div>
    </section>
  )
}
