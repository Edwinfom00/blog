import { NextRequest, NextResponse } from 'next/server'

// Formatage inline — côté serveur uniquement, pas de risque de freeze navigateur
function inlineMarkdown(text: string): string {
  if (!text) return text
  return text
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

function safeParseBlocks(md: string) {
  if (!md?.trim()) return []
  try {
    const lines = md.split('\n')
    const blocks: any[] = []
    let i = 0
    while (i < lines.length && blocks.length < 300) {
      const raw = lines[i]
      const line = raw.trim()

      if (!line) { i++; continue }

      if (line.startsWith('## ')) {
        const txt = line.slice(3).trim()
        const id = txt.toLowerCase().normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '').trim()
          .replace(/\s+/g, '-') || `h2-${i}`
        blocks.push({ type: 'h2', id, text: { fr: txt, en: txt } })
        i++
      } else if (line.startsWith('> ')) {
        blocks.push({ type: 'quote', text: inlineMarkdown(line.slice(2).trim()) })
        i++
      } else if (line.startsWith('```')) {
        const lang = line.slice(3).trim() || 'js'
        const codeLines: string[] = []
        i++
        let c = 0
        while (i < lines.length && !lines[i].startsWith('```') && c < 200) {
          codeLines.push(lines[i]); i++; c++
        }
        if (i < lines.length && lines[i].startsWith('```')) i++
        blocks.push({ type: 'code', lang, code: codeLines.join('\n') })
      } else if (line.startsWith('- ')) {
        const items: string[] = []
        let c = 0
        while (i < lines.length && lines[i].trim().startsWith('- ') && c < 50) {
          items.push(inlineMarkdown(lines[i].trim().slice(2))); i++; c++
        }
        if (items.length) blocks.push({ type: 'list', items })
      } else {
        // Paragraphe — inclut les H1 (#) traités comme texte normal
        const paraLines: string[] = []
        let c = 0
        while (
          i < lines.length &&
          lines[i].trim() &&
          !lines[i].trim().startsWith('## ') &&   // H2 → stop
          !lines[i].trim().startsWith('> ') &&     // quote → stop
          !lines[i].trim().startsWith('```') &&    // code → stop
          !lines[i].trim().startsWith('- ') &&     // list → stop
          c < 20
        ) {
          // H1 (#) traité comme texte de paragraphe
          const l = lines[i].trim()
          paraLines.push(l.startsWith('# ') ? l.slice(2) : l)
          i++; c++
        }
        if (paraLines.length) {
          blocks.push({ type: 'p', text: inlineMarkdown(paraLines.join(' ')) })
        } else {
          i++ // ligne orpheline — on avance quoi qu'il arrive
        }
      }
    }
    return blocks
  } catch { return [] }
}

export async function POST(req: NextRequest) {
  try {
    const { fr, en } = await req.json()
    return NextResponse.json({
      fr: safeParseBlocks(fr ?? ''),
      en: safeParseBlocks(en ?? ''),
    })
  } catch {
    return NextResponse.json({ fr: [], en: [] })
  }
}
