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
      ? `Tu es le compagnon de lecture d'Edwin Fom. Tu aides le visiteur à comprendre les articles qu'il lit. Reste bref (3 à 5 phrases), chaleureux, précis. Parle français.${articleContext ? `\n\nCONTEXTE DE L'ARTICLE:\n${articleContext}` : ''}`
      : `You are Edwin Fom's reading companion. Help the visitor understand the piece they're reading. Keep it brief (3–5 sentences), warm, precise. Speak English.${articleContext ? `\n\nARTICLE CONTEXT:\n${articleContext}` : ''}`

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
