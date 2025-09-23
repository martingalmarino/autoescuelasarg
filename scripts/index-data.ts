import { PrismaClient } from '@prisma/client'
import { indexSchools, indexProvinces, indexCities, SearchSchool, SearchProvince, SearchCity } from '@/lib/search'

const prisma = new PrismaClient()

async function indexData() {
  console.log('🚀 Starting data indexing...')

  try {
    // Obtener datos de la base de datos
    const [schools, provinces, cities] = await Promise.all([
      prisma.drivingSchool.findMany({
        include: {
          city: true,
          province: true
        }
      }),
      prisma.province.findMany(),
      prisma.city.findMany({
        include: {
          province: true
        }
      })
    ])

    console.log(`📊 Found ${schools.length} schools, ${provinces.length} provinces, ${cities.length} cities`)

    // Transformar datos para Meilisearch
    const searchSchools: SearchSchool[] = schools.map(school => ({
      id: school.id,
      name: school.name,
      slug: school.slug,
      description: school.description,
      rating: school.rating,
      reviewsCount: school.reviewsCount,
      city: school.city.name,
      province: school.province.name,
      priceMin: school.priceMin,
      priceMax: school.priceMax,
      imageUrl: school.imageUrl,
      address: school.address,
      phone: school.phone,
      email: school.email,
      website: school.website,
      services: school.services || []
    }))

    const searchProvinces: SearchProvince[] = provinces.map(province => ({
      id: province.id,
      name: province.name,
      slug: province.slug,
      description: province.description,
      schoolsCount: province.schoolsCount,
      imageUrl: province.imageUrl
    }))

    const searchCities: SearchCity[] = cities.map(city => ({
      id: city.id,
      name: city.name,
      slug: city.slug,
      province: city.province.name,
      provinceSlug: city.province.slug,
      schoolsCount: city.schoolsCount
    }))

    // Indexar datos
    await Promise.all([
      indexSchools(searchSchools),
      indexProvinces(searchProvinces),
      indexCities(searchCities)
    ])

    console.log('✅ Data indexing completed successfully!')
    console.log(`   - ${searchSchools.length} schools indexed`)
    console.log(`   - ${searchProvinces.length} provinces indexed`)
    console.log(`   - ${searchCities.length} cities indexed`)

  } catch (error) {
    console.error('❌ Error indexing data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

indexData()
