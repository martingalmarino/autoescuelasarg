import { prisma } from "@/lib/database";
import { buildMetadata } from "@/lib/seo";
import BlogArticleList from "./BlogArticleList";

// ISR: 24 h. El admin invalida la caché al publicar o editar artículos.
export const revalidate = 86400;

export const metadata = buildMetadata({
  titleVariants: ["Blog: consejos para aprender a manejar"],
  description:
    "Guías y consejos para aprender a manejar, perderle el miedo al tránsito, elegir autoescuela y aprobar el examen para sacar tu registro de conducir.",
  path: "/blog",
});

export default async function BlogPage() {
  const articles = await prisma.blogArticle.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      category: true,
      isFeatured: true,
      readingTime: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog de Autoescuelas
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Consejos, guías y noticias para ayudarte a obtener tu licencia de
              conducir
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Consejos de manejo
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Guías paso a paso
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Noticias del sector
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                Tips para el examen
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <BlogArticleList articles={articles} />
        </div>
      </section>
    </div>
  );
}
