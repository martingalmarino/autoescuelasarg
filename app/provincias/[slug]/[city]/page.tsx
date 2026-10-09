import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlugFromDB, getSchoolsByCitySlug } from '@/lib/database'
import CityPageClient from './CityPageClient'

// ISR: 24 h. Las ciudades se generan en la primera visita y quedan cacheadas.
export const revalidate = 86400

export async function generateStaticParams() {
  return []
}

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

  if (!city) {
    notFound()
  }

  return <CityPageClient city={city} schools={schools} />
}
