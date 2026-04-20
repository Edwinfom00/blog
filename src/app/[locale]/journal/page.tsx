import { getTranslations } from 'next-intl/server'
import { getAllArticles } from '@/db/queries'
import { ArticleCard } from '@/components/home/ArticleCard'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'journal' })
  return {
    title: t('title'),
    description: t('desc'),
  }
}

export default async function JournalPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'journal' })
  const articles = await getAllArticles()

  return (
    <div
      style={{
        maxWidth: 980,
        margin: '0 auto',
        padding: '48px 32px 96px',
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: 48, borderBottom: '1px solid var(--rule)', paddingBottom: 24 }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 12,
          }}
        >
          —
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
            color: 'var(--ink)',
            margin: '0 0 12px',
          }}
        >
          {t('title')}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-read)',
            fontStyle: 'italic',
            fontSize: 16,
            color: 'var(--ink-soft)',
            margin: 0,
          }}
        >
          {t('desc')}
        </p>
      </header>

      {articles.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-read)', fontStyle: 'italic', color: 'var(--ink-mute)' }}>
          {t('empty')}
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)',
          }}
        >
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
