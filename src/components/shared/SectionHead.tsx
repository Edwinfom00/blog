import { Link } from '@/i18n/navigation'

interface SectionHeadProps {
  kicker: string
  title: string
  seeAllHref?: string
  seeAllLabel?: string
}

export function SectionHead({ kicker, title, seeAllHref, seeAllLabel }: SectionHeadProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--rule)',
        paddingBottom: 16,
        marginBottom: 32,
      }}
    >
      <div>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 6,
          }}
        >
          {kicker}
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(28px, 3vw, 38px)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
            color: 'var(--ink)',
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      {seeAllHref && seeAllLabel && (
        <Link
          href={seeAllHref}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ink-soft)',
            textDecoration: 'none',
            transition: 'color .15s',
            paddingBottom: 2,
            whiteSpace: 'nowrap',
          }}
        >
          {seeAllLabel}
          <ArrowRight />
        </Link>
      )}
    </div>
  )
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
