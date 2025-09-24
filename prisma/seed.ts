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

    // Crear autoescuelas de ejemplo
    const cordobaCapital = await prisma.city.findFirst({
      where: { slug: 'cordoba-capital' }
    })

    const villaMaria = await prisma.city.findFirst({
      where: { slug: 'villa-maria' }
    })

    if (cordobaCapital && villaMaria) {
      const schools = [
        {
          name: 'Autoescuela Premium Córdoba',
          slug: 'autoescuela-premium-cordoba',
          rating: 4.9,
          reviewsCount: 1563,
          cityId: cordobaCapital.id,
          provinceId: cordoba.id,
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
          priceMin: 30000,
          priceMax: 40000,
          description: 'Autoescuela Premium Córdoba es la institución líder en formación de conductores en la provincia. Con más de 15 años de experiencia, ofrecemos clases personalizadas con instructores certificados y vehículos modernos.',
          address: 'Av. Colón 1234, Córdoba Capital',
          phone: '+54 351 234-5678',
          email: 'info@autoescuelapremium.com',
          website: 'https://autoescuelapremium.com',
          services: ['Licencia B', 'Licencia A', 'Clases particulares', 'Simulador'],
          isFeatured: true,
          isVerified: true,
          sortOrder: 1,
          metaTitle: 'Autoescuela Premium Córdoba - Licencia de Conducir',
          metaDescription: 'La mejor autoescuela de Córdoba. Clases personalizadas, instructores certificados y vehículos modernos. Obtén tu licencia de conducir con nosotros.'
        },
        {
          name: 'Escuela de Manejo del Centro',
          slug: 'escuela-manejo-centro',
          rating: 4.6,
          reviewsCount: 892,
          cityId: cordobaCapital.id,
          provinceId: cordoba.id,
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          priceMin: 25000,
          priceMax: 32000,
          description: 'Ubicada en el corazón de Córdoba Capital, ofrecemos una formación integral para conductores con más de 10 años de experiencia en el mercado.',
          address: 'San Martín 567, Córdoba Capital',
          phone: '+54 351 345-6789',
          email: 'info@manejocentro.com',
          services: ['Licencia B', 'Clases particulares']
        },
        {
          name: 'Autoescuela Villa María',
          slug: 'autoescuela-villa-maria',
          rating: 4.4,
          reviewsCount: 234,
          cityId: villaMaria.id,
          provinceId: cordoba.id,
          imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
          priceMin: 22000,
          priceMax: 28000,
          description: 'Autoescuela familiar en Villa María, especializada en formar conductores responsables con más de 8 años de experiencia.',
          address: 'Av. Sabattini 890, Villa María',
          phone: '+54 353 456-7890',
          email: 'info@autoescuelavm.com',
          services: ['Licencia B', 'Licencia A', 'Clases particulares']
        }
      ]

      for (const school of schools) {
        // Solo crear si no existe (ni activa ni inactiva)
        const existingSchool = await prisma.drivingSchool.findUnique({
          where: { slug: school.slug }
        })
        
        if (!existingSchool) {
          await prisma.drivingSchool.create({
            data: school
          })
          console.log(`✅ Creada autoescuela: ${school.name}`)
        } else {
          console.log(`⏭️ Autoescuela ya existe: ${school.name} (${existingSchool.isActive ? 'activa' : 'inactiva'})`)
        }
      }

      console.log('✅ Driving schools created')
    }
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
