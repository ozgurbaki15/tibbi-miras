import Link from 'next/link'
import { ArrowLeft, BookOpen, ShieldAlert, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Hakkımızda ve Yasal Uyarılar | Tıbbi Miras Arşivi',
  description:
    'Tıbbi Miras Arşivi hakkında bilgi, tıbbi içerik sorumluluk reddi ve gizlilik politikası.',
}

const sections = [
  {
    id: 'hakkimizda',
    eyebrow: '01 / Arşivin Amacı',
    title: 'Hakkımızda',
    icon: BookOpen,
    paragraphs: [
      'Tıbbi Miras Arşivi, bir tıp doktoru tarafından küratörlüğü yapılan, geçmiş medeniyetlerin tıp bilgisini akademik ve erişilebilir bir biçimde belgelemeyi amaçlayan dijital bir kütüphanedir.',
      'Arşiv; El-Kanun fi\'t-Tıbb ve Kenzü\'s-Sıhhati\'l-Ebdâniyye gibi tarihî tıp metinlerini, dönemin kavram dünyasına ve felsefesine sadık kalarak incelemeye sunar. Amacımız bu eserleri yalnızca çevirmek değil, tarihsel bağlamları içinde anlaşılabilir kılmaktır.',
      'Çalışmalarımız üç aşamalı, titiz bir aktarım sürecinden geçer: saf orijinal metin; kadim tıp felsefesine sadık, anlaşılır modern Türkçe; ve aynı düşünsel çerçeveyi koruyan felsefi İngilizce karşılıklar. Bu yöntem, metnin hem özgün sesini hem de kültürel anlamını korumayı hedefler.',
    ],
  },
  {
    id: 'sorumluluk-reddi',
    eyebrow: '02 / Önemli Bilgilendirme',
    title: 'Sorumluluk Reddi',
    icon: ShieldAlert,
    paragraphs: [
      'Bu arşivde yer alan botanik, farmakolojik ve tıbbi içerikler kesinlikle tarihî belge niteliğindedir. Bu metinler, geçmiş dönemlerin tıp anlayışını ve tedavi uygulamalarını incelemek amacıyla sunulmaktadır.',
      'Arşivdeki hiçbir bilgi modern tıbbi tavsiye, teşhis veya tedavi planı teşkil etmez. Buradaki içerikler güncel bilimsel tıp uygulamalarının yerine kullanılamaz; herhangi bir bitki, madde veya uygulama kendi kendine denenmemelidir.',
      'Herhangi bir sağlık sorununuz, hastalığınız veya tedavi ihtiyacınız varsa mutlaka yetkin bir sağlık profesyoneline danışınız. Acil durumlarda yerel acil sağlık hizmetlerine başvurunuz.',
    ],
  },
  {
    id: 'gizlilik',
    eyebrow: '03 / Verileriniz ve Reklamlar',
    title: 'Gizlilik Politikası',
    icon: ShieldCheck,
    paragraphs: [
      'Tıbbi Miras Arşivi, ziyaretçilerimizin gizliliğine saygı duyar. Sitemizi kullanırken tarayıcınız, güvenli ve işlevsel bir deneyim sunmak amacıyla bazı teknik bilgileri ve çerezleri saklayabilir.',
      'Üçüncü taraf sağlayıcılar (Google dahil), kullanıcıların bu web sitesine veya diğer web sitelerine daha önceki ziyaretlerine dayalı reklamlar sunmak için çerezleri kullanabilir. Google\'ın reklam çerezlerini kullanması, kullanıcıların reklam ayarlarını ziyaret ederek devre dışı bırakılabilir. Daha fazla bilgi için Google\'ın reklam ve gizlilik politikalarını inceleyebilirsiniz.',
      'Sitemizi kullanmaya devam ederek bu koşulları ve çerez kullanımını kabul etmiş olursunuz. Bu politika, hizmetlerimiz veya yürürlükteki mevzuat değiştikçe güncellenebilir.',
    ],
  },
]

export default function LegalPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10 sm:py-16">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Arşive Dön
        </Link>

        <header className="mt-16 border-b border-border pb-12 sm:mt-24">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-primary">
            Tıbbi Miras Arşivi
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[0.95] tracking-tight text-foreground sm:text-7xl">
            Hakkımızda ve Yasal Uyarılar
          </h1>
          <p className="mt-7 max-w-2xl font-sans text-base leading-7 text-muted-foreground sm:text-lg">
            Arşivimizin amacı, sorumluluk sınırları ve ziyaretçilerimizin gizliliğine ilişkin bilgilendirme.
          </p>
        </header>

        <div className="divide-y divide-border">
          {sections.map(({ id, eyebrow, title, icon: Icon, paragraphs }) => (
            <section key={id} id={id} className="grid gap-8 py-12 sm:grid-cols-[minmax(150px,0.35fr)_1fr] sm:gap-12 sm:py-16">
              <div>
                <Icon className="size-6 text-primary" strokeWidth={1.25} aria-hidden="true" />
                <p className="mt-5 font-sans text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-3xl text-primary sm:text-4xl">{title}</h2>
              </div>
              <div className="space-y-5 font-sans text-base leading-8 text-foreground/85 sm:text-lg">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="border-t border-border pt-8 font-sans text-xs leading-6 text-muted-foreground">
          Son güncelleme: 2026 · Tıbbi Miras Arşivi
        </footer>
      </div>
    </main>
  )
}
