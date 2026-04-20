'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { SectionHead } from '@/components/shared/SectionHead'
import { StaggerReveal } from '@/components/shared/StaggerReveal'
import type { Project } from '@/db/schema'

interface ProjectsSectionProps {
  projects: Project[]
}

const STATUS_COLORS: Record<string, string> = {
  live: '#3FA264',
  new: 'var(--accent)',
  wip: '#D9A94C',
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const t = useTranslations('home')
  const locale = useLocale() as 'fr' | 'en'

  return (
    <section
      style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '0 32px 96px',
      }}
    >
      <SectionHead
        kicker={t('projects_kicker')}
        title={t('projects_title')}
        seeAllHref="/projets"
        seeAllLabel={t('all_projects')}
      />

      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 16,
          color: 'var(--ink-soft)',
          margin: '-8px 0 24px',
        }}
      >
        {t('projects_desc')}
      </p>

      {/* Liste table : dot · nom · desc · arrow */}
      <div style={{ borderTop: '1px solid var(--rule)' }}>
        {projects.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            locale={locale}
            index={i}
          />
        ))}
      </div>
    </section>
  )
}

function ProjectRow({
  project,
  locale,
  index,
}: {
  project: Project
  locale: 'fr' | 'en'
  index: number
}) {
  const [hovered, setHovered] = useState(false)
  const desc = locale === 'fr' ? project.descFr : project.descEn
  const statusColor = STATUS_COLORS[project.status] ?? 'var(--ink-mute)'
  const isLink = project.url && project.url !== '#'

  return (
    <StaggerReveal delay={index * 55}>
      <a
        href={isLink ? project.url : undefined}
        target={isLink ? '_blank' : undefined}
        rel={isLink ? 'noopener noreferrer' : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr auto',
          alignItems: 'center',
          gap: 32,
          padding: '18px 0',
          borderBottom: '1px solid var(--rule)',
          background: hovered ? 'var(--bg-tint)' : 'transparent',
          transition: 'background .15s',
          textDecoration: 'none',
          cursor: isLink ? 'pointer' : 'default',
          paddingLeft: hovered ? 8 : 0,
        }}
      >
        {/* ─── Gauche : dot + nom ─── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: statusColor,
              flexShrink: 0,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 500,
              color: hovered ? 'var(--accent)' : 'var(--ink)',
              transition: 'color .15s',
              letterSpacing: '-.01em',
            }}
          >
            {project.name}
          </span>
        </div>

        {/* ─── Centre : description italic ─── */}
        <p
          style={{
            fontFamily: 'var(--font-read)',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.5,
            color: 'var(--ink-soft)',
            margin: 0,
          }}
        >
          {desc}
        </p>

        {/* ─── Droite : flèche ─── */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            color: hovered ? 'var(--accent)' : 'var(--ink-mute)',
            transition: 'color .15s, transform .2s',
            transform: hovered ? 'translate(2px, -2px)' : 'none',
            display: 'inline-block',
          }}
        >
          {isLink ? '↗' : '—'}
        </span>
      </a>
    </StaggerReveal>
  )
}
