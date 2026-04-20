import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Article, ArticleTag } from '@/db/schema'

interface HeroArticle extends Article { tags: ArticleTag[] }

export async function HeroSection({ article }: { article: HeroArticle }) {
  const locale = await getLocale() as 'fr' | 'en'
  const t = await getTranslations({ locale, namespace: 'home' })
  const tArticle = await getTranslations({ locale, namespace: 'article' })

  const title = locale === 'fr' ? article.titleFr : article.titleEn
  const dek   = locale === 'fr' ? article.dekFr   : article.dekEn

  const formattedDate = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' }
  ).format(new Date(article.date))

  const COLS = 8, ROWS = 6
  const cells = Array.from({ length: COLS * ROWS })

  return (
    <section className="hero-section">
      {/* ─── Texte ─── */}
      <div className="hero-text">
        <p className="hero-kicker">{t('featured')} · №{article.issue}</p>
        <h1 className="hero-title">{title}</h1>
        <p className="hero-dek">{dek}</p>
        <div className="hero-cta">
          <Link href={`/journal/${article.slug}`} className="hero-btn">
            {t('cta')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <span className="hero-meta">{article.readMin} {tArticle('min_read')} · {formattedDate}</span>
        </div>
      </div>

      {/* ─── Figure ─── */}
      <div className="hero-figure">
        <div className="hero-fig-grid">
          {cells.map((_, i) => (
            <div key={i} className="stagger-child" style={{ border: '0.5px solid var(--rule)', animationDelay: `${i * 18}ms` }} />
          ))}
        </div>
        <div className="hero-fig-number">
          <span>{article.issue}</span>
        </div>
        <div className="hero-fig-caption">
          <span>NUMÉRO {article.issue}</span>
          <span>JOURNAL</span>
        </div>
      </div>
    </section>
  )
}
