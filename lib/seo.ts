import type { Metadata } from 'next'
import { htmlToExcerpt } from './database'

export const SITE_NAME = 'Autoescuelas.ar'
export const SITE_URL = 'https://www.autoescuelas.ar'

const BRAND_SUFFIX = ` | ${SITE_NAME}`
const TITLE_MAX_LENGTH = 60
// htmlToExcerpt agrega "…" al cortar, así que el resultado queda en 158 como máximo.
const DESCRIPTION_MAX_LENGTH = 157
const DEFAULT_OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Autoescuelas.ar - Directorio de escuelas de manejo en Argentina',
}

// Nombres cargados con errores o poco buscables en la base, por slug.
const PLACE_NAME_ALIASES: Record<string, string> = {
  'buenos-aires-ciudad': 'CABA',
  'ciudad-neuquen': 'Neuquén Capital',
  resistenca: 'Resistencia',
  'viila-madero': 'Villa Madero',
}

const LOWERCASE_CONNECTORS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y'])

export function seoPlaceName(name: string, slug?: string): string {
  if (slug && PLACE_NAME_ALIASES[slug]) return PLACE_NAME_ALIASES[slug]

  return name
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      if (/^[A-ZÁÉÍÓÚÑ]{2,4}$/.test(word)) return word
      const lower = word.toLocaleLowerCase('es-AR')
      if (index > 0 && LOWERCASE_CONNECTORS.has(lower)) return lower
      return lower.charAt(0).toLocaleUpperCase('es-AR') + lower.slice(1)
    })
    .join(' ')
}

// La palabra clave tiene prioridad sobre la marca: se usa la primera variante que entra
// y se le agrega el sufijo de marca solo si sigue entrando.
export function fitTitle(variants: string[]): string {
  const candidates = variants.map(variant => variant.replace(/\s+/g, ' ').trim()).filter(Boolean)
  const fitting = candidates.find(variant => variant.length <= TITLE_MAX_LENGTH)
  if (!fitting) return candidates[candidates.length - 1] ?? SITE_NAME
  return fitting.length + BRAND_SUFFIX.length <= TITLE_MAX_LENGTH ? `${fitting}${BRAND_SUFFIX}` : fitting
}

export function includesPlace(text: string, place: string) {
  const normalize = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-AR')
  return normalize(text).includes(normalize(place))
}

export function clipDescription(text: string | null | undefined): string | undefined {
  return htmlToExcerpt(text, DESCRIPTION_MAX_LENGTH) ?? undefined
}

// Usa la primera variante que entra completa; si ninguna entra, recorta la última.
export function fitDescription(variants: string | null | undefined | Array<string | null | undefined>) {
  const candidates = (Array.isArray(variants) ? variants : [variants]).filter(
    (variant): variant is string => Boolean(variant && variant.trim())
  )
  const fitting = candidates.find(variant => variant.trim().length <= DESCRIPTION_MAX_LENGTH + 1)
  return clipDescription(fitting ?? candidates[candidates.length - 1])
}

export function formatPriceShort(price: number): string {
  return `$${price.toLocaleString('es-AR')}`
}

interface BuildMetadataOptions {
  titleVariants: string[]
  description: string | null | undefined | Array<string | null | undefined>
  path: string
  images?: string[]
  noindex?: boolean
  type?: 'website' | 'article'
}

export function buildMetadata({
  titleVariants,
  description,
  path,
  images,
  noindex = false,
  type = 'website',
}: BuildMetadataOptions): Metadata {
  const title = fitTitle(titleVariants)
  const cleanDescription = fitDescription(description)
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE]

  return {
    title: { absolute: title },
    description: cleanDescription,
    alternates: { canonical: path },
    ...(noindex && {
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
    }),
    openGraph: {
      title,
      description: cleanDescription,
      url: path,
      siteName: SITE_NAME,
      locale: 'es_AR',
      type,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: cleanDescription,
      images: ogImages.map(image => (typeof image === 'string' ? image : image.url)),
    },
  }
}

export const notFoundMetadata: Metadata = {
  title: { absolute: `Página no encontrada${BRAND_SUFFIX}` },
  robots: { index: false, follow: true },
}
