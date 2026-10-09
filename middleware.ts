import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAdminRequest, unauthorizedResponse } from '@/lib/admin-auth'

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
  const { pathname, hostname } = request.nextUrl

  // Redirigir de autoescuelas.ar a www.autoescuelas.ar
  if (hostname === 'autoescuelas.ar') {
    const url = request.nextUrl.clone()
    url.hostname = 'www.autoescuelas.ar'
    return NextResponse.redirect(url, 301)
  }

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

  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')) {
    if (!isAdminRequest(request)) return unauthorizedResponse()
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAdminRequest(request)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images/|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico)$).*)',
    '/api/admin/:path*',
  ],
}