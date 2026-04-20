'use client'

import { useEffect } from 'react'
import { useAI } from './AIContext'

interface AIArticleSyncProps {
  title: string
  dek: string
}

/**
 * Composant invisible — synchronise le titre/dek de l'article courant
 * dans le contexte AI dès que la page article est montée.
 */
export function AIArticleSync({ title, dek }: AIArticleSyncProps) {
  const { setArticleContext, clearArticleContext } = useAI()

  useEffect(() => {
    setArticleContext(title, dek)
    return () => clearArticleContext()
  }, [title, dek, setArticleContext, clearArticleContext])

  return null
}
