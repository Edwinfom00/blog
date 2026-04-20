import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { setSetting } from '@/lib/settings'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { about, config } = await req.json()
    await Promise.all([
      setSetting('about', about),
      setSetting('site_config', config),
    ])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 })
  }
}
