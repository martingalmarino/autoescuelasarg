import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Obtener autoescuela por slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const school = await prisma.drivingSchool.findUnique({
      where: { slug: params.slug },
      include: {
        city: {
          select: {
            name: true,
            province: {
              select: {
                name: true,
              },
            },
          },
        },
        courses: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!school) {
      return NextResponse.json(
        { success: false, error: 'Autoescuela no encontrada' },
        { status: 404 }
      )
    }

    // Transform to match DrivingSchool interface
    const transformedSchool = {
      ...school,
      city: school.city.name,
      province: school.city.province.name,
      hours: school.hours || undefined,
    }

    return NextResponse.json({ 
      success: true, 
      school: transformedSchool 
    })
  } catch (error) {
    console.error('Error fetching school:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener autoescuela' },
      { status: 500 }
    )
  }
}
