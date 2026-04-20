import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className="foot-root">
      <div className="foot-inner">
        {/* ─── Col 1 : identité ─── */}
        <div className="foot-col">
          <div className="foot-title">Edwin Fom</div>
          <p className="foot-desc">{t('colophon')}</p>
        </div>

        {/* ─── Col 2 : liens externes ─── */}
        <div className="foot-col">
          <div className="foot-label">
            {locale === 'fr' ? 'Ailleurs' : 'Elsewhere'}
          </div>
          {[
            { href: 'https://www.edwinfom.dev/', label: 'edwinfom.dev' },
            { href: 'https://packages.edwinfom.dev/', label: 'packages.edwinfom.dev' },
            { href: 'https://github.com/edwinfom', label: 'github.com/edwinfom' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="foot-link"
            >
              {label}
              <ArrowUpRight />
            </a>
          ))}
        </div>

        {/* ─── Col 3 : navigation + copyright ─── */}
        <div className="foot-col">
          <div className="foot-label">№ {year}</div>
          {[
            { href: '/journal', label: tNav('writing') },
            { href: '/projets', label: tNav('projects') },
            { href: '/a-propos', label: tNav('about') },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="foot-link foot-nav-link">
              {label}
            </Link>
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
