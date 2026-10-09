import Link from "next/link";

interface BlogListArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  category: string | null;
  isFeatured: boolean;
  readingTime: number | null;
  publishedAt: Date | null;
  createdAt: Date;
}

export default function BlogArticleList({ articles }: { articles: BlogListArticle[] }) {
  if (articles.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay artículos publicados</h3>
          <p className="text-gray-500 mb-4">
            Aún no se han publicado artículos en el blog. Vuelve pronto para ver contenido nuevo.
          </p>
          <a
            href="/admin/blog/nuevo"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear primer artículo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Últimos artículos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {article.featuredImage && (
                <div className="relative h-48 w-full">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  {article.category && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {article.category}
                    </span>
                  )}
                  {article.isFeatured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                      Destacado
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('es-AR')}</span>
                  {article.readingTime && (
                    <span>{article.readingTime} min</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
