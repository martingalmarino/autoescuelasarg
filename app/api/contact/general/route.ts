import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    // Validar datos requeridos
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Validar formato de teléfono si se proporciona
    if (phone) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { success: false, error: 'Formato de teléfono inválido' },
          { status: 400 }
        )
      }
    }

    // Crear el contacto en la base de datos
    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        phone: phone?.trim() || '',
        message: `[${subject.toUpperCase()}] ${message.trim()}`,
        email: email.trim(),
        schoolId: 'general-contact', // ID especial para contactos generales
        schoolName: 'Contacto General',
        status: 'new',
        source: 'website-contact'
      }
    })

    console.log('📧 Nuevo contacto general recibido:', {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      subject,
      timestamp: contact.createdAt
    })

    return NextResponse.json({
      success: true,
      message: 'Contacto enviado correctamente',
      contactId: contact.id
    })

  } catch (error: any) {
    console.error('❌ Error al procesar contacto general:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
