import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
  articleContext: z.string().optional(),
  locale: z.enum(['fr', 'en']).default('fr'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, articleContext, locale } = schema.parse(body)

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 })
    }

    const isFr = locale === 'fr'
    const systemPrompt = isFr
      ? `Tu es un compagnon de lecture discret et curieux. Tu réponds en français, de façon directe et conversationnelle — comme quelqu'un qui a lu le même texte et qui réfléchit avec le lecteur. Pas de formules creuses, pas de "bien sûr", pas de récitation de biographie. 3 à 5 phrases maximum. Si tu n'as pas de contexte d'article, tu peux parler du journal en général.${articleContext ? `\n\nTexte en cours de lecture :\n${articleContext}` : ''}`
      : `You are a quiet, curious reading companion. Reply in English, directly and conversationally — like someone who read the same piece and is thinking alongside the reader. No filler phrases, no "of course", no biography recitation. 3–5 sentences max. If there's no article context, you can speak about the journal in general.${articleContext ? `\n\nCurrently reading:\n${articleContext}` : ''}`

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
        max_tokens: 300,
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('DeepSeek error:', err)
      return NextResponse.json({ error: 'AI error' }, { status: 502 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content ?? ''

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('AI route error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
