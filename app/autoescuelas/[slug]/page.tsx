import { Metadata } from 'next'
import { getSchoolBySlug } from '@/lib/mock-data'
import { getSchoolBySlugFromDB } from '@/lib/database'
import { formatPrice, formatRating, formatReviews } from '@/lib/utils'
import SchoolPageClient from './SchoolPageClient'

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

export default function SchoolPage({ params }: SchoolPageProps) {
  return <SchoolPageClient params={params} />
}
