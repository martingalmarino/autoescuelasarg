export type SchoolPlanId = 'FREE' | 'PREMIUM'

export interface SchoolFaq {
  question: string
  answer: string
}

export const SCHOOL_FEATURE_OPTIONS = [
  'Auto con doble comando',
  'Auto manual',
  'Auto automático',
  'Retiro a domicilio',
  'Clases los fines de semana',
  'Clases teóricas incluidas',
  'Simulador de manejo',
  'Acompañamiento al examen práctico',
  'Clases para personas con miedo a manejar',
  'Clases de moto (categoría A)',
]

export const SCHOOL_EVENT_TYPES = ['view', 'whatsapp', 'phone', 'website', 'email', 'directions'] as const
export type SchoolEventType = (typeof SCHOOL_EVENT_TYPES)[number]

export function isSchoolEventType(value: unknown): value is SchoolEventType {
  return typeof value === 'string' && (SCHOOL_EVENT_TYPES as readonly string[]).indexOf(value) !== -1
}

export function isPremiumActive(
  school: { plan?: string | null; planExpiresAt?: Date | string | null },
  now: Date = new Date()
): boolean {
  if (school.plan !== 'PREMIUM') return false
  if (!school.planExpiresAt) return true
  return new Date(school.planExpiresAt).getTime() > now.getTime()
}

export function parseFaqs(value: unknown): SchoolFaq[] {
  if (!Array.isArray(value)) return []
  return value
    .filter(
      (item): item is SchoolFaq =>
        !!item && typeof item.question === 'string' && typeof item.answer === 'string'
    )
    .map(item => ({ question: item.question.trim(), answer: item.answer.trim() }))
    .filter(item => item.question && item.answer)
}

/** Enlace de WhatsApp. Los números argentinos sin código de país se asumen celulares (54 9). */
export function whatsappUrl(phone: string | null | undefined, message: string): string | null {
  if (!phone) return null
  let national = phone.replace(/\D/g, '').replace(/^0+/, '')
  if (national.length < 8) return null
  if (national.length > 11 && national.startsWith('54')) national = national.slice(2).replace(/^9/, '').replace(/^0+/, '')
  // Celulares argentinos: el número nacional tiene 10 dígitos; el "15" local va después del código de área (2 a 4 dígitos).
  if (national.length === 12) {
    const areaLength = national.startsWith('11') ? 2 : [3, 4].find(length => national.substr(length, 2) === '15')
    if (areaLength && national.substr(areaLength, 2) === '15') {
      national = national.slice(0, areaLength) + national.slice(areaLength + 2)
    }
  }
  return `https://wa.me/549${national}?text=${encodeURIComponent(message)}`
}

export function youtubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/)
  return match ? match[1] : null
}

export function mapsUrl(parts: Array<string | null | undefined>): string | null {
  const query = parts.filter(Boolean).join(', ')
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null
}
