import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '0 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: '50%',
            background: 'var(--ink)',
            color: 'var(--bg)',
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            EF
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 28,
            fontWeight: 400,
            color: 'var(--ink)',
            margin: '0 0 8px',
          }}>
            Edwin Fom
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}>
            Dashboard · Accès privé
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
