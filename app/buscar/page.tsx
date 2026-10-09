import { prisma } from '@/lib/db'
import AdvancedSearch from '@/components/AdvancedSearch'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  titleVariants: ['Búsqueda avanzada de autoescuelas'],
  description:
    'Buscá autoescuelas y escuelas de manejo en Argentina por provincia, ciudad, precio y calificación, y encontrá la que mejor se adapta a vos.',
  path: '/buscar',
  noindex: true,
})

export default async function SearchPage() {
  // Datos mock para que funcione sin base de datos
  const provincesData = [
    { name: 'Buenos Aires', slug: 'buenos-aires' },
    { name: 'CABA', slug: 'caba' },
    { name: 'Córdoba', slug: 'cordoba' },
    { name: 'Santa Fe', slug: 'santa-fe' },
    { name: 'Mendoza', slug: 'mendoza' }
  ]

  const citiesData = [
    { name: 'Córdoba Capital', province: 'Córdoba' },
    { name: 'Villa María', province: 'Córdoba' },
    { name: 'Buenos Aires', province: 'Buenos Aires' },
    { name: 'La Plata', province: 'Buenos Aires' },
    { name: 'Rosario', province: 'Santa Fe' }
  ]

  // Intentar obtener datos reales si la base de datos está disponible
  try {
    const [provinces, cities] = await Promise.all([
      prisma.province.findMany({
        select: {
          name: true,
          slug: true
        },
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.city.findMany({
        select: {
          name: true,
          province: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    ])

    // Si la base de datos funciona, usar datos reales
    if (provinces.length > 0) {
      const realProvincesData = provinces.map(p => ({
        name: p.name,
        slug: p.slug
      }))

      const realCitiesData = cities.map(c => ({
        name: c.name,
        province: c.province.name
      }))

      return (
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="bg-card border-b">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-extrabold text-foreground mb-2">
                Búsqueda Avanzada
              </h1>
              <p className="text-muted-foreground">
                Encuentra la autoescuela perfecta con nuestros filtros avanzados
              </p>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="container mx-auto px-4 py-8">
            <AdvancedSearch 
              provinces={realProvincesData}
              cities={realCitiesData}
            />

            {/* Información adicional */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="surface-card p-6">
                <h3 className="font-semibold text-lg mb-2">🔍 Búsqueda Inteligente</h3>
                <p className="text-muted-foreground text-sm">
                  Nuestra búsqueda encuentra autoescuelas por nombre, ubicación, servicios y más.
                </p>
              </div>
              
              <div className="surface-card p-6">
                <h3 className="font-semibold text-lg mb-2">📍 Filtros por Ubicación</h3>
                <p className="text-muted-foreground text-sm">
                  Filtra por provincia y ciudad para encontrar autoescuelas cerca de ti.
                </p>
              </div>
              
              <div className="surface-card p-6">
                <h3 className="font-semibold text-lg mb-2">⭐ Calidad Garantizada</h3>
                <p className="text-muted-foreground text-sm">
                  Filtra por rating y precio para encontrar las mejores opciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  } catch (error) {
    console.log('Database not available, using mock data')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            Búsqueda Avanzada
          </h1>
          <p className="text-muted-foreground">
            Encuentra la autoescuela perfecta con nuestros filtros avanzados
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <AdvancedSearch 
          provinces={provincesData}
          cities={citiesData}
        />

        {/* Información adicional */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="surface-card p-6">
            <h3 className="font-semibold text-lg mb-2">🔍 Búsqueda Inteligente</h3>
            <p className="text-muted-foreground text-sm">
              Nuestra búsqueda encuentra autoescuelas por nombre, ubicación, servicios y más.
            </p>
          </div>
          
          <div className="surface-card p-6">
            <h3 className="font-semibold text-lg mb-2">📍 Filtros por Ubicación</h3>
            <p className="text-muted-foreground text-sm">
              Filtra por provincia y ciudad para encontrar autoescuelas cerca de ti.
            </p>
          </div>
          
          <div className="surface-card p-6">
            <h3 className="font-semibold text-lg mb-2">⭐ Calidad Garantizada</h3>
            <p className="text-muted-foreground text-sm">
              Filtra por rating y precio para encontrar las mejores opciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
