const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addCity() {
  try {
    // Buscar la provincia de Córdoba
    const cordoba = await prisma.province.findUnique({
      where: { slug: 'cordoba' }
    })

    if (!cordoba) {
      console.error('❌ No se encontró la provincia de Córdoba')
      return
    }

    console.log(`✅ Provincia encontrada: ${cordoba.name}`)

    // Verificar si Alta Gracia ya existe
    const existingCity = await prisma.city.findFirst({
      where: {
        name: 'Alta Gracia',
        provinceId: cordoba.id
      }
    })

    if (existingCity) {
      console.log('⚠️ Alta Gracia ya existe en la base de datos')
      return
    }

    // Agregar Alta Gracia
    const newCity = await prisma.city.create({
      data: {
        name: 'Alta Gracia',
        slug: 'alta-gracia',
        provinceId: cordoba.id,
        schoolsCount: 0, // Inicialmente 0, se actualizará automáticamente
        sortOrder: 6 // Después de Villa Carlos Paz
      }
    })

    console.log('✅ Ciudad agregada exitosamente:')
    console.log(`   - Nombre: ${newCity.name}`)
    console.log(`   - Slug: ${newCity.slug}`)
    console.log(`   - Provincia: ${cordoba.name}`)
    console.log(`   - URL: /provincias/cordoba/alta-gracia`)

  } catch (error) {
    console.error('❌ Error agregando la ciudad:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addCity()




