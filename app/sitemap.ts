import { MetadataRoute } from 'next'
import { prisma } from '@/lib/database'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://autoescuelas.ar'

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/autoescuelas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/provincias`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  try {
    // Obtener todas las provincias activas
    const provinces = await prisma.province.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { sortOrder: 'asc' }
    })

    // Obtener todas las ciudades activas
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      include: {
        province: {
          select: { slug: true }
        }
      },
      select: {
        slug: true,
        updatedAt: true,
        province: {
          select: { slug: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })

    // Obtener todas las autoescuelas activas
    const schools = await prisma.drivingSchool.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
        city: {
          select: {
            slug: true,
            province: {
              select: { slug: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Páginas de provincias
    const provincePages: MetadataRoute.Sitemap = provinces.map(province => ({
      url: `${baseUrl}/provincias/${province.slug}`,
      lastModified: province.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Páginas de ciudades
    const cityPages: MetadataRoute.Sitemap = cities.map(city => ({
      url: `${baseUrl}/provincias/${city.province.slug}/${city.slug}`,
      lastModified: city.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Páginas de autoescuelas
    const schoolPages: MetadataRoute.Sitemap = schools.map(school => ({
      url: `${baseUrl}/autoescuelas/${school.slug}`,
      lastModified: school.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // Combinar todas las páginas
    const sitemap = [
      ...staticPages,
      ...provincePages,
      ...cityPages,
      ...schoolPages,
    ]

    console.log(`🗺️  Sitemap generado con ${sitemap.length} URLs:`)
    console.log(`   - ${staticPages.length} páginas estáticas`)
    console.log(`   - ${provincePages.length} páginas de provincias`)
    console.log(`   - ${cityPages.length} páginas de ciudades`)
    console.log(`   - ${schoolPages.length} páginas de autoescuelas`)

    return sitemap

  } catch (error) {
    console.error('Error generando sitemap:', error)
    
    // En caso de error, devolver solo las páginas estáticas
    return staticPages
  }
}
