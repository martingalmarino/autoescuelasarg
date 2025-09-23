import { Metadata } from 'next'
import { getAllSchools, getAllProvinces } from '@/lib/mock-data'
import SchoolsPageClient from './SchoolsPageClient'

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

export default function SchoolsPage({ searchParams }: SchoolsPageProps) {
  const schools = getAllSchools()
  const provinces = getAllProvinces()
  
  return <SchoolsPageClient 
    schools={schools} 
    provinces={provinces}
    searchParams={searchParams}
  />
}
