'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Nav } from '@/components/layout/Nav'
import { CmdK } from '@/components/shared/CmdK'
import { AICompanion } from '@/components/ai/AICompanion'
import { AIProvider } from '@/components/ai/AIContext'

interface SearchArticle { type: 'article'; title: string; href: string; meta?: string }
interface SearchProject { type: 'project'; title: string; href: string }

interface ShellClientProps {
  children: React.ReactNode
  footer: React.ReactNode
}

export function ShellClient({ children, footer }: ShellClientProps) {
  const locale = useLocale()
  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [articles, setArticles] = useState<SearchArticle[]>([])
  const [projects, setProjects] = useState<SearchProject[]>([])

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

  const handleCmdkOpen = useCallback(async () => {
    setCmdkOpen(true)
    if (articles.length === 0) {
      try {
        const res = await fetch(`/api/search?locale=${locale}`)
        const data = await res.json()
        setArticles(data.articles || [])
        setProjects(data.projects || [])
      } catch {}
    }
  }, [locale, articles.length])

  return (
    <ThemeProvider>
      <AIProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Nav onCmdKOpen={handleCmdkOpen} />
          <main style={{ flex: 1 }}>{children}</main>
          {footer}
        </div>
        <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} articles={articles} projects={projects} />
        <AICompanion />
      </AIProvider>
    </ThemeProvider>
  )
}
