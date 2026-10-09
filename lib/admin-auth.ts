import { NextResponse, type NextRequest } from 'next/server'

export const ADMIN_COOKIE = 'admin-auth'

export function isValidAdminCookie(value: string | undefined): boolean {
  if (!value) return false
  try {
    const authData = JSON.parse(value)
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin'
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'
    return authData.username === expectedUsername && authData.password === expectedPassword
  } catch {
    return false
  }
}

export function isAdminRequest(request: NextRequest): boolean {
  return isValidAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)
}

export function unauthorizedResponse() {
  return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
}
