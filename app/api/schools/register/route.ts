import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createSlug } from '@/lib/utils'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      address,
      phone,
      email,
      website,
      city,
      province,
      priceMin,
      priceMax,
      services,
      imageUrl,
      logoUrl,
      hours,
    } = body

    // Validaciones básicas
    if (!name || !description || !address || !phone || !email || !city || !province) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Buscar o crear la provincia
    let provinceRecord = await prisma.province.findFirst({
      where: { name: province }
    })

    if (!provinceRecord) {
      provinceRecord = await prisma.province.create({
        data: {
          name: province,
          slug: createSlug(province),
          schoolsCount: 0,
        }
      })
    }

    // Buscar o crear la ciudad
    let cityRecord = await prisma.city.findFirst({
      where: {
        name: city,
        provinceId: provinceRecord.id
      }
    })

    if (!cityRecord) {
      cityRecord = await prisma.city.create({
        data: {
          name: city,
          slug: createSlug(city),
          provinceId: provinceRecord.id,
          schoolsCount: 0,
        }
      })
    }

    // Crear la autoescuela
    const school = await prisma.drivingSchool.create({
      data: {
        name,
        slug: createSlug(name),
        description,
        address,
        phone,
        email,
        website: website || null,
        cityId: cityRecord.id,
        provinceId: provinceRecord.id,
        priceMin: priceMin ? parseInt(priceMin) : null,
        priceMax: priceMax ? parseInt(priceMax) : null,
        imageUrl: imageUrl || null,
        logoUrl: logoUrl || null,
        services: services || [],
        isActive: false, // Requiere aprobación
        isVerified: false,
        rating: 0,
        reviewsCount: 0,
      }
    })

    // Actualizar contadores
    await prisma.province.update({
      where: { id: provinceRecord.id },
      data: { schoolsCount: { increment: 1 } }
    })

    await prisma.city.update({
      where: { id: cityRecord.id },
      data: { schoolsCount: { increment: 1 } }
    })

    return NextResponse.json({
      success: true,
      school: {
        id: school.id,
        name: school.name,
        slug: school.slug,
      }
    })
  } catch (error: any) {
    console.error('Error registering school:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al registrar la autoescuela' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
