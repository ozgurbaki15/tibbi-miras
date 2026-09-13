'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, PackageCheck } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppSupport } from '@/components/whatsapp-support'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/components/language-provider'
import { supabase } from '@/lib/supabase/client'

type Order = {
  id: string
  order_number: string
  status: string
  total_kurus: number
  phone_warning: boolean
  address_warning: boolean
  created_at: string
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function loadOrders() {
      if (!user) {
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('tma_orders')
        .select('id, order_number, status, total_kurus, phone_warning, address_warning, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (active) {
        setOrders((data as Order[] | null) ?? [])
        setLoading(false)
      }
    }
    void loadOrders()
    return () => { active = false }
  }, [user])

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">{tr ? 'Hesabım' : 'My account'}</p>
        <h1 className="mb-8 font-serif text-4xl text-foreground md:text-5xl">{tr ? 'Siparişlerim' : 'My orders'}</h1>
        {!authLoading && !user ? (
          <div className="rounded-md border border-border bg-card p-8 text-center">
            <p className="font-sans text-sm text-muted-foreground">{tr ? 'Siparişlerinizi görmek için giriş yapın.' : 'Sign in to view your orders.'}</p>
            <Link href="/login" className="mt-5 inline-flex rounded-md bg-primary px-5 py-3 font-sans text-xs uppercase tracking-wider text-primary-foreground">{tr ? 'Giriş yap' : 'Sign in'}</Link>
          </div>
        ) : loading ? (
          <p className="font-sans text-sm text-muted-foreground">{tr ? 'Siparişler yükleniyor…' : 'Loading orders…'}</p>
        ) : orders.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-8 text-center">
            <PackageCheck className="mx-auto mb-4 size-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-sans text-sm text-muted-foreground">{tr ? 'Henüz siparişiniz bulunmuyor.' : 'You have no orders yet.'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const warnings = order.phone_warning || order.address_warning
              return (
                <article key={order.id} className="rounded-md border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm font-semibold text-card-foreground">{order.order_number}</p>
                      <p className="mt-1 font-sans text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString(tr ? 'tr-TR' : 'en-US')}</p>
                    </div>
                    <p className="font-sans text-sm font-medium text-primary">{(order.total_kurus / 100).toLocaleString(tr ? 'tr-TR' : 'en-US', { style: 'currency', currency: 'TRY' })}</p>
                  </div>
                  {warnings ? (
                    <div className="mt-4 flex flex-col gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-4">
                      <div className="flex items-start gap-2 text-sm text-destructive">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <span className="flex flex-col gap-1">
                          <span>{tr ? 'Sipariş bilgilerinizde düzeltme gerekiyor.' : 'Your order information needs correction.'}</span>
                          {order.phone_warning ? <span>{tr ? 'Telefon numaranız yanlış görünüyor.' : 'Your phone number appears to be incorrect.'}</span> : null}
                          {order.address_warning ? <span>{tr ? 'Teslimat adresiniz yanlış görünüyor.' : 'Your delivery address appears to be incorrect.'}</span> : null}
                        </span>
                      </div>
                      <Link href="/adreslerim" className="text-xs font-medium uppercase tracking-wider text-destructive underline underline-offset-4">{tr ? 'Telefon/adres bilgilerimi değiştir' : 'Change phone/address'}</Link>
                    </div>
                  ) : null}
                </article>
              )
            })}
            <WhatsAppSupport label={tr ? 'Sipariş desteği için WhatsApp' : 'WhatsApp order support'} />
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  )
}
