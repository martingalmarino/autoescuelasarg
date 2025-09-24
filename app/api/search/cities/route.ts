import { NextRequest, NextResponse } from 'next/server'
import { searchCities } from '@/lib/search'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const province = searchParams.get('province') || undefined

    if (!query.trim()) {
      return NextResponse.json({ hits: [], totalHits: 0, processingTimeMs: 0 })
    }

    const results = await searchCities(query, province)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error in cities search API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
