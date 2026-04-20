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
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(14px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
        backgroundColor: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '0 32px',
          height: 56,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* ─── Brand ─── */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          {/* Marque EF */}
          <span
            style={{
              width: 30, height: 30,
              borderRadius: '50%',
              background: 'var(--ink)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-ui)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.06em',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            EF
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 16,
                lineHeight: 1.1,
                color: 'var(--ink)',
              }}
            >
              Edwin Fom
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--ink-mute)',
                letterSpacing: '.06em',
              }}
            >
              {t('est')}
            </span>
          </span>
        </Link>

        {/* ─── Liens centraux ─── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
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
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 14,
                fontWeight: 500,
                color: isActive(href) ? 'var(--accent)' : 'var(--ink-soft)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ─── Actions droite ─── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          {/* Recherche ⌘K */}
          <button
            onClick={onCmdKOpen}
            aria-label={t('open_search')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px',
              border: '1px solid var(--rule)',
              borderRadius: 4,
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              color: 'var(--ink-mute)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'border-color .15s, color .15s',
            }}
          >
            <SearchIcon />
            <span style={{ display: 'none' }}>{t('search')}</span>
            <kbd
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                background: 'var(--bg-tint)',
                border: '1px solid var(--rule)',
                borderRadius: 3,
                padding: '1px 4px',
              }}
            >
              ⌘K
            </kbd>
          </button>

          {/* Toggle langue */}
          <button
            onClick={switchLocale}
            aria-label={t('switch_lang')}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '.08em',
              padding: '4px 8px',
              border: '1px solid var(--rule)',
              borderRadius: 4,
              color: 'var(--ink-soft)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background .15s, color .15s',
            }}
          >
            {locale === 'fr' ? 'EN' : 'FR'}
          </button>

          {/* Toggle mode */}
          <button
            onClick={toggleMode}
            aria-label={t('toggle_mode')}
            style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--rule)',
              borderRadius: 4,
              color: 'var(--ink-soft)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background .15s',
            }}
          >
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
