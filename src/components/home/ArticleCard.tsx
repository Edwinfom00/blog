'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { StaggerReveal } from '@/components/shared/StaggerReveal'
import type { Article, ArticleTag } from '@/db/schema'

interface ArticleWithTags extends Article {
  tags: ArticleTag[]
}

interface ArticleCardProps {
  article: ArticleWithTags
  index?: number
  /** Afficher une bordure droite (entre colonnes) */
  showBorderRight?: boolean
}

export function ArticleCard({ article, index = 0, showBorderRight = true }: ArticleCardProps) {
  const locale = useLocale() as 'fr' | 'en'
  const t = useTranslations('article')
  const [hovered, setHovered] = useState(false)

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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px 20px',
          borderRight: showBorderRight ? '1px solid var(--rule)' : 'none',
          background: hovered ? 'var(--bg-tint)' : 'transparent',
          transition: 'background .15s',
          textDecoration: 'none',
          cursor: 'pointer',
          height: '100%',
          minHeight: 260,
        }}
      >
        {/* Meta row : №XX — date */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            marginBottom: 14,
          }}
        >
          <span style={{ color: 'var(--accent)' }}>№ {article.issue}</span>
          <span>{formattedDate}</span>
        </div>

        {/* Titre */}
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            lineHeight: 1.18,
            color: hovered ? 'var(--accent)' : 'var(--ink)',
            margin: '0 0 10px',
            transition: 'color .15s',
          }}
        >
          {title}
        </h3>

        {/* Dek */}
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 14,
            lineHeight: 1.55,
            color: 'var(--ink-soft)',
            margin: '0 0 16px',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {dek}
        </p>

        {/* Foot : tags + read time */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: 12,
            borderTop: '1px solid var(--rule-soft)',
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '.04em',
                  color: 'var(--ink-mute)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: hovered ? 'var(--accent)' : 'var(--ink-mute)',
              whiteSpace: 'nowrap',
              transition: 'color .15s',
            }}
          >
            {article.readMin} {t('min_read')} →
          </span>
        </div>
      </Link>
    </StaggerReveal>
  )
}
