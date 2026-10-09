import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidatePublicPages } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'

// Vercel Cron (vercel.json) lo llama una vez por día. Si CRON_SECRET está definido, Vercel lo envía como Bearer.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { count } = await prisma.drivingSchool.updateMany({
      where: { plan: 'PREMIUM', planExpiresAt: { lte: new Date() } },
      data: { plan: 'FREE', planExpiresAt: null, isFeatured: false },
    })

    if (count > 0) revalidatePublicPages()
    return NextResponse.json({ success: true, expired: count })
  } catch (error) {
    console.error('Error venciendo planes premium:', error)
    return NextResponse.json({ success: false, error: 'Error al vencer planes' }, { status: 500 })
  }
}
