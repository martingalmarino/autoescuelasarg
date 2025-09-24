import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, notes } = body

    // Validar que el contacto existe
    const existingContact = await prisma.contact.findUnique({
      where: { id }
    })

    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contacto no encontrado' },
        { status: 404 }
      )
    }

    // Preparar datos para actualizar
    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    // Actualizar el contacto
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: updateData
    })

    console.log('📝 Contacto actualizado:', {
      id: updatedContact.id,
      status: updatedContact.status,
      notes: updatedContact.notes ? 'Sí' : 'No'
    })

    return NextResponse.json({
      success: true,
      message: 'Contacto actualizado correctamente',
      contact: {
        id: updatedContact.id,
        status: updatedContact.status,
        notes: updatedContact.notes,
        updatedAt: updatedContact.updatedAt.toISOString()
      }
    })

  } catch (error: any) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar contacto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar que el contacto existe
    const existingContact = await prisma.contact.findUnique({
      where: { id }
    })

    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contacto no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar el contacto
    await prisma.contact.delete({
      where: { id }
    })

    console.log('🗑️ Contacto eliminado:', {
      id: existingContact.id,
      name: existingContact.name,
      school: existingContact.schoolName
    })

    return NextResponse.json({
      success: true,
      message: 'Contacto eliminado correctamente'
    })

  } catch (error: any) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al eliminar contacto' },
      { status: 500 }
    )
  }
}
