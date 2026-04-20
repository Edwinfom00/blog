import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { comments } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const schema = z.object({
  action: z.enum(['approve', 'reject']),
})

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { action } = schema.parse(await req.json())

  if (action === 'approve') {
    await db.update(comments).set({ approved: true }).where(eq(comments.id, parseInt(id)))
    return NextResponse.json({ ok: true })
  }

  if (action === 'reject') {
    await db.delete(comments).where(eq(comments.id, parseInt(id)))
    return NextResponse.json({ ok: true })
  }
}
