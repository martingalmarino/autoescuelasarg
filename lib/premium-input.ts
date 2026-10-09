import { Prisma } from '@prisma/client'
import { isPremiumActive, parseFaqs } from './premium'

const str = (value: unknown, max: number) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim().slice(0, max)
  return trimmed || null
}

const stringList = (value: unknown, max: number, maxItems: number) =>
  Array.isArray(value)
    ? value
        .map(item => str(item, max))
        .filter((item): item is string => item !== null)
        .slice(0, maxItems)
    : []

/** El vencimiento se guarda al final del día indicado, en hora de Argentina. */
function parseExpiry(value: unknown): Date | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T23:59:59-03:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function parseYear(value: unknown): number | null {
  const year = typeof value === 'number' ? value : parseInt(String(value ?? ''), 10)
  return year >= 1900 && year <= new Date().getFullYear() ? year : null
}

/**
 * Convierte los campos de dueño y plan del formulario del admin en datos de Prisma.
 * isFeatured se deriva del plan vigente para que el orden de los listados dependa solo del plan.
 */
export function premiumUpdateData(
  body: Record<string, unknown>,
  existing: { plan: string; planExpiresAt: Date | null; claimedAt: Date | null; ownerEmail: string | null; ownerPhone: string | null }
): Prisma.DrivingSchoolUpdateInput {
  const data: Prisma.DrivingSchoolUpdateInput = {}
  const has = (key: string) => body[key] !== undefined

  if (has('ownerName')) data.ownerName = str(body.ownerName, 120)
  if (has('ownerEmail')) data.ownerEmail = str(body.ownerEmail, 160)?.toLowerCase() ?? null
  if (has('ownerPhone')) data.ownerPhone = str(body.ownerPhone, 30)
  if (has('ownerEmail') || has('ownerPhone')) {
    const ownerEmail = has('ownerEmail') ? data.ownerEmail : existing.ownerEmail
    const ownerPhone = has('ownerPhone') ? data.ownerPhone : existing.ownerPhone
    data.claimedAt = ownerEmail || ownerPhone ? existing.claimedAt ?? new Date() : null
  }

  if (has('whatsapp')) data.whatsapp = str(body.whatsapp, 30)
  if (has('videoUrl')) data.videoUrl = str(body.videoUrl, 300)
  if (has('promotion')) data.promotion = str(body.promotion, 200)
  if (has('licenseNumber')) data.licenseNumber = str(body.licenseNumber, 60)
  if (has('foundedYear')) data.foundedYear = parseYear(body.foundedYear)
  if (has('gallery')) data.gallery = stringList(body.gallery, 500, 12).filter(url => url.startsWith('https://'))
  if (has('features')) data.features = stringList(body.features, 80, 20)
  if (has('faqs')) {
    const faqs = parseFaqs(body.faqs).slice(0, 10)
    data.faqs = faqs.length ? faqs.map(faq => ({ question: faq.question, answer: faq.answer })) : Prisma.JsonNull
  }

  if (has('plan') || has('planExpiresAt')) {
    const plan = has('plan') ? (body.plan === 'PREMIUM' ? 'PREMIUM' : 'FREE') : existing.plan
    const planExpiresAt = has('planExpiresAt') ? parseExpiry(body.planExpiresAt) : existing.planExpiresAt
    data.plan = plan as 'FREE' | 'PREMIUM'
    data.planExpiresAt = plan === 'PREMIUM' ? planExpiresAt : null
    data.isFeatured = isPremiumActive({ plan, planExpiresAt })
  }

  return data
}
