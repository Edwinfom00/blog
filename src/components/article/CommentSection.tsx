import { CommentForm } from './CommentForm'
import type { Comment } from '@/db/schema'
import { useTranslations, useLocale } from 'next-intl'

interface CommentSectionProps {
  articleId: number
  comments: Comment[]
}

export function CommentSection({ articleId, comments }: CommentSectionProps) {
  const t = useTranslations('comments')
  const locale = useLocale() as 'fr' | 'en'

  const formattedDate = (date: Date) =>
    new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    }).format(date)

  return (
    <section style={{ marginTop: 80 }}>
      <h2
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
          fontWeight: 400,
          marginBottom: 32,
          borderBottom: '1px solid var(--rule)',
          paddingBottom: 16,
        }}
      >
        {t('title')} ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-read)',
            fontStyle: 'italic',
            fontSize: 16,
            color: 'var(--ink-mute)',
            marginBottom: 40,
          }}
        >
          {t('empty')}
        </p>
      ) : (
        <div style={{ marginBottom: 48 }}>
          {comments.map(comment => (
            <article
              key={comment.id}
              style={{
                borderBottom: '1px solid var(--rule-soft)',
                paddingBottom: 24,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--ink)',
                  }}
                >
                  {comment.authorName}
                </span>
                <time
                  dateTime={comment.createdAt.toISOString()}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--ink-mute)',
                  }}
                >
                  {formattedDate(comment.createdAt)}
                </time>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-read)',
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: 'var(--ink-soft)',
                  margin: 0,
                }}
              >
                {comment.content}
              </p>
            </article>
          ))}
        </div>
      )}

      <CommentForm articleId={articleId} />
    </section>
  )
}
