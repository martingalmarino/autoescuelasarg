import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cloudinary } from '@/lib/cloudinary'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verificando estado de imágenes...')

    // 1. Verificar configuración de Cloudinary
    const cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configurada' : '❌ No configurada',
      api_key: process.env.CLOUDINARY_API_KEY ? '✅ Configurada' : '❌ No configurada',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Configurada' : '❌ No configurada',
    }

    // 2. Intentar ping a Cloudinary
    let cloudinaryPing = null
    try {
      cloudinaryPing = await cloudinary.api.ping()
    } catch (error: any) {
      cloudinaryPing = { error: error.message }
    }

    // 3. Obtener autoescuelas con imágenes
    const schoolsWithImages = await prisma.drivingSchool.findMany({
      where: {
        OR: [
          { imageUrl: { not: null } },
          { logoUrl: { not: null } }
        ]
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        logoUrl: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    })

    // 4. Verificar si las URLs de Cloudinary son accesibles
    const imageChecks = await Promise.all(
      schoolsWithImages.map(async (school) => {
        const checks = {
          schoolId: school.id,
          schoolName: school.name,
          imageUrl: school.imageUrl,
          logoUrl: school.logoUrl,
          imageAccessible: false,
          logoAccessible: false,
          imageError: null,
          logoError: null
        }

        // Verificar imagen principal
        if (school.imageUrl) {
          try {
            const response = await fetch(school.imageUrl, { method: 'HEAD' })
            checks.imageAccessible = response.ok
            if (!response.ok) {
              checks.imageError = `HTTP ${response.status}: ${response.statusText}`
            }
          } catch (error: any) {
            checks.imageError = error.message
          }
        }

        // Verificar logo
        if (school.logoUrl) {
          try {
            const response = await fetch(school.logoUrl, { method: 'HEAD' })
            checks.logoAccessible = response.ok
            if (!response.ok) {
              checks.logoError = `HTTP ${response.status}: ${response.statusText}`
            }
          } catch (error: any) {
            checks.logoError = error.message
          }
        }

        return checks
      })
    )

    // 5. Obtener estadísticas generales
    const stats = await prisma.drivingSchool.aggregate({
      _count: {
        imageUrl: true,
        logoUrl: true
      }
    })

    const totalSchools = await prisma.drivingSchool.count()

    return NextResponse.json({
      success: true,
      message: 'Diagnóstico de imágenes completado',
      data: {
        cloudinaryConfig,
        cloudinaryPing,
        totalSchools,
        schoolsWithImages: schoolsWithImages.length,
        imageStats: {
          total: totalSchools,
          withImage: stats._count.imageUrl,
          withLogo: stats._count.logoUrl
        },
        imageChecks,
        recentSchools: schoolsWithImages
      }
    })

  } catch (error: any) {
    console.error('Error en diagnóstico de imágenes:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        message: 'Error al realizar diagnóstico de imágenes'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
