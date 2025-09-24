import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [provincesCount, schoolsCount, citiesCount] = await Promise.all([
      prisma.province.count(),
      prisma.drivingSchool.count(),
      prisma.city.count()
    ])
    
    return NextResponse.json({
      provinces: provincesCount,
      schools: schoolsCount,
      cities: citiesCount
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
