'use client'

import Link from 'next/link'
import { Lock, ScrollText } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { LinkedArticleText } from '@/components/linked-article-text'
import { UI, useLanguage } from '@/components/language-provider'
import { useAuth } from '@/components/auth-provider'
import { useEntitlements } from '@/components/entitlements-provider'
import { originalTextPreview, type Article, type ArticleTerm } from '@/lib/types'

export function OriginalTextSection({ article, terms = [] }: { article: Article; terms?: ArticleTerm[] }) {
  const { lang } = useLanguage()
  const t = UI[lang]
  const { user } = useAuth()
  const { hasOriginalAccess, loading } = useEntitlements()

  if (!article.original_text) return null

  const unlocked = hasOriginalAccess(article.id)
  const { preview, locked } = originalTextPreview(article.original_text)
  const hasLockedPart = locked.length > 0

  return (
    <section aria-labelledby="original-heading" className="mt-12 rounded-md border border-border bg-card/50 p-6 md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <ScrollText className="size-5 text-primary" />
        <h2 id="original-heading" className="font-serif text-2xl font-semibold text-foreground">{t.originalHeading}</h2>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">{t.originalNote}</p>
        {unlocked ? <CopyButton text={article.original_text} /> : null}
      </div>

      {unlocked || !hasLockedPart ? (
        <LinkedArticleText text={article.original_text} terms={terms} activeArticleId={article.id} className="max-w-none text-pretty font-serif text-lg italic leading-loose text-foreground/85" />
      ) : (
        <div>
          <LinkedArticleText text={preview} terms={terms} activeArticleId={article.id} className="max-w-none text-pretty font-serif text-lg italic leading-loose text-foreground/85" />

          <div className="relative mt-4 overflow-hidden rounded-md border border-primary/30">
            <div className="pointer-events-none select-none px-1 py-3 blur-sm" aria-hidden="true">
              <p className="font-serif text-lg italic leading-loose text-foreground/60">{locked.slice(0, 320)}</p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/85 px-6 text-center">
              <Lock className="mb-2 size-5 text-primary" />
              <h3 className="font-serif text-xl text-foreground">
                {lang === 'tr' ? 'Orijinal metnin devamı kilitli' : 'The rest of the original text is locked'}
              </h3>
              <p className="mt-2 max-w-md text-pretty font-sans text-xs leading-relaxed text-muted-foreground">
                {loading
                  ? (lang === 'tr' ? 'Erişim kontrol ediliyor…' : 'Checking access…')
                  : user
                    ? (lang === 'tr'
                      ? 'Premium veya Platin üyeler tüm orijinal metni okur. Bu eseri mobil uygulamada (reklam ile 24 saat veya ömür boyu) açtıysanız, aynı hesapla burada da görünür.'
                      : 'Premium or Platin members read the full original text. If you unlocked this work in the mobile app (24h via ad or lifetime), it appears here with the same account.')
                    : (lang === 'tr'
                      ? 'Devamını okumak için giriş yapın. Premium/Platin üyeler ve uygulamada bu eseri açan kullanıcılar tümünü görür.'
                      : 'Sign in to continue. Premium/Platin members and users who unlocked this work in the app can see all of it.')}
              </p>
              <Link
                href={user ? '/settings' : '/login'}
                className="mt-4 rounded-md bg-primary px-4 py-2 font-sans text-xs uppercase tracking-wider text-primary-foreground"
              >
                {user
                  ? (lang === 'tr' ? 'Erişim seçenekleri' : 'Access options')
                  : (lang === 'tr' ? 'Giriş yap' : 'Sign in')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
