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
      if (!response.ok) throw new Error("Error al cargar artículos");

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
      setLoading(true);

      // Cargar artículo destacado
      const featuredData = await fetchArticles(1, "", true);
      if (featuredData.articles.length > 0) {
        setFeaturedArticle(featuredData.articles[0]);
      }

      // Cargar artículos regulares
      const regularData = await fetchArticles(currentPage, selectedCategory);
      setArticles(regularData.articles);
      setPagination(regularData.pagination);

      setLoading(false);
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
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <div>Cargando artículos...</div>;
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
            <p className="text-gray-500 text-lg">No se encontraron artículos</p>
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
