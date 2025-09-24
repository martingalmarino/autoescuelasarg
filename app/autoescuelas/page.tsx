import { Metadata } from 'next'
import { getActiveProvinces, getAllSchoolsFromDB } from '@/lib/database'
import SchoolsPageClient from './SchoolsPageClient'

// Forzar revalidación dinámica
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Todas las Autoescuelas - Autoescuelas.ar',
  description: 'Encuentra todas las autoescuelas de Argentina. Filtra por provincia, ciudad y calificación. Compara precios y lee reseñas de estudiantes.',
  keywords: 'autoescuelas, Argentina, escuela de manejo, licencia de conducir, clases de manejo, todas las autoescuelas',
  openGraph: {
    title: 'Todas las Autoescuelas - Autoescuelas.ar',
    description: 'Encuentra todas las autoescuelas de Argentina. Filtra por provincia, ciudad y calificación.',
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
