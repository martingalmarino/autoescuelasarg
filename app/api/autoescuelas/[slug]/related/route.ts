import { NextRequest, NextResponse } from 'next/server'
import { prisma, getRelatedSchools } from '@/lib/database'

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
      select: {
        id: true,
        cityId: true,
        provinceId: true,
        city: { select: { name: true, province: { select: { name: true } } } },
      },
    })

    if (!currentSchool) {
      return NextResponse.json(
        { success: false, error: 'Autoescuela no encontrada' },
        { status: 404 }
      )
    }

    const schools = await getRelatedSchools(currentSchool)

    return NextResponse.json({
      success: true,
      schools,
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
