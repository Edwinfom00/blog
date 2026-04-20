import { getTranslations } from 'next-intl/server'
import { getAllProjects } from '@/db/queries'
import { StaggerReveal } from '@/components/shared/StaggerReveal'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

const STATUS_COLORS: Record<string, string> = {
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
    <main style={{ maxWidth: 1180, margin: '0 auto', padding: '60px 32px 96px' }}>
      {/* ─── Header ─── */}
      <header
        style={{
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
          {locale === 'fr' ? 'Atelier ouvert' : 'Open workshop'}
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
            fontSize: 18,
            color: 'var(--ink-soft)',
            margin: 0,
            maxWidth: 540,
          }}
        >
          {t('desc')}
        </p>
      </header>

      {/* ─── Grille de cards ─── */}
      <div
        className="proj-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'var(--rule)',
          border: '1px solid var(--rule)',
        }}
      >
        {projects.map((project, i) => {
          const kind = locale === 'fr' ? project.kindFr : project.kindEn
          const desc = locale === 'fr' ? project.descFr : project.descEn
          const statusColor = STATUS_COLORS[project.status] ?? 'var(--ink-mute)'
          const statusLabel = t(`status_${project.status}`)

          return (
            <StaggerReveal key={project.id} delay={i * 60}>
              {project.url && project.url !== '#' ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pcard"
                  style={{
                    background: 'var(--surface)',
                    padding: '28px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    minHeight: 280,
                    textDecoration: 'none',
                    transition: 'background .2s',
                  }}
                >
                  <ProjectCardInner
                    name={project.name}
                    kind={kind}
                    desc={desc}
                    year={project.year}
                    tags={project.tags ?? []}
                    statusColor={statusColor}
                    statusLabel={statusLabel}
                    hasUrl
                  />
                </a>
              ) : (
                <div
                  className="pcard"
                  style={{
                    background: 'var(--surface)',
                    padding: '28px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    minHeight: 280,
                    transition: 'background .2s',
                  }}
                >
                  <ProjectCardInner
                    name={project.name}
                    kind={kind}
                    desc={desc}
                    year={project.year}
                    tags={project.tags ?? []}
                    statusColor={statusColor}
                    statusLabel={statusLabel}
                    hasUrl={false}
                  />
                </div>
              )}
            </StaggerReveal>
          )
        })}
      </div>

      <style>{`
        .pcard:hover { background: var(--bg-tint) !important; }
        @media (max-width: 900px) { .proj-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .proj-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  )
}

function ProjectCardInner({
  name, kind, desc, year, tags, statusColor, statusLabel, hasUrl,
}: {
  name: string
  kind: string
  desc: string
  year: string
  tags: string[]
  statusColor: string
  statusLabel: string
  hasUrl: boolean
}) {
  return (
    <>
      {/* Top row: status + year */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
          marginBottom: 6,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: statusColor,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ color: statusColor }}>{statusLabel}</span>
        </span>
        <span>{year}</span>
      </div>

      {/* Nom */}
      <h2
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 17,
          fontWeight: 500,
          color: 'var(--ink)',
          letterSpacing: '-0.01em',
          margin: '4px 0 2px',
        }}
      >
        {name}
      </h2>

      {/* Kind */}
      <p
        style={{
          fontFamily: 'var(--font-read)',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'var(--accent)',
          margin: 0,
        }}
      >
        {kind}
      </p>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-read)',
          fontSize: 15,
          lineHeight: 1.5,
          color: 'var(--ink-soft)',
          margin: '8px 0 auto',
        }}
      >
        {desc}
      </p>

      {/* Footer: tags + arrow */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 16,
          borderTop: '1px solid var(--rule)',
          marginTop: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                color: 'var(--ink-mute)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <span
          style={{
            color: 'var(--ink-mute)',
            transition: 'color .2s, transform .2s',
          }}
          className={hasUrl ? 'pcard-go' : ''}
        >
          {hasUrl ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          ) : (
            <span style={{ fontSize: 12, letterSpacing: '.04em' }}>—</span>
          )}
        </span>
      </div>
    </>
  )
}
