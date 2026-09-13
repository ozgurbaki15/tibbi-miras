'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart-provider'
import { useProducts } from '@/components/products-provider'
import { shopPriceLabel } from '@/lib/shop'

export function CartSidebar() {
  const router = useRouter()
  const { items, count, subtotalKurus, setQuantity, remove } = useCart()
  const { getProduct } = useProducts()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed right-4 top-24 z-40 flex flex-col gap-3">
        <button type="button" onClick={() => setOpen(true)} aria-label="Sepeti aç" className="relative inline-flex size-12 items-center justify-center rounded-full border border-primary/50 bg-card text-primary shadow-lg transition-transform hover:scale-105">
          <ShoppingBag className="size-5" aria-hidden="true" />
          {count > 0 ? <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{count > 99 ? '99+' : count}</span> : null}
        </button>
      </div>
      <div className="fixed bottom-5 right-4 z-40">
        <button type="button" onClick={() => setOpen(true)} aria-label="Sepeti aç" className="relative inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105">
          <ShoppingBag className="size-6" aria-hidden="true" />
          {count > 0 ? <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-primary bg-card text-[10px] font-bold text-foreground">{count > 99 ? '99+' : count}</span> : null}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Sepeti kapat" onClick={() => setOpen(false)} className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]" />
          <aside aria-label="Sepet" className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-serif text-xl text-foreground">Sepetim</h2>
                <p className="font-sans text-xs text-muted-foreground">{count} ürün</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Sepeti kapat" className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center"><ShoppingBag className="size-10 text-muted-foreground" /><p className="font-sans text-sm text-muted-foreground">Sepetiniz boş.</p></div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => {
                    const product = getProduct(item.id)
                    if (!product) return null
                    return <li key={item.id} className="flex gap-3 border-b border-border pb-4">
                      <img src={product.image || '/placeholder.svg'} alt={product.name} className="size-16 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-sm font-semibold text-foreground">{product.name}</p>
                        <p className="mt-1 font-sans text-xs text-muted-foreground">{shopPriceLabel(product.priceKurus)} · {item.quantity} adet</p>
                        <div className="mt-2 flex items-center gap-1">
                          <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Adedi azalt" className="inline-flex size-7 items-center justify-center rounded border border-border"><Minus className="size-3" /></button>
                          <span className="w-7 text-center font-sans text-xs">{item.quantity}</span>
                          <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Adedi artır" className="inline-flex size-7 items-center justify-center rounded border border-border"><Plus className="size-3" /></button>
                          <button type="button" onClick={() => remove(item.id)} aria-label="Ürünü kaldır" className="ml-2 inline-flex size-7 items-center justify-center rounded border border-border text-destructive"><Trash2 className="size-3" /></button>
                        </div>
                      </div>
                    </li>
                  })}
                </ul>
              )}
            </div>
            <footer className="border-t border-border p-5">
              <div className="mb-4 flex items-center justify-between font-sans text-sm"><span className="text-muted-foreground">Ara toplam</span><strong className="text-foreground">{shopPriceLabel(subtotalKurus)}</strong></div>
              <button type="button" disabled={!items.length} onClick={() => { setOpen(false); router.push('/sepet') }} className="w-full rounded-md bg-primary px-4 py-3 font-sans text-sm font-medium uppercase tracking-wider text-primary-foreground disabled:opacity-50">Satın alma ekranına git</button>
            </footer>
          </aside>
        </div>
      ) : null}
    </>
  )
}

