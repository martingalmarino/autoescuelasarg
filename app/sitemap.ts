import { MetadataRoute } from 'next'
import { prisma } from '@/lib/database'
import { SITE_URL } from '@/lib/seo'

export const revalidate = 86400

const activeSchoolsCount = { _count: { select: { schools: { where: { isActive: true } } } } } as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL

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
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  try {
    const [provinces, cities, schools, articles] = await Promise.all([
      prisma.province.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true, ...activeSchoolsCount },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.city.findMany({
        where: { isActive: true, province: { isActive: true } },
        select: {
          slug: true,
          updatedAt: true,
          province: { select: { slug: true } },
          ...activeSchoolsCount,
        },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.drivingSchool.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogArticle.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: 'desc' },
      }),
    ])

    // Las provincias y ciudades sin autoescuelas activas llevan noindex: no se publican en el sitemap.
    const provincePages: MetadataRoute.Sitemap = provinces
      .filter(province => province._count.schools > 0)
      .map(province => ({
        url: `${baseUrl}/provincias/${province.slug}`,
        lastModified: province.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    const cityPages: MetadataRoute.Sitemap = cities
      .filter(city => city._count.schools > 0)
      .map(city => ({
        url: `${baseUrl}/provincias/${city.province.slug}/${city.slug}`,
        lastModified: city.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

    const schoolPages: MetadataRoute.Sitemap = schools.map(school => ({
      url: `${baseUrl}/autoescuelas/${school.slug}`,
      lastModified: school.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    const articlePages: MetadataRoute.Sitemap = articles.map(article => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

    const seen = new Set<string>()
    return [...staticPages, ...provincePages, ...cityPages, ...schoolPages, ...articlePages].filter(entry => {
      if (seen.has(entry.url)) return false
      seen.add(entry.url)
      return true
    })
  } catch (error) {
    console.error('Error generando sitemap:', error)
    return staticPages
  }
}
