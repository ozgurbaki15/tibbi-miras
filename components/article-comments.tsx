'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/components/language-provider'
import { supabase } from '@/lib/supabase/client'

type Comment = { id: string; body: string; created_at: string; user_id: string }

export function ArticleComments({ articleId }: { articleId: string }) {
  const { user } = useAuth()
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let active = true
    async function loadComments() {
      const { data } = await supabase.from('tma_article_comments').select('id, body, created_at, user_id').eq('article_id', articleId).eq('status', 'approved').order('created_at', { ascending: false })
      if (active) {
        setComments((data as Comment[] | null) ?? [])
        setLoading(false)
      }
    }
    void loadComments()
    return () => { active = false }
  }, [articleId])

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !body.trim()) return
    setSending(true)
    setMessage('')
    const { error } = await supabase.from('tma_article_comments').insert({ article_id: articleId, user_id: user.id, body: body.trim() })
    setSending(false)
    if (error) {
      setMessage(tr ? 'Yorum gönderilemedi. Yorum yazma yetkiniz olmayabilir.' : 'Comment could not be sent. You may be restricted from commenting.')
      return
    }
    setBody('')
    setMessage(tr ? 'Yorumunuz onaylandıktan sonra görüntülenecektir.' : 'Your comment will be visible after approval.')
  }

  return (
    <section className="mt-12 border-t border-border pt-8" aria-labelledby="comments-title">
      <div className="mb-6 flex items-center gap-3"><MessageSquare className="size-5 text-primary" aria-hidden="true" /><h2 id="comments-title" className="font-serif text-2xl text-foreground">{tr ? 'Yorumlar' : 'Comments'}</h2></div>
      {loading ? <p className="font-sans text-sm text-muted-foreground">{tr ? 'Yorumlar yükleniyor…' : 'Loading comments…'}</p> : comments.length ? <div className="mb-8 flex flex-col gap-3">{comments.map((comment) => <article key={comment.id} className="rounded-md border border-border bg-card p-4"><p className="font-sans text-sm leading-relaxed text-card-foreground">{comment.body}</p><time className="mt-2 block font-sans text-xs text-muted-foreground" dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleDateString(tr ? 'tr-TR' : 'en-US')}</time></article>)}</div> : <p className="mb-8 font-sans text-sm text-muted-foreground">{tr ? 'Henüz onaylanmış yorum yok.' : 'No approved comments yet.'}</p>}
      {user ? <form onSubmit={submitComment} className="flex flex-col gap-3"><label htmlFor="article-comment" className="font-sans text-sm font-medium text-foreground">{tr ? 'Yorumunuz' : 'Your comment'}</label><textarea id="article-comment" value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} rows={4} required className="rounded-md border border-border bg-card px-3 py-3 font-sans text-sm text-foreground outline-none focus:border-primary" placeholder={tr ? 'Bu makale hakkında düşüncelerinizi yazın…' : 'Share your thoughts about this article…'} /><button type="submit" disabled={sending} className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-5 py-3 font-sans text-xs font-medium uppercase tracking-wider text-primary-foreground disabled:opacity-60"><Send className="size-4" aria-hidden="true" />{sending ? (tr ? 'Gönderiliyor…' : 'Sending…') : (tr ? 'Yorum gönder' : 'Send comment')}</button>{message ? <p className="font-sans text-xs text-muted-foreground">{message}</p> : null}</form> : <p className="font-sans text-sm text-muted-foreground">{tr ? 'Yorum yazmak için giriş yapmalısınız.' : 'Sign in to leave a comment.'}</p>}
    </section>
  )
}
