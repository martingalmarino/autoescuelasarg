import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Obtener credenciales de las variables de entorno
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin'
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // Verificar credenciales
    if (username === expectedUsername && password === expectedPassword) {
      // Crear cookie de autenticación
      const authData = { username, password }
      const response = NextResponse.json({ 
        success: true, 
        message: 'Autenticación exitosa' 
      })

      // Establecer cookie con expiración de 24 horas
      response.cookies.set('admin-auth', JSON.stringify(authData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 horas
        path: '/'
      })

      return response
    } else {
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Error en autenticación:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Cerrar sesión - eliminar cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Sesión cerrada exitosamente' 
    })

    response.cookies.set('admin-auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expirar inmediatamente
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
