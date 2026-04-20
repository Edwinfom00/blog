import { db } from './index'
import { articles, articleTags, tocItems, projects, comments } from './schema'
import { eq, desc, asc, and } from 'drizzle-orm'

/* ─── Articles ─── */

export async function getFeaturedArticles() {
  const rows = await db.query.articles.findMany({
    where: and(eq(articles.featured, true), eq(articles.published, true)),
    with: { tags: true },
    orderBy: [desc(articles.date)],
    limit: 2,
  })
  return rows
}

export async function getLatestArticles(limit = 4) {
  return db.query.articles.findMany({
    where: eq(articles.published, true),
    with: { tags: true },
    orderBy: [desc(articles.date)],
    limit,
  })
}

export async function getAllArticles() {
  return db.query.articles.findMany({
    where: eq(articles.published, true),
    with: { tags: true },
    orderBy: [desc(articles.date)],
  })
}

export async function getArticleBySlug(slug: string) {
  return db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.published, true)),
    with: { tags: true, toc: { orderBy: [asc(tocItems.sortOrder)] } },
  })
}

export async function getAdjacentArticles(issue: number) {
  const [prev, next] = await Promise.all([
    db.query.articles.findFirst({
      where: and(
        eq(articles.published, true),
        // issue inférieur = article plus ancien
      ),
      orderBy: [desc(articles.issue)],
    }),
    db.query.articles.findFirst({
      where: and(eq(articles.published, true)),
      orderBy: [asc(articles.issue)],
    }),
  ])

  const allPublished = await db.query.articles.findMany({
    where: eq(articles.published, true),
    orderBy: [desc(articles.issue)],
    columns: { id: true, slug: true, issue: true, titleFr: true, titleEn: true },
  })

  const idx = allPublished.findIndex(a => a.issue === issue)
  return {
    prev: idx < allPublished.length - 1 ? allPublished[idx + 1] : null,
    next: idx > 0 ? allPublished[idx - 1] : null,
  }
}

/* ─── Projets ─── */

export async function getAllProjects() {
  return db.query.projects.findMany({
    orderBy: [asc(projects.sortOrder), desc(projects.year)],
  })
}

export async function getFeaturedProjects(limit = 6) {
  return db.query.projects.findMany({
    orderBy: [asc(projects.sortOrder)],
    limit,
  })
}

/* ─── Commentaires ─── */

export async function getApprovedComments(articleId: number) {
  return db.query.comments.findMany({
    where: and(eq(comments.articleId, articleId), eq(comments.approved, true)),
    orderBy: [asc(comments.createdAt)],
  })
}

export async function createComment(data: {
  articleId: number
  authorName: string
  authorEmail: string
  content: string
}) {
  const [comment] = await db
    .insert(comments)
    .values({ ...data, approved: false })
    .returning()
  return comment
}

/* ─── Search (pour CmdK) ─── */

export async function getSearchData(locale: 'fr' | 'en') {
  const [arts, projs] = await Promise.all([
    getAllArticles(),
    getAllProjects(),
  ])

  return {
    articles: arts.map(a => ({
      type: 'article' as const,
      title: locale === 'fr' ? a.titleFr : a.titleEn,
      href: `/journal/${a.slug}`,
      meta: `№${a.issue}`,
    })),
    projects: projs.map(p => ({
      type: 'project' as const,
      title: p.name,
      href: `/projets`,
    })),
  }
}
