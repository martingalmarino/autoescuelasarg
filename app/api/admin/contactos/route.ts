import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'

    // Construir filtro de estado
    const whereClause = status === 'all' 
      ? {} 
      : { status }

    // Obtener contactos con información de la autoescuela (si existe)
    const contacts = await prisma.contact.findMany({
      where: whereClause,
      include: {
        school: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transformar los datos para el frontend
    const transformedContacts = contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      schoolId: contact.schoolId,
      schoolName: contact.schoolName,
      status: contact.status,
      source: contact.source,
      notes: contact.notes,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      contacts: transformedContacts,
      total: transformedContacts.length
    })

  } catch (error: any) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener contactos' },
      { status: 500 }
    )
  }
}
