import { Metadata } from 'next'
import { getActiveProvinces } from '@/lib/database'
import ProvincesPageClient from './ProvincesPageClient'

// Force dynamic rendering to get fresh data
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Todas las Provincias - Autoescuelas.ar',
  description: 'Encuentra autoescuelas en todas las provincias de Argentina. Navega por provincia para encontrar la escuela de manejo más cercana a ti.',
  keywords: 'autoescuelas, provincias, Argentina, escuela de manejo, licencia de conducir, por provincia',
  alternates: {
    canonical: '/provincias',
  },
  openGraph: {
    title: 'Todas las Provincias - Autoescuelas.ar',
    description: 'Encuentra autoescuelas en todas las provincias de Argentina',
    url: 'https://www.autoescuelas.ar/provincias',
  },
}

export default async function ProvincesPage() {
  const provinces = await getActiveProvinces()
  return <ProvincesPageClient provinces={provinces} />
}
