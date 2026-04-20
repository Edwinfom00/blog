'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    try {
      const result = await authClient.signIn.magicLink({
        email: email.trim(),
        callbackURL: '/dashboard',
      })
      if (result.error) {
        setError(result.error.message ?? JSON.stringify(result.error))
      } else {
        setSent(true)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : JSON.stringify(e))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={{
        padding: '32px 24px',
        background: 'var(--bg-tint)',
        border: '1px solid var(--rule)',
        borderRadius: 6,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>✉</div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 22,
          fontWeight: 400,
          color: 'var(--ink)',
          margin: '0 0 12px',
        }}>
          Vérifie ta boîte mail
        </h2>
        <p style={{
          fontFamily: 'var(--font-read)',
          fontStyle: 'italic',
          fontSize: 15,
          lineHeight: 1.6,
          color: 'var(--ink-soft)',
          margin: '0 0 20px',
        }}>
          Un lien de connexion a été envoyé à <strong>{email}</strong>. Il expire dans 5 minutes.
        </p>
        <button
          onClick={() => { setSent(false); setEmail('') }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--ink-mute)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '.06em',
          }}
        >
          ← Renvoyer un lien
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        padding: '32px 24px',
        background: 'var(--bg-tint)',
        border: '1px solid var(--rule)',
        borderRadius: 6,
      }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: 'var(--ink-mute)',
          marginBottom: 8,
        }}>
          Adresse email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="ton@email.com"
          required
          autoFocus
          style={{
            width: '100%',
            padding: '11px 14px',
            border: '1px solid var(--rule)',
            borderRadius: 4,
            background: 'var(--surface)',
            fontFamily: 'var(--font-ui)',
            fontSize: 15,
            color: 'var(--ink)',
            outline: 'none',
            marginBottom: 16,
            transition: 'border-color .15s',
            boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--rule)'}
        />

        {error && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: '#C4453A',
            marginBottom: 12,
          }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim()}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--ink)',
            color: 'var(--bg)',
            border: 'none',
            borderRadius: 4,
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || !email.trim() ? .6 : 1,
            transition: 'background .15s, opacity .15s',
          }}
        >
          {loading ? 'Envoi…' : 'Recevoir le lien de connexion'}
        </button>
      </div>

      <p style={{
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--ink-mute)',
        marginTop: 16,
        letterSpacing: '.04em',
      }}>
        Accès réservé à Edwin Fom
      </p>
    </form>
  )
}
