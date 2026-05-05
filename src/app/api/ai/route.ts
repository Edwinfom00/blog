import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
  articleTitle: z.string().optional(),
  articleDek: z.string().optional(),
  articleBody: z.string().optional(),
  locale: z.enum(['fr', 'en']).default('fr'),
})

const EDWIN_BIO_FR = `Edwin Fom est un développeur web basé au Cameroun. Il travaille principalement avec Next.js, TypeScript, Tailwind CSS, Drizzle ORM et PostgreSQL. Il publie des packages open-source sur npm (edwinfom.dev, packages.edwinfom.dev, github.com/edwinfom). Ce journal existe depuis 2024 — il y écrit sur l'architecture front-end, la performance, la typographie web, les outils de développement, et parfois des réflexions plus larges sur le métier. Il publie un article quand il a quelque chose à dire, pas selon un calendrier.`

const EDWIN_BIO_EN = `Edwin Fom is a web developer based in Cameroon. He works primarily with Next.js, TypeScript, Tailwind CSS, Drizzle ORM and PostgreSQL. He publishes open-source packages on npm (edwinfom.dev, packages.edwinfom.dev, github.com/edwinfom). This journal has existed since 2024 — he writes about front-end architecture, performance, web typography, developer tooling, and occasionally broader reflections on the craft. He publishes an article when he has something to say, not on a schedule.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, articleTitle, articleDek, articleBody, locale } = schema.parse(body)

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 })
    }

    const isFr = locale === 'fr'
    const hasArticle = !!(articleTitle || articleBody)

    const systemPrompt = isFr ? buildPromptFr(hasArticle, articleTitle, articleDek, articleBody)
                               : buildPromptEn(hasArticle, articleTitle, articleDek, articleBody)

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 350,
        temperature: 0.65,
        stream: true,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('DeepSeek error:', err)
      return NextResponse.json({ error: 'AI error' }, { status: 502 })
    }

    // Streamer la réponse directement au client
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            // SSE lines: "data: {...}\n\n"
            for (const line of chunk.split('\n')) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data:')) continue
              const data = trimmed.slice(5).trim()
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                break
              }
              try {
                const parsed = JSON.parse(data)
                const token = parsed.choices?.[0]?.delta?.content ?? ''
                if (token) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`))
                }
              } catch { /* skip malformed */ }
            }
          }
        } finally {
          controller.close()
          reader.releaseLock()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err) {
    console.error('AI route error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

function buildPromptFr(
  hasArticle: boolean,
  title?: string,
  dek?: string,
  body?: string,
): string {
  const base = `Tu es le compagnon de lecture intégré au journal personnel d'Edwin Fom.

## Qui est Edwin Fom
${EDWIN_BIO_FR}

## Ton rôle
Tu aides le lecteur à mieux comprendre et explorer les textes d'Edwin. Tu réponds uniquement à partir du contenu de ce journal — tu ne cites jamais d'autres blogs, médias ou auteurs sauf si le lecteur le demande explicitement. Tu ne parles pas du New York Times, de Medium, de Substack ou d'autres publications. Tout ce que tu sais vient d'Edwin et de ce journal.

## Ton style
- Réponses courtes : 2 à 4 phrases maximum, sauf si le lecteur demande plus de détails
- Ton direct et conversationnel, comme quelqu'un qui a lu le même texte
- Pas de formules creuses ("Bien sûr !", "Excellente question !", "Absolument")
- Pas de listes à puces sauf si vraiment nécessaire
- Tu tutoies le lecteur
- Tu réponds toujours en français`

  if (!hasArticle) {
    return `${base}

## Contexte actuel
Le lecteur est sur la page d'accueil ou une page générale du journal. Tu peux parler du journal, des thèmes abordés par Edwin, de ses projets open-source, ou orienter le lecteur vers des articles qui pourraient l'intéresser.`
  }

  return `${base}

## Article en cours de lecture
**Titre :** ${title ?? ''}
${dek ? `**Accroche :** ${dek}` : ''}

**Contenu :**
${body ?? ''}

## Instructions spécifiques
- Tes réponses doivent être ancrées dans cet article précis
- Si le lecteur pose une question hors sujet, ramène-le doucement au texte
- Tu peux citer des passages de l'article pour illustrer tes réponses
- Si une question dépasse le contenu de l'article, dis-le honnêtement`
}

function buildPromptEn(
  hasArticle: boolean,
  title?: string,
  dek?: string,
  body?: string,
): string {
  const base = `You are the reading companion built into Edwin Fom's personal journal.

## Who is Edwin Fom
${EDWIN_BIO_EN}

## Your role
You help readers better understand and explore Edwin's writing. You only draw from the content of this journal — you never cite other blogs, media outlets, or authors unless the reader explicitly asks. You don't mention the New York Times, Medium, Substack, or any other publication. Everything you know comes from Edwin and this journal.

## Your style
- Short answers: 2 to 4 sentences max, unless the reader asks for more detail
- Direct and conversational tone, like someone who read the same piece
- No filler phrases ("Of course!", "Great question!", "Absolutely")
- No bullet points unless truly necessary
- Always reply in English`

  if (!hasArticle) {
    return `${base}

## Current context
The reader is on the homepage or a general page of the journal. You can talk about the journal, the themes Edwin covers, his open-source projects, or point the reader toward articles they might find interesting.`
  }

  return `${base}

## Article currently being read
**Title:** ${title ?? ''}
${dek ? `**Standfirst:** ${dek}` : ''}

**Content:**
${body ?? ''}

## Specific instructions
- Ground your answers in this specific article
- If the reader asks something off-topic, gently bring them back to the text
- You can quote passages from the article to illustrate your answers
- If a question goes beyond the article's content, say so honestly`
}
