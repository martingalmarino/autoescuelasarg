import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json()

    // Validaciones
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y email son obligatorios' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una cuenta con este email' },
        { status: 400 }
      )
    }

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al crear la cuenta' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
