import Link from 'next/link'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import type { Category } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const { data, error } = isSupabaseConfigured ? await supabase.from('categories').select('id, name_tr, name_en, parent_id, sort_order, is_adult').order('sort_order', { ascending: true }) : { data: null, error: null }
  const categories = (data ?? []) as Category[]
  return <main className="min-h-svh bg-background"><ArchiveHeader /><ArchiveNavigation /><section className="mx-auto max-w-6xl px-6 py-14"><p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">Archive index</p><h1 className="mb-10 font-serif text-5xl text-foreground">Kategoriler</h1>{error ? <pre className="rounded border border-destructive/40 p-5 font-mono text-xs text-destructive">{error.message}</pre> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <Link key={category.id} href={`/categories/${category.id}`} className="rounded-md border border-border bg-card p-6 transition-colors hover:border-primary/50"><h2 className="font-serif text-2xl text-card-foreground">{category.name_tr || category.name_en}</h2><p className="mt-2 font-sans text-xs uppercase tracking-wider text-muted-foreground">{category.name_en || category.name_tr}</p></Link>)}</div>}</section><SiteFooter /></main>
}
