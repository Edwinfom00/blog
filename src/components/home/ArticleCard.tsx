'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { StaggerReveal } from '@/components/shared/StaggerReveal'
import type { Article, ArticleTag } from '@/db/schema'

interface ArticleWithTags extends Article { tags: ArticleTag[] }

interface ArticleCardProps {
  article: ArticleWithTags
  index?: number
  showBorderRight?: boolean
}

export function ArticleCard({ article, index = 0, showBorderRight = true }: ArticleCardProps) {
  const locale = useLocale() as 'fr' | 'en'
  const t = useTranslations('article')

  const title = locale === 'fr' ? article.titleFr : article.titleEn
  const dek   = locale === 'fr' ? article.dekFr   : article.dekEn
  const tags  = article.tags.map(tag => locale === 'fr' ? tag.nameFr : tag.nameEn)

  const formattedDate = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' }
  ).format(new Date(article.date))

  return (
    <StaggerReveal delay={index * 70}>
      <Link
        href={`/journal/${article.slug}`}
        className={[
          'group flex flex-col h-full min-h-[260px] p-5 sm:p-6',
          'transition-colors duration-150 hover:bg-[var(--bg-tint)]',
          'border-b border-[var(--rule)] lg:border-b-0',
          showBorderRight ? 'lg:border-r lg:border-[var(--rule)]' : '',
        ].join(' ')}
      >
        {/* Meta */}
        <div className="flex justify-between font-[var(--font-mono)] text-[11px] tracking-[.08em] uppercase text-[var(--ink-mute)] mb-3">
          <span className="text-[var(--accent)]">№ {article.issue}</span>
          <span>{formattedDate}</span>
        </div>

        {/* Titre */}
        <h3 className="font-[var(--font-display)] text-[22px] font-normal tracking-[-0.01em] leading-[1.18] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors duration-150 mb-2">
          {title}
        </h3>

        {/* Dek */}
        <p className="font-[var(--font-display)] italic text-[14px] leading-[1.55] text-[var(--ink-soft)] mb-4 flex-1 line-clamp-4">
          {dek}
        </p>

        {/* Foot */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-[var(--rule-soft)]">
          <div className="flex gap-1.5 flex-wrap">
            {tags.slice(0, 2).map(tag => (
              <span key={tag} className="font-[var(--font-mono)] text-[10px] tracking-[.04em] text-[var(--ink-mute)]">
                #{tag}
              </span>
            ))}
          </div>
          <span className="font-[var(--font-mono)] text-[11px] text-[var(--ink-mute)] group-hover:text-[var(--accent)] transition-colors whitespace-nowrap">
            {article.readMin} {t('min_read')} →
          </span>
        </div>
      </Link>
    </StaggerReveal>
  )
}
