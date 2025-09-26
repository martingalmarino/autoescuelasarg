import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

// GET - Listar artículos de blog
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const published = searchParams.get("published");
    const featured = searchParams.get("featured");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (published !== null) {
      where.isPublished = published === "true";
    }

    if (featured !== null) {
      where.isFeatured = featured === "true";
    }

    const [articles, total] = await Promise.all([
      prisma.blogArticle.findMany({
        where,
        orderBy: [
          { isFeatured: "desc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.blogArticle.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blog articles:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo artículo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      metaTitle,
      metaDescription,
      isPublished,
      publishedAt,
      category,
      tags,
      author,
      readingTime,
      isFeatured,
      sortOrder,
    } = body;

    // Validaciones básicas
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Título, slug y contenido son requeridos" },
        { status: 400 }
      );
    }

    // Verificar que el slug sea único
    const existingArticle = await prisma.blogArticle.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: "Ya existe un artículo con este slug" },
        { status: 400 }
      );
    }

    const article = await prisma.blogArticle.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        metaTitle,
        metaDescription,
        isPublished: isPublished || false,
        publishedAt: isPublished
          ? publishedAt
            ? new Date(publishedAt)
            : new Date()
          : null,
        category,
        tags: tags || [],
        author: author || "Autoescuelas.ar",
        readingTime,
        isFeatured: isFeatured || false,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating blog article:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
