import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Por ahora, devolvemos todas las autoescuelas
    // En el futuro, esto se puede filtrar por el usuario
    const schools = await prisma.drivingSchool.findMany({
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedSchools = schools.map(school => ({
      id: school.id,
      name: school.name,
      slug: school.slug,
      city: school.city.name,
      province: school.city.province.name,
      rating: school.rating,
      reviewsCount: school.reviewsCount,
      isActive: school.isActive,
      isVerified: school.isVerified,
    }))

    return NextResponse.json({
      success: true,
      schools: formattedSchools,
    })
  } catch (error: any) {
    console.error('Error fetching user schools:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener autoescuelas' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
