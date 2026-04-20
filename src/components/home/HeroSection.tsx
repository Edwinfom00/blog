import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { Article, ArticleTag } from '@/db/schema'

interface HeroArticle extends Article {
  tags: ArticleTag[]
}

interface HeroSectionProps {
  article: HeroArticle
}

export function HeroSection({ article }: HeroSectionProps) {
  const t = useTranslations('home')
  const tArticle = useTranslations('article')
  const locale = useLocale() as 'fr' | 'en'

  const title = locale === 'fr' ? article.titleFr : article.titleEn
  const dek   = locale === 'fr' ? article.dekFr   : article.dekEn

  const formattedDate = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' }
  ).format(new Date(article.date))

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr .9fr',
        gap: 48,
        maxWidth: 1240,
        margin: '0 auto',
        padding: '0 32px 64px',
        alignItems: 'center',
      }}
    >
      {/* ─── Colonne gauche : texte ─── */}
      <div>
        {/* Kicker */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 16,
            margin: '0 0 16px',
          }}
        >
          {t('featured')} · №{article.issue}
        </p>

        {/* Titre */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            lineHeight: 1.06,
            color: 'var(--ink)',
            margin: '0 0 20px',
          }}
        >
          {title}
        </h1>

        {/* Dek */}
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.5,
            color: 'var(--ink-soft)',
            margin: '0 0 32px',
          }}
        >
          {dek}
        </p>

        {/* CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link
            href={`/journal/${article.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--bg)',
              background: 'var(--ink)',
              padding: '10px 20px',
              borderRadius: 3,
              transition: 'background .15s',
              textDecoration: 'none',
            }}
          >
            {t('cta')}
            <ArrowRight />
          </Link>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--ink-mute)',
            }}
          >
            {article.readMin} {tArticle('min_read')} · {formattedDate}
          </span>
        </div>
      </div>

      {/* ─── Colonne droite : figure typographique ─── */}
      <HeroFigure issue={article.issue} />
    </section>
  )
}

function HeroFigure({ issue }: { issue: number }) {
  const COLS = 8
  const ROWS = 6
  const cells = Array.from({ length: COLS * ROWS })

  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '4/5',
        background: 'var(--bg-tint)',
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Grille de cellules */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {cells.map((_, i) => (
          <div
            key={i}
            className="stagger-child"
            style={{
              border: '0.5px solid var(--rule)',
              animationDelay: `${i * 18}ms`,
            }}
          />
        ))}
      </div>

      {/* Numéro géant */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(80px, 15vw, 180px)',
            fontWeight: 400,
            color: 'var(--accent)',
            opacity: 0.18,
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          {issue}
        </span>
      </div>

      {/* Légende mono */}
      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid var(--rule)',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--ink-mute)',
          letterSpacing: '.06em',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>NUMÉRO {issue}</span>
        <span>JOURNAL</span>
      </div>
    </div>
  )
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
