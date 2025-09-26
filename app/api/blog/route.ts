import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

// GET - Listar artículos publicados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
    };

    if (category) {
      where.category = category;
    }

    if (featured !== null) {
      where.isFeatured = featured === "true";
    }

    const [articles, total] = await Promise.all([
      prisma.blogArticle.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          tags: true,
          author: true,
          readingTime: true,
          isFeatured: true,
          publishedAt: true,
          createdAt: true,
        },
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
    console.error("Error fetching published blog articles:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
