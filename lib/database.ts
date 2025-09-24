import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Funciones optimizadas para consultas frecuentes

export async function getActiveProvinces() {
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

  // Transform to match Province interface
  return provinces.map(province => ({
    id: province.id,
    name: province.name,
    slug: province.slug,
    description: province.description || undefined,
    imageUrl: province.imageUrl || undefined,
    schoolsCount: province._count.schools, // Usar el conteo real
  }))
}

export async function getActiveCitiesByProvince(provinceId: string) {
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
    schoolsCount: city._count.schools, // Usar el conteo real
  }))
}

export async function getFeaturedSchools(limit: number = 8) {
  const schools = await prisma.drivingSchool.findMany({
    where: { 
      isActive: true
    },
    orderBy: [
      { isFeatured: 'desc' },
      { rating: 'desc' },
      { sortOrder: 'asc' }
    ],
    take: limit,
    include: {
      city: {
        select: {
          name: true,
          province: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  // Transform to match DrivingSchool interface
  return schools.map(school => ({
    ...school,
    city: school.city.name,
    province: school.city.province.name,
    hours: school.hours || undefined,
  }))
}

export async function getSchoolsByProvinceSlug(provinceSlug: string, limit: number = 20) {
  try {
    const province = await prisma.province.findUnique({
      where: { slug: provinceSlug },
    })

    if (!province) {
      return []
    }

    const schools = await prisma.drivingSchool.findMany({
      where: { 
        provinceId: province.id,
        isActive: true 
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { rating: 'desc' },
      ],
      take: limit,
      include: {
        city: {
          select: {
            name: true,
            province: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    // Transform to match DrivingSchool interface
    return schools.map(school => ({
      ...school,
      city: school.city.name,
      province: school.city.province.name,
      hours: school.hours || undefined,
    }))
  } catch (error) {
    console.error(`Error fetching schools for province ${provinceSlug}:`, error)
    return []
  }
}

export async function getSchoolsByProvince(provinceId: string, limit: number = 20) {
  const schools = await prisma.drivingSchool.findMany({
    where: { 
      provinceId,
      isActive: true 
    },
    orderBy: [
      { isFeatured: 'desc' },
      { sortOrder: 'asc' },
      { rating: 'desc' },
    ],
    take: limit,
    include: {
      city: {
        select: {
          name: true,
          province: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  // Transform to match DrivingSchool interface
  return schools.map(school => ({
    ...school,
    city: school.city.name,
    province: school.city.province.name,
    hours: school.hours || undefined,
  }))
}

export async function getSchoolsByCity(cityId: string, limit: number = 20) {
  const schools = await prisma.drivingSchool.findMany({
    where: { 
      cityId,
      isActive: true 
    },
    orderBy: [
      { isFeatured: 'desc' },
      { sortOrder: 'asc' },
      { rating: 'desc' },
    ],
    take: limit,
    include: {
      city: {
        select: {
          name: true,
          province: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  // Transform to match DrivingSchool interface
  return schools.map(school => ({
    ...school,
    city: school.city.name,
    province: school.city.province.name,
    hours: school.hours || undefined,
  }))
}

export async function getSchoolBySlug(slug: string) {
  return prisma.drivingSchool.findUnique({
    where: { slug },
    include: {
      city: {
        select: {
          name: true,
          province: {
            select: {
              name: true,
            },
          },
        },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      courses: {
        where: { isActive: true },
        orderBy: { name: 'asc' },
      },
    },
  })
}

export async function searchSchools(query: string, filters?: {
  provinceId?: string
  cityId?: string
  minRating?: number
  maxPrice?: number
  minPrice?: number
}) {
  const where: any = {
    isActive: true,
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { address: { contains: query, mode: 'insensitive' } },
    ],
  }

  if (filters?.provinceId) {
    where.provinceId = filters.provinceId
  }

  if (filters?.cityId) {
    where.cityId = filters.cityId
  }

  if (filters?.minRating) {
    where.rating = { gte: filters.minRating }
  }

  if (filters?.maxPrice) {
    where.priceMax = { lte: filters.maxPrice }
  }

  if (filters?.minPrice) {
    where.priceMin = { gte: filters.minPrice }
  }

  const schools = await prisma.drivingSchool.findMany({
    where,
    orderBy: [
      { isFeatured: 'desc' },
      { rating: 'desc' },
      { reviewsCount: 'desc' },
    ],
    take: 50,
    include: {
      city: {
        select: {
          name: true,
          province: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  // Transform to match DrivingSchool interface
  return schools.map(school => ({
    ...school,
    city: school.city.name,
    province: school.city.province.name,
    hours: school.hours || undefined,
  }))
}

export async function getSchoolBySlugFromDB(slug: string) {
  try {
    const school = await prisma.drivingSchool.findUnique({
      where: { slug },
      include: {
        city: {
          select: {
            name: true,
            province: {
              select: {
                name: true,
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
        },
      },
    })

    if (!school) return null

    return {
      ...school,
      city: school.city.name,
      province: school.city.province.name,
      hours: school.hours || undefined,
    }
  } catch (error) {
    console.error(`Error fetching school ${slug}:`, error)
    return null
  }
}

export async function getProvinceBySlugFromDB(slug: string) {
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
          },
        },
      },
    })

    if (!province) return null

    return {
      ...province,
      description: province.description || undefined,
      imageUrl: province.imageUrl || undefined,
    }
  } catch (error) {
    console.error(`Error fetching province ${slug}:`, error)
    return null
  }
}

export async function getAllSchoolsFromDB() {
  const schools = await prisma.drivingSchool.findMany({
    where: { isActive: true },
    include: {
      city: {
        select: {
          name: true,
          province: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: [
      { isFeatured: 'desc' },
      { sortOrder: 'asc' },
      { rating: 'desc' },
    ],
  })

  // Transform to match DrivingSchool interface
  return schools.map(school => ({
    ...school,
    city: school.city.name,
    province: school.city.province.name,
    hours: school.hours || undefined,
  }))
}

// Function to get city by province and city slugs
export async function getCityBySlugFromDB(provinceSlug: string, citySlug: string) {
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
}

// Function to get schools by province and city slugs
export async function getSchoolsByCitySlug(provinceSlug: string, citySlug: string, limit: number = 20) {
  try {
    const city = await prisma.city.findFirst({
      where: {
        slug: citySlug,
        isActive: true,
        province: {
          slug: provinceSlug,
          isActive: true
        }
      }
    })

    if (!city) {
      return []
    }

    const schools = await prisma.drivingSchool.findMany({
      where: { 
        cityId: city.id,
        isActive: true 
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { rating: 'desc' },
      ],
      take: limit,
      include: {
        city: {
          select: {
            name: true,
            province: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    // Transform to match DrivingSchool interface
    return schools.map(school => ({
      ...school,
      city: school.city.name,
      province: school.city.province.name,
      hours: school.hours || undefined,
    }))
  } catch (error) {
    console.error(`Error fetching schools for city ${citySlug} in province ${provinceSlug}:`, error)
    return []
  }
}

export async function getDatabaseStats() {
  const [provinces, cities, schools] = await Promise.all([
    prisma.province.count({ where: { isActive: true } }),
    prisma.city.count({ where: { isActive: true } }),
    prisma.drivingSchool.count({ where: { isActive: true } }),
  ])

  return { provinces, cities, schools }
}

export { prisma }
