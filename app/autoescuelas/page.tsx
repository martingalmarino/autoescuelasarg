import { Metadata } from 'next'
import {
  getActiveSchoolsCount,
  getCachedActiveProvinces,
  getCityNamesWithSchools,
  getSchoolsPage,
} from '@/lib/database'
import { buildMetadata } from '@/lib/seo'
import SchoolsPageClient from './SchoolsPageClient'

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

export async function generateMetadata({ searchParams }: SchoolsPageProps): Promise<Metadata> {
  const page = Math.max(1, parseInt(searchParams.page || '1') || 1)
  const isFiltered = Boolean(
    activeFilter(searchParams.province) ||
      activeFilter(searchParams.city) ||
      searchParams.sort ||
      searchParams.search?.trim()
  )
  const totalSchools = await getActiveSchoolsCount().catch(() => 0)
  const countText = totalSchools > 0 ? `${totalSchools} autoescuelas` : 'Autoescuelas'
  const description = `${countText} y escuelas de manejo de Argentina. Filtrá por provincia y ciudad, compará precios y opiniones y elegí dónde aprender a manejar.`

  if (!isFiltered && page > 1) {
    return buildMetadata({
      titleVariants: [
        `Todas las autoescuelas de Argentina – Página ${page}`,
        `Autoescuelas de Argentina – Página ${page}`,
      ],
      description: `Página ${page}: ${description}`,
      path: `/autoescuelas?page=${page}`,
    })
  }

  return buildMetadata({
    titleVariants: ['Todas las autoescuelas de Argentina'],
    description,
    path: '/autoescuelas',
    noindex: isFiltered,
  })
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
