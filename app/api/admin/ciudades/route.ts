import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const cities = await prisma.city.findMany({
      include: {
        province: true,
      },
      orderBy: [
        { province: { sortOrder: "asc" } },
        { sortOrder: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({ success: true, data: cities });
  } catch (error: any) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error.message || "Error interno del servidor al obtener ciudades.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug, provinceId, sortOrder } = await request.json();

    if (!name || !slug || !provinceId) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan campos requeridos: nombre, slug y provincia.",
        },
        { status: 400 }
      );
    }

    // Verificar que la provincia existe
    const province = await prisma.province.findUnique({
      where: { id: provinceId },
    });

    if (!province) {
      return NextResponse.json(
        { success: false, error: "La provincia especificada no existe." },
        { status: 400 }
      );
    }

    // Verificar que no existe otra ciudad con el mismo slug en la misma provincia
    const existingCity = await prisma.city.findFirst({
      where: {
        slug: slug,
        provinceId: provinceId,
      },
    });

    if (existingCity) {
      return NextResponse.json(
        {
          success: false,
          error: "Ya existe una ciudad con ese slug en esta provincia.",
        },
        { status: 400 }
      );
    }

    const city = await prisma.city.create({
      data: {
        name,
        slug,
        provinceId,
        sortOrder: sortOrder || 1,
        schoolsCount: 0,
        isActive: true,
      },
      include: {
        province: true,
      },
    });

    return NextResponse.json({ success: true, data: city });
  } catch (error: any) {
    console.error("Error creating city:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error.message || "Error interno del servidor al crear la ciudad.",
      },
      { status: 500 }
    );
  }
}
