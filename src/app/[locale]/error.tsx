'use client'

import { useEffect } from 'react'
import { Link } from '@/i18n/navigation'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="error-page">
      <div className="error-page-inner">
        <div className="error-number" aria-hidden>500</div>
        <div className="error-rule" />
        <h1 className="error-title">Une erreur est survenue</h1>
        <p className="error-desc">
          Quelque chose s'est mal passé. Tu peux réessayer ou revenir à l'accueil.
        </p>
        <div className="error-actions">
          <button onClick={reset} className="error-btn">
            Réessayer
          </button>
          <Link href="/" className="error-link">
            ← Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
