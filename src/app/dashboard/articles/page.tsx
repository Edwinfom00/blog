import { getAllArticles } from '@/db/queries'
import Link from 'next/link'

export default async function DashboardArticlesPage() {
  const articles = await getAllArticles()

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid var(--rule)' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
            Dashboard
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 400, color: 'var(--ink)', margin: 0 }}>
            Articles
          </h1>
        </div>
        <Link
          href="/dashboard/articles/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 18px',
            background: 'var(--ink)', color: 'var(--bg)',
            borderRadius: 3,
            fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
            textDecoration: 'none',
            transition: 'background .15s',
          }}
          className="dash-btn-primary"
        >
          + Nouvel article
        </Link>
      </header>

      {articles.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-read)', fontStyle: 'italic', color: 'var(--ink-mute)' }}>
          Aucun article pour le moment.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 100px 80px 80px', gap: 16, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-mute)', borderBottom: '1px solid var(--rule)' }}>
            <span>№</span>
            <span>Titre</span>
            <span>Statut</span>
            <span>Date</span>
            <span></span>
          </div>

          {articles.map(article => (
            <div
              key={article.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr 100px 80px 80px',
                gap: 16,
                alignItems: 'center',
                padding: '14px 12px',
                borderBottom: '1px solid var(--rule-soft)',
                transition: 'background .15s',
              }}
              className="dash-article-row"
            >
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'var(--accent)' }}>
                {article.issue}
              </span>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)', marginBottom: 2 }}>
                  {article.titleFr}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)' }}>
                  {article.slug}
                </div>
              </div>
              <span style={{
                display: 'inline-flex',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 3,
                background: article.published ? '#3FA26420' : 'var(--bg-tint)',
                color: article.published ? '#3FA264' : 'var(--ink-mute)',
                border: `1px solid ${article.published ? '#3FA26440' : 'var(--rule)'}`,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                width: 'fit-content',
              }}>
                {article.published ? 'Publié' : 'Brouillon'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)' }}>
                {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: '2-digit' })}
              </span>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Link
                  href={`/dashboard/articles/${article.id}`}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textDecoration: 'none', letterSpacing: '.04em' }}
                >
                  Éditer
                </Link>
                <Link
                  href={`/fr/journal/${article.slug}`}
                  target="_blank"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)', textDecoration: 'none' }}
                >
                  ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
