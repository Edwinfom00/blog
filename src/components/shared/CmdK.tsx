'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

interface SearchItem {
  type: 'article' | 'project'
  title: string
  href: string
  meta?: string
}

interface CmdKProps {
  open: boolean
  onClose: () => void
  articles: SearchItem[]
  projects: SearchItem[]
}

export function CmdK({ open, onClose, articles, projects }: CmdKProps) {
  const t = useTranslations('cmdk')
  const router = useRouter()
  const locale = useLocale()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const allItems: SearchItem[] = [...articles, ...projects]

  const filtered = query.trim()
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    : allItems

  const filteredArticles = filtered.filter(i => i.type === 'article')
  const filteredProjects = filtered.filter(i => i.type === 'project')
  const flatFiltered = [...filteredArticles, ...filteredProjects]

  /* Focus input à l'ouverture */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelected(0)
    }
  }, [open])

  /* Fermer avec Escape, naviguer avec ↑↓↩ */
  useEffect(() => {
    if (!open) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, flatFiltered.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && flatFiltered[selected]) {
        router.push(flatFiltered[selected].href)
        onClose()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, selected, flatFiltered, onClose, router])

  /* Reset sélection au changement de query */
  useEffect(() => { setSelected(0) }, [query])

  if (!open) return null

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'color-mix(in srgb, var(--ink) 30%, transparent)',
        backdropFilter: 'blur(4px)',
        zIndex: 500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '14vh',
      }}
    >
      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 640,
          margin: '0 16px',
          background: 'var(--surface)',
          borderRadius: 8,
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--rule)',
          overflow: 'hidden',
        }}
      >
        {/* Input */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 16px',
            borderBottom: '1px solid var(--rule)',
          }}
        >
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('placeholder')}
            style={{
              flex: 1,
              background: 'none', border: 'none', outline: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: 15,
              color: 'var(--ink)',
            }}
          />
          <kbd
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              background: 'var(--bg-tint)',
              border: '1px solid var(--rule)',
              borderRadius: 3, padding: '2px 6px',
              color: 'var(--ink-mute)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Résultats */}
        <div style={{ maxHeight: 380, overflowY: 'auto' }}>
          {flatFiltered.length === 0 ? (
            <p
              style={{
                padding: '24px 16px', textAlign: 'center',
                fontFamily: 'var(--font-ui)', fontSize: 14,
                color: 'var(--ink-mute)',
              }}
            >
              {t('no_results')}
            </p>
          ) : (
            <>
              {filteredArticles.length > 0 && (
                <Group label={t('articles')}>
                  {filteredArticles.map((item, i) => (
                    <ResultRow
                      key={item.href}
                      item={item}
                      active={selected === i}
                      glyph="✦"
                      onClick={() => { router.push(item.href); onClose() }}
                    />
                  ))}
                </Group>
              )}
              {filteredProjects.length > 0 && (
                <Group label={t('projects')}>
                  {filteredProjects.map((item, i) => (
                    <ResultRow
                      key={item.href}
                      item={item}
                      active={selected === filteredArticles.length + i}
                      glyph="◆"
                      onClick={() => { router.push(item.href); onClose() }}
                    />
                  ))}
                </Group>
              )}
            </>
          )}
        </div>

        {/* Footer hints */}
        <div
          style={{
            display: 'flex', gap: 16, padding: '10px 16px',
            borderTop: '1px solid var(--rule)',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--ink-mute)',
          }}
        >
          <span><kbd style={kbdStyle}>↑↓</kbd> {t('hint_navigate')}</span>
          <span><kbd style={kbdStyle}>↩</kbd> {t('hint_open')}</span>
          <span><kbd style={kbdStyle}>ESC</kbd> {t('hint_close')}</span>
        </div>
      </div>
    </div>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          padding: '8px 16px 4px',
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'var(--ink-mute)',
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

function ResultRow({ item, active, glyph, onClick }: {
  item: SearchItem; active: boolean; glyph: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '18px 1fr auto',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '9px 16px',
        background: active ? 'var(--bg-tint)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background .1s',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)' }}>
        {glyph}
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.title}
      </span>
      {item.meta && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-mute)' }}>
          {item.meta}
        </span>
      )}
    </button>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ink-mute)', flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

const kbdStyle: React.CSSProperties = {
  background: 'var(--bg-tint)',
  border: '1px solid var(--rule)',
  borderRadius: 3,
  padding: '1px 4px',
  marginRight: 4,
}
