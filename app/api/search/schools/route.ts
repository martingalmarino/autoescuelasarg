import { NextRequest, NextResponse } from 'next/server'
import { searchSchools } from '@/lib/search'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q') || ''
    const province = searchParams.get('province') || undefined
    const city = searchParams.get('city') || undefined
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined

    if (!query.trim()) {
      return NextResponse.json({ hits: [], totalHits: 0, processingTimeMs: 0 })
    }

    const results = await searchSchools(query, {
      province,
      city,
      minRating,
      minPrice,
      maxPrice
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error in search API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
