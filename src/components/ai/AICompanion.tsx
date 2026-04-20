'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { useAI } from './AIContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AICompanion({ dock = 'br' }: { dock?: 'br' | 'bl' | 'side' }) {
  const locale = useLocale() as 'fr' | 'en'
  const isFr = locale === 'fr'
  const { articleTitle, articleDek } = useAI()

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  /* ⌘J pour ouvrir */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  /* Focus input à l'ouverture */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  /* Scroll to bottom on new message */
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const suggestions = articleTitle
    ? isFr
      ? ['Résume-moi cet article', 'Explique la partie technique', 'Donne un exemple concret']
      : ['Summarize this article', 'Explain the technical part', 'Give a concrete example']
    : isFr
      ? ["Qui est Edwin ?", "Par quoi commencer ?", "Quels projets a-t-il publiés ?"]
      : ["Who is Edwin?", "Where should I start?", "What has he shipped?"]

  const send = useCallback(async (forced?: string) => {
    const q = (forced ?? input).trim()
    if (!q || loading) return
    setInput('')
    setLoading(true)
    const next: Message[] = [...messages, { role: 'user', content: q }]
    setMessages(next)

    try {
      /* Appel DeepSeek via notre API route */
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          articleContext: articleTitle
            ? `${articleTitle}${articleDek ? ' — ' + articleDek : ''}`
            : undefined,
          locale,
        }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(m => [...m, {
        role: 'assistant',
        content: isFr
          ? "Je n'ai pas pu répondre pour l'instant. Réessaye dans un instant."
          : "I couldn't answer right now. Try again in a moment.",
      }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, isFr, articleTitle])

  const dockPos = dock === 'bl' ? 'ai-bl' : dock === 'side' ? 'ai-side' : 'ai-br'

  return (
    <>
      {/* ─── Bubble ─── */}
      <button
        className={`ai-bubble ${dockPos}${open ? ' is-open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label={isFr ? 'Compagnon de lecture' : 'Reading companion'}
      >
        <span className="bub-icon">
          {open ? <XIcon /> : <SparkleIcon />}
        </span>
        {!open && (
          <span className="bub-label">
            {isFr ? 'Poser une question' : 'Ask a question'}
          </span>
        )}
        {!open && <span className="bub-halo" aria-hidden />}
      </button>

      {/* ─── Panel ─── */}
      {open && (
        <div className={`ai-panel ${dockPos}`} role="dialog" aria-label={isFr ? 'Compagnon de lecture' : 'Reading companion'}>
          {/* Header */}
          <header className="ai-head">
            <div className="ai-head-left">
              <span className="ai-orn" aria-hidden><SparkleIcon size={13} /></span>
              <div className="ai-head-text">
                <div className="ai-title">
                  {isFr ? 'Compagnon de lecture' : 'Reading companion'}
                </div>
                <div className="ai-sub">
                  {articleTitle
                    ? (isFr ? 'À propos de : ' : 'About: ') + articleTitle
                    : isFr ? 'Journal d\'Edwin Fom' : 'Edwin Fom\'s journal'}
                </div>
              </div>
            </div>
            <button className="ai-close" onClick={() => setOpen(false)} aria-label={isFr ? 'Fermer' : 'Close'}>
              <XIcon />
            </button>
          </header>

          {/* Body */}
          <div className="ai-body" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="ai-welcome">
                <p className="ai-welcome-line">
                  {isFr
                    ? "Je suis là pour t'aider à comprendre ce qu'Edwin a écrit. Pose-moi une question — je reste bref."
                    : "I'm here to help you understand what Edwin wrote. Ask me anything — I'll keep it brief."}
                </p>
                <div className="ai-suggestions">
                  {suggestions.map((s, i) => (
                    <button key={i} className="ai-suggestion-btn" onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ai-msg-${m.role}`}>
                {m.role === 'assistant' && (
                  <span className="ai-avatar" aria-hidden><SparkleIcon size={11} /></span>
                )}
                <div
                  className="ai-bubble-msg"
                  dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br/>') }}
                />
              </div>
            ))}

            {loading && (
              <div className="ai-msg ai-msg-assistant">
                <span className="ai-avatar" aria-hidden><SparkleIcon size={11} /></span>
                <div className="ai-bubble-msg ai-thinking">
                  <span className="ai-dot" /><span className="ai-dot" /><span className="ai-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            className="ai-input-row"
            onSubmit={e => { e.preventDefault(); send() }}
          >
            <input
              ref={inputRef}
              className="ai-input"
              placeholder={isFr ? 'Pose ta question…' : 'Ask your question…'}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="ai-send-btn"
              disabled={!input.trim() || loading}
              aria-label={isFr ? 'Envoyer' : 'Send'}
            >
              <SendIcon />
            </button>
          </form>

          {/* Footer */}
          <div className="ai-foot">
            <span>{isFr ? 'Propulsé par DeepSeek' : 'Powered by DeepSeek'}</span>
            <span className="ai-foot-dot">·</span>
            <span>{isFr ? 'Répond en se basant sur les articles' : 'Answers grounded in the articles'}</span>
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Icônes ─── */
function SparkleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1M4.22 4.22l.7.7m13.86 13.86.7.7M3 12h1m16 0h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}
