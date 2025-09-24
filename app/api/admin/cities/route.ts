import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Obtener ciudades por provincia
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provinceId = searchParams.get('provinceId')

    if (!provinceId) {
      return NextResponse.json(
        { success: false, error: 'provinceId es requerido' },
        { status: 400 }
      )
    }

    const cities = await prisma.city.findMany({
      where: { 
        provinceId,
        isActive: true 
      },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        provinceId: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      cities 
    })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener ciudades' },
      { status: 500 }
    )
  }
}
