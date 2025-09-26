"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Clock, User, Share2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogArticle } from "@/lib/types";
import BlogCTA from "./BlogCTA";
import SafeHTML from "./SafeHTML";

interface BlogContentProps {
  article: BlogArticle;
  relatedArticles?: BlogArticle[];
  className?: string;
}

export default function BlogContent({
  article,
  relatedArticles = [],
  className = "",
}: BlogContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || "",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href);
      // Aquí podrías mostrar un toast de confirmación
    }
  };

  if (!mounted) {
    return <div>Cargando...</div>;
  }

  return (
    <article className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Header del artículo */}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {article.category && (
            <Badge variant="secondary" className="text-xs sm:text-sm">
              {article.category}
            </Badge>
          )}
          {article.isFeatured && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs sm:text-sm">
              Destacado
            </Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {article.author}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            {article.readingTime && (
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {article.readingTime} min de lectura
              </span>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center self-start sm:self-auto"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
        </div>
      </header>

      {/* Imagen destacada */}
      {article.featuredImage && (
        <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full mb-6 sm:mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 896px"
          />
        </div>
      )}

      {/* Contenido del artículo */}
      <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-6 sm:mb-8">
        <SafeHTML content={article.content} />
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-3">
            <Tag className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Etiquetas:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* CTA final */}
      <BlogCTA
        variant="featured"
        title="¿Listo para obtener tu licencia de conducir?"
        description="Encontrá la autoescuela perfecta cerca de tu ubicación. Miles de opciones verificadas con calificaciones reales."
        buttonText="Buscar autoescuelas"
        buttonLink="/autoescuelas"
      />

      {/* Artículos relacionados */}
      {relatedArticles.length > 0 && (
        <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Artículos relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedArticles.map((relatedArticle) => (
              <div key={relatedArticle.id} className="space-y-3">
                {relatedArticle.featuredImage && (
                  <div className="relative h-32 sm:h-40 w-full rounded-lg overflow-hidden">
                    <Image
                      src={relatedArticle.featuredImage}
                      alt={relatedArticle.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
                    />
                  </div>
                )}
                <div>
                  {relatedArticle.category && (
                    <Badge variant="secondary" className="text-xs mb-2">
                      {relatedArticle.category}
                    </Badge>
                  )}
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm sm:text-base">
                    <a
                      href={`/blog/${relatedArticle.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {relatedArticle.title}
                    </a>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                    {relatedArticle.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center text-xs text-gray-500 gap-2 sm:gap-3">
                    <span>
                      {formatDate(
                        relatedArticle.publishedAt || relatedArticle.createdAt
                      )}
                    </span>
                    {relatedArticle.readingTime && (
                      <span>{relatedArticle.readingTime} min</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
