import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Función para normalizar slugs (quitar acentos y caracteres especiales)
function normalizeSlug(slug: string): string {
  return slug
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Reemplazar caracteres especiales con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-|-$/g, '') // Quitar guiones al inicio y final
}

// Función para decodificar URLs con caracteres especiales
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Solo procesar rutas de provincias y autoescuelas
  if (pathname.startsWith('/provincias/') || pathname.startsWith('/autoescuelas/')) {
    const pathSegments = pathname.split('/')
    
    if (pathSegments.length >= 3) {
      const [, routeType, slug] = pathSegments
      
      // Decodificar el slug primero
      const decodedSlug = decodeSlug(slug)
      
      // Normalizar el slug
      const normalizedSlug = normalizeSlug(decodedSlug)
      
      // Si el slug cambió, redirigir a la versión normalizada
      if (slug !== normalizedSlug) {
        const newPath = `/${routeType}/${normalizedSlug}`
        
        // Preservar query parameters si existen
        const searchParams = request.nextUrl.searchParams.toString()
        const redirectUrl = newPath + (searchParams ? `?${searchParams}` : '')
        
        return NextResponse.redirect(new URL(redirectUrl, request.url), 301)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/provincias/:path*',
    '/autoescuelas/:path*'
  ]
}