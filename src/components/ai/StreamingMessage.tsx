'use client'

import { useMemo } from 'react'

interface StreamingMessageProps {
  content: string
  streaming?: boolean
}

/**
 * Formate et affiche un message IA avec Markdown inline.
 * Supporte : **gras**, *italique*, `code`, [lien](url), et les blocs de code ```
 */
function formatMessage(text: string): string {
  if (!text) return ''

  // Blocs de code ```lang\n...\n```
  let result = text.replace(
    /```(\w*)\n?([\s\S]*?)```/g,
    (_, lang, code) =>
      `<pre class="ai-code-block"><code class="lang-${lang || 'text'}">${escHtml(code.trim())}</code></pre>`
  )

  // Traiter ligne par ligne pour le reste
  result = result
    .split('\n')
    .map(line => {
      // Titres ## → bold
      if (line.startsWith('### ')) return `<strong>${line.slice(4)}</strong>`
      if (line.startsWith('## ')) return `<strong>${line.slice(3)}</strong>`
      if (line.startsWith('# ')) return `<strong>${line.slice(2)}</strong>`
      // Items de liste
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return `<span class="ai-list-item">· ${inlineFormat(line.slice(2))}</span>`
      }
      return inlineFormat(line)
    })
    .join('\n')

  // Convertir les sauts de ligne en <br> (sauf autour des blocs pre)
  result = result
    .replace(/\n{2,}/g, '<br><br>')
    .replace(/\n/g, '<br>')
    // Nettoyer les <br> autour des blocs pre
    .replace(/<br>(<pre)/g, '$1')
    .replace(/<\/pre><br>/g, '</pre>')

  return result
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+)`/g, '<code class="ai-inline-code">$1</code>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="ai-link">$1</a>'
    )
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function StreamingMessage({ content, streaming = false }: StreamingMessageProps) {
  const html = useMemo(() => formatMessage(content), [content])

  return (
    <span
      className={`ai-message-content${streaming ? ' ai-message-streaming' : ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
