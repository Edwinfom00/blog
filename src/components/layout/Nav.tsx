'use client'

import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useTheme } from '@/components/theme/ThemeProvider'

interface NavProps {
  onCmdKOpen: () => void
}

export function Nav({ onCmdKOpen }: NavProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { mode, toggleMode } = useTheme()

  const switchLocale = () => {
    const nextLocale = locale === 'fr' ? 'en' : 'fr'
    router.replace(pathname, { locale: nextLocale })
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <nav className="nav-root">
      <div className="nav-inner">
        {/* ─── Brand ─── */}
        <Link href="/" className="nav-brand">
          <span className="nav-brand-mark">EF</span>
          <span className="nav-brand-text">
            <span className="nav-brand-name">Edwin Fom</span>
            <span className="nav-brand-sub">{t('est')}</span>
          </span>
        </Link>

        {/* ─── Liens centraux ─── */}
        <div className="nav-center">
          {[
            { href: '/journal', label: t('writing') },
            { href: '/projets', label: t('projects') },
            { href: '/a-propos', label: t('about') },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="nav-link"
              data-active={isActive(href) ? 'true' : 'false'}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ─── Actions droite ─── */}
        <div className="nav-right">
          {/* Recherche ⌘K */}
          <button onClick={onCmdKOpen} aria-label={t('open_search')} className="nav-search-btn">
            <SearchIcon />
            <span className="sr-only">{t('search')}</span>
            <kbd className="nav-kbd">⌘K</kbd>
          </button>

          {/* Toggle langue */}
          <button onClick={switchLocale} aria-label={t('switch_lang')} className="nav-pill-btn">
            {locale === 'fr' ? 'EN' : 'FR'}
          </button>

          {/* Toggle mode */}
          <button onClick={toggleMode} aria-label={t('toggle_mode')} className="nav-icon-btn">
            {mode === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </nav>
  )
}

/* ─── Icônes inline (stroke 1.5px, 24px viewBox) ─── */
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
