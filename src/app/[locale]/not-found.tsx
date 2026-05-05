import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function NotFound() {
  let title = 'Page introuvable'
  let desc = 'Cette page n\'existe pas ou a été déplacée.'
  let back = 'Retour à l\'accueil'

  try {
    const t = await getTranslations('errors')
    title = t('not_found_title')
    desc = t('not_found_desc')
    back = t('back_home')
  } catch { /* use defaults */ }

  return (
    <div className="error-page">
      <div className="error-page-inner">
        <div className="error-number" aria-hidden>404</div>
        <div className="error-rule" />
        <h1 className="error-title">{title}</h1>
        <p className="error-desc">{desc}</p>
        <Link href="/" className="error-link">← {back}</Link>
      </div>
    </div>
  )
}
