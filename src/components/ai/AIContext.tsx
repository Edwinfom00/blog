'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface AIContextValue {
  articleTitle?: string
  articleDek?: string
  articleBody?: string
  setArticleContext: (title: string, dek: string, body?: string) => void
  clearArticleContext: () => void
}

const AIContext = createContext<AIContextValue>({
  setArticleContext: () => {},
  clearArticleContext: () => {},
})

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [articleTitle, setArticleTitle] = useState<string | undefined>()
  const [articleDek, setArticleDek] = useState<string | undefined>()
  const [articleBody, setArticleBodyState] = useState<string | undefined>()

  const setArticleContext = useCallback((title: string, dek: string, body?: string) => {
    setArticleTitle(title)
    setArticleDek(dek)
    setArticleBodyState(body)
  }, [])

  const clearArticleContext = useCallback(() => {
    setArticleTitle(undefined)
    setArticleDek(undefined)
    setArticleBodyState(undefined)
  }, [])

  return (
    <AIContext.Provider value={{ articleTitle, articleDek, articleBody, setArticleContext, clearArticleContext }}>
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  return useContext(AIContext)
}
