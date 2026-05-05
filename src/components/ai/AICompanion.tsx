'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { useAI } from './AIContext'
import { StreamingMessage } from './StreamingMessage'

interface Message {
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

export function AICompanion({ dock = 'br' }: { dock?: 'br' | 'bl' | 'side' }) {
  const locale = useLocale() as 'fr' | 'en'
  const isFr = locale === 'fr'
  const { articleTitle, articleDek, articleBody } = useAI()

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  /* Focus textarea à l'ouverture */
  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 80)
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
    // Ajouter un message assistant vide qui va se remplir en streaming
    const streamingMsg: Message = { role: 'assistant', content: '', streaming: true }
    setMessages([...next, streamingMsg])

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          articleTitle,
          articleDek,
          articleBody,
          locale,
        }),
      })

      if (!res.ok) throw new Error('API error')

      // Lire le stream SSE
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const data = trimmed.slice(5).trim()
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            const token = parsed.token ?? ''
            if (token) {
              accumulated += token
              // Mettre à jour le dernier message en temps réel
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: accumulated, streaming: true }
                return updated
              })
            }
          } catch { /* skip */ }
        }
      }

      // Marquer le streaming comme terminé
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: accumulated, streaming: false }
        return updated
      })
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: isFr
            ? "Je n'ai pas pu répondre pour l'instant. Réessaye dans un instant."
            : "I couldn't answer right now. Try again in a moment.",
          streaming: false,
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, isFr, articleTitle, articleDek, articleBody, locale])

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
                <div className="ai-bubble-msg">
                  {m.role === 'assistant' ? (
                    <StreamingMessage content={m.content} streaming={m.streaming} />
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}

            {/* Dots uniquement si loading ET pas encore de contenu streamé */}
            {loading && messages[messages.length - 1]?.content === '' && (
              <div className="ai-msg ai-msg-assistant">
                <span className="ai-avatar" aria-hidden><SparkleIcon size={11} /></span>
                <div className="ai-bubble-msg ai-thinking">
                  <span className="ai-dot" /><span className="ai-dot" /><span className="ai-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Input — textarea avec bouton intégré */}
          <form
            className="ai-input-row"
            onSubmit={e => { e.preventDefault(); send() }}
          >
            <div className="ai-textarea-wrap">
              <textarea
                ref={textareaRef}
                className="ai-textarea"
                placeholder={isFr ? 'Pose ta question…' : 'Ask your question…'}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                rows={5}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
              />
              <button
                type="submit"
                className="ai-send-btn ai-send-btn--inline"
                disabled={!input.trim() || loading}
                aria-label={isFr ? 'Envoyer' : 'Send'}
              >
                <SendIcon />
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="ai-foot">
            <span>{isFr ? 'Entrée pour envoyer · Maj+Entrée pour sauter une ligne' : 'Enter to send · Shift+Enter for new line'}</span>
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
