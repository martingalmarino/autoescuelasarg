import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createSlug } from '@/lib/utils'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Obtener todas las autoescuelas
export async function GET() {
  try {
    const schools = await prisma.drivingSchool.findMany({
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
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    // Transform to match DrivingSchool interface
    const transformedSchools = schools.map(school => ({
      ...school,
      city: school.city.name,
      province: school.city.province.name,
      cityId: school.city.id,
      provinceId: school.city.province.id,
    }))

    return NextResponse.json({ 
      success: true, 
      schools: transformedSchools 
    })
  } catch (error) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener autoescuelas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva autoescuela
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos requeridos
    const { name, cityId, provinceId, description, address, phone, email, website, hours, services, priceMin, priceMax } = body
    
    if (!name || !cityId || !provinceId) {
      return NextResponse.json(
        { success: false, error: 'Nombre, ciudad y provincia son requeridos' },
        { status: 400 }
      )
    }

    // Crear slug único
    const baseSlug = createSlug(name)
    let slug = baseSlug
    let counter = 1
    
    while (await prisma.drivingSchool.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Crear autoescuela
    const school = await prisma.drivingSchool.create({
      data: {
        name,
        slug,
        cityId,
        provinceId,
        description: description || null,
        address: address || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        hours: hours || null,
        services: services || [],
        priceMin: priceMin ? parseInt(priceMin) : null,
        priceMax: priceMax ? parseInt(priceMax) : null,
        rating: 0,
        reviewsCount: 0,
        isActive: true,
        isVerified: false,
        isFeatured: false,
        sortOrder: 0,
      },
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

    // Actualizar contador de escuelas en la ciudad y provincia
    await Promise.all([
      prisma.city.update({
        where: { id: cityId },
        data: { schoolsCount: { increment: 1 } }
      }),
      prisma.province.update({
        where: { id: provinceId },
        data: { schoolsCount: { increment: 1 } }
      })
    ])

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
    console.error('Error creating school:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear autoescuela' },
      { status: 500 }
    )
  }
}
