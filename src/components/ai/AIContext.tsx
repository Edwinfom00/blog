'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface AIContextValue {
  articleTitle?: string
  articleDek?: string
  setArticleContext: (title: string, dek: string) => void
  clearArticleContext: () => void
}

const AIContext = createContext<AIContextValue>({
  setArticleContext: () => {},
  clearArticleContext: () => {},
})

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [articleTitle, setArticleTitle] = useState<string | undefined>()
  const [articleDek, setArticleDek] = useState<string | undefined>()

  const setArticleContext = useCallback((title: string, dek: string) => {
    setArticleTitle(title)
    setArticleDek(dek)
  }, [])

  const clearArticleContext = useCallback(() => {
    setArticleTitle(undefined)
    setArticleDek(undefined)
  }, [])

  return (
    <AIContext.Provider value={{ articleTitle, articleDek, setArticleContext, clearArticleContext }}>
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  return useContext(AIContext)
}
