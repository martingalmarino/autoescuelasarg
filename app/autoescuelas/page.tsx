import { Metadata } from 'next'
import { getActiveProvinces, getAllSchoolsFromDB } from '@/lib/database'
import SchoolsPageClient from './SchoolsPageClient'

// Forzar revalidación dinámica
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Las mejores Autoescuelas de Argentina',
  description: 'Encuentra todas las autoescuelas de Argentina. Filtra por provincia, ciudad y calificación. Compara precios y lee reseñas de estudiantes.',
  keywords: 'autoescuelas, Argentina, escuela de manejo, licencia de conducir, clases de manejo, todas las autoescuelas',
  alternates: {
    canonical: '/autoescuelas',
  },
  openGraph: {
    title: 'Las mejores Autoescuelas de Argentina',
    description: 'Encuentra todas las autoescuelas de Argentina. Filtra por provincia, ciudad y calificación.',
    url: 'https://www.autoescuelas.ar/autoescuelas',
  },
}

interface SchoolsPageProps {
  searchParams: {
    page?: string
    province?: string
    city?: string
    sort?: string
    search?: string
  }
}

export default async function SchoolsPage({ searchParams }: SchoolsPageProps) {
  // Usar datos de la base de datos
  const [provinces, schools] = await Promise.all([
    getActiveProvinces(),
    getAllSchoolsFromDB()
  ])
  
  return <SchoolsPageClient 
    schools={schools} 
    provinces={provinces}
    searchParams={searchParams}
  />
}
