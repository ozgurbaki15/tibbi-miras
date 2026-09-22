import { NextResponse } from 'next/server'
import { getPublicArticlePage } from '@/lib/public-data'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const rawOffset = Number(url.searchParams.get('offset') ?? '0')
  const offset = Number.isInteger(rawOffset) && rawOffset >= 0 ? rawOffset : 0
  const page = await getPublicArticlePage(offset, 30)
  return NextResponse.json(page, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
