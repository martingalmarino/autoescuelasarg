import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActiveProvinces, getProvinceBySlugFromDB, getSchoolsByProvinceSlug, getActiveCitiesByProvince } from '@/lib/database'
import { buildMetadata, notFoundMetadata, seoPlaceName } from '@/lib/seo'
import ProvincePageClient from './ProvincePageClient'

// ISR: 24 h. El admin invalida la caché al editar datos.
export const revalidate = 86400

export async function generateStaticParams() {
  try {
    const provinces = await getActiveProvinces()
    return provinces.map((province) => ({ slug: province.slug }))
  } catch (error) {
    console.error('Error generating province params:', error)
    return []
  }
}

interface ProvincePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProvincePageProps): Promise<Metadata> {
  const province = await getProvinceBySlugFromDB(params.slug)
  
  if (!province) {
    return notFoundMetadata
  }

  const name = seoPlaceName(province.name, province.slug)
  const count = province.activeSchoolsCount
  const topCities = province.cities
    .filter((city) => city.activeSchoolsCount > 0)
    .sort((a, b) => b.activeSchoolsCount - a.activeSchoolsCount)
    .map((city) => seoPlaceName(city.name, city.slug))
    .filter((cityName) => cityName.toLocaleLowerCase('es-AR') !== name.toLocaleLowerCase('es-AR'))
    .slice(0, 2)

  const countText = count === 1 ? '1 autoescuela' : `${count} autoescuelas`
  const description =
    count === 0
      ? [`Autoescuelas y escuelas de manejo en ${name}: muy pronto vas a poder comparar precios, opiniones y clases para sacar tu registro de conducir.`]
      : [
          topCities.length > 1 &&
            `${countText} en ${name} con precios, opiniones y contacto. Compará escuelas de manejo en ${topCities.join(', ')} y más, y sacá tu registro.`,
          topCities.length > 0 &&
            `${countText} en ${name} con precios, opiniones y contacto. Compará escuelas de manejo en ${topCities[0]} y más, y sacá tu registro.`,
          `${countText} en ${name} con precios, opiniones y contacto. Compará escuelas de manejo y clases para sacar tu registro de conducir.`,
        ].filter((variant): variant is string => Boolean(variant))

  return buildMetadata({
    titleVariants: [
      `Autoescuelas en ${name}: escuelas de manejo y clases`,
      `Autoescuelas en ${name}: escuelas de manejo`,
      `Autoescuelas en ${name}`,
    ],
    description,
    path: `/provincias/${province.slug}`,
    images: province.imageUrl ? [province.imageUrl] : undefined,
    noindex: count === 0,
  })
}

export default async function ProvincePage({ params }: ProvincePageProps) {
  const [province, schools] = await Promise.all([
    getProvinceBySlugFromDB(params.slug),
    getSchoolsByProvinceSlug(params.slug),
  ])

  if (!province) {
    notFound()
  }

  const cities = await getActiveCitiesByProvince(province.id)

  return <ProvincePageClient 
    province={province}
    schools={schools}
    cities={cities}
  />
}
