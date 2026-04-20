/**
 * Génération automatique du TOC et des tags via DeepSeek
 * Appelé à la publication d'un article.
 */

import type { Block } from '@/db/schema'

interface TocItem {
  anchorId: string
  labelFr: string
  labelEn: string
  sortOrder: number
}

interface Tags {
  fr: string[]
  en: string[]
}

interface AIArticleMeta {
  toc: TocItem[]
  tags: Tags
}

/** Extrait le texte brut des blocs pour le contexte IA */
function blocksToPlainText(blocks: Block[]): string {
  return blocks.map(b => {
    if (b.type === 'p') return b.text.replace(/<[^>]+>/g, '')
    if (b.type === 'h2') return typeof b.text === 'string' ? b.text : b.text.fr
    if (b.type === 'quote') return b.text
    if (b.type === 'list') return b.items.join(', ')
    if (b.type === 'code') return `[code ${b.lang}]`
    return ''
  }).filter(Boolean).join('\n').slice(0, 3000)
}

export async function generateArticleMeta(
  titleFr: string,
  titleEn: string,
  bodyFr: Block[],
  bodyEn: Block[],
): Promise<AIArticleMeta> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    // Fallback : extraire le TOC depuis les blocs h2 existants
    return fallbackMeta(bodyFr, bodyEn)
  }

  const textFr = blocksToPlainText(bodyFr)
  const textEn = blocksToPlainText(bodyEn)

  const prompt = `Tu es un assistant éditorial. Analyse cet article de blog et génère :
1. Le sommaire (TOC) — uniquement les titres H2 présents dans le texte
2. Les tags thématiques (3 à 5 tags, courts, en minuscules)

Article FR : "${titleFr}"
${textFr}

---

Article EN : "${titleEn}"
${textEn}

Réponds UNIQUEMENT avec ce JSON (pas de markdown, pas d'explication) :
{
  "toc": [
    { "anchorId": "slug-du-titre", "labelFr": "Titre en français", "labelEn": "Title in English", "sortOrder": 0 }
  ],
  "tags": {
    "fr": ["tag1", "tag2", "tag3"],
    "en": ["tag1", "tag2", "tag3"]
  }
}`

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.3,
      }),
    })

    if (!response.ok) throw new Error(`DeepSeek ${response.status}`)

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content ?? ''

    // Nettoyer le JSON (DeepSeek peut wrapper dans ```json```)
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const parsed = JSON.parse(cleaned) as AIArticleMeta
    return parsed
  } catch (e) {
    console.error('[AI article meta] DeepSeek error, using fallback:', e)
    return fallbackMeta(bodyFr, bodyEn)
  }
}

/** Fallback : extrait le TOC depuis les blocs h2, tags vides */
function fallbackMeta(bodyFr: Block[], bodyEn: Block[]): AIArticleMeta {
  const h2Fr = bodyFr.filter(b => b.type === 'h2') as Extract<Block, { type: 'h2' }>[]
  const h2En = bodyEn.filter(b => b.type === 'h2') as Extract<Block, { type: 'h2' }>[]

  const toc: TocItem[] = h2Fr.map((b, i) => {
    const labelFr = typeof b.text === 'string' ? b.text : b.text.fr
    const enBlock = h2En[i]
    const labelEn = enBlock
      ? (typeof enBlock.text === 'string' ? enBlock.text : enBlock.text.en)
      : labelFr
    return {
      anchorId: b.id,
      labelFr,
      labelEn,
      sortOrder: i,
    }
  })

  return { toc, tags: { fr: [], en: [] } }
}
