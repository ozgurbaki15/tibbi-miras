import { NextResponse } from 'next/server'
import { getPublicShopData } from '@/lib/public-data'

export const revalidate = 300

export async function GET() {
  const data = await getPublicShopData()
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
