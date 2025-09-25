import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Obtener la autoescuela actual
    const currentSchool = await prisma.drivingSchool.findUnique({
      where: { slug, isActive: true },
      include: {
        city: {
          include: {
            province: true
          }
        }
      }
    })

    if (!currentSchool) {
      return NextResponse.json(
        { success: false, error: 'Autoescuela no encontrada' },
        { status: 404 }
      )
    }

    // Obtener autoescuelas relacionadas de la misma ciudad
    const relatedSchools = await prisma.drivingSchool.findMany({
      where: {
        cityId: currentSchool.cityId,
        isActive: true,
        id: {
          not: currentSchool.id // Excluir la autoescuela actual
        }
      },
      include: {
        city: {
          include: {
            province: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' }, // Destacadas primero
        { rating: 'desc' },      // Mejor calificadas
        { reviewsCount: 'desc' } // Más reseñas
      ],
      take: 6 // Máximo 6 autoescuelas relacionadas
    })

    // Si no hay suficientes en la misma ciudad, buscar en la misma provincia
    if (relatedSchools.length < 4) {
      const provinceSchools = await prisma.drivingSchool.findMany({
        where: {
          provinceId: currentSchool.provinceId,
          cityId: {
            not: currentSchool.cityId // Excluir la ciudad actual
          },
          isActive: true,
          id: {
            not: currentSchool.id
          }
        },
        include: {
          city: {
            include: {
              province: true
            }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { rating: 'desc' },
          { reviewsCount: 'desc' }
        ],
        take: 6 - relatedSchools.length
      })

      relatedSchools.push(...provinceSchools)
    }

    // Transformar los datos para el frontend
    const transformedSchools = relatedSchools.map(school => ({
      id: school.id,
      name: school.name,
      slug: school.slug,
      rating: school.rating,
      reviewsCount: school.reviewsCount,
      city: school.city.name,
      province: school.city.province.name,
      priceMin: school.priceMin,
      priceMax: school.priceMax,
      isFeatured: school.isFeatured,
      isVerified: school.isVerified
    }))

    return NextResponse.json({
      success: true,
      schools: transformedSchools,
      currentSchool: {
        city: currentSchool.city.name,
        province: currentSchool.city.province.name
      }
    })

  } catch (error: any) {
    console.error('Error fetching related schools:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
