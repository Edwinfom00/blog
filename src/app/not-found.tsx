import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-page-inner">
        <div className="error-number" aria-hidden>404</div>
        <div className="error-rule" />
        <h1 className="error-title">Page introuvable</h1>
        <p className="error-desc">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link href="/" className="error-link">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
