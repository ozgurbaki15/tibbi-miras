'use client'

import { useEffect, useState } from 'react'
import { Check, ShieldBan, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import { SHOP_ADMIN_EMAIL } from '@/lib/shop'

type PendingComment = { id: string; article_id: string; user_id: string; body: string; created_at: string }

export function CommunityCommerceManager() {
  const { user } = useAuth()
  const isAdmin = user?.email?.trim().toLowerCase() === SHOP_ADMIN_EMAIL.toLowerCase()
  const [comments, setComments] = useState<PendingComment[]>([])
  const [code, setCode] = useState('')
  const [kind, setKind] = useState<'percent' | 'fixed'>('percent')
  const [value, setValue] = useState('10')
  const [message, setMessage] = useState('')

  async function loadComments() {
    const { data } = await supabase.from('tma_article_comments').select('id, article_id, user_id, body, created_at').eq('status', 'pending').order('created_at', { ascending: true })
    setComments((data as PendingComment[] | null) ?? [])
  }

  useEffect(() => { void loadComments() }, [])

  async function moderate(id: string, status: 'approved' | 'rejected') {
    await supabase.from('tma_article_comments').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    await loadComments()
  }

  async function ban(userId: string) {
    await supabase.from('tma_profiles').update({ comment_banned: true, updated_at: new Date().toISOString() }).eq('user_id', userId)
    setMessage('Kullanıcının yorum yazması engellendi.')
  }

  async function createCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = code.trim().toUpperCase()
    const numericValue = Number(value)
    if (!normalized || !Number.isInteger(numericValue) || numericValue <= 0) return
    const { error } = await supabase.from('tma_promo_codes').insert({ code: normalized, kind, value: numericValue, active: true })
    setMessage(error ? 'Kod oluşturulamadı. Kod benzersiz olmalı ve şemayı uygulamış olmalısınız.' : `${normalized} kodu oluşturuldu.`)
    if (!error) setCode('')
  }

  if (!isAdmin) return null

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <section className="rounded-md border border-border bg-card p-6"><h2 className="mb-4 font-serif text-2xl text-card-foreground">Yorum moderasyonu</h2>{comments.length === 0 ? <p className="font-sans text-sm text-muted-foreground">Bekleyen yorum yok.</p> : <div className="flex flex-col gap-4">{comments.map((comment) => <article key={comment.id} className="rounded-md border border-border p-4"><p className="font-sans text-sm text-card-foreground">{comment.body}</p><p className="mt-2 font-mono text-[11px] text-muted-foreground">Makale: {comment.article_id}</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => void moderate(comment.id, 'approved')} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 font-sans text-xs text-primary-foreground"><Check className="size-3.5" /> Onayla</button><button type="button" onClick={() => void moderate(comment.id, 'rejected')} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 font-sans text-xs text-foreground"><X className="size-3.5" /> Reddet</button><button type="button" onClick={() => void ban(comment.user_id)} className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-3 py-2 font-sans text-xs text-destructive"><ShieldBan className="size-3.5" /> Kullanıcıyı banla</button></div></article>)}</div>}</section>
      <section className="rounded-md border border-border bg-card p-6"><h2 className="mb-4 font-serif text-2xl text-card-foreground">İndirim kodu oluştur</h2><form onSubmit={createCode} className="flex flex-col gap-4"><label className="font-sans text-sm text-card-foreground">Kod<input value={code} onChange={(event) => setCode(event.target.value)} required maxLength={40} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 uppercase outline-none focus:border-primary" /></label><label className="font-sans text-sm text-card-foreground">İndirim türü<select value={kind} onChange={(event) => setKind(event.target.value as 'percent' | 'fixed')} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"><option value="percent">Yüzde</option><option value="fixed">Sabit TL</option></select></label><label className="font-sans text-sm text-card-foreground">Değer<input type="number" min="1" step="1" value={value} onChange={(event) => setValue(event.target.value)} required className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary" /></label><button type="submit" className="rounded-md bg-primary px-4 py-3 font-sans text-xs uppercase tracking-wider text-primary-foreground">Kod oluştur</button>{message ? <p className="font-sans text-xs text-muted-foreground">{message}</p> : null}</form></section>
    </div>
  )
}
