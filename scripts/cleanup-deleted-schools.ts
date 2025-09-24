import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDeletedSchools() {
  console.log('🧹 Limpiando autoescuelas eliminadas...')

  try {
    // Verificar si hay autoescuelas con isActive = false
    const inactiveSchools = await prisma.drivingSchool.findMany({
      where: { isActive: false },
      select: { id: true, name: true, cityId: true, provinceId: true }
    })

    console.log(`📋 Encontradas ${inactiveSchools.length} autoescuelas inactivas`)

    if (inactiveSchools.length > 0) {
      // Eliminar autoescuelas inactivas
      for (const school of inactiveSchools) {
        console.log(`🗑️ Eliminando: ${school.name}`)
        
        await prisma.drivingSchool.delete({
          where: { id: school.id }
        })

        // Actualizar contadores
        await Promise.all([
          prisma.city.update({
            where: { id: school.cityId },
            data: { schoolsCount: { decrement: 1 } }
          }),
          prisma.province.update({
            where: { id: school.provinceId },
            data: { schoolsCount: { decrement: 1 } }
          })
        ])
      }

      console.log('✅ Autoescuelas inactivas eliminadas')
    } else {
      console.log('ℹ️ No hay autoescuelas inactivas para eliminar')
    }

    // Verificar contadores
    const cities = await prisma.city.findMany({
      select: { id: true, name: true, schoolsCount: true, _count: { drivingSchools: true } }
    })

    console.log('🔍 Verificando contadores de ciudades...')
    for (const city of cities) {
      const actualCount = city._count.drivingSchools
      if (city.schoolsCount !== actualCount) {
        console.log(`⚠️ Ciudad ${city.name}: contador=${city.schoolsCount}, real=${actualCount}`)
        await prisma.city.update({
          where: { id: city.id },
          data: { schoolsCount: actualCount }
        })
        console.log(`✅ Contador corregido para ${city.name}`)
      }
    }

    // Verificar contadores de provincias
    const provinces = await prisma.province.findMany({
      select: { id: true, name: true, schoolsCount: true, _count: { drivingSchools: true } }
    })

    console.log('🔍 Verificando contadores de provincias...')
    for (const province of provinces) {
      const actualCount = province._count.drivingSchools
      if (province.schoolsCount !== actualCount) {
        console.log(`⚠️ Provincia ${province.name}: contador=${province.schoolsCount}, real=${actualCount}`)
        await prisma.province.update({
          where: { id: province.id },
          data: { schoolsCount: actualCount }
        })
        console.log(`✅ Contador corregido para ${province.name}`)
      }
    }

    console.log('🎉 Limpieza completada!')
  } catch (error) {
    console.error('❌ Error en la limpieza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  cleanupDeletedSchools()
}
