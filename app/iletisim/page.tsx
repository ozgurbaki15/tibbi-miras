import Link from 'next/link'
import { ArrowLeft, Mail, Smartphone } from 'lucide-react'

export const metadata = {
  title: 'İletişim | Tıbbi Miras Arşivi',
  description: 'Tıbbi Miras Arşivi ile iletişim bilgileri.',
}

export default function ContactPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
        <Link href="/" className="group inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Arşive Dön
        </Link>
        <header className="mt-14 border-b border-border pb-10">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-primary">Tıbbi Miras Arşivi</p>
          <h1 className="mt-5 font-serif text-4xl font-medium leading-tight text-foreground sm:text-5xl">İletişim</h1>
          <p className="mt-6 max-w-2xl font-sans text-base leading-7 text-muted-foreground">
            Üyelik, ödeme, iptal/iade ve içerik ile ilgili tüm sorularınız için bize ulaşabilirsiniz. Mesajlarınıza en kısa sürede yanıt vermeye çalışıyoruz.
          </p>
        </header>
        <div className="grid gap-4 py-10 sm:grid-cols-2">
          <a href="mailto:freeman3598@gmail.com" className="flex items-center gap-4 rounded-xl border border-border bg-card/70 p-6 transition-colors hover:border-primary">
            <Mail className="size-6 text-primary" aria-hidden="true" />
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">E-posta</p>
              <p className="mt-1 font-serif text-lg text-card-foreground">freeman3598@gmail.com</p>
            </div>
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.freedscience.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl border border-border bg-card/70 p-6 transition-colors hover:border-primary">
            <Smartphone className="size-6 text-primary" aria-hidden="true" />
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">Mobil Uygulama</p>
              <p className="mt-1 font-serif text-lg text-card-foreground">Google Play&apos;de Freed Science</p>
            </div>
          </a>
        </div>
        <footer className="border-t border-border pt-8 font-sans text-xs leading-6 text-muted-foreground">Son güncelleme: 2026 · Tıbbi Miras Arşivi</footer>
      </div>
    </main>
  )
}
