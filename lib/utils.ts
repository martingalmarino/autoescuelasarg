import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatReviews(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Remueve acentos
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/[^a-z0-9-]/g, '') // Remueve caracteres especiales
    .replace(/-+/g, '-') // Reemplaza múltiples guiones con uno solo
    .replace(/^-|-$/g, '') // Remueve guiones al inicio y final
}
