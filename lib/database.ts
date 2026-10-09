import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { Prisma } from '@prisma/client'
import { prisma } from './db'
import type { SchoolSummary, SchoolsPage } from './types'
import { isPremiumActive, parseFaqs } from './premium'

// Tiempo de vida de la caché de páginas públicas (24 h). Las ediciones del admin la invalidan antes.
export const PUBLIC_REVALIDATE_SECONDS = 86400
export const SCHOOLS_CACHE_TAG = 'schools'
export const SCHOOLS_PER_PAGE = 12

const DESCRIPTION_EXCERPT_LENGTH = 180

const schoolSummarySelect = {
  id: true,
  name: true,
  slug: true,
  rating: true,
  reviewsCount: true,
  imageUrl: true,
  logoUrl: true,
  priceMin: true,
  priceMax: true,
  description: true,
  phone: true,
  email: true,
  isFeatured: true,
  isVerified: true,
  city: {
    select: {
      name: true,
      slug: true,
      province: { select: { name: true, slug: true } },
    },
  },
} satisfies Prisma.DrivingSchoolSelect

type SchoolSummaryRow = Prisma.DrivingSchoolGetPayload<{ select: typeof schoolSummarySelect }>

const defaultSchoolOrder: Prisma.DrivingSchoolOrderByWithRelationInput[] = [
  { isFeatured: 'desc' },
  { sortOrder: 'asc' },
  { rating: 'desc' },
]

type SchoolPrivateFields = {
  ownerName: string | null
  ownerEmail: string | null
  ownerPhone: string | null
  claimedAt: Date | null
  plan: string
  planExpiresAt: Date | null
  faqs: Prisma.JsonValue | null
}

/** Quita los datos del dueño y del plan; deja solo indicadores calculados para el sitio público. */
export function withoutPrivateSchoolFields<T extends SchoolPrivateFields>(school: T) {
  const { ownerName, ownerEmail, ownerPhone, claimedAt, plan, planExpiresAt, faqs, ...rest } = school
  return {
    ...rest,
    faqs: parseFaqs(faqs),
    isClaimed: claimedAt !== null,
    isPremium: isPremiumActive({ plan, planExpiresAt }),
  }
}

export function htmlToExcerpt(html: string | null | undefined, maxLength = DESCRIPTION_EXCERPT_LENGTH) {
  if (!html) return null
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return null
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

function toSchoolSummary(school: SchoolSummaryRow): SchoolSummary {
  return {
    id: school.id,
    name: school.name,
    slug: school.slug,
    rating: school.rating,
    reviewsCount: school.reviewsCount,
    city: school.city.name,
    citySlug: school.city.slug,
    province: school.city.province.name,
    provinceSlug: school.city.province.slug,
    imageUrl: school.imageUrl,
    logoUrl: school.logoUrl,
    priceMin: school.priceMin,
    priceMax: school.priceMax,
    description: htmlToExcerpt(school.description),
    phone: school.phone,
    email: school.email,
    isFeatured: school.isFeatured,
    isVerified: school.isVerified,
  }
}

export const getActiveProvinces = cache(async () => {
  const provinces = await prisma.province.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      _count: {
        select: {
          schools: {
            where: { isActive: true }
          }
        }
      }
    },
  })

  return provinces.map(province => ({
    id: province.id,
    name: province.name,
    slug: province.slug,
    description: province.description || undefined,
    imageUrl: province.imageUrl || undefined,
    schoolsCount: province._count.schools,
  }))
})

export const getActiveCitiesByProvince = cache(async (provinceId: string) => {
  const cities = await prisma.city.findMany({
    where: {
      provinceId,
      isActive: true
    },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          schools: {
            where: { isActive: true }
          }
        }
      }
    },
  })

  return cities.map(city => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    schoolsCount: city._count.schools,
  }))
})

export const getFeaturedSchools = cache(async (limit: number = 8): Promise<SchoolSummary[]> => {
  const schools = await prisma.drivingSchool.findMany({
    where: { isActive: true },
    orderBy: [
      { isFeatured: 'desc' },
      { rating: 'desc' },
      { sortOrder: 'asc' }
    ],
    take: limit,
    select: schoolSummarySelect,
  })

  return schools.map(toSchoolSummary)
})

export const getSchoolsByProvinceSlug = cache(async (provinceSlug: string, limit: number = 20): Promise<SchoolSummary[]> => {
  try {
    const schools = await prisma.drivingSchool.findMany({
      where: {
        province: { slug: provinceSlug },
        isActive: true
      },
      orderBy: defaultSchoolOrder,
      take: limit,
      select: schoolSummarySelect,
    })

    return schools.map(toSchoolSummary)
  } catch (error) {
    console.error(`Error fetching schools for province ${provinceSlug}:`, error)
    return []
  }
})

export const getSchoolBySlugFromDB = cache(async (slug: string) => {
  try {
    const school = await prisma.drivingSchool.findUnique({
      where: { slug },
      include: {
        city: {
          select: {
            name: true,
            slug: true,
            province: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        courses: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            rating: true,
            comment: true,
            author: true,
            createdAt: true,
          },
        },
      },
    })

    if (!school) return null

    return {
      ...withoutPrivateSchoolFields(school),
      city: school.city.name,
      citySlug: school.city.slug,
      province: school.city.province.name,
      provinceSlug: school.city.province.slug,
      hours: school.hours || undefined,
    }
  } catch (error) {
    console.error(`Error fetching school ${slug}:`, error)
    return null
  }
})

// Otras autoescuelas de la misma ciudad; si hay menos de 4, completa con la misma provincia.
export async function getRelatedSchools(
  school: { id: string; cityId: string; provinceId: string },
  limit: number = 6
): Promise<SchoolSummary[]> {
  const relatedOrder: Prisma.DrivingSchoolOrderByWithRelationInput[] = [
    { isFeatured: 'desc' },
    { rating: 'desc' },
    { reviewsCount: 'desc' },
  ]

  const sameCity = await prisma.drivingSchool.findMany({
    where: {
      cityId: school.cityId,
      isActive: true,
      id: { not: school.id },
    },
    orderBy: relatedOrder,
    take: limit,
    select: schoolSummarySelect,
  })

  if (sameCity.length >= 4) {
    return sameCity.map(toSchoolSummary)
  }

  const sameProvince = await prisma.drivingSchool.findMany({
    where: {
      provinceId: school.provinceId,
      cityId: { not: school.cityId },
      isActive: true,
      id: { not: school.id },
    },
    orderBy: relatedOrder,
    take: limit - sameCity.length,
    select: schoolSummarySelect,
  })

  return [...sameCity, ...sameProvince].map(toSchoolSummary)
}

export const getProvinceBySlugFromDB = cache(async (slug: string) => {
  try {
    const province = await prisma.province.findUnique({
      where: { slug },
      include: {
        cities: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            schoolsCount: true,
            _count: { select: { schools: { where: { isActive: true } } } },
          },
        },
        _count: { select: { schools: { where: { isActive: true } } } },
      },
    })

    if (!province) return null

    const { _count, cities, ...rest } = province

    return {
      ...rest,
      description: province.description || undefined,
      imageUrl: province.imageUrl || undefined,
      activeSchoolsCount: _count.schools,
      cities: cities.map(({ _count: cityCount, ...city }) => ({
        ...city,
        activeSchoolsCount: cityCount.schools,
      })),
    }
  } catch (error) {
    console.error(`Error fetching province ${slug}:`, error)
    return null
  }
})

export const getCityBySlugFromDB = cache(async (provinceSlug: string, citySlug: string) => {
  try {
    const city = await prisma.city.findFirst({
      where: {
        slug: citySlug,
        isActive: true,
        province: {
          slug: provinceSlug,
          isActive: true
        }
      },
      include: {
        province: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            schools: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    if (!city) return null

    return {
      id: city.id,
      name: city.name,
      slug: city.slug,
      schoolsCount: city._count.schools,
      province: city.province
    }
  } catch (error) {
    console.error(`Error fetching city ${citySlug} in province ${provinceSlug}:`, error)
    return null
  }
})

export const getSchoolsByCitySlug = cache(async (provinceSlug: string, citySlug: string, limit: number = 20): Promise<SchoolSummary[]> => {
  try {
    const schools = await prisma.drivingSchool.findMany({
      where: {
        isActive: true,
        city: {
          slug: citySlug,
          isActive: true,
          province: {
            slug: provinceSlug,
            isActive: true
          }
        }
      },
      orderBy: defaultSchoolOrder,
      take: limit,
      select: schoolSummarySelect,
    })

    return schools.map(toSchoolSummary)
  } catch (error) {
    console.error(`Error fetching schools for city ${citySlug} in province ${provinceSlug}:`, error)
    return []
  }
})

export type SchoolSort = 'rating_desc' | 'rating_asc' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'

export interface SchoolsQuery {
  page?: number
  province?: string
  city?: string
  search?: string
  sort?: string
}

const sortOrders: Record<SchoolSort, Prisma.DrivingSchoolOrderByWithRelationInput[]> = {
  rating_desc: [{ rating: 'desc' }, { name: 'asc' }],
  rating_asc: [{ rating: 'asc' }, { name: 'asc' }],
  name_asc: [{ name: 'asc' }],
  name_desc: [{ name: 'desc' }],
  price_asc: [{ priceMin: { sort: 'asc', nulls: 'first' } }, { name: 'asc' }],
  price_desc: [{ priceMin: { sort: 'desc', nulls: 'last' } }, { name: 'asc' }],
}

async function querySchoolsPage(query: SchoolsQuery): Promise<SchoolsPage> {
  const where: Prisma.DrivingSchoolWhereInput = { isActive: true }
  const cityFilter: Prisma.CityWhereInput = {}

  if (query.province) {
    cityFilter.province = { name: { equals: query.province, mode: 'insensitive' } }
  }
  if (query.city) {
    cityFilter.name = { equals: query.city, mode: 'insensitive' }
  }
  if (query.province || query.city) {
    where.city = cityFilter
  }

  const search = query.search?.trim()
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { city: { name: { contains: search, mode: 'insensitive' } } },
      { city: { province: { name: { contains: search, mode: 'insensitive' } } } },
    ]
  }

  const sort = (query.sort && query.sort in sortOrders ? query.sort : 'rating_desc') as SchoolSort
  const total = await prisma.drivingSchool.count({ where })
  const totalPages = Math.max(1, Math.ceil(total / SCHOOLS_PER_PAGE))
  const page = Math.min(Math.max(1, query.page || 1), totalPages)

  const schools = await prisma.drivingSchool.findMany({
    where,
    orderBy: [...sortOrders[sort], { id: 'asc' }],
    skip: (page - 1) * SCHOOLS_PER_PAGE,
    take: SCHOOLS_PER_PAGE,
    select: schoolSummarySelect,
  })

  return { schools: schools.map(toSchoolSummary), total, page, totalPages }
}

export const getSchoolsPage = unstable_cache(querySchoolsPage, ['schools-page'], {
  revalidate: PUBLIC_REVALIDATE_SECONDS,
  tags: [SCHOOLS_CACHE_TAG],
})

// Ciudades con al menos una autoescuela activa en la provincia (por nombre), para el filtro.
export const getCityNamesWithSchools = unstable_cache(
  async (provinceName: string) => {
    const cities = await prisma.city.findMany({
      where: {
        isActive: true,
        province: { name: { equals: provinceName, mode: 'insensitive' } },
        schools: { some: { isActive: true } },
      },
      orderBy: { name: 'asc' },
      select: { name: true },
    })
    return cities.map(city => city.name)
  },
  ['city-names-with-schools'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [SCHOOLS_CACHE_TAG] }
)

export const getActiveSchoolsCount = unstable_cache(
  async () => prisma.drivingSchool.count({ where: { isActive: true } }),
  ['active-schools-count'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [SCHOOLS_CACHE_TAG] }
)

export const getCachedActiveProvinces = unstable_cache(
  async () => getActiveProvinces(),
  ['active-provinces'],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [SCHOOLS_CACHE_TAG] }
)

export async function getDatabaseStats() {
  const [provinces, cities, schools] = await Promise.all([
    prisma.province.count({ where: { isActive: true } }),
    prisma.city.count({ where: { isActive: true } }),
    prisma.drivingSchool.count({ where: { isActive: true } }),
  ])

  return { provinces, cities, schools }
}

export { prisma }
