import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

    // Crear provincias con orden y estado
    const provinces = [
      { name: 'Buenos Aires', slug: 'buenos-aires', schoolsCount: 245, description: 'La provincia más poblada de Argentina con una gran oferta de autoescuelas', sortOrder: 1 },
      { name: 'CABA', slug: 'caba', schoolsCount: 89, description: 'Ciudad Autónoma de Buenos Aires, capital del país', sortOrder: 2 },
      { name: 'Córdoba', slug: 'cordoba', schoolsCount: 67, description: 'Segunda provincia más poblada de Argentina', sortOrder: 3 },
      { name: 'Santa Fe', slug: 'santa-fe', schoolsCount: 52, description: 'Provincia del litoral argentino', sortOrder: 4 },
      { name: 'Mendoza', slug: 'mendoza', schoolsCount: 45, description: 'Provincia de Cuyo, famosa por sus viñedos', sortOrder: 5 },
      { name: 'Tucumán', slug: 'tucuman', schoolsCount: 38, description: 'Provincia del noroeste argentino', sortOrder: 6 },
      { name: 'Corrientes', slug: 'corrientes', schoolsCount: 34, description: 'Provincia del noreste argentino', sortOrder: 7 },
      { name: 'Misiones', slug: 'misiones', schoolsCount: 31, description: 'Provincia del noreste argentino', sortOrder: 8 },
      { name: 'Salta', slug: 'salta', schoolsCount: 29, description: 'Provincia del noroeste argentino', sortOrder: 9 },
      { name: 'Entre Ríos', slug: 'entre-rios', schoolsCount: 28, description: 'Provincia del litoral argentino', sortOrder: 10 },
      { name: 'Río Negro', slug: 'rio-negro', schoolsCount: 26, description: 'Provincia de la Patagonia argentina', sortOrder: 11 },
      { name: 'Chaco', slug: 'chaco', schoolsCount: 23, description: 'Provincia del noreste argentino', sortOrder: 12 },
      { name: 'Neuquén', slug: 'neuquen', schoolsCount: 22, description: 'Provincia de la Patagonia argentina', sortOrder: 13 },
      { name: 'Jujuy', slug: 'jujuy', schoolsCount: 19, description: 'Provincia del noroeste argentino', sortOrder: 14 },
      { name: 'Santiago del Estero', slug: 'santiago-del-estero', schoolsCount: 17, description: 'Provincia del noroeste argentino', sortOrder: 15 },
      { name: 'San Juan', slug: 'san-juan', schoolsCount: 16, description: 'Provincia de Cuyo', sortOrder: 16 },
      { name: 'Chubut', slug: 'chubut', schoolsCount: 18, description: 'Provincia de la Patagonia argentina', sortOrder: 17 },
      { name: 'Formosa', slug: 'formosa', schoolsCount: 15, description: 'Provincia del noreste argentino', sortOrder: 18 },
      { name: 'La Pampa', slug: 'la-pampa', schoolsCount: 14, description: 'Provincia de la región pampeana', sortOrder: 19 },
      { name: 'San Luis', slug: 'san-luis', schoolsCount: 13, description: 'Provincia de Cuyo', sortOrder: 20 },
      { name: 'Catamarca', slug: 'catamarca', schoolsCount: 12, description: 'Provincia del noroeste argentino', sortOrder: 21 },
      { name: 'La Rioja', slug: 'la-rioja', schoolsCount: 11, description: 'Provincia del noroeste argentino', sortOrder: 22 },
      { name: 'Santa Cruz', slug: 'santa-cruz', schoolsCount: 8, description: 'Provincia de la Patagonia argentina', sortOrder: 23 },
      { name: 'Tierra del Fuego', slug: 'tierra-del-fuego', schoolsCount: 6, description: 'Provincia más austral de Argentina', sortOrder: 24 }
    ]

  for (const province of provinces) {
    // Solo crear si no existe, no actualizar
    const existingProvince = await prisma.province.findUnique({
      where: { slug: province.slug }
    })
    
    if (!existingProvince) {
      await prisma.province.create({
        data: province
      })
    }
  }

  console.log('✅ Provinces created')

  // Crear ciudades para Córdoba
  const cordoba = await prisma.province.findUnique({
    where: { slug: 'cordoba' }
  })

  if (cordoba) {
    const cities = [
      { name: 'Córdoba Capital', slug: 'cordoba-capital', provinceId: cordoba.id, schoolsCount: 45, sortOrder: 1 },
      { name: 'Villa María', slug: 'villa-maria', provinceId: cordoba.id, schoolsCount: 8, sortOrder: 2 },
      { name: 'Río Cuarto', slug: 'rio-cuarto', provinceId: cordoba.id, schoolsCount: 6, sortOrder: 3 },
      { name: 'San Francisco', slug: 'san-francisco', provinceId: cordoba.id, schoolsCount: 4, sortOrder: 4 },
      { name: 'Villa Carlos Paz', slug: 'villa-carlos-paz', provinceId: cordoba.id, schoolsCount: 4, sortOrder: 5 }
    ]

    for (const city of cities) {
      // Solo crear si no existe, no actualizar
      const existingCity = await prisma.city.findFirst({
        where: { 
          name: city.name,
          provinceId: city.provinceId
        }
      })
      
      if (!existingCity) {
        await prisma.city.create({
          data: city
        })
      }
    }

    console.log('✅ Cities created')

    // ELIMINAR ESTA SECCIÓN DE CREACIÓN DE AUTOESCUELAS
    // Las autoescuelas ahora se gestionan únicamente a través del panel de administración
    // No se crean automáticamente en el seeding para evitar regeneración
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
