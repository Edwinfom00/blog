'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CmdK } from '@/components/shared/CmdK'

/* On charge les données de recherche dynamiquement côté client */
interface SearchArticle { type: 'article'; title: string; href: string; meta?: string }
interface SearchProject { type: 'project'; title: string; href: string }

export function ShellClient({ children }: { children: React.ReactNode }) {
  const locale = useLocale()
  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [articles, setArticles] = useState<SearchArticle[]>([])
  const [projects, setProjects] = useState<SearchProject[]>([])

  /* Ouvrir ⌘K avec le raccourci clavier */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdkOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  /* Charger les données search au premier open */
  const handleCmdkOpen = useCallback(async () => {
    setCmdkOpen(true)
    if (articles.length === 0) {
      try {
        const res = await fetch(`/api/search?locale=${locale}`)
        const data = await res.json()
        setArticles(data.articles || [])
        setProjects(data.projects || [])
      } catch {
        // silently fail — l'UI reste fonctionnelle
      }
    }
  }, [locale, articles.length])

  return (
    <ThemeProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Nav onCmdKOpen={handleCmdkOpen} />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </div>

      <CmdK
        open={cmdkOpen}
        onClose={() => setCmdkOpen(false)}
        articles={articles}
        projects={projects}
      />
    </ThemeProvider>
  )
}
