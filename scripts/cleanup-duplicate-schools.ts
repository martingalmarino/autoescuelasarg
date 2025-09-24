import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDuplicateSchools() {
  console.log('🧹 Limpiando autoescuelas duplicadas...')

  try {
    // 1. Encontrar y eliminar slugs duplicados (mantener la más reciente)
    console.log('\n--- Limpiando Slugs Duplicados ---')
    const duplicateSlugs = await prisma.drivingSchool.groupBy({
      by: ['slug'],
      _count: {
        slug: true,
      },
      having: {
        slug: {
          _count: {
            gt: 1,
          },
        },
      },
    })

    let deletedCount = 0

    for (const duplicate of duplicateSlugs) {
      const schools = await prisma.drivingSchool.findMany({
        where: { slug: duplicate.slug },
        orderBy: { createdAt: 'desc' }, // Más reciente primero
        select: { id: true, name: true, isActive: true, createdAt: true, cityId: true, provinceId: true }
      })

      if (schools.length > 1) {
        console.log(`\n🔍 Procesando slug duplicado: "${duplicate.slug}"`)
        
        // Mantener la primera (más reciente) y eliminar las demás
        const toKeep = schools[0]
        const toDelete = schools.slice(1)

        console.log(`  ✅ Manteniendo: ID ${toKeep.id} - "${toKeep.name}" (${toKeep.isActive ? 'activa' : 'inactiva'}) - Creada: ${toKeep.createdAt.toLocaleString()}`)

        for (const school of toDelete) {
          console.log(`  🗑️ Eliminando: ID ${school.id} - "${school.name}" (${school.isActive ? 'activa' : 'inactiva'}) - Creada: ${school.createdAt.toLocaleString()}`)
          
          await prisma.drivingSchool.delete({
            where: { id: school.id }
          })
          deletedCount++
        }
      }
    }

    if (deletedCount === 0) {
      console.log('✅ No se encontraron slugs duplicados para limpiar.')
    } else {
      console.log(`\n✅ Eliminadas ${deletedCount} autoescuelas duplicadas.`)
    }

    // 2. Recalcular contadores de ciudades y provincias
    console.log('\n--- Recalculando Contadores ---')
    const cities = await prisma.city.findMany({
      select: { id: true, name: true }
    })

    for (const city of cities) {
      const activeSchoolsCount = await prisma.drivingSchool.count({
        where: { cityId: city.id, isActive: true }
      })
      
      await prisma.city.update({
        where: { id: city.id },
        data: { schoolsCount: activeSchoolsCount }
      })
      
      console.log(`✅ Ciudad "${city.name}": ${activeSchoolsCount} autoescuelas activas`)
    }

    const provinces = await prisma.province.findMany({
      select: { id: true, name: true }
    })

    for (const province of provinces) {
      const activeSchoolsCount = await prisma.drivingSchool.count({
        where: { provinceId: province.id, isActive: true }
      })
      
      await prisma.province.update({
        where: { id: province.id },
        data: { schoolsCount: activeSchoolsCount }
      })
      
      console.log(`✅ Provincia "${province.name}": ${activeSchoolsCount} autoescuelas activas`)
    }

    // 3. Verificación final
    console.log('\n--- Verificación Final ---')
    const finalCount = await prisma.drivingSchool.count()
    const activeCount = await prisma.drivingSchool.count({ where: { isActive: true } })
    const inactiveCount = await prisma.drivingSchool.count({ where: { isActive: false } })

    console.log(`📊 Resumen final:`)
    console.log(`  Total de autoescuelas: ${finalCount}`)
    console.log(`  Autoescuelas activas: ${activeCount}`)
    console.log(`  Autoescuelas inactivas: ${inactiveCount}`)

    console.log('\n🎉 Limpieza de duplicados completada!')

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDuplicateSchools()
