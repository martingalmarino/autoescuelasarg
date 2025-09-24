import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  const diagnostics = {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_STARTS_WITH: process.env.DATABASE_URL?.substring(0, 20) || 'N/A',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
    },
    database: {
      connection: 'Unknown',
      error: null as string | null
    }
  }

  // Test database connection
  const prisma = new PrismaClient()
  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    diagnostics.database.connection = 'Success'
  } catch (error: any) {
    diagnostics.database.connection = 'Failed'
    diagnostics.database.error = error.message
  } finally {
    await prisma.$disconnect()
  }

  return NextResponse.json(diagnostics)
}
