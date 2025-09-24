import { PrismaClient } from '@prisma/client'
import { createSlug } from '../lib/utils'

const prisma = new PrismaClient()

async function normalizeSlugs() {
  console.log('🔄 Normalizando slugs...')

  try {
    // Normalizar slugs de provincias
    const provinces = await prisma.province.findMany()
    console.log(`📋 Encontradas ${provinces.length} provincias`)

    for (const province of provinces) {
      const normalizedSlug = createSlug(province.name)
      if (province.slug !== normalizedSlug) {
        console.log(`🔄 Actualizando provincia: "${province.name}"`)
        console.log(`   Antes: "${province.slug}"`)
        console.log(`   Después: "${normalizedSlug}"`)
        
        await prisma.province.update({
          where: { id: province.id },
          data: { slug: normalizedSlug }
        })
      }
    }

    // Normalizar slugs de ciudades
    const cities = await prisma.city.findMany()
    console.log(`🏙️ Encontradas ${cities.length} ciudades`)

    for (const city of cities) {
      const normalizedSlug = createSlug(city.name)
      if (city.slug !== normalizedSlug) {
        console.log(`🔄 Actualizando ciudad: "${city.name}"`)
        console.log(`   Antes: "${city.slug}"`)
        console.log(`   Después: "${normalizedSlug}"`)
        
        await prisma.city.update({
          where: { id: city.id },
          data: { slug: normalizedSlug }
        })
      }
    }

    // Normalizar slugs de autoescuelas
    const schools = await prisma.drivingSchool.findMany()
    console.log(`🚗 Encontradas ${schools.length} autoescuelas`)

    for (const school of schools) {
      const normalizedSlug = createSlug(school.name)
      if (school.slug !== normalizedSlug) {
        console.log(`🔄 Actualizando autoescuela: "${school.name}"`)
        console.log(`   Antes: "${school.slug}"`)
        console.log(`   Después: "${normalizedSlug}"`)
        
        await prisma.drivingSchool.update({
          where: { id: school.id },
          data: { slug: normalizedSlug }
        })
      }
    }

    console.log('✅ Normalización de slugs completada!')
  } catch (error) {
    console.error('❌ Error normalizando slugs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  normalizeSlugs()
}
