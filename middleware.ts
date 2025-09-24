import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Función para normalizar texto removiendo acentos y caracteres especiales
function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales excepto espacios y guiones
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-|-$/g, '') // Remover guiones al inicio y final
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Manejar URLs con acentos en provincias
  if (pathname.startsWith('/provincias/')) {
    const pathParts = pathname.split('/')
    if (pathParts.length >= 3) {
      const provinceSlug = pathParts[2]
      const normalizedSlug = normalizeSlug(decodeURIComponent(provinceSlug))
      
      // Si el slug tiene acentos o caracteres especiales, redirigir a la versión normalizada
      if (provinceSlug !== normalizedSlug) {
        let newPath = `/provincias/${normalizedSlug}`
        if (pathParts.length > 3) {
          // Incluir ciudad si existe
          newPath += '/' + pathParts.slice(3).join('/')
        }
        return NextResponse.redirect(new URL(newPath, request.url))
      }
    }
  }

  // Manejar URLs con acentos en autoescuelas
  if (pathname.startsWith('/autoescuelas/')) {
    const pathParts = pathname.split('/')
    if (pathParts.length >= 3) {
      const schoolSlug = pathParts[2]
      const normalizedSlug = normalizeSlug(decodeURIComponent(schoolSlug))
      
      // Si el slug tiene acentos o caracteres especiales, redirigir a la versión normalizada
      if (schoolSlug !== normalizedSlug) {
        const newPath = `/autoescuelas/${normalizedSlug}`
        return NextResponse.redirect(new URL(newPath, request.url))
      }
    }
  }

  // Verificar si la ruta es /admin pero NO es /admin/login ni /api/admin/auth
  if (pathname.startsWith('/admin') && 
      pathname !== '/admin/login' && 
      !pathname.startsWith('/api/admin/auth')) {
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
    '/provincias/:path*',
    '/autoescuelas/:path*',
  ],
}