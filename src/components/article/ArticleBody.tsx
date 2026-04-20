import { CodeBlock } from './CodeBlock'
import type { Block } from '@/db/schema'

interface ArticleBodyProps {
  blocks: Block[]
  codeStyle?: 'paper' | 'minimal' | 'terminal'
}

export function ArticleBody({ blocks, codeStyle = 'paper' }: ArticleBodyProps) {
  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={i} dangerouslySetInnerHTML={{ __html: block.text }} />
            )

          case 'h2':
            return (
              <h2
                key={i}
                id={block.id}
                dangerouslySetInnerHTML={{
                  __html: typeof block.text === 'string' ? block.text : block.text.fr,
                }}
              />
            )

          case 'quote':
            return (
              <blockquote key={i}>
                <p>{block.text}</p>
              </blockquote>
            )

          case 'list':
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
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
