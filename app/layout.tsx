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
      <head>
        {/* AdSense Kodu (Next.js Formatında) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4072443907724559"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* Metin Seçme Engeli (CSS) */}
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `}} />
        
        {/* Sağ Tık ve Kopyalama Engeli (JS) */}
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
          document.addEventListener('copy', function(e) { e.preventDefault(); });
        `}} />
      </head>
      
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
