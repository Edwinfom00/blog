import { useTranslations } from 'next-intl'
import { SectionHead } from '@/components/shared/SectionHead'
import { ArticleCard } from './ArticleCard'
import type { Article, ArticleTag } from '@/db/schema'

interface ArticleWithTags extends Article {
  tags: ArticleTag[]
}

interface LatestSectionProps {
  articles: ArticleWithTags[]
}

export function LatestSection({ articles }: LatestSectionProps) {
  const t = useTranslations('home')

  return (
    <section
      style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '0 32px 80px',
      }}
    >
      <SectionHead
        kicker={t('latest_kicker')}
        title={t('latest')}
        seeAllHref="/journal"
        seeAllLabel={t('all_writing')}
      />

      {/* Grille 4 colonnes — bordures entre les cellules */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid var(--rule)',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        {articles.map((article, i) => (
          <ArticleCard
            key={article.id}
            article={article}
            index={i}
            showBorderRight={i < articles.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
