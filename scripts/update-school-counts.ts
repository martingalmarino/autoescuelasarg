import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateSchoolCounts() {
  console.log('🔄 Actualizando contadores de autoescuelas...')

  try {
    // Actualizar contadores de provincias
    console.log('📋 Actualizando contadores de provincias...')
    const provinces = await prisma.province.findMany({
      include: {
        _count: {
          select: {
            schools: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    for (const province of provinces) {
      const realCount = province._count.schools
      if (province.schoolsCount !== realCount) {
        await prisma.province.update({
          where: { id: province.id },
          data: { schoolsCount: realCount }
        })
        console.log(`   - ${province.name}: ${province.schoolsCount} → ${realCount}`)
      }
    }

    // Actualizar contadores de ciudades
    console.log('🏙️ Actualizando contadores de ciudades...')
    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: {
            schools: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    for (const city of cities) {
      const realCount = city._count.schools
      if (city.schoolsCount !== realCount) {
        await prisma.city.update({
          where: { id: city.id },
          data: { schoolsCount: realCount }
        })
        console.log(`   - ${city.name}: ${city.schoolsCount} → ${realCount}`)
      }
    }

    console.log('✅ Contadores actualizados correctamente!')
  } catch (error) {
    console.error('❌ Error actualizando contadores:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateSchoolCounts()




