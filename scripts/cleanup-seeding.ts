import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupSeeding() {
  console.log('🧹 Limpiando autoescuelas eliminadas después del seeding...')
  
  try {
    // Obtener todas las autoescuelas inactivas
    const inactiveSchools = await prisma.drivingSchool.findMany({
      where: { isActive: false },
      select: {
        id: true,
        name: true,
        cityId: true,
        provinceId: true,
        city: {
          select: {
            name: true,
            province: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    console.log(`📊 Encontradas ${inactiveSchools.length} autoescuelas inactivas`)

    if (inactiveSchools.length === 0) {
      console.log('✅ No hay autoescuelas inactivas para limpiar')
      return
    }

    // Mostrar las autoescuelas que se van a eliminar
    console.log('\n🗑️ Autoescuelas inactivas que se eliminarán:')
    inactiveSchools.forEach(school => {
      console.log(`  - ${school.name} (${school.city.name}, ${school.city.province.name})`)
    })

    // Eliminar autoescuelas inactivas
    const deleteResult = await prisma.drivingSchool.deleteMany({
      where: { isActive: false }
    })

    console.log(`\n✅ Eliminadas ${deleteResult.count} autoescuelas inactivas`)

    // Actualizar contadores de ciudades y provincias
    console.log('\n🔄 Actualizando contadores...')
    
    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            schools: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    const provinces = await prisma.province.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            schools: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    // Actualizar contadores de ciudades
    for (const city of cities) {
      await prisma.city.update({
        where: { id: city.id },
        data: { schoolsCount: city._count.schools }
      })
    }

    // Actualizar contadores de provincias
    for (const province of provinces) {
      await prisma.province.update({
        where: { id: province.id },
        data: { schoolsCount: province._count.schools }
      })
    }

    console.log('✅ Contadores actualizados correctamente')
    console.log('\n🎉 Limpieza completada!')

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupSeeding()
