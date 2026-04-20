import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSiteConfig, getAboutSettings } from '@/lib/settings'

export async function Footer() {
  const [locale, config, about] = await Promise.all([
    getLocale() as Promise<'fr' | 'en'>,
    getSiteConfig(),
    getAboutSettings(),
  ])
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const year = new Date().getFullYear()

  return (
    <footer className="foot-root">
      <div className="foot-inner">
        <div className="foot-col">
          <div className="foot-title">Edwin Fom</div>
          <p className="foot-desc">{locale === 'fr' ? config.colophonFr : config.colophonEn}</p>
        </div>

        <div className="foot-col">
          <div className="foot-label">{locale === 'fr' ? 'Ailleurs' : 'Elsewhere'}</div>
          {about.links.map(({ href, label }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="foot-link">
              {label}
              <ArrowUpRight />
            </a>
          ))}
        </div>

        <div className="foot-col">
          <div className="foot-label">№ {year}</div>
          {[
            { href: '/journal', label: tNav('writing') },
            { href: '/projets', label: tNav('projects') },
            { href: '/a-propos', label: tNav('about') },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="foot-link foot-nav-link">{label}</Link>
          ))}
          <div className="foot-issn">ISSN {year}·EDW</div>
        </div>
      </div>
    </footer>
  )
}

function ArrowUpRight() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  )
}
