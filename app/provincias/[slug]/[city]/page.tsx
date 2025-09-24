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
    title: `Aprende a Manejar en ${city.name}, ${city.province.name} | Autoescuelas.ar`,
    description: `Aprendé a manejar en ${city.name} con autoescuelas que ofrecen instructores capacitados, autos doble comando y clases prácticas adaptadas a tu ritmo. ${city.schoolsCount} escuelas de manejo disponibles.`,
    keywords: `autoescuelas, ${city.name}, ${city.province.name}, escuela de manejo, licencia de conducir, clases de manejo, instructores capacitados, autos doble comando`,
    alternates: {
      canonical: `/provincias/${city.province.slug}/${city.slug}`,
    },
    openGraph: {
      title: `Aprende a Manejar en ${city.name}, ${city.province.name} | Autoescuelas.ar`,
      description: `Aprendé a manejar en ${city.name} con autoescuelas que ofrecen instructores capacitados, autos doble comando y clases prácticas adaptadas a tu ritmo.`,
      url: `https://www.autoescuelas.ar/provincias/${city.province.slug}/${city.slug}`,
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
