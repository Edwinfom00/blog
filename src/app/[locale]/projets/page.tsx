import { getTranslations } from 'next-intl/server'
import { getAllProjects } from '@/db/queries'
import { StaggerReveal } from '@/components/shared/StaggerReveal'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

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
    <main className="max-w-[1180px] mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-20 sm:pb-24">
      {/* Header */}
      <header className="pb-8 sm:pb-10 border-b border-[var(--rule)] mb-8 sm:mb-10">
        <span className="font-[var(--font-mono)] text-[11px] tracking-[.14em] uppercase text-[var(--accent)] block mb-3">
          {locale === 'fr' ? 'Atelier ouvert' : 'Open workshop'}
        </span>
        <h1 className="font-[var(--font-display)] italic font-normal text-[clamp(48px,10vw,112px)] leading-none tracking-[-0.01em] text-[var(--ink)] mb-4">
          {t('title')}
        </h1>
        <p className="font-[var(--font-read)] italic text-[17px] sm:text-[18px] text-[var(--ink-soft)] max-w-[540px]">
          {t('desc')}
        </p>
      </header>

      {/* Grille cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
        {projects.map((project, i) => {
          const kind = locale === 'fr' ? project.kindFr : project.kindEn
          const desc = locale === 'fr' ? project.descFr : project.descEn
          const statusColor = STATUS_COLORS[project.status] ?? 'var(--ink-mute)'
          const statusLabel = t(`status_${project.status}`)
          const isLink = project.url && project.url !== '#'
          const Tag = isLink ? 'a' : 'div'

          return (
            <StaggerReveal key={project.id} delay={i * 60}>
              <Tag
                {...(isLink ? { href: project.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group bg-[var(--surface)] p-6 sm:p-7 flex flex-col gap-2 min-h-[280px] transition-colors duration-200 hover:bg-[var(--bg-tint)] no-underline"
              >
                {/* Status + année */}
                <div className="flex justify-between items-center font-[var(--font-mono)] text-[10.5px] tracking-[.08em] uppercase text-[var(--ink-mute)] mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColor }} />
                    <span style={{ color: statusColor }}>{statusLabel}</span>
                  </span>
                  <span>{project.year}</span>
                </div>

                {/* Nom */}
                <h2 className="font-[var(--font-mono)] text-[17px] font-medium text-[var(--ink)] tracking-[-0.01em] mt-1">
                  {project.name}
                </h2>

                {/* Kind */}
                <p className="font-[var(--font-read)] italic text-[13px] text-[var(--accent)] m-0">
                  {kind}
                </p>

                {/* Description */}
                <p className="font-[var(--font-read)] text-[15px] leading-[1.5] text-[var(--ink-soft)] mt-2 mb-auto">
                  {desc}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-[var(--rule)] mt-4">
                  <div className="flex gap-2 flex-wrap">
                    {(project.tags ?? []).map(tag => (
                      <span key={tag} className="font-[var(--font-mono)] text-[10.5px] text-[var(--ink-mute)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[var(--ink-mute)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all inline-block">
                    {isLink ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    ) : <span className="font-[var(--font-mono)] text-[12px]">—</span>}
                  </span>
                </div>
              </Tag>
            </StaggerReveal>
          )
        })}
      </div>
    </main>
  )
}
