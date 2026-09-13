import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Tıbbi Miras Arşivi',
  description: 'Tıbbi Miras Arşivi dijital üyelik ve içerik erişimi mesafeli satış sözleşmesi.',
}

const sections: { title: string; paragraphs: string[] }[] = [
  {
    title: '1. Taraflar',
    paragraphs: [
      'İşbu Mesafeli Satış Sözleşmesi; bir tarafta hizmeti sunan Tıbbi Miras Arşivi (bundan sonra "SATICI" olarak anılacaktır) ile diğer tarafta web sitesi üzerinden dijital üyelik veya içerik erişimi satın alan kullanıcı (bundan sonra "ALICI" olarak anılacaktır) arasında aşağıdaki koşullarda elektronik ortamda kurulmuştur.',
      'İletişim: freeman3598@gmail.com',
    ],
  },
  {
    title: '2. Sözleşmenin Konusu',
    paragraphs: [
      'İşbu sözleşmenin konusu, ALICI’nın SATICI’ya ait web sitesi üzerinden elektronik ortamda satın aldığı, aşağıda nitelikleri ve satış fiyatı belirtilen dijital hizmetlerin (Premium/Platin üyelikler ve tek eser orijinal metin erişimi) sunulmasına ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.',
      'Satılan hizmetler fiziksel ürün içermez; tamamı dijital içerik ve dijital erişim hakkı niteliğindedir.',
    ],
  },
  {
    title: '3. Hizmet ve Fiyat Bilgileri',
    paragraphs: [
      'Premium Aylık: 99 TL / ay. Premium Yıllık: 499 TL / yıl. Platin Aylık: 149 TL / ay. Platin Yıllık: 799 TL / yıl.',
      'Ömürlük Premium: 2999 TL (tek ödeme). Ömürlük Platin: 3999 TL (tek ödeme). Tek Eser Ömürlük Erişim: 10 TL (tek ödeme).',
      'Tüm fiyatlara KDV dahildir. Abonelikler, ALICI iptal edene kadar seçilen dönemde (aylık/yıllık) otomatik olarak yenilenir.',
    ],
  },
  {
    title: '4. Ödeme ve Teslimat',
    paragraphs: [
      'Ödemeler, anlaşmalı ödeme kuruluşunun güvenli altyapısı üzerinden kredi/banka kartı ile alınır. SATICI, ALICI’nın kart bilgilerini görüntülemez ve saklamaz.',
      'Dijital hizmet, ödemenin onaylanmasının hemen ardından ilgili kullanıcı hesabına tanımlanır. Üyelik veya erişim, aynı hesap ile hem web sitesinde hem de mobil uygulamada geçerlidir.',
    ],
  },
  {
    title: '5. Cayma Hakkı',
    paragraphs: [
      'Mesafeli Sözleşmeler Yönetmeliği uyarınca, elektronik ortamda anında ifa edilen dijital içerik hizmetlerinde, hizmetin ifasına başlanması ile birlikte cayma hakkı sona erer. ALICI, satın alma sırasında bu durumu kabul etmiş sayılır.',
      'Buna rağmen mağduriyet yaşadığınızı düşünüyorsanız freeman3598@gmail.com adresinden bizimle iletişime geçebilirsiniz; talepleriniz İptal ve İade Koşulları çerçevesinde değerlendirilir.',
    ],
  },
  {
    title: '6. Yürürlük',
    paragraphs: [
      'ALICI, işbu sözleşmenin tüm koşullarını ödeme işlemini onaylayarak kabul etmiş sayılır. Sözleşme, satın alma işleminin tamamlanmasıyla yürürlüğe girer.',
    ],
  },
]

export default function DistanceSalesPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
        <Link href="/uyelikler" className="group inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Üyeliklere Dön
        </Link>
        <header className="mt-14 border-b border-border pb-10">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-primary">Tıbbi Miras Arşivi</p>
          <h1 className="mt-5 font-serif text-4xl font-medium leading-tight text-foreground sm:text-5xl">Mesafeli Satış Sözleşmesi</h1>
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
