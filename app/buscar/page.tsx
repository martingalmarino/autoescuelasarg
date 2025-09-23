import { PrismaClient } from '@prisma/client'
import AdvancedSearch from '@/components/AdvancedSearch'

const prisma = new PrismaClient()

export default async function SearchPage() {
  // Obtener datos para los filtros
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

  // Transformar datos para el componente
  const provincesData = provinces.map(p => ({
    name: p.name,
    slug: p.slug
  }))

  const citiesData = cities.map(c => ({
    name: c.name,
    province: c.province.name
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Búsqueda Avanzada
          </h1>
          <p className="text-gray-600">
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
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">🔍 Búsqueda Inteligente</h3>
            <p className="text-gray-600 text-sm">
              Nuestra búsqueda encuentra autoescuelas por nombre, ubicación, servicios y más.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">📍 Filtros por Ubicación</h3>
            <p className="text-gray-600 text-sm">
              Filtra por provincia y ciudad para encontrar autoescuelas cerca de ti.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">⭐ Calidad Garantizada</h3>
            <p className="text-gray-600 text-sm">
              Filtra por rating y precio para encontrar las mejores opciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
