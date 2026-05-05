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
  return {
    title: locale === 'fr' ? article.titleFr : article.titleEn,
    description: locale === 'fr' ? article.dekFr : article.dekEn,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'article' })

  const [article, adjacent] = await Promise.all([
    getArticleBySlug(slug),
    getArticleBySlug(slug).then(a =>
      a ? getAdjacentArticles(a.issue) : { prev: null, next: null }
    ),
  ])

  if (!article) notFound()

  const comments = await getApprovedComments(article.id)
  const title = locale === 'fr' ? article.titleFr : article.titleEn
  const dek   = locale === 'fr' ? article.dekFr   : article.dekEn
  const body  = (locale === 'fr' ? article.bodyFr : article.bodyEn) as Block[]

  // Extraire le texte brut pour le contexte IA (max 3000 chars)
  const bodyText = body.map(b => {
    if (b.type === 'p') return b.text.replace(/<[^>]+>/g, '')
    if (b.type === 'h2') return typeof b.text === 'string' ? b.text : b.text[locale as 'fr' | 'en']
    if (b.type === 'quote') return `"${b.text}"`
    if (b.type === 'list') return b.items.map(i => i.replace(/<[^>]+>/g, '')).join('. ')
    return ''
  }).filter(Boolean).join('\n\n').slice(0, 3000)

  const formattedDate = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  ).format(new Date(article.date))

  return (
    <>
      <ReadingProgress />
      <AIArticleSync title={title} dek={dek} body={bodyText} />

      {/* ─── Wrapper ─── */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">

        {/* ─── Grille 3 colonnes
              < 900px  → 1 col  (TOC + rail masqués)
              900–1200 → 2 cols (TOC visible, rail masqué)
              > 1200px → 3 cols (TOC + rail visibles)
        ─── */}
        <div className="
          grid gap-8 lg:gap-12
          grid-cols-1
          md:grid-cols-[180px_1fr]
          xl:grid-cols-[220px_1fr_220px]
          pt-10 pb-20 items-start
        ">

          {/* ─── TOC — masqué < md ─── */}
          <aside className="hidden md:block">
            <Link
              href="/journal"
              className="flex items-center gap-1.5 font-[var(--font-mono)] text-[11px] tracking-[.08em] uppercase text-[var(--ink-mute)] mb-8 no-underline hover:text-[var(--ink)] transition-colors"
            >
              ← {t('back')}
            </Link>
            <TOC items={article.toc} />
          </aside>

          {/* ─── Corps ─── */}
          <article className="min-w-0 max-w-[760px]">

            {/* Lien retour mobile uniquement */}
            <Link
              href="/journal"
              className="md:hidden flex items-center gap-1.5 font-[var(--font-mono)] text-[11px] tracking-[.08em] uppercase text-[var(--ink-mute)] mb-6 no-underline hover:text-[var(--ink)] transition-colors"
            >
              ← {t('back')}
            </Link>

            {/* Kicker */}
            <div className="flex flex-wrap gap-2 sm:gap-4 items-center font-[var(--font-mono)] text-[11px] tracking-[.1em] uppercase text-[var(--ink-mute)] mb-5">
              <span className="text-[var(--accent)]">№{article.issue}</span>
              <span>·</span>
              <time dateTime={article.date}>{formattedDate}</time>
              <span>·</span>
              <span>{article.readMin} {t('min_read')}</span>
            </div>

            {/* Titre */}
            <h1 className="font-[var(--font-display)] text-[clamp(28px,4vw,52px)] font-normal tracking-[-0.01em] leading-[1.06] text-[var(--ink)] mb-5">
              {title}
            </h1>

            {/* Dek */}
            <p className="font-[var(--font-display)] italic text-[clamp(16px,1.8vw,20px)] leading-[1.5] text-[var(--ink-soft)] mb-10 pb-10 border-b border-[var(--rule)]">
              {dek}
            </p>

            {/* Corps article */}
            <ArticleBody blocks={body} />

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-[var(--rule)] flex flex-wrap gap-2 items-center">
              <span className="font-[var(--font-mono)] text-[10px] tracking-[.1em] uppercase text-[var(--ink-mute)]">
                {t('filed_under')}
              </span>
              {article.tags.map(tag => (
                <span
                  key={tag.id}
                  className="font-[var(--font-mono)] text-[11px] px-2 py-0.5 bg-[var(--bg-tint)] border border-[var(--rule)] rounded-[3px] text-[var(--ink-soft)]"
                >
                  #{locale === 'fr' ? tag.nameFr : tag.nameEn}
                </span>
              ))}
            </div>

            {/* TOC mobile — affiché entre tags et continue reading sur petit écran */}
            {article.toc.length > 0 && (
              <div className="md:hidden mt-8 p-4 bg-[var(--bg-tint)] rounded-[4px] border border-[var(--rule)]">
                <p className="font-[var(--font-mono)] text-[10px] tracking-[.12em] uppercase text-[var(--ink-mute)] mb-3">
                  {t('toc')}
                </p>
                <div className="flex flex-col gap-0">
                  {article.toc.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.anchorId}`}
                      className="font-[var(--font-ui)] text-[13px] text-[var(--ink-soft)] py-1.5 border-l border-[var(--rule)] pl-3 no-underline hover:text-[var(--ink)] transition-colors"
                    >
                      {locale === 'fr' ? item.labelFr : item.labelEn}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <ContinueReading prev={adjacent.prev} next={adjacent.next} />
            <CommentSection articleId={article.id} comments={comments} />
          </article>

          {/* ─── Rail — masqué < xl ─── */}
          <aside className="hidden xl:block">
            <div className="p-5 bg-[var(--bg-tint)] rounded-[4px] mt-20">
              <p className="font-[var(--font-mono)] text-[10px] tracking-[.12em] uppercase text-[var(--ink-mute)] mb-2.5">
                {t('tags')}
              </p>
              <div className="flex flex-col gap-1.5">
                {article.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="font-[var(--font-mono)] text-[12px] text-[var(--ink-soft)]"
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
