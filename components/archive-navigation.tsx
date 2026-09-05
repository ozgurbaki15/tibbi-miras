'use client'

import Link from 'next/link'
import { BookOpen, FolderTree, Heart, Search, Settings } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export function ArchiveNavigation() {
  const { lang } = useLanguage()
  const labels = lang === 'tr'
    ? { home: 'Arşiv', categories: 'Kategoriler', search: 'Arama', favorites: 'Favoriler', settings: 'Ayarlar' }
    : { home: 'Archive', categories: 'Categories', search: 'Search', favorites: 'Favorites', settings: 'Settings' }

  const items = [
    { href: '/', label: labels.home, icon: BookOpen },
    { href: '/categories', label: labels.categories, icon: FolderTree },
    { href: '/search', label: labels.search, icon: Search },
    { href: '/favorites', label: labels.favorites, icon: Heart },
    { href: '/settings', label: labels.settings, icon: Settings },
  ]

  return (
    <nav aria-label={lang === 'tr' ? 'Ana navigasyon' : 'Main navigation'} className="border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 py-3">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 font-sans text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-card hover:text-primary">
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
