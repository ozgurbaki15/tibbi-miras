'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchShopData, type ShopCategory, type ShopProduct } from '@/lib/shop'

type ProductsContextValue = {
  products: ShopProduct[]
  categories: ShopCategory[]
  loading: boolean
  getProduct: (id: string) => ShopProduct | undefined
  refresh: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [categories, setCategories] = useState<ShopCategory[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { products: nextProducts, categories: nextCategories } = await fetchShopData()
    setProducts(nextProducts)
    setCategories(nextCategories)
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true
    fetchShopData()
      .then(({ products: nextProducts, categories: nextCategories }) => {
        if (!active) return
        setProducts(nextProducts)
        setCategories(nextCategories)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const getProduct = useCallback((id: string) => products.find((product) => product.id === id), [products])

  const value = useMemo<ProductsContextValue>(
    () => ({ products, categories, loading, getProduct, refresh }),
    [products, categories, loading, getProduct, refresh],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider')
  return ctx
}
