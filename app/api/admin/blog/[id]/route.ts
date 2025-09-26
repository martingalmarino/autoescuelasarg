import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

// GET - Obtener artículo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.blogArticle.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching blog article:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar artículo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verificar que el artículo existe
    const existingArticle = await prisma.blogArticle.findUnique({
      where: { id: params.id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    // Si se está cambiando el slug, verificar que sea único
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await prisma.blogArticle.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Ya existe un artículo con este slug" },
          { status: 400 }
        );
      }
    }

    const article = await prisma.blogArticle.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(isPublished !== undefined && { isPublished }),
        ...(publishedAt !== undefined && {
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags }),
        ...(author !== undefined && { author }),
        ...(readingTime !== undefined && { readingTime }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating blog article:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar artículo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.blogArticle.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    await prisma.blogArticle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Artículo eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting blog article:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
