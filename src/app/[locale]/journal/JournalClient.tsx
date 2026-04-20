'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { StaggerReveal } from '@/components/shared/StaggerReveal'
import type { Article, ArticleTag } from '@/db/schema'

interface ArticleWithTags extends Article {
  tags: ArticleTag[]
}

interface Props {
  articles: ArticleWithTags[]
  locale: string
}

const fmtDate = (iso: string, locale: string) => {
  const d = new Date(iso)
  const m =
    locale === 'fr'
      ? ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`
}

export function JournalClient({ articles, locale }: Props) {
  const t = useTranslations('journal')
  const tArticle = useTranslations('article')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const s = new Set<string>()
    articles.forEach(a =>
      a.tags.forEach(tag => s.add(locale === 'fr' ? tag.nameFr : tag.nameEn))
    )
    return [...s]
  }, [articles, locale])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return articles.filter(a => {
      const title = locale === 'fr' ? a.titleFr : a.titleEn
      const dek = locale === 'fr' ? a.dekFr : a.dekEn
      const okQ = !q || (title + dek).toLowerCase().includes(q)
      const okT =
        !activeTag ||
        a.tags.some(tag => (locale === 'fr' ? tag.nameFr : tag.nameEn) === activeTag)
      return okQ && okT
    })
  }, [articles, locale, query, activeTag])

  return (
    <main style={{ maxWidth: 980, margin: '0 auto', padding: '60px 32px 96px' }}>
      {/* ─── Header ─── */}
      <header
        style={{
          textAlign: 'center',
          paddingBottom: 40,
          borderBottom: '1px solid var(--rule)',
          marginBottom: 40,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            display: 'block',
            marginBottom: 12,
          }}
        >
          {locale === 'fr' ? 'Sommaire' : 'Archive'}
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(56px, 10vw, 112px)',
            lineHeight: 1,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            margin: '0 0 16px',
          }}
        >
          {t('title')}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-read)',
            fontStyle: 'italic',
            fontSize: 17,
            color: 'var(--ink-soft)',
            margin: 0,
          }}
        >
          {t('desc')}
        </p>
      </header>

      {/* ─── Outils : recherche + tags ─── */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 32,
        }}
      >
        {/* Barre de recherche */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            border: '1px solid var(--rule)',
            borderRadius: 3,
            background: 'var(--surface)',
            flex: '1 1 280px',
            color: 'var(--ink-mute)',
          }}
        >
          <SearchIcon />
          <input
            type="search"
            placeholder={locale === 'fr' ? 'Chercher un article…' : 'Search articles…'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              flex: 1,
              fontFamily: 'var(--font-read)',
              fontSize: 15,
              color: 'var(--ink)',
            }}
          />
        </div>

        {/* Filtres tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <TagButton
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          >
            {locale === 'fr' ? 'Tous' : 'All'}
          </TagButton>
          {allTags.map(tag => (
            <TagButton
              key={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              #{tag}
            </TagButton>
          ))}
        </div>
      </div>

      {/* ─── Liste ─── */}
      {filtered.length === 0 ? (
        <div
          style={{
            padding: '60px 0',
            textAlign: 'center',
            fontFamily: 'var(--font-read)',
            fontStyle: 'italic',
            color: 'var(--ink-mute)',
          }}
        >
          {locale === 'fr' ? 'Rien ici… pour l\'instant.' : 'Nothing here… yet.'}
        </div>
      ) : (
        <ol
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            borderTop: '1px solid var(--rule)',
          }}
        >
          {filtered.map((article, i) => {
            const title = locale === 'fr' ? article.titleFr : article.titleEn
            const dek = locale === 'fr' ? article.dekFr : article.dekEn
            const tags = article.tags.map(tag =>
              locale === 'fr' ? tag.nameFr : tag.nameEn
            )

            return (
              <StaggerReveal key={article.id} delay={i * 40} as="li">
                <Link
                  href={`/journal/${article.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    className="journal-item"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '100px 1fr 40px',
                      gap: 20,
                      alignItems: 'start',
                      padding: '32px 0',
                      borderBottom: '1px solid var(--rule)',
                      cursor: 'pointer',
                      transition: 'background .2s, padding .2s',
                    }}
                  >
                    {/* Numéro */}
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontStyle: 'italic',
                        fontSize: 28,
                        color: 'var(--accent)',
                        lineHeight: 1,
                        paddingTop: 4,
                      }}
                    >
                      №{String(article.issue).padStart(2, '0')}
                    </span>

                    {/* Contenu */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10.5,
                          color: 'var(--ink-mute)',
                          letterSpacing: '.04em',
                          textTransform: 'uppercase',
                          marginBottom: 8,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>{fmtDate(article.date, locale)}</span>
                        <span style={{ color: 'var(--rule)' }}>·</span>
                        <span>{article.readMin} {tArticle('min_read')}</span>
                        {tags.length > 0 && (
                          <>
                            <span style={{ color: 'var(--rule)' }}>·</span>
                            <span style={{ textTransform: 'lowercase' }}>
                              {tags.slice(0, 2).map(tg => `#${tg}`).join(' ')}
                            </span>
                          </>
                        )}
                      </div>
                      <h2
                        className="journal-item-title"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 400,
                          fontSize: 34,
                          lineHeight: 1.08,
                          color: 'var(--ink)',
                          margin: '0 0 10px',
                          transition: 'color .15s',
                        }}
                      >
                        {title}
                      </h2>
                      <p
                        style={{
                          fontFamily: 'var(--font-read)',
                          fontStyle: 'italic',
                          fontSize: 16,
                          lineHeight: 1.5,
                          color: 'var(--ink-soft)',
                          margin: 0,
                          maxWidth: 680,
                        }}
                      >
                        {dek}
                      </p>
                    </div>

                    {/* Flèche */}
                    <div
                      className="journal-item-arrow"
                      style={{
                        paddingTop: 12,
                        color: 'var(--ink-mute)',
                        transition: 'color .15s, transform .15s',
                      }}
                    >
                      <ArrowRight />
                    </div>
                  </div>
                </Link>
              </StaggerReveal>
            )
          })}
        </ol>
      )}

      <style>{`
        .journal-item:hover { background: var(--bg-tint); padding-left: 12px; padding-right: 12px; }
        .journal-item:hover .journal-item-title { color: var(--accent); }
        .journal-item:hover .journal-item-arrow { color: var(--accent); transform: translateX(3px); }
        @media (max-width: 720px) {
          .journal-item { grid-template-columns: 60px 1fr !important; }
          .journal-item-arrow { display: none; }
        }
      `}</style>
    </main>
  )
}

function TagButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 10px',
        border: '1px solid var(--rule)',
        borderRadius: 3,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: active ? 'var(--bg)' : 'var(--ink-soft)',
        background: active ? 'var(--ink)' : 'transparent',
        borderColor: active ? 'var(--ink)' : 'var(--rule)',
        cursor: 'pointer',
        transition: 'background .15s, color .15s, border-color .15s',
      }}
    >
      {children}
    </button>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
