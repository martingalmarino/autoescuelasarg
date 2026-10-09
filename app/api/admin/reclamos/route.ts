import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const STATUSES = ['pending', 'approved', 'rejected']

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status')

  try {
    const claims = await prisma.schoolClaim.findMany({
      where: status && STATUSES.indexOf(status) !== -1 ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        school: {
          select: {
            id: true,
            name: true,
            slug: true,
            claimedAt: true,
            ownerEmail: true,
            city: { select: { name: true } },
          },
        },
      },
    })

    return NextResponse.json({ success: true, claims })
  } catch (error) {
    console.error('Error obteniendo reclamos:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener reclamos' }, { status: 500 })
  }
}
