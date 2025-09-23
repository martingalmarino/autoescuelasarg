import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Crear provincias
  const provinces = [
    { name: 'Buenos Aires', slug: 'buenos-aires', schoolsCount: 245, description: 'La provincia más poblada de Argentina con una gran oferta de autoescuelas' },
    { name: 'CABA', slug: 'caba', schoolsCount: 89, description: 'Ciudad Autónoma de Buenos Aires, capital del país' },
    { name: 'Catamarca', slug: 'catamarca', schoolsCount: 12, description: 'Provincia del noroeste argentino' },
    { name: 'Chaco', slug: 'chaco', schoolsCount: 23, description: 'Provincia del noreste argentino' },
    { name: 'Chubut', slug: 'chubut', schoolsCount: 18, description: 'Provincia de la Patagonia argentina' },
    { name: 'Córdoba', slug: 'cordoba', schoolsCount: 67, description: 'Segunda provincia más poblada de Argentina' },
    { name: 'Corrientes', slug: 'corrientes', schoolsCount: 34, description: 'Provincia del noreste argentino' },
    { name: 'Entre Ríos', slug: 'entre-rios', schoolsCount: 28, description: 'Provincia del litoral argentino' },
    { name: 'Formosa', slug: 'formosa', schoolsCount: 15, description: 'Provincia del noreste argentino' },
    { name: 'Jujuy', slug: 'jujuy', schoolsCount: 19, description: 'Provincia del noroeste argentino' },
    { name: 'La Pampa', slug: 'la-pampa', schoolsCount: 14, description: 'Provincia de la región pampeana' },
    { name: 'La Rioja', slug: 'la-rioja', schoolsCount: 11, description: 'Provincia del noroeste argentino' },
    { name: 'Mendoza', slug: 'mendoza', schoolsCount: 45, description: 'Provincia de Cuyo, famosa por sus viñedos' },
    { name: 'Misiones', slug: 'misiones', schoolsCount: 31, description: 'Provincia del noreste argentino' },
    { name: 'Neuquén', slug: 'neuquen', schoolsCount: 22, description: 'Provincia de la Patagonia argentina' },
    { name: 'Río Negro', slug: 'rio-negro', schoolsCount: 26, description: 'Provincia de la Patagonia argentina' },
    { name: 'Salta', slug: 'salta', schoolsCount: 29, description: 'Provincia del noroeste argentino' },
    { name: 'San Juan', slug: 'san-juan', schoolsCount: 16, description: 'Provincia de Cuyo' },
    { name: 'San Luis', slug: 'san-luis', schoolsCount: 13, description: 'Provincia de Cuyo' },
    { name: 'Santa Cruz', slug: 'santa-cruz', schoolsCount: 8, description: 'Provincia de la Patagonia argentina' },
    { name: 'Santa Fe', slug: 'santa-fe', schoolsCount: 52, description: 'Provincia del litoral argentino' },
    { name: 'Santiago del Estero', slug: 'santiago-del-estero', schoolsCount: 17, description: 'Provincia del noroeste argentino' },
    { name: 'Tierra del Fuego', slug: 'tierra-del-fuego', schoolsCount: 6, description: 'Provincia más austral de Argentina' },
    { name: 'Tucumán', slug: 'tucuman', schoolsCount: 38, description: 'Provincia del noroeste argentino' }
  ]

  for (const province of provinces) {
    await prisma.province.upsert({
      where: { slug: province.slug },
      update: province,
      create: province
    })
  }

  console.log('✅ Provinces created')

  // Crear ciudades para Córdoba
  const cordoba = await prisma.province.findUnique({
    where: { slug: 'cordoba' }
  })

  if (cordoba) {
    const cities = [
      { name: 'Córdoba Capital', slug: 'cordoba-capital', provinceId: cordoba.id, schoolsCount: 45 },
      { name: 'Villa María', slug: 'villa-maria', provinceId: cordoba.id, schoolsCount: 8 },
      { name: 'Río Cuarto', slug: 'rio-cuarto', provinceId: cordoba.id, schoolsCount: 6 },
      { name: 'San Francisco', slug: 'san-francisco', provinceId: cordoba.id, schoolsCount: 4 },
      { name: 'Villa Carlos Paz', slug: 'villa-carlos-paz', provinceId: cordoba.id, schoolsCount: 4 }
    ]

    for (const city of cities) {
      await prisma.city.upsert({
        where: { 
          name_provinceId: {
            name: city.name,
            provinceId: city.provinceId
          }
        },
        update: city,
        create: city
      })
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
          services: ['Licencia B', 'Licencia A', 'Clases particulares', 'Simulador']
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
        await prisma.drivingSchool.upsert({
          where: { slug: school.slug },
          update: school,
          create: school
        })
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
