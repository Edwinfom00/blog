import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface AdjacentArticle {
  slug: string
  titleFr: string
  titleEn: string
  issue: number
}

interface ContinueReadingProps {
  prev: AdjacentArticle | null
  next: AdjacentArticle | null
}

export function ContinueReading({ prev, next }: ContinueReadingProps) {
  const t = useTranslations('article')
  const locale = useLocale() as 'fr' | 'en'

  if (!prev && !next) return null

  return (
    <section style={{ margin: '64px 0 0' }}>
      {/* Règle + label */}
      <div
        style={{
          borderTop: '1px solid var(--rule)',
          paddingTop: 24,
          marginBottom: 32,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}
        >
          {t('continue_reading')}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32 }}>
        {/* Précédent (plus ancien) */}
        <div style={{ flex: 1 }}>
          {prev && (
            <Link href={`/journal/${prev.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  marginBottom: 8,
                }}
              >
                ← {t('prev_article')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  fontWeight: 400,
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                  transition: 'color .15s',
                }}
              >
                {locale === 'fr' ? prev.titleFr : prev.titleEn}
              </span>
            </Link>
          )}
        </div>

        {/* Suivant (plus récent) */}
        <div style={{ flex: 1, textAlign: 'right' }}>
          {next && (
            <Link href={`/journal/${next.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  marginBottom: 8,
                }}
              >
                {t('next_article')} →
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  fontWeight: 400,
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                  transition: 'color .15s',
                }}
              >
                {locale === 'fr' ? next.titleFr : next.titleEn}
              </span>
            </Link>
          )}
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--rule)', marginTop: 32 }} />
    </section>
  )
}
