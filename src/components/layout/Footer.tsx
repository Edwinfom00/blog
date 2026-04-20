import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '1px solid var(--rule)',
        padding: '32px 32px 40px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--ink-mute)',
            letterSpacing: '.04em',
            margin: 0,
          }}
        >
          {t('colophon')}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--ink-mute)',
            letterSpacing: '.04em',
          }}
        >
          <Link href="/" style={{ transition: 'color .15s' }}>
            © {year} {t('rights')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
