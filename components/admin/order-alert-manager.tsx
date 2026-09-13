'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

type Order = { id: string; order_number: string; phone_warning: boolean; address_warning: boolean; created_at: string }

export function OrderAlertManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [message, setMessage] = useState('')

  async function loadOrders() {
    const { data } = await supabase.from('tma_orders').select('id, order_number, phone_warning, address_warning, created_at').order('created_at', { ascending: false }).limit(50)
    setOrders((data as Order[] | null) ?? [])
  }

  useEffect(() => { void loadOrders() }, [])

  async function toggle(order: Order, field: 'phone_warning' | 'address_warning') {
    const { error } = await supabase.from('tma_orders').update({ [field]: !order[field] }).eq('id', order.id)
    if (error) setMessage('Uyarı güncellenemedi. Veri tabanı şemasını ve yönetici yetkisini kontrol edin.')
    else await loadOrders()
  }

  return <section className="mt-6 rounded-md border border-border bg-card p-6"><div className="mb-4 flex items-center gap-2"><AlertTriangle className="size-5 text-primary" aria-hidden="true" /><h2 className="font-serif text-2xl text-card-foreground">Sipariş bilgi uyarıları</h2></div>{orders.length === 0 ? <p className="font-sans text-sm text-muted-foreground">Henüz sipariş kaydı bulunmuyor.</p> : <div className="flex flex-col gap-3">{orders.map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-4"><span className="font-mono text-sm text-card-foreground">{order.order_number}</span><div className="flex flex-wrap gap-2"><button type="button" onClick={() => void toggle(order, 'phone_warning')} className={`rounded-md border px-3 py-2 font-sans text-xs ${order.phone_warning ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border text-muted-foreground'}`}>Telefon yanlış: {order.phone_warning ? 'Açık' : 'Kapalı'}</button><button type="button" onClick={() => void toggle(order, 'address_warning')} className={`rounded-md border px-3 py-2 font-sans text-xs ${order.address_warning ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border text-muted-foreground'}`}>Adres yanlış: {order.address_warning ? 'Açık' : 'Kapalı'}</button></div></div>)}</div>}{message ? <p className="mt-3 font-sans text-xs text-destructive">{message}</p> : null}</section>
}
