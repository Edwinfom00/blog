import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { articles, tocItems, articleTags } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/session'
import { generateArticleMeta } from '@/lib/ai-article'
import { z } from 'zod'
import type { Block } from '@/db/schema'

const tocSchema = z.object({
  anchorId: z.string(),
  labelFr: z.string(),
  labelEn: z.string(),
  sortOrder: z.number().default(0),
})

const tagSchema = z.object({
  nameFr: z.string(),
  nameEn: z.string(),
})

const schema = z.object({
  slug: z.string().min(1),
  issue: z.number().int().positive(),
  date: z.string(),
  readMin: z.number().int().positive(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  titleFr: z.string().min(1),
  titleEn: z.string().min(1),
  dekFr: z.string().min(1),
  dekEn: z.string().min(1),
  bodyFr: z.array(z.any()).default([]),
  bodyEn: z.array(z.any()).default([]),
  toc: z.array(tocSchema).optional(),
  tags: z.array(tagSchema).optional(),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = schema.parse(await req.json())
    const { toc, tags, ...articleData } = body

    const [article] = await db.insert(articles).values(articleData).returning()

    if (body.published) {
      // Si toc/tags fournis manuellement → les utiliser, sinon générer via IA
      const hasMeta = (toc && toc.length > 0) || (tags && tags.length > 0)
      if (hasMeta) {
        await saveMeta(article.id, toc ?? [], tags ?? [])
      } else {
        generateAndSaveMeta(article.id, body).catch(console.error)
      }
    } else if ((toc && toc.length > 0) || (tags && tags.length > 0)) {
      await saveMeta(article.id, toc ?? [], tags ?? [])
    }

    return NextResponse.json(article, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 })
  }
}

/** Persiste TOC + tags directement (sans appel IA) */
export async function saveMeta(
  articleId: number,
  toc: { anchorId: string; labelFr: string; labelEn: string; sortOrder: number }[],
  tags: { nameFr: string; nameEn: string }[],
) {
  await Promise.all([
    db.delete(tocItems).where(eq(tocItems.articleId, articleId)),
    db.delete(articleTags).where(eq(articleTags.articleId, articleId)),
  ])
  if (toc.length > 0) {
    await db.insert(tocItems).values(toc.map(t => ({ ...t, articleId })))
  }
  if (tags.length > 0) {
    await db.insert(articleTags).values(tags.filter(t => t.nameFr || t.nameEn).map(t => ({ ...t, articleId })))
  }
}

/** Génère via DeepSeek puis persiste */
export async function generateAndSaveMeta(
  articleId: number,
  body: { titleFr: string; titleEn: string; bodyFr: unknown[]; bodyEn: unknown[] }
) {
  try {
    const meta = await generateArticleMeta(
      body.titleFr, body.titleEn,
      body.bodyFr as Block[], body.bodyEn as Block[],
    )
    await saveMeta(
      articleId,
      meta.toc,
      meta.tags.fr.map((fr, i) => ({ nameFr: fr, nameEn: meta.tags.en[i] ?? fr })),
    )
  } catch (e) {
    console.error('[generateAndSaveMeta]', e)
  }
}
