import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 Ejecutando diagnóstico de autoescuelas...')
    
    // Obtener todas las autoescuelas
    const allSchools = await prisma.drivingSchool.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        city: {
          select: {
            name: true,
            province: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const activeSchools = allSchools.filter(school => school.isActive)
    const inactiveSchools = allSchools.filter(school => !school.isActive)
    
    // Verificar contadores de provincias
    const provinces = await prisma.province.findMany({
      select: {
        name: true,
        schoolsCount: true,
        _count: {
          select: {
            schools: {
              where: { isActive: true }
            }
          }
        }
      }
    })
    
    // Verificar contadores de ciudades
    const cities = await prisma.city.findMany({
      select: {
        name: true,
        schoolsCount: true,
        _count: {
          select: {
            schools: {
              where: { isActive: true }
            }
          }
        }
      }
    })
    
    // Verificar si hay autoescuelas duplicadas por slug
    const slugs = allSchools.map(school => school.slug)
    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index)
    
    return NextResponse.json({
      success: true,
      summary: {
        totalSchools: allSchools.length,
        activeSchools: activeSchools.length,
        inactiveSchools: inactiveSchools.length,
        duplicateSlugs: duplicateSlugs.length
      },
      inactiveSchools: inactiveSchools.map(school => ({
        id: school.id,
        name: school.name,
        slug: school.slug,
        city: school.city.name,
        province: school.city.province.name,
        createdAt: school.createdAt,
        updatedAt: school.updatedAt
      })),
      duplicateSlugs: duplicateSlugs.map(slug => {
        const schoolsWithSlug = allSchools.filter(school => school.slug === slug)
        return {
          slug,
          schools: schoolsWithSlug.map(school => ({
            id: school.id,
            name: school.name,
            isActive: school.isActive
          }))
        }
      }),
      provinceCounters: provinces.map(province => ({
        name: province.name,
        storedCount: province.schoolsCount,
        realCount: province._count.schools,
        isCorrect: province.schoolsCount === province._count.schools
      })),
      cityCounters: cities.map(city => ({
        name: city.name,
        storedCount: city.schoolsCount,
        realCount: city._count.schools,
        isCorrect: city.schoolsCount === city._count.schools
      })),
      recentSchools: allSchools.slice(0, 10).map(school => ({
        name: school.name,
        isActive: school.isActive,
        createdAt: school.createdAt
      }))
    })
    
  } catch (error: any) {
    console.error('❌ Error durante el diagnóstico:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}