import { db } from '@/db/index'
import { comments, articles } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { CommentModerationClient } from './CommentModerationClient'

export default async function DashboardCommentsPage() {
  const rows = await db
    .select({
      comment: comments,
      articleTitleFr: articles.titleFr,
      articleSlug: articles.slug,
    })
    .from(comments)
    .leftJoin(articles, eq(comments.articleId, articles.id))
    .orderBy(desc(comments.createdAt))

  return (
    <div>
      <header style={{ marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid var(--rule)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
          Dashboard
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 400, color: 'var(--ink)', margin: 0 }}>
          Commentaires
        </h1>
      </header>
      <CommentModerationClient rows={rows} />
    </div>
  )
}
