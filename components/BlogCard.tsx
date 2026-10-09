"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogArticle } from "@/lib/types";

interface BlogCardProps {
  article: BlogArticle;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export default function BlogCard({
  article,
  variant = "default",
  className = "",
}: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  if (variant === "compact") {
    return (
      <Link href={`/blog/${article.slug}`} className={`block ${className}`}>
        <Card className="surface-card-hover p-4">
          <div className="flex space-x-3">
            {article.featuredImage && (
              <div className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground line-clamp-2 mb-1">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {article.excerpt}
              </p>
              <div className="flex items-center text-xs text-muted-foreground space-x-3">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
                {article.readingTime && (
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.readingTime} min
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/blog/${article.slug}`} className={`block ${className}`}>
        <Card className="surface-card-hover overflow-hidden">
          {article.featuredImage && (
            <div className="relative h-64 w-full">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
              />
              {article.isFeatured && (
                <Badge variant="signal" className="absolute top-4 left-4">
                  Destacado
                </Badge>
              )}
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              {article.category && (
                <Badge variant="secondary">{article.category}</Badge>
              )}
              {article.isFeatured && !article.featuredImage && (
                <Badge variant="signal">
                  Destacado
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3 line-clamp-2">
              {article.title}
            </h2>
            <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {article.author}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
                {article.readingTime && (
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readingTime} min
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/blog/${article.slug}`} className={`block ${className}`}>
      <Card className="surface-card-hover overflow-hidden">
        {article.featuredImage && (
          <div className="relative h-48 w-full">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            {article.category && (
              <Badge variant="secondary">{article.category}</Badge>
            )}
            {article.isFeatured && (
              <Badge variant="signal">
                Destacado
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-bold leading-snug text-foreground mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              {article.readingTime && (
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readingTime} min
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
