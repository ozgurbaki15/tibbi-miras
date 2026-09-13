'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { ArchiveCard } from '@/components/archive-card'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/components/language-provider'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { ARTICLE_COLUMNS, type Article } from '@/lib/types'

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  const { lang } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  const t = lang === 'tr'
    ? {
        eyebrow: 'Kişisel arşiv',
        title: 'Favorilerim',
        loading: 'Favoriler yükleniyor…',
        empty: 'Henüz favori eklemediniz. Bir esere girip kalp simgesine dokunarak favorilerinize ekleyebilirsiniz.',
        loginTitle: 'Favorilerinizi görmek için giriş yapın',
        loginBody: 'Favori eserleriniz hesabınıza kaydedilir ve mobil uygulamayla eşitlenir.',
        loginCta: 'Giriş yap',
        count: (n: number) => `${n} eser`,
      }
    : {
        eyebrow: 'Personal archive',
        title: 'My Favorites',
        loading: 'Loading favorites…',
        empty: 'You have no favorites yet. Open a work and tap the heart icon to save it here.',
        loginTitle: 'Sign in to see your favorites',
        loginBody: 'Your favorite works are saved to your account and sync with the mobile app.',
        loginCta: 'Sign in',
        count: (n: number) => `${n} works`,
      }

  useEffect(() => {
    if (authLoading) return
    if (!user || !isSupabaseConfigured) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    ;(async () => {
      const { data: favRows } = await supabase
        .from('favorites')
        .select('article_id')
        .eq('user_id', user.id)
      const ids = (favRows ?? []).map((row) => row.article_id)
      if (!ids.length) {
        if (active) {
          setArticles([])
          setLoading(false)
        }
        return
      }
      const { data: articleRows } = await supabase
        .from('articles')
        .select(ARTICLE_COLUMNS)
        .in('id', ids)
        .eq('is_published', true)
        .eq('is_hidden', false)
      if (active) {
        setArticles((articleRows ?? []) as unknown as Article[])
        setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [user, authLoading])

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">{t.eyebrow}</p>
        <div className="mb-10 flex items-center gap-3">
          <Heart className="size-8 text-primary" aria-hidden="true" />
          <h1 className="font-serif text-4xl text-foreground md:text-5xl">{t.title}</h1>
        </div>

        {authLoading || loading ? (
          <p className="font-serif text-xl text-muted-foreground">{t.loading}</p>
        ) : !user ? (
          <div className="rounded-md border border-border bg-card px-6 py-10 text-center">
            <h2 className="font-serif text-2xl text-card-foreground">{t.loginTitle}</h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">{t.loginBody}</p>
            <Link href="/login" className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
              {t.loginCta}
            </Link>
          </div>
        ) : articles.length === 0 ? (
          <p className="rounded-md border border-dashed border-border py-16 text-center font-serif text-lg text-muted-foreground">{t.empty}</p>
        ) : (
          <>
            <p className="mb-5 font-sans text-xs uppercase tracking-wider text-muted-foreground">{t.count(articles.length)}</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArchiveCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}
      </section>
      <SiteFooter />
    </main>
  )
}
