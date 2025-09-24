import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { name, phone, message, schoolId, schoolName } = await request.json()

    // Validar datos requeridos
    if (!name || !phone || !message || !schoolId || !schoolName) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de teléfono básico
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Formato de teléfono inválido' },
        { status: 400 }
      )
    }

    // Verificar que la autoescuela existe
    const school = await prisma.drivingSchool.findUnique({
      where: { id: schoolId },
      select: { id: true, name: true, isActive: true }
    })

    if (!school || !school.isActive) {
      return NextResponse.json(
        { success: false, error: 'Autoescuela no encontrada' },
        { status: 404 }
      )
    }

    // Crear el contacto en la base de datos
    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
        schoolId,
        schoolName: schoolName.trim(),
        status: 'new',
        source: 'website'
      }
    })

    console.log('📧 Nuevo contacto recibido:', {
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      school: contact.schoolName,
      timestamp: contact.createdAt
    })

    return NextResponse.json({
      success: true,
      message: 'Contacto enviado correctamente',
      contactId: contact.id
    })

  } catch (error: any) {
    console.error('❌ Error al procesar contacto:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
    }
}
