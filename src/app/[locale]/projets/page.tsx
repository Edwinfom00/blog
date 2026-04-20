import { getTranslations } from 'next-intl/server'
import { getAllProjects } from '@/db/queries'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

const STATUS_COLORS = {
  live: '#3FA264',
  new: 'var(--accent)',
  wip: '#D9A94C',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })
  return { title: t('title'), description: t('desc') }
}

export default async function ProjetsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })
  const projects = await getAllProjects()

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '48px 32px 96px' }}>
      <header style={{ marginBottom: 56, borderBottom: '1px solid var(--rule)', paddingBottom: 24 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
          —
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 12px' }}>
          {t('title')}
        </h1>
        <p style={{ fontFamily: 'var(--font-read)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink-soft)', margin: 0 }}>
          {t('desc')}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid var(--rule)' }}>
        {projects.map((project, i) => {
          const kind = locale === 'fr' ? project.kindFr : project.kindEn
          const desc = locale === 'fr' ? project.descFr : project.descEn
          const statusLabel = t(`status_${project.status}`)

          return (
            <article
              key={project.id}
              style={{
                padding: '28px 24px 28px 0',
                borderBottom: '1px solid var(--rule)',
                borderRight: (i + 1) % 3 !== 0 ? '1px solid var(--rule)' : 'none',
                paddingRight: (i + 1) % 3 !== 0 ? 24 : 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)', display: 'block', marginBottom: 4 }}>
                    {kind} · {project.year}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>
                    {project.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[project.status], display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: STATUS_COLORS[project.status], letterSpacing: '.06em', textTransform: 'uppercase' }}>
                    {statusLabel}
                  </span>
                </div>
              </div>

              <p style={{ fontFamily: 'var(--font-read)', fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 16px' }}>
                {desc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {project.tags?.map(tag => (
                    <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 6px', background: 'var(--bg-tint)', border: '1px solid var(--rule)', borderRadius: 3, color: 'var(--ink-mute)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                {project.url && project.url !== '#' && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textDecoration: 'none', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {t('visit')} ↗
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
