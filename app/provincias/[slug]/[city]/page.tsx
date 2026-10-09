import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlugFromDB, getSchoolsByCitySlug } from '@/lib/database'
import { buildMetadata, notFoundMetadata, seoPlaceName } from '@/lib/seo'
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

  const countText = count === 1 ? '1 autoescuela' : `${count} autoescuelas`
  const description =
    count === 0
      ? `Autoescuelas y escuelas de manejo en ${cityName}: muy pronto vas a poder comparar precios, opiniones y cursos de manejo para sacar tu registro.`
      : [
          `${countText} en ${cityName}: compará precios, opiniones y cursos de manejo con autos doble comando. Elegí tu escuela de manejo y sacá el registro.`,
          `${countText} en ${cityName}: compará precios, opiniones y cursos de manejo. Elegí tu escuela de manejo y sacá el registro.`,
        ]

  return buildMetadata({
    titleVariants: [
      `Autoescuelas en ${place}: precios y opiniones`,
      `Autoescuelas en ${place}`,
      `Autoescuelas en ${cityName}`,
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
