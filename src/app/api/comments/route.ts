import { NextRequest, NextResponse } from 'next/server'
import { createComment } from '@/db/queries'
import { z } from 'zod'

const schema = z.object({
  articleId: z.number().int().positive(),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email(),
  content: z.string().min(1).max(2000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    const comment = await createComment(data)

    return NextResponse.json({ ok: true, id: comment.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 422 })
    }
    console.error('[POST /api/comments]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
