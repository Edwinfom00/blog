import { getTranslations, getLocale } from 'next-intl/server'
import { getSiteConfig } from '@/lib/settings'

interface MastheadProps {
  latestIssue?: number
}

export async function Masthead({ latestIssue }: MastheadProps) {
  const [locale, config] = await Promise.all([
    getLocale() as Promise<'fr' | 'en'>,
    getSiteConfig(),
  ])
  const t = await getTranslations({ locale, namespace: 'home' })

  const today = new Date()
  const formattedDate = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' }
  ).format(today).toUpperCase()

  const journalLabel = locale === 'fr' ? config.journalLabelFr : config.journalLabelEn

  return (
    <header style={{ paddingTop: 0, paddingBottom: 48, textAlign: 'center' }} className="mt-20">
      <div style={{ borderTop: '3px solid var(--ink)' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--rule)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', color: 'var(--ink-mute)', textAlign: 'left' }}>
          {formattedDate}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
          {journalLabel}
          {latestIssue != null && (
            <> · <span style={{ color: 'var(--accent)' }}>№ {latestIssue}</span></>
          )}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', color: 'var(--ink-mute)', textAlign: 'right' }}>
          {config.location} · {locale.toUpperCase()}
        </span>
      </div>

      <div style={{ padding: '52px 0 20px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 10vw, 148px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.0, color: 'var(--ink)' }}>
          Edwin Fom
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(50px, 9vw, 138px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.0, color: 'var(--ink)' }}>
          <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>&amp;</span>{' '}le Journal
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(15px, 1.6vw, 20px)', color: 'var(--ink-soft)', margin: '0 0 40px', letterSpacing: '.01em' }}>
        {t('kicker')}
      </p>

      <div style={{ borderTop: '1px solid var(--rule)' }} />
    </header>
  )
}
