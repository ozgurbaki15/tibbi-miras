'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowRight as ReadArrow } from 'lucide-react'
import { UI, useLanguage } from '@/components/language-provider'
import { type Article, articleContent, articleImages, articleTitle, categoryName, excerpt } from '@/lib/types'

export function ArchiveCard({ article }: { article: Article }) {
  const { lang } = useLanguage()
  const t = UI[lang]
  const title = articleTitle(article, lang)
  const category = categoryName(article, lang)
  const images = articleImages(article.image_url)
  const [imageIndex, setImageIndex] = useState(0)
  const image = images[imageIndex]

  return (
    <Link href={`/article/${article.id}`} className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      {image ? <div className="relative aspect-[4/3] overflow-hidden border-b border-border">
        <img src={image} alt={title} crossOrigin="anonymous" className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent" aria-hidden="true" />
        {category ? <span className="absolute left-3 top-3 rounded-full border border-primary/40 bg-background/80 px-3 py-1 font-sans text-[0.7rem] font-medium uppercase tracking-widest text-primary backdrop-blur-sm">{category}</span> : null}
        {images.length > 1 ? <div className="absolute inset-x-3 bottom-3 flex items-center justify-between"><button type="button" aria-label="Önceki görsel" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setImageIndex((index) => (index - 1 + images.length) % images.length) }} className="rounded-full bg-background/80 p-1.5 text-foreground backdrop-blur-sm"><ArrowLeft className="size-3" /></button><span className="rounded-full bg-background/80 px-2 py-1 font-mono text-[10px] text-foreground backdrop-blur-sm">{imageIndex + 1} / {images.length}</span><button type="button" aria-label="Sonraki görsel" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setImageIndex((index) => (index + 1) % images.length) }} className="rounded-full bg-background/80 p-1.5 text-foreground backdrop-blur-sm"><ArrowRight className="size-3" /></button></div> : null}
      </div> : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-pretty font-serif text-2xl font-semibold leading-tight text-card-foreground">{title}</h3>
        <p className="text-pretty text-[0.95rem] leading-relaxed text-muted-foreground">{excerpt(articleContent(article, lang))}</p>
        <div className="mt-auto pt-2"><span className="inline-flex items-center gap-2 font-sans text-sm font-medium uppercase tracking-wider text-primary transition-colors group-hover:text-accent">{t.readMore}<ReadArrow className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span></div>
      </div>
    </Link>
  )
}
