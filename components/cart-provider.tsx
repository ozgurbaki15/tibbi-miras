'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getShopProduct, SHOP_PRODUCTS } from '@/lib/shop'

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

function clampQuantity(id: string, quantity: number): number {
  const product = getShopProduct(id)
  const max = product?.maxQuantity ?? 10
  return Math.max(0, Math.min(Math.floor(quantity), max))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as CartItem[]
      const valid = parsed
        .filter((item) => getShopProduct(item.id))
        .map((item) => ({ id: item.id, quantity: clampQuantity(item.id, item.quantity) }))
        .filter((item) => item.quantity > 0)
      setItems(valid)
    } catch {
      // Ignore malformed cart state.
    }
  }, [])

  const persist = useCallback((next: CartItem[]) => {
    setItems(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const add = useCallback(
    (id: string, quantity = 1) => {
      if (!getShopProduct(id)) return
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
    [],
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
    [],
  )

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clear = useCallback(() => persist([]), [persist])

  const { count, subtotalKurus } = useMemo(() => {
    let count = 0
    let subtotalKurus = 0
    for (const item of items) {
      const product = getShopProduct(item.id)
      if (!product) continue
      count += item.quantity
      subtotalKurus += product.priceKurus * item.quantity
    }
    return { count, subtotalKurus }
  }, [items])

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

export { SHOP_PRODUCTS }
