import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { isSchoolEventType } from '@/lib/premium'

export const dynamic = 'force-dynamic'

/** Fecha de hoy en Argentina, como medianoche UTC para la columna DATE. */
function todayInArgentina() {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
  return new Date(`${day}T00:00:00Z`)
}

export async function POST(request: NextRequest) {
  let body: { schoolId?: unknown; type?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const { schoolId, type } = body
  if (typeof schoolId !== 'string' || !schoolId || schoolId.length > 40 || !isSchoolEventType(type)) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const where = { schoolId_date_type: { schoolId, date: todayInArgentina(), type } }
  const increment = () => prisma.schoolEvent.update({ where, data: { count: { increment: 1 } } })

  try {
    await prisma.schoolEvent.upsert({
      where,
      update: { count: { increment: 1 } },
      create: { schoolId, date: where.schoolId_date_type.date, type, count: 1 },
    })
  } catch (error) {
    // Dos eventos simultáneos pueden intentar crear la misma fila: el segundo suma sobre la existente.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      await increment().catch(() => undefined)
    } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json({ success: false }, { status: 404 })
    } else {
      console.error('Error registrando evento de ficha:', error)
      return NextResponse.json({ success: false }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
