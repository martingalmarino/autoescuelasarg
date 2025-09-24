import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDuplicateSchools() {
  console.log('🔍 Verificando autoescuelas duplicadas...')

  try {
    // 1. Verificar slugs duplicados
    console.log('\n--- Verificando Slugs Duplicados ---')
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

    if (duplicateSlugs.length > 0) {
      console.log('❌ Se encontraron slugs duplicados:')
      for (const duplicate of duplicateSlugs) {
        const schools = await prisma.drivingSchool.findMany({
          where: { slug: duplicate.slug },
          select: { id: true, name: true, isActive: true, createdAt: true }
        })
        console.log(`  Slug: "${duplicate.slug}" (${duplicate._count.slug} veces)`)
        schools.forEach(school => {
          console.log(`    - ID: ${school.id}, Nombre: ${school.name}, Activa: ${school.isActive}, Creada: ${school.createdAt.toLocaleString()}`)
        })
      }
    } else {
      console.log('✅ No se encontraron slugs duplicados.')
    }

    // 2. Verificar nombres duplicados
    console.log('\n--- Verificando Nombres Duplicados ---')
    const duplicateNames = await prisma.drivingSchool.groupBy({
      by: ['name'],
      _count: {
        name: true,
      },
      having: {
        name: {
          _count: {
            gt: 1,
          },
        },
      },
    })

    if (duplicateNames.length > 0) {
      console.log('❌ Se encontraron nombres duplicados:')
      for (const duplicate of duplicateNames) {
        const schools = await prisma.drivingSchool.findMany({
          where: { name: duplicate.name },
          select: { id: true, slug: true, isActive: true, createdAt: true }
        })
        console.log(`  Nombre: "${duplicate.name}" (${duplicate._count.name} veces)`)
        schools.forEach(school => {
          console.log(`    - ID: ${school.id}, Slug: ${school.slug}, Activa: ${school.isActive}, Creada: ${school.createdAt.toLocaleString()}`)
        })
      }
    } else {
      console.log('✅ No se encontraron nombres duplicados.')
    }

    // 3. Listar todas las autoescuelas con sus detalles
    console.log('\n--- Todas las Autoescuelas ---')
    const allSchools = await prisma.drivingSchool.findMany({
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        isActive: true, 
        createdAt: true,
        city: {
          select: { name: true }
        }
      }
    })

    console.log(`Total de autoescuelas: ${allSchools.length}`)
    allSchools.forEach(school => {
      console.log(`- ID: ${school.id}, Nombre: "${school.name}", Slug: "${school.slug}", Activa: ${school.isActive}, Ciudad: ${school.city.name}, Creada: ${school.createdAt.toLocaleString()}`)
    })

    // 4. Verificar si hay autoescuelas que deberían estar en el seeding
    console.log('\n--- Verificando Autoescuelas del Seeding ---')
    const seedingSchools = [
      'autoescuela-premium-cordoba',
      'escuela-manejo-centro', 
      'autoescuela-villa-maria'
    ]

    for (const slug of seedingSchools) {
      const schools = await prisma.drivingSchool.findMany({
        where: { slug },
        select: { id: true, name: true, isActive: true, createdAt: true }
      })
      
      if (schools.length === 0) {
        console.log(`⚠️ Autoescuela del seeding no encontrada: ${slug}`)
      } else if (schools.length === 1) {
        console.log(`✅ Autoescuela del seeding encontrada: ${slug} (${schools[0].isActive ? 'activa' : 'inactiva'})`)
      } else {
        console.log(`❌ Múltiples autoescuelas con slug del seeding: ${slug} (${schools.length} encontradas)`)
      }
    }

    console.log('\n🎉 Verificación completada!')

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkDuplicateSchools()
