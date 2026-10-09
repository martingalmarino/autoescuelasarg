import { Metadata } from 'next'
import {
  getActiveSchoolsCount,
  getCachedActiveProvinces,
  getCityNamesWithSchools,
  getSchoolsPage,
} from '@/lib/database'
import SchoolsPageClient from './SchoolsPageClient'

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

function activeFilter(value?: string) {
  return value && value !== 'all' ? value : undefined
}

export default async function SchoolsPage({ searchParams }: SchoolsPageProps) {
  const province = activeFilter(searchParams.province)
  const city = province ? activeFilter(searchParams.city) : undefined

  const [provinces, totalSchools, result, cities] = await Promise.all([
    getCachedActiveProvinces(),
    getActiveSchoolsCount(),
    getSchoolsPage({
      page: parseInt(searchParams.page || '1') || 1,
      province,
      city,
      search: searchParams.search,
      sort: searchParams.sort,
    }),
    province ? getCityNamesWithSchools(province) : Promise.resolve([]),
  ])

  return <SchoolsPageClient
    result={result}
    totalSchools={totalSchools}
    provinces={provinces}
    cities={cities}
    searchParams={searchParams}
  />
}
