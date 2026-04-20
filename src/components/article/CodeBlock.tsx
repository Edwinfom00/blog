'use client'

import { useState } from 'react'

type CodeStyle = 'paper' | 'minimal' | 'terminal'

interface CodeBlockProps {
  lang: string
  code: string
  style?: CodeStyle
}

/* Highlight maison minimaliste (sans dépendance externe) */
function highlight(code: string, lang: string): string {
  // Échappe d'abord le HTML
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Diff markers
  escaped = escaped.replace(/^(\+ .*)$/gm, '<span class="tok-add">$1</span>')
  escaped = escaped.replace(/^(- .*)$/gm, '<span class="tok-del">$1</span>')

  if (['ts', 'tsx', 'js', 'jsx', 'css', 'bash', 'sh'].includes(lang)) {
    // Commentaires
    escaped = escaped.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)(?![^<]*>)/g, '<span class="tok-c">$1</span>')
    // Strings
    escaped = escaped.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)(?![^<]*>)/g, '<span class="tok-s">$1</span>')
    // Keywords
    const keywords = ['export', 'import', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'new', 'typeof', 'async', 'await', 'default', 'type', 'interface', 'enum']
    const kw = new RegExp(`\\b(${keywords.join('|')})\\b(?![^<]*>)`, 'g')
    escaped = escaped.replace(kw, '<span class="tok-k">$1</span>')
    // Numbers
    escaped = escaped.replace(/\b(\d+\.?\d*)\b(?![^<]*>)/g, '<span class="tok-n">$1</span>')
  }

  return escaped
}

export function CodeBlock({ lang, code, style = 'paper' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const highlighted = highlight(code, lang)

  return (
    <div className="code-block" data-style={style}>
      {style === 'paper' && (
        <div className="code-head">
          <span>{lang.toUpperCase()}</span>
          <button
            onClick={handleCopy}
            aria-label="Copier le code"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: copied ? 'var(--accent)' : 'var(--ink-mute)',
              transition: 'color .15s',
              background: 'none', border: 'none', cursor: 'pointer',
              letterSpacing: '.06em',
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copié' : 'Copier'}
          </button>
        </div>
      )}
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  )
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
