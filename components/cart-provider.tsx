'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useProducts } from '@/components/products-provider'

type CartItem = { id: string; quantity: number }

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotalKurus: number
  add: (id: string, quantity?: number) => void
  setQuantity: (id: string, quantity: number) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'tma-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { getProduct, loading: productsLoading } = useProducts()
  const [items, setItems] = useState<CartItem[]>([])

  const clampQuantity = useCallback(
    (id: string, quantity: number) => {
      const max = getProduct(id)?.maxQuantity ?? 10
      return Math.max(0, Math.min(Math.floor(quantity), max))
    },
    [getProduct],
  )

  // Load persisted cart once on mount. We keep item ids even if products have
  // not loaded yet; totals simply skip unknown ids until data arrives.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as CartItem[]
      const valid = parsed
        .map((item) => ({ id: String(item.id), quantity: Math.max(0, Math.floor(Number(item.quantity) || 0)) }))
        .filter((item) => item.quantity > 0)
      setItems(valid)
    } catch {
      // Ignore malformed cart state.
    }
  }, [])

  // Once products are known, drop any items whose product no longer exists and
  // clamp quantities to each product's max.
  useEffect(() => {
    if (productsLoading) return
    setItems((prev) => {
      const next = prev
        .filter((item) => getProduct(item.id))
        .map((item) => ({ id: item.id, quantity: clampQuantity(item.id, item.quantity) }))
        .filter((item) => item.quantity > 0)
      if (next.length === prev.length && next.every((item, index) => item.id === prev[index]?.id && item.quantity === prev[index]?.quantity)) {
        return prev
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [productsLoading, getProduct, clampQuantity])

  const add = useCallback(
    (id: string, quantity = 1) => {
      if (!getProduct(id)) return
      setItems((prev) => {
        const existing = prev.find((item) => item.id === id)
        const nextQty = clampQuantity(id, (existing?.quantity ?? 0) + quantity)
        const next = existing
          ? prev.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item))
          : [...prev, { id, quantity: nextQty }]
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [getProduct, clampQuantity],
  )

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      const clamped = clampQuantity(id, quantity)
      setItems((prev) => {
        const next = clamped <= 0
          ? prev.filter((item) => item.id !== id)
          : prev.map((item) => (item.id === id ? { ...item, quantity: clamped } : item))
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [clampQuantity],
  )

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setItems([])
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  }, [])

  const { count, subtotalKurus } = useMemo(() => {
    let count = 0
    let subtotalKurus = 0
    for (const item of items) {
      const product = getProduct(item.id)
      if (!product) continue
      count += item.quantity
      subtotalKurus += product.priceKurus * item.quantity
    }
    return { count, subtotalKurus }
  }, [items, getProduct])

  const value = useMemo(
    () => ({ items, count, subtotalKurus, add, setQuantity, remove, clear }),
    [items, count, subtotalKurus, add, setQuantity, remove, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
