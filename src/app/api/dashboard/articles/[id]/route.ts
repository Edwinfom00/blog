import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { articles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/session'
import { saveMeta, generateAndSaveMeta } from '../route'
import { z } from 'zod'

const schema = z.object({
  slug: z.string().min(1),
  issue: z.number().int().positive(),
  date: z.string(),
  readMin: z.number().int().positive(),
  featured: z.boolean(),
  published: z.boolean(),
  titleFr: z.string().min(1),
  titleEn: z.string().min(1),
  dekFr: z.string().min(1),
  dekEn: z.string().min(1),
  bodyFr: z.array(z.any()),
  bodyEn: z.array(z.any()),
  toc: z.array(z.object({ anchorId: z.string(), labelFr: z.string(), labelEn: z.string(), sortOrder: z.number().default(0) })).optional(),
  tags: z.array(z.object({ nameFr: z.string(), nameEn: z.string() })).optional(),
})

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const articleId = parseInt(id)

  try {
    const body = schema.parse(await req.json())
    const { toc, tags, ...articleData } = body

    const [article] = await db
      .update(articles)
      .set({ ...articleData, updatedAt: new Date() })
      .where(eq(articles.id, articleId))
      .returning()

    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Toujours persister toc+tags si fournis manuellement
    const hasMeta = (toc && toc.length > 0) || (tags && tags.length > 0)
    if (hasMeta) {
      await saveMeta(articleId, toc ?? [], tags ?? [])
    } else if (body.published) {
      // Publié sans meta manuelle → générer via IA
      generateAndSaveMeta(articleId, body).catch(console.error)
    }

    return NextResponse.json(article)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await db.delete(articles).where(eq(articles.id, parseInt(id)))
  return NextResponse.json({ ok: true })
}
