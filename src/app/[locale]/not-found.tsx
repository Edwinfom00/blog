import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function NotFound() {
  // locale not available in not-found, use default
  let t: Awaited<ReturnType<typeof getTranslations>>
  try {
    t = await getTranslations('errors')
  } catch {
    return (
      <div style={{ maxWidth: 640, margin: '120px auto', padding: '0 32px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(56px, 10vw, 112px)', fontWeight: 400, lineHeight: 1, color: 'var(--ink)', margin: '0 0 24px' }}>
          404
        </h1>
        <p style={{ fontFamily: 'var(--font-read)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-soft)', marginBottom: 40 }}>
          Page introuvable.
        </p>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)', paddingBottom: 2 }}>
          ← Accueil
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: 640,
        margin: '120px auto',
        padding: '0 32px',
        textAlign: 'center',
      }}
    >
      {/* Numéro géant */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(80px, 18vw, 200px)',
          fontWeight: 400,
          lineHeight: 1,
          color: 'var(--accent)',
          opacity: 0.15,
          userSelect: 'none',
          marginBottom: -16,
        }}
      >
        404
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 400,
          lineHeight: 1.1,
          color: 'var(--ink)',
          margin: '0 0 16px',
        }}
      >
        {t('not_found_title')}
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-read)',
          fontStyle: 'italic',
          fontSize: 17,
          color: 'var(--ink-soft)',
          marginBottom: 48,
        }}
      >
        {t('not_found_desc')}
      </p>

      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          textDecoration: 'none',
          borderBottom: '1px solid var(--accent)',
          paddingBottom: 2,
          transition: 'opacity .15s',
        }}
      >
        ← {t('back_home')}
      </Link>
    </div>
  )
}
