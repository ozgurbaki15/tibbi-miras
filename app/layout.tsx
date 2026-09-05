import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, EB_Garamond } from 'next/font/google'
import { LanguageProvider } from '@/components/language-provider'
import { AuthProvider } from '@/components/auth-provider'
import { EntitlementsProvider } from '@/components/entitlements-provider'
import Script from 'next/script'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-eb-garamond',
})

export const metadata: Metadata = {
  title: 'Tıbbi Miras Arşivi – Digital Library of Medical Heritage',
  description:
    'A curated digital archive of botanical, anatomical, and pharmacological manuscripts from the history of medicine.',
  generator: 'v0.app',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-52-6YjM38w8pce83qql9HmT3vyX2Fy0em.jpg',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-52-6YjM38w8pce83qql9HmT3vyX2Fy0em.jpg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#241f16',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="tr"
      className={`dark bg-background ${cormorant.variable} ${ebGaramond.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4072443907724559"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <AuthProvider>
          <EntitlementsProvider>
            <LanguageProvider>
              <div className="flex-grow">{children}</div>
              <footer className="mt-12 w-full border-t border-border/40 bg-background/95 py-6">
                <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>İletişim:</span>
                    <a href="mailto:freeman3598@gmail.com" className="font-medium transition-colors hover:text-primary">freeman3598@gmail.com</a>
                  </div>
                  <a href="https://play.google.com/store/apps/details?id=com.freedscience.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-white shadow-md transition-all hover:bg-zinc-800">
                    <span className="text-lg text-[#00ff00]" aria-hidden="true">▶</span>
                    <span className="flex flex-col text-left"><span className="text-[10px] uppercase leading-none tracking-wider text-zinc-400">Google Play&apos;den</span><span className="mt-0.5 text-sm font-bold leading-tight">İndirin</span></span>
                  </a>
                </div>
              </footer>
            </LanguageProvider>
          </EntitlementsProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
