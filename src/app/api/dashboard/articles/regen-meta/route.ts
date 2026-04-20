import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { generateArticleMeta } from '@/lib/ai-article'
import type { Block } from '@/db/schema'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { titleFr, titleEn, bodyFr, bodyEn } = await req.json()
    const meta = await generateArticleMeta(titleFr, titleEn, bodyFr as Block[], bodyEn as Block[])
    return NextResponse.json(meta)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
