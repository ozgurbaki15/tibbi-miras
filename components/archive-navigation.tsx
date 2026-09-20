'use client'

import Link from 'next/link'
import { BookOpen, Crown, FolderTree, Heart, Search, Settings, ShoppingBag } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export function ArchiveNavigation() {
  const { lang } = useLanguage()
  const labels = lang === 'tr'
    ? { home: 'Anasayfa', categories: 'Kategoriler', search: 'Arama', favorites: 'Favoriler', memberships: 'Üyelikler', store: 'Mağaza', settings: 'Ayarlar' }
    : { home: 'Home', categories: 'Categories', search: 'Search', favorites: 'Favorites', memberships: 'Memberships', store: 'Store', settings: 'Settings' }

  const items = [
    { href: '/', label: labels.home, icon: BookOpen },
    { href: '/categories', label: labels.categories, icon: FolderTree },
    { href: '/search', label: labels.search, icon: Search },
    { href: '/favorites', label: labels.favorites, icon: Heart },
    { href: '/uyelikler', label: labels.memberships, icon: Crown },
    { href: '/magaza', label: labels.store, icon: ShoppingBag },
    { href: '/settings', label: labels.settings, icon: Settings },
  ]

  return (
    <nav aria-label={lang === 'tr' ? 'Ana navigasyon' : 'Main navigation'} className="legend-nav sticky top-0 z-30 border-b border-primary/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 py-3">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="legend-nav-link inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 font-sans text-xs uppercase tracking-wider text-primary-foreground/75 transition-colors hover:bg-primary/15 hover:text-primary">
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
