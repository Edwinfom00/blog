import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('title') }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px 96px' }}>
      <header style={{ marginBottom: 48 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
          Edwin Fom
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 32px' }}>
          {locale === 'fr' ? 'À propos' : 'About'}
        </h1>
        <div style={{ borderTop: '1px solid var(--rule)' }} />
      </header>

      <div className="article-body">
        {locale === 'fr' ? (
          <>
            <p>
              Je suis Edwin Fom, développeur web basé en France. Je travaille principalement avec Next.js, TypeScript, et un goût prononcé pour les détails typographiques.
            </p>
            <p>
              Ce journal est l'endroit où je consigne ce que j'apprends, ce que je construis, et les questions qui me trottent dans la tête. Pas de newsletter, pas de notifications. Un article quand j'ai quelque chose à dire.
            </p>
            <p>
              Tu peux retrouver mon travail sur <a href="https://www.edwinfom.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>edwinfom.dev</a>, ou parcourir mes packages open-source sur <a href="https://packages.edwinfom.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>packages.edwinfom.dev</a>.
            </p>
          </>
        ) : (
          <>
            <p>
              I'm Edwin Fom, a web developer based in France. I work primarily with Next.js, TypeScript, and a strong appreciation for typographic detail.
            </p>
            <p>
              This journal is where I write about what I learn, what I build, and the questions that keep me up. No newsletter, no notifications. One article when I have something to say.
            </p>
            <p>
              You can find my work at <a href="https://www.edwinfom.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>edwinfom.dev</a>, or browse my open-source packages at <a href="https://packages.edwinfom.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>packages.edwinfom.dev</a>.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
