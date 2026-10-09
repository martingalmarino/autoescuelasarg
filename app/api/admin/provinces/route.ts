import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Obtener todas las provincias
export async function GET() {
  try {
    const provinces = await prisma.province.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      provinces 
    })
  } catch (error) {
    console.error('Error fetching provinces:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener provincias' },
      { status: 500 }
    )
  }
}
