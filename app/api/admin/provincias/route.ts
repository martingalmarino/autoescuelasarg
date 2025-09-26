import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const provinces = await prisma.province.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    return NextResponse.json({ success: true, data: provinces })
  } catch (error: any) {
    console.error('Error fetching provinces:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor al obtener provincias.' },
      { status: 500 }
    )
  }
}




