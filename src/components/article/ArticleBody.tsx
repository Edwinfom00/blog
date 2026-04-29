import { CodeBlock } from './CodeBlock'
import type { Block } from '@/db/schema'

interface ArticleBodyProps {
  blocks: Block[]
  codeStyle?: 'paper' | 'minimal' | 'terminal'
}

/** Applique le formatage inline si le texte ne contient pas déjà de HTML */
function renderInline(text: string): string {
  if (/<[a-z][\s\S]*>/i.test(text)) return text // déjà du HTML
  return text
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

export function ArticleBody({ blocks, codeStyle = 'paper' }: ArticleBodyProps) {
  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(block.text) }} />
            )

          case 'h2':
            return (
              <h2
                key={i}
                id={block.id}
                dangerouslySetInnerHTML={{
                  __html: renderInline(typeof block.text === 'string' ? block.text : block.text.fr),
                }}
              />
            )

          case 'quote':
            return (
              <blockquote key={i}>
                <p dangerouslySetInnerHTML={{ __html: renderInline(block.text) }} />
              </blockquote>
            )

          case 'list':
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
                ))}
              </ul>
            )

          case 'code':
            return (
              <CodeBlock
                key={i}
                lang={block.lang}
                code={block.code}
                style={codeStyle}
              />
            )

          default:
            return null
        }
      })}
    </div>
  )
}
