import { getActiveProvinces } from '@/lib/database'
import { buildMetadata } from '@/lib/seo'
import ProvincesPageClient from './ProvincesPageClient'

// ISR: 24 h. El admin invalida la caché al editar datos.
export const revalidate = 86400

export const metadata = buildMetadata({
  titleVariants: ['Autoescuelas por provincia en Argentina'],
  description:
    'Encontrá autoescuelas en las 24 provincias argentinas: Buenos Aires, CABA, Córdoba, Santa Fe, Mendoza y más. Compará escuelas de manejo cerca tuyo.',
  path: '/provincias',
})

export default async function ProvincesPage() {
  const provinces = await getActiveProvinces()
  return <ProvincesPageClient provinces={provinces} />
}
