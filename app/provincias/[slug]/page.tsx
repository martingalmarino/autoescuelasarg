import { Metadata } from 'next'
import { getProvinceBySlugFromDB, getSchoolsByProvinceSlug, getActiveCitiesByProvince } from '@/lib/database'
import ProvincePageClient from './ProvincePageClient'

// Forzar revalidación dinámica
export const dynamic = 'force-dynamic'

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
  const [province, schools, cities] = await Promise.all([
    getProvinceBySlugFromDB(params.slug),
    getSchoolsByProvinceSlug(params.slug),
    getProvinceBySlugFromDB(params.slug).then(async (province) => {
      if (!province) return []
      return getActiveCitiesByProvince(province.id)
    })
  ])
  
  return <ProvincePageClient 
    params={params} 
    province={province}
    schools={schools}
    cities={cities}
  />
}
