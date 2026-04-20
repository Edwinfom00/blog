import { NextRequest, NextResponse } from 'next/server'
import { getSearchData } from '@/db/queries'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const locale = (searchParams.get('locale') ?? 'fr') as 'fr' | 'en'

  try {
    const data = await getSearchData(locale)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/search]', error)
    return NextResponse.json({ articles: [], projects: [] }, { status: 500 })
  }
}
