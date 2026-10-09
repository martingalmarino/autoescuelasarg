import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidatePublicPages } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'

const STATUSES = ['pending', 'approved', 'rejected']

// Aprobar un reclamo asigna el dueño a la ficha y la marca como verificada.
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const claim = await prisma.schoolClaim.findUnique({ where: { id: params.id } })
    if (!claim) {
      return NextResponse.json({ success: false, error: 'Reclamo no encontrado' }, { status: 404 })
    }

    const status = typeof body.status === 'string' ? body.status : undefined
    if (status !== undefined && STATUSES.indexOf(status) === -1) {
      return NextResponse.json({ success: false, error: 'Estado inválido' }, { status: 400 })
    }
    const notes = typeof body.notes === 'string' ? body.notes : undefined
    const schoolId = typeof body.schoolId === 'string' && body.schoolId ? body.schoolId : claim.schoolId

    if (status === 'approved') {
      if (!schoolId) {
        return NextResponse.json(
          { success: false, error: 'Elegí a qué autoescuela corresponde antes de aprobar' },
          { status: 400 }
        )
      }

      const school = await prisma.drivingSchool.findUnique({ where: { id: schoolId }, select: { id: true } })
      if (!school) {
        return NextResponse.json({ success: false, error: 'Autoescuela no encontrada' }, { status: 404 })
      }

      const [updated] = await prisma.$transaction([
        prisma.schoolClaim.update({
          where: { id: claim.id },
          data: { status, schoolId, ...(notes !== undefined && { notes }) },
        }),
        prisma.drivingSchool.update({
          where: { id: schoolId },
          data: {
            ownerName: claim.name,
            ownerEmail: claim.email,
            ownerPhone: claim.phone,
            claimedAt: new Date(),
            isVerified: true,
          },
        }),
      ])

      revalidatePublicPages()
      return NextResponse.json({ success: true, claim: updated })
    }

    const updated = await prisma.schoolClaim.update({
      where: { id: claim.id },
      data: {
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
        ...(schoolId !== claim.schoolId && { schoolId }),
      },
    })

    return NextResponse.json({ success: true, claim: updated })
  } catch (error) {
    console.error('Error actualizando reclamo:', error)
    return NextResponse.json({ success: false, error: 'Error al actualizar el reclamo' }, { status: 500 })
  }
}
