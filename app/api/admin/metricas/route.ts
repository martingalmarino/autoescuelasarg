import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { SCHOOL_EVENT_TYPES, isPremiumActive, type SchoolEventType } from '@/lib/premium'

export const dynamic = 'force-dynamic'

function monthRange(month: string) {
  const [year, monthNumber] = month.split('-').map(Number)
  const next = monthNumber === 12 ? `${year + 1}-01` : `${year}-${String(monthNumber + 1).padStart(2, '0')}`
  return {
    // school_events.date es una fecha de Argentina guardada como medianoche UTC.
    eventsFrom: new Date(`${month}-01T00:00:00Z`),
    eventsTo: new Date(`${next}-01T00:00:00Z`),
    contactsFrom: new Date(`${month}-01T00:00:00-03:00`),
    contactsTo: new Date(`${next}-01T00:00:00-03:00`),
  }
}

export async function GET(request: NextRequest) {
  const currentMonth = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' })
    .format(new Date())
    .slice(0, 7)
  const requested = request.nextUrl.searchParams.get('month') ?? ''
  const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(requested) ? requested : currentMonth
  const range = monthRange(month)

  try {
    const [events, contacts] = await Promise.all([
      prisma.schoolEvent.groupBy({
        by: ['schoolId', 'type'],
        where: { date: { gte: range.eventsFrom, lt: range.eventsTo } },
        _sum: { count: true },
      }),
      prisma.contact.groupBy({
        by: ['schoolId'],
        where: { schoolId: { not: null }, createdAt: { gte: range.contactsFrom, lt: range.contactsTo } },
        _count: { _all: true },
      }),
    ])

    type Counts = Record<SchoolEventType, number> & { inquiries: number }
    const emptyCounts = (): Counts =>
      SCHOOL_EVENT_TYPES.reduce((acc, type) => ({ ...acc, [type]: 0 }), { inquiries: 0 } as Counts)
    const bySchool = new Map<string, Counts>()
    const countsFor = (schoolId: string) => {
      if (!bySchool.has(schoolId)) bySchool.set(schoolId, emptyCounts())
      return bySchool.get(schoolId)!
    }

    for (const event of events) {
      countsFor(event.schoolId)[event.type as SchoolEventType] = event._sum.count ?? 0
    }
    for (const contact of contacts) {
      if (contact.schoolId) countsFor(contact.schoolId).inquiries = contact._count._all
    }

    const schools = await prisma.drivingSchool.findMany({
      where: { id: { in: Array.from(bySchool.keys()) } },
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        planExpiresAt: true,
        claimedAt: true,
        ownerName: true,
        ownerEmail: true,
        city: { select: { name: true } },
      },
    })

    const rows = schools
      .map(school => ({
        schoolId: school.id,
        name: school.name,
        slug: school.slug,
        city: school.city.name,
        isPremium: isPremiumActive(school),
        isClaimed: school.claimedAt !== null,
        ownerName: school.ownerName,
        ownerEmail: school.ownerEmail,
        ...bySchool.get(school.id)!,
      }))
      .sort((a, b) => Number(b.isPremium) - Number(a.isPremium) || b.view - a.view || b.inquiries - a.inquiries)

    return NextResponse.json({ success: true, month, rows })
  } catch (error) {
    console.error('Error obteniendo métricas:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener métricas' }, { status: 500 })
  }
}
