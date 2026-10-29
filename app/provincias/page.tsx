import { getActiveProvinces } from '@/lib/database'
import { buildMetadata } from '@/lib/seo'
import ProvincesPageClient from './ProvincesPageClient'

// ISR: 24 h. El admin invalida la caché al editar datos.
export const revalidate = 86400

export const metadata = buildMetadata({
  titleVariants: ['Escuelas de manejo por provincia en Argentina'],
  description:
    'Encontrá escuelas de manejo por provincia en Argentina. Elegí tu provincia y compará autoescuelas, precios y opiniones cerca tuyo.',
  path: '/provincias',
})

export default async function ProvincesPage() {
  const provinces = await getActiveProvinces()
  return <ProvincesPageClient provinces={provinces} />
}
