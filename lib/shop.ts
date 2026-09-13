import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

// Only this account can manage the store (see Supabase RLS policies).
export const SHOP_ADMIN_EMAIL = 'freeman3598@gmail.com'

export type ShopCategory = {
  id: string
  name: string
  nameEn: string
  sortOrder: number
}

export type ShopProduct = {
  id: string
  categoryId: string | null
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  image: string
  // Price in kuruş (1 TL = 100). VAT-inclusive retail price.
  priceKurus: number
  // Maximum quantity a single order may contain for this product.
  maxQuantity: number
  inStock: boolean
  sortOrder: number
}

type CategoryRow = {
  id: string
  name: string | null
  name_en: string | null
  sort_order: number | null
}

type ProductRow = {
  id: string
  category_id: string | null
  name: string | null
  name_en: string | null
  description: string | null
  description_en: string | null
  image_url: string | null
  price_kurus: number | null
  max_quantity: number | null
  in_stock: boolean | null
  sort_order: number | null
}

export function mapCategory(row: CategoryRow): ShopCategory {
  return {
    id: row.id,
    name: row.name ?? '',
    nameEn: row.name_en ?? '',
    sortOrder: row.sort_order ?? 0,
  }
}

export function mapProduct(row: ProductRow): ShopProduct {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name ?? '',
    nameEn: row.name_en ?? '',
    description: row.description ?? '',
    descriptionEn: row.description_en ?? '',
    image: row.image_url ?? '',
    priceKurus: row.price_kurus ?? 0,
    maxQuantity: row.max_quantity ?? 10,
    inStock: row.in_stock ?? true,
    sortOrder: row.sort_order ?? 0,
  }
}

export async function fetchShopData(): Promise<{ products: ShopProduct[]; categories: ShopCategory[] }> {
  if (!isSupabaseConfigured) return { products: [], categories: [] }

  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from('shop_categories').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
    supabase.from('shop_products').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
  ])

  if (categoriesResult.error) console.log('[v0] shop categories fetch error', categoriesResult.error.message)
  if (productsResult.error) console.log('[v0] shop products fetch error', productsResult.error.message)

  const categories = (categoriesResult.data ?? []).map((row) => mapCategory(row as CategoryRow))
  const products = (productsResult.data ?? []).map((row) => mapProduct(row as ProductRow))
  return { products, categories }
}

export function shopPriceLabel(priceKurus: number, lang: 'tr' | 'en' = 'tr'): string {
  const value = priceKurus / 100
  const formatted = Number.isInteger(value) ? String(value) : value.toFixed(2)
  return lang === 'tr' ? `${formatted} TL` : `₺${formatted}`
}
