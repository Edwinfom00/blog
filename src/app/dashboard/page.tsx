import { getAllArticles, getAllProjects } from '@/db/queries'
import { db } from '@/db/index'
import { comments } from '@/db/schema'
import { eq, count } from 'drizzle-orm'
import Link from 'next/link'

export default async function DashboardPage() {
  const [articles, projects, pendingComments] = await Promise.all([
    getAllArticles(),
    getAllProjects(),
    db.select({ count: count() }).from(comments).where(eq(comments.approved, false)),
  ])

  const pending = pendingComments[0]?.count ?? 0
  const published = articles.filter(a => a.published).length
  const drafts = articles.filter(a => !a.published).length

  const stats = [
    { label: 'Articles publiés', value: published, icon: '✦', href: '/dashboard/articles' },
    { label: 'Brouillons', value: drafts, icon: '◌', href: '/dashboard/articles' },
    { label: 'Commentaires en attente', value: pending, icon: '◆', href: '/dashboard/comments', accent: pending > 0 },
    { label: 'Projets', value: projects.length, icon: '◈', href: '/dashboard' },
  ]

  return (
    <div>
      <header style={{ marginBottom: 40 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
          Dashboard
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, color: 'var(--ink)', margin: 0 }}>
          Vue d'ensemble
        </h1>
      </header>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
        {stats.map(({ label, value, icon, href, accent }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '20px 24px',
              background: 'var(--bg-tint)',
              border: `1px solid ${accent ? 'var(--accent)' : 'var(--rule)'}`,
              borderRadius: 4,
              transition: 'background .15s',
            }}
              className="dash-stat-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: accent ? 'var(--accent)' : 'var(--ink-mute)', letterSpacing: '.08em' }}>{icon}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 36, fontWeight: 400, color: accent ? 'var(--accent)' : 'var(--ink)', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-mute)', marginTop: 6 }}>
                {label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Derniers articles */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--rule)' }}>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 400, margin: 0 }}>
            Articles récents
          </h2>
          <Link href="/dashboard/articles/new" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textDecoration: 'none', letterSpacing: '.06em' }}>
            + Nouvel article
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {articles.slice(0, 5).map(article => (
            <Link key={article.id} href={`/dashboard/articles/${article.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr auto auto',
                gap: 16,
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid var(--rule-soft)',
                transition: 'background .15s',
              }}
                className="dash-article-row"
              >
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--accent)' }}>
                  №{article.issue}
                </span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)' }}>
                  {article.titleFr}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 3,
                  background: article.published ? '#3FA26420' : 'var(--bg-tint)',
                  color: article.published ? '#3FA264' : 'var(--ink-mute)',
                  border: `1px solid ${article.published ? '#3FA26440' : 'var(--rule)'}`,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                }}>
                  {article.published ? 'Publié' : 'Brouillon'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)' }}>
                  {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
