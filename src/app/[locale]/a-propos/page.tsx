import { getTranslations } from 'next-intl/server'
import { getAboutSettings } from '@/lib/settings'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('title') }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const isFr = locale === 'fr'
  const about = await getAboutSettings()

  // Convertir les paragraphes de bio en tableau
  const bioParagraphs = (isFr ? about.bioFr : about.bioEn)
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
      <header className="about-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', padding: '64px 0 48px', borderBottom: '1px solid var(--rule)', marginBottom: 64 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: 16 }}>
            Edwin Fom
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 1, letterSpacing: '-0.01em', color: 'var(--ink)', margin: 0 }}>
            {isFr ? 'À propos' : 'About'}
          </h1>
        </div>
        <p style={{ fontFamily: 'var(--font-read)', fontStyle: 'italic', fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>
          {isFr ? about.taglineFr : about.taglineEn}
        </p>
      </header>

      <div className="about-body" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 80, alignItems: 'start', marginBottom: 96 }}>
        <div className="article-body">
          {bioParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <aside style={{ position: 'sticky', top: 88 }}>
          {/* Liens */}
          <div style={{ padding: 20, background: 'var(--bg-tint)', borderRadius: 4, marginBottom: 24 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 12 }}>
              {isFr ? 'Ailleurs' : 'Elsewhere'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {about.links.map(({ href, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="about-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-soft)', textDecoration: 'none', transition: 'color .15s' }}>
                  {label}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Stack */}
          {about.stack.length > 0 && (
            <div style={{ padding: 20, background: 'var(--bg-tint)', borderRadius: 4 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 12 }}>Stack</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {about.stack.map(item => (
                  <span key={item} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)' }}>{item}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <style>{`
        .about-link:hover { color: var(--ink) !important; }
        @media (max-width: 900px) {
          .about-header { grid-template-columns: 1fr !important; gap: 24px !important; }
          .about-body { grid-template-columns: 1fr !important; gap: 40px !important; }
          .about-body aside { position: static !important; }
        }
      `}</style>
    </div>
  )
}
