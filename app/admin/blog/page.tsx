"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchArticles = async (page = 1) => {
    try {
      const response = await fetch(`/api/admin/blog?page=${page}&limit=10`);
      if (!response.ok) throw new Error("Error al cargar artículos");

      const data: BlogResponse = await response.json();
      setArticles(data.articles);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés eliminar este artículo?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchArticles(currentPage);
      } else {
        alert("Error al eliminar el artículo");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Error al eliminar el artículo");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Gestión de Blog</h1>
        </div>
        <div className="text-center py-12">
          <p>Cargando artículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestión de Blog</h1>
        <Link href="/admin/blog/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo artículo
          </Button>
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {pagination.total}
          </div>
          <div className="text-sm text-gray-600">Total artículos</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {articles.filter((a) => a.isPublished).length}
          </div>
          <div className="text-sm text-gray-600">Publicados</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {articles.filter((a) => !a.isPublished).length}
          </div>
          <div className="text-sm text-gray-600">Borradores</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {articles.filter((a) => a.isFeatured).length}
          </div>
          <div className="text-sm text-gray-600">Destacados</div>
        </Card>
      </div>

      {/* Lista de artículos */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Artículos</h2>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No hay artículos creados</p>
              <Link href="/admin/blog/nuevo">
                <Button>Crear primer artículo</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {article.title}
                        </h3>
                        <div className="flex space-x-1">
                          {article.isPublished ? (
                            <Badge className="bg-green-100 text-green-800">
                              Publicado
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Borrador</Badge>
                          )}
                          {article.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Destacado
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt || "Sin resumen"}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {article.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                        {article.category && (
                          <span className="flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            {article.category}
                          </span>
                        )}
                        {article.readingTime && (
                          <span>{article.readingTime} min</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {article.isPublished && (
                        <Link href={`/blog/${article.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/blog/${article.id}/editar`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Paginación */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <span className="text-sm text-gray-600">
            Página {currentPage} de {pagination.pages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.pages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
