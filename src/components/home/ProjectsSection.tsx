'use client'

import { useTranslations, useLocale } from 'next-intl'
import { SectionHead } from '@/components/shared/SectionHead'
import { StaggerReveal } from '@/components/shared/StaggerReveal'
import type { Project } from '@/db/schema'

const STATUS_COLORS: Record<string, string> = {
  live: '#3FA264',
  new: 'var(--accent)',
  wip: '#D9A94C',
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations('home')
  const locale = useLocale() as 'fr' | 'en'

  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-8 pb-20 sm:pb-24">
      <SectionHead
        kicker={t('projects_kicker')}
        title={t('projects_title')}
        seeAllHref="/projets"
        seeAllLabel={t('all_projects')}
      />

      <p className="font-[var(--font-display)] italic text-[16px] text-[var(--ink-soft)] -mt-2 mb-6">
        {t('projects_desc')}
      </p>

      <div className="border-t border-[var(--rule)]">
        {projects.map((project, i) => {
          const desc = locale === 'fr' ? project.descFr : project.descEn
          const statusColor = STATUS_COLORS[project.status] ?? 'var(--ink-mute)'
          const isLink = project.url && project.url !== '#'

          return (
            <StaggerReveal key={project.id} delay={i * 55}>
              <a
                href={isLink ? project.url : undefined}
                target={isLink ? '_blank' : undefined}
                rel={isLink ? 'noopener noreferrer' : undefined}
                className={[
                  'group grid items-center gap-4 sm:gap-8',
                  'grid-cols-[auto_1fr_auto] sm:grid-cols-[1fr_2fr_auto]',
                  'py-4 sm:py-[18px] px-0',
                  'border-b border-[var(--rule)]',
                  'transition-all duration-150',
                  'hover:bg-[var(--bg-tint)] hover:px-3',
                  isLink ? 'cursor-pointer' : 'cursor-default',
                ].join(' ')}
              >
                {/* Gauche : dot + nom */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-[7px] h-[7px] rounded-full shrink-0 inline-block"
                    style={{ background: statusColor }}
                  />
                  <span className="font-[var(--font-mono)] text-[14px] font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors tracking-[-0.01em] truncate">
                    {project.name}
                  </span>
                </div>

                {/* Centre : description — masquée sur mobile */}
                <p className="hidden sm:block font-[var(--font-read)] italic text-[15px] leading-[1.5] text-[var(--ink-soft)] m-0 truncate">
                  {desc}
                </p>

                {/* Droite : flèche */}
                <span className="font-[var(--font-mono)] text-[14px] text-[var(--ink-mute)] group-hover:text-[var(--accent)] transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 inline-block transition-transform">
                  {isLink ? '↗' : '—'}
                </span>
              </a>
            </StaggerReveal>
          )
        })}
      </div>
    </section>
  )
}
