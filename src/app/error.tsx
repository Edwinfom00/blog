'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html>
      <body>
        <div className="error-page">
          <div className="error-page-inner">
            <div className="error-number" aria-hidden>500</div>
            <div className="error-rule" />
            <h1 className="error-title">Une erreur est survenue</h1>
            <p className="error-desc">
              Quelque chose s'est mal passé côté serveur.
            </p>
            <button onClick={reset} className="error-btn">
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
