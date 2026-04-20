import { getTranslations } from 'next-intl/server'
import { Rule } from '@/components/shared/Rule'
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
  const isFr = locale === 'fr'

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
      {/* ─── Hero ─── */}
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'end',
          padding: '64px 0 48px',
          borderBottom: '1px solid var(--rule)',
          marginBottom: 64,
        }}
        className="about-header"
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              display: 'block',
              marginBottom: 16,
            }}
          >
            Edwin Fom
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(48px, 8vw, 96px)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            {isFr ? 'À propos' : 'About'}
          </h1>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-read)',
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.6,
            color: 'var(--ink-soft)',
            margin: 0,
          }}
        >
          {isFr
            ? 'Développeur web, auteur de paquets open-source, et rédacteur de ce journal depuis 2021.'
            : 'Web developer, open-source package author, and writer of this journal since 2021.'}
        </p>
      </header>

      {/* ─── Corps ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 80,
          alignItems: 'start',
          marginBottom: 96,
        }}
        className="about-body"
      >
        {/* Texte principal */}
        <div className="article-body">
          {isFr ? (
            <>
              <p>
                Je suis Edwin Fom, développeur web basé au Cameroun. Je travaille principalement avec Next.js, TypeScript, et un goût prononcé pour les détails typographiques et les interfaces qui respirent.
              </p>
              <p>
                Ce journal est l'endroit où je consigne ce que j'apprends, ce que je construis, et les questions qui me trottent dans la tête. Pas de newsletter, pas de notifications push. Un article quand j'ai quelque chose à dire — et seulement à ce moment-là.
              </p>
              <p>
                J'ai commencé à écrire ici en 2021, d'abord pour moi, puis pour les autres. Les sujets varient : architecture front-end, performance, typographie web, outils de développement, et parfois des réflexions plus larges sur le métier.
              </p>
              <p>
                En dehors du journal, je maintiens plusieurs paquets open-source et je travaille sur des projets personnels qui explorent les limites de ce qu'on peut faire avec du HTML, du CSS et un peu de JavaScript bien placé.
              </p>
            </>
          ) : (
            <>
              <p>
                I'm Edwin Fom, a web developer based in Cameroon. I work primarily with Next.js, TypeScript, and a strong appreciation for typographic detail and interfaces that breathe.
              </p>
              <p>
                This journal is where I write about what I learn, what I build, and the questions that keep me up. No newsletter, no push notifications. One article when I have something to say — and only then.
              </p>
              <p>
                I started writing here in 2021, first for myself, then for others. Topics vary: front-end architecture, performance, web typography, developer tooling, and occasionally broader reflections on the craft.
              </p>
              <p>
                Outside the journal, I maintain several open-source packages and work on personal projects that explore the limits of what you can do with HTML, CSS, and well-placed JavaScript.
              </p>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 88 }}>
          {/* Liens */}
          <div
            style={{
              padding: 20,
              background: 'var(--bg-tint)',
              borderRadius: 4,
              marginBottom: 24,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
                marginBottom: 12,
              }}
            >
              {isFr ? 'Ailleurs' : 'Elsewhere'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: 'https://www.edwinfom.dev/', label: 'edwinfom.dev' },
                { href: 'https://packages.edwinfom.dev/', label: 'packages.edwinfom.dev' },
                { href: 'https://github.com/edwinfom', label: 'github.com/edwinfom' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    color: 'var(--ink-soft)',
                    textDecoration: 'none',
                    transition: 'color .15s',
                  }}
                  className="about-link"
                >
                  {label}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div
            style={{
              padding: 20,
              background: 'var(--bg-tint)',
              borderRadius: 4,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
                marginBottom: 12,
              }}
            >
              Stack
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Next.js', 'TypeScript', 'Tailwind CSS', 'Drizzle ORM', 'PostgreSQL', 'Vercel'].map(item => (
                <span
                  key={item}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--ink-soft)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
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
