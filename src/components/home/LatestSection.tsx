import { getTranslations, getLocale } from 'next-intl/server'
import { SectionHead } from '@/components/shared/SectionHead'
import { ArticleCard } from './ArticleCard'
import type { Article, ArticleTag } from '@/db/schema'

interface ArticleWithTags extends Article { tags: ArticleTag[] }

export async function LatestSection({ articles }: { articles: ArticleWithTags[] }) {
  const locale = await getLocale() as 'fr' | 'en'
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-8 pb-16 sm:pb-20">
      <SectionHead
        kicker={t('latest_kicker')}
        title={t('latest')}
        seeAllHref="/journal"
        seeAllLabel={t('all_writing')}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-[var(--rule)]">
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
