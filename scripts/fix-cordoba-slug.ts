import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixCordobaSlug() {
  console.log('🔄 Arreglando slug de Córdoba...')

  try {
    // Buscar la provincia de Córdoba con slug incorrecto
    const cordobaWithAccent = await prisma.province.findFirst({
      where: { 
        OR: [
          { slug: 'córdoba' },
          { slug: 'c%C3%B3rdoba' },
          { name: 'Córdoba' }
        ]
      }
    })

    if (cordobaWithAccent) {
      console.log(`📋 Encontrada provincia: "${cordobaWithAccent.name}" con slug: "${cordobaWithAccent.slug}"`)
      
      // Actualizar el slug a la versión sin acento
      await prisma.province.update({
        where: { id: cordobaWithAccent.id },
        data: { slug: 'cordoba' }
      })
      
      console.log('✅ Slug de Córdoba actualizado a "cordoba"')
    } else {
      console.log('ℹ️ No se encontró provincia de Córdoba con slug incorrecto')
    }

    // Verificar que ahora existe con el slug correcto
    const cordobaCorrect = await prisma.province.findUnique({
      where: { slug: 'cordoba' }
    })

    if (cordobaCorrect) {
      console.log(`✅ Córdoba encontrada con slug correcto: "${cordobaCorrect.slug}"`)
    } else {
      console.log('❌ Córdoba no encontrada con slug correcto')
    }

  } catch (error) {
    console.error('❌ Error arreglando slug de Córdoba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  fixCordobaSlug()
}
