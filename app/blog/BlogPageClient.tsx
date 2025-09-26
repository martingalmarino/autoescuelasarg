"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BlogCard from "@/components/BlogCard";
import { BlogArticle } from "@/lib/types";

interface BlogResponse {
  articles: BlogArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function BlogPageClient() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<BlogArticle | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const categories = [
    "Consejos",
    "Guías",
    "Noticias",
    "Tips",
    "Exámenes",
    "Regulaciones",
  ];

  const fetchArticles = async (page = 1, category = "", featured = false) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (category) params.append("category", category);
      if (featured) params.append("featured", "true");

      const response = await fetch(`/api/blog?${params}`);
      if (!response.ok) {
        console.error("API response not ok:", response.status, response.statusText);
        throw new Error(`Error al cargar artículos: ${response.status}`);
      }

      const data: BlogResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching articles:", error);
      return {
        articles: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Cargar artículos regulares (incluyendo destacados)
        const regularData = await fetchArticles(currentPage, selectedCategory);
        setArticles(regularData.articles);
        setPagination(regularData.pagination);

        // Si hay artículos destacados, tomar el primero
        const featured = regularData.articles.find(article => article.isFeatured);
        if (featured) {
          setFeaturedArticle(featured);
        } else if (regularData.articles.length > 0) {
          // Si no hay destacados, tomar el primero
          setFeaturedArticle(regularData.articles[0]);
        }

      } catch (error) {
        console.error('Error loading blog data:', error);
        setError('Error al cargar los artículos del blog');
        setArticles([]);
        setPagination({ page: 1, limit: 10, total: 0, pages: 0 });
        setFeaturedArticle(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar búsqueda si es necesario
    console.log("Search:", searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setError(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Cargando artículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar el blog</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Filtros y búsqueda */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Artículo destacado */}
      {featuredArticle && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Artículo destacado
          </h2>
          <BlogCard article={featuredArticle} variant="featured" />
        </div>
      )}

      {/* Grid de artículos */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory
              ? `Artículos de ${selectedCategory}`
              : "Últimos artículos"}
          </h2>
          <span className="text-sm text-gray-500">
            {pagination.total} artículos
          </span>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
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
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          {[...Array(pagination.pages)].map((_, i) => {
            const page = i + 1;
            const isCurrentPage = page === currentPage;
            const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
            const isFirstOrLast = page === 1 || page === pagination.pages;

            if (!isNearCurrentPage && !isFirstOrLast) {
              if (page === 2 && currentPage > 4) {
                return (
                  <span key={page} className="px-2">
                    ...
                  </span>
                );
              }
              if (
                page === pagination.pages - 1 &&
                currentPage < pagination.pages - 3
              ) {
                return (
                  <span key={page} className="px-2">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <Button
                key={page}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-10"
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.pages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
