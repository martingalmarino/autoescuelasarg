import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSchoolBySlugFromDB, getRelatedSchools, htmlToExcerpt } from '@/lib/database'
import { formatRating, formatReviews } from '@/lib/utils'
import { buildMetadata, formatPriceShort, includesPlace, notFoundMetadata, seoPlaceName } from '@/lib/seo'
import SchoolPageClient from './SchoolPageClient'

// ISR: 24 h. Las fichas se generan en la primera visita; el admin invalida la caché al editar.
export const revalidate = 86400

export async function generateStaticParams() {
  return []
}

interface SchoolPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: SchoolPageProps): Promise<Metadata> {
  const school = await getSchoolBySlugFromDB(params.slug)
  
  if (!school) {
    return notFoundMetadata
  }

  const name = school.name.replace(/\s+/g, ' ').trim()
  const city = seoPlaceName(school.city, school.citySlug)
  const province = seoPlaceName(school.province, school.provinceSlug)
  const nameHasKeyword = /autoescuela|escuela de manejo|conductor|conducci[oó]n|manejo/i.test(name)
  const inCity = includesPlace(name, city) ? '' : ` en ${city}`

  const titleVariants = nameHasKeyword
    ? [`${name}${inCity} – precios y opiniones`, `${name}${inCity}`, name]
    : [
        `${name}: autoescuela${inCity} – precios y opiniones`,
        `${name} – autoescuela${inCity}`,
        `${name}${inCity}`,
        name,
      ]

  const place = city.toLocaleLowerCase('es-AR') === province.toLocaleLowerCase('es-AR') ? city : `${city}, ${province}`
  const facts = [
    `${name}: ${/escuela de manejo/i.test(name) ? 'autoescuela' : 'escuela de manejo'} en ${place}.`,
    school.reviewsCount > 0 &&
      `${formatRating(school.rating)}★ (${formatReviews(school.reviewsCount)} ${school.reviewsCount === 1 ? 'opinión' : 'opiniones'}).`,
    school.priceMin && `Clases desde ${formatPriceShort(school.priceMin)}.`,
    htmlToExcerpt(school.description, 300) || 'Consultá precios, cursos, horarios y datos de contacto.',
  ].filter(Boolean)

  return buildMetadata({
    titleVariants,
    description: facts.join(' '),
    path: `/autoescuelas/${school.slug}`,
    images: school.imageUrl ? [school.imageUrl] : undefined,
    noindex: !school.isActive,
  })
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const school = await getSchoolBySlugFromDB(params.slug)

  if (!school) {
    notFound()
  }

  const relatedSchools = school.isActive
    ? await getRelatedSchools(school).catch((error) => {
        console.error(`Error fetching related schools for ${params.slug}:`, error)
        return []
      })
    : []

  return <SchoolPageClient school={school} relatedSchools={relatedSchools} />
}
