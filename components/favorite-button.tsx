'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'

export function FavoriteButton({ articleId }: { articleId: string | number }) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (!user || !isSupabaseConfigured) return; supabase.from('favorites').select('article_id').eq('user_id', user.id).eq('article_id', articleId).maybeSingle().then(({ data }) => setSaved(Boolean(data))) }, [user, articleId])
  async function toggle() {
    if (!user) { window.location.assign('/login'); return }
    setBusy(true)
    if (saved) await supabase.from('favorites').delete().eq('user_id', user.id).eq('article_id', articleId)
    else await supabase.from('favorites').insert({ user_id: user.id, article_id: articleId })
    setSaved(!saved); setBusy(false)
  }
  return <button type="button" onClick={toggle} disabled={busy} aria-pressed={saved} className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-sans text-xs uppercase tracking-wider transition-colors ${saved ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}><Heart className={`size-4 ${saved ? 'fill-current' : ''}`} />{saved ? 'Favorilerde' : 'Favorilere ekle'}</button>
}
