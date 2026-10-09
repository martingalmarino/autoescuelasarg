import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { revalidatePublicPages } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Actualizando contadores de autoescuelas...')

    // Actualizar contadores de provincias
    console.log('📋 Actualizando contadores de provincias...')
    const provinces = await prisma.province.findMany({
      include: {
        _count: {
          select: {
            schools: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    const provinceUpdates = []
    for (const province of provinces) {
      const realCount = province._count.schools
      if (province.schoolsCount !== realCount) {
        await prisma.province.update({
          where: { id: province.id },
          data: { schoolsCount: realCount }
        })
        provinceUpdates.push(`${province.name}: ${province.schoolsCount} → ${realCount}`)
      }
    }

    // Actualizar contadores de ciudades
    console.log('🏙️ Actualizando contadores de ciudades...')
    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: {
            schools: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    const cityUpdates = []
    for (const city of cities) {
      const realCount = city._count.schools
      if (city.schoolsCount !== realCount) {
        await prisma.city.update({
          where: { id: city.id },
          data: { schoolsCount: realCount }
        })
        cityUpdates.push(`${city.name}: ${city.schoolsCount} → ${realCount}`)
      }
    }

    console.log('✅ Contadores actualizados correctamente!')

    revalidatePublicPages()

    return NextResponse.json({
      success: true,
      message: 'Contadores actualizados correctamente',
      updates: {
        provinces: provinceUpdates,
        cities: cityUpdates
      }
    })
  } catch (error: any) {
    console.error('❌ Error actualizando contadores:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}




