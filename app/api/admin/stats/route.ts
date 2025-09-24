import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test connection first
    await prisma.$connect()
    
    const [provincesCount, schoolsCount, citiesCount] = await Promise.all([
      prisma.province.count(),
      prisma.drivingSchool.count(),
      prisma.city.count()
    ])
    
    return NextResponse.json({
      success: true,
      stats: {
        provinces: provincesCount,
        schools: schoolsCount,
        cities: citiesCount
      }
    })
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Database connection failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
