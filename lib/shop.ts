export type ShopProduct = {
  id: string
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
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'portakal-kabugu-ucucu-yagi-20ml',
    name: 'Portakal Kabuğu Uçucu Yağı %100 Seyreltilmemiş 20 ML',
    nameEn: 'Orange Peel Essential Oil 100% Undiluted 20 ML',
    description:
      'Soğuk sıkım, %100 saf ve seyreltilmemiş portakal kabuğu uçucu yağı. 20 ml koyu cam damlalıklı şişede. Katkısız, tek bileşenli doğal içerik.',
    descriptionEn:
      'Cold-pressed, 100% pure and undiluted orange peel essential oil. In a 20 ml amber glass dropper bottle. Single-ingredient, additive-free natural content.',
    image: '/products/portakal-kabugu-ucucu-yagi.png',
    priceKurus: 29900,
    maxQuantity: 10,
    inStock: true,
  },
]

export function getShopProduct(id: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((product) => product.id === id)
}

export function shopPriceLabel(priceKurus: number, lang: 'tr' | 'en' = 'tr'): string {
  const value = priceKurus / 100
  const formatted = Number.isInteger(value) ? String(value) : value.toFixed(2)
  return lang === 'tr' ? `${formatted} TL` : `₺${formatted}`
}
