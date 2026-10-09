import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActiveProvinces, getProvinceBySlugFromDB, getSchoolsByProvinceSlug, getActiveCitiesByProvince } from '@/lib/database'
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
    return {
      title: 'Provincia no encontrada',
    }
  }

  return {
    title: `Autoescuelas y Cursos de Manejo en ${province.name}`,
    description: `Encontrá las mejores autoescuelas en ${province.name} con instructores profesionales, autos doble comando y clases prácticas en ciudad y ruta. ${province.schoolsCount} escuelas de manejo disponibles.`,
    keywords: `autoescuelas, ${province.name}, escuela de manejo, licencia de conducir, clases de manejo, instructores profesionales, autos doble comando`,
    alternates: {
      canonical: `/provincias/${province.slug}`,
    },
    openGraph: {
      title: `Autoescuelas y Cursos de Manejo en ${province.name}`,
      description: `Encontrá las mejores autoescuelas en ${province.name} con instructores profesionales, autos doble comando y clases prácticas en ciudad y ruta.`,
      url: `https://www.autoescuelas.ar/provincias/${province.slug}`,
      images: province.imageUrl ? [province.imageUrl] : [],
    },
  }
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
