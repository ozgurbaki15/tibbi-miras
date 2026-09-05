'use client'

import Link from 'next/link'
import { Crown, LogIn, LogOut, ShieldCheck, UserRound } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { useEntitlements } from '@/components/entitlements-provider'

export function AccountMenu() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { premium, platin, loading: entitlementLoading } = useEntitlements()

  if (authLoading || entitlementLoading) {
    return <span className="inline-flex h-9 w-32 animate-pulse rounded-full bg-card" aria-label="Hesap yükleniyor" />
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-card px-3 py-2 font-sans text-[10px] uppercase tracking-[0.16em] text-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
      >
        <LogIn className="size-3.5" aria-hidden="true" />
        <span>Giriş / Üyelik</span>
      </Link>
    )
  }

  const tier = platin ? 'PLATİN' : premium ? 'PREMİUM' : 'ÜYE'
  const TierIcon = platin ? ShieldCheck : premium ? Crown : UserRound
  const tierClass = platin
    ? 'border-sky-300/70 bg-sky-300/10 text-sky-200 shadow-[0_0_18px_rgba(125,211,252,0.18)]'
    : premium
      ? 'border-primary/70 bg-primary/10 text-primary shadow-[0_0_18px_rgba(201,168,93,0.18)]'
      : 'border-border bg-card text-foreground'

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/settings"
        title="Hesap ve üyelik ayarları"
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 font-sans text-[10px] uppercase tracking-[0.14em] transition-all hover:brightness-110 ${tierClass}`}
      >
        <TierIcon className="size-3.5" aria-hidden="true" />
        <span className="hidden max-w-32 truncate sm:inline">{user.email ?? 'Hesabım'}</span>
        <span>{tier}</span>
      </Link>
      <button
        type="button"
        onClick={() => void signOut()}
        title="Çıkış yap"
        aria-label="Çıkış yap"
        className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
      >
        <LogOut className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
