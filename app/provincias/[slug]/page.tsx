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
    title: `Autoescuelas en ${province.name} - Autoescuelas.ar`,
    description: `Encuentra las mejores autoescuelas en ${province.name}. ${province.schoolsCount} escuelas de manejo disponibles con precios, reseñas y contacto directo.`,
    keywords: `autoescuelas, ${province.name}, escuela de manejo, licencia de conducir, clases de manejo`,
    openGraph: {
      title: `Autoescuelas en ${province.name}`,
      description: `Encuentra las mejores autoescuelas en ${province.name}`,
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
