import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { projects } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const schema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  year: z.string(),
  url: z.string().default('#'),
  kindFr: z.string(),
  kindEn: z.string(),
  descFr: z.string(),
  descEn: z.string(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['live', 'new', 'wip']),
  sortOrder: z.number().default(0),
})

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const body = schema.parse(await req.json())
    const [project] = await db.update(projects).set(body).where(eq(projects.id, parseInt(id))).returning()
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await db.delete(projects).where(eq(projects.id, parseInt(id)))
  return NextResponse.json({ ok: true })
}
