import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función para normalizar texto removiendo acentos y caracteres especiales
function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales excepto espacios y guiones
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-|-$/g, '') // Remover guiones al inicio y final
}

async function normalizeAllSlugs() {
  console.log('🔄 Normalizando todos los slugs...')

  try {
    // Normalizar slugs de provincias
    console.log('📋 Normalizando slugs de provincias...')
    const provinces = await prisma.province.findMany()
    
    for (const province of provinces) {
      const normalizedSlug = normalizeSlug(province.name)
      if (normalizedSlug !== province.slug) {
        console.log(`  - "${province.name}": "${province.slug}" → "${normalizedSlug}"`)
        await prisma.province.update({
          where: { id: province.id },
          data: { slug: normalizedSlug }
        })
      }
    }

    // Normalizar slugs de ciudades
    console.log('🏙️ Normalizando slugs de ciudades...')
    const cities = await prisma.city.findMany()
    
    for (const city of cities) {
      const normalizedSlug = normalizeSlug(city.name)
      if (normalizedSlug !== city.slug) {
        console.log(`  - "${city.name}": "${city.slug}" → "${normalizedSlug}"`)
        await prisma.city.update({
          where: { id: city.id },
          data: { slug: normalizedSlug }
        })
      }
    }

    // Normalizar slugs de autoescuelas
    console.log('🚗 Normalizando slugs de autoescuelas...')
    const schools = await prisma.drivingSchool.findMany()
    
    for (const school of schools) {
      const normalizedSlug = normalizeSlug(school.name)
      if (normalizedSlug !== school.slug) {
        console.log(`  - "${school.name}": "${school.slug}" → "${normalizedSlug}"`)
        await prisma.drivingSchool.update({
          where: { id: school.id },
          data: { slug: normalizedSlug }
        })
      }
    }

    console.log('✅ Normalización de slugs completada!')

  } catch (error) {
    console.error('❌ Error normalizando slugs:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

normalizeAllSlugs()