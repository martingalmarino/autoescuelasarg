"use client"

import type { SchoolEventType } from './premium'

const ENDPOINT = '/api/autoescuelas/events'

export function trackSchoolEvent(schoolId: string, type: SchoolEventType) {
  if (typeof window === 'undefined') return
  const body = JSON.stringify({ schoolId, type })
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: 'application/json' }))) return
  } catch {}
  fetch(ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(
    () => undefined
  )
}

/** Cuenta una vista por ficha y por sesión del navegador. */
export function trackSchoolView(schoolId: string) {
  const key = `school-view:${schoolId}`
  try {
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
  } catch {}
  trackSchoolEvent(schoolId, 'view')
}
