import { NextResponse } from 'next/server'
import { fetchShopData } from '@/lib/shop'

export const revalidate = 300

export async function GET() {
  const data = await fetchShopData()
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
