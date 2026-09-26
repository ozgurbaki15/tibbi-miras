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
    { href: '/#home-content', label: labels.home, icon: BookOpen },
    { href: '/favorites#page-content', label: labels.favorites, icon: Heart },
    { href: '/categories', label: labels.categories, icon: FolderTree },
    { href: '/search', label: labels.search, icon: Search },

    { href: '/uyelikler', label: labels.memberships, icon: Crown },
    { href: '/magaza', label: labels.store, icon: ShoppingBag },
    { href: '/settings', label: labels.settings, icon: Settings },
  ]

  return (
    <nav aria-label={lang === 'tr' ? 'Ana navigasyon' : 'Main navigation'} className="legend-nav sticky top-0 z-30 w-full border-b border-primary/30 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-4 gap-1 px-2 py-2 sm:flex sm:justify-center sm:gap-1 sm:overflow-x-auto sm:px-6 sm:py-3">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} scroll onClick={() => window.setTimeout(() => document.getElementById('page-content')?.scrollIntoView({ block: 'start' }), 250)} className="legend-nav-link inline-flex min-w-0 items-center justify-center gap-1 rounded-md px-1 py-2 text-center font-sans text-[9px] uppercase leading-tight tracking-wide text-primary-foreground/75 transition-colors hover:bg-primary/15 hover:text-primary sm:shrink-0 sm:gap-2 sm:px-3 sm:text-xs sm:tracking-wider">
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
