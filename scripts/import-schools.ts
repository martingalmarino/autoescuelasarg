import { PrismaClient } from '@prisma/client'
import { createSlug } from '../lib/utils'

const prisma = new PrismaClient()

// Función para importar autoescuelas desde un array de datos
export async function importSchools(schoolsData: any[]) {
  console.log('🚀 Iniciando importación de autoescuelas...')
  
  let imported = 0
  let errors = 0

  for (const schoolData of schoolsData) {
    try {
      // Validar datos requeridos
      if (!schoolData.name || !schoolData.city || !schoolData.province) {
        console.error(`❌ Datos incompletos para: ${schoolData.name || 'Sin nombre'}`)
        errors++
        continue
      }

      // Buscar o crear provincia
      let province = await prisma.province.findFirst({
        where: { 
          name: { 
            contains: schoolData.province, 
            mode: 'insensitive' 
          } 
        }
      })

      if (!province) {
        console.log(`📝 Creando provincia: ${schoolData.province}`)
        province = await prisma.province.create({
          data: {
            name: schoolData.province,
            slug: createSlug(schoolData.province),
            description: `Provincia de ${schoolData.province}`,
            schoolsCount: 0,
            sortOrder: 0,
          }
        })
      }

      // Buscar o crear ciudad
      let city = await prisma.city.findFirst({
        where: { 
          name: { 
            contains: schoolData.city, 
            mode: 'insensitive' 
          },
          provinceId: province.id
        }
      })

      if (!city) {
        console.log(`📝 Creando ciudad: ${schoolData.city}`)
        city = await prisma.city.create({
          data: {
            name: schoolData.city,
            slug: createSlug(schoolData.city),
            provinceId: province.id,
            schoolsCount: 0,
            sortOrder: 0,
          }
        })
      }

      // Crear slug único para la autoescuela
      const baseSlug = createSlug(schoolData.name)
      let slug = baseSlug
      let counter = 1
      
      while (await prisma.drivingSchool.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      // Crear autoescuela
      const school = await prisma.drivingSchool.create({
        data: {
          name: schoolData.name,
          slug,
          cityId: city.id,
          provinceId: province.id,
          description: schoolData.description || null,
          address: schoolData.address || null,
          phone: schoolData.phone || null,
          email: schoolData.email || null,
          website: schoolData.website || null,
          hours: schoolData.hours || null,
          services: schoolData.services ? schoolData.services.split(',').map((s: string) => s.trim()) : [],
          priceMin: schoolData.priceMin ? parseInt(schoolData.priceMin) : null,
          priceMax: schoolData.priceMax ? parseInt(schoolData.priceMax) : null,
          rating: schoolData.rating ? parseFloat(schoolData.rating) : 0,
          reviewsCount: schoolData.reviewsCount ? parseInt(schoolData.reviewsCount) : 0,
          isActive: schoolData.isActive !== false, // Por defecto activa
          isVerified: schoolData.isVerified === true,
          isFeatured: schoolData.isFeatured === true,
          sortOrder: schoolData.sortOrder ? parseInt(schoolData.sortOrder) : 0,
          metaTitle: schoolData.metaTitle || null,
          metaDescription: schoolData.metaDescription || null,
        }
      })

      // Actualizar contadores
      await Promise.all([
        prisma.city.update({
          where: { id: city.id },
          data: { schoolsCount: { increment: 1 } }
        }),
        prisma.province.update({
          where: { id: province.id },
          data: { schoolsCount: { increment: 1 } }
        })
      ])

      console.log(`✅ Importada: ${school.name} (${city.name}, ${province.name})`)
      imported++

    } catch (error) {
      console.error(`❌ Error importando ${schoolData.name}:`, error)
      errors++
    }
  }

  console.log(`\n🎉 Importación completada:`)
  console.log(`✅ Importadas: ${imported}`)
  console.log(`❌ Errores: ${errors}`)
  
  return { imported, errors }
}

// Datos de ejemplo para importar
const exampleSchools = [
  {
    name: "Autoescuela Central Buenos Aires",
    city: "Buenos Aires",
    province: "CABA",
    description: "Autoescuela con más de 20 años de experiencia en el centro de Buenos Aires",
    address: "Av. Corrientes 1234, CABA",
    phone: "+54 11 1234-5678",
    email: "info@autoescuelacentral.com",
    website: "https://autoescuelacentral.com",
    hours: "Lunes a Viernes: 08:00 - 18:00, Sábados: 08:00 - 14:00",
    services: "Licencia B, Licencia A, Clases particulares, Simulador",
    priceMin: "25000",
    priceMax: "35000",
    rating: "4.8",
    reviewsCount: "1247",
    isActive: true,
    isVerified: true,
    isFeatured: true,
    sortOrder: "1"
  },
  {
    name: "Escuela de Manejo Norte",
    city: "Rosario",
    province: "Santa Fe",
    description: "Especialistas en clases para principiantes en Rosario",
    address: "Av. Pellegrini 5678, Rosario",
    phone: "+54 341 123-4567",
    email: "info@escuelanorte.com",
    website: "https://escuelanorte.com",
    hours: "Lunes a Viernes: 07:30 - 19:00, Sábados: 08:00 - 16:00",
    services: "Licencia B, Clases particulares, Preparación para examen",
    priceMin: "22000",
    priceMax: "30000",
    rating: "4.6",
    reviewsCount: "892",
    isActive: true,
    isVerified: true,
    isFeatured: false,
    sortOrder: "2"
  },
  {
    name: "Autoescuela Express Mendoza",
    city: "Mendoza",
    province: "Mendoza",
    description: "Cursos intensivos y preparación para examen en Mendoza",
    address: "Av. San Martín 7890, Mendoza",
    phone: "+54 261 456-7890",
    email: "info@autoescuelaexpress.com",
    website: "https://autoescuelaexpress.com",
    hours: "Lunes a Viernes: 08:00 - 18:00, Sábados: 08:00 - 14:00",
    services: "Licencia B, Cursos intensivos, Preparación para examen",
    priceMin: "18000",
    priceMax: "25000",
    rating: "4.3",
    reviewsCount: "456",
    isActive: true,
    isVerified: false,
    isFeatured: false,
    sortOrder: "3"
  }
]

// Función para ejecutar la importación
async function main() {
  try {
    await importSchools(exampleSchools)
  } catch (error) {
    console.error('Error en la importación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main()
}

export { exampleSchools }
