'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { termAliases, type ArticleTerm } from '@/lib/types'

export function LinkedArticleText({ text, terms, className = '' }: { text: string; terms: ArticleTerm[]; className?: string }) {
  const aliases = useMemo(() => Array.from(new Map(terms.flatMap((term) => termAliases(term.aliases).map((alias) => [alias.toLocaleLowerCase('tr'), { alias, id: term.article_id }]))).values()).sort((a, b) => b.alias.length - a.alias.length), [terms])
  const pattern = aliases.length ? new RegExp(`(${aliases.map(({ alias }) => alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi') : null

  return <div className={`whitespace-pre-wrap ${className}`}>{text.split(/(\r?\n)/).map((line, lineIndex) => line.match(/\r?\n/) ? <br key={`br-${lineIndex}`} /> : line.split(pattern ?? /(?!)/).map((part, index) => {
    const target = aliases.find(({ alias }) => alias.toLocaleLowerCase('tr') === part.toLocaleLowerCase('tr'))
    return target ? <Link key={`${lineIndex}-${index}`} href={`/article/${target.id}`} className="font-medium text-sky-400 underline decoration-sky-400/40 underline-offset-2 transition-colors hover:text-primary">{part}</Link> : part
  }))}</div>
}
