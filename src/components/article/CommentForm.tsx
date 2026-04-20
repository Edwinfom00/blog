'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface CommentFormProps {
  articleId: number
}

export function CommentForm({ articleId }: CommentFormProps) {
  const t = useTranslations('comments')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !content.trim()) return

    setStatus('loading')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, authorName: name, authorEmail: email, content }),
      })

      if (!res.ok) throw new Error()

      setStatus('success')
      setName(''); setEmail(''); setContent('')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--bg-tint)',
    border: '1px solid var(--rule)',
    borderRadius: 3,
    fontFamily: 'var(--font-ui)',
    fontSize: 14,
    color: 'var(--ink)',
    outline: 'none',
    transition: 'border-color .15s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    color: 'var(--ink-mute)',
    marginBottom: 6,
  }

  if (status === 'success') {
    return (
      <div
        style={{
          padding: '20px 24px',
          background: 'var(--bg-tint)',
          border: '1px solid var(--rule)',
          borderRadius: 4,
          fontFamily: 'var(--font-read)',
          fontStyle: 'italic',
          fontSize: 16,
          color: 'var(--ink-soft)',
        }}
      >
        {t('success')}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('form_name')}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('name_placeholder')}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>{t('form_email')}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('email_placeholder')}
            required
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>{t('form_content')}</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={t('content_placeholder')}
          required
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
        />
      </div>

      {status === 'error' && (
        <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontSize: 13, marginBottom: 12 }}>
          {t('error')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          padding: '10px 24px',
          background: 'var(--ink)',
          color: 'var(--bg)',
          border: 'none',
          borderRadius: 3,
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          fontWeight: 500,
          cursor: status === 'loading' ? 'wait' : 'pointer',
          transition: 'background .15s',
          opacity: status === 'loading' ? 0.7 : 1,
        }}
      >
        {status === 'loading' ? t('form_sending') : t('form_submit')}
      </button>
    </form>
  )
}
