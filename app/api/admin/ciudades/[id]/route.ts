import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, slug, provinceId, sortOrder } = await request.json()

    if (!name || !slug || !provinceId) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: nombre, slug y provincia.' },
        { status: 400 }
      )
    }

    // Verificar que la provincia existe
    const province = await prisma.province.findUnique({
      where: { id: provinceId }
    })

    if (!province) {
      return NextResponse.json(
        { success: false, error: 'La provincia especificada no existe.' },
        { status: 400 }
      )
    }

    // Verificar que no existe otra ciudad con el mismo slug en la misma provincia
    const existingCity = await prisma.city.findFirst({
      where: {
        slug: slug,
        provinceId: provinceId,
        id: { not: id }
      }
    })

    if (existingCity) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una ciudad con ese slug en esta provincia.' },
        { status: 400 }
      )
    }

    const city = await prisma.city.update({
      where: { id },
      data: {
        name,
        slug,
        provinceId,
        sortOrder: sortOrder || 1
      },
      include: {
        province: true
      }
    })

    return NextResponse.json({ success: true, data: city })
  } catch (error: any) {
    console.error(`Error updating city ${params.id}:`, error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor al actualizar la ciudad.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Verificar si la ciudad tiene autoescuelas
    const cityWithSchools = await prisma.city.findUnique({
      where: { id },
      include: {
        _count: {
          select: { schools: true }
        }
      }
    })

    if (!cityWithSchools) {
      return NextResponse.json(
        { success: false, error: 'La ciudad no existe.' },
        { status: 404 }
      )
    }

    if (cityWithSchools._count.schools > 0) {
      return NextResponse.json(
        { success: false, error: 'No se puede eliminar una ciudad que tiene autoescuelas asociadas.' },
        { status: 400 }
      )
    }

    await prisma.city.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Ciudad eliminada exitosamente.' })
  } catch (error: any) {
    console.error(`Error deleting city ${params.id}:`, error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor al eliminar la ciudad.' },
      { status: 500 }
    )
  }
}
