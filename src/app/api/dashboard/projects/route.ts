import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { projects } from '@/db/schema'
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
  status: z.enum(['live', 'new', 'wip']).default('live'),
  sortOrder: z.number().default(0),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = schema.parse(await req.json())
    const [project] = await db.insert(projects).values(body).returning()
    return NextResponse.json(project, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 })
  }
}
