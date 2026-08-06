import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, EB_Garamond } from 'next/font/google'
import { LanguageProvider } from '@/components/language-provider'
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
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
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
      <body className="font-sans antialiased flex flex-col min-h-screen">
        
        {/* CSS ile Metin Seçme Engeli */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
          `
        }} />

        {/* AdSense Yayıncı Kodu */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4072443907724559"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* JS ile Sağ Tık ve Kopyalama Engeli */}
        <Script id="anti-copy" strategy="afterInteractive">
          {`
            document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
            document.addEventListener('copy', function(e) { e.preventDefault(); });
            document.addEventListener('selectstart', function(e) { e.preventDefault(); });
          `}
        </Script>

        <LanguageProvider>
          {/* İçerik Kısmı */}
          <div className="flex-grow">
            {children}
          </div>

          {/* SİTE ALT BİLGİSİ (FOOTER) - E-POSTA VE PLAY STORE */}
          <footer className="w-full border-t border-border/40 bg-background/95 py-6 mt-12">
            <div className="container max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* İletişim E-postası */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>İletişim: </span>
                <a href="mailto:freeman3598@gmail.com" className="hover:text-primary transition-colors font-medium">
                  freeman3598@gmail.com
                </a>
              </div>

              {/* Google Play Butonu */}
              <div>
                <a
                  href="https://play.google.com/store/apps/details?id=com.freedscience.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 px-4 py-2 rounded-xl transition-all shadow-md"
                >
                  {/* Google Play Logosu */}
                  <svg className="h-6 w-6 text-[#00ff00]" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 leading-none">
                      Google Play'den
                    </span>
                    <span className="text-sm font-bold leading-tight mt-0.5">
                      İndirin
                    </span>
                  </div>
                </a>
              </div>

            </div>
          </footer>
        </LanguageProvider>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
