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
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Header del artículo */}
      <header className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          {article.category && (
            <Badge variant="secondary">{article.category}</Badge>
          )}
          {article.isFeatured && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600">
              Destacado
            </Badge>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
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
            className="flex items-center"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
        </div>
      </header>

      {/* Imagen destacada */}
      {article.featuredImage && (
        <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Contenido del artículo */}
      <div className="prose prose-lg max-w-none mb-8">
        <SafeHTML content={article.content} />
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-8">
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
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Artículos relacionados
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <div key={relatedArticle.id} className="space-y-3">
                {relatedArticle.featuredImage && (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden">
                    <Image
                      src={relatedArticle.featuredImage}
                      alt={relatedArticle.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  {relatedArticle.category && (
                    <Badge variant="secondary" className="text-xs mb-2">
                      {relatedArticle.category}
                    </Badge>
                  )}
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                    <a
                      href={`/blog/${relatedArticle.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {relatedArticle.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {relatedArticle.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-3">
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
