import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Obtener autoescuela por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const school = await prisma.drivingSchool.findUnique({
      where: { id: params.id },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            province: {
              select: {
                id: true,
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
      cityId: school.city.id,
      provinceId: school.city.province.id,
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

// PATCH - Actualizar autoescuela
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Verificar que la autoescuela existe
    const existingSchool = await prisma.drivingSchool.findUnique({
      where: { id: params.id }
    })

    if (!existingSchool) {
      return NextResponse.json(
        { success: false, error: 'Autoescuela no encontrada' },
        { status: 404 }
      )
    }

    // Preparar datos para actualización
    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.address !== undefined) updateData.address = body.address
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.email !== undefined) updateData.email = body.email
    if (body.website !== undefined) updateData.website = body.website
    if (body.hours !== undefined) updateData.hours = body.hours
    if (body.services !== undefined) updateData.services = body.services
    if (body.priceMin !== undefined) updateData.priceMin = body.priceMin ? parseInt(body.priceMin) : null
    if (body.priceMax !== undefined) updateData.priceMax = body.priceMax ? parseInt(body.priceMax) : null
    if (body.rating !== undefined) updateData.rating = body.rating ? parseFloat(body.rating) : 0
    if (body.reviewsCount !== undefined) updateData.reviewsCount = body.reviewsCount ? parseInt(body.reviewsCount) : 0
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.isVerified !== undefined) updateData.isVerified = body.isVerified
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured
    if (body.sortOrder !== undefined) updateData.sortOrder = parseInt(body.sortOrder)

    // Si se cambia el nombre, actualizar el slug
    if (body.name && body.name !== existingSchool.name) {
      const { createSlug } = await import('@/lib/utils')
      const baseSlug = createSlug(body.name)
      let slug = baseSlug
      let counter = 1
      
      while (await prisma.drivingSchool.findFirst({ 
        where: { 
          slug,
          id: { not: params.id }
        } 
      })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      updateData.slug = slug
    }

    // Actualizar autoescuela
    const school = await prisma.drivingSchool.update({
      where: { id: params.id },
      data: updateData,
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
    })

    // Transform to match DrivingSchool interface
    const transformedSchool = {
      ...school,
      city: school.city.name,
      province: school.city.province.name,
    }

    return NextResponse.json({ 
      success: true, 
      school: transformedSchool 
    })
  } catch (error) {
    console.error('Error updating school:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar autoescuela' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar autoescuela
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que la autoescuela existe
    const existingSchool = await prisma.drivingSchool.findUnique({
      where: { id: params.id },
      select: { cityId: true, provinceId: true }
    })

    if (!existingSchool) {
      return NextResponse.json(
        { success: false, error: 'Autoescuela no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar autoescuela
    await prisma.drivingSchool.delete({
      where: { id: params.id }
    })

      // Actualizar contadores - obtener el conteo actual después de la eliminación
      const [cityCount, provinceCount] = await Promise.all([
        prisma.drivingSchool.count({ where: { cityId: existingSchool.cityId, isActive: true } }),
        prisma.drivingSchool.count({ where: { provinceId: existingSchool.provinceId, isActive: true } })
      ])

      await Promise.all([
        prisma.city.update({
          where: { id: existingSchool.cityId },
          data: { schoolsCount: cityCount }
        }),
        prisma.province.update({
          where: { id: existingSchool.provinceId },
          data: { schoolsCount: provinceCount }
        })
      ])

    return NextResponse.json({ 
      success: true, 
      message: 'Autoescuela eliminada correctamente' 
    })
  } catch (error) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar autoescuela' },
      { status: 500 }
    )
  }
}
