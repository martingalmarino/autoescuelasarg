import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const MIN_FILL_MS = 3000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+]?[0-9\s\-()]{8,20}$/

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

const fail = (error: string, status = 400) => NextResponse.json({ success: false, error }, { status })

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return fail('Solicitud inválida')
  }

  // Bots: completan el campo oculto o envían el formulario al instante. Se responde OK sin guardar.
  const startedAt = Number(body.startedAt)
  if (text(body.company, 200) || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ success: true })
  }

  const name = text(body.name, 120)
  const role = text(body.role, 60)
  const email = text(body.email, 160).toLowerCase()
  const phone = text(body.phone, 30)
  const message = text(body.message, 2000) || null
  const city = text(body.city, 120) || null
  const interest = body.interest === 'premium' ? 'premium' : 'claim'
  const schoolSlug = text(body.schoolSlug, 200)

  if (!name || !role || !email || !phone) return fail('Completá nombre, rol, email y teléfono')
  if (!EMAIL_RE.test(email)) return fail('El email no es válido')
  if (!PHONE_RE.test(phone)) return fail('El teléfono no es válido')

  let schoolId: string | null = null
  let schoolName = text(body.schoolName, 200)
  if (schoolSlug) {
    const school = await prisma.drivingSchool.findUnique({
      where: { slug: schoolSlug },
      select: { id: true, name: true },
    })
    if (!school) return fail('No encontramos esa autoescuela', 404)
    schoolId = school.id
    schoolName = school.name
  }
  if (!schoolName) return fail('Indicá el nombre de tu autoescuela')

  try {
    const duplicate = await prisma.schoolClaim.findFirst({
      where: {
        email,
        status: 'pending',
        ...(schoolId ? { schoolId } : { schoolName: { equals: schoolName, mode: 'insensitive' } }),
      },
      select: { id: true },
    })

    if (!duplicate) {
      await prisma.schoolClaim.create({
        data: { schoolId, schoolName, city, name, role, email, phone, message, interest },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error guardando reclamo de ficha:', error)
    return fail('No pudimos enviar la solicitud. Probá de nuevo en unos minutos.', 500)
  }
}
