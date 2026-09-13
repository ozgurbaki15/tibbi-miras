import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'İptal ve İade Koşulları | Tıbbi Miras Arşivi',
  description: 'Tıbbi Miras Arşivi dijital üyelik iptal, yenileme ve iade koşulları.',
}

const sections: { title: string; paragraphs: string[] }[] = [
  {
    title: '1. Genel',
    paragraphs: [
      'Tıbbi Miras Arşivi üzerinden satın alınan tüm hizmetler dijital içerik ve dijital erişim hakkı niteliğindedir. Aşağıdaki koşullar bu hizmetlerin iptal, yenileme ve iade süreçlerini düzenler.',
    ],
  },
  {
    title: '2. Abonelik İptali',
    paragraphs: [
      'Aylık ve yıllık abonelikler, iptal edilene kadar seçilen dönemde otomatik olarak yenilenir. Aboneliğinizi dilediğiniz zaman iptal edebilirsiniz.',
      'İptal işleminin ardından mevcut ödenmiş dönem sonuna kadar erişiminiz devam eder; dönem sonunda üyelik otomatik olarak sona erer ve yeni bir ücret alınmaz.',
      'İptal talebiniz için hesabınızdan veya freeman3598@gmail.com adresinden bizimle iletişime geçebilirsiniz.',
    ],
  },
  {
    title: '3. İade Koşulları',
    paragraphs: [
      'Dijital içerik hizmetlerinde, hizmetin ifasına (erişimin açılmasına) başlanması ile birlikte kanunen cayma hakkı sona erdiğinden, kullanılmış dönemlere ilişkin iade yapılamaz.',
      'Yanlış işlem, mükerrer (çift) tahsilat veya teknik bir hata nedeniyle erişim sağlanamaması gibi durumlarda, ödeme tarihinden itibaren 14 gün içinde talep etmeniz halinde ilgili tutar iade edilir.',
      'Onaylanan iadeler, ödemenin yapıldığı karta ve ödeme kuruluşunun süreçlerine bağlı olarak makul süre içinde gerçekleştirilir.',
    ],
  },
  {
    title: '4. İletişim',
    paragraphs: [
      'İptal ve iade talepleriniz ile tüm sorularınız için: freeman3598@gmail.com',
    ],
  },
]

export default function RefundPolicyPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
        <Link href="/uyelikler" className="group inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Üyeliklere Dön
        </Link>
        <header className="mt-14 border-b border-border pb-10">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-primary">Tıbbi Miras Arşivi</p>
          <h1 className="mt-5 font-serif text-4xl font-medium leading-tight text-foreground sm:text-5xl">İptal ve İade Koşulları</h1>
        </header>
        <div className="divide-y divide-border">
          {sections.map(({ title, paragraphs }) => (
            <section key={title} className="py-8">
              <h2 className="mb-4 font-serif text-2xl text-primary">{title}</h2>
              <div className="space-y-4 font-sans text-base leading-8 text-foreground/85">
                {paragraphs.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
          ))}
        </div>
        <footer className="border-t border-border pt-8 font-sans text-xs leading-6 text-muted-foreground">Son güncelleme: 2026 · Tıbbi Miras Arşivi</footer>
      </div>
    </main>
  )
}
