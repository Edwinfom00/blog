import type { Metadata } from 'next'
import {
  Instrument_Serif,
  Newsreader,
  Inter,
  JetBrains_Mono,
} from 'next/font/google'
import './globals.css'

/* ─── Polices ─── */
const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  display: 'swap',
})

const newsreader = Newsreader({
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s — Edwin Fom',
    default: 'Edwin Fom — Journal',
  },
  description:
    "Journal d'un développeur web. J'écris sur le web, les outils que je construis, et les détails qui comptent.",
  openGraph: {
    siteName: 'Edwin Fom — Journal',
    locale: 'fr_FR',
    type: 'website',
  },
}

/* Script inline exécuté AVANT hydration React pour éviter le flash de thème */
function ThemeScript() {
  const code = `(function(){try{
    var t=localStorage.getItem('ef-theme')||'sanguine';
    var m=localStorage.getItem('ef-mode')||'light';
    document.documentElement.setAttribute('data-theme',t);
    document.documentElement.setAttribute('data-mode',m);
  }catch(e){}})();`

  return <script dangerouslySetInnerHTML={{ __html: code }} />
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const fontVars = [
    instrumentSerif.variable,
    newsreader.variable,
    inter.variable,
    jetbrainsMono.variable,
  ].join(' ')

  return (
    <html
      lang="fr"
      data-theme="sanguine"
      data-mode="light"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={fontVars} suppressHydrationWarning>
        <ThemeScript />
        {children}
      </body>
    </html>
  )
}
