export type Lang = 'tr' | 'en'

export type Category = {
  id: number | string
  name_tr: string | null
  name_en: string | null
}

export type Article = {
  id: number | string
  title_tr: string | null
  title_en: string | null
  image_url: string | null
  free_content_tr: string | null
  free_content_en: string | null
  original_text: string | null
  premium_content_tr: string | null
  premium_content_en: string | null
  category_id: number | string | null
  is_published: boolean | null
  is_hidden: boolean | null
  /** Populated via the `categories` relation in the select query. */
  categories?: Category | null
}

/** Columns fetched for list + detail views. */
export const ARTICLE_COLUMNS =
  'id, title_tr, title_en, image_url, free_content_tr, free_content_en, original_text, premium_content_tr, premium_content_en, category_id, is_published, is_hidden, categories ( id, name_tr, name_en )'

/** Localized title with a graceful fallback to the other language. */
export function articleTitle(article: Article, lang: Lang): string {
  const primary = lang === 'tr' ? article.title_tr : article.title_en
  const fallback = lang === 'tr' ? article.title_en : article.title_tr
  return primary || fallback || (lang === 'tr' ? 'Başlıksız Eser' : 'Untitled')
}

/** Localized free content with fallback to the other language. */
export function articleContent(article: Article, lang: Lang): string | null {
  const primary = lang === 'tr' ? article.free_content_tr : article.free_content_en
  const fallback = lang === 'tr' ? article.free_content_en : article.free_content_tr
  return primary || fallback || null
}

/** Localized category name. */
export function categoryName(article: Article, lang: Lang): string | null {
  const cat = article.categories
  if (!cat) return null
  return (lang === 'tr' ? cat.name_tr : cat.name_en) || cat.name_tr || cat.name_en || null
}

/** Build a short plain-text excerpt from a longer content field. */
export function excerpt(text: string | null, max = 160): string {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).trimEnd()}…`
}
