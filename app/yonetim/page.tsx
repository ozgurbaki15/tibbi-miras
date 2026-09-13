'use client'

import Link from 'next/link'
import { Loader2, PackageSearch, ShieldAlert } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/components/auth-provider'
import { ProductManager } from '@/components/admin/product-manager'
import { SHOP_ADMIN_EMAIL } from '@/lib/shop'
import { CommunityCommerceManager } from '@/components/admin/community-commerce-manager'
import { OrderAlertManager } from '@/components/admin/order-alert-manager'

export default function YonetimPage() {
  const { user, loading } = useAuth()
  const isAdmin = !!user && user.email?.toLowerCase() === SHOP_ADMIN_EMAIL.toLowerCase()

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-8 flex items-center gap-3">
          <PackageSearch className="size-8 text-primary" aria-hidden="true" />
          <div>
            <p className="mb-1 font-sans text-xs uppercase tracking-[0.25em] text-primary">Yönetim</p>
            <h1 className="font-serif text-4xl text-foreground md:text-5xl">Ürün Yönetimi</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-16 font-sans text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Yükleniyor…
          </div>
        ) : !isAdmin ? (
          <div className="rounded-md border border-border bg-card p-8 text-center">
            <ShieldAlert className="mx-auto mb-4 size-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="font-serif text-xl text-card-foreground">Bu sayfa yalnızca yöneticiye açıktır</h2>
            <p className="mx-auto mt-2 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
              Ürünleri yönetmek için yönetici hesabıyla giriş yapmanız gerekir. Şu an bu hesabın yetkisi yok.
            </p>
            {!user ? (
              <Link href="/login" className="mt-6 inline-flex rounded-md bg-primary px-6 py-3 font-sans text-xs font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
                Giriş yap
              </Link>
            ) : null}
          </div>
        ) : (
          <>
            <p className="mb-8 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
              Buradan yeni ürün ekleyebilir; mevcut ürünlerin fotoğrafını, bilgilerini, fiyatını ve kategorisini değiştirebilirsiniz. Değişiklikler anında mağazada görünür.
            </p>
            <ProductManager />
            <CommunityCommerceManager />
            <OrderAlertManager />
          </>
        )}
      </section>
      <SiteFooter />
    </main>
  )
}
