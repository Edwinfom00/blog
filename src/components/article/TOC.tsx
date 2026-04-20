'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { TocItem } from '@/db/schema'

interface TOCProps {
  items: TocItem[]
}

export function TOC({ items }: TOCProps) {
  const t = useTranslations('article')
  const locale = useLocale() as 'fr' | 'en'
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    items.forEach(item => {
      const el = document.getElementById(item.anchorId)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <aside
      style={{
        position: 'sticky',
        top: 88,
        alignSelf: 'start',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
          marginBottom: 12,
        }}
      >
        {t('toc')}
      </p>

      <nav aria-label={t('toc')}>
        {items.map(item => (
          <button
            key={item.anchorId}
            onClick={() => {
              const el = document.getElementById(item.anchorId)
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="toc-item"
            data-active={activeId === item.anchorId ? 'true' : 'false'}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              background: 'none',
              border: 'none',
            }}
          >
            {locale === 'fr' ? item.labelFr : item.labelEn}
          </button>
        ))}
      </nav>
    </aside>
  )
}
