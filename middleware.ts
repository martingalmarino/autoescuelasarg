import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar si la ruta es /admin pero NO es /admin/login ni /api/admin/auth
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin/login' && 
      !request.nextUrl.pathname.startsWith('/api/admin/auth')) {
    // Verificar si hay credenciales en las cookies
    const authCookie = request.cookies.get('admin-auth')
    
    if (!authCookie) {
      // Redirigir a la página de login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Verificar que la cookie sea válida
    try {
      const authData = JSON.parse(authCookie.value)
      const expectedUsername = process.env.ADMIN_USERNAME || 'admin'
      const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'
      
      if (authData.username !== expectedUsername || authData.password !== expectedPassword) {
        // Credenciales inválidas, redirigir a login
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch (error) {
      // Cookie inválida, redirigir a login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}