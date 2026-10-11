import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlugFromDB, getSchoolsByCitySlug } from '@/lib/database'
import { buildMetadata, notFoundMetadata, seoPlaceName } from '@/lib/seo'
import { schoolsCountText } from '@/lib/utils'
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
    return notFoundMetadata
  }

  const cityName = seoPlaceName(city.name, city.slug)
  const provinceName = seoPlaceName(city.province.name, city.province.slug)
  const sameName = cityName.toLocaleLowerCase('es-AR') === provinceName.toLocaleLowerCase('es-AR')
  const place = sameName ? cityName : `${cityName}, ${provinceName}`
  const count = city.schoolsCount

  const countText = schoolsCountText(count)
  const description =
    count === 0
      ? `Escuelas de manejo en ${cityName}: muy pronto vas a poder comparar autoescuelas, precios, opiniones y cursos de manejo para sacar tu registro.`
      : [
          `${countText} en ${cityName}: compará autoescuelas por precio, opiniones y cursos con autos doble comando, y sacá tu registro de conducir.`,
          `${countText} en ${cityName}: compará autoescuelas por precio, opiniones y cursos, y sacá tu registro.`,
        ]

  return buildMetadata({
    titleVariants: [
      `Escuelas de manejo en ${place}: precios y opiniones`,
      `Escuelas de manejo en ${place}`,
      `Escuelas de manejo en ${cityName}`,
    ],
    description,
    path: `/provincias/${city.province.slug}/${city.slug}`,
    noindex: count === 0,
  })
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
