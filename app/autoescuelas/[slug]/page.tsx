import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSchoolBySlugFromDB, getRelatedSchools } from '@/lib/database'
import { formatRating, formatReviews } from '@/lib/utils'
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
    return {
      title: 'Autoescuela no encontrada',
    }
  }

  return {
    title: `${school.name} - Autoescuelas.ar`,
    description: `${school.description || `Autoescuela en ${school.city}, ${school.province}. ${formatRating(school.rating)} estrellas con ${formatReviews(school.reviewsCount)} reseñas.`}`,
    keywords: `autoescuela, ${school.name}, ${school.city}, ${school.province}, escuela de manejo, licencia de conducir`,
    alternates: {
      canonical: `/autoescuelas/${school.slug}`,
    },
    openGraph: {
      title: school.name,
      description: school.description || `Autoescuela en ${school.city}, ${school.province}`,
      url: `https://www.autoescuelas.ar/autoescuelas/${school.slug}`,
      images: school.imageUrl ? [school.imageUrl] : [],
    },
  }
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
