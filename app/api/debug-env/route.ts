import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL
  
  return NextResponse.json({
    hasDatabaseUrl: !!databaseUrl,
    databaseUrlLength: databaseUrl?.length || 0,
    databaseUrlStart: databaseUrl?.substring(0, 20) || 'N/A',
    databaseUrlEnd: databaseUrl?.substring(databaseUrl.length - 20) || 'N/A',
    startsWithPostgresql: databaseUrl?.startsWith('postgresql://') || false,
    startsWithPostgres: databaseUrl?.startsWith('postgres://') || false,
    // Don't expose the full URL for security
    firstChars: databaseUrl?.substring(0, 30) || 'N/A',
    lastChars: databaseUrl?.substring(databaseUrl.length - 30) || 'N/A'
  })
}
