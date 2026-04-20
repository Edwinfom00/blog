import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getArticleBySlug, getAdjacentArticles, getApprovedComments } from '@/db/queries'
import { ArticleBody } from '@/components/article/ArticleBody'
import { TOC } from '@/components/article/TOC'
import { ReadingProgress } from '@/components/article/ReadingProgress'
import { ContinueReading } from '@/components/article/ContinueReading'
import { CommentSection } from '@/components/article/CommentSection'
import { AIArticleSync } from '@/components/ai/AIArticleSync'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import type { Block } from '@/db/schema'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  const title = locale === 'fr' ? article.titleFr : article.titleEn
  const description = locale === 'fr' ? article.dekFr : article.dekEn

  return { title, description }
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'article' })

  const [article, adjacent] = await Promise.all([
    getArticleBySlug(slug),
    getArticleBySlug(slug).then(a => a ? getAdjacentArticles(a.issue) : { prev: null, next: null }),
  ])

  if (!article) notFound()

  const comments = await getApprovedComments(article.id)

  const title = locale === 'fr' ? article.titleFr : article.titleEn
  const dek   = locale === 'fr' ? article.dekFr   : article.dekEn
  const body  = (locale === 'fr' ? article.bodyFr : article.bodyEn) as Block[]

  const formattedDate = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  ).format(new Date(article.date))

  return (
    <>
      <ReadingProgress />
      <AIArticleSync title={title} dek={dek} />

      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        {/* Article grid : TOC · lecture · rail */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr 220px',
            gap: 48,
            paddingTop: 48,
            paddingBottom: 80,
            alignItems: 'start',
          }}
        >
          {/* ─── Colonne gauche : TOC ─── */}
          <div>
            <Link
              href="/journal"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '.08em', textTransform: 'uppercase',
                color: 'var(--ink-mute)', marginBottom: 32,
                textDecoration: 'none', transition: 'color .15s',
              }}
            >
              ← {t('back')}
            </Link>
            <TOC items={article.toc} />
          </div>

          {/* ─── Colonne centrale : article ─── */}
          <article style={{ maxWidth: 760 }}>
            {/* Kicker */}
            <div
              style={{
                display: 'flex', gap: 16, alignItems: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '.1em', textTransform: 'uppercase',
                color: 'var(--ink-mute)', marginBottom: 20,
              }}
            >
              <span style={{ color: 'var(--accent)' }}>№{article.issue}</span>
              <span>·</span>
              <time dateTime={article.date}>{formattedDate}</time>
              <span>·</span>
              <span>{article.readMin} {t('min_read')}</span>
            </div>

            {/* Titre */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4vw, 52px)',
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
                margin: '0 0 40px',
                paddingBottom: 40,
                borderBottom: '1px solid var(--rule)',
              }}
            >
              {dek}
            </p>

            {/* Corps */}
            <ArticleBody blocks={body} />

            {/* Tags */}
            <div
              style={{
                marginTop: 40,
                paddingTop: 24,
                borderTop: '1px solid var(--rule)',
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  letterSpacing: '.1em', textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                }}
              >
                {t('filed_under')}
              </span>
              {article.tags.map(tag => (
                <span
                  key={tag.id}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    padding: '2px 8px',
                    background: 'var(--bg-tint)',
                    border: '1px solid var(--rule)',
                    borderRadius: 3,
                    color: 'var(--ink-soft)',
                  }}
                >
                  #{locale === 'fr' ? tag.nameFr : tag.nameEn}
                </span>
              ))}
            </div>

            {/* Navigation prev/next */}
            <ContinueReading prev={adjacent.prev} next={adjacent.next} />

            {/* Commentaires */}
            <CommentSection articleId={article.id} comments={comments} />
          </article>

          {/* ─── Colonne droite : rail ─── */}
          <aside>
            <div
              style={{
                padding: 20,
                background: 'var(--bg-tint)',
                borderRadius: 4,
                marginTop: 80,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  letterSpacing: '.12em', textTransform: 'uppercase',
                  color: 'var(--ink-mute)', marginBottom: 10,
                }}
              >
                {t('tags')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {article.tags.map(tag => (
                  <span
                    key={tag.id}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12,
                      color: 'var(--ink-soft)',
                    }}
                  >
                    #{locale === 'fr' ? tag.nameFr : tag.nameEn}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
