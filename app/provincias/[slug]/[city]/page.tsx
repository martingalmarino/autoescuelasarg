import { Metadata } from 'next'
import { getCityBySlugFromDB, getSchoolsByCitySlug } from '@/lib/database'
import CityPageClient from './CityPageClient'

// Forzar revalidación dinámica
export const dynamic = 'force-dynamic'

interface CityPageProps {
  params: {
    slug: string
    city: string
  }
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = await getCityBySlugFromDB(params.slug, params.city)
  
  if (!city) {
    return {
      title: 'Ciudad no encontrada',
    }
  }

  return {
    title: `Autoescuelas en ${city.name}, ${city.province.name} - Autoescuelas.ar`,
    description: `Encuentra las mejores autoescuelas en ${city.name}, ${city.province.name}. ${city.schoolsCount} escuelas de manejo disponibles con precios, reseñas y contacto directo.`,
    keywords: `autoescuelas, ${city.name}, ${city.province.name}, escuela de manejo, licencia de conducir, clases de manejo`,
    openGraph: {
      title: `Autoescuelas en ${city.name}, ${city.province.name}`,
      description: `Encuentra las mejores autoescuelas en ${city.name}, ${city.province.name}`,
    },
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const [city, schools] = await Promise.all([
    getCityBySlugFromDB(params.slug, params.city),
    getSchoolsByCitySlug(params.slug, params.city)
  ])
  
  return <CityPageClient 
    params={params} 
    city={city}
    schools={schools}
  />
}
