import { NextRequest, NextResponse } from 'next/server'
import { searchProvinces } from '@/lib/search'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({ hits: [], totalHits: 0, processingTimeMs: 0 })
    }

    const results = await searchProvinces(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error in provinces search API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
