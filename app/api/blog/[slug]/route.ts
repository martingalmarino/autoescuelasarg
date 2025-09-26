import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

// GET - Obtener artículo por slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.blogArticle.findUnique({
      where: {
        slug: params.slug,
        isPublished: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    // Obtener artículos relacionados (misma categoría, excluyendo el actual)
    const relatedArticles = await prisma.blogArticle.findMany({
      where: {
        isPublished: true,
        category: article.category,
        id: { not: article.id },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        author: true,
        readingTime: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({
      article,
      relatedArticles,
    });
  } catch (error) {
    console.error("Error fetching blog article by slug:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
