'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/components/language-provider'

export function FavoriteButton({
  articleId,
  variant = 'full',
  onChange,
}: {
  articleId: string | number
  variant?: 'full' | 'icon'
  onChange?: (saved: boolean) => void
}) {
  const { user } = useAuth()
  const { lang } = useLanguage()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setSaved(false)
      return
    }
    supabase
      .from('user_favorites')
      .select('article_id')
      .eq('user_id', user.id)
      .eq('article_id', articleId)
      .maybeSingle()
      .then(({ data }) => setSaved(Boolean(data)))
  }, [user, articleId])

  async function toggle(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (!user) {
      window.location.assign('/login')
      return
    }
    setBusy(true)
    const next = !saved
    if (saved) {
      await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('article_id', articleId)
    } else {
      await supabase.from('user_favorites').upsert({ user_id: user.id, article_id: articleId })
    }
    setSaved(next)
    setBusy(false)
    onChange?.(next)
  }

  if (variant === 'icon') {
    const label = saved
      ? lang === 'tr' ? 'Favorilerden çıkar' : 'Remove from favorites'
      : lang === 'tr' ? 'Favorilere ekle' : 'Add to favorites'
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={saved}
        aria-label={label}
        title={label}
        className={`inline-flex size-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors ${saved ? 'border-primary bg-primary/90 text-primary-foreground' : 'border-border bg-background/80 text-muted-foreground hover:border-primary hover:text-primary'}`}
      >
        <Heart className={`size-4 ${saved ? 'fill-current' : ''}`} />
      </button>
    )
  }

  const label = saved
    ? lang === 'tr' ? 'Favorilerde' : 'Saved'
    : lang === 'tr' ? 'Favorilere ekle' : 'Add to favorites'
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-sans text-xs uppercase tracking-wider transition-colors ${saved ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
    >
      <Heart className={`size-4 ${saved ? 'fill-current' : ''}`} />
      {label}
    </button>
  )
}
