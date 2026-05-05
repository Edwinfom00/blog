'use client'

import { useEffect } from 'react'
import { useAI } from './AIContext'

interface AIArticleSyncProps {
  title: string
  dek: string
  body?: string
}

export function AIArticleSync({ title, dek, body }: AIArticleSyncProps) {
  const { setArticleContext, clearArticleContext } = useAI()

  useEffect(() => {
    setArticleContext(title, dek, body)
    return () => clearArticleContext()
  }, [title, dek, body, setArticleContext, clearArticleContext])

  return null
}
