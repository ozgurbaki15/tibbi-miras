export type Lang = 'tr' | 'en'

export type Category = {
  id: number | string
  name_tr: string | null
  name_en: string | null
  parent_id?: number | string | null
  sort_order?: number | null
  is_adult?: boolean | null
}

export type Article = {
  id: number | string
  title_tr: string | null
  title_en: string | null
  image_url: string | string[] | null
  free_content_tr: string | null
  free_content_en: string | null
  original_text: string | null
  premium_content_tr: string | null
  premium_content_en: string | null
  category_id: number | string | null
  is_published: boolean | null
  is_hidden: boolean | null
  categories?: Category | null
}

export type ArticleTerm = {
  article_id: number | string
  aliases: unknown
}

export const ARTICLE_COLUMNS =
  'id, title_tr, title_en, image_url, free_content_tr, free_content_en, original_text, premium_content_tr, premium_content_en, category_id, is_published, is_hidden, categories ( id, name_tr, name_en )'

export function articleImages(imageValue: string | string[] | null): string[] {
  if (!imageValue) return []
  if (Array.isArray(imageValue)) {
    return Array.from(new Set(imageValue.flatMap((item) => articleImages(item))))
  }

  const value = String(imageValue).trim()
  if (!value) return []
  const candidates: string[] = []
  try {
    const parsed: unknown = JSON.parse(value)
    if (Array.isArray(parsed)) candidates.push(...parsed.filter((item): item is string => typeof item === 'string'))
    if (typeof parsed === 'string') candidates.push(parsed)
  } catch {
    // The Android content also stores multiple URLs as comma-separated text.
  }
  if (!candidates.length) candidates.push(...value.split(/[\r\n]+|\s*\|\s*|\s*,\s*/))

  return Array.from(new Set(candidates.flatMap((candidate) => {
    const clean = candidate.trim().replace(/^['"\[\](){}]+|['"\[\](){}]+$/g, '')
    const matches = clean.match(/https?:\/\/[^\s'"\]})]+/gi)
    return matches?.length ? matches : [clean]
  }).map((url) => url.trim()).filter((url) => /^https?:\/\//i.test(url))))
}

export function articleTitle(article: Article, lang: Lang): string {
  const primary = lang === 'tr' ? article.title_tr : article.title_en
  const fallback = lang === 'tr' ? article.title_en : article.title_tr
  return primary || fallback || (lang === 'tr' ? 'Başlıksız Eser' : 'Untitled')
}

export function articleContent(article: Article, lang: Lang): string | null {
  const primary = lang === 'tr' ? article.free_content_tr : article.free_content_en
  const fallback = lang === 'tr' ? article.free_content_en : article.free_content_tr
  return primary || fallback || null
}

export function categoryName(article: Article, lang: Lang): string | null {
  const cat = article.categories
  if (!cat) return null
  return (lang === 'tr' ? cat.name_tr : cat.name_en) || cat.name_tr || cat.name_en || null
}

export function excerpt(text: string | null, max = 160): string {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, max).trimEnd()}…`
}

export function termAliases(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(termAliases)
  if (typeof value === 'string') {
    const text = value.trim()
    if (!text) return []
    try {
      const parsed = JSON.parse(text)
      if (parsed !== text) return termAliases(parsed)
    } catch {
      // Plain comma-separated or single alias.
    }
    return text.split(/\s*,\s*|\r?\n/).map((item) => item.trim()).filter(Boolean)
  }
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(termAliases)
  }
  return []
}

export function articleTermList(terms: ArticleTerm[]): string[] {
  return Array.from(new Set(terms.flatMap((term) => termAliases(term.aliases)).filter(Boolean)))
    .sort((a, b) => b.length - a.length)
}
