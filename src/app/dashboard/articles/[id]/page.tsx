import { notFound } from 'next/navigation'
import { db } from '@/db/index'
import { articles, tocItems, articleTags } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { ArticleEditor } from '../ArticleEditor'

interface Props { params: Promise<{ id: string }> }

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params
  const articleId = parseInt(id)

  const [article, toc, tags] = await Promise.all([
    db.query.articles.findFirst({ where: eq(articles.id, articleId) }),
    db.select().from(tocItems).where(eq(tocItems.articleId, articleId)).orderBy(asc(tocItems.sortOrder)),
    db.select().from(articleTags).where(eq(articleTags.articleId, articleId)),
  ])

  if (!article) notFound()

  return <ArticleEditor article={article} toc={toc} tags={tags} mode="edit" />
}
